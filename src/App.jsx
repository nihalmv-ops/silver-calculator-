import { useState, useEffect, useMemo } from 'react';
import Header from './components/Header';
import EventDetails from './components/EventDetails';
import FoodItemsSection from './components/FoodItemsSection';
import TotalPriceSection from './components/TotalPriceSection';
import ActionButtons from './components/ActionButtons';
import PrintableStatement from './components/PrintableStatement';
import ConfirmModal from './components/ConfirmModal';
import { UtensilsIcon, FileTextIcon, PrinterIcon, DownloadIcon, RefreshCwIcon } from './components/icons';
import {
  loadNoteFromStorage,
  saveNoteToStorage,
  clearNoteFromStorage,
  getEmptyNote,
  DEMO_DATA
} from './utils/storage';

export default function App() {
  const [data, setData] = useState(() => loadNoteFromStorage());
  const [viewMode, setViewMode] = useState('editor'); // 'editor' | 'preview'
  const [modalState, setModalState] = useState({
    isOpen: false,
    title: '',
    message: '',
    confirmText: 'Confirm',
    isDestructive: false,
    onConfirm: () => {}
  });

  // Save changes to localStorage automatically
  useEffect(() => {
    saveNoteToStorage(data);
  }, [data]);

  // Total items count (non-empty items across all 4 sections)
  const totalItemsCount = useMemo(() => {
    if (!data.sections) return 0;
    let count = 0;
    const sectionKeys = ['morning', 'afternoon', 'evening', 'night'];
    sectionKeys.forEach((key) => {
      const items = data.sections[key] || [];
      const valid = items.filter(
        (item) => (item.name && item.name.trim() !== '') || (item.quantity && String(item.quantity).trim() !== '')
      );
      count += valid.length;
    });
    return count;
  }, [data.sections]);

  // Handlers for updating state
  const handleDetailsChange = (newDetails) => {
    setData((prev) => ({
      ...prev,
      ...newDetails
    }));
  };

  const handleSectionItemsChange = (sectionKey, newItems) => {
    setData((prev) => ({
      ...prev,
      sections: {
        ...prev.sections,
        [sectionKey]: newItems
      }
    }));
  };

  const handleTotalPriceChange = (newPrice) => {
    setData((prev) => ({
      ...prev,
      totalPrice: newPrice
    }));
  };

  const handleToggleView = () => {
    setViewMode((prev) => (prev === 'editor' ? 'preview' : 'editor'));
  };

  // Actions
  const handlePrint = () => {
    window.print();
  };

  const handleSavePdf = () => {
    window.print();
  };

  const handleClearRequest = () => {
    setModalState({
      isOpen: true,
      title: 'Clear All Information?',
      message: 'This will reset all food items across all 4 sections, event details, and the total price. Are you sure you want to proceed?',
      confirmText: 'Clear Note',
      isDestructive: true,
      onConfirm: () => {
        clearNoteFromStorage();
        setData(getEmptyNote());
        setModalState((prev) => ({ ...prev, isOpen: false }));
      }
    });
  };

  const handleNewNoteRequest = () => {
    setModalState({
      isOpen: true,
      title: 'Start a New Handover Note?',
      message: 'This will create a blank food handover note for a new event.',
      confirmText: 'Start New',
      isDestructive: false,
      onConfirm: () => {
        setData(getEmptyNote());
        setModalState((prev) => ({ ...prev, isOpen: false }));
      }
    });
  };

  const handleLoadDemo = () => {
    setData({ ...DEMO_DATA });
  };

  const closeModal = () => {
    setModalState((prev) => ({ ...prev, isOpen: false }));
  };

  return (
    <div className="app-container">
      {/* Top Branding Header */}
      <Header
        onLoadDemo={handleLoadDemo}
        onNewNote={handleNewNoteRequest}
      />

      {/* Main Screen Layout */}
      <main className="screen-container">
        {/* View Mode Switcher: Editor vs A4 Document Model */}
        <div className="view-mode-tabs-wrap no-print">
          <div className="view-mode-tabs">
            <button
              type="button"
              className={`view-mode-tab ${viewMode === 'editor' ? 'active' : ''}`}
              onClick={() => setViewMode('editor')}
            >
              <UtensilsIcon className="w-4 h-4" />
              <span>Note Editor</span>
            </button>
            <button
              type="button"
              className={`view-mode-tab ${viewMode === 'preview' ? 'active' : ''}`}
              onClick={() => setViewMode('preview')}
            >
              <FileTextIcon className="w-4 h-4" />
              <span>A4 Document Model (Print Preview)</span>
            </button>
          </div>
        </div>

        {viewMode === 'editor' ? (
          <>
            {/* Event, Date, Client, Location */}
            <EventDetails
              details={{
                date: data.date,
                eventName: data.eventName,
                clientName: data.clientName,
                eventLocation: data.eventLocation,
                phoneNumber: data.phoneNumber
              }}
              onChange={handleDetailsChange}
            />

            {/* 4 Food Time Sections (DAY MORNING, DAY AFTERNOON, EVENING, NIGHT) */}
            <FoodItemsSection
              sections={data.sections}
              onSectionItemsChange={handleSectionItemsChange}
            />

            {/* Single Manual TOTAL PRICE & Combined TOTAL ITEMS */}
            <TotalPriceSection
              totalItems={totalItemsCount}
              totalPrice={data.totalPrice}
              onTotalPriceChange={handleTotalPriceChange}
            />
          </>
        ) : (
          /* Live On-Screen A4 Document Model Preview */
          <div className="screen-a4-preview-container no-print">
            {/* Preview Toolbar */}
            <div className="a4-preview-toolbar">
              <div className="toolbar-title-group">
                <span className="toolbar-badge">A4 DOCUMENT MODEL</span>
                <span className="toolbar-label">Official Catering Food Handover Note</span>
              </div>

              <div className="toolbar-actions">
                <button
                  type="button"
                  className="btn-toolbar-edit"
                  onClick={() => setViewMode('editor')}
                >
                  <UtensilsIcon className="w-4 h-4" />
                  <span>Edit Note</span>
                </button>

                <button
                  type="button"
                  className="btn-toolbar-print"
                  onClick={handlePrint}
                >
                  <PrinterIcon className="w-4 h-4" />
                  <span>Print A4</span>
                </button>

                <button
                  type="button"
                  className="btn-toolbar-pdf"
                  onClick={handleSavePdf}
                >
                  <DownloadIcon className="w-4 h-4" />
                  <span>Save PDF</span>
                </button>
              </div>
            </div>

            {/* Live A4 Sheet Preview */}
            <div className="screen-a4-sheet">
              <PrintableStatement
                details={{
                  date: data.date,
                  eventName: data.eventName,
                  clientName: data.clientName,
                  eventLocation: data.eventLocation,
                  phoneNumber: data.phoneNumber
                }}
                sections={data.sections}
                totalItems={totalItemsCount}
                totalPrice={data.totalPrice}
                isScreenPreview={true}
              />
            </div>
          </div>
        )}
      </main>

      {/* Bottom Sticky Action Bar */}
      <ActionButtons
        onPrint={handlePrint}
        onSavePdf={handleSavePdf}
        onClear={handleClearRequest}
        onNewNote={handleNewNoteRequest}
        viewMode={viewMode}
        onToggleView={handleToggleView}
      />

      {/* Dedicated A4 Printable Document with all 4 sections in order (Always ready for @media print) */}
      <PrintableStatement
        details={{
          date: data.date,
          eventName: data.eventName,
          clientName: data.clientName,
          eventLocation: data.eventLocation,
          phoneNumber: data.phoneNumber
        }}
        sections={data.sections}
        totalItems={totalItemsCount}
        totalPrice={data.totalPrice}
        isScreenPreview={false}
      />

      {/* Confirmation Modal */}
      <ConfirmModal
        isOpen={modalState.isOpen}
        title={modalState.title}
        message={modalState.message}
        confirmText={modalState.confirmText}
        isDestructive={modalState.isDestructive}
        onConfirm={modalState.onConfirm}
        onCancel={closeModal}
      />
    </div>
  );
}


