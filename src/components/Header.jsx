import React from 'react';
import {
  FileTextIcon,
  ReceiptIcon,
  PlusIcon,
  UtensilsIcon
} from './icons';

export default function Header({
  activeView,
  onNavigate,
  totalQuotesCount = 0,
  totalInvoicesCount = 0
}) {
  return (
    <header className="app-header">
      <div className="header-inner">
        {/* Brand Crest */}
        <div className="brand-crest">
          <span className="crest-symbol">✦</span>
          <span className="brand-badge">EST. 2010 • KERALA PREMIUM CATERING</span>
          <span className="crest-symbol">✦</span>
        </div>

        {/* Brand Logo */}
        <div className="brand-logo-wrap">
          <img
            src="/silver_catering_logo.png"
            alt="Silver Catering Official Logo"
            className="brand-official-logo"
          />
        </div>

        <h1 className="brand-title">SILVER CATERING SERVICES</h1>
        <div className="brand-divider">
          <span className="divider-line"></span>
          <span className="divider-motif">❧ ✤ ☙</span>
          <span className="divider-line"></span>
        </div>
        <p className="brand-subtitle">Premium Catering Services for Weddings & Events</p>

        {/* Manager Contact Bar */}
        <div className="header-manager-contact no-print">
          <span className="mgr-badge-icon">📞</span>
          <span className="mgr-badge-label">SILVER MANAGER:</span>
          <a href="tel:+919846415767" className="mgr-badge-phone">+91 98464 15767</a>
          <span className="mgr-badge-dot">•</span>
          <span className="mgr-badge-location">Valanchery, Malappuram, Kerala</span>
        </div>

        {/* Primary Navigation Bar */}
        <nav className="header-nav-bar no-print">
          <div className="nav-buttons-cluster">
            {/* New Quotation */}
            <button
              type="button"
              className={`nav-btn ${activeView === 'quotation_form' ? 'active' : ''}`}
              onClick={() => onNavigate('quotation_form')}
            >
              <PlusIcon className="w-4 h-4" />
              <span>+ New Quotation</span>
            </button>

            {/* Create Invoice */}
            <button
              type="button"
              className={`nav-btn ${activeView === 'invoice_form' ? 'active' : ''}`}
              onClick={() => onNavigate('invoice_form')}
            >
              <ReceiptIcon className="w-4 h-4" />
              <span>Create Invoice</span>
            </button>

            {/* Recent Documents */}
            <button
              type="button"
              className={`nav-btn nav-btn-recent ${activeView === 'recent' ? 'active' : ''}`}
              onClick={() => onNavigate('recent')}
            >
              <FileTextIcon className="w-4 h-4" />
              <span>Recent Documents</span>
              {(totalQuotesCount > 0 || totalInvoicesCount > 0) && (
                <span className="nav-count-badge">
                  {totalQuotesCount + totalInvoicesCount}
                </span>
              )}
            </button>

            {/* Food Handover Note (Preserved) */}
            <button
              type="button"
              className={`nav-btn nav-btn-handover ${activeView === 'handover' ? 'active' : ''}`}
              onClick={() => onNavigate('handover')}
              title="Food Handover Dispatch Note"
            >
              <UtensilsIcon className="w-3.5 h-3.5" />
              <span>Handover Note</span>
            </button>
          </div>
        </nav>
      </div>
    </header>
  );
}
