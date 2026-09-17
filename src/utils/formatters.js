/**
 * Formats a number in Indian Rupee format (e.g., ₹1,00,000)
 * Uses Indian numbering grouping (lakhs, crores).
 * @param {number|string} amount
 * @param {boolean} showSymbol
 * @returns {string}
 */
export function formatINR(amount, showSymbol = true) {
  const numericVal = typeof amount === 'number' ? amount : parseFloat(amount);

  if (isNaN(numericVal)) {
    return showSymbol ? '₹0' : '0';
  }

  const isNegative = numericVal < 0;
  const absVal = Math.abs(numericVal);

  // en-IN locale formats numbers into Indian numbering system: 1,00,000
  const formatted = new Intl.NumberFormat('en-IN', {
    maximumFractionDigits: 2,
    minimumFractionDigits: 0,
  }).format(absVal);

  const prefix = isNegative ? '-₹' : '₹';
  return showSymbol ? `${prefix}${formatted}` : `${isNegative ? '-' : ''}${formatted}`;
}

/**
 * Parses user input to a sanitized float number.
 * @param {string|number} input
 * @returns {number}
 */
export function parseAmount(input) {
  if (input === '' || input === null || input === undefined) return 0;
  if (typeof input === 'number') return isNaN(input) ? 0 : input;
  // Remove commas, rupees symbols, spaces
  const cleaned = String(input).replace(/[₹,\s]/g, '');
  const parsed = parseFloat(cleaned);
  return isNaN(parsed) ? 0 : parsed;
}

/**
 * Nicely formats YYYY-MM-DD date into Indian readable date (e.g. 17 Sep 2026)
 * @param {string} dateString
 * @returns {string}
 */
export function formatDate(dateString) {
  if (!dateString) return '—';
  try {
    const [year, month, day] = dateString.split('-');
    if (!year || !month || !day) return dateString;
    const dateObj = new Date(parseInt(year, 10), parseInt(month, 10) - 1, parseInt(day, 10));
    return new Intl.DateTimeFormat('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    }).format(dateObj);
  } catch {
    return dateString;
  }
}
