/**
 * Auto-incrementing document sequence generators for Quotations (QT-0001) and Invoices (INV-0001)
 */

const QUOTATION_COUNTER_KEY = 'silver_quotation_counter';
const INVOICE_COUNTER_KEY = 'silver_invoice_counter';

export function formatDocNumber(prefix, num) {
  const padded = String(num).padStart(4, '0');
  return `${prefix}-${padded}`;
}

export function getNextQuotationNumber(peek = false) {
  try {
    const raw = localStorage.getItem(QUOTATION_COUNTER_KEY);
    let counter = raw ? parseInt(raw, 10) : 1;
    if (isNaN(counter) || counter < 1) counter = 1;

    const formatted = formatDocNumber('QT', counter);
    if (!peek) {
      localStorage.setItem(QUOTATION_COUNTER_KEY, String(counter + 1));
    }
    return formatted;
  } catch {
    return 'QT-0001';
  }
}

export function getNextInvoiceNumber(peek = false) {
  try {
    const raw = localStorage.getItem(INVOICE_COUNTER_KEY);
    let counter = raw ? parseInt(raw, 10) : 1;
    if (isNaN(counter) || counter < 1) counter = 1;

    const formatted = formatDocNumber('INV', counter);
    if (!peek) {
      localStorage.setItem(INVOICE_COUNTER_KEY, String(counter + 1));
    }
    return formatted;
  } catch {
    return 'INV-0001';
  }
}

export function ensureDocNumberSequence(type, currentDocNumber) {
  try {
    if (!currentDocNumber) return;
    const match = currentDocNumber.match(/(QT|INV)-(\d+)/i);
    if (match) {
      const num = parseInt(match[2], 10);
      if (!isNaN(num)) {
        const key = match[1].toUpperCase() === 'QT' ? QUOTATION_COUNTER_KEY : INVOICE_COUNTER_KEY;
        const currentCounter = parseInt(localStorage.getItem(key) || '1', 10);
        if (num >= currentCounter) {
          localStorage.setItem(key, String(num + 1));
        }
      }
    }
  } catch (e) {
    console.error('Failed to sync sequence counter:', e);
  }
}
