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

  // Compute statistics
  const totalPendingAmount = useMemo(() => {
    return invoices.reduce((sum, inv) => {
      return sum + (parseFloat(inv.balanceDue) || 0);
    }, 0);
  }, [invoices]);

  return (
    <div className="workspace-container">
      {/* Main Workspace Header & Actions */}
      <div className="workspace-header-card">
        <div className="workspace-hero-row">
          <div className="workspace-title-block">
            <h1 className="workspace-main-title">Catering Documents</h1>
            <p className="workspace-subtitle">
              Create and manage professional quotations and invoices.
            </p>
          </div>

          <div className="workspace-action-cluster">
            <button
              type="button"
              className="btn-workspace-primary"
              onClick={onNewQuotation}
            >
              <PlusIcon className="w-4 h-4" />
              <span>+ Create New Quotation</span>
            </button>
            <button
              type="button"
              className="btn-workspace-secondary"
              onClick={onNewInvoice}
            >
              <ReceiptIcon className="w-4 h-4" />
              <span>Create Invoice</span>
            </button>
          </div>
        </div>

        {/* Small Elegant Document Statistics (Minimal, Not Colorful Cards) */}
        <div className="workspace-stats-strip">
          <div className="stat-block">
            <span className="stat-label">Quotations</span>
            <span className="stat-num">{quotations.length}</span>
          </div>
          <div className="stat-divider"></div>
          <div className="stat-block">
            <span className="stat-label">Invoices</span>
            <span className="stat-num">{invoices.length}</span>
          </div>
          <div className="stat-divider"></div>
          <div className="stat-block">
            <span className="stat-label">Pending Amount</span>
            <span className="stat-num font-mono">{formatINR(totalPendingAmount)}</span>
          </div>
        </div>
      </div>

      {/* Filter Tabs & Search Bar */}
      <div className="workspace-filter-toolbar">
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
            placeholder="Search by customer, event, phone, or number..."
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

      {/* Documents List */}
      {filteredDocs.length === 0 ? (
        <div className="empty-workspace-state">
          <div className="empty-icon-wrap">
            <FileTextIcon className="w-8 h-8 text-neutral-400" />
          </div>
          <h3 className="empty-title">
            {searchQuery ? 'No matching documents' : 'No quotations yet'}
          </h3>
          <p className="empty-desc">
            {searchQuery
              ? `No records found matching "${searchQuery}". Try clearing search filter.`
              : 'Create your first professional catering quotation.'}
          </p>
          <button
            type="button"
            className="btn-workspace-primary mt-2"
            onClick={onNewQuotation}
          >
            <PlusIcon className="w-4 h-4" />
            <span>+ Create Quotation</span>
          </button>
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
                  <h3 className="card-client-name">{doc.customerName || 'Unnamed Customer'}</h3>
                  <p className="card-event-name">{doc.eventName || 'Catering Function'}</p>
                  <p className="card-sub-info">
                    <span>{formatDate(doc.eventDate)}</span>
                    {doc.guests && <span>• {doc.guests} Guests</span>}
                    {doc.customerPhone && <span>• {doc.customerPhone}</span>}
                  </p>
                </div>

                <div className="card-financial-row">
                  <div>
                    <span className="card-amount-label">Total Amount</span>
                    <p className="card-amount-value font-mono">{formatINR(doc.grandTotal || 0)}</p>
                  </div>
                  {!isQuote && (
                    <div className="text-right">
                      <span className="card-amount-label">Balance Due</span>
                      <p className={`card-balance-value font-mono ${doc.balanceDue > 0 ? 'text-amber-900 font-bold' : 'text-neutral-700'}`}>
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
                    title="View Document Preview"
                  >
                    <EyeIcon className="w-3.5 h-3.5" />
                    <span>View</span>
                  </button>

                  {/* Edit */}
                  <button
                    type="button"
                    className="card-action-btn btn-edit"
                    onClick={() => (isQuote ? onEditQuotation(doc.id) : onEditInvoice(doc.id))}
                    title="Edit Document"
                  >
                    <EditIcon className="w-3.5 h-3.5" />
                    <span>Edit</span>
                  </button>

                  {/* WhatsApp */}
                  <button
                    type="button"
                    className="card-action-btn btn-wa"
                    onClick={() => openWhatsAppShare(doc, !isQuote)}
                    title="Share via WhatsApp"
                  >
                    <WhatsAppIcon className="w-3.5 h-3.5" />
                    <span>WhatsApp</span>
                  </button>

                  {/* Convert to Invoice for Quotes */}
                  {isQuote && (
                    <button
                      type="button"
                      className="card-action-btn btn-convert"
                      onClick={() => onConvertQuotation(doc)}
                      title="Convert to Tax Invoice"
                    >
                      <ReceiptIcon className="w-3.5 h-3.5" />
                      <span>To Invoice</span>
                    </button>
                  )}

                  {/* Delete */}
                  <button
                    type="button"
                    className="card-action-btn btn-del"
                    onClick={() => (isQuote ? onDeleteQuotation(doc.id) : onDeleteInvoice(doc.id))}
                    title="Delete Document"
                  >
                    <TrashIcon className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
