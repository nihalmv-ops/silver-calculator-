import React from 'react';
import { formatINR, formatDate } from '../utils/formatters';
import {
  PrinterIcon,
  WhatsAppIcon,
  EditIcon,
  ArrowRightIcon,
  ReceiptIcon
} from './icons';
import { openWhatsAppShare } from '../utils/whatsapp';

export default function QuotationPreview({
  quotation,
  onEdit,
  onConvertToInvoice,
  isPrintOnly = false
}) {
  const items = quotation.items || [];
  const validItems = items.filter(
    (it) => (it.name && it.name.trim() !== '') || (parseFloat(it.rate) > 0)
  );

  const handlePrint = () => {
    window.print();
  };

  const handleWhatsApp = () => {
    openWhatsAppShare(quotation, false);
  };

  return (
    <div className={`quotation-preview-wrapper ${isPrintOnly ? 'print-only-container' : ''}`}>
      {/* On-screen Action Toolbar */}
      {!isPrintOnly && (
        <div className="preview-action-toolbar no-print">
          <div className="toolbar-left">
            <span className="doc-pill-quotation">QUOTATION PREVIEW</span>
            <span className="font-semibold text-emerald-950 font-mono">#{quotation.number || 'QT-0001'}</span>
          </div>

          <div className="toolbar-actions-group">
            <button
              type="button"
              className="btn-toolbar-action btn-secondary"
              onClick={onEdit}
            >
              <EditIcon className="w-4 h-4" />
              <span>Edit</span>
            </button>

            <button
              type="button"
              className="btn-toolbar-action btn-secondary"
              onClick={handlePrint}
            >
              <PrinterIcon className="w-4 h-4" />
              <span>Print / Save PDF</span>
            </button>

            <button
              type="button"
              className="btn-toolbar-action btn-whatsapp"
              onClick={handleWhatsApp}
            >
              <WhatsAppIcon className="w-4 h-4" />
              <span>WhatsApp</span>
            </button>

            {onConvertToInvoice && (
              <button
                type="button"
                className="btn-toolbar-action btn-convert-invoice"
                onClick={onConvertToInvoice}
                title="Convert this quotation directly into a tax/catering invoice"
              >
                <ReceiptIcon className="w-4 h-4" />
                <span>Convert to Invoice</span>
                <ArrowRightIcon className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      )}

      {/* A4 Sheet Container */}
      <div className="a4-sheet-container printable-document quotation-document">
        {/* Top Regal Crest Ornament */}
        <div className="doc-regal-top-crest">
          <span className="crest-line"></span>
          <span className="crest-tag">✦ ESTD. 2010 • VALANCHERY, MALAPPURAM • LUXURY WEDDINGS & EVENTS ✦</span>
          <span className="crest-line"></span>
        </div>

        {/* Brand Header */}
        <div className="doc-header-block">
          <div className="doc-brand-top">
            <div className="doc-logo-box">
              <img
                src="/silver_catering_logo.png"
                alt="Silver Catering Services Official Logo"
                className="doc-brand-logo"
              />
            </div>
            <div className="doc-company-details">
              <h1 className="doc-company-title">SILVER CATERING SERVICES</h1>
              <p className="doc-company-tagline">Premium Catering Services for Weddings & Events</p>
              <div className="doc-company-rule">
                <span className="rule-dot">◆</span>
                <span className="rule-line"></span>
                <span className="rule-dot">◆</span>
              </div>
              <p className="doc-company-meta">
                Valanchery, Malappuram, Kerala 679572 • <strong>Phone:</strong> +91 98464 15767
              </p>
              <p className="doc-company-email"><strong>Email:</strong> Silvereventsandcaters@gmail.com</p>
            </div>

            {/* Official Verification Seal */}
            <div className="doc-seal-emblem">
              <div className="seal-circle">
                <span className="seal-stars">★ ★ ★</span>
                <span className="seal-org">SILVER CATERING</span>
                <span className="seal-type">OFFICIAL PROPOSAL</span>
                <span className="seal-loc">KERALA</span>
              </div>
            </div>
          </div>

          <div className="doc-title-banner quotation-theme">
            <div className="flex items-center gap-2">
              <span className="doc-title-text">CATERING QUOTATION</span>
              <span className="doc-title-badge">ESTIMATE</span>
            </div>
            <span className="doc-num-tag">REF: #{quotation.number || 'QT-0001'}</span>
          </div>
        </div>

        {/* Customer & Event Details Two-Column Box */}
        <div className="doc-meta-grid">
          {/* Customer Details */}
          <div className="doc-meta-card">
            <div className="doc-meta-card-header">
              <span>CUSTOMER DETAILS</span>
            </div>
            <div className="doc-meta-card-body">
              <p className="client-name">{quotation.customerName || 'Valued Customer'}</p>
              <p className="meta-text"><strong>Contact Number:</strong> {quotation.customerPhone || '—'}</p>
              {quotation.customerEmail && (
                <p className="meta-text"><strong>Email:</strong> {quotation.customerEmail}</p>
              )}
              {quotation.customerAddress && (
                <p className="meta-text"><strong>Address:</strong> {quotation.customerAddress}</p>
              )}
            </div>
          </div>

          {/* Event & Schedule Details */}
          <div className="doc-meta-card">
            <div className="doc-meta-card-header">
              <span>EVENT & SCHEDULE DETAILS</span>
            </div>
            <div className="doc-meta-card-body">
              <div className="meta-two-col">
                <div>
                  <p className="meta-text"><strong>Event Name:</strong> {quotation.eventName || 'Catering Function'}</p>
                  <p className="meta-text"><strong>Event Date:</strong> {formatDate(quotation.eventDate)}</p>
                  <p className="meta-text"><strong>Time:</strong> {quotation.eventTime || 'As scheduled'}</p>
                </div>
                <div>
                  <p className="meta-text"><strong>Number of Guests (Pax):</strong> <span className="font-bold text-emerald-950">{quotation.guests || '—'} Guests</span></p>
                  <p className="meta-text"><strong>Quotation Date:</strong> {formatDate(quotation.date)}</p>
                  <p className="meta-text"><strong>Valid Until:</strong> {formatDate(quotation.validUntil)}</p>
                </div>
              </div>
              <p className="meta-text mt-1"><strong>Venue:</strong> {quotation.venue || 'To be specified'}</p>
            </div>
          </div>
        </div>

        {/* Customer-Facing Services Table (Service | Quantity ONLY) */}
        <div className="doc-table-section">
          <table className="doc-table customer-facing-table">
            <thead>
              <tr>
                <th className="th-customer-service">SERVICE</th>
                <th className="th-customer-qty text-right">QUANTITY</th>
              </tr>
            </thead>
            <tbody>
              {validItems.length === 0 ? (
                <tr>
                  <td colSpan="2" className="text-center py-6 text-gray-500 italic">
                    No catering services itemized.
                  </td>
                </tr>
              ) : (
                validItems.map((item, index) => {
                  const qtyDisplay = item.quantity || 1;
                  const unitDisplay = item.unit && !['Guests', 'Pax', 'Nos', 'PCS', 'Fixed', 'Set', 'Event'].includes(item.unit)
                    ? ` ${item.unit}`
                    : '';
                  return (
                    <tr key={item.id || index}>
                      <td className="td-customer-service font-medium text-slate-900">
                        {item.name || 'Service Item'}
                      </td>
                      <td className="td-customer-qty text-right font-mono font-semibold text-slate-900">
                        {qtyDisplay}{unitDisplay && <span className="text-xs font-sans text-slate-500 font-normal ml-1">{unitDisplay}</span>}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Totals & Notes Section */}
        <div className="doc-bottom-section">
          {/* Terms & Notes */}
          <div className="doc-terms-box">
            <h4 className="terms-heading">TERMS & CONDITIONS:</h4>
            <ol className="terms-list">
              {(quotation.terms || []).map((term, i) => (
                <li key={i}>{term}</li>
              ))}
            </ol>
            {quotation.notes && (
              <div className="doc-custom-note">
                <strong>Note:</strong> {quotation.notes}
              </div>
            )}
          </div>

          {/* Customer Financial Summary Box (Total Amount Only) */}
          <div className="doc-summary-box customer-summary-box">
            <div className="summary-grand-total">
              <span className="lbl">TOTAL AMOUNT:</span>
              <span className="val font-mono">{formatINR(quotation.grandTotal || 0)}</span>
            </div>

            {parseFloat(quotation.advancePaid) > 0 && (
              <>
                <div className="summary-line text-slate-700 pt-1">
                  <span className="lbl">Advance Proposed:</span>
                  <span className="val font-mono">{formatINR(quotation.advancePaid)}</span>
                </div>
                <div className="summary-line font-bold text-slate-900">
                  <span className="lbl">Estimated Balance:</span>
                  <span className="val font-mono">{formatINR(quotation.balanceDue || 0)}</span>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Signature Area */}
        <div className="doc-signature-section">
          <div className="signature-col">
            <div className="signature-line-box"></div>
            <p className="signatory-label">Customer Acceptance Signature</p>
            <p className="signatory-sub">Name: ________________________</p>
            <p className="signatory-sub">Date: ________________________</p>
          </div>

          <div className="signature-col text-right">
            <div className="authorized-signatory-stamp">
              <span className="stamp-org">SILVER CATERING SERVICES</span>
              <span className="stamp-loc">VALANCHERY • MALAPPURAM</span>
              <span className="stamp-valid">OFFICIAL PROPOSAL</span>
            </div>
            <div className="signature-line-box"></div>
            <p className="signatory-label">Authorized Signatory</p>
            <p className="signatory-sub font-semibold text-emerald-900">Silver Catering Services</p>
          </div>
        </div>

        {/* Footer Note */}
        <div className="doc-footer-note">
          <span>This is an official quotation issued by Silver Catering Services, Valanchery, Malappuram • Phone: +91 98464 15767 • Valid for 14 days from issue date.</span>
        </div>
      </div>
    </div>
  );
}
