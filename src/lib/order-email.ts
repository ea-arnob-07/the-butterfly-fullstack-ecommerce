import { buildInvoicePdf } from '@/lib/invoice-pdf';
import { paymentProviderLabel } from '@/lib/commerce-config';

function escapeHtml(value: unknown) {
  return String(value ?? '').replace(/[&<>'"]/g, (character) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;',
  }[character] || character));
}

function formatMoney(value: unknown) {
  return `৳${Number(value || 0).toLocaleString('en-BD', { maximumFractionDigits: 0 })}`;
}

function orderRows(order: any) {
  return (order.items || []).map((item: any) => `
    <tr>
      <td style="padding:10px;border-bottom:1px solid #f3dce6">${escapeHtml(item.name)}<br><span style="color:#806b76;font-size:12px">${escapeHtml(item.size)} · ${escapeHtml(item.color)}</span></td>
      <td style="padding:10px;border-bottom:1px solid #f3dce6;text-align:center">${item.quantity}</td>
      <td style="padding:10px;border-bottom:1px solid #f3dce6;text-align:right">${formatMoney(item.total)}</td>
    </tr>`).join('');
}

async function sendResendEmail(payload: Record<string, unknown>, idempotencyKey: string) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    if (process.env.NODE_ENV !== 'production') {
      console.info('[DEV EMAIL]', payload.subject, payload.to);
      return;
    }
    throw new Error('RESEND_API_KEY is not configured.');
  }
  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json', 'Idempotency-Key': idempotencyKey },
    body: JSON.stringify(payload),
  });
  if (!response.ok) throw new Error(`Resend order email failed: ${await response.text()}`);
}

export async function sendOrderEmails(input: {
  order: any;
  invoiceUrl: string;
  settings: { siteName: string; tagline: string; email: string; phone: string };
}) {
  const { order, invoiceUrl, settings } = input;
  const from = process.env.EMAIL_FROM || 'The Butterfly <onboarding@resend.dev>';
  const adminEmail = process.env.ADMIN_ORDER_EMAIL?.trim() || settings.email;
  const paymentDetails = order.paymentMethod === 'MOBILE_BANKING'
    ? `<p><strong>Provider:</strong> ${escapeHtml(paymentProviderLabel(order.mobileBankingProvider))}<br><strong>Sender:</strong> ${escapeHtml(order.paymentSenderNumber)}<br><strong>Transaction ID:</strong> ${escapeHtml(order.paymentTransactionId)}</p>`
    : '<p><strong>Payment:</strong> Cash on Delivery</p>';
  const address = `${order.deliveryAddress}, ${order.area}, ${order.district}, ${order.division}${order.postalCode ? ` - ${order.postalCode}` : ''}`;
  const invoice = buildInvoicePdf(order, settings).toString('base64');
  const attachment = [{ filename: `invoice-${order.orderNumber}.pdf`, content: invoice }];

  const customerHtml = `
    <div style="font-family:Arial,sans-serif;max-width:680px;margin:auto;padding:24px;color:#281720">
      <div style="border:1px solid #f2c9d9;border-radius:24px;overflow:hidden;background:#fff">
        <div style="padding:28px;background:#fff4f8"><p style="margin:0;color:#d4075a;font-weight:800;letter-spacing:2px;text-transform:uppercase">${escapeHtml(settings.siteName)} · ${escapeHtml(settings.tagline)}</p><h1 style="margin:10px 0 0">We received your order</h1></div>
        <div style="padding:28px"><p>Hello ${escapeHtml(order.customerName)}, your order <strong>${escapeHtml(order.orderNumber)}</strong> has been received.</p>
          <table style="width:100%;border-collapse:collapse;margin:22px 0"><thead><tr style="background:#fff4f8"><th style="padding:10px;text-align:left">Product</th><th style="padding:10px">Qty</th><th style="padding:10px;text-align:right">Amount</th></tr></thead><tbody>${orderRows(order)}</tbody></table>
          <p><strong>Subtotal:</strong> ${formatMoney(order.subtotal)}<br><strong>Delivery:</strong> ${formatMoney(order.deliveryFee)} (${escapeHtml(String(order.deliveryZone).replaceAll('_', ' '))})<br><strong>Total:</strong> ${formatMoney(order.total)}</p>
          ${paymentDetails}<p><strong>Payment status:</strong> ${escapeHtml(String(order.paymentStatus).replaceAll('_', ' '))}</p><p><strong>Delivery address:</strong><br>${escapeHtml(address)}</p>
          <a href="${escapeHtml(invoiceUrl)}" style="display:inline-block;margin-top:16px;padding:13px 22px;border-radius:999px;background:#d4075a;color:white;text-decoration:none;font-weight:700">View order & print invoice</a>
          <p style="margin-top:24px;color:#806b76;font-size:13px">The PDF invoice is also attached to this email.</p>
        </div>
      </div>
    </div>`;

  const adminHtml = `
    <div style="font-family:Arial,sans-serif;max-width:720px;margin:auto;padding:24px;color:#281720">
      <h1>New order: ${escapeHtml(order.orderNumber)}</h1>
      <p><strong>Customer:</strong> ${escapeHtml(order.customerName)}<br><strong>Phone:</strong> ${escapeHtml(order.customerPhone)}<br><strong>Email:</strong> ${escapeHtml(order.customerEmail)}</p>
      <table style="width:100%;border-collapse:collapse;margin:22px 0"><thead><tr style="background:#fff4f8"><th style="padding:10px;text-align:left">Product</th><th style="padding:10px">Qty</th><th style="padding:10px;text-align:right">Amount</th></tr></thead><tbody>${orderRows(order)}</tbody></table>
      <p><strong>Delivery:</strong> ${escapeHtml(String(order.deliveryZone).replaceAll('_', ' '))} · ${formatMoney(order.deliveryFee)}<br><strong>Grand total:</strong> ${formatMoney(order.total)}</p>
      ${paymentDetails}
      ${order.paymentScreenshotUrl ? `<p><a href="${escapeHtml(order.paymentScreenshotUrl)}">Open payment screenshot</a></p>` : ''}
      <p><strong>Address:</strong><br>${escapeHtml(address)}</p>
      ${order.notes ? `<p><strong>Customer note:</strong><br>${escapeHtml(order.notes)}</p>` : ''}
      <p><a href="${escapeHtml(invoiceUrl)}">Open order invoice</a></p>
    </div>`;

  await Promise.all([
    sendResendEmail({ from, to: [order.customerEmail], subject: `Order ${order.orderNumber} received - ${settings.siteName}`, html: customerHtml, attachments: attachment }, `order-${order.id}-customer`),
    sendResendEmail({ from, to: [adminEmail], subject: `New order ${order.orderNumber} - ${order.customerName}`, html: adminHtml, attachments: attachment }, `order-${order.id}-admin`),
  ]);
}
