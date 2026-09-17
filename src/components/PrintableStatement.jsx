import React from 'react';
import { formatINR, formatDate, parseAmount } from '../utils/formatters';

export default function PrintableStatement({ details, items, totalPrice }) {
  const validItems = items.filter(
    (item) => (item.name && item.name.trim() !== '') || (item.quantity && String(item.quantity).trim() !== '')
  );

  const totalItemsCount = validItems.length;
  const numericPrice = parseAmount(totalPrice);

  return (
    <div className="printable-statement" id="printable-statement">
      {/* CATERING LOGO & TITLE */}
      <div className="print-header">
        <div className="print-logo-container">
          <div className="print-brand-badge">EST. 2010 • KERALA CATERING EXCELLENCE</div>
          <div className="print-logo-crest">
            <span className="print-crest-icon">✦ ✤ ✦</span>
          </div>
          <h1 className="print-company-name">SILVER CATERING SERVICES</h1>
          <h2 className="print-doc-title">CATERING FOOD HANDOVER NOTE</h2>
          <div className="print-ornament-line">
            <span className="print-ornament">❧ ✤ ☙</span>
          </div>
        </div>

        {/* Metadata Section */}
        <div className="print-meta-grid">
          <div className="print-meta-item">
            <span className="print-meta-label">Event:</span>
            <span className="print-meta-value highlight-event">{details.eventName || '—'}</span>
          </div>
          <div className="print-meta-item">
            <span className="print-meta-label">Date:</span>
            <span className="print-meta-value">{formatDate(details.date) || details.date || '—'}</span>
          </div>
          <div className="print-meta-item">
            <span className="print-meta-label">Client:</span>
            <span className="print-meta-value">{details.clientName || '—'}</span>
          </div>
          <div className="print-meta-item">
            <span className="print-meta-label">Location:</span>
            <span className="print-meta-value">{details.eventLocation || '—'}</span>
          </div>
          {details.phoneNumber && (
            <div className="print-meta-item">
              <span className="print-meta-label">Phone:</span>
              <span className="print-meta-value">{details.phoneNumber}</span>
            </div>
          )}
          <div className="print-meta-item">
            <span className="print-meta-label">Note Ref:</span>
            <span className="print-meta-value font-mono">FHN-{details.date ? details.date.replace(/[-/]/g, '') : 'NOTE'}-01</span>
          </div>
        </div>
      </div>

      {/* FOOD ITEMS TABLE: FOOD ITEM | QTY | UNIT */}
      <div className="print-table-container">
        <table className="print-table food-print-table">
          <thead>
            <tr>
              <th className="print-th-sl">#</th>
              <th className="print-th-desc">FOOD ITEM</th>
              <th className="print-th-qty">QTY</th>
              <th className="print-th-unit">UNIT</th>
            </tr>
          </thead>
          <tbody>
            {validItems.length > 0 ? (
              validItems.map((item, index) => (
                <tr key={item.id || index}>
                  <td className="print-td-sl">{index + 1}</td>
                  <td className="print-td-desc font-semibold">{item.name || 'General Item'}</td>
                  <td className="print-td-qty">{item.quantity || '—'}</td>
                  <td className="print-td-unit">{item.unit || 'KG'}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="print-empty-row">No food items entered</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* SUMMARY TOTAL ITEMS & TOTAL PRICE */}
      <div className="print-summary-card print-handover-summary">
        <div className="print-summary-row">
          <span className="print-sum-label">TOTAL ITEMS:</span>
          <span className="print-sum-val">{totalItemsCount}</span>
        </div>
        <div className="print-summary-divider"></div>
        <div className="print-summary-row print-total-price-row">
          <span className="print-sum-label-final">TOTAL PRICE:</span>
          <span className="print-sum-val-final text-price-highlight">
            {formatINR(numericPrice)}
          </span>
        </div>
      </div>

      {/* Signature & Confirmation Line */}
      <div className="print-footer-signatures">
        <div className="signature-col">
          <div className="signature-line"></div>
          <div className="signature-title">Client / Receiver Signature</div>
          <div className="signature-sub">({details.clientName || 'Client'})</div>
        </div>

        <div className="signature-col signature-col-right">
          <div className="signature-line"></div>
          <div className="signature-title">Kitchen / Dispatch Incharge</div>
          <div className="signature-sub">For Silver Catering Services</div>
        </div>
      </div>

      {/* Closing Acknowledgement */}
      <div className="print-closing-statement">
        <h3 className="print-closing-tag">FOOD HANDOVER NOTE</h3>
        <p className="closing-thankyou">Thank you for choosing us.</p>
        <p className="closing-note">Official dispatch & quality verification record.</p>
      </div>
    </div>
  );
}
