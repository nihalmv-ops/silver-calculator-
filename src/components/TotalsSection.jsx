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
    <div className="totals-two-panel-grid">
      {/* Left Column: Section 04 PRICING & DISCOUNTS */}
      <section className="form-section-card">
        <div className="section-head-banner">
          <span className="section-step-badge">04</span>
          <div className="section-head-text">
            <h2 className="section-title">PRICING & DISCOUNTS</h2>
            <p className="section-subtitle">Configure adjustments, taxes, and deposit parameters.</p>
          </div>
        </div>

        <div className="totals-controls-stack">
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
                  className="input-field pl-8 font-mono"
                  placeholder={discountType === 'flat' ? '5000' : '5'}
                  value={discountValue || ''}
                  onChange={(e) => handleUpdate('discountValue', e.target.value)}
                />
              </div>
              {discountAmount > 0 && (
                <p className="text-xs text-neutral-600 mt-1.5 font-medium">
                  Discount deduction: -{formatINR(discountAmount)}
                </p>
              )}
            </div>
          </div>

          {/* GST / Tax Toggle Block */}
          <div className="control-card">
            <div className="control-card-header">
              <label className="switch-label">
                <input
                  type="checkbox"
                  checked={taxEnabled}
                  onChange={(e) => handleUpdate('taxEnabled', e.target.checked)}
                  className="checkbox-custom"
                />
                <span className="control-title">Apply GST / Tax</span>
              </label>

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
                <p className="text-xs text-neutral-600">
                  GST of {gstPercent}% on taxable {formatINR(taxableAmount)} = +{formatINR(gstAmount)}
                </p>
              ) : (
                <p className="text-xs text-neutral-400 italic">GST calculation is disabled for this document.</p>
              )}
            </div>
          </div>

          {/* Advance Booking Deposit */}
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
                  className="input-field pl-8 font-mono"
                  placeholder="e.g. 50000"
                  value={advancePaid || ''}
                  onChange={(e) => handleUpdate('advancePaid', e.target.value)}
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Right Column: Section 05 SUMMARY (Dark Summary Card) */}
      <section className="form-section-card summary-panel-card">
        <div className="section-head-banner">
          <span className="section-step-badge">05</span>
          <div className="section-head-text">
            <h2 className="section-title">SUMMARY</h2>
            <p className="section-subtitle">Review financial breakdown and balance due.</p>
          </div>
        </div>

        <div className="luxury-dark-summary-card">
          <div className="summary-line-item">
            <span className="sum-label">Subtotal</span>
            <span className="sum-val font-mono">{formatINR(subtotal)}</span>
          </div>

          {discountAmount > 0 && (
            <div className="summary-line-item sum-discount">
              <span className="sum-label">
                Discount ({discountType === 'percent' ? `${discountValue}%` : 'Flat'})
              </span>
              <span className="sum-val font-mono">- {formatINR(discountAmount)}</span>
            </div>
          )}

          {taxEnabled && gstAmount > 0 && (
            <div className="summary-line-item sum-gst">
              <span className="sum-label">GST ({gstPercent}%)</span>
              <span className="sum-val font-mono">+ {formatINR(gstAmount)}</span>
            </div>
          )}

          <div className="summary-card-divider"></div>

          <div className="summary-grand-row">
            <span className="grand-label">TOTAL</span>
            <span className="grand-val font-mono">{formatINR(grandTotal)}</span>
          </div>

          {parseFloat(advancePaid) > 0 && (
            <>
              <div className="summary-sub-split">
                <span className="sub-split-label">Advance Paid</span>
                <span className="sub-split-val font-mono">{formatINR(parseFloat(advancePaid) || 0)}</span>
              </div>
              <div className="summary-sub-split sum-balance-highlight">
                <span className="sub-split-label">Balance Due</span>
                <span className="sub-split-val font-mono">{formatINR(balanceDue)}</span>
              </div>
            </>
          )}
        </div>
      </section>
    </div>
  );
}
