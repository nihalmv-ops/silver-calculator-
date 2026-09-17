import { useState } from 'react';
import { PrinterIcon, DownloadIcon, TrashIcon, RefreshCwIcon } from './icons';

export default function ActionButtons({ onPrint, onSavePdf, onClear, onNewNote }) {
  const [pdfTooltip, setPdfTooltip] = useState(false);

  const handlePdfClick = () => {
    setPdfTooltip(true);
    setTimeout(() => {
      setPdfTooltip(false);
      onSavePdf();
    }, 400);
  };

  return (
    <div className="action-bar-container no-print">
      <div className="action-bar-inner">
        <div className="action-group-primary">
          <button
            type="button"
            className="btn-action btn-print"
            onClick={onPrint}
            title="Print A4 Catering Statement"
          >
            <PrinterIcon className="w-5 h-5" />
            <span className="btn-text">PRINT</span>
          </button>

          <div className="btn-pdf-wrapper">
            <button
              type="button"
              className="btn-action btn-save-pdf"
              onClick={handlePdfClick}
              title="Save statement as A4 PDF document"
            >
              <DownloadIcon className="w-5 h-5" />
              <span className="btn-text">SAVE PDF</span>
            </button>
            {pdfTooltip && (
              <div className="pdf-hint-bubble">
                Tip: In the print dialog, select <strong>"Save as PDF"</strong> as the Destination.
              </div>
            )}
          </div>
        </div>

        <div className="action-group-secondary">
          <button
            type="button"
            className="btn-action btn-clear"
            onClick={onClear}
            title="Clear all fields after confirmation"
          >
            <TrashIcon className="w-4 h-4" />
            <span className="btn-text">CLEAR</span>
          </button>

          <button
            type="button"
            className="btn-action btn-new"
            onClick={onNewNote}
            title="Start a fresh blank note"
          >
            <RefreshCwIcon className="w-4 h-4" />
            <span className="btn-text">NEW NOTE</span>
          </button>
        </div>
      </div>
    </div>
  );
}
