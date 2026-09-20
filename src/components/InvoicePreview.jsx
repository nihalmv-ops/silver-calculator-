import React from 'react';
import { formatINR, formatDate } from '../utils/formatters';
import { determinePaymentStatus } from '../utils/calculations';
import { BANK_DETAILS } from '../utils/storage';
import {
  PrinterIcon,
  WhatsAppIcon,
  EditIcon
} from './icons';
import { openWhatsAppShare } from '../utils/whatsapp';

export default function InvoicePreview({
  invoice,
  onEdit,
  isPrintOnly = false
}) {
  const items = invoice.items || [];
  const validItems = items.filter(
    (it) => (it.name && it.name.trim() !== '') || (parseFloat(it.rate) > 0)
  );

  const status = determinePaymentStatus(invoice.grandTotal, invoice.advancePaid);

  const handlePrint = () => {
    window.print();
  };

  const handleWhatsApp = () => {
    openWhatsAppShare(invoice, true);
  };

  const getStatusStamp = () => {
    switch (status) {
      case 'PAID':
        return <span className="doc-stamp-paid">PAID IN FULL</span>;
      case 'PARTIALLY PAID':
        return <span className="doc-stamp-partial">PARTIALLY PAID</span>;
      case 'PENDING':
      default:
        return <span className="doc-stamp-pending">PAYMENT PENDING</span>;
    }
  };

  return (
    <div className={`invoice-preview-wrapper ${isPrintOnly ? 'print-only-container' : ''}`}>
      {/* On-screen Action Toolbar */}
      {!isPrintOnly && (
        <div className="preview-action-toolbar no-print">
          <div className="toolbar-left">
            <span className="doc-pill-invoice">INVOICE PREVIEW</span>
            <span className="font-semibold text-emerald-950 font-mono">#{invoice.number || 'INV-0001'}</span>
            <div className="ml-2">{getStatusStamp()}</div>
          </div>

          <div className="toolbar-actions-group">
            <button
              type="button"
              className="btn-toolbar-action btn-secondary"
              onClick={onEdit}
            >
              <EditIcon className="w-4 h-4" />
              <span>Edit Invoice</span>
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
          </div>
        </div>
      )}

      {/* A4 Sheet Container */}
      <div className="a4-sheet-container printable-document invoice-document">
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
              <div className="seal-circle seal-invoice">
                <span className="seal-stars">★ ★ ★</span>
                <span className="seal-org">SILVER CATERING</span>
                <span className="seal-type">TAX INVOICE</span>
                <span className="seal-loc">KERALA</span>
              </div>
            </div>
          </div>

          <div className="doc-title-banner invoice-theme">
            <div className="flex items-center gap-2">
              <span className="doc-title-text">TAX INVOICE</span>
              {getStatusStamp()}
            </div>
            <div className="flex items-center gap-3">
              {invoice.quotationNumber && (
                <span className="text-xs text-amber-200">QUOTATION: #{invoice.quotationNumber}</span>
              )}
              <span className="doc-num-tag">INVOICE: #{invoice.number || 'INV-0001'}</span>
            </div>
          </div>
        </div>

        {/* Customer & Invoice Meta Grid */}
        <div className="doc-meta-grid">
          {/* Customer Details */}
          <div className="doc-meta-card">
            <div className="doc-meta-card-header">
              <span>CUSTOMER DETAILS</span>
            </div>
            <div className="doc-meta-card-body">
              <p className="client-name">{invoice.customerName || 'Valued Customer'}</p>
              <p className="meta-text"><strong>Contact Number:</strong> {invoice.customerPhone || '—'}</p>
              {invoice.customerEmail && (
                <p className="meta-text"><strong>Email:</strong> {invoice.customerEmail}</p>
              )}
              {invoice.customerAddress && (
                <p className="meta-text"><strong>Address:</strong> {invoice.customerAddress}</p>
              )}
            </div>
          </div>

          {/* Invoice & Event Scheduling */}
          <div className="doc-meta-card">
            <div className="doc-meta-card-header">
              <span>INVOICE & FUNCTION DETAILS</span>
            </div>
            <div className="doc-meta-card-body">
              <div className="meta-two-col">
                <div>
                  <p className="meta-text"><strong>Event Name:</strong> {invoice.eventName || 'Catering Event'}</p>
                  <p className="meta-text"><strong>Event Date:</strong> {formatDate(invoice.eventDate)}</p>
                  <p className="meta-text"><strong>Time:</strong> {invoice.eventTime || 'As scheduled'}</p>
                </div>
                <div>
                  <p className="meta-text"><strong>Number of Guests (Pax):</strong> <span className="font-bold text-emerald-950">{invoice.guests || '—'} Guests</span></p>
                  <p className="meta-text"><strong>Invoice Date:</strong> {formatDate(invoice.date)}</p>
                  <p className="meta-text"><strong>Due Date:</strong> {formatDate(invoice.dueDate)}</p>
                </div>
              </div>
              <p className="meta-text mt-1"><strong>Venue:</strong> {invoice.venue || 'To be specified'}</p>
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
                    No services itemized.
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

        {/* Bottom Section: Payment Info & Customer Totals */}
        <div className="doc-bottom-section">
          {/* Bank / Payment Info & Transaction Details */}
          <div className="doc-terms-box doc-payment-info-box">
            <h4 className="terms-heading">PAYMENT & BANK DETAILS:</h4>
            <div className="bank-details-grid">
              <div className="bank-col">
                <p className="meta-text"><strong>Bank:</strong> {BANK_DETAILS.bankName}, {BANK_DETAILS.branch}</p>
                <p className="meta-text"><strong>A/C Name:</strong> {BANK_DETAILS.accountName}</p>
                <p className="meta-text font-mono"><strong>A/C No:</strong> {BANK_DETAILS.accountNumber}</p>
                <p className="meta-text font-mono"><strong>IFSC:</strong> {BANK_DETAILS.ifscCode}</p>
              </div>
              <div className="bank-col">
                <p className="meta-text"><strong>GPay / PhonePe:</strong> {BANK_DETAILS.gpayNumber}</p>
                <p className="meta-text"><strong>UPI ID:</strong> {BANK_DETAILS.upiId}</p>
                <p className="meta-text"><strong>Payment Mode:</strong> {invoice.paymentMethod || 'GPay / UPI'}</p>
              </div>
            </div>

            {invoice.transactionNotes && (
              <div className="doc-custom-note mt-2">
                <strong>Transaction Info:</strong> {invoice.transactionNotes}
              </div>
            )}
          </div>

          {/* Customer Financial Totals Summary Box */}
          <div className="doc-summary-box customer-summary-box invoice-summary-box">
            <div className="summary-grand-total">
              <span className="lbl">TOTAL AMOUNT:</span>
              <span className="val font-mono">{formatINR(invoice.grandTotal || 0)}</span>
            </div>

            <div className="summary-line text-slate-700 pt-1">
              <span className="lbl">ADVANCE PAID:</span>
              <span className="val font-mono font-semibold text-slate-900">{formatINR(invoice.advancePaid || 0)}</span>
            </div>

            <div className="summary-line font-bold balance-highlight-line">
              <span className="lbl">BALANCE DUE:</span>
              <span className="val font-mono text-emerald-950">{formatINR(invoice.balanceDue || 0)}</span>
            </div>

            <div className="summary-payment-status-row flex items-center justify-between mt-2 pt-2 border-t border-emerald-100">
              <span className="text-xs uppercase tracking-wider font-semibold text-slate-500">Payment Status:</span>
              <div>{getStatusStamp()}</div>
            </div>
          </div>
        </div>

        {/* Signature Area */}
        <div className="doc-signature-section">
          <div className="signature-col">
            <div className="signature-line-box"></div>
            <p className="signatory-label">Client Acknowledgement</p>
            <p className="signatory-sub">Name: ________________________</p>
            <p className="signatory-sub">Date: ________________________</p>
          </div>

          <div className="signature-col text-right">
            <div className="authorized-signatory-stamp">
              <span className="stamp-org">SILVER CATERING SERVICES</span>
              <span className="stamp-loc">VALANCHERY • MALAPPURAM</span>
              <span className="stamp-valid">OFFICIAL TAX INVOICE</span>
            </div>
            <div className="signature-line-box"></div>
            <p className="signatory-label">Authorized Signatory</p>
            <p className="signatory-sub font-semibold text-emerald-900">Silver Catering Services</p>
          </div>
        </div>

        {/* Footer Note */}
        <div className="doc-footer-note">
          <span>Thank you for your business • Silver Catering Services, Valanchery, Malappuram • Phone: +91 98464 15767 • Email: Silvereventsandcaters@gmail.com</span>
        </div>
      </div>
    </div>
  );
}
