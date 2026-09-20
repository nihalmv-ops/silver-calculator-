import React from 'react';
import { formatINR } from '../utils/formatters';
import { calcDiscount, calcGST, calcGrandTotal, calcBalance } from '../utils/calculations';

export default function TotalsSection({
  subtotal = 0,
  discountType = 'flat',
  discountValue = '0',
  taxEnabled = true,
  gstPercent = '5',
  advancePaid = '0',
  onChange,
  isInvoice = false
}) {
  const discountAmount = calcDiscount(subtotal, discountType, discountValue);
  const taxableAmount = Math.max(0, subtotal - discountAmount);
  const gstAmount = taxEnabled ? calcGST(taxableAmount, gstPercent) : 0;
  const grandTotal = calcGrandTotal(subtotal, discountAmount, gstAmount);
  const balanceDue = calcBalance(grandTotal, advancePaid);

  const handleUpdate = (field, value) => {
    onChange({ [field]: value });
  };

  return (
    <section className="form-card totals-card">
      <div className="section-header-banner">
        <div className="section-icon-bubble">
          <span className="font-bold text-emerald-800 text-lg">₹</span>
        </div>
        <div>
          <h2 className="section-title">SECTION E: CALCULATION & TOTALS</h2>
          <p className="section-subtitle">Subtotals, discounts, tax configurations, and balances</p>
        </div>
      </div>

      <div className="totals-content-grid">
        {/* Left Column: Adjustments (Discount & Tax) */}
        <div className="totals-controls-col">
          {/* Discount Block */}
          <div className="control-card">
            <div className="control-card-header">
              <span className="control-title">Discount Adjustment</span>
              <div className="discount-type-toggle">
                <button
                  type="button"
                  className={`toggle-btn ${discountType === 'flat' ? 'active' : ''}`}
                  onClick={() => handleUpdate('discountType', 'flat')}
                >
                  Flat ₹
                </button>
                <button
                  type="button"
                  className={`toggle-btn ${discountType === 'percent' ? 'active' : ''}`}
                  onClick={() => handleUpdate('discountType', 'percent')}
                >
                  Percentage %
                </button>
              </div>
            </div>
            <div className="control-card-body">
              <div className="relative flex items-center">
                <span className="control-prefix">{discountType === 'flat' ? '₹' : '%'}</span>
                <input
                  type="number"
                  min="0"
                  step="any"
                  className="input-field pl-8"
                  placeholder={discountType === 'flat' ? '5000' : '5'}
                  value={discountValue || ''}
                  onChange={(e) => handleUpdate('discountValue', e.target.value)}
                />
              </div>
              {discountAmount > 0 && (
                <p className="text-xs text-emerald-700 mt-1 font-medium">
                  Discount applied: -{formatINR(discountAmount)}
                </p>
              )}
            </div>
          </div>

          {/* GST / Tax Toggle Block */}
          <div className="control-card">
            <div className="control-card-header">
              <div className="flex items-center gap-2">
                <label className="switch-label">
                  <input
                    type="checkbox"
                    checked={taxEnabled}
                    onChange={(e) => handleUpdate('taxEnabled', e.target.checked)}
                    className="checkbox-custom"
                  />
                  <span className="control-title">Apply GST / Tax</span>
                </label>
              </div>

              {taxEnabled && (
                <div className="tax-rate-chips">
                  {['5', '12', '18'].map((pct) => (
                    <button
                      key={pct}
                      type="button"
                      className={`tax-chip ${gstPercent === pct ? 'active' : ''}`}
                      onClick={() => handleUpdate('gstPercent', pct)}
                    >
                      {pct}%
                    </button>
                  ))}
                </div>
              )}
            </div>
            <div className="control-card-body">
              {taxEnabled ? (
                <p className="text-xs text-emerald-800">
                  GST of {gstPercent}% on taxable {formatINR(taxableAmount)} = +{formatINR(gstAmount)}
                </p>
              ) : (
                <p className="text-xs text-gray-500 italic">GST is currently disabled for this document.</p>
              )}
            </div>
          </div>

          {/* Advance Amount (Editable in Quotation & Invoice) */}
          <div className="control-card">
            <div className="control-card-header">
              <span className="control-title">
                {isInvoice ? 'Advance Received (Paid)' : 'Advance Booking Deposit (Optional)'}
              </span>
            </div>
            <div className="control-card-body">
              <div className="relative flex items-center">
                <span className="control-prefix">₹</span>
                <input
                  type="number"
                  min="0"
                  step="any"
                  className="input-field pl-8"
                  placeholder="e.g. 50000"
                  value={advancePaid || ''}
                  onChange={(e) => handleUpdate('advancePaid', e.target.value)}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Breakdown Summary Display */}
        <div className="totals-summary-display-col">
          <div className="summary-receipt-box">
            <div className="receipt-row">
              <span className="receipt-label">Subtotal</span>
              <span className="receipt-value font-mono font-semibold">{formatINR(subtotal)}</span>
            </div>

            {discountAmount > 0 && (
              <div className="receipt-row text-rose-700">
                <span className="receipt-label">
                  Discount ({discountType === 'percent' ? `${discountValue}%` : 'Flat'})
                </span>
                <span className="receipt-value font-mono">- {formatINR(discountAmount)}</span>
              </div>
            )}

            {taxEnabled && (
              <div className="receipt-row text-emerald-800">
                <span className="receipt-label">GST ({gstPercent}%)</span>
                <span className="receipt-value font-mono">+ {formatINR(gstAmount)}</span>
              </div>
            )}

            <div className="receipt-divider"></div>

            <div className="receipt-row grand-total-row">
              <span className="receipt-label-grand">GRAND TOTAL</span>
              <span className="receipt-value-grand">{formatINR(grandTotal)}</span>
            </div>

            <div className="receipt-row text-gray-700 pt-2 border-t border-dashed border-gray-300">
              <span className="receipt-label">Advance Paid</span>
              <span className="receipt-value font-mono">{formatINR(parseFloat(advancePaid) || 0)}</span>
            </div>

            <div className="receipt-row balance-due-row">
              <span className="receipt-label-balance">BALANCE DUE</span>
              <span className="receipt-value-balance">{formatINR(balanceDue)}</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
