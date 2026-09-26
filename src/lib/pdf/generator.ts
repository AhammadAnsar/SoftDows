import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';

export async function generateDocumentPdf(docData: any, type: 'Quotation' | 'Invoice') {
  const pdfDoc = await PDFDocument.create();
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  
  const page = pdfDoc.addPage([595.28, 841.89]); // A4 size
  const { width, height } = page.getSize();
  
  const margin = 50;
  let y = height - margin;

  // Header
  page.drawText('SoftDows', { x: margin, y, size: 24, font: boldFont, color: rgb(0.14, 0.16, 0.34) });
  page.drawText(type.toUpperCase(), { x: width - margin - 100, y, size: 20, font: boldFont, color: rgb(0.4, 0.4, 0.4) });
  
  y -= 40;
  page.drawText(`Document No: ${docData.number}`, { x: width - margin - 150, y, size: 10, font });
  y -= 15;
  page.drawText(`Date: ${new Date(docData.issueDate || Date.now()).toLocaleDateString()}`, { x: width - margin - 150, y, size: 10, font });
  
  if (type === 'Invoice') {
    y -= 15;
    page.drawText(`Due Date: ${new Date(docData.dueDate || Date.now()).toLocaleDateString()}`, { x: width - margin - 150, y, size: 10, font });
  }

  y -= 20;
  page.drawText('Bill To:', { x: margin, y, size: 12, font: boldFont });
  y -= 15;
  page.drawText(docData.clientName || 'Client Name', { x: margin, y, size: 10, font });
  
  y -= 40;
  // Table Header
  const col1 = margin;
  const col2 = margin + 250;
  const col3 = margin + 330;
  const col4 = margin + 410;

  page.drawText('Description', { x: col1, y, size: 10, font: boldFont });
  page.drawText('Qty', { x: col2, y, size: 10, font: boldFont });
  page.drawText('Unit Price', { x: col3, y, size: 10, font: boldFont });
  page.drawText('Total', { x: col4, y, size: 10, font: boldFont });
  
  y -= 10;
  page.drawLine({ start: { x: margin, y }, end: { x: width - margin, y }, thickness: 1, color: rgb(0.8, 0.8, 0.8) });
  y -= 15;

  // Items
  for (const item of docData.items || []) {
    page.drawText(item.description, { x: col1, y, size: 10, font });
    page.drawText(item.quantity.toString(), { x: col2, y, size: 10, font });
    page.drawText((item.unitPrice / 100).toFixed(2), { x: col3, y, size: 10, font });
    page.drawText((item.lineTotal / 100).toFixed(2), { x: col4, y, size: 10, font });
    y -= 20;
  }

  y -= 10;
  page.drawLine({ start: { x: margin, y }, end: { x: width - margin, y }, thickness: 1, color: rgb(0.8, 0.8, 0.8) });
  y -= 20;

  // Totals
  page.drawText('Subtotal:', { x: col3, y, size: 10, font });
  page.drawText(((docData.subtotal || 0) / 100).toFixed(2), { x: col4, y, size: 10, font });
  y -= 15;
  page.drawText('Tax:', { x: col3, y, size: 10, font });
  page.drawText(((docData.tax || 0) / 100).toFixed(2), { x: col4, y, size: 10, font });
  y -= 15;
  page.drawText('Total:', { x: col3, y, size: 12, font: boldFont });
  page.drawText(((docData.total || 0) / 100).toFixed(2), { x: col4, y, size: 12, font: boldFont });

  if (type === 'Invoice') {
    y -= 15;
    page.drawText('Amount Paid:', { x: col3, y, size: 10, font });
    page.drawText(((docData.amountPaid || 0) / 100).toFixed(2), { x: col4, y, size: 10, font });
    y -= 15;
    page.drawText('Balance Due:', { x: col3, y, size: 12, font: boldFont, color: rgb(0.8, 0, 0) });
    page.drawText(((docData.balanceDue || 0) / 100).toFixed(2), { x: col4, y, size: 12, font: boldFont, color: rgb(0.8, 0, 0) });
  }
  
  const pdfBytes = await pdfDoc.save();
  return pdfBytes;
}
