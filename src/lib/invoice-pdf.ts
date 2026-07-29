import { paymentProviderLabel } from '@/lib/commerce-config';

function pdfSafe(value: unknown) {
  const replacements: Record<string, string> = {
    '৳': 'BDT ', '–': '-', '—': '-', '’': "'", '“': '"', '”': '"', '·': '-', '×': 'x',
  };
  return String(value ?? '')
    .split('')
    .map((character) => replacements[character] ?? character)
    .join('')
    .normalize('NFKD')
    .replace(/[^\x20-\x7E]/g, '?')
    .replace(/\\/g, '\\\\')
    .replace(/\(/g, '\\(')
    .replace(/\)/g, '\\)');
}

function wrap(value: unknown, max = 78) {
  const words = String(value ?? '').trim().split(/\s+/).filter(Boolean);
  const lines: string[] = [];
  let line = '';
  for (const word of words) {
    if (!line) line = word;
    else if (`${line} ${word}`.length <= max) line += ` ${word}`;
    else { lines.push(line); line = word; }
  }
  if (line) lines.push(line);
  return lines.length ? lines : [''];
}

function money(value: unknown) {
  return `BDT ${Number(value || 0).toFixed(0)}`;
}

export function buildInvoicePdf(order: any, settings: { siteName?: string; tagline?: string; phone?: string; email?: string }) {
  const commands: string[] = [];
  const addText = (text: unknown, x: number, y: number, size = 10, bold = false) => {
    commands.push(`BT /${bold ? 'F2' : 'F1'} ${size} Tf 1 0 0 1 ${x} ${y} Tm (${pdfSafe(text)}) Tj ET`);
  };
  const line = (x1: number, y1: number, x2: number, y2: number) => commands.push(`${x1} ${y1} m ${x2} ${y2} l S`);

  addText(settings.siteName || 'The Butterfly', 48, 792, 22, true);
  addText(settings.tagline || 'Your Dream Line', 48, 772, 10, false);
  addText('INVOICE', 472, 792, 18, true);
  addText(`Order: ${order.orderNumber}`, 405, 772, 9, false);
  addText(`Date: ${new Date(order.createdAt).toLocaleString('en-BD')}`, 362, 757, 8, false);
  line(48, 742, 547, 742);

  addText('Billed To', 48, 720, 11, true);
  addText(order.customerName, 48, 704, 10, true);
  addText(order.customerEmail, 48, 688, 9);
  addText(order.customerPhone, 48, 673, 9);

  addText('Delivery Address', 310, 720, 11, true);
  let addressY = 704;
  const address = `${order.deliveryAddress}, ${order.area}, ${order.district}, ${order.division}${order.postalCode ? ` - ${order.postalCode}` : ''}`;
  for (const addressLine of wrap(address, 48).slice(0, 4)) {
    addText(addressLine, 310, addressY, 9);
    addressY -= 14;
  }

  let y = 630;
  line(48, y + 16, 547, y + 16);
  addText('Item', 48, y, 9, true);
  addText('Details', 300, y, 9, true);
  addText('Qty', 410, y, 9, true);
  addText('Amount', 474, y, 9, true);
  y -= 18;
  line(48, y + 12, 547, y + 12);

  for (const item of (order.items || []).slice(0, 20)) {
    const itemName = wrap(item.name, 36)[0];
    addText(itemName, 48, y, 9, true);
    addText(`${item.size} / ${item.color}`, 300, y, 8);
    addText(item.quantity, 418, y, 9);
    addText(money(item.total), 474, y, 9);
    y -= 18;
  }

  y -= 4;
  line(310, y + 14, 547, y + 14);
  addText('Subtotal', 382, y, 9);
  addText(money(order.subtotal), 474, y, 9);
  y -= 17;
  addText(`Delivery (${String(order.deliveryZone || '').replaceAll('_', ' ')})`, 330, y, 9);
  addText(money(order.deliveryFee), 474, y, 9);
  y -= 19;
  addText('Grand Total', 375, y, 11, true);
  addText(money(order.total), 474, y, 11, true);

  y -= 40;
  addText('Payment', 48, y, 11, true);
  y -= 17;
  addText(`Method: ${String(order.paymentMethod).replaceAll('_', ' ')}`, 48, y, 9);
  if (order.mobileBankingProvider) {
    y -= 15;
    addText(`Provider: ${paymentProviderLabel(order.mobileBankingProvider)}`, 48, y, 9);
    y -= 15;
    addText(`Sender: ${order.paymentSenderNumber || '-'}`, 48, y, 9);
    y -= 15;
    addText(`Transaction ID: ${order.paymentTransactionId || order.paymentReference || '-'}`, 48, y, 9);
  }
  y -= 15;
  addText(`Payment Status: ${String(order.paymentStatus).replaceAll('_', ' ')}`, 48, y, 9);

  addText('Thank you for shopping with The Butterfly.', 48, 76, 10, true);
  addText(`${settings.phone || ''}${settings.email ? ` | ${settings.email}` : ''}`, 48, 58, 8);

  const content = commands.join('\n');
  const objects = [
    '<< /Type /Catalog /Pages 2 0 R >>',
    '<< /Type /Pages /Kids [3 0 R] /Count 1 >>',
    '<< /Type /Page /Parent 2 0 R /MediaBox [0 0 595 842] /Resources << /Font << /F1 4 0 R /F2 5 0 R >> >> /Contents 6 0 R >>',
    '<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>',
    '<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold >>',
    `<< /Length ${Buffer.byteLength(content, 'utf8')} >>\nstream\n${content}\nendstream`,
  ];

  let pdf = '%PDF-1.4\n';
  const offsets: number[] = [0];
  objects.forEach((object, index) => {
    offsets[index + 1] = Buffer.byteLength(pdf, 'utf8');
    pdf += `${index + 1} 0 obj\n${object}\nendobj\n`;
  });
  const xrefOffset = Buffer.byteLength(pdf, 'utf8');
  pdf += `xref\n0 ${objects.length + 1}\n0000000000 65535 f \n`;
  for (let index = 1; index <= objects.length; index += 1) {
    pdf += `${String(offsets[index]).padStart(10, '0')} 00000 n \n`;
  }
  pdf += `trailer\n<< /Size ${objects.length + 1} /Root 1 0 R >>\nstartxref\n${xrefOffset}\n%%EOF`;
  return Buffer.from(pdf, 'utf8');
}
