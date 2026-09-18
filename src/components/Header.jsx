import { SparklesIcon, RefreshCwIcon } from './icons';

export default function Header({ onLoadDemo, onNewNote }) {
  return (
    <header className="app-header">
      <div className="header-inner">
        <div className="brand-crest">
          <span className="crest-symbol">✦</span>
          <span className="brand-badge">EST. 2010 • KERALA CATERING</span>
          <span className="crest-symbol">✦</span>
        </div>

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
        <p className="brand-subtitle">CATERING FOOD HANDOVER NOTE</p>

        <div className="header-actions no-print">
          <button
            type="button"
            onClick={onLoadDemo}
            className="btn-demo"
            title="Load sample 'Rahul Wedding' food handover data (9 items, ₹75,000)"
          >
            <SparklesIcon className="w-4 h-4" />
            <span>Load Sample (Rahul Wedding)</span>
          </button>
          
          <button
            type="button"
            onClick={onNewNote}
            className="btn-header-secondary"
            title="Start a blank handover note"
          >
            <RefreshCwIcon className="w-4 h-4" />
            <span>New Note</span>
          </button>
        </div>
      </div>
    </header>
  );
}
