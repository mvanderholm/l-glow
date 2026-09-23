import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

// Real, in-browser PDF generation for web -- bypasses window.print()
// entirely, so there's no OS/browser print-dialog chrome to fight with
// (no date stamp, no "about:blank" title, no URL). We render each
// `.page` div from cleansePdf.js's html into its own image via
// html2canvas, then place it into a real PDF via jsPDF, splitting any
// image taller than one physical page into multiple pages (a section
// like "Recipe guide" is naturally longer than one page). Page numbers
// are ours to draw, not the browser's, so we know the true final count.
//
// Known tradeoff: content is rasterized (an image per page), not
// selectable text, and a recipe card can visually split across a page
// boundary since the CSS `break-inside: avoid` rule only applies to
// real browser pagination, not this slice-an-image technique. Acceptable
// for a downloadable guide; not worth a full vector-PDF rewrite
// (pdfmake) for this.

const PAGE_WIDTH = 612; // US Letter, points
const PAGE_HEIGHT = 792;
const FOOTER_COLOR = [138, 122, 110]; // COLORS.muted from cleansePdf.js

export async function generateAndDownloadPdf(html, filename) {
  const container = document.createElement('div');
  container.style.position = 'fixed';
  container.style.left = '-99999px';
  container.style.top = '0';
  container.style.width = `${PAGE_WIDTH}px`;
  container.innerHTML = html;
  document.body.appendChild(container);

  try {
    const pageEls = Array.from(container.querySelectorAll('.page'));
    const pdf = new jsPDF({ unit: 'pt', format: 'letter' });
    const slices = [];

    for (const el of pageEls) {
      const canvas = await html2canvas(el, { scale: 2, backgroundColor: '#F7F3EC', useCORS: true });
      const imgWidth = PAGE_WIDTH;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      const pageHeightPx = (PAGE_HEIGHT * canvas.width) / imgWidth;

      let renderedPx = 0;
      while (renderedPx < canvas.height) {
        const sliceHeightPx = Math.min(pageHeightPx, canvas.height - renderedPx);
        const sliceCanvas = document.createElement('canvas');
        sliceCanvas.width = canvas.width;
        sliceCanvas.height = sliceHeightPx;
        const ctx = sliceCanvas.getContext('2d');
        ctx.drawImage(canvas, 0, renderedPx, canvas.width, sliceHeightPx, 0, 0, canvas.width, sliceHeightPx);
        slices.push({
          dataUrl: sliceCanvas.toDataURL('image/jpeg', 0.92),
          height: (sliceHeightPx * imgWidth) / canvas.width,
        });
        renderedPx += sliceHeightPx;
      }
    }

    slices.forEach((slice, i) => {
      if (i > 0) pdf.addPage();
      pdf.addImage(slice.dataUrl, 'JPEG', 0, 0, PAGE_WIDTH, slice.height);
      pdf.setFontSize(8.5);
      pdf.setTextColor(...FOOTER_COLOR);
      pdf.text(`Page ${i + 1} of ${slices.length}`, PAGE_WIDTH / 2, PAGE_HEIGHT - 18, { align: 'center' });
    });

    pdf.save(filename);
  } finally {
    document.body.removeChild(container);
  }
}
