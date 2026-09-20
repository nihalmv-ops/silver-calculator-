import React from 'react';
import {
  FileTextIcon,
  ReceiptIcon,
  PlusIcon,
  UtensilsIcon,
  FolderIcon
} from './icons';

export default function Header({
  activeView,
  onNavigate,
  onNewQuotation,
  totalQuotesCount = 0,
  totalInvoicesCount = 0
}) {
  const isHome = activeView === 'recent';
  const isQuotation = activeView === 'quotation_form' || activeView === 'quotation_preview';
  const isInvoice = activeView === 'invoice_form' || activeView === 'invoice_preview';
  const isHandover = activeView === 'handover';

  return (
    <header className="luxury-app-header app-header no-print">
      <div className="luxury-header-inner header-inner">
        {/* Left: Brand Identity */}
        <button
          type="button"
          className="brand-identity-btn"
          onClick={() => onNavigate('recent')}
          title="Go to Catering Documents Workspace"
        >
          <div className="brand-logo-frame">
            <img
              src="/silver_catering_logo.png"
              alt="Silver Catering"
              className="brand-header-logo"
            />
          </div>
          <div className="brand-text-block">
            <h1 className="brand-company-title">SILVER CATERING</h1>
            <span className="brand-tagline">Catering • Events • Hospitality</span>
          </div>
        </button>

        {/* Right: Navigation & Actions */}
        <div className="header-cta-cluster">
          <nav className="header-nav-menu">
            <button
              type="button"
              className={`header-nav-btn ${isHome ? 'is-active' : ''}`}
              onClick={() => onNavigate('recent')}
              title="Catering Documents Workspace"
            >
              <FolderIcon className="w-4 h-4" />
              <span>Workspace</span>
            </button>

            <button
              type="button"
              className={`header-nav-btn ${isQuotation ? 'is-active' : ''}`}
              onClick={() => onNavigate('quotation_form')}
              title="Quotation Builder"
            >
              <FileTextIcon className="w-4 h-4" />
              <span>Quotations</span>
              {totalQuotesCount > 0 && (
                <span className="nav-counter-pill">{totalQuotesCount}</span>
              )}
            </button>

            <button
              type="button"
              className={`header-nav-btn ${isInvoice ? 'is-active' : ''}`}
              onClick={() => onNavigate('invoice_form')}
              title="Invoice Builder"
            >
              <ReceiptIcon className="w-4 h-4" />
              <span>Invoices</span>
              {totalInvoicesCount > 0 && (
                <span className="nav-counter-pill">{totalInvoicesCount}</span>
              )}
            </button>

            <button
              type="button"
              className={`header-nav-btn ${isHandover ? 'is-active' : ''}`}
              onClick={() => onNavigate('handover')}
              title="Food Handover Dispatch Note"
            >
              <UtensilsIcon className="w-3.5 h-3.5" />
              <span>Handover</span>
            </button>
          </nav>

          {/* Primary Action Button */}
          <button
            type="button"
            className="btn-header-primary"
            onClick={onNewQuotation || (() => onNavigate('quotation_form'))}
          >
            <PlusIcon className="w-4 h-4" />
            <span>+ New Quotation</span>
          </button>
        </div>
      </div>
    </header>
  );
}
