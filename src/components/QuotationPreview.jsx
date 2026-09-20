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
        {/* Document Header */}
        <div className="doc-executive-header">
          <div className="doc-header-main-row">
            <div className="doc-brand-cluster">
              <div className="doc-logo-box">
                <img
                  src="/silver_catering_logo.png"
                  alt="Silver Catering Services"
                  className="doc-brand-logo"
                />
              </div>
              <div className="doc-brand-titles">
                <h1 className="doc-company-name">SILVER CATERING</h1>
                <p className="doc-company-sub">Catering • Events • Hospitality</p>
                <p className="doc-company-contact">
                  Valanchery, Malappuram, Kerala • Phone: +91 98464 15767
                </p>
              </div>
            </div>

            <div className="doc-meta-badge-block">
              <span className="doc-type-label">QUOTATION</span>
              <div className="doc-meta-rows">
                <div className="doc-meta-row">
                  <span className="meta-k">Quotation No:</span>
                  <span className="meta-v font-mono font-bold">#{quotation.number || 'QT-0001'}</span>
                </div>
                <div className="doc-meta-row">
                  <span className="meta-k">Date:</span>
                  <span className="meta-v">{formatDate(quotation.date)}</span>
                </div>
                {quotation.validUntil && (
                  <div className="doc-meta-row">
                    <span className="meta-k">Valid Until:</span>
                    <span className="meta-v">{formatDate(quotation.validUntil)}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Customer & Event Details Two-Column Box */}
        <div className="doc-info-grid">
          {/* BILLED TO */}
          <div className="doc-info-card">
            <div className="doc-info-card-header">
              <span>BILLED TO</span>
            </div>
            <div className="doc-info-card-body">
              <p className="client-main-name">{quotation.customerName || 'Valued Customer'}</p>
              <p className="info-line"><strong>Phone:</strong> {quotation.customerPhone || '—'}</p>
              {quotation.customerEmail && (
                <p className="info-line"><strong>Email:</strong> {quotation.customerEmail}</p>
              )}
              {quotation.customerAddress && (
                <p className="info-line"><strong>Address:</strong> {quotation.customerAddress}</p>
              )}
            </div>
          </div>

          {/* EVENT */}
          <div className="doc-info-card">
            <div className="doc-info-card-header">
              <span>EVENT</span>
            </div>
            <div className="doc-info-card-body">
              <p className="event-main-name">{quotation.eventName || 'Catering Function'}</p>
              <p className="info-line"><strong>Event Date:</strong> {formatDate(quotation.eventDate)}</p>
              {quotation.eventTime && (
                <p className="info-line"><strong>Time:</strong> {quotation.eventTime}</p>
              )}
              <p className="info-line"><strong>Venue:</strong> {quotation.venue || 'To be confirmed'}</p>
              <p className="info-line"><strong>Guests:</strong> {quotation.guests || '—'} Guests</p>
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
