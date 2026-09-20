import React from 'react';
import { formatINR } from '../utils/formatters';
import { determinePaymentStatus, calcBalance } from '../utils/calculations';
import { CheckCircleIcon, ClockIcon, AlertCircleIcon, TagIcon } from './icons';
import { PAYMENT_METHODS } from '../utils/storage';

export default function PaymentSummary({
  grandTotal = 0,
  advancePaid = '0',
  paymentMethod = 'GPay / UPI',
  transactionNotes = '',
  onChange
}) {
  const adv = parseFloat(advancePaid) || 0;
  const balance = calcBalance(grandTotal, adv);
  const status = determinePaymentStatus(grandTotal, adv);

  const getStatusBadge = () => {
    switch (status) {
      case 'PAID':
        return (
          <span className="badge-paid">
            <CheckCircleIcon className="w-4 h-4 mr-1" />
            PAID IN FULL
          </span>
        );
      case 'PARTIALLY PAID':
        return (
          <span className="badge-partially-paid">
            <ClockIcon className="w-4 h-4 mr-1" />
            PARTIALLY PAID
          </span>
        );
      case 'PENDING':
      default:
        return (
          <span className="badge-pending">
            <AlertCircleIcon className="w-4 h-4 mr-1" />
            PAYMENT PENDING
          </span>
        );
    }
  };

  return (
    <section className="form-section-card payment-summary-card">
      <div className="section-head-banner flex justify-between items-center">
        <div className="flex items-center gap-3">
          <span className="section-step-badge">06</span>
          <div className="section-head-text">
            <h2 className="section-title">INVOICE PAYMENT RECONCILIATION</h2>
            <p className="section-subtitle">Real-time status of deposits received and remaining balance.</p>
          </div>
        </div>
        <div className="status-badge-container">
          {getStatusBadge()}
        </div>
      </div>

      <div className="payment-status-grid">
        {/* Total Amount */}
        <div className="payment-metric-card">
          <span className="metric-label">Total Invoice Amount</span>
          <span className="metric-value font-mono">{formatINR(grandTotal)}</span>
        </div>

        {/* Advance Paid */}
        <div className="payment-metric-card">
          <span className="metric-label">Advance Received</span>
          <span className="metric-value font-mono text-neutral-900">{formatINR(adv)}</span>
        </div>

        {/* Balance Due */}
        <div className={`payment-metric-card ${balance > 0 ? 'metric-balance-due' : 'metric-balance-zero'}`}>
          <span className="metric-label">Remaining Balance Due</span>
          <span className="metric-value font-mono">
            {formatINR(balance)}
          </span>
        </div>
      </div>

      <div className="form-grid-2 mt-4">
        {/* Payment Method */}
        <div className="input-group">
          <label className="input-label" htmlFor="payment-method">
            <TagIcon className="w-4 h-4 text-neutral-500" />
            <span>Payment Method</span>
          </label>
          <select
            id="payment-method"
            className="input-field"
            value={paymentMethod}
            onChange={(e) => onChange({ paymentMethod: e.target.value })}
          >
            {PAYMENT_METHODS.map((method) => (
              <option key={method} value={method}>
                {method}
              </option>
            ))}
          </select>
        </div>

        {/* Transaction Notes / Ref ID */}
        <div className="input-group">
          <label className="input-label" htmlFor="transaction-notes">
            <ClockIcon className="w-4 h-4 text-neutral-500" />
            <span>Transaction ID / Payment Notes</span>
          </label>
          <input
            id="transaction-notes"
            type="text"
            className="input-field"
            placeholder="e.g. Paid via Google Pay Ref: UPI/9846415767-101"
            value={transactionNotes || ''}
            onChange={(e) => onChange({ transactionNotes: e.target.value })}
          />
        </div>
      </div>
    </section>
  );
}
