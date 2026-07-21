import ConstitutionEditor from '../../components/practitioner/ConstitutionEditor';

const TIERS = [
  { key: 'level1', label: 'Level 1' },
  { key: 'level2', label: 'Level 2' },
  { key: 'level3', label: 'Level 3' },
];

export default function VikritiQuestionsAdmin() {
  return (
    <ConstitutionEditor
      table="vikriti_questions"
      tierOptions={TIERS}
      title="Vikriti Questions"
      subtitle="Current state, across three tiers. Tag each option's dosha(s) — one, or a blend like Vata + Kapha — with the letter chips."
    />
  );
}
