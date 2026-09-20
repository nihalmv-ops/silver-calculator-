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
  message += `👤 *Customer Name:* ${doc.customerName || 'Valued Customer'}\n`;
  if (doc.customerPhone) message += `📞 *Contact Number:* ${doc.customerPhone}\n`;
  if (doc.eventName) message += `🎉 *Event Name:* ${doc.eventName}\n`;
  message += `📅 *Event Date:* ${eventDateStr}\n`;
  if (doc.eventTime) message += `⏰ *Time:* ${doc.eventTime}\n`;
  if (doc.venue) message += `📍 *Venue:* ${doc.venue}\n`;
  if (doc.guests) message += `👥 *Number of Guests (Pax):* ${doc.guests} Guests\n`;
  message += `━━━━━━━━━━━━━━━━━━━━━\n`;
  message += `*SERVICES & QUANTITY:*\n`;

  if (Array.isArray(doc.items) && doc.items.length > 0) {
    const validItems = doc.items.filter(
      (it) => (it.name && it.name.trim() !== '') || (parseFloat(it.rate) > 0)
    );

    if (validItems.length > 0) {
      validItems.forEach((item, idx) => {
        const unitDisplay = item.unit && !['Guests', 'Pax', 'Nos', 'PCS', 'Fixed', 'Set', 'Event'].includes(item.unit)
          ? ` ${item.unit}`
          : '';
        message += `${idx + 1}. *${item.name || 'Service'}* — ${item.quantity || 1}${unitDisplay}\n`;
      });
    } else {
      message += `• Catering arrangement as discussed\n`;
    }
  } else {
    message += `• Catering arrangement as discussed\n`;
  }

  message += `━━━━━━━━━━━━━━━━━━━━━\n`;
  message += `*TOTAL AMOUNT: ${formatINR(doc.grandTotal || 0)}*\n`;

  if (isInv) {
    message += `ADVANCE PAID: ${formatINR(doc.advancePaid || 0)}\n`;
    message += `*BALANCE DUE: ${formatINR(doc.balanceDue || 0)}*\n`;
    message += `*Payment Status:* [${doc.paymentStatus || 'PENDING'}]\n`;
    message += `━━━━━━━━━━━━━━━━━━━━━\n`;
    message += `💳 *PAYMENT / BANK DETAILS:*\n`;
    message += `• Bank: Federal Bank, Valanchery\n`;
    message += `• A/C No: 15470200008432\n`;
    message += `• IFSC: FDRL0001547\n`;
    message += `• GPay / UPI: 9846415767@okaxis\n`;
  } else if (parseFloat(doc.advancePaid) > 0) {
    message += `Advance Proposed: ${formatINR(doc.advancePaid)}\n`;
    message += `*Estimated Balance: ${formatINR(doc.balanceDue || 0)}*\n`;
  }

  message += `━━━━━━━━━━━━━━━━━━━━━\n`;
  message += `Thank you for choosing Silver Catering Services! For any queries, please call Manager at +91 98464 15767.`;

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

