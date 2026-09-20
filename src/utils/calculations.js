/**
 * Pure calculation utilities for Silver Catering Quotations & Invoices
 */

export function calcRowAmount(qty, rate) {
  const q = parseFloat(qty) || 0;
  const r = parseFloat(rate) || 0;
  return Math.round(q * r * 100) / 100;
}

export function calcSubtotal(items = []) {
  if (!Array.isArray(items)) return 0;
  const sum = items.reduce((acc, item) => {
    const rowAmt = calcRowAmount(item.quantity, item.rate);
    return acc + rowAmt;
  }, 0);
  return Math.round(sum * 100) / 100;
}

export function calcDiscount(subtotal, discountType = 'flat', discountValue = 0) {
  const val = parseFloat(discountValue) || 0;
  if (val <= 0 || subtotal <= 0) return 0;

  let discount = 0;
  if (discountType === 'percent') {
    const pct = Math.min(100, Math.max(0, val));
    discount = (subtotal * pct) / 100;
  } else {
    discount = Math.min(subtotal, val);
  }
  return Math.round(discount * 100) / 100;
}

export function calcGST(taxableAmount, gstPercent = 0) {
  const pct = parseFloat(gstPercent) || 0;
  if (pct <= 0 || taxableAmount <= 0) return 0;
  return Math.round(((taxableAmount * pct) / 100) * 100) / 100;
}

export function calcGrandTotal(subtotal, discountAmount = 0, gstAmount = 0) {
  const taxable = Math.max(0, subtotal - discountAmount);
  return Math.round((taxable + gstAmount) * 100) / 100;
}

export function calcBalance(grandTotal, advancePaid = 0) {
  const adv = parseFloat(advancePaid) || 0;
  return Math.max(0, Math.round((grandTotal - adv) * 100) / 100);
}

export function determinePaymentStatus(grandTotal, advancePaid = 0) {
  const total = parseFloat(grandTotal) || 0;
  const adv = parseFloat(advancePaid) || 0;

  if (total <= 0) return 'PENDING';
  if (adv >= total) return 'PAID';
  if (adv > 0 && adv < total) return 'PARTIALLY PAID';
  return 'PENDING';
}
