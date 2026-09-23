// Native no-op stub. The real implementation is generateWebPdf.web.js
// (jsPDF/html2canvas are web-only DOM libraries) -- app/cleanse.js only
// calls this on Platform.OS === 'web', so this native version should
// never actually run, but it must exist so Metro can resolve the import
// on iOS/Android without pulling in browser-only dependencies.
export async function generateAndDownloadPdf() {
  throw new Error('generateAndDownloadPdf is web-only; native uses expo-print instead.');
}
