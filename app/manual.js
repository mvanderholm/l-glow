// L. Glow — "Your User's Manual" screen. Reachable only from the You tab's
// teaser card, which itself only renders once user_manuals returns a row
// (RLS gates that to status='approved' rows the signed-in user owns — see
// app/you.js). If someone lands here directly with no approved manual, the
// query below just comes back empty and this screen shows a plain "not
// ready yet" state rather than erroring.

import { View, Text, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useState, useEffect } from 'react';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../config/supabase';
import BackButton, { smartBack } from '../components/BackButton';
import SearchButton from '../components/SearchButton';

const EXCERPT = "Your body has been handing you pieces of your user's manual your entire life, hoping you'd slow down long enough to notice.";

export default function Manual() {
  const { theme } = useTheme();
  const { colors: c, spacing, type } = theme;
  const { user } = useAuth();
  const [content, setContent] = useState(null); // null = loading, false = none available

  useEffect(() => {
    if (!user) { setContent(false); return; }
    supabase.from('user_manuals').select('content').eq('user_id', user.id).maybeSingle()
      .then(({ data }) => setContent(data?.content || false));
  }, [user]);

  const paragraphs = content ? content.split(/\n{2,}/).map(p => p.trim()).filter(Boolean) : [];

  return (
    <SafeAreaView edges={['top', 'bottom']} style={{ flex: 1, backgroundColor: c.bg }}>
      <View style={{ alignSelf: 'stretch', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: spacing.lg }}>
        <BackButton onPress={() => smartBack('/you')} color={c.text} style={{ marginLeft: -10 }} />
        <SearchButton color={c.text} />
      </View>

      {content === null && (
        <View style={s.centerPad}><ActivityIndicator color={c.accent} /></View>
      )}

      {content === false && (
        <View style={s.centerPad}>
          <Text style={[type.body, { color: c.textMuted, textAlign: 'center', lineHeight: 22 }]}>
            Your User's Manual isn't ready yet. Once Thea's put one together for you, it'll show up here.
          </Text>
        </View>
      )}

      {content && (
        <ScrollView contentContainerStyle={{ padding: spacing.lg, paddingTop: spacing.sm }} showsVerticalScrollIndicator={false}>
          <Text style={[type.h1, { marginBottom: spacing.sm }]}>Your User's Manual</Text>
          <Text style={[s.excerpt, { color: c.textMedium }]}>{EXCERPT}</Text>
          <View style={{ marginTop: spacing.lg }}>
            {paragraphs.map((p, i) => (
              <Text key={i} style={[type.body, { color: c.text, lineHeight: 26, marginBottom: spacing.md }]}>{p}</Text>
            ))}
          </View>
        </ScrollView>
      )}
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  centerPad: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 32 },
  excerpt: { fontFamily: 'PlayfairDisplay_400Regular', fontSize: 16, fontStyle: 'italic', lineHeight: 24 },
});
