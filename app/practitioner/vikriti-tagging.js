import DoshaTaggingScreen from '../../components/practitioner/DoshaTaggingScreen';

const TIERS = [
  { key: 'level1', label: 'Level 1' },
  { key: 'level2', label: 'Level 2' },
  { key: 'level3', label: 'Level 3' },
];

export default function VikritiTaggingAdmin() {
  return <DoshaTaggingScreen table="vikriti_questions" tierOptions={TIERS} title="Tag Vikriti" />;
}
