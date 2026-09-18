import React from 'react';
import { formatINR, formatDate, parseAmount } from '../utils/formatters';

export default function PrintableStatement({ details, items, totalPrice }) {
  const validItems = items.filter(
    (item) => (item.name && item.name.trim() !== '') || (item.quantity && String(item.quantity).trim() !== '')
  );

  const totalItemsCount = validItems.length;
  const numericPrice = parseAmount(totalPrice);

  return (
    <div className="printable-statement invoice-model-template" id="printable-statement">
      {/* ========================================================
          TOP HEADER: Dark Charcoal Banner with Wave & Official Logo
          ======================================================== */}
      <div className="inv-header-wrap">
        <div className="inv-header-dark">
          <div className="inv-brand-row">
            {/* Official Website Logo + Brand Text */}
            <div className="inv-logo-group">
              <div className="inv-logo-badge">
                <img
                  src="/silver_catering_logo.png"
                  alt="Silver Catering Official Logo"
                  className="inv-official-logo"
                />
              </div>
              <div className="inv-logo-text">
                <span className="inv-logo-name">SILVER CATERING</span>
                <span className="inv-logo-sub">PREMIUM WEDDING & EVENT SERVICES</span>
              </div>
            </div>

            {/* Contact Details (3 Columns with Yellow Labels) */}
            <div className="inv-contact-grid">
              <div className="inv-contact-col">
                <span className="inv-contact-label">Phone:</span>
                <span className="inv-contact-val">+91 98464 15767</span>
                <span className="inv-contact-val">+91 98470 12345</span>
              </div>
              <div className="inv-contact-col">
                <span className="inv-contact-label">Web:</span>
                <span className="inv-contact-val">info@silvercatering.in</span>
                <span className="inv-contact-val">www.silvercatering.in</span>
              </div>
              <div className="inv-contact-col">
                <span className="inv-contact-label">Area:</span>
                <span className="inv-contact-val">Valanchery, Malappuram</span>
                <span className="inv-contact-val">Kerala, 679572</span>
              </div>
            </div>
          </div>
        </div>

        {/* Double-Curved Wave Transition (Silver + White) */}
        <div className="inv-wave-box">
          <svg className="inv-wave-svg" viewBox="0 0 1000 65" preserveAspectRatio="none">
            {/* Silver Accent Curve */}
            <path d="M0,22 C320,68 660,6 1000,38 L1000,65 L0,65 Z" fill="#9da3ac" opacity="0.45" />
            {/* Crisp White Curve */}
            <path d="M0,36 C360,78 700,16 1000,48 L1000,65 L0,65 Z" fill="#ffffff" />
          </svg>
        </div>
      </div>

      {/* ========================================================
          UPPER INFO: To (Client) & Document Title Block
          ======================================================== */}
      <div className="inv-info-row">
        {/* Left: To (Client Info) */}
        <div className="inv-client-col">
          <span className="inv-to-label">To:</span>
          <h3 className="inv-client-name">{details.clientName ? details.clientName.toUpperCase() : 'RAHUL'}</h3>
          <p className="inv-client-line"><strong>Event:</strong> {details.eventName || 'Rahul Wedding'}</p>
          <p className="inv-client-line"><strong>Location:</strong> {details.eventLocation || 'Ernakulam, Kerala'}</p>
          {details.phoneNumber && (
            <p className="inv-client-line"><strong>Phone:</strong> {details.phoneNumber}</p>
          )}
        </div>

        {/* Right: Large Document Title & Meta List */}
        <div className="inv-title-col">
          <h2 className="inv-doc-title">FOOD HANDOVER NOTE</h2>
          <div className="inv-meta-table">
            <div className="inv-meta-row">
              <span className="inv-meta-k">Handover No</span>
              <span className="inv-meta-sep">:</span>
              <span className="inv-meta-v font-mono">FHN-{details.date ? details.date.replace(/[-/]/g, '') : '20260918'}-01</span>
            </div>
            <div className="inv-meta-row">
              <span className="inv-meta-k">Event</span>
              <span className="inv-meta-sep">:</span>
              <span className="inv-meta-v">{details.eventName || 'Rahul Wedding'}</span>
            </div>
            <div className="inv-meta-row">
              <span className="inv-meta-k">Date</span>
              <span className="inv-meta-sep">:</span>
              <span className="inv-meta-v">{formatDate(details.date) || details.date || '18/09/2026'}</span>
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================
          FOOD ITEMS TABLE: Yellow Item Header + Dark Qty/Unit Header
          ======================================================== */}
      <div className="inv-table-wrap">
        <table className="inv-table">
          <thead>
            <tr>
              <th className="inv-th-desc">FOOD ITEM DESCRIPTION</th>
              <th className="inv-th-dark inv-th-qty">QTY</th>
              <th className="inv-th-dark inv-th-unit">UNIT</th>
            </tr>
          </thead>
          <tbody>
            {validItems.length > 0 ? (
              validItems.map((item, index) => (
                <tr key={item.id || index} className={index % 2 === 1 ? 'inv-row-alt' : 'inv-row-white'}>
                  <td className="inv-td-desc">
                    <span className="inv-item-name">{item.name || 'General Item'}</span>
                    <span className="inv-item-sub">Kitchen Verified & Thermally Staged</span>
                  </td>
                  <td className="inv-td-qty">{item.quantity || '—'}</td>
                  <td className="inv-td-unit">{item.unit || 'KG'}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="3" className="inv-empty-row">No food items entered</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* ========================================================
          SUMMARY ROW: Notes & Yellow TOTAL PRICE Bar
          ======================================================== */}
      <div className="inv-summary-row">
        {/* Left: Handover / Quality Notes */}
        <div className="inv-notes-block">
          <h4 className="inv-notes-head">DISPATCH & QUALITY INFO</h4>
          <p className="inv-notes-p">• Packaging: Insulated Hot-Boxes & Sealed Crates</p>
          <p className="inv-notes-p">• Quality: Temperature Checked & Verified at Kitchen</p>
          <p className="inv-notes-p">• Delivery: Official Handover to Client Representative</p>
        </div>

        {/* Right: Subtotal & Yellow TOTAL PRICE Bar */}
        <div className="inv-totals-block">
          <div className="inv-subtotal-line">
            <span className="inv-subtotal-lbl">Total Items:</span>
            <span className="inv-subtotal-val">{totalItemsCount} Items</span>
          </div>

          <div className="inv-grand-total-bar">
            <span className="inv-gt-lbl">TOTAL PRICE</span>
            <span className="inv-gt-val">{formatINR(numericPrice)}</span>
          </div>
        </div>
      </div>

      {/* ========================================================
          FOOTER: Thank You Note & Signature Line
          ======================================================== */}
      <div className="inv-footer-row">
        {/* Left: Thank You & Terms */}
        <div className="inv-footer-left">
          <h4 className="inv-thanks-text">Thank you for your business!</h4>
          <p className="inv-terms-text">
            <strong>TERMS:</strong> Official food handover record. All quantities and culinary specifications verified upon delivery.
          </p>
        </div>

        {/* Right: Empty Sign and Name Area */}
        <div className="inv-footer-right">
          <div className="inv-sig-space"></div>
          <div className="inv-sig-line"></div>
          <div className="inv-sig-label">Authorized Signatory</div>
        </div>
      </div>
    </div>
  );
}
