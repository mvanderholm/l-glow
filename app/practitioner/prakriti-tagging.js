import DoshaTaggingScreen from '../../components/practitioner/DoshaTaggingScreen';

const TIERS = [
  { key: 'foundation', label: 'Foundation' },
  { key: 'level2', label: 'Level 2' },
  { key: 'level3', label: 'Level 3' },
];

export default function PrakritiTaggingAdmin() {
  return <DoshaTaggingScreen table="prakriti_questions" tierOptions={TIERS} title="Tag Prakriti" />;
}
