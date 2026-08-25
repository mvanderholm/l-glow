// [DRAFT] copy — written in Thea's voice per the voice guide, but not yet
// reviewed by her. Flag for her line-edit pass before this is final, same
// as the other [DRAFT]-tagged screens (welcome.js, about.js).
//
// Shows once, automatically, on a new signee's first home-screen visit —
// answers "I don't know what to do" directly (real test-user feedback, see
// supabase/migrations/TODO.md). Two paths: self-serve (all six assessments,
// take in any order, no locking) or skip straight to working with Thea
// (intake form). Gated on its own AsyncStorage flag (loadOnboardingJourneySeen
// / saveOnboardingJourneySeen in data/user/storage.js) — separate from the
// existing ONBOARDED flag, which just means "has seen the welcome screen."
// Deliberately kept alongside the smaller GettingStartedCard on the home
// screen (Matt's call) rather than replacing it — this modal is the one-time
// full tour; that card is the ongoing nudge for whichever of its two steps
// (dosha quiz, first check-in) aren't done yet.
//
// The actual checklist UI lives in AssessmentsChecklistModal, shared with
// each individual assessment's result screen (added Aug 23 2026 so finishing
// one assessment points you at the rest instead of dead-ending on You).
// This component only owns the auto-show-once/seen-flag behavior on top of it.

import { useEffect, useState } from 'react';
import { saveOnboardingJourneySeen, loadOnboardingJourneySeen } from '../data/user/storage';
import AssessmentsChecklistModal from './AssessmentsChecklistModal';

export default function OnboardingJourneyModal() {
  const [visible, setVisible] = useState(false);

  useEffect(() => { checkAndMaybeShow(); }, []);

  async function checkAndMaybeShow() {
    const seen = await loadOnboardingJourneySeen();
    if (!seen) setVisible(true);
  }

  function dismiss() {
    setVisible(false);
    saveOnboardingJourneySeen();
  }

  return (
    <AssessmentsChecklistModal
      visible={visible}
      onDismiss={dismiss}
      title="New here? We got you."
      subtitle="Six quick reads on your body and mind. Take them in order, or jump around — nothing here is timed or graded."
    />
  );
}
