import { PDFDocument } from 'pdf-lib';

export const mergePDFs = async (pdfFiles: File[]): Promise<Uint8Array> => {
  const mergedPdf = await PDFDocument.create();

  for (const file of pdfFiles) {
    const bytes = await file.arrayBuffer();
    const pdf = await PDFDocument.load(bytes);
    const copiedPages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
    copiedPages.forEach((page) => mergedPdf.addPage(page));
  }

  return await mergedPdf.save();
};

export const compressPDF = async (pdfFile: File): Promise<Uint8Array> => {
  // Simple compression: loading and re-saving with pdf-lib
  // (Full compression often requires server-side or more complex logic,
  // but we'll implement the browser-side equivalent of re-processing)
  const bytes = await pdfFile.arrayBuffer();
  const pdfDoc = await PDFDocument.load(bytes);

  // Re-saving with minimal metadata and object cleaning
  return await pdfDoc.save({ useObjectStreams: true });
};

export const splitPDF = async (pdfFile: File, range: string): Promise<Uint8Array[]> => {
  const bytes = await pdfFile.arrayBuffer();
  const pdfDoc = await PDFDocument.load(bytes);
  const totalPages = pdfDoc.getPageCount();

  const results: Uint8Array[] = [];

  // Basic range parser (e.g., "1, 2-4, 5")
  const parts = range.split(',').map(p => p.trim());

  for (const part of parts) {
    const splitDoc = await PDFDocument.create();
    if (part.includes('-')) {
      const [start, end] = part.split('-').map(n => parseInt(n));
      const indices = [];
      for (let i = start - 1; i < Math.min(end, totalPages); i++) indices.push(i);
      const pages = await splitDoc.copyPages(pdfDoc, indices);
      pages.forEach(p => splitDoc.addPage(p));
    } else {
      const pageIdx = parseInt(part) - 1;
      if (pageIdx >= 0 && pageIdx < totalPages) {
        const [page] = await splitDoc.copyPages(pdfDoc, [pageIdx]);
        splitDoc.addPage(page);
      }
    }
    results.push(await splitDoc.save());
  }

  return results;
};
