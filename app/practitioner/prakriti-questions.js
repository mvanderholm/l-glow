import ConstitutionEditor from '../../components/practitioner/ConstitutionEditor';

const TIERS = [
  { key: 'foundation', label: 'Foundation' },
  { key: 'level2', label: 'Level 2' },
  { key: 'level3', label: 'Level 3' },
];

export default function PrakritiQuestionsAdmin() {
  return (
    <ConstitutionEditor
      table="prakriti_questions"
      tierOptions={TIERS}
      title="Prakriti Questions"
      subtitle="Birth constitution, across three tiers. Tag each option's dosha(s) — one, or a blend like Vata + Kapha — with the letter chips."
    />
  );
}
