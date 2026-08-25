import { View, Text, StyleSheet, Pressable, ScrollView, Switch, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useState, useEffect } from 'react';
import { useRouter } from 'expo-router';
import { useTheme } from '../context/ThemeContext';
import { card } from '../theme/index';
import {
  loadDoshaResult, loadGunaResult, loadTongueResult, loadAgniResult, loadRecentCheckins, loadPrakritiProgress, loadVikritiProgress,
  loadUserName, saveUserName, loadFirstName, saveFirstName, loadLastName, saveLastName, loadPhone, savePhone, loadAddress, saveAddress,
  loadCity, saveCity, loadState, saveState, loadZip, saveZip,
} from '../data/user/storage';
import { tongueReadings } from '../data/content/tongueCheck';
import { agniResults } from '../data/content/agniQuiz';
import { gunaResults } from '../data/content/gunaQuiz';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../config/supabase';
import { DoshaWheel, DOSHA_COLORS } from '../components/DoshaWheel';
import { SECTIONS, sectionProgress, loadIntake } from './intake';
import Header from '../components/Header';
import Svg, { Path, Circle, Rect } from 'react-native-svg';

function computeStats(checkins) {
  const total = checkins.length;

  // Check-ins in the last 7 days (rolling window)
  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - 7);
  const cutoffStr = cutoff.toISOString().slice(0, 10);
  const thisWeek = checkins.filter(c => c.date >= cutoffStr).length;

  // Consecutive day streak going backwards from today (or yesterday if today not yet done)
  const dates = new Set(checkins.map(c => c.date));
  const today = new Date().toISOString().slice(0, 10);
  const cursor = new Date();
  if (!dates.has(today)) cursor.setDate(cursor.getDate() - 1); // grace: don't break streak if today isn't done yet
  let streak = 0;
  for (let i = 0; i < 365; i++) {
    const d = cursor.toISOString().slice(0, 10);
    if (!dates.has(d)) break;
    streak++;
    cursor.setDate(cursor.getDate() - 1);
  }

  return { streak, total, thisWeek };
}

function tierProgressLabel(progress) {
  if (!progress) return null;
  const n = Object.values(progress).filter(Boolean).length;
  if (n === 0) return null;
  return n === 3 ? 'All 3 sections complete' : `${n} of 3 sections complete`;
}

function cap(s) {
  return s ? s.charAt(0).toUpperCase() + s.slice(1) : s;
}

function Field({ label, value, onChangeText, colors: c, placeholder, keyboardType, autoCapitalize, containerStyle }) {
  return (
    <View style={[{ marginBottom: 12 }, containerStyle]}>
      <Text style={[styles.fieldLabel, { color: c.textMuted }]}>{label}</Text>
      <TextInput
        style={[styles.fieldInput, { color: c.text, backgroundColor: c.surfaceAlt, borderColor: c.border }]}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={c.textMuted}
        keyboardType={keyboardType}
        autoCapitalize={autoCapitalize}
      />
    </View>
  );
}

// Colored result pill — every result type already carries its own canonical
// color in its content data (DOSHA_COLORS, gunaResults[x].color, etc.), so
// this reuses that instead of inventing a separate badge palette.
function ResultBadge({ label, color }) {
  return (
    <View style={{ alignSelf: 'flex-start', backgroundColor: color + '26', borderRadius: 999, paddingHorizontal: 8, paddingVertical: 2, marginTop: 3 }}>
      <Text style={{ color, fontFamily: 'Inter_600SemiBold', fontSize: 11 }}>{label}</Text>
    </View>
  );
}

const SETTINGS = [
  { label: 'Reminders',           Icon: BellIcon,     soon: true  },
  { label: 'Help & guidance',     Icon: QuestionIcon, soon: true  },
];

export default function You() {
  const { theme: { colors: c, spacing } } = useTheme();
  const router = useRouter();
  const { user, signOut } = useAuth();
  const [result, setResult]         = useState(null);
  const [gunaResult, setGunaResult] = useState(null);
  const [tongueResult, setTongueResult] = useState(null);
  const [agniResult, setAgniResult] = useState(null);
  const [prakritiProgress, setPrakritiProgress] = useState(null);
  const [vikritiProgress, setVikritiProgress]   = useState(null);
  const [intake, setIntake]         = useState(null);
  const [stats, setStats]           = useState({ streak: 0, total: 0, thisWeek: 0 });
  const [userName, setUserName]     = useState('');
  const [firstName, setFirstName]   = useState('');
  const [lastName, setLastName]     = useState('');
  const [phone, setPhone]           = useState('');
  const [address, setAddress]       = useState('');
  const [city, setCity]             = useState('');
  const [state, setState]           = useState('');
  const [zip, setZip]               = useState('');
  const [editingProfile, setEditingProfile] = useState(false);
  const [profileDraft, setProfileDraft] = useState(null);
  const [savingProfile, setSavingProfile] = useState(false);
  const [consented, setConsented]   = useState(false);
  const [consentBusy, setConsentBusy] = useState(false);
  const [manualAvailable, setManualAvailable] = useState(false);

  useEffect(() => {
    loadDoshaResult().then(r => setResult(r || false));
    loadGunaResult().then(r => setGunaResult(r));
    loadTongueResult().then(r => setTongueResult(r));
    loadAgniResult().then(r => setAgniResult(r));
    loadPrakritiProgress().then(setPrakritiProgress);
    loadVikritiProgress().then(setVikritiProgress);
    loadIntake().then(setIntake);
    loadUserName().then(n => { if (n) setUserName(n); });
    loadFirstName().then(v => setFirstName(v || ''));
    loadLastName().then(v => setLastName(v || ''));
    loadPhone().then(v => setPhone(v || ''));
    loadAddress().then(v => setAddress(v || ''));
    loadCity().then(v => setCity(v || ''));
    loadState().then(v => setState(v || ''));
    loadZip().then(v => setZip(v || ''));
    loadRecentCheckins(365).then(list => {
      setStats(computeStats(list));
    });
  }, []);

  function startEditProfile() {
    setProfileDraft({ firstName, lastName, displayName: userName, phone, address, city, state, zip });
    setEditingProfile(true);
  }

  async function saveProfile() {
    setSavingProfile(true);
    await Promise.all([
      saveFirstName(profileDraft.firstName),
      saveLastName(profileDraft.lastName),
      saveUserName(profileDraft.displayName),
      savePhone(profileDraft.phone),
      saveAddress(profileDraft.address),
      saveCity(profileDraft.city),
      saveState(profileDraft.state),
      saveZip(profileDraft.zip),
    ]);
    setFirstName(profileDraft.firstName.trim());
    setLastName(profileDraft.lastName.trim());
    setUserName(profileDraft.displayName.trim());
    setPhone(profileDraft.phone.trim());
    setAddress(profileDraft.address.trim());
    setCity(profileDraft.city.trim());
    setState(profileDraft.state.trim());
    setZip(profileDraft.zip.trim());
    setSavingProfile(false);
    setEditingProfile(false);
  }

  useEffect(() => {
    if (!user) { setConsented(false); return; }
    supabase.from('users').select('consented_to_practitioner_view').eq('id', user.id).single()
      .then(({ data }) => setConsented(!!data?.consented_to_practitioner_view));
  }, [user]);

  // RLS on user_manuals only returns a row to its owner when status =
  // 'approved' — so "did this query return anything" already is the
  // readiness check, no separate status field to read client-side.
  useEffect(() => {
    if (!user) { setManualAvailable(false); return; }
    supabase.from('user_manuals').select('id').eq('user_id', user.id).maybeSingle()
      .then(({ data }) => setManualAvailable(!!data));
  }, [user]);

  async function toggleConsent(next) {
    setConsented(next); // optimistic — RLS already lets a user update their own row
    setConsentBusy(true);
    const { error } = await supabase.from('users').update({ consented_to_practitioner_view: next }).eq('id', user.id);
    if (error) setConsented(!next); // revert on failure
    setConsentBusy(false);
  }

  return (
    <SafeAreaView edges={['top']} style={{ flex: 1, backgroundColor: c.bg }}>
      <Header title="You" left="menu" right="search" />

      <ScrollView contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 32 }} showsVerticalScrollIndicator={false}>

        {/* Avatar */}
        <View style={styles.avatarSection}>
          <View style={[styles.avatarRing, { borderColor: c.border }]}>
            <View style={[styles.avatarInner, { backgroundColor: c.surfaceAlt }]}>
              <ImgPlaceholder color={c.textMuted} />
            </View>
            <Pressable style={[styles.editBadge, { backgroundColor: c.accent, borderColor: c.bg }]} onPress={startEditProfile} hitSlop={6}>
              <PenIcon color="#FBF9F4" size={10} />
            </Pressable>
          </View>

          {editingProfile ? (
            <View style={[styles.profileEditCard, { backgroundColor: c.surface, ...card }]}>
              <Field colors={c} label="First name" value={profileDraft.firstName} onChangeText={t => setProfileDraft({ ...profileDraft, firstName: t })} />
              <Field colors={c} label="Last name" value={profileDraft.lastName} onChangeText={t => setProfileDraft({ ...profileDraft, lastName: t })} />
              <Field colors={c} label="Display name" value={profileDraft.displayName} onChangeText={t => setProfileDraft({ ...profileDraft, displayName: t })} placeholder="What should we call you?" />
              <Field colors={c} label="Phone" value={profileDraft.phone} onChangeText={t => setProfileDraft({ ...profileDraft, phone: t })} keyboardType="phone-pad" />
              <Field colors={c} label="Address" value={profileDraft.address} onChangeText={t => setProfileDraft({ ...profileDraft, address: t })} />
              <View style={{ flexDirection: 'row', gap: 10 }}>
                <Field colors={c} label="City" value={profileDraft.city} onChangeText={t => setProfileDraft({ ...profileDraft, city: t })} containerStyle={{ flex: 2, marginBottom: 12 }} />
                <Field colors={c} label="State" value={profileDraft.state} onChangeText={t => setProfileDraft({ ...profileDraft, state: t })} containerStyle={{ flex: 1, marginBottom: 12 }} />
                <Field colors={c} label="Zip" value={profileDraft.zip} onChangeText={t => setProfileDraft({ ...profileDraft, zip: t })} keyboardType="number-pad" containerStyle={{ flex: 1, marginBottom: 12 }} />
              </View>
              <View style={{ flexDirection: 'row', gap: 10, marginTop: 4 }}>
                <Pressable style={[styles.profileSaveBtn, { flex: 1, backgroundColor: c.accent }]} onPress={saveProfile} disabled={savingProfile}>
                  <Text style={styles.profileSaveBtnText}>{savingProfile ? 'Saving…' : 'Save'}</Text>
                </Pressable>
                <Pressable style={[styles.profileSaveBtn, { flex: 1, backgroundColor: c.surfaceAlt }]} onPress={() => setEditingProfile(false)} disabled={savingProfile}>
                  <Text style={[styles.profileSaveBtnText, { color: c.textMuted }]}>Cancel</Text>
                </Pressable>
              </View>
            </View>
          ) : (
            <>
              <Text style={[styles.name, { color: c.text }]}>{userName || 'You'}</Text>
              <Text style={[styles.tagline, { color: c.textMedium }]}>Wellness is a return to you.</Text>
              {user && (
                <Text style={{ fontFamily: 'Inter_400Regular', fontSize: 12.5, color: c.textMuted, marginTop: 4 }} numberOfLines={1}>
                  {user.email}
                </Text>
              )}
            </>
          )}
        </View>

        {/* Dosha wheel — only shown after quiz is taken */}
        {result && result.scores && (() => {
          const total = (result.scores.vata + result.scores.pitta + result.scores.kapha) || 1;
          const pcts = {
            vata:  Math.round((result.scores.vata  / total) * 100),
            pitta: Math.round((result.scores.pitta / total) * 100),
            kapha: Math.round((result.scores.kapha / total) * 100),
          };
          return (
            <View style={[styles.wheelCard, { backgroundColor: c.surface, ...card }]}>
              <Text style={[styles.wheelLabel, { color: c.textMuted }]}>Your Constitution</Text>
              <DoshaWheel scores={result.scores} primary={result.dosha} size={180} />

              {/* Three-dosha percentage breakdown */}
              <View style={styles.doshaBreakdown}>
                {[
                  { key: 'vata',  label: 'Vata'  },
                  { key: 'pitta', label: 'Pitta' },
                  { key: 'kapha', label: 'Kapha' },
                ].map(({ key, label }) => (
                  <View key={key} style={[styles.doshaStat, { backgroundColor: c.surfaceAlt }]}>
                    <Text style={[styles.doshaStatPct, { color: DOSHA_COLORS[key] }]}>{pcts[key]}%</Text>
                    <Text style={[styles.doshaStatName, { color: c.textMuted }]}>{label}</Text>
                  </View>
                ))}
              </View>

              <Pressable
                style={[styles.retakeBtn, { borderColor: c.border }]}
                onPress={() => router.push('/quiz')}
              >
                <Text style={[styles.retakeBtnText, { color: c.textMuted }]}>Retake quiz</Text>
              </Pressable>
            </View>
          );
        })()}

        {/* Stats */}
        <View style={{ flexDirection: 'row', gap: 10, marginBottom: 14 }}>
          {[
            { Icon: SunIcon,   value: stats.streak,   label: 'Day streak' },
            { Icon: LotusIcon, value: stats.total,    label: 'Check-ins'  },
            { Icon: LeafIcon,  value: stats.thisWeek, label: 'This week'  },
          ].map(s => (
            <View key={s.label} style={[styles.statCard, { backgroundColor: c.surface, ...card }]}>
              <s.Icon color={c.textMuted} size={18} />
              <Text style={[styles.statValue, { color: c.text }]}>{s.value}</Text>
              <Text style={[styles.statLabel, { color: c.textMuted }]}>{s.label}</Text>
            </View>
          ))}
        </View>

        {/* Your Assessments — dosha/guna results + intake form live here now, not just the drawer */}
        <Text style={[styles.sectionH, { color: c.text, marginBottom: 12 }]}>Your Assessments</Text>
        {(() => {
          const doshaBadge = result && result.dosha
            ? { label: cap(result.dosha), color: DOSHA_COLORS[result.dosha] } : null;
          const agniBadge = agniResult
            ? { label: (agniResults[agniResult.agniType] ?? agniResults.sama).name, color: (agniResults[agniResult.agniType] ?? agniResults.sama).color }
            : null;
          const gunaBadge = gunaResult
            ? { label: `${cap(gunaResult.dominant)} dominant`, color: gunaResults[gunaResult.dominant]?.color }
            : null;
          const tongueBadge = tongueResult
            ? { label: (tongueReadings[tongueResult.reading] ?? tongueReadings.balanced).name, color: (tongueReadings[tongueResult.reading] ?? tongueReadings.balanced).color }
            : null;
          const prakritiProgressText = tierProgressLabel(prakritiProgress);
          const vikritiProgressText = tierProgressLabel(vikritiProgress);
          const intakeFilled = intake ? SECTIONS.reduce((sum, sec) => sum + (sectionProgress(sec, intake)?.filled || 0), 0) : 0;
          const intakeTotal  = intake ? SECTIONS.reduce((sum, sec) => sum + (sectionProgress(sec, intake)?.total  || 0), 0) : 0;
          const intakeProgressText = !intakeTotal ? null
            : intakeFilled === 0 ? 'Not started'
            : intakeFilled === intakeTotal ? 'Complete'
            : `${Math.round((intakeFilled / intakeTotal) * 100)}% complete — tap to continue`;

          const rows = [
            { label: 'My Dosha',        Icon: LeafIcon, dosha: true, badge: doshaBadge, notTaken: !doshaBadge },
            { label: 'Agni Assessment', Icon: FireIcon, agni: true, badge: agniBadge, notTaken: !agniBadge },
            { label: 'Guna Assessment', Icon: GunaIcon, guna: true, badge: gunaBadge, notTaken: !gunaBadge },
            { label: 'Tongue Check',    Icon: TongueIcon, tongue: true, badge: tongueBadge, notTaken: !tongueBadge },
            { label: 'Prakriti',        Icon: PrakritiIcon, prakriti: true, progressText: prakritiProgressText, notTaken: !prakritiProgressText },
            { label: 'Vikriti',         Icon: VikritiIcon, vikriti: true, progressText: vikritiProgressText, notTaken: !vikritiProgressText },
            { label: 'My Intake Form',  Icon: ClipboardIcon, intake: true, progressText: intakeProgressText },
            { label: 'Your Activity',   Icon: ActivityIcon, activity: true },
            ...(user ? [{ label: 'Share with Thea', Icon: ShareIcon, share: true }] : []),
            // Was native-only per Matt's original Aug 7 2026 scope call (in-app
            // messaging as an app feature, not a web one) — reversed Aug 11
            // 2026, promoted on web too now. Push notifications themselves are
            // still native-only (no web push mechanism exists), so a web user
            // sending/receiving here won't get pushed, only whoever's on the
            // native app does — same as before, just visible from both places.
            ...(user ? [{ label: 'Message Thea', Icon: MessageIcon, message: true }] : []),
          ];
          return (
            <View style={[styles.settingsList, { backgroundColor: c.surface, ...card }]}>
              {rows.map((item, idx) => (
                <Pressable
                  key={item.label}
                  style={[styles.settingsRow, idx < rows.length - 1 && { borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: c.border }]}
                  disabled={item.share}
                  onPress={() => {
                    if (item.dosha) router.push(result ? '/result' : '/quiz');
                    if (item.intake) router.push('/intake');
                    if (item.activity) router.push('/activity');
                    if (item.agni) {
                      if (agniResult) {
                        router.push({
                          pathname: '/agni-result',
                          params: {
                            dominant: agniResult.agniType,
                            sama:    agniResult.counts?.sama    ?? 0,
                            vishama: agniResult.counts?.vishama ?? 0,
                            tikshna: agniResult.counts?.tikshna ?? 0,
                            manda:   agniResult.counts?.manda   ?? 0,
                          },
                        });
                      } else {
                        router.push('/agni-quiz');
                      }
                    }
                    if (item.guna) {
                      if (gunaResult) {
                        router.push({
                          pathname: '/guna-result',
                          params: {
                            dominant: gunaResult.dominant,
                            sattva: gunaResult.scores?.sattva ?? 0,
                            rajas:  gunaResult.scores?.rajas  ?? 0,
                            tamas:  gunaResult.scores?.tamas  ?? 0,
                          },
                        });
                      } else {
                        router.push('/guna-quiz');
                      }
                    }
                    if (item.tongue) {
                      if (tongueResult) {
                        router.push({
                          pathname: '/tongue-result',
                          params: {
                            shape: tongueResult.details?.shape, size: tongueResult.details?.size,
                            color: tongueResult.details?.color, coating: tongueResult.details?.coating,
                            ama: tongueResult.details?.amaLevel ?? 0,
                            signs: (tongueResult.details?.signs ?? []).join(','),
                          },
                        });
                      } else {
                        router.push('/tongue-check');
                      }
                    }
                    if (item.prakriti) router.push('/prakriti');
                    if (item.vikriti) router.push('/vikriti');
                    if (item.message) router.push('/messages');
                  }}
                >
                  <View style={[styles.settingsIconWrap, { backgroundColor: c.surfaceAlt }]}>
                    <item.Icon color={c.textMuted} size={15} />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={[styles.settingsLabel, { color: c.text, flex: 0 }]}>{item.label}</Text>
                    {item.badge && <ResultBadge label={item.badge.label} color={item.badge.color} />}
                    {item.progressText && (
                      <Text style={{ fontFamily: 'Inter_400Regular', fontSize: 12, color: c.textMuted, marginTop: 3 }}>
                        {item.progressText}
                      </Text>
                    )}
                    {item.notTaken && (
                      <Text style={{ fontFamily: 'Inter_400Regular', fontSize: 11.5, fontStyle: 'italic', color: c.textMuted, marginTop: 3 }}>
                        Not yet taken
                      </Text>
                    )}
                    {item.share && (
                      <Text style={{ fontFamily: 'Inter_400Regular', fontSize: 12, color: c.textMuted, marginTop: 1 }}>
                        {consented ? 'Thea can see your intake form' : 'Your intake form stays private'}
                      </Text>
                    )}
                  </View>
                  {item.share
                    ? <Switch value={consented} onValueChange={toggleConsent} disabled={consentBusy} />
                    : <ChevronIcon color={c.textMuted} />}
                </Pressable>
              ))}
            </View>
          );
        })()}

        {/* Your User's Manual — AI-drafted from everything you've shared, in
            Thea's voice, but only ever visible once she's reviewed and
            approved it. RLS on user_manuals returns a row to its owner only
            when status='approved', so manualAvailable already is the
            readiness check. */}
        <Text style={[styles.sectionH, { color: c.text, marginBottom: 12, marginTop: 28 }]}>Your User's Manual</Text>
        {manualAvailable ? (
          <Pressable style={[styles.manualCard, { backgroundColor: c.surface, ...card }]} onPress={() => router.push('/manual')}>
            <Text style={[styles.manualExcerpt, { color: c.text }]}>
              "Your body has been handing you pieces of your user's manual your entire life, hoping you'd slow down long enough to notice."
            </Text>
            <Text style={[styles.manualLink, { color: c.accent }]}>Read yours →</Text>
          </Pressable>
        ) : (
          <View style={[styles.settingsList, { backgroundColor: c.surface, ...card }]}>
            <View style={styles.settingsRow}>
              <View style={[styles.settingsIconWrap, { backgroundColor: c.surfaceAlt }]}>
                <ManualIcon color={c.textMuted} size={15} />
              </View>
              <Text style={[styles.settingsLabel, { color: c.textMuted }]}>Your User's Manual</Text>
              <Text style={{ fontFamily: 'Inter_400Regular', fontSize: 11, color: c.textMuted }}>soon</Text>
            </View>
          </View>
        )}

        {/* Settings */}
        <Text style={[styles.sectionH, { color: c.text, marginBottom: 12, marginTop: 28 }]}>Settings</Text>
        <View style={[styles.settingsList, { backgroundColor: c.surface, ...card }]}>
          {SETTINGS.map((item, idx) => (
            <Pressable
              key={item.label}
              style={[styles.settingsRow, idx < SETTINGS.length - 1 && { borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: c.border }]}
            >
              <View style={[styles.settingsIconWrap, { backgroundColor: c.surfaceAlt }]}>
                <item.Icon color={c.textMuted} size={15} />
              </View>
              <Text style={[styles.settingsLabel, { color: item.soon ? c.textMuted : c.text }]}>{item.label}</Text>
              {item.soon
                ? <Text style={{ fontFamily: 'Inter_400Regular', fontSize: 11, color: c.textMuted }}>soon</Text>
                : <ChevronIcon color={c.textMuted} />}
            </Pressable>
          ))}
        </View>

        {/* Account */}
        <Text style={[styles.sectionH, { color: c.text, marginBottom: 12, marginTop: 28 }]}>Account</Text>
        <View style={[styles.settingsList, { backgroundColor: c.surface, ...card }]}>
          {user ? (
            <Pressable
              style={styles.settingsRow}
              onPress={signOut}
            >
              <View style={[styles.settingsIconWrap, { backgroundColor: c.surfaceAlt }]}>
                <SignOutIcon color={c.textMuted} size={15} />
              </View>
              <Text style={[styles.settingsLabel, { color: c.text }]}>Sign out</Text>
            </Pressable>
          ) : (
            <>
              <Pressable
                style={[styles.settingsRow, { borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: c.border }]}
                onPress={() => router.push('/login')}
              >
                <View style={[styles.settingsIconWrap, { backgroundColor: c.surfaceAlt }]}>
                  <PersonIcon color={c.textMuted} size={15} />
                </View>
                <Text style={[styles.settingsLabel, { color: c.text }]}>Sign in</Text>
                <ChevronIcon color={c.textMuted} />
              </Pressable>
              <Pressable
                style={styles.settingsRow}
                onPress={() => router.push('/signup')}
              >
                <View style={[styles.settingsIconWrap, { backgroundColor: c.surfaceAlt }]}>
                  <PersonIcon color={c.accent} size={15} />
                </View>
                <Text style={[styles.settingsLabel, { color: c.accent }]}>Create account</Text>
                <ChevronIcon color={c.accent} />
              </Pressable>
            </>
          )}
        </View>

        <View style={{ alignItems: 'center', marginTop: 32 }}>
          <Text style={{ color: c.accentSoft, fontSize: 15, marginBottom: 6 }}>❧</Text>
          <Text style={{ fontFamily: 'Inter_400Regular', fontSize: 12, color: c.textMuted }}>L. GLOW</Text>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

function ImgPlaceholder({ color }) {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Svg width={22} height={22} viewBox="0 0 24 24" fill="none">
        <Rect x="2" y="4" width="20" height="16" rx="2" stroke={color} strokeWidth={1.3} />
        <Circle cx="8" cy="10" r="2" stroke={color} strokeWidth={1.3} />
        <Path d="M2 17l5-4 4 4 3-3 6 5" stroke={color} strokeWidth={1.3} strokeLinejoin="round" />
      </Svg>
      <Text style={{ color, fontSize: 9, marginTop: 5, fontFamily: 'Inter_400Regular' }}>portrait</Text>
    </View>
  );
}

// ── Icons ──────────────────────────────────────────────────────────────────

function SlidersIcon({ color }) {
  return <Svg width={20} height={20} viewBox="0 0 24 24" fill="none">
    <Path d="M4 6h16M4 12h16M4 18h16" stroke={color} strokeWidth={1.5} strokeLinecap="round" />
    <Circle cx="8" cy="6" r="2" fill={color} />
    <Circle cx="16" cy="12" r="2" fill={color} />
    <Circle cx="10" cy="18" r="2" fill={color} />
  </Svg>;
}
function PenIcon({ color, size }) {
  return <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M17 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2Z" stroke={color} strokeWidth={1.4} />
    <Path d="M9 8h6M9 12h6M9 16h4" stroke={color} strokeWidth={1.4} strokeLinecap="round" />
  </Svg>;
}
function SunIcon({ color, size }) {
  return <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Circle cx="12" cy="12" r="4" stroke={color} strokeWidth={1.5} />
    <Path d="M12 2v2M12 20v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M2 12h2M20 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" stroke={color} strokeWidth={1.5} strokeLinecap="round" />
  </Svg>;
}
function LotusIcon({ color, size }) {
  return <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Circle cx="12" cy="12" r="8" stroke={color} strokeWidth={1.4} />
    <Circle cx="12" cy="12" r="2" stroke={color} strokeWidth={1.4} />
    <Path d="M12 4v2M12 18v2M4 12h2M18 12h2" stroke={color} strokeWidth={1.4} strokeLinecap="round" />
  </Svg>;
}
function LeafIcon({ color, size }) {
  return <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M12 21C12 21 5 16 5 10a7 7 0 0 1 14 0c0 6-7 11-7 11Z" stroke={color} strokeWidth={1.5} />
    <Path d="M12 21V10" stroke={color} strokeWidth={1.5} strokeLinecap="round" />
  </Svg>;
}
function BellIcon({ color, size }) {
  return <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M6 10a6 6 0 0 1 12 0c0 3 1.5 5 2 6H4c.5-1 2-3 2-6Z" stroke={color} strokeWidth={1.4} strokeLinejoin="round" />
    <Path d="M10 20a2 2 0 0 0 4 0" stroke={color} strokeWidth={1.4} strokeLinecap="round" />
  </Svg>;
}
function QuestionIcon({ color, size }) {
  return <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Circle cx="12" cy="12" r="9" stroke={color} strokeWidth={1.4} />
    <Path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3M12 17h.01" stroke={color} strokeWidth={1.4} strokeLinecap="round" />
  </Svg>;
}
function ChevronIcon({ color }) {
  return <Svg width={16} height={16} viewBox="0 0 24 24" fill="none">
    <Path d="M9 18l6-6-6-6" stroke={color} strokeWidth={1.7} strokeLinecap="round" strokeLinejoin="round" />
  </Svg>;
}
function PersonIcon({ color, size }) {
  return <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Circle cx="12" cy="8" r="4" stroke={color} strokeWidth={1.5} />
    <Path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" stroke={color} strokeWidth={1.5} strokeLinecap="round" />
  </Svg>;
}
function GunaIcon({ color, size }) {
  return <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M12 3 L20 18 L4 18 Z" stroke={color} strokeWidth={1.4} strokeLinejoin="round" />
    <Path d="M12 8 L17 18 L7 18 Z" stroke={color} strokeWidth={0.8} strokeLinejoin="round" opacity="0.5" />
  </Svg>;
}
function FireIcon({ color, size }) {
  return <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M12 2c1 3-3 4-3 8a3 3 0 0 0 6 0c1 1 2 2.5 2 4.5A5 5 0 0 1 7 14.5C7 9 12 7 12 2Z" stroke={color} strokeWidth={1.4} strokeLinejoin="round" />
  </Svg>;
}
function TongueIcon({ color, size }) {
  return <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M12 3c3 0 5 2 5 5.5S15.5 19 12 21C8.5 19 7 12.5 7 8.5S9 3 12 3Z" stroke={color} strokeWidth={1.4} strokeLinejoin="round" />
    <Path d="M12 9v9" stroke={color} strokeWidth={1.4} strokeLinecap="round" />
  </Svg>;
}
function PrakritiIcon({ color, size }) {
  return <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M12 21V11" stroke={color} strokeWidth={1.4} strokeLinecap="round" />
    <Path d="M12 11c0-4 3-6 7-6 0 4-2 7-7 7Z" stroke={color} strokeWidth={1.4} strokeLinejoin="round" />
    <Path d="M12 14c0-3.5-2.5-5.5-6-5.5 0 3.5 2 6 6 6Z" stroke={color} strokeWidth={1.4} strokeLinejoin="round" />
  </Svg>;
}
function VikritiIcon({ color, size }) {
  return <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M3 12h3.5l2-6 3 12 2-9 1.5 3H21" stroke={color} strokeWidth={1.4} strokeLinecap="round" strokeLinejoin="round" />
  </Svg>;
}
function MessageIcon({ color, size }) {
  return <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M4 5.5h16a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1H9l-4.5 3.5V17.5H4a1 1 0 0 1-1-1v-10a1 1 0 0 1 1-1Z" stroke={color} strokeWidth={1.4} strokeLinejoin="round" />
  </Svg>;
}
function ShareIcon({ color, size }) {
  return <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Circle cx="6" cy="12" r="2.5" stroke={color} strokeWidth={1.4} />
    <Circle cx="18" cy="6" r="2.5" stroke={color} strokeWidth={1.4} />
    <Circle cx="18" cy="18" r="2.5" stroke={color} strokeWidth={1.4} />
    <Path d="M8.2 10.8 15.8 7.2M8.2 13.2 15.8 16.8" stroke={color} strokeWidth={1.4} strokeLinecap="round" />
  </Svg>;
}
function ActivityIcon({ color, size }) {
  return <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Circle cx="12" cy="12" r="8.5" stroke={color} strokeWidth={1.4} />
    <Path d="M12 7.5V12l3 2" stroke={color} strokeWidth={1.4} strokeLinecap="round" strokeLinejoin="round" />
  </Svg>;
}
function ClipboardIcon({ color, size }) {
  return <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2" stroke={color} strokeWidth={1.4} strokeLinejoin="round" />
    <Path d="M9 5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v0a2 2 0 0 1-2 2h-2a2 2 0 0 1-2-2Z" stroke={color} strokeWidth={1.4} />
    <Path d="M9 12h6M9 16h4" stroke={color} strokeWidth={1.4} strokeLinecap="round" />
  </Svg>;
}
function ManualIcon({ color, size }) {
  return <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M5 4.5C5 3.7 5.7 3 6.5 3H18a1 1 0 0 1 1 1v15a1 1 0 0 1-1 1H6.5c-.8 0-1.5-.7-1.5-1.5v-14Z" stroke={color} strokeWidth={1.4} strokeLinejoin="round" />
    <Path d="M5 17.5C5 16.7 5.7 16 6.5 16H19" stroke={color} strokeWidth={1.4} strokeLinecap="round" />
    <Path d="M8.5 7h7M8.5 10h7" stroke={color} strokeWidth={1.3} strokeLinecap="round" />
  </Svg>;
}
function SignOutIcon({ color, size }) {
  return <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" stroke={color} strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
    <Path d="M16 17l5-5-5-5M21 12H9" stroke={color} strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
  </Svg>;
}

const styles = StyleSheet.create({

  avatarSection: { alignItems: 'center', paddingVertical: 20 },
  avatarRing:    { width: 88, height: 88, borderRadius: 44, borderWidth: 1.5, position: 'relative', marginBottom: 12 },
  avatarInner:   { width: 88, height: 88, borderRadius: 44, overflow: 'hidden' },
  editBadge:     { position: 'absolute', bottom: 0, right: 0, width: 27, height: 27, borderRadius: 14, alignItems: 'center', justifyContent: 'center', borderWidth: 2 },
  name:          { fontFamily: 'PlayfairDisplay_600SemiBold', fontSize: 28, lineHeight: 36 },
  tagline:       { fontFamily: 'PlayfairDisplay_400Regular', fontSize: 15.5, fontStyle: 'italic', marginTop: 2 },

  profileEditCard: { width: '100%', borderRadius: 22, padding: 18, marginTop: 4 },
  fieldLabel: { fontFamily: 'Inter_600SemiBold', fontSize: 11, letterSpacing: 0.3, textTransform: 'uppercase', marginBottom: 6 },
  fieldInput: { borderWidth: 1, borderRadius: 10, paddingHorizontal: 12, paddingVertical: 10, fontSize: 14, fontFamily: 'Inter_400Regular' },
  profileSaveBtn: { borderRadius: 999, paddingVertical: 10, alignItems: 'center' },
  profileSaveBtnText: { color: '#FBF9F4', fontFamily: 'Inter_600SemiBold', fontSize: 13 },

  wheelCard:     { borderRadius: 26, padding: 20, alignItems: 'center', marginBottom: 14 },
  wheelLabel:    { fontFamily: 'Inter_600SemiBold', fontSize: 11, letterSpacing: 1.98, textTransform: 'uppercase', marginBottom: 20 },
  doshaBreakdown:  { flexDirection: 'row', gap: 10, marginTop: 20, width: '100%' },
  doshaStat:       { flex: 1, borderRadius: 18, paddingVertical: 14, alignItems: 'center', gap: 4 },
  doshaStatPct:    { fontFamily: 'PlayfairDisplay_600SemiBold', fontSize: 26, lineHeight: 30 },
  doshaStatName:   { fontFamily: 'Inter_600SemiBold', fontSize: 10, letterSpacing: 1.2, textTransform: 'uppercase' },
  retakeBtn:     { marginTop: 14, paddingVertical: 8, paddingHorizontal: 20, borderRadius: 999, borderWidth: 1 },
  retakeBtnText: { fontFamily: 'Inter_400Regular', fontSize: 13 },

  statCard:  { flex: 1, borderRadius: 26, padding: 15, alignItems: 'center', gap: 4 },
  statValue: { fontFamily: 'PlayfairDisplay_600SemiBold', fontSize: 25, lineHeight: 32 },
  statLabel: { fontFamily: 'Inter_400Regular', fontSize: 11, textAlign: 'center', lineHeight: 15 },

  progressCard:  { borderRadius: 26, padding: 20 },
  progressTitle: { fontFamily: 'PlayfairDisplay_600SemiBold', fontSize: 18, lineHeight: 24 },
  progressPct:   { fontFamily: 'PlayfairDisplay_600SemiBold', fontSize: 34, lineHeight: 40, color: '#9A5151' },
  progressOf:    { fontFamily: 'Inter_400Regular', fontSize: 13, lineHeight: 18 },
  track:         { height: 4, borderRadius: 2 },
  fill:          { height: 4, borderRadius: 2 },
  progressNote:  { fontFamily: 'PlayfairDisplay_400Regular', fontSize: 14.5, fontStyle: 'italic', marginTop: 10, lineHeight: 20 },

  sectionH: { fontFamily: 'PlayfairDisplay_600SemiBold', fontSize: 19, lineHeight: 24 },
  manualCard:    { borderRadius: 26, padding: 20 },
  manualExcerpt: { fontFamily: 'PlayfairDisplay_400Regular', fontSize: 15.5, fontStyle: 'italic', lineHeight: 22, marginBottom: 12 },
  manualLink:    { fontFamily: 'Inter_600SemiBold', fontSize: 13.5 },
  settingsList: { borderRadius: 26, overflow: 'hidden' },
  settingsRow:  { flexDirection: 'row', alignItems: 'center', padding: 15, gap: 12 },
  settingsIconWrap: { width: 32, height: 32, borderRadius: 16, alignItems: 'center', justifyContent: 'center' },
  settingsLabel:{ fontFamily: 'Inter_500Medium', fontSize: 15, flex: 1 },
});
