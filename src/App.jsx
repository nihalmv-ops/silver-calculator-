import { useState, useEffect, useMemo } from 'react';
import Header from './components/Header';
import CustomerForm from './components/CustomerForm';
import EventForm from './components/EventForm';
import ServiceSelector from './components/ServiceSelector';
import ServiceTable from './components/ServiceTable';
import TotalsSection from './components/TotalsSection';
import PaymentSummary from './components/PaymentSummary';
import QuotationPreview from './components/QuotationPreview';
import InvoicePreview from './components/InvoicePreview';
import RecentDocuments from './components/RecentDocuments';
import ConfirmModal from './components/ConfirmModal';

// Preserved Handover components
import EventDetails from './components/EventDetails';
import FoodItemsSection from './components/FoodItemsSection';
import TotalPriceSection from './components/TotalPriceSection';
import PrintableStatement from './components/PrintableStatement';

import {
  ReceiptIcon,
  PrinterIcon,
  WhatsAppIcon,
  EyeIcon,
  ArrowRightIcon,
  SparklesIcon,
  TrashIcon
} from './components/icons';

import {
  getQuotations,
  saveQuotation,
  deleteQuotation,
  getInvoices,
  saveInvoice,
  deleteInvoice,
  getEmptyQuotation,
  getEmptyInvoice,
  createEmptyServiceItem,
  loadNoteFromStorage,
  saveNoteToStorage,
  clearNoteFromStorage,
  getEmptyNote,
  DEMO_DATA
} from './utils/storage';

import {
  calcSubtotal,
  calcDiscount,
  calcGST,
  calcGrandTotal,
  calcBalance,
  determinePaymentStatus
} from './utils/calculations';

import { getNextQuotationNumber, getNextInvoiceNumber } from './utils/documentNumber';
import { openWhatsAppShare } from './utils/whatsapp';

export default function App() {
  // Views: 'quotation_form' | 'quotation_preview' | 'invoice_form' | 'invoice_preview' | 'recent' | 'handover'
  const [activeView, setActiveView] = useState('quotation_form');

  // Quotation & Invoice storage states
  const [quotations, setQuotations] = useState(() => getQuotations());
  const [invoices, setInvoices] = useState(() => getInvoices());

  // Active documents being drafted or edited
  const [currentQuotation, setCurrentQuotation] = useState(() => {
    const list = getQuotations();
    return list.length > 0 ? { ...list[0] } : getEmptyQuotation();
  });

  const [currentInvoice, setCurrentInvoice] = useState(() => {
    const list = getInvoices();
    return list.length > 0 ? { ...list[0] } : getEmptyInvoice();
  });

  // Preserved Handover Note state
  const [handoverData, setHandoverData] = useState(() => loadNoteFromStorage());

  // Notifications / Toast
  const [toastMessage, setToastMessage] = useState(null);

  // Modal dialog state
  const [modalState, setModalState] = useState({
    isOpen: false,
    title: '',
    message: '',
    confirmText: 'Confirm',
    isDestructive: false,
    onConfirm: () => {}
  });

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Sync calculations dynamically whenever quotation changes
  const computedQuotation = useMemo(() => {
    const items = currentQuotation.items || [];
    const subtotal = calcSubtotal(items);
    const discountAmount = calcDiscount(
      subtotal,
      currentQuotation.discountType,
      currentQuotation.discountValue
    );
    const taxableAmount = Math.max(0, subtotal - discountAmount);
    const gstAmount = currentQuotation.taxEnabled
      ? calcGST(taxableAmount, currentQuotation.gstPercent)
      : 0;
    const grandTotal = calcGrandTotal(subtotal, discountAmount, gstAmount);
    const balanceDue = calcBalance(grandTotal, currentQuotation.advancePaid);

    return {
      ...currentQuotation,
      subtotal,
      discountAmount,
      gstAmount,
      grandTotal,
      balanceDue
    };
  }, [currentQuotation]);

  // Sync calculations dynamically whenever invoice changes
  const computedInvoice = useMemo(() => {
    const items = currentInvoice.items || [];
    const subtotal = calcSubtotal(items);
    const discountAmount = calcDiscount(
      subtotal,
      currentInvoice.discountType,
      currentInvoice.discountValue
    );
    const taxableAmount = Math.max(0, subtotal - discountAmount);
    const gstAmount = currentInvoice.taxEnabled
      ? calcGST(taxableAmount, currentInvoice.gstPercent)
      : 0;
    const grandTotal = calcGrandTotal(subtotal, discountAmount, gstAmount);
    const balanceDue = calcBalance(grandTotal, currentInvoice.advancePaid);
    const paymentStatus = determinePaymentStatus(grandTotal, currentInvoice.advancePaid);

    return {
      ...currentInvoice,
      subtotal,
      discountAmount,
      gstAmount,
      grandTotal,
      balanceDue,
      paymentStatus
    };
  }, [currentInvoice]);

  // Handover total items count (preserved)
  const handoverItemsCount = useMemo(() => {
    if (!handoverData.sections) return 0;
    let count = 0;
    const sectionKeys = ['morning', 'afternoon', 'evening', 'night'];
    sectionKeys.forEach((key) => {
      const items = handoverData.sections[key] || [];
      const valid = items.filter(
        (item) =>
          (item.name && item.name.trim() !== '') ||
          (item.quantity && String(item.quantity).trim() !== '')
      );
      count += valid.length;
    });
    return count;
  }, [handoverData.sections]);

  // Save handover changes automatically
  useEffect(() => {
    if (activeView === 'handover') {
      saveNoteToStorage(handoverData);
    }
  }, [handoverData, activeView]);

  // --- Quotation Handlers ---
  const handleQuotationCustomerChange = (patch) => {
    setCurrentQuotation((prev) => ({ ...prev, ...patch }));
  };

  const handleQuotationEventChange = (patch) => {
    setCurrentQuotation((prev) => ({ ...prev, ...patch }));
  };

  const handleQuotationItemsChange = (newItems) => {
    setCurrentQuotation((prev) => ({ ...prev, items: newItems }));
  };

  const handleAddQuotationService = (serviceData) => {
    const newItem = createEmptyServiceItem(
      serviceData.name,
      serviceData.quantity,
      serviceData.unit,
      serviceData.rate
    );
    setCurrentQuotation((prev) => ({
      ...prev,
      items: [...(prev.items || []), newItem]
    }));
  };

  const handleQuotationTotalsChange = (patch) => {
    setCurrentQuotation((prev) => ({ ...prev, ...patch }));
  };

  const handleSaveQuotation = () => {
    if (!computedQuotation.customerName || !computedQuotation.customerName.trim()) {
      showToast('⚠️ Please enter Customer Name before saving');
      return;
    }
    const success = saveQuotation(computedQuotation);
    if (success) {
      setQuotations(getQuotations());
      showToast(`✅ Quotation #${computedQuotation.number} saved successfully!`);
    }
  };

  const handleNewQuotation = () => {
    const blank = getEmptyQuotation();
    blank.number = getNextQuotationNumber(false);
    setCurrentQuotation(blank);
    setActiveView('quotation_form');
  };

  // --- Convert to Invoice Workflow (Critical Feature) ---
  const handleConvertToInvoice = (sourceQuote = null) => {
    const quote = sourceQuote || computedQuotation;
    if (!quote.customerName || !quote.customerName.trim()) {
      showToast('⚠️ Please enter Customer Name in quotation first');
      return;
    }

    // Save quotation first if needed
    saveQuotation(quote);
    setQuotations(getQuotations());

    // Generate converted invoice with fresh INV number
    const newInv = getEmptyInvoice(quote);
    newInv.number = getNextInvoiceNumber(false);

    // Save invoice to storage
    saveInvoice(newInv);
    setInvoices(getInvoices());

    setCurrentInvoice(newInv);
    setActiveView('invoice_form');
    showToast(`🎉 Converted to Invoice #${newInv.number}! Ready for payment review.`);
  };

  // --- Invoice Handlers ---
  const handleInvoiceCustomerChange = (patch) => {
    setCurrentInvoice((prev) => ({ ...prev, ...patch }));
  };

  const handleInvoiceEventChange = (patch) => {
    setCurrentInvoice((prev) => ({ ...prev, ...patch }));
  };

  const handleInvoiceItemsChange = (newItems) => {
    setCurrentInvoice((prev) => ({ ...prev, items: newItems }));
  };

  const handleAddInvoiceService = (serviceData) => {
    const newItem = createEmptyServiceItem(
      serviceData.name,
      serviceData.quantity,
      serviceData.unit,
      serviceData.rate
    );
    setCurrentInvoice((prev) => ({
      ...prev,
      items: [...(prev.items || []), newItem]
    }));
  };

  const handleInvoiceTotalsChange = (patch) => {
    setCurrentInvoice((prev) => ({ ...prev, ...patch }));
  };

  const handleSaveInvoice = () => {
    if (!computedInvoice.customerName || !computedInvoice.customerName.trim()) {
      showToast('⚠️ Please enter Customer Name before saving');
      return;
    }
    const success = saveInvoice(computedInvoice);
    if (success) {
      setInvoices(getInvoices());
      showToast(`✅ Invoice #${computedInvoice.number} saved successfully!`);
    }
  };

  const handleNewInvoice = () => {
    const blank = getEmptyInvoice();
    blank.number = getNextInvoiceNumber(false);
    setCurrentInvoice(blank);
    setActiveView('invoice_form');
  };

  // --- Recent Documents Operations ---
  const handleViewQuotation = (id) => {
    const doc = quotations.find((q) => q.id === id);
    if (doc) {
      setCurrentQuotation(doc);
      setActiveView('quotation_preview');
    }
  };

  const handleEditQuotation = (id) => {
    const doc = quotations.find((q) => q.id === id);
    if (doc) {
      setCurrentQuotation(doc);
      setActiveView('quotation_form');
    }
  };

  const handleDeleteQuotation = (id) => {
    const doc = quotations.find((q) => q.id === id);
    setModalState({
      isOpen: true,
      title: `Delete Quotation #${doc ? doc.number : ''}?`,
      message: `Are you sure you want to permanently delete quotation for "${doc ? doc.customerName : 'client'}"?`,
      confirmText: 'Delete Quotation',
      isDestructive: true,
      onConfirm: () => {
        deleteQuotation(id);
        setQuotations(getQuotations());
        showToast('Quotation deleted');
        setModalState((prev) => ({ ...prev, isOpen: false }));
      }
    });
  };

  const handleViewInvoice = (id) => {
    const doc = invoices.find((i) => i.id === id);
    if (doc) {
      setCurrentInvoice(doc);
      setActiveView('invoice_preview');
    }
  };

  const handleEditInvoice = (id) => {
    const doc = invoices.find((i) => i.id === id);
    if (doc) {
      setCurrentInvoice(doc);
      setActiveView('invoice_form');
    }
  };

  const handleDeleteInvoice = (id) => {
    const doc = invoices.find((i) => i.id === id);
    setModalState({
      isOpen: true,
      title: `Delete Invoice #${doc ? doc.number : ''}?`,
      message: `Are you sure you want to permanently delete invoice for "${doc ? doc.customerName : 'client'}"?`,
      confirmText: 'Delete Invoice',
      isDestructive: true,
      onConfirm: () => {
        deleteInvoice(id);
        setInvoices(getInvoices());
        showToast('Invoice deleted');
        setModalState((prev) => ({ ...prev, isOpen: false }));
      }
    });
  };

  // --- Handover Handlers (Preserved) ---
  const handleHandoverDetailsChange = (patch) => {
    setHandoverData((prev) => ({ ...prev, ...patch }));
  };

  const handleHandoverSectionChange = (sectionKey, newItems) => {
    setHandoverData((prev) => ({
      ...prev,
      sections: {
        ...prev.sections,
        [sectionKey]: newItems
      }
    }));
  };

  const handleHandoverPriceChange = (price) => {
    setHandoverData((prev) => ({ ...prev, totalPrice: price }));
  };

  const handleHandoverLoadDemo = () => {
    setHandoverData({ ...DEMO_DATA });
    showToast('Loaded demo Rahul Wedding handover data');
  };

  const handleHandoverClear = () => {
    setModalState({
      isOpen: true,
      title: 'Reset Handover Note?',
      message: 'This will reset the food items across all 4 sections. Are you sure?',
      confirmText: 'Reset',
      isDestructive: true,
      onConfirm: () => {
        clearNoteFromStorage();
        setHandoverData(getEmptyNote());
        setModalState((prev) => ({ ...prev, isOpen: false }));
      }
    });
  };

  // General Print
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="app-container">
      {/* Brand Header & Top Nav */}
      <Header
        activeView={activeView}
        onNavigate={(view) => setActiveView(view)}
        totalQuotesCount={quotations.length}
        totalInvoicesCount={invoices.length}
      />

      {/* Floating Toast Notification */}
      {toastMessage && (
        <div className="app-toast-alert no-print">
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Main Workspace Area */}
      <main className="screen-container">
        {/* ========================================================
            VIEW 1: QUOTATION FORM
        ======================================================== */}
        {activeView === 'quotation_form' && (
          <div className="quotation-form-screen">
            {/* Action Bar Above Form */}
            <div className="view-control-bar no-print">
              <div className="view-title-wrap">
                <span className="doc-pill-quotation">QUOTATION BUILDER</span>
                <span className="font-mono text-emerald-950 font-bold">
                  #{computedQuotation.number || 'QT-0001'}
                </span>
              </div>

              <div className="view-actions-cluster">
                <button
                  type="button"
                  className="btn-action-view btn-secondary"
                  onClick={handleSaveQuotation}
                >
                  <span>Save</span>
                </button>

                <button
                  type="button"
                  className="btn-action-view btn-preview-gold"
                  onClick={() => {
                    handleSaveQuotation();
                    setActiveView('quotation_preview');
                  }}
                >
                  <EyeIcon className="w-4 h-4" />
                  <span>Preview Quotation</span>
                </button>

                <button
                  type="button"
                  className="btn-action-view btn-whatsapp"
                  onClick={() => openWhatsAppShare(computedQuotation, false)}
                >
                  <WhatsAppIcon className="w-4 h-4" />
                  <span>WhatsApp</span>
                </button>

                <button
                  type="button"
                  className="btn-action-view btn-convert-invoice"
                  onClick={() => handleConvertToInvoice()}
                  title="Convert this quotation into an invoice"
                >
                  <ReceiptIcon className="w-4 h-4" />
                  <span>Convert to Invoice</span>
                  <ArrowRightIcon className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Section A: Customer Details */}
            <CustomerForm
              details={computedQuotation}
              onChange={handleQuotationCustomerChange}
            />

            {/* Section B: Event Details */}
            <EventForm
              details={computedQuotation}
              onChange={handleQuotationEventChange}
              isInvoice={false}
            />

            {/* Section C: Multi-Service Quick Selector */}
            <ServiceSelector
              eventGuests={computedQuotation.guests}
              onAddService={handleAddQuotationService}
            />

            {/* Section D: Services Items Table */}
            <ServiceTable
              items={computedQuotation.items}
              onChange={handleQuotationItemsChange}
              onAddItem={handleAddQuotationService}
            />

            {/* Section E: Auto Calculations & Totals */}
            <TotalsSection
              subtotal={computedQuotation.subtotal}
              discountType={computedQuotation.discountType}
              discountValue={computedQuotation.discountValue}
              taxEnabled={computedQuotation.taxEnabled}
              gstPercent={computedQuotation.gstPercent}
              advancePaid={computedQuotation.advancePaid}
              onChange={handleQuotationTotalsChange}
              isInvoice={false}
            />

            {/* Bottom Form Sticky Bar */}
            <div className="bottom-sticky-bar no-print">
              <div className="sticky-info">
                <span className="sticky-label">Grand Total:</span>
                <span className="sticky-amount font-mono">
                  {computedQuotation.grandTotal ? `₹${computedQuotation.grandTotal.toLocaleString('en-IN')}` : '₹0'}
                </span>
              </div>

              <div className="sticky-actions">
                <button
                  type="button"
                  className="btn-sticky btn-save"
                  onClick={handleSaveQuotation}
                >
                  <span>Save Quotation</span>
                </button>

                <button
                  type="button"
                  className="btn-sticky btn-preview"
                  onClick={() => {
                    handleSaveQuotation();
                    setActiveView('quotation_preview');
                  }}
                >
                  <EyeIcon className="w-4 h-4" />
                  <span>Preview & Print</span>
                </button>

                <button
                  type="button"
                  className="btn-sticky btn-convert"
                  onClick={() => handleConvertToInvoice()}
                >
                  <ReceiptIcon className="w-4 h-4" />
                  <span>Convert to Invoice</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================
            VIEW 2: QUOTATION PREVIEW (A4 Document Model)
        ======================================================== */}
        {activeView === 'quotation_preview' && (
          <QuotationPreview
            quotation={computedQuotation}
            onEdit={() => setActiveView('quotation_form')}
            onConvertToInvoice={() => handleConvertToInvoice()}
            isPrintOnly={false}
          />
        )}

        {/* ========================================================
            VIEW 3: INVOICE FORM
        ======================================================== */}
        {activeView === 'invoice_form' && (
          <div className="invoice-form-screen">
            {/* Action Bar Above Form */}
            <div className="view-control-bar no-print">
              <div className="view-title-wrap">
                <span className="doc-pill-invoice">INVOICE BUILDER</span>
                <span className="font-mono text-emerald-950 font-bold">
                  #{computedInvoice.number || 'INV-0001'}
                </span>
                {computedInvoice.quotationNumber && (
                  <span className="text-xs text-amber-800 bg-amber-100 px-2 py-0.5 rounded ml-2 font-medium">
                    Converted from #{computedInvoice.quotationNumber}
                  </span>
                )}
              </div>

              <div className="view-actions-cluster">
                <button
                  type="button"
                  className="btn-action-view btn-secondary"
                  onClick={handleSaveInvoice}
                >
                  <span>Save</span>
                </button>

                <button
                  type="button"
                  className="btn-action-view btn-preview-gold"
                  onClick={() => {
                    handleSaveInvoice();
                    setActiveView('invoice_preview');
                  }}
                >
                  <EyeIcon className="w-4 h-4" />
                  <span>Preview Invoice</span>
                </button>

                <button
                  type="button"
                  className="btn-action-view btn-whatsapp"
                  onClick={() => openWhatsAppShare(computedInvoice, true)}
                >
                  <WhatsAppIcon className="w-4 h-4" />
                  <span>WhatsApp</span>
                </button>

                <button
                  type="button"
                  className="btn-action-view btn-print-direct"
                  onClick={handlePrint}
                >
                  <PrinterIcon className="w-4 h-4" />
                  <span>Print A4</span>
                </button>
              </div>
            </div>

            {/* Section A: Customer Details */}
            <CustomerForm
              details={computedInvoice}
              onChange={handleInvoiceCustomerChange}
            />

            {/* Section B: Event Details */}
            <EventForm
              details={computedInvoice}
              onChange={handleInvoiceEventChange}
              isInvoice={true}
            />

            {/* Section C: Multi-Service Quick Selector */}
            <ServiceSelector
              eventGuests={computedInvoice.guests}
              onAddService={handleAddInvoiceService}
            />

            {/* Section D: Services Items Table */}
            <ServiceTable
              items={computedInvoice.items}
              onChange={handleInvoiceItemsChange}
              onAddItem={handleAddInvoiceService}
            />

            {/* Section E: Auto Calculations & Totals */}
            <TotalsSection
              subtotal={computedInvoice.subtotal}
              discountType={computedInvoice.discountType}
              discountValue={computedInvoice.discountValue}
              taxEnabled={computedInvoice.taxEnabled}
              gstPercent={computedInvoice.gstPercent}
              advancePaid={computedInvoice.advancePaid}
              onChange={handleInvoiceTotalsChange}
              isInvoice={true}
            />

            {/* Section F: Invoice Payment Details & Reconciliation */}
            <PaymentSummary
              grandTotal={computedInvoice.grandTotal}
              advancePaid={computedInvoice.advancePaid}
              paymentMethod={computedInvoice.paymentMethod}
              transactionNotes={computedInvoice.transactionNotes}
              onChange={handleInvoiceTotalsChange}
            />

            {/* Bottom Form Sticky Bar */}
            <div className="bottom-sticky-bar no-print">
              <div className="sticky-info">
                <span className="sticky-label">Invoice Balance Due:</span>
                <span className="sticky-amount font-mono">
                  {computedInvoice.balanceDue ? `₹${computedInvoice.balanceDue.toLocaleString('en-IN')}` : '₹0'}
                </span>
              </div>

              <div className="sticky-actions">
                <button
                  type="button"
                  className="btn-sticky btn-save"
                  onClick={handleSaveInvoice}
                >
                  <span>Save Invoice</span>
                </button>

                <button
                  type="button"
                  className="btn-sticky btn-preview"
                  onClick={() => {
                    handleSaveInvoice();
                    setActiveView('invoice_preview');
                  }}
                >
                  <EyeIcon className="w-4 h-4" />
                  <span>Preview & Print</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================
            VIEW 4: INVOICE PREVIEW (A4 Document Model)
        ======================================================== */}
        {activeView === 'invoice_preview' && (
          <InvoicePreview
            invoice={computedInvoice}
            onEdit={() => setActiveView('invoice_form')}
            isPrintOnly={false}
          />
        )}

        {/* ========================================================
            VIEW 5: RECENT DOCUMENTS DASHBOARD
        ======================================================== */}
        {activeView === 'recent' && (
          <RecentDocuments
            quotations={quotations}
            invoices={invoices}
            onViewQuotation={handleViewQuotation}
            onEditQuotation={handleEditQuotation}
            onDeleteQuotation={handleDeleteQuotation}
            onConvertQuotation={handleConvertToInvoice}
            onViewInvoice={handleViewInvoice}
            onEditInvoice={handleEditInvoice}
            onDeleteInvoice={handleDeleteInvoice}
            onNewQuotation={handleNewQuotation}
            onNewInvoice={handleNewInvoice}
          />
        )}

        {/* ========================================================
            VIEW 6: PRESERVED FOOD HANDOVER NOTE
        ======================================================== */}
        {activeView === 'handover' && (
          <div className="handover-section-wrap">
            <div className="view-control-bar no-print">
              <div className="view-title-wrap">
                <span className="doc-pill-quotation">FOOD HANDOVER NOTE</span>
                <span className="text-xs text-emerald-800">4 Time Sections (Morning, Afternoon, Evening, Night)</span>
              </div>
              <div className="view-actions-cluster">
                <button
                  type="button"
                  className="btn-action-view btn-secondary"
                  onClick={handleHandoverLoadDemo}
                >
                  <SparklesIcon className="w-4 h-4" />
                  <span>Load Sample</span>
                </button>
                <button
                  type="button"
                  className="btn-action-view btn-secondary"
                  onClick={handleHandoverClear}
                  title="Reset note data"
                >
                  <TrashIcon className="w-4 h-4 text-red-600" />
                  <span>Reset</span>
                </button>
                <button
                  type="button"
                  className="btn-action-view btn-print-direct"
                  onClick={handlePrint}
                >
                  <PrinterIcon className="w-4 h-4" />
                  <span>Print Note</span>
                </button>
              </div>
            </div>

            <EventDetails
              details={{
                date: handoverData.date,
                eventName: handoverData.eventName,
                clientName: handoverData.clientName,
                eventLocation: handoverData.eventLocation,
                phoneNumber: handoverData.phoneNumber
              }}
              onChange={handleHandoverDetailsChange}
            />

            <FoodItemsSection
              sections={handoverData.sections}
              onSectionItemsChange={handleHandoverSectionChange}
            />

            <TotalPriceSection
              totalItems={handoverItemsCount}
              totalPrice={handoverData.totalPrice}
              onTotalPriceChange={handleHandoverPriceChange}
            />
          </div>
        )}
      </main>

      {/* ========================================================
          DEDICATED @media print RENDERINGS
          (Always available for browser print engine)
      ======================================================== */}
      <div className="print-target-container">
        {(activeView === 'quotation_form' || activeView === 'quotation_preview') && (
          <QuotationPreview
            quotation={computedQuotation}
            isPrintOnly={true}
          />
        )}

        {(activeView === 'invoice_form' || activeView === 'invoice_preview') && (
          <InvoicePreview
            invoice={computedInvoice}
            isPrintOnly={true}
          />
        )}

        {activeView === 'handover' && (
          <PrintableStatement
            details={{
              date: handoverData.date,
              eventName: handoverData.eventName,
              clientName: handoverData.clientName,
              eventLocation: handoverData.eventLocation,
              phoneNumber: handoverData.phoneNumber
            }}
            sections={handoverData.sections}
            totalItems={handoverItemsCount}
            totalPrice={handoverData.totalPrice}
            isScreenPreview={false}
          />
        )}
      </div>

      {/* Confirmation Modal */}
      <ConfirmModal
        isOpen={modalState.isOpen}
        title={modalState.title}
        message={modalState.message}
        confirmText={modalState.confirmText}
        isDestructive={modalState.isDestructive}
        onConfirm={modalState.onConfirm}
        onCancel={() => setModalState((prev) => ({ ...prev, isOpen: false }))}
      />
    </div>
  );
}
