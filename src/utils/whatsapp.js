/**
 * WhatsApp message generation & deep linking for Silver Catering Quotations & Invoices
 */
import { formatINR, formatDate } from './formatters';

export function sanitizePhoneNumber(phone) {
  if (!phone) return '';
  // Strip non-digits
  const digits = String(phone).replace(/\D/g, '');
  // If 10 digits without country code, prepend India's 91
  if (digits.length === 10) {
    return '91' + digits;
  }
  return digits;
}

export function generateWhatsAppMessage(doc, isInvoice = false) {
  const isInv = isInvoice || doc.type === 'invoice';
  const docTitle = isInv ? 'TAX INVOICE' : 'CATERING QUOTATION';
  const docNum = doc.number || (isInv ? 'INV-0001' : 'QT-0001');
  const eventDateStr = formatDate(doc.eventDate || doc.date);

  let message = `*SILVER CATERING SERVICES*\n`;
  message += `_Premium Kerala Catering for Weddings & Events_\n`;
  message += `Valanchery, Malappuram | +91 98464 15767\n`;
  message += `━━━━━━━━━━━━━━━━━━━━━\n`;
  message += `📄 *${docTitle}:* #${docNum}\n`;
  message += `👤 *Client:* ${doc.customerName || 'Valued Client'}\n`;
  if (doc.eventName) message += `🎉 *Event:* ${doc.eventName}\n`;
  message += `📅 *Date:* ${eventDateStr}\n`;
  if (doc.eventTime) message += `⏰ *Time:* ${doc.eventTime}\n`;
  if (doc.venue) message += `📍 *Venue:* ${doc.venue}\n`;
  if (doc.guests) message += `👥 *Guests:* ${doc.guests} Pax\n`;
  message += `━━━━━━━━━━━━━━━━━━━━━\n`;
  message += `*SERVICES BREAKDOWN:*\n`;

  if (Array.isArray(doc.items) && doc.items.length > 0) {
    doc.items.forEach((item, idx) => {
      if (item.name || item.rate) {
        const itemAmt = formatINR(item.amount || (item.quantity * item.rate) || 0);
        message += `${idx + 1}. *${item.name || 'Service'}* (${item.quantity || 1} ${item.unit || 'Pax'}) — ${itemAmt}\n`;
      }
    });
  } else {
    message += `• Catering arrangement as discussed\n`;
  }

  message += `━━━━━━━━━━━━━━━━━━━━━\n`;
  if (doc.subtotal) message += `Subtotal: ${formatINR(doc.subtotal)}\n`;
  if (doc.discountAmount > 0) message += `Discount: -${formatINR(doc.discountAmount)}\n`;
  if (doc.gstAmount > 0) message += `GST (${doc.gstPercent || 5}%): +${formatINR(doc.gstAmount)}\n`;
  message += `*Grand Total: ${formatINR(doc.grandTotal || 0)}*\n`;

  if (isInv) {
    message += `Advance Paid: ${formatINR(doc.advancePaid || 0)}\n`;
    message += `*Balance Due: ${formatINR(doc.balanceDue || 0)}*\n`;
    message += `*Status:* [${doc.paymentStatus || 'PENDING'}]\n`;
  } else if (doc.advancePaid > 0) {
    message += `Advance Paid: ${formatINR(doc.advancePaid)}\n`;
    message += `Balance Due: ${formatINR(doc.balanceDue || 0)}\n`;
  }

  message += `━━━━━━━━━━━━━━━━━━━━━\n`;
  message += `Thank you for choosing Silver Catering Services! For any queries or confirmations, please contact manager at +91 98464 15767.`;

  return message;
}

export function openWhatsAppShare(doc, isInvoice = false) {
  const message = generateWhatsAppMessage(doc, isInvoice);
  const encoded = encodeURIComponent(message);
  const sanitizedPhone = sanitizePhoneNumber(doc.customerPhone);

  const url = sanitizedPhone
    ? `https://wa.me/${sanitizedPhone}?text=${encoded}`
    : `https://wa.me/?text=${encoded}`;

  window.open(url, '_blank', 'noopener,noreferrer');
}
