import React from 'react';
import { formatINR, formatDate, parseAmount } from '../utils/formatters';
import { SECTIONS_CONFIG } from '../utils/storage';

export default function PrintableStatement({ details, sections, totalItems, totalPrice, isScreenPreview = false }) {
  const numericPrice = parseAmount(totalPrice);

  return (
    <div
      className={`printable-statement invoice-model-template ${isScreenPreview ? 'screen-a4-sheet' : ''}`}
      id={isScreenPreview ? undefined : 'printable-statement'}
    >
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
          4 FOOD TIME SECTIONS: Sequential Tables
          1. DAY MORNING | 2. DAY AFTERNOON | 3. EVENING | 4. NIGHT
          ======================================================== */}
      <div className="inv-sections-container">
        {SECTIONS_CONFIG.map((sec, secIdx) => {
          const rawItems = (sections && sections[sec.key]) || [];
          const validItems = rawItems.filter(
            (item) => (item.name && item.name.trim() !== '') || (item.quantity && String(item.quantity).trim() !== '')
          );

          return (
            <div key={sec.key} className="inv-section-block">
              {/* Section Header Banner */}
              <div className="inv-sec-header">
                <div className="inv-sec-title-left">
                  <span className="inv-sec-index">{secIdx + 1}</span>
                  <span className="inv-sec-title">{sec.label}</span>
                </div>
                <div className="inv-sec-title-right">
                  <span className="inv-sec-count">{validItems.length} {validItems.length === 1 ? 'Item' : 'Items'}</span>
                </div>
              </div>

              {/* Section Food Items Table */}
              <table className="inv-table">
                <thead>
                  <tr>
                    <th className="inv-th-desc">FOOD ITEM</th>
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
                        </td>
                        <td className="inv-td-qty">{item.quantity || '—'}</td>
                        <td className="inv-td-unit">{item.unit || 'KG'}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="3" className="inv-empty-row">No items scheduled for {sec.label}</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          );
        })}
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
            <span className="inv-subtotal-lbl">Total Items (All 4 Sections):</span>
            <span className="inv-subtotal-val">{totalItems} Items</span>
          </div>

          <div className="inv-grand-total-bar">
            <span className="inv-gt-lbl">TOTAL PRICE</span>
            <span className="inv-gt-val">{formatINR(numericPrice)}</span>
          </div>
        </div>
      </div>

      {/* ========================================================
          FOOTER: Terms & Dual Signatures (Client + Sample Manager)
          ======================================================== */}
      <div className="inv-footer-row">
        {/* Left: Client / Receiver Signature */}
        <div className="inv-footer-sig-col inv-client-sig-col">
          <div className="inv-sig-space"></div>
          <div className="inv-sig-line"></div>
          <div className="inv-sig-label">CLIENT / RECEIVER SIGNATURE</div>
          <div className="inv-sig-sub">Received in Good Condition</div>
        </div>

        {/* Center: Terms & Thank You */}
        <div className="inv-footer-center">
          <h4 className="inv-thanks-text">Thank you for choosing us!</h4>
          <p className="inv-terms-text">
            Official food handover record. All items verified upon kitchen dispatch.
          </p>
        </div>

        {/* Right: Manager Signature Sample with Official Verification Stamp */}
        <div className="inv-footer-sig-col inv-manager-sig-col">
          <div className="inv-manager-signature-wrap">
            {/* Official Circular Verification Stamp */}
            <div className="inv-seal-stamp" title="Official Dispatch Verification Seal">
              <svg viewBox="0 0 100 100" className="inv-seal-svg">
                <circle cx="50" cy="50" r="46" fill="none" stroke="#1d4ed8" strokeWidth="2.2" strokeDasharray="3 2" opacity="0.85" />
                <circle cx="50" cy="50" r="41" fill="none" stroke="#1d4ed8" strokeWidth="1" opacity="0.85" />
                <path id="sealPathTop" d="M 17,50 A 33,33 0 1,1 83,50" fill="none" />
                <path id="sealPathBot" d="M 83,50 A 33,33 0 0,1 17,50" fill="none" />
                <text fill="#1d4ed8" fontSize="6" fontWeight="800" letterSpacing="0.8" opacity="0.9">
                  <textPath href="#sealPathTop" startOffset="50%" textAnchor="middle">
                    SILVER CATERING SERVICES
                  </textPath>
                </text>
                <text fill="#1d4ed8" fontSize="5" fontWeight="700" letterSpacing="0.6" opacity="0.9">
                  <textPath href="#sealPathBot" startOffset="50%" textAnchor="middle">
                    ★ VERIFIED & APPROVED ★
                  </textPath>
                </text>
                <text x="50" y="46" fill="#1d4ed8" fontSize="7.2" fontWeight="900" textAnchor="middle" letterSpacing="0.6" opacity="0.95">
                  DISPATCH
                </text>
                <text x="50" y="56" fill="#1d4ed8" fontSize="6.2" fontWeight="800" textAnchor="middle" letterSpacing="0.4" opacity="0.95">
                  PASSED
                </text>
              </svg>
            </div>

            {/* Authentic Handwritten Cursive Signature Stroke Sample */}
            <svg viewBox="0 0 170 52" className="inv-sig-svg" preserveAspectRatio="xMidYMid meet">
              <path
                d="M 12 36 C 20 25, 26 12, 38 10 C 46 8, 48 20, 42 32 C 35 42, 24 44, 30 28 C 36 16, 52 22, 62 26 C 72 30, 80 18, 92 20 C 104 22, 110 32, 122 28 C 134 24, 148 14, 160 20 C 168 24, 156 36, 138 34 C 118 32, 98 40, 78 42"
                fill="none"
                stroke="#1e3a8a"
                strokeWidth="2.4"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M 42 30 C 60 27, 95 26, 135 28"
                fill="none"
                stroke="#1e3a8a"
                strokeWidth="1.8"
                strokeLinecap="round"
              />
              <path
                d="M 28 44 C 55 40, 105 38, 162 40"
                fill="none"
                stroke="#1e3a8a"
                strokeWidth="1.6"
                strokeLinecap="round"
                opacity="0.8"
              />
            </svg>
          </div>

          <div className="inv-sig-line"></div>
          <div className="inv-sig-label">CATERING MANAGER</div>
          <div className="inv-sig-sub">Silver Catering Services</div>
        </div>
      </div>
    </div>
  );
}


