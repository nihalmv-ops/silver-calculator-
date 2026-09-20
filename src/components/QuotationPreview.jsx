import React from 'react';
import { formatINR, formatDate } from '../utils/formatters';
import { calcRowAmount } from '../utils/calculations';
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
      <div className="a4-sheet-container printable-document">
        {/* Brand Header */}
        <div className="doc-header-block">
          <div className="doc-brand-top">
            <div className="doc-logo-box">
              <img
                src="/silver_catering_logo.png"
                alt="Silver Catering Services Logo"
                className="doc-brand-logo"
              />
            </div>
            <div className="doc-company-details">
              <h1 className="doc-company-title">SILVER CATERING SERVICES</h1>
              <p className="doc-company-tagline">Premium Catering Services for Weddings & Events</p>
              <p className="doc-company-meta">
                Valanchery, Malappuram, Kerala 679572 • Phone: +91 98464 15767
              </p>
              <p className="doc-company-email">Email: Silvereventsandcaters@gmail.com</p>
            </div>
          </div>

          <div className="doc-title-banner quotation-theme">
            <span className="doc-title-text">CATERING QUOTATION</span>
            <span className="doc-num-tag">REF: {quotation.number || 'QT-0001'}</span>
          </div>
        </div>

        {/* Customer & Event Details Two-Column Box */}
        <div className="doc-meta-grid">
          {/* Bill To / Client Details */}
          <div className="doc-meta-card">
            <div className="doc-meta-card-header">
              <span>QUOTATION FOR (BILL TO)</span>
            </div>
            <div className="doc-meta-card-body">
              <p className="client-name">{quotation.customerName || 'Valued Client'}</p>
              <p className="meta-text"><strong>Phone:</strong> {quotation.customerPhone || '—'}</p>
              {quotation.customerEmail && (
                <p className="meta-text"><strong>Email:</strong> {quotation.customerEmail}</p>
              )}
              {quotation.customerAddress && (
                <p className="meta-text"><strong>Address:</strong> {quotation.customerAddress}</p>
              )}
            </div>
          </div>

          {/* Event & Document Meta */}
          <div className="doc-meta-card">
            <div className="doc-meta-card-header">
              <span>EVENT & SCHEDULE DETAILS</span>
            </div>
            <div className="doc-meta-card-body">
              <div className="meta-two-col">
                <div>
                  <p className="meta-text"><strong>Date:</strong> {formatDate(quotation.date)}</p>
                  <p className="meta-text"><strong>Valid Until:</strong> {formatDate(quotation.validUntil)}</p>
                  <p className="meta-text"><strong>Guests / Pax:</strong> {quotation.guests || '—'} Guests</p>
                </div>
                <div>
                  <p className="meta-text"><strong>Event:</strong> {quotation.eventName || 'Catering Function'}</p>
                  <p className="meta-text"><strong>Event Date:</strong> {formatDate(quotation.eventDate)}</p>
                  <p className="meta-text"><strong>Time:</strong> {quotation.eventTime || 'As scheduled'}</p>
                </div>
              </div>
              {quotation.venue && (
                <p className="meta-text mt-1"><strong>Venue:</strong> {quotation.venue}</p>
              )}
            </div>
          </div>
        </div>

        {/* Services Table */}
        <div className="doc-table-section">
          <table className="doc-table">
            <thead>
              <tr>
                <th className="th-idx">#</th>
                <th className="th-desc">CATERING SERVICE / FUNCTION</th>
                <th className="th-qty text-center">QTY / PAX</th>
                <th className="th-unit text-center">UNIT</th>
                <th className="th-rate text-right">RATE (₹)</th>
                <th className="th-amount text-right">AMOUNT (₹)</th>
              </tr>
            </thead>
            <tbody>
              {validItems.length === 0 ? (
                <tr>
                  <td colSpan="6" className="text-center py-4 text-gray-500 italic">
                    No catering services itemized.
                  </td>
                </tr>
              ) : (
                validItems.map((item, index) => {
                  const amt = calcRowAmount(item.quantity, item.rate);
                  return (
                    <tr key={item.id || index}>
                      <td className="td-idx text-center">{index + 1}</td>
                      <td className="td-desc font-medium text-slate-900">{item.name || 'Service Item'}</td>
                      <td className="td-qty text-center font-mono">{item.quantity || 1}</td>
                      <td className="td-unit text-center text-slate-600">{item.unit || 'Guests'}</td>
                      <td className="td-rate text-right font-mono">{formatINR(item.rate || 0, false)}</td>
                      <td className="td-amount text-right font-mono font-semibold text-slate-950">
                        {formatINR(amt, false)}
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

          {/* Financial Totals Summary Box */}
          <div className="doc-summary-box">
            <div className="summary-line">
              <span className="lbl">Subtotal:</span>
              <span className="val font-mono">{formatINR(quotation.subtotal || 0)}</span>
            </div>

            {quotation.discountAmount > 0 && (
              <div className="summary-line text-rose-700">
                <span className="lbl">
                  Discount ({quotation.discountType === 'percent' ? `${quotation.discountValue}%` : 'Flat'}):
                </span>
                <span className="val font-mono">- {formatINR(quotation.discountAmount)}</span>
              </div>
            )}

            {quotation.taxEnabled && quotation.gstAmount > 0 && (
              <div className="summary-line">
                <span className="lbl">GST ({quotation.gstPercent}%):</span>
                <span className="val font-mono">+ {formatINR(quotation.gstAmount)}</span>
              </div>
            )}

            <div className="summary-grand-total">
              <span className="lbl">GRAND TOTAL:</span>
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
            <p className="signatory-sub">Date: ________________________</p>
          </div>

          <div className="signature-col text-right">
            <div className="signature-line-box"></div>
            <p className="signatory-label">Authorized Signatory</p>
            <p className="signatory-sub font-semibold text-emerald-900">Silver Catering Services</p>
          </div>
        </div>

        {/* Footer Note */}
        <div className="doc-footer-note">
          <span>This is an official quotation issued by Silver Catering Services, Valanchery, Malappuram. Valid for 14 days from issue date.</span>
        </div>
      </div>
    </div>
  );
}
