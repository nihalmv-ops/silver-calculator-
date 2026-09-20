import React, { useState, useMemo } from 'react';
import { formatINR, formatDate } from '../utils/formatters';
import {
  FileTextIcon,
  SearchIcon,
  EyeIcon,
  EditIcon,
  TrashIcon,
  WhatsAppIcon,
  ReceiptIcon,
  PlusIcon
} from './icons';
import { openWhatsAppShare } from '../utils/whatsapp';

export default function RecentDocuments({
  quotations = [],
  invoices = [],
  onViewQuotation,
  onEditQuotation,
  onDeleteQuotation,
  onConvertQuotation,
  onViewInvoice,
  onEditInvoice,
  onDeleteInvoice,
  onNewQuotation,
  onNewInvoice
}) {
  const [activeFilter, setActiveFilter] = useState('all'); // 'all' | 'quotations' | 'invoices'
  const [searchQuery, setSearchQuery] = useState('');

  // Combine and sort documents chronologically
  const allDocs = useMemo(() => {
    const list = [
      ...quotations.map((q) => ({ ...q, docType: 'quotation' })),
      ...invoices.map((i) => ({ ...i, docType: 'invoice' }))
    ];
    // Sort newest date or number first
    return list.sort((a, b) => {
      const dateA = new Date(a.date || a.createdAt || 0);
      const dateB = new Date(b.date || b.createdAt || 0);
      return dateB - dateA;
    });
  }, [quotations, invoices]);

  // Filtered documents based on active tab & search query
  const filteredDocs = useMemo(() => {
    return allDocs.filter((doc) => {
      // Type filter
      if (activeFilter === 'quotations' && doc.docType !== 'quotation') return false;
      if (activeFilter === 'invoices' && doc.docType !== 'invoice') return false;

      // Query filter
      if (searchQuery.trim() !== '') {
        const q = searchQuery.toLowerCase();
        const num = (doc.number || '').toLowerCase();
        const client = (doc.customerName || '').toLowerCase();
        const event = (doc.eventName || '').toLowerCase();
        const phone = (doc.customerPhone || '').toLowerCase();
        return num.includes(q) || client.includes(q) || event.includes(q) || phone.includes(q);
      }
      return true;
    });
  }, [allDocs, activeFilter, searchQuery]);

  const renderStatusBadge = (doc) => {
    if (doc.docType === 'quotation') {
      return <span className="badge-type-quote">QUOTATION</span>;
    }

    switch (doc.paymentStatus) {
      case 'PAID':
        return <span className="badge-paid">PAID</span>;
      case 'PARTIALLY PAID':
        return <span className="badge-partially-paid">PARTIAL</span>;
      case 'PENDING':
      default:
        return <span className="badge-pending">PENDING</span>;
    }
  };

  return (
    <section className="recent-docs-container">
      {/* Search & Filter Header Bar */}
      <div className="recent-docs-header">
        <div className="recent-header-top">
          <div>
            <h2 className="text-xl font-bold text-emerald-950 flex items-center gap-2">
              <FileTextIcon className="w-5 h-5 text-emerald-800" />
              <span>Catering Documents Dashboard</span>
            </h2>
            <p className="text-xs text-emerald-800">
              Manage saved quotations, tax invoices, and client billing records
            </p>
          </div>

          <div className="header-quick-create-btns">
            <button
              type="button"
              className="btn-create-quote-sm"
              onClick={onNewQuotation}
            >
              <PlusIcon className="w-4 h-4" />
              <span>+ New Quotation</span>
            </button>
            <button
              type="button"
              className="btn-create-invoice-sm"
              onClick={onNewInvoice}
            >
              <ReceiptIcon className="w-4 h-4" />
              <span>+ Create Invoice</span>
            </button>
          </div>
        </div>

        <div className="filter-and-search-bar">
          {/* Tabs */}
          <div className="doc-filter-tabs">
            <button
              type="button"
              className={`filter-tab ${activeFilter === 'all' ? 'active' : ''}`}
              onClick={() => setActiveFilter('all')}
            >
              All Documents ({allDocs.length})
            </button>
            <button
              type="button"
              className={`filter-tab ${activeFilter === 'quotations' ? 'active' : ''}`}
              onClick={() => setActiveFilter('quotations')}
            >
              Quotations ({quotations.length})
            </button>
            <button
              type="button"
              className={`filter-tab ${activeFilter === 'invoices' ? 'active' : ''}`}
              onClick={() => setActiveFilter('invoices')}
            >
              Invoices ({invoices.length})
            </button>
          </div>

          {/* Search Box */}
          <div className="search-input-wrap">
            <SearchIcon className="w-4 h-4 search-icon" />
            <input
              type="text"
              placeholder="Search by customer name, event, phone, or number..."
              className="search-input"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {searchQuery && (
              <button
                type="button"
                className="search-clear-btn"
                onClick={() => setSearchQuery('')}
              >
                ✕
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Documents List */}
      {filteredDocs.length === 0 ? (
        <div className="empty-docs-card">
          <FileTextIcon className="w-12 h-12 text-emerald-300 mx-auto mb-3" />
          <h3 className="text-base font-bold text-gray-700">No Documents Found</h3>
          <p className="text-xs text-gray-500 max-w-md mx-auto mt-1 mb-4">
            {searchQuery
              ? `No matching records found for "${searchQuery}". Try clearing search.`
              : 'You have no saved quotations or invoices in this view. Create one below to get started.'}
          </p>
          <div className="flex justify-center gap-3">
            <button
              type="button"
              className="btn-toolbar-action btn-convert-invoice"
              onClick={onNewQuotation}
            >
              <PlusIcon className="w-4 h-4" />
              <span>Create First Quotation</span>
            </button>
          </div>
        </div>
      ) : (
        <div className="documents-cards-grid">
          {filteredDocs.map((doc) => {
            const isQuote = doc.docType === 'quotation';
            return (
              <div key={doc.id} className={`document-item-card ${isQuote ? 'quote-card' : 'inv-card'}`}>
                <div className="card-top-row">
                  <div className="flex items-center gap-2">
                    <span className="doc-num-tag font-mono font-bold">
                      #{doc.number}
                    </span>
                    {renderStatusBadge(doc)}
                  </div>
                  <span className="doc-date-text">{formatDate(doc.date)}</span>
                </div>

                <div className="card-client-info">
                  <h3 className="card-client-name">{doc.customerName || 'Unnamed Client'}</h3>
                  <p className="card-event-name">{doc.eventName || 'Catering Function'}</p>
                  <p className="card-sub-info">
                    <span>📅 {formatDate(doc.eventDate)}</span>
                    {doc.guests && <span>• 👥 {doc.guests} Pax</span>}
                  </p>
                </div>

                <div className="card-financial-row">
                  <div>
                    <span className="card-amount-label">Grand Total</span>
                    <p className="card-amount-value font-mono">{formatINR(doc.grandTotal || 0)}</p>
                  </div>
                  {!isQuote && (
                    <div className="text-right">
                      <span className="card-amount-label">Balance Due</span>
                      <p className={`card-balance-value font-mono ${doc.balanceDue > 0 ? 'text-amber-700 font-bold' : 'text-emerald-700'}`}>
                        {formatINR(doc.balanceDue || 0)}
                      </p>
                    </div>
                  )}
                </div>

                <div className="card-actions-row">
                  {/* View */}
                  <button
                    type="button"
                    className="card-action-btn btn-view"
                    onClick={() => (isQuote ? onViewQuotation(doc.id) : onViewInvoice(doc.id))}
                    title="View A4 Preview"
                  >
                    <EyeIcon className="w-4 h-4" />
                    <span>View</span>
                  </button>

                  {/* Edit */}
                  <button
                    type="button"
                    className="card-action-btn btn-edit"
                    onClick={() => (isQuote ? onEditQuotation(doc.id) : onEditInvoice(doc.id))}
                    title="Edit Document"
                  >
                    <EditIcon className="w-4 h-4" />
                    <span>Edit</span>
                  </button>

                  {/* WhatsApp */}
                  <button
                    type="button"
                    className="card-action-btn btn-wa"
                    onClick={() => openWhatsAppShare(doc, !isQuote)}
                    title="Share via WhatsApp"
                  >
                    <WhatsAppIcon className="w-4 h-4" />
                  </button>

                  {/* Convert to Invoice for Quotes */}
                  {isQuote && (
                    <button
                      type="button"
                      className="card-action-btn btn-convert"
                      onClick={() => onConvertQuotation(doc)}
                      title="Convert to Invoice"
                    >
                      <ReceiptIcon className="w-4 h-4" />
                      <span>Convert</span>
                    </button>
                  )}

                  {/* Delete */}
                  <button
                    type="button"
                    className="card-action-btn btn-del"
                    onClick={() => (isQuote ? onDeleteQuotation(doc.id) : onDeleteInvoice(doc.id))}
                    title="Delete Document"
                  >
                    <TrashIcon className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}
