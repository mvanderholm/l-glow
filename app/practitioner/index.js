import { View, Text, StyleSheet, Pressable, ScrollView, ActivityIndicator, TextInput, useWindowDimensions } from 'react-native';
import { useState, useEffect, useRef } from 'react';
import { useLocalSearchParams } from 'expo-router';
import { useTheme } from '../../context/ThemeContext';
import { notify, confirmAsync } from '../../components/practitioner/webSafeAlert';
import { card } from '../../theme/index';
import { supabase } from '../../config/supabase';
import { SECTIONS, sectionProgress } from '../intake';
import { DOSHA_COLORS } from '../../components/DoshaWheel';
import { tongueSteps, tongueSignList } from '../../data/content/tongueCheck';
import { loadMessages, sendMessageAsPractitioner } from '../../data/user/messages';

// Practitioner "Clients" screen — v2, still built ahead of the real
// conversation with Thea about what she wants to see (see roadmap #30 Phase
// 2). Shows everything the app has on a consented client (assessment
// results, check-in history, journal) plus a private follow-up notes log
// Thea writes herself. Deliberately does NOT generate suggested follow-up
// actions or clinical guidance — that's fabricating exactly the kind of
// content CLAUDE.md's authorship rules forbid. The "needs attention"
// flagging below is limited to objective, computed facts (staleness, a
// numeric trend, incompleteness) — descriptive, not diagnostic. Access is
// enforced by RLS; the role check itself lives in the parent _layout.js,
// gating every /practitioner/* screen, not just this one.

function cap(s) {
  return s ? s.charAt(0).toUpperCase() + s.slice(1) : s;
}

// Prefers a first/last name if either is on file, then falls back to
// display_name, then email — same fallback chain used everywhere a
// practitioner sees a client's name. Exported for dashboard.js/inbox.js to
// share instead of each keeping its own copy. Aug 25 2026, Matt's ask:
// client cards showed display_name/email even when a real name existed.
export function clientDisplayName(client, fallback = 'Unnamed client') {
  const full = [client?.first_name, client?.last_name].filter(Boolean).join(' ');
  return full || client?.display_name || client?.email || fallback;
}

const PRAKRITI_TIER_LABELS = { foundation: 'Foundation', level2: 'Level 2', level3: 'Level 3' };
const VIKRITI_TIER_LABELS = { level1: 'Check Your Signals', level2: 'Pattern Finder', level3: 'Your Story' };

// Plain-text Q&A dump for a single tier completion, same "select and copy"
// spirit as buildSessionSummary() in data/user/storage.js — no new
// dependency (no expo-clipboard/expo-sharing installed, and RN's Share API
// is fragile on web), Thea just selects the text block and copies it.
function formatResponseExport(clientName, assessmentLabel, tierLabel, dateValue, answers) {
  const lines = [];
  lines.push(tierLabel ? `L. GLOW · ${assessmentLabel} — ${tierLabel}` : `L. GLOW · ${assessmentLabel}`);
  lines.push(clientName);
  lines.push(new Date(dateValue).toLocaleDateString(undefined, { dateStyle: 'long' }));
  lines.push('');
  for (const a of answers ?? []) {
    lines.push(a.section ? `[${a.section}] ${a.prompt}` : a.prompt);
    if (a.freeText !== undefined) {
      lines.push(a.freeText ? `  "${a.freeText}"` : '  (skipped)');
    } else {
      lines.push(`  ${(a.selectedLabels ?? []).join('; ')}`);
    }
    lines.push('');
  }
  return lines.join('\n');
}

// Tongue Check has no `answers` jsonb blob (unlike Prakriti/Vikriti/the new
// Dosha/Guna/Agni columns) — it stores real per-question values directly as
// columns (shape/size/color/coating/signs), because those columns already
// existed before this "show every answer" pattern did. This adapter maps
// those stored signal strings back to the option labels tongue-check.js
// actually showed the client, so ResponseEntry can render it the same way
// as everything else.
function buildTongueAnswers(row) {
  const answers = tongueSteps.map(step => {
    const stored = row[step.id];
    const opt = step.options.find(o => (o.signal ?? 'unclear') === stored);
    return { prompt: step.prompt, selectedLabels: [opt ? opt.label : (stored || '—')] };
  });
  const signLabels = (row.signs ?? []).map(id => tongueSignList.find(s => s.id === id)?.label ?? id);
  answers.push({ prompt: 'Anything else noticed?', selectedLabels: signLabels.length ? signLabels : ['None selected'] });
  return answers;
}

function fieldDisplayValue(value) {
  if (Array.isArray(value)) {
    if (value.length === 0) return '—';
    if (value.length === 1 && value[0] === 'skip') return 'Skipped';
    return value.filter(v => v !== 'skip').join(', ') || '—';
  }
  if (typeof value === 'boolean') return value ? 'Yes' : 'No';
  if (value === 'skip') return 'Skipped';
  if (!value) return '—';
  return String(value);
}

// Objective, computed signals only — no invented clinical judgment.
// checkins must already be sorted newest-first (and, since Aug 25 2026,
// newest-saved-first within a date too — a client can have more than one
// check-in per day now). Exported for the Dashboard tab (dashboard.js),
// which needs the same "needs attention" logic against its own client
// query rather than duplicating it.
export function computeAttention(checkins = [], intakeData) {
  const reasons = [];

  if (checkins.length === 0) {
    reasons.push('No check-ins yet');
  } else {
    const daysSince = Math.floor((Date.now() - new Date(checkins[0].date + 'T00:00:00').getTime()) / 86400000);
    if (daysSince >= 10) reasons.push(`No check-in in ${daysSince} days`);
  }

  // Collapse to one (the latest) check-in per day before trending — without
  // this, a day with several check-ins would count for more than a day
  // with one in a "last 3 days vs prior 3 days" comparison.
  const byDay = [];
  const seenDates = new Set();
  for (const ci of checkins) {
    if (seenDates.has(ci.date)) continue;
    seenDates.add(ci.date);
    byDay.push(ci);
  }

  if (byDay.length >= 6) {
    const avgOf = list => list.reduce((sum, c) => sum + (c.physical + c.mental + c.emotional) / 3, 0) / list.length;
    const recent = avgOf(byDay.slice(0, 3));
    const prior = avgOf(byDay.slice(3, 6));
    if (recent <= prior - 0.5) reasons.push('Trending down recently');
  }

  if (!intakeData) {
    reasons.push('Intake form not started');
  } else {
    const totalFilled = SECTIONS.reduce((sum, sec) => sum + (sectionProgress(sec, intakeData)?.filled || 0), 0);
    const totalFields = SECTIONS.reduce((sum, sec) => sum + (sectionProgress(sec, intakeData)?.total || 0), 0);
    if (totalFields > 0 && totalFilled < totalFields) reasons.push('Intake form incomplete');
  }

  return reasons;
}

function ClientList({ colors: c, onSelect, selectedId, initialClientId }) {
  const [clients, setClients] = useState(null);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');
  const [attentionOnly, setAttentionOnly] = useState(false);

  useEffect(() => {
    supabase
      .from('users')
      .select('id, email, first_name, last_name, display_name, deleted_at, checkins(date, physical, mental, emotional, saved_at), intake_forms(data), dosha_results(taken_at)')
      .eq('consented_to_practitioner_view', true)
      .eq('role', 'user')
      .order('date', { foreignTable: 'checkins', ascending: false })
      .order('saved_at', { foreignTable: 'checkins', ascending: false })
      .then(({ data, error }) => {
        if (error) { setError(error.message); return; }
        const withAttention = (data ?? []).map(client => {
          const intakeRow = Array.isArray(client.intake_forms) ? client.intake_forms[0] : client.intake_forms;
          const reasons = computeAttention(client.checkins ?? [], intakeRow?.data);
          return { ...client, attentionReasons: reasons };
        });
        withAttention.sort((a, b) => b.attentionReasons.length - a.attentionReasons.length);
        setClients(withAttention);
      });
  }, []);

  // Deep-link support for the Dashboard tab's activity feed — jumping here
  // with ?clientId=... auto-opens that client once the list finishes
  // loading, same client object shape onSelect always uses.
  useEffect(() => {
    if (!initialClientId || !clients) return;
    const match = clients.find(cl => cl.id === initialClientId);
    if (match) onSelect(match);
  }, [initialClientId, clients]);

  // Roadmap #53 follow-up — "are people getting lost after signup," scoped
  // to what a practitioner can actually see. RLS only exposes dosha_results/
  // checkins for consented clients, so this is a funnel across *consented*
  // clients, not every signup — labeled as such below rather than presented
  // as the full picture. supabase/queries/onboarding_funnel.sql has the real
  // full-population version (run in the SQL Editor, bypasses RLS).
  const funnel = clients && {
    total: clients.length,
    dosha: clients.filter(c => (c.dosha_results ?? []).length > 0).length,
    checkin: clients.filter(c => (c.checkins ?? []).length > 0).length,
  };

  if (error) {
    return (
      <View style={s.centerPad}>
        <Text style={[s.emptyText, { color: c.textMuted }]}>
          Couldn't load clients — {error}
        </Text>
      </View>
    );
  }

  if (!clients) {
    return <View style={s.centerPad}><ActivityIndicator color={c.accent} /></View>;
  }

  if (clients.length === 0) {
    return (
      <View style={s.centerPad}>
        <Text style={[s.emptyText, { color: c.textMuted }]}>
          No clients have consented to sharing their data yet.
        </Text>
      </View>
    );
  }

  const q = search.trim().toLowerCase();
  const filtered = clients.filter(client => {
    if (attentionOnly && client.attentionReasons.length === 0) return false;
    if (!q) return true;
    return clientDisplayName(client, '').toLowerCase().includes(q) || (client.email || '').toLowerCase().includes(q);
  });

  return (
    <ScrollView contentContainerStyle={{ padding: 20 }} showsVerticalScrollIndicator={false}>
      {funnel && (
        <View style={[s.funnelCard, { backgroundColor: c.surface, ...card }]}>
          <Text style={[s.funnelLabel, { color: c.textMuted }]}>Getting started · consented clients</Text>
          <View style={{ flexDirection: 'row', gap: 10, marginTop: 8 }}>
            <View style={s.funnelStat}>
              <Text style={[s.funnelStatValue, { color: c.text }]}>{funnel.dosha}/{funnel.total}</Text>
              <Text style={[s.funnelStatLabel, { color: c.textMuted }]}>Took the quiz</Text>
            </View>
            <View style={s.funnelStat}>
              <Text style={[s.funnelStatValue, { color: c.text }]}>{funnel.checkin}/{funnel.total}</Text>
              <Text style={[s.funnelStatLabel, { color: c.textMuted }]}>Have checked in</Text>
            </View>
          </View>
        </View>
      )}
      <TextInput
        style={[s.searchInput, { color: c.text, backgroundColor: c.surfaceAlt, borderColor: c.border }]}
        value={search}
        onChangeText={setSearch}
        placeholder="Search clients…"
        placeholderTextColor={c.textMuted}
      />
      <Pressable
        style={[s.attentionToggle, { borderColor: attentionOnly ? c.accent : c.border, backgroundColor: attentionOnly ? (c.accent + '18') : 'transparent' }]}
        onPress={() => setAttentionOnly(v => !v)}
      >
        <Text style={[s.attentionToggleText, { color: attentionOnly ? c.accent : c.textMuted }]}>Needs attention only</Text>
      </Pressable>

      {filtered.length === 0 && (
        <Text style={[s.mutedNote, { color: c.textMuted, textAlign: 'center', marginTop: 24 }]}>No clients match.</Text>
      )}

      {filtered.map(client => (
        <Pressable
          key={client.id}
          style={({ pressed }) => [
            s.clientRow,
            { backgroundColor: c.surface, ...card, opacity: pressed ? 0.8 : 1 },
            client.id === selectedId && { borderWidth: 1.5, borderColor: c.accent },
          ]}
          onPress={() => onSelect(client)}
        >
          <Text style={[s.clientName, { color: c.text }]}>{clientDisplayName(client)}</Text>
          {client.email && clientDisplayName(client) !== client.email && (
            <Text style={[s.clientEmail, { color: c.textMuted }]}>{client.email}</Text>
          )}
          {client.deleted_at && (
            <View style={[s.attentionRow, { marginTop: 8 }]}>
              <View style={[s.attentionChip, { backgroundColor: c.textMuted + '22', borderColor: c.textMuted }]}>
                <Text style={[s.attentionChipText, { color: c.textMuted }]}>Deactivated</Text>
              </View>
            </View>
          )}
          {client.attentionReasons.length > 0 && (
            <View style={s.attentionRow}>
              {client.attentionReasons.map(reason => (
                <View key={reason} style={[s.attentionChip, { backgroundColor: c.terracotta ? c.terracotta + '22' : '#C9785522', borderColor: c.terracotta || '#C97855' }]}>
                  <Text style={[s.attentionChipText, { color: c.terracotta || '#C97855' }]}>{reason}</Text>
                </View>
              ))}
            </View>
          )}
        </Pressable>
      ))}
    </ScrollView>
  );
}

function SectionCard({ title, children, colors: c }) {
  return (
    <View style={[s.sectionCard, { backgroundColor: c.surface, ...card }]}>
      <Text style={[s.sectionTitle, { color: c.text }]}>{title}</Text>
      {children}
    </View>
  );
}

function AnswerRow({ label, value, colors: c }) {
  return (
    <View style={s.answerRow}>
      <Text style={[s.answerLabel, { color: c.textMuted }]}>{label}</Text>
      <Text style={[s.answerValue, { color: c.text }]}>{value}</Text>
    </View>
  );
}

function ProfileField({ label, value, onChangeText, colors: c, keyboardType, containerStyle }) {
  return (
    <View style={[{ marginBottom: 10 }, containerStyle]}>
      <Text style={[s.answerLabel, { color: c.textMuted }]}>{label}</Text>
      <TextInput
        style={[s.profileFieldInput, { color: c.text, backgroundColor: c.surfaceAlt, borderColor: c.border }]}
        value={value}
        onChangeText={onChangeText}
        keyboardType={keyboardType}
      />
    </View>
  );
}

// Basic account-profile fields (first/last name, display name, phone,
// address) — separate from the Intake tab's own contact fields (a one-time
// clinical questionnaire, not the same concept; see
// 20260730010000_user_profile_fields.sql for the known overlap and why it's
// not reconciled). Self-contained fetch/edit, same pattern as ManualSection
// below — the parent's `client` prop is a ClientList snapshot that doesn't
// refresh after an edit here, so this owns its own copy.
function ProfileSection({ clientId, clientName, colors: c }) {
  const [profile, setProfile] = useState(null); // null = loading
  const [draft, setDraft] = useState(null);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [dangerBusy, setDangerBusy] = useState(false);

  useEffect(() => { load(); }, [clientId]);

  async function load() {
    setProfile(null);
    const { data, error } = await supabase.from('users').select('first_name, last_name, display_name, phone, address, city, state, zip, deleted_at').eq('id', clientId).maybeSingle();
    if (error) { setError(error.message); return; }
    setError(null);
    setProfile(data ?? {});
  }

  // Soft delete only — flips deleted_at, which the client's own RLS policies
  // (20260730040000_soft_delete_users.sql) then use to lock them out of
  // sign-in and their own data entirely. Reversible via restore() below;
  // real, permanent removal is a separate, deliberately more manual process
  // (deleting the account from Supabase Auth directly — see the "can I
  // remove user records" conversation this danger zone came out of).
  async function confirmDeactivate() {
    const ok = await confirmAsync(
      'Deactivate this client?',
      `${clientName || 'This client'} will be signed out, won't be able to sign in again, and won't be able to see any of their own data — check-ins, journal, quiz results, everything — until restored. This can be undone from this same screen.`,
      'Deactivate',
    );
    if (ok) deactivate();
  }

  async function deactivate() {
    setDangerBusy(true);
    const { error } = await supabase.from('users').update({ deleted_at: new Date().toISOString() }).eq('id', clientId);
    setDangerBusy(false);
    if (error) { notify('Couldn\'t deactivate', error.message); return; }
    await load();
  }

  async function restore() {
    setDangerBusy(true);
    const { error } = await supabase.from('users').update({ deleted_at: null }).eq('id', clientId);
    setDangerBusy(false);
    if (error) { notify('Couldn\'t restore', error.message); return; }
    await load();
  }

  function startEdit() {
    setDraft({
      first_name: profile.first_name || '', last_name: profile.last_name || '',
      display_name: profile.display_name || '', phone: profile.phone || '', address: profile.address || '',
      city: profile.city || '', state: profile.state || '', zip: profile.zip || '',
    });
    setEditing(true);
  }

  async function save() {
    setSaving(true);
    const payload = {
      first_name: draft.first_name.trim() || null,
      last_name: draft.last_name.trim() || null,
      display_name: draft.display_name.trim() || null,
      phone: draft.phone.trim() || null,
      address: draft.address.trim() || null,
      city: draft.city.trim() || null,
      state: draft.state.trim() || null,
      zip: draft.zip.trim() || null,
    };
    const { error } = await supabase.from('users').update(payload).eq('id', clientId);
    setSaving(false);
    if (error) { notify('Couldn\'t save', error.message); return; }
    setProfile(payload);
    setEditing(false);
  }

  if (error) return <SectionCard title="Profile" colors={c}><Text style={[s.mutedNote, { color: c.textMuted }]}>Couldn't load profile — {error}</Text></SectionCard>;
  if (profile === null) return <View style={s.centerPad}><ActivityIndicator color={c.accent} /></View>;

  return (
    <>
    <SectionCard title="Profile" colors={c}>
      {editing ? (
        <>
          <ProfileField colors={c} label="First name" value={draft.first_name} onChangeText={t => setDraft({ ...draft, first_name: t })} />
          <ProfileField colors={c} label="Last name" value={draft.last_name} onChangeText={t => setDraft({ ...draft, last_name: t })} />
          <ProfileField colors={c} label="Display name" value={draft.display_name} onChangeText={t => setDraft({ ...draft, display_name: t })} />
          <ProfileField colors={c} label="Phone" value={draft.phone} onChangeText={t => setDraft({ ...draft, phone: t })} keyboardType="phone-pad" />
          <ProfileField colors={c} label="Address" value={draft.address} onChangeText={t => setDraft({ ...draft, address: t })} />
          <View style={{ flexDirection: 'row', gap: 10 }}>
            <ProfileField colors={c} label="City" value={draft.city} onChangeText={t => setDraft({ ...draft, city: t })} containerStyle={{ flex: 2, marginBottom: 10 }} />
            <ProfileField colors={c} label="State" value={draft.state} onChangeText={t => setDraft({ ...draft, state: t })} containerStyle={{ flex: 1, marginBottom: 10 }} />
            <ProfileField colors={c} label="Zip" value={draft.zip} onChangeText={t => setDraft({ ...draft, zip: t })} keyboardType="number-pad" containerStyle={{ flex: 1, marginBottom: 10 }} />
          </View>
          <View style={{ flexDirection: 'row', gap: 10, marginTop: 4 }}>
            <Pressable style={[s.addNoteBtn, { flex: 1, backgroundColor: c.accent, marginBottom: 0 }]} onPress={save} disabled={saving}>
              <Text style={s.addNoteBtnText}>{saving ? 'Saving…' : 'Save'}</Text>
            </Pressable>
            <Pressable style={[s.addNoteBtn, { flex: 1, backgroundColor: c.surfaceAlt, marginBottom: 0 }]} onPress={() => setEditing(false)} disabled={saving}>
              <Text style={[s.addNoteBtnText, { color: c.textMuted }]}>Cancel</Text>
            </Pressable>
          </View>
        </>
      ) : (
        <>
          <AnswerRow colors={c} label="First name" value={profile.first_name || '—'} />
          <AnswerRow colors={c} label="Last name" value={profile.last_name || '—'} />
          <AnswerRow colors={c} label="Display name" value={profile.display_name || '—'} />
          <AnswerRow colors={c} label="Phone" value={profile.phone || '—'} />
          <AnswerRow colors={c} label="Address" value={profile.address || '—'} />
          <AnswerRow colors={c} label="City" value={profile.city || '—'} />
          <AnswerRow colors={c} label="State" value={profile.state || '—'} />
          <AnswerRow colors={c} label="Zip" value={profile.zip || '—'} />
          <Pressable onPress={startEdit} style={{ marginTop: 6 }}>
            <Text style={{ color: c.accent, fontFamily: 'Inter_600SemiBold', fontSize: 13 }}>Edit</Text>
          </Pressable>
        </>
      )}
    </SectionCard>

    <View style={[s.sectionCard, { backgroundColor: c.surface, borderWidth: 1, borderColor: c.terracotta || '#C97855' }]}>
      <Text style={[s.sectionTitle, { color: c.terracotta || '#C97855' }]}>Danger zone</Text>
      {profile.deleted_at ? (
        <>
          <Text style={[s.mutedNote, { color: c.textMuted, marginBottom: 12 }]}>
            Deactivated {new Date(profile.deleted_at).toLocaleDateString(undefined, { dateStyle: 'medium' })} — this client can't sign in or see any of their data until restored.
          </Text>
          <Pressable style={[s.addNoteBtn, { backgroundColor: c.accent, alignSelf: 'flex-start', paddingHorizontal: 18, marginBottom: 0 }]} onPress={restore} disabled={dangerBusy}>
            <Text style={s.addNoteBtnText}>{dangerBusy ? 'Restoring…' : 'Restore this client'}</Text>
          </Pressable>
        </>
      ) : (
        <>
          <Text style={[s.mutedNote, { color: c.textMuted, marginBottom: 12 }]}>
            Deactivating signs this client out and blocks their sign-in and access to their own data — check-ins, journal, quiz history, everything. Reversible from this same screen.
          </Text>
          <Pressable style={[s.addNoteBtn, { backgroundColor: c.terracotta || '#C97855', alignSelf: 'flex-start', paddingHorizontal: 18, marginBottom: 0 }]} onPress={confirmDeactivate} disabled={dangerBusy}>
            <Text style={s.addNoteBtnText}>{dangerBusy ? 'Deactivating…' : 'Deactivate this client'}</Text>
          </Pressable>
        </>
      )}
    </View>
    </>
  );
}

// Dosha Breakdown visual — Thea asked for this specifically, "doesn't have
// to be like the venn diagram" (You tab's DoshaWheel). A denser, list-
// appropriate treatment for the practitioner hub: a single proportional
// bar instead of the decorative wheel, reusing the app's existing
// DOSHA_COLORS rather than a new palette, since it's the same three-
// category data the wheel already renders.
function DoshaBar({ scores, colors: c }) {
  const total = (scores.vata + scores.pitta + scores.kapha) || 1;
  const doshas = [
    { key: 'vata', label: 'Vata', pct: Math.round((scores.vata / total) * 100) },
    { key: 'pitta', label: 'Pitta', pct: Math.round((scores.pitta / total) * 100) },
    { key: 'kapha', label: 'Kapha', pct: Math.round((scores.kapha / total) * 100) },
  ];
  return (
    <View style={{ marginTop: 6, marginBottom: 4 }}>
      <View style={{ flexDirection: 'row', height: 10, borderRadius: 5, overflow: 'hidden' }}>
        {doshas.map(d => (
          <View key={d.key} style={{ width: `${d.pct}%`, backgroundColor: DOSHA_COLORS[d.key] }} />
        ))}
      </View>
      <View style={{ flexDirection: 'row', gap: 12, marginTop: 6 }}>
        {doshas.map(d => (
          <Text key={d.key} style={{ fontFamily: 'Inter_500Medium', fontSize: 11.5, color: c.textMuted }}>
            <Text style={{ color: DOSHA_COLORS[d.key] }}>●</Text> {d.label} {d.pct}%
          </Text>
        ))}
      </View>
    </View>
  );
}

// AI-generated guidance — first LLM integration in the app, and the first
// practitioner-only AI content (never shown to the client). Thea's own
// working reference to help prep for a session, not authored content.
// Calls the generate-ai-guidance Edge Function, which holds the Anthropic
// key server-side and does the real practitioner-role authorization check
// — this component trusts nothing client-side, it's just the UI for it.
function AIGuidanceSection({ clientId, assessmentType, tier, colors: c }) {
  const [content, setContent] = useState(null); // null = loading, false = none cached yet
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => { load(); }, [clientId, assessmentType, tier]);

  async function load() {
    setContent(null);
    const { data } = await supabase.from('ai_guidance').select('content')
      .eq('user_id', clientId).eq('assessment_type', assessmentType).eq('tier', tier || 'none')
      .maybeSingle();
    setContent(data?.content ?? false);
  }

  async function generate() {
    setGenerating(true);
    setError(null);
    const { data, error } = await supabase.functions.invoke('generate-ai-guidance', {
      body: { clientId, assessmentType, tier },
    });
    setGenerating(false);
    if (error) {
      // supabase-js only gives a generic "non-2xx status code" message by
      // default — the real reason is JSON in the response body, reachable
      // via error.context (the raw fetch Response) on a FunctionsHttpError.
      let detail = error.message;
      try {
        const body = await error.context?.json();
        if (body?.error) detail = body.error;
      } catch { /* context wasn't JSON — fall back to the generic message */ }
      setError(detail);
      return;
    }
    setContent(data.content);
  }

  if (content === null) return null;

  return (
    <View style={{ marginTop: 6, marginBottom: 10 }}>
      {content ? (
        <View style={[s.aiCard, { backgroundColor: c.surfaceAlt, borderColor: c.border }]}>
          <Text style={[s.aiLabel, { color: c.textMuted }]}>AI-generated — not a diagnosis, for your reference</Text>
          <Text style={[s.aiContent, { color: c.text }]}>{content}</Text>
          <Pressable onPress={generate} disabled={generating}>
            <Text style={[s.aiRegenerate, { color: c.accent }]}>{generating ? 'Regenerating…' : 'Regenerate'}</Text>
          </Pressable>
        </View>
      ) : (
        <Pressable onPress={generate} disabled={generating}>
          <Text style={{ color: c.accent, fontFamily: 'Inter_500Medium', fontSize: 12.5 }}>
            {generating ? 'Generating…' : '+ Generate AI guidance'}
          </Text>
        </Pressable>
      )}
      {error && <Text style={{ color: c.terracotta || '#C97855', fontSize: 12, marginTop: 4 }}>Couldn't generate — {error}</Text>}
    </View>
  );
}

// One assessment-completion entry, collapsed by default (date + score/tier
// summary, tap to expand), since a Level 3 Prakriti/Vikriti completion can
// run 60+ questions. Expanded view shows the raw Q&A plus a read-only
// export text block Thea can select and copy — see formatResponseExport().
// Used for all 6 assessment types now, not just Prakriti/Vikriti — dosha/
// guna/agni rows taken before the `answers` column existed, and any Tongue
// row that somehow has nothing to map, pass `answers={null}` and fall back
// to a plain "no detail saved" line rather than an empty/broken expansion.
// Raw Platform.OS ('ios'/'android'/'web') collapsed to the two-way distinction
// the practitioner actually cares about — see 20260730060000's own comment
// for why the underlying column stores the granular value anyway. null means
// the row predates platform tracking, not "unknown platform" as a real value.
function platformLabel(platform) {
  if (!platform) return null;
  return platform === 'web' ? 'Web' : 'App';
}

function ResponseEntry({ dateValue, summaryLine, answers, expanded, onToggle, exportText, platform, colors: c }) {
  const hasAnswers = Array.isArray(answers) && answers.length > 0;
  const platLabel = platformLabel(platform);
  return (
    <Pressable onPress={onToggle} style={[s.entryCard, { backgroundColor: c.surface, ...card }]}>
      <Text style={[s.logDate, { color: c.text }]}>{new Date(dateValue).toLocaleDateString(undefined, { dateStyle: 'medium' })}</Text>
      <Text style={[s.logDetail, { color: c.textMuted }]}>
        {summaryLine}{platLabel ? ` · ${platLabel}` : ''} · {expanded ? 'Hide' : 'View'}
      </Text>

      {expanded && (
        <View style={{ marginTop: 10 }}>
          {hasAnswers ? (
            <>
              {answers.map((a, i) => (
                <View key={i} style={{ marginBottom: 8 }}>
                  <Text style={[s.mutedNote, { color: c.textMuted }]}>{a.section ? `[${a.section}] ` : ''}{a.prompt}</Text>
                  <Text style={[s.answerValue, { color: c.text, marginTop: 2 }]}>
                    {a.freeText !== undefined ? (a.freeText ? `"${a.freeText}"` : '(skipped)') : (a.selectedLabels ?? []).join('; ')}
                  </Text>
                </View>
              ))}
              <Text style={[s.fieldLabel, { color: c.textMuted, marginTop: 10, marginBottom: 6 }]}>Export (select all, copy)</Text>
              <TextInput
                style={[s.exportBox, { color: c.text, backgroundColor: c.surfaceAlt, borderColor: c.border }]}
                value={exportText}
                editable={false}
                multiline
              />
            </>
          ) : (
            <Text style={[s.mutedNote, { color: c.textMuted }]}>No per-question detail saved for this attempt.</Text>
          )}
        </View>
      )}
    </Pressable>
  );
}

const CLIENT_TABS = [
  { key: 'summary',     label: 'Summary' },
  { key: 'profile',     label: 'Profile' },
  { key: 'assessments', label: 'Assessments' },
  { key: 'checkins',    label: 'Check-ins' },
  { key: 'journal',     label: 'Journal' },
  { key: 'intake',      label: 'Intake' },
  { key: 'manual',      label: 'Manual' },
  { key: 'notes',       label: 'Notes' },
  { key: 'messages',    label: 'Messages' },
];

// The first AI-drafted content in this app that's ever meant to reach the
// client — everything AIGuidanceSection shows above is practitioner-only.
// Calls generate-user-manual (same security scaffold as generate-ai-
// guidance) to synthesize a full narrative from this client's intake +
// assessments + check-ins + journal, in Thea's voice, then holds it in
// user_manuals with status='draft' until explicitly approved here. The
// client-read RLS policy on that table only allows status='approved' rows
// through, so "Approve & publish" is the actual gate, not just UI.
function ManualSection({ clientId, practitionerId, colors: c }) {
  const [manual, setManual] = useState(null); // null = loading, false = none yet
  const [draft, setDraft] = useState('');
  const [generating, setGenerating] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => { load(); }, [clientId]);

  async function load() {
    setManual(null);
    const { data } = await supabase.from('user_manuals')
      .select('content, ai_draft, status, generated_at, edited_at, approved_at')
      .eq('user_id', clientId).maybeSingle();
    setManual(data ?? false);
    setDraft(data?.content ?? '');
  }

  async function confirmDiscard() {
    if (!manual || manual.content === manual.ai_draft) return true;
    return confirmAsync(
      'Discard your edits?',
      'Regenerating replaces the current draft with a new AI-generated version — the edits you made won\'t carry over.',
      'Regenerate',
    );
  }

  async function generate() {
    if (!(await confirmDiscard())) return;
    setGenerating(true);
    setError(null);
    const { data, error } = await supabase.functions.invoke('generate-user-manual', {
      body: { clientId },
    });
    setGenerating(false);
    if (error) {
      let detail = error.message;
      try {
        const body = await error.context?.json();
        if (body?.error) detail = body.error;
      } catch { /* context wasn't JSON — fall back to the generic message */ }
      setError(detail);
      return;
    }
    await load();
  }

  async function saveDraft() {
    setSaving(true);
    const { error } = await supabase.from('user_manuals')
      .update({ content: draft, edited_at: new Date().toISOString() })
      .eq('user_id', clientId);
    setSaving(false);
    if (!error) setManual(prev => ({ ...prev, content: draft, edited_at: new Date().toISOString() }));
  }

  async function approve() {
    setSaving(true);
    const { error } = await supabase.from('user_manuals')
      .update({ content: draft, status: 'approved', approved_at: new Date().toISOString(), approved_by: practitionerId, edited_at: new Date().toISOString() })
      .eq('user_id', clientId);
    setSaving(false);
    if (!error) await load();
  }

  async function unpublish() {
    setSaving(true);
    const { error } = await supabase.from('user_manuals')
      .update({ status: 'draft' })
      .eq('user_id', clientId);
    setSaving(false);
    if (!error) await load();
  }

  if (manual === null) return <View style={s.centerPad}><ActivityIndicator color={c.accent} /></View>;

  return (
    <SectionCard title="User's Manual" colors={c}>
      <Text style={[s.mutedNote, { color: c.textMuted, marginBottom: 12 }]}>
        AI-drafted from this client's full intake and assessment history, in Thea's voice. Review and edit before approving — only visible to the client once approved.
      </Text>

      {!manual ? (
        <Pressable onPress={generate} disabled={generating} style={[s.addNoteBtn, { backgroundColor: c.accent, alignSelf: 'flex-start', paddingHorizontal: 18 }]}>
          <Text style={s.addNoteBtnText}>{generating ? 'Generating…' : "Generate User's Manual"}</Text>
        </Pressable>
      ) : (
        <>
          <View style={[s.statusBadge, { alignSelf: 'flex-start', backgroundColor: manual.status === 'approved' ? '#7AB87822' : (c.terracotta ? c.terracotta + '22' : '#C9785522') }]}>
            <Text style={[s.statusBadgeText, { color: manual.status === 'approved' ? '#4E8F52' : (c.terracotta || '#C97855') }]}>
              {manual.status === 'approved' ? 'Approved — visible to client' : 'Draft — not visible to client'}
            </Text>
          </View>

          <TextInput
            style={[s.noteInput, { color: c.text, backgroundColor: c.surfaceAlt, borderColor: c.border, minHeight: 240, marginTop: 10 }]}
            value={draft}
            onChangeText={setDraft}
            multiline
          />

          <View style={{ flexDirection: 'row', gap: 10, flexWrap: 'wrap', alignItems: 'center', marginBottom: 8 }}>
            <Pressable
              style={[s.addNoteBtn, { backgroundColor: (draft.trim() && draft !== manual.content) ? c.accent : c.border, paddingHorizontal: 18, marginBottom: 0 }]}
              onPress={saveDraft}
              disabled={saving || draft === manual.content}
            >
              <Text style={s.addNoteBtnText}>{saving ? 'Saving…' : 'Save draft'}</Text>
            </Pressable>
            <Pressable
              style={[s.addNoteBtn, { backgroundColor: '#4E8F52', paddingHorizontal: 18, marginBottom: 0 }]}
              onPress={approve}
              disabled={saving || !draft.trim()}
            >
              <Text style={s.addNoteBtnText}>{manual.status === 'approved' ? 'Update & re-approve' : 'Approve & publish'}</Text>
            </Pressable>
            {manual.status === 'approved' && (
              <Pressable onPress={unpublish} disabled={saving}>
                <Text style={[s.noteActionText, { color: c.terracotta || '#C97855' }]}>Unpublish</Text>
              </Pressable>
            )}
          </View>

          <Pressable onPress={generate} disabled={generating}>
            <Text style={[s.aiRegenerate, { color: c.accent }]}>{generating ? 'Regenerating…' : 'Regenerate from scratch'}</Text>
          </Pressable>
        </>
      )}
      {error && <Text style={{ color: c.terracotta || '#C97855', fontSize: 12, marginTop: 8 }}>Couldn't generate — {error}</Text>}
    </SectionCard>
  );
}

// One flat thread per client (roadmap #59) — see
// supabase/migrations/20260807030000_messages.sql for the RLS shape.
// clientId is always a consented client by the time this renders (ClientList
// only ever queries consented_to_practitioner_view = true rows), so no
// separate consent check is needed here the way the client-side screen
// (app/messages.js) needs one — the DB-level check is still the real
// enforcement either way, this is just why the UI doesn't need to branch on
// it too. Load-on-open, not live-updating — same v1 simplicity call as the
// client side.
function MessagesSection({ clientId, practitionerId, colors: c }) {
  const [messages, setMessages] = useState(null);
  const [draft, setDraft] = useState('');
  const [sending, setSending] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => { load(); }, [clientId]);

  async function load() {
    setMessages(null);
    try {
      const rows = await loadMessages(clientId);
      setMessages(rows);
    } catch (err) {
      setError(err.message);
      setMessages([]);
    }
  }

  async function send() {
    const body = draft.trim();
    if (!body || sending) return;
    setSending(true);
    setDraft('');
    try {
      await sendMessageAsPractitioner(clientId, practitionerId, body);
      await load();
    } catch (err) {
      setError(err.message);
    } finally {
      setSending(false);
    }
  }

  if (messages === null) return <View style={s.centerPad}><ActivityIndicator color={c.accent} /></View>;

  return (
    <SectionCard title="Messages" colors={c}>
      {error && <Text style={{ color: c.terracotta || '#C97855', fontSize: 12, marginBottom: 10 }}>{error}</Text>}
      <TextInput
        style={[s.noteInput, { color: c.text, backgroundColor: c.surfaceAlt, borderColor: c.border }]}
        value={draft}
        onChangeText={setDraft}
        placeholder="Write a message…"
        placeholderTextColor={c.textMuted}
        multiline
      />
      <Pressable
        style={[s.addNoteBtn, { backgroundColor: draft.trim() ? c.accent : c.border }]}
        onPress={send}
        disabled={!draft.trim() || sending}
      >
        <Text style={s.addNoteBtnText}>{sending ? 'Sending…' : 'Send'}</Text>
      </Pressable>
      {messages.length === 0 ? (
        <Text style={[s.mutedNote, { color: c.textMuted, marginTop: 10 }]}>No messages yet.</Text>
      ) : (
        [...messages].reverse().map(m => (
          <View key={m.id} style={[s.noteRow, { borderTopColor: c.border }]}>
            <Text style={[s.noteDate, { color: c.textMuted }]}>
              {m.sender_id === practitionerId ? 'You' : 'Client'} · {new Date(m.created_at).toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' })}
            </Text>
            <Text style={[s.noteText, { color: c.text }]}>{m.body}</Text>
          </View>
        ))
      )}
    </SectionCard>
  );
}

function StatCard({ label, value, colors: c }) {
  return (
    <View style={[s.statCard, { backgroundColor: c.surface, ...card }]}>
      <Text style={[s.statValue, { color: c.text }]}>{value}</Text>
      <Text style={[s.statLabel, { color: c.textMuted }]}>{label}</Text>
    </View>
  );
}

function ClientDetail({ client, practitionerId, colors: c, onBack, initialTab }) {
  const [clientData, setClientData] = useState(null);
  const [error, setError] = useState(null);
  const [noteDraft, setNoteDraft] = useState('');
  const [savingNote, setSavingNote] = useState(false);
  const [editingNoteId, setEditingNoteId] = useState(null);
  const [editDraft, setEditDraft] = useState('');
  const [activeTab, setActiveTab] = useState('summary');
  const [expandedResponseId, setExpandedResponseId] = useState(null);
  // Deep-linked from the Dashboard/Inbox screens (?clientId=&tab=messages) —
  // only honored on the very first client this instance loads, then
  // forgotten, so clicking around the client list afterward still resets to
  // Summary like it always did rather than getting stuck on Messages.
  const initialTabRef = useRef(initialTab);

  useEffect(() => {
    setActiveTab(initialTabRef.current || 'summary');
    initialTabRef.current = null;
    load();
  }, [client.id]);

  async function load() {
    const [doshaRes, gunaRes, agniRes, tongueRes, prakritiRes, vikritiRes, checkinsRes, intentionsRes, journalRes, intakeRes, notesRes] = await Promise.all([
      supabase.from('dosha_results').select('id, dosha, vata_score, pitta_score, kapha_score, answers, taken_at, platform').eq('user_id', client.id).order('taken_at', { ascending: false }).limit(10),
      supabase.from('guna_results').select('id, dominant, sattva_score, rajas_score, tamas_score, answers, taken_at, platform').eq('user_id', client.id).order('taken_at', { ascending: false }).limit(10),
      supabase.from('agni_results').select('id, agni_type, answers, taken_at, platform').eq('user_id', client.id).order('taken_at', { ascending: false }).limit(10),
      supabase.from('tongue_checks').select('id, reading, shape, size, color, coating, ama_level, signs, taken_at, platform').eq('user_id', client.id).order('taken_at', { ascending: false }).limit(10),
      supabase.from('prakriti_responses').select('id, tier, answers, completed_at, platform').eq('user_id', client.id).order('completed_at', { ascending: false }).limit(20),
      supabase.from('vikriti_responses').select('id, tier, answers, completed_at, platform').eq('user_id', client.id).order('completed_at', { ascending: false }).limit(20),
      supabase.from('checkins').select('date, physical, mental, emotional, hunger, tongue, note, saved_at, platform').eq('user_id', client.id).order('date', { ascending: false }).order('saved_at', { ascending: false }).limit(30),
      supabase.from('intentions').select('date, text, platform').eq('user_id', client.id).order('date', { ascending: false }).limit(15),
      supabase.from('journal_entries').select('date, grateful, showed, tomorrow, platform').eq('user_id', client.id).order('date', { ascending: false }).limit(10),
      supabase.from('intake_forms').select('data, updated_at, platform').eq('user_id', client.id).maybeSingle(),
      supabase.from('practitioner_notes').select('id, note, created_at').eq('client_id', client.id).order('created_at', { ascending: false }),
    ]);

    const firstError = [doshaRes, gunaRes, agniRes, tongueRes, prakritiRes, vikritiRes, checkinsRes, intentionsRes, journalRes, intakeRes, notesRes].find(r => r.error)?.error;
    if (firstError) { setError(firstError.message); return; }

    setClientData({
      doshaResults: doshaRes.data ?? [], gunaResults: gunaRes.data ?? [], agniResults: agniRes.data ?? [], tongueResults: tongueRes.data ?? [],
      prakritiResponses: prakritiRes.data ?? [], vikritiResponses: vikritiRes.data ?? [],
      checkins: checkinsRes.data ?? [], intentions: intentionsRes.data ?? [], journal: journalRes.data ?? [],
      intakeRow: intakeRes.data, notes: notesRes.data ?? [],
    });
  }

  async function addNote() {
    const text = noteDraft.trim();
    if (!text) return;
    setSavingNote(true);
    const { data: inserted, error } = await supabase.from('practitioner_notes')
      .insert({ client_id: client.id, practitioner_id: practitionerId, note: text })
      .select('id, note, created_at')
      .single();
    if (!error && inserted) {
      setClientData(prev => ({ ...prev, notes: [inserted, ...prev.notes] }));
      setNoteDraft('');
    }
    setSavingNote(false);
  }

  function startEditNote(note) {
    setEditingNoteId(note.id);
    setEditDraft(note.note);
  }

  async function saveEditNote(id) {
    const text = editDraft.trim();
    if (!text) return;
    const { error } = await supabase.from('practitioner_notes').update({ note: text }).eq('id', id);
    if (!error) {
      setClientData(prev => ({ ...prev, notes: prev.notes.map(n => n.id === id ? { ...n, note: text } : n) }));
      setEditingNoteId(null);
    }
  }

  async function deleteNote(id) {
    const ok = await confirmAsync('Delete this note?', 'This can\'t be undone.');
    if (!ok) return;
    const { error } = await supabase.from('practitioner_notes').delete().eq('id', id);
    if (!error) setClientData(prev => ({ ...prev, notes: prev.notes.filter(n => n.id !== id) }));
  }

  const attentionReasons = clientData ? computeAttention(clientData.checkins, clientData.intakeRow?.data) : [];

  const daysSinceLastCheckin = clientData?.checkins[0]
    ? Math.floor((Date.now() - new Date(clientData.checkins[0].date + 'T00:00:00').getTime()) / 86400000)
    : null;
  const intakeFilled = clientData?.intakeRow ? SECTIONS.reduce((sum, sec) => sum + (sectionProgress(sec, clientData.intakeRow.data)?.filled || 0), 0) : 0;
  const intakeTotal  = clientData?.intakeRow ? SECTIONS.reduce((sum, sec) => sum + (sectionProgress(sec, clientData.intakeRow.data)?.total  || 0), 0) : 0;
  const intakePct = intakeTotal ? Math.round((intakeFilled / intakeTotal) * 100) : 0;

  return (
    <View style={{ flex: 1 }}>
      <View style={[s.detailHeader, { borderBottomColor: c.border }]}>
        <Pressable onPress={onBack} hitSlop={8} style={s.backBtn}><Text style={{ color: c.accent, fontFamily: 'Inter_600SemiBold', fontSize: 14 }}>← Back</Text></Pressable>
        <View style={{ flex: 1 }}>
          <Text style={[s.detailTitle, { color: c.text }]}>{clientDisplayName(client)}</Text>
          <Text style={[s.detailSub, { color: c.textMuted }]}>{client.email}</Text>
        </View>
      </View>

      {error && (
        <View style={s.centerPad}>
          <Text style={[s.emptyText, { color: c.textMuted }]}>Couldn't load this client — {error}</Text>
        </View>
      )}

      {!clientData && !error && (
        <View style={s.centerPad}><ActivityIndicator color={c.accent} /></View>
      )}

      {clientData && (
        <>
          {attentionReasons.length > 0 && (
            <View style={[s.attentionRow, { paddingHorizontal: 16, paddingTop: 12 }]}>
              {attentionReasons.map(reason => (
                <View key={reason} style={[s.attentionChip, { backgroundColor: c.terracotta ? c.terracotta + '22' : '#C9785522', borderColor: c.terracotta || '#C97855' }]}>
                  <Text style={[s.attentionChipText, { color: c.terracotta || '#C97855' }]}>{reason}</Text>
                </View>
              ))}
            </View>
          )}

          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={[s.tabBar, { borderBottomColor: c.border }]} contentContainerStyle={s.tabBarContent}>
            {CLIENT_TABS.map(tab => (
              <Pressable
                key={tab.key}
                onPress={() => setActiveTab(tab.key)}
                style={[s.tabBtn, activeTab === tab.key && { borderBottomColor: c.accent, borderBottomWidth: 2 }]}
              >
                <Text style={[s.tabBtnText, { color: activeTab === tab.key ? c.text : c.textMuted }]}>{tab.label}</Text>
              </Pressable>
            ))}
          </ScrollView>

          <ScrollView contentContainerStyle={{ padding: 20, paddingBottom: 48 }} showsVerticalScrollIndicator={false}>

            {activeTab === 'summary' && (
              <>
                <View style={{ flexDirection: 'row', gap: 10, marginBottom: 14 }}>
                  <StatCard colors={c} label="Last check-in" value={daysSinceLastCheckin != null ? `${daysSinceLastCheckin}d ago` : '—'} />
                  <StatCard colors={c} label="Check-ins" value={clientData.checkins.length} />
                  <StatCard colors={c} label="Intake" value={`${intakePct}%`} />
                </View>

                <Pressable onPress={() => setActiveTab('assessments')}>
                  <SectionCard title="Current snapshot" colors={c}>
                    <AnswerRow label="Dosha" colors={c} value={clientData.doshaResults[0]
                      ? cap(clientData.doshaResults[0].dosha)
                      : 'Not yet taken'} />
                    {clientData.doshaResults[0] && (
                      <DoshaBar
                        colors={c}
                        scores={{
                          vata: clientData.doshaResults[0].vata_score,
                          pitta: clientData.doshaResults[0].pitta_score,
                          kapha: clientData.doshaResults[0].kapha_score,
                        }}
                      />
                    )}
                    <AnswerRow label="Guna" colors={c} value={clientData.gunaResults[0]
                      ? `${cap(clientData.gunaResults[0].dominant)} · S${clientData.gunaResults[0].sattva_score} R${clientData.gunaResults[0].rajas_score} T${clientData.gunaResults[0].tamas_score}`
                      : 'Not yet taken'} />
                    <AnswerRow label="Agni" colors={c} value={clientData.agniResults[0] ? cap(clientData.agniResults[0].agni_type) : 'Not yet taken'} />
                    <AnswerRow label="Tongue check" colors={c} value={clientData.tongueResults[0] ? cap(clientData.tongueResults[0].reading) : 'Not yet taken'} />
                    <Text style={[s.mutedNote, { color: c.accent, marginTop: 4 }]}>See full history →</Text>
                  </SectionCard>
                </Pressable>

                {clientData.notes.length > 0 && (
                  <Pressable onPress={() => setActiveTab('notes')}>
                    <SectionCard title="Latest follow-up note" colors={c}>
                      <Text style={[s.noteDate, { color: c.textMuted }]}>
                        {new Date(clientData.notes[0].created_at).toLocaleDateString(undefined, { dateStyle: 'medium' })}
                      </Text>
                      <Text style={[s.noteText, { color: c.text }]} numberOfLines={3}>{clientData.notes[0].note}</Text>
                      <Text style={[s.mutedNote, { color: c.accent, marginTop: 8 }]}>See all notes →</Text>
                    </SectionCard>
                  </Pressable>
                )}
              </>
            )}

            {activeTab === 'profile' && (
              <ProfileSection clientId={client.id} clientName={clientDisplayName(client)} colors={c} />
            )}

            {activeTab === 'assessments' && (
              <>
                <Text style={[s.sectionTitle, { color: c.text, marginBottom: 10 }]}>Dosha history</Text>
                {clientData.doshaResults.length === 0 && <Text style={[s.mutedNote, { color: c.textMuted, marginBottom: 16 }]}>Not yet taken.</Text>}
                {clientData.doshaResults.map(r => (
                  <ResponseEntry
                    key={r.id}
                    colors={c}
                    dateValue={r.taken_at}
                    summaryLine={`${cap(r.dosha)} · V${r.vata_score} P${r.pitta_score} K${r.kapha_score}`}
                    answers={r.answers}
                    platform={r.platform}
                    expanded={expandedResponseId === r.id}
                    onToggle={() => setExpandedResponseId(id => id === r.id ? null : r.id)}
                    exportText={r.answers ? formatResponseExport(clientDisplayName(client), 'Dosha Quiz', null, r.taken_at, r.answers) : null}
                  />
                ))}
                {clientData.doshaResults.length > 0 && <AIGuidanceSection colors={c} clientId={client.id} assessmentType="dosha" />}

                <Text style={[s.sectionTitle, { color: c.text, marginBottom: 10, marginTop: 8 }]}>Guna history</Text>
                {clientData.gunaResults.length === 0 && <Text style={[s.mutedNote, { color: c.textMuted, marginBottom: 16 }]}>Not yet taken.</Text>}
                {clientData.gunaResults.map(r => (
                  <ResponseEntry
                    key={r.id}
                    colors={c}
                    dateValue={r.taken_at}
                    summaryLine={`${cap(r.dominant)} · S${r.sattva_score} R${r.rajas_score} T${r.tamas_score}`}
                    answers={r.answers}
                    platform={r.platform}
                    expanded={expandedResponseId === r.id}
                    onToggle={() => setExpandedResponseId(id => id === r.id ? null : r.id)}
                    exportText={r.answers ? formatResponseExport(clientDisplayName(client), 'Guna Assessment', null, r.taken_at, r.answers) : null}
                  />
                ))}
                {clientData.gunaResults.length > 0 && <AIGuidanceSection colors={c} clientId={client.id} assessmentType="guna" />}

                <Text style={[s.sectionTitle, { color: c.text, marginBottom: 10, marginTop: 8 }]}>Agni history</Text>
                {clientData.agniResults.length === 0 && <Text style={[s.mutedNote, { color: c.textMuted, marginBottom: 16 }]}>Not yet taken.</Text>}
                {clientData.agniResults.map(r => (
                  <ResponseEntry
                    key={r.id}
                    colors={c}
                    dateValue={r.taken_at}
                    summaryLine={cap(r.agni_type)}
                    answers={r.answers}
                    platform={r.platform}
                    expanded={expandedResponseId === r.id}
                    onToggle={() => setExpandedResponseId(id => id === r.id ? null : r.id)}
                    exportText={r.answers ? formatResponseExport(clientDisplayName(client), 'Agni Assessment', null, r.taken_at, r.answers) : null}
                  />
                ))}
                {clientData.agniResults.length > 0 && <AIGuidanceSection colors={c} clientId={client.id} assessmentType="agni" />}

                <Text style={[s.sectionTitle, { color: c.text, marginBottom: 10, marginTop: 8 }]}>Tongue check history</Text>
                {clientData.tongueResults.length === 0 && <Text style={[s.mutedNote, { color: c.textMuted }]}>Not yet taken.</Text>}
                {clientData.tongueResults.map(r => {
                  const tongueAnswers = buildTongueAnswers(r);
                  return (
                    <ResponseEntry
                      key={r.id}
                      colors={c}
                      dateValue={r.taken_at}
                      summaryLine={cap(r.reading)}
                      answers={tongueAnswers}
                      platform={r.platform}
                      expanded={expandedResponseId === r.id}
                      onToggle={() => setExpandedResponseId(id => id === r.id ? null : r.id)}
                      exportText={formatResponseExport(clientDisplayName(client), 'Tongue Check', null, r.taken_at, tongueAnswers)}
                    />
                  );
                })}
                {clientData.tongueResults.length > 0 && <AIGuidanceSection colors={c} clientId={client.id} assessmentType="tongue" />}

                <Text style={[s.sectionTitle, { color: c.text, marginBottom: 10, marginTop: 8 }]}>Prakriti responses</Text>
                {clientData.prakritiResponses.length === 0 && <Text style={[s.mutedNote, { color: c.textMuted, marginBottom: 16 }]}>Not yet taken.</Text>}
                {clientData.prakritiResponses.map(r => (
                  <ResponseEntry
                    key={r.id}
                    colors={c}
                    dateValue={r.completed_at}
                    summaryLine={`${PRAKRITI_TIER_LABELS[r.tier] || r.tier} · ${(r.answers ?? []).length} answer${(r.answers ?? []).length === 1 ? '' : 's'}`}
                    answers={r.answers}
                    platform={r.platform}
                    expanded={expandedResponseId === r.id}
                    onToggle={() => setExpandedResponseId(id => id === r.id ? null : r.id)}
                    exportText={formatResponseExport(clientDisplayName(client), 'Prakriti', PRAKRITI_TIER_LABELS[r.tier] || r.tier, r.completed_at, r.answers)}
                  />
                ))}
                {[...new Set(clientData.prakritiResponses.map(r => r.tier))].map(tier => (
                  <AIGuidanceSection key={tier} colors={c} clientId={client.id} assessmentType="prakriti" tier={tier} />
                ))}

                <Text style={[s.sectionTitle, { color: c.text, marginBottom: 10, marginTop: 8 }]}>Vikriti responses</Text>
                {clientData.vikritiResponses.length === 0 && <Text style={[s.mutedNote, { color: c.textMuted }]}>Not yet taken.</Text>}
                {clientData.vikritiResponses.map(r => (
                  <ResponseEntry
                    key={r.id}
                    colors={c}
                    dateValue={r.completed_at}
                    summaryLine={`${VIKRITI_TIER_LABELS[r.tier] || r.tier} · ${(r.answers ?? []).length} answer${(r.answers ?? []).length === 1 ? '' : 's'}`}
                    answers={r.answers}
                    platform={r.platform}
                    expanded={expandedResponseId === r.id}
                    onToggle={() => setExpandedResponseId(id => id === r.id ? null : r.id)}
                    exportText={formatResponseExport(clientDisplayName(client), 'Vikriti', VIKRITI_TIER_LABELS[r.tier] || r.tier, r.completed_at, r.answers)}
                  />
                ))}
                {[...new Set(clientData.vikritiResponses.map(r => r.tier))].map(tier => (
                  <AIGuidanceSection key={tier} colors={c} clientId={client.id} assessmentType="vikriti" tier={tier} />
                ))}
              </>
            )}

            {activeTab === 'checkins' && (() => {
              // Merged chronologically with intentions, Aug 12 2026 — "Just
              // for today, I will..." picks were never readable by a
              // practitioner at all before this; folded into the same daily
              // log Check-ins already showed rather than a separate tab,
              // since a day's check-in and its intention are the same kind
              // of "what did this person do today" signal.
              // Aug 25 2026: a day can now have more than one check-in (the
              // client-side overwrite bug this fixed), so `checkin` became
              // `checkins` — a day's whole list, not just the last one
              // processed. Rows already arrive newest-first per date (see
              // the .order('saved_at', ...) on this screen's query), so
              // reverse to oldest-first for a natural top-to-bottom read.
              const byDate = {};
              const touch = date => (byDate[date] ??= { date, checkins: [], intention: null });
              for (const ci of clientData.checkins) touch(ci.date).checkins.push(ci);
              for (const it of clientData.intentions) touch(it.date).intention = it;
              for (const day of Object.values(byDate)) day.checkins.reverse();
              const merged = Object.values(byDate).sort((a, b) => b.date.localeCompare(a.date));

              return (
                <>
                  <Text style={[s.sectionTitle, { color: c.text, marginBottom: 10 }]}>{`Check-ins & Intentions (${merged.length})`}</Text>
                  {merged.length === 0 && <Text style={[s.mutedNote, { color: c.textMuted }]}>No check-ins or intentions yet.</Text>}
                  {merged.map(day => (
                    <View key={day.date} style={[s.entryCard, { backgroundColor: c.surface, ...card }]}>
                      <Text style={[s.logDate, { color: c.text }]}>
                        {new Date(day.date + 'T12:00:00').toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })}
                      </Text>
                      {day.checkins.map((ci, i) => (
                        <View key={i} style={i > 0 ? { marginTop: 8 } : null}>
                          <Text style={[s.logDetail, { color: c.textMuted }]}>
                            P{ci.physical} M{ci.mental} E{ci.emotional}{ci.hunger != null ? ` H${ci.hunger}` : ''}{ci.tongue != null ? ` T${ci.tongue}` : ''}
                            {ci.saved_at ? ` · ${new Date(ci.saved_at).toLocaleTimeString(undefined, { hour: 'numeric', minute: '2-digit' })}` : ''}
                            {platformLabel(ci.platform) ? ` · ${platformLabel(ci.platform)}` : ''}
                          </Text>
                          {ci.note ? <Text style={[s.logNote, { color: c.textMedium }]}>"{ci.note}"</Text> : null}
                        </View>
                      ))}
                      {day.intention && (
                        <Text style={[s.logNote, { color: c.textMedium, marginTop: day.checkins.length ? 8 : 0 }]}>
                          "Just for today, I will {day.intention.text}"{platformLabel(day.intention.platform) ? ` · ${platformLabel(day.intention.platform)}` : ''}
                        </Text>
                      )}
                    </View>
                  ))}
                </>
              );
            })()}

            {activeTab === 'journal' && (
              <>
                <Text style={[s.sectionTitle, { color: c.text, marginBottom: 10 }]}>{`Journal (${clientData.journal.length})`}</Text>
                {clientData.journal.length === 0 && <Text style={[s.mutedNote, { color: c.textMuted }]}>No journal entries yet.</Text>}
                {clientData.journal.map(j => (
                  <View key={j.date} style={[s.entryCard, { backgroundColor: c.surface, ...card }]}>
                    <Text style={[s.logDate, { color: c.text }]}>
                      {new Date(j.date + 'T12:00:00').toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })}
                    </Text>
                    {j.grateful ? <Text style={[s.logDetail, { color: c.textMuted }]}>Grateful: {j.grateful}</Text> : null}
                    {j.showed ? <Text style={[s.logDetail, { color: c.textMuted }]}>Showed up: {j.showed}</Text> : null}
                    {j.tomorrow ? <Text style={[s.logDetail, { color: c.textMuted }]}>Tomorrow: {j.tomorrow}</Text> : null}
                    {platformLabel(j.platform) ? <Text style={[s.logNote, { color: c.textMuted }]}>{platformLabel(j.platform)}</Text> : null}
                  </View>
                ))}
              </>
            )}

            {activeTab === 'intake' && (
              <>
                <Text style={[s.updatedText, { color: c.textMuted }]}>
                  Intake form {clientData.intakeRow ? `— last updated ${new Date(clientData.intakeRow.updated_at).toLocaleDateString(undefined, { dateStyle: 'medium' })}${platformLabel(clientData.intakeRow.platform) ? ` · ${platformLabel(clientData.intakeRow.platform)}` : ''}` : ''}
                </Text>
                {!clientData.intakeRow && (
                  <Text style={[s.mutedNote, { color: c.textMuted, marginBottom: 12 }]}>This client hasn't started their intake form yet.</Text>
                )}
                {clientData.intakeRow && SECTIONS.map(section => {
                  const dataFields = section.fields.filter(f => f.key);
                  if (dataFields.length === 0) return null;
                  return (
                    <SectionCard key={section.id} title={section.title} colors={c}>
                      {dataFields.map(field => (
                        <AnswerRow key={field.key} label={field.label} colors={c} value={fieldDisplayValue(clientData.intakeRow.data[field.key])} />
                      ))}
                    </SectionCard>
                  );
                })}
              </>
            )}

            {activeTab === 'manual' && (
              <ManualSection clientId={client.id} practitionerId={practitionerId} colors={c} />
            )}

            {activeTab === 'messages' && (
              <MessagesSection clientId={client.id} practitionerId={practitionerId} colors={c} />
            )}

            {activeTab === 'notes' && (
              <SectionCard title="Follow-up notes" colors={c}>
                <Text style={[s.mutedNote, { color: c.textMuted, marginBottom: 10 }]}>
                  Private — only you can see these. Not shared with the client.
                </Text>
                <TextInput
                  style={[s.noteInput, { color: c.text, backgroundColor: c.surfaceAlt, borderColor: c.border }]}
                  value={noteDraft}
                  onChangeText={setNoteDraft}
                  placeholder="Add a follow-up note…"
                  placeholderTextColor={c.textMuted}
                  multiline
                />
                <Pressable
                  style={[s.addNoteBtn, { backgroundColor: noteDraft.trim() ? c.accent : c.border }]}
                  onPress={addNote}
                  disabled={!noteDraft.trim() || savingNote}
                >
                  <Text style={s.addNoteBtnText}>{savingNote ? 'Saving…' : 'Add note'}</Text>
                </Pressable>
                {clientData.notes.map(note => (
                  <View key={note.id} style={[s.noteRow, { borderTopColor: c.border }]}>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                      <Text style={[s.noteDate, { color: c.textMuted, marginBottom: 0 }]}>
                        {new Date(note.created_at).toLocaleDateString(undefined, { dateStyle: 'medium' })}
                      </Text>
                      {editingNoteId !== note.id && (
                        <View style={{ flexDirection: 'row', gap: 14 }}>
                          <Pressable onPress={() => startEditNote(note)}><Text style={[s.noteActionText, { color: c.accent }]}>Edit</Text></Pressable>
                          <Pressable onPress={() => deleteNote(note.id)}><Text style={[s.noteActionText, { color: c.terracotta || '#C97855' }]}>Delete</Text></Pressable>
                        </View>
                      )}
                    </View>
                    {editingNoteId === note.id ? (
                      <>
                        <TextInput
                          style={[s.noteInput, { color: c.text, backgroundColor: c.surfaceAlt, borderColor: c.border, marginTop: 6 }]}
                          value={editDraft}
                          onChangeText={setEditDraft}
                          multiline
                        />
                        <View style={{ flexDirection: 'row', gap: 10 }}>
                          <Pressable style={[s.addNoteBtn, { flex: 1, backgroundColor: editDraft.trim() ? c.accent : c.border }]} onPress={() => saveEditNote(note.id)} disabled={!editDraft.trim()}>
                            <Text style={s.addNoteBtnText}>Save</Text>
                          </Pressable>
                          <Pressable style={[s.addNoteBtn, { flex: 1, backgroundColor: c.surfaceAlt }]} onPress={() => setEditingNoteId(null)}>
                            <Text style={[s.addNoteBtnText, { color: c.textMuted }]}>Cancel</Text>
                          </Pressable>
                        </View>
                      </>
                    ) : (
                      <Text style={[s.noteText, { color: c.text }]}>{note.note}</Text>
                    )}
                  </View>
                ))}
              </SectionCard>
            )}

          </ScrollView>
        </>
      )}
    </View>
  );
}

// Two-pane list+detail layout kicks in above this width — roughly "wide
// enough that a fixed-width client list plus a readable detail pane both
// fit," matching the room the app's Web View mode actually gives this
// screen (viewport minus WebLayout's 240px sidebar).
const WIDE_BREAKPOINT = 800;

export default function PractitionerClients() {
  const { theme: { colors: c } } = useTheme();
  const { width } = useWindowDimensions();
  const isWide = width >= WIDE_BREAKPOINT;
  // Deep-linked from the Dashboard tab's activity feed or the Inbox screen
  // (?clientId=&tab=) — see ClientList's own effect for how clientId gets
  // consumed once clients load, and ClientDetail's initialTabRef for tab.
  const { clientId, tab } = useLocalSearchParams();
  const [practitionerId, setPractitionerId] = useState(null);
  const [practitionerSelf, setPractitionerSelf] = useState(null);
  const [selectedClient, setSelectedClient] = useState(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      const id = session?.user?.id ?? null;
      setPractitionerId(id);
      if (!id) return;
      supabase.from('users').select('id, email, first_name, last_name, display_name').eq('id', id).single()
        .then(({ data }) => { if (data) setPractitionerSelf(data); });
    });
  }, []);

  // ClientList only ever shows role='user' accounts (deliberately — a
  // practitioner shouldn't clutter client search), so Thea's own submitted
  // data was otherwise unreachable from this screen. This button reuses
  // ClientDetail as-is with her own account standing in for "client."
  const viewOwnData = practitionerSelf && (
    <Pressable onPress={() => setSelectedClient(practitionerSelf)} style={[s.ownDataBtn, { borderColor: c.border }]}>
      <Text style={[s.ownDataBtnText, { color: c.accent }]}>View my own data</Text>
    </Pressable>
  );

  if (isWide) {
    return (
      <View style={{ flex: 1, flexDirection: 'row' }}>
        <View style={[s.listPane, { borderRightColor: c.border }]}>
          {viewOwnData}
          <ClientList colors={c} onSelect={setSelectedClient} selectedId={selectedClient?.id} initialClientId={clientId} />
        </View>
        <View style={{ flex: 1 }}>
          {selectedClient
            ? <ClientDetail client={selectedClient} practitionerId={practitionerId} colors={c} onBack={() => setSelectedClient(null)} initialTab={tab} />
            : <View style={s.centerPad}><Text style={[s.emptyText, { color: c.textMuted }]}>Select a client to view their details.</Text></View>}
        </View>
      </View>
    );
  }

  return selectedClient
    ? <ClientDetail client={selectedClient} practitionerId={practitionerId} colors={c} onBack={() => setSelectedClient(null)} initialTab={tab} />
    : <>{viewOwnData}<ClientList colors={c} onSelect={setSelectedClient} initialClientId={clientId} /></>;
}

const s = StyleSheet.create({
  listPane:    { width: 340, borderRightWidth: StyleSheet.hairlineWidth },
  ownDataBtn:     { borderWidth: 1, borderRadius: 999, paddingVertical: 8, paddingHorizontal: 14, alignSelf: 'flex-start', margin: 16, marginBottom: 0 },
  ownDataBtnText: { fontFamily: 'Inter_600SemiBold', fontSize: 13 },

  centerPad: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 32 },
  emptyText: { fontFamily: 'Inter_400Regular', fontSize: 15, lineHeight: 22, textAlign: 'center' },

  funnelCard: { borderRadius: 16, padding: 14, marginBottom: 14 },
  funnelLabel: { fontFamily: 'Inter_600SemiBold', fontSize: 11, letterSpacing: 0.3, textTransform: 'uppercase' },
  funnelStat: { flex: 1 },
  funnelStatValue: { fontFamily: 'PlayfairDisplay_600SemiBold', fontSize: 20, lineHeight: 26 },
  funnelStatLabel: { fontFamily: 'Inter_400Regular', fontSize: 12 },

  searchInput: { borderWidth: 1, borderRadius: 12, paddingHorizontal: 14, paddingVertical: 10, fontSize: 14, fontFamily: 'Inter_400Regular', marginBottom: 10 },
  attentionToggle: { alignSelf: 'flex-start', borderWidth: 1, borderRadius: 999, paddingHorizontal: 12, paddingVertical: 6, marginBottom: 16 },
  attentionToggleText: { fontFamily: 'Inter_600SemiBold', fontSize: 12 },

  clientRow:   { borderRadius: 16, padding: 16, marginBottom: 10 },
  clientName:  { fontFamily: 'Inter_600SemiBold', fontSize: 15.5 },
  clientEmail: { fontFamily: 'Inter_400Regular', fontSize: 13, marginTop: 2 },

  attentionRow:      { flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginTop: 8 },
  attentionChip:     { borderWidth: 1, borderRadius: 999, paddingHorizontal: 10, paddingVertical: 4 },
  attentionChipText: { fontFamily: 'Inter_500Medium', fontSize: 11.5 },

  backBtn:      { marginRight: 10 },
  detailHeader: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 12, borderBottomWidth: StyleSheet.hairlineWidth, gap: 10 },
  detailTitle:  { fontFamily: 'PlayfairDisplay_600SemiBold', fontSize: 18 },
  detailSub:    { fontFamily: 'Inter_400Regular', fontSize: 12, marginTop: 1 },

  // flexShrink: 0 matters on web specifically — CSS flexbox defaults
  // flex-shrink to 1 (RN's own Yoga engine defaults to 0), so without this
  // a tab whose content pushes the column tall enough can squeeze this bar
  // down instead of just scrolling underneath it. Same fix already applied
  // to the sidebar style below; see project memory on RN-Web flex divergence.
  tabBar:        { flexGrow: 0, flexShrink: 0, borderBottomWidth: StyleSheet.hairlineWidth },
  tabBarContent: { flexDirection: 'row', paddingHorizontal: 8 },
  tabBtn:     { paddingVertical: 12, paddingHorizontal: 10, marginRight: 4 },
  tabBtnText: { fontFamily: 'Inter_600SemiBold', fontSize: 13 },

  statCard:  { flex: 1, borderRadius: 18, paddingVertical: 14, alignItems: 'center', gap: 2 },
  statValue: { fontFamily: 'PlayfairDisplay_600SemiBold', fontSize: 20, lineHeight: 26 },
  statLabel: { fontFamily: 'Inter_400Regular', fontSize: 11, textAlign: 'center' },

  updatedText: { fontFamily: 'Inter_400Regular', fontSize: 12, fontStyle: 'italic', marginBottom: 16, marginTop: 4 },
  mutedNote:   { fontFamily: 'Inter_400Regular', fontSize: 13.5, lineHeight: 19 },

  sectionCard: { borderRadius: 18, padding: 16, marginBottom: 12 },
  sectionTitle: { fontFamily: 'Inter_600SemiBold', fontSize: 14, letterSpacing: 0.3, marginBottom: 10 },
  answerRow:   { marginBottom: 10 },
  answerLabel: { fontFamily: 'Inter_600SemiBold', fontSize: 11, letterSpacing: 0.3, textTransform: 'uppercase', marginBottom: 2 },
  profileFieldInput: { borderWidth: 1, borderRadius: 10, paddingHorizontal: 12, paddingVertical: 9, fontSize: 14, fontFamily: 'Inter_400Regular' },
  answerValue: { fontFamily: 'Inter_400Regular', fontSize: 14.5, lineHeight: 20 },

  entryCard: { borderRadius: 14, padding: 14, marginBottom: 8 },
  logDate:   { fontFamily: 'Inter_600SemiBold', fontSize: 12.5, marginBottom: 2 },
  logDetail: { fontFamily: 'Inter_400Regular', fontSize: 13.5, lineHeight: 19 },
  fieldLabel: { fontFamily: 'Inter_600SemiBold', fontSize: 11, letterSpacing: 0.3, textTransform: 'uppercase' },
  exportBox: { borderWidth: 1, borderRadius: 10, padding: 10, minHeight: 100, textAlignVertical: 'top', fontFamily: 'Inter_400Regular', fontSize: 12.5, lineHeight: 18 },
  aiCard: { borderWidth: 1, borderRadius: 12, padding: 12 },
  aiLabel: { fontFamily: 'Inter_600SemiBold', fontSize: 10, letterSpacing: 0.3, textTransform: 'uppercase', marginBottom: 6 },
  aiContent: { fontFamily: 'Inter_400Regular', fontSize: 13.5, lineHeight: 20, fontStyle: 'italic', marginBottom: 8 },
  aiRegenerate: { fontFamily: 'Inter_500Medium', fontSize: 12 },
  statusBadge: { borderRadius: 999, paddingHorizontal: 10, paddingVertical: 4 },
  statusBadgeText: { fontFamily: 'Inter_600SemiBold', fontSize: 11.5 },
  logNote:   { fontFamily: 'Inter_400Regular', fontSize: 13, fontStyle: 'italic', marginTop: 2, lineHeight: 18 },

  noteInput:   { borderWidth: 1, borderRadius: 12, padding: 12, fontSize: 14, fontFamily: 'Inter_400Regular', minHeight: 70, textAlignVertical: 'top', marginBottom: 10 },
  addNoteBtn:  { borderRadius: 999, paddingVertical: 10, alignItems: 'center', marginBottom: 16 },
  addNoteBtnText: { color: '#FBF9F4', fontFamily: 'Inter_600SemiBold', fontSize: 13 },
  noteRow:  { borderTopWidth: StyleSheet.hairlineWidth, paddingTop: 10, marginTop: 10 },
  noteDate: { fontFamily: 'Inter_600SemiBold', fontSize: 11, letterSpacing: 0.3, textTransform: 'uppercase', marginBottom: 4 },
  noteText: { fontFamily: 'Inter_400Regular', fontSize: 14, lineHeight: 20 },
  noteActionText: { fontFamily: 'Inter_600SemiBold', fontSize: 12 },
});
