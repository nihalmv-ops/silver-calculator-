import { useState, useEffect, useMemo } from 'react';
import Header from './components/Header';
import EventDetails from './components/EventDetails';
import FoodItemsSection from './components/FoodItemsSection';
import TotalPriceSection from './components/TotalPriceSection';
import ActionButtons from './components/ActionButtons';
import PrintableStatement from './components/PrintableStatement';
import ConfirmModal from './components/ConfirmModal';
import {
  loadNoteFromStorage,
  saveNoteToStorage,
  clearNoteFromStorage,
  getEmptyNote,
  DEMO_DATA
} from './utils/storage';

export default function App() {
  const [data, setData] = useState(() => loadNoteFromStorage());
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

  // Total items count (non-empty items)
  const totalItemsCount = useMemo(() => {
    const valid = data.items.filter(
      (item) => (item.name && item.name.trim() !== '') || (item.quantity && String(item.quantity).trim() !== '')
    );
    return valid.length;
  }, [data.items]);

  // Handlers for updating state
  const handleDetailsChange = (newDetails) => {
    setData((prev) => ({
      ...prev,
      ...newDetails
    }));
  };

  const handleItemsChange = (newItems) => {
    setData((prev) => ({
      ...prev,
      items: newItems
    }));
  };

  const handleTotalPriceChange = (newPrice) => {
    setData((prev) => ({
      ...prev,
      totalPrice: newPrice
    }));
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
      message: 'This will reset all food items, event details, and the total price. Are you sure you want to proceed?',
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

        {/* Food Items List (Food Item, Qty, Unit) */}
        <FoodItemsSection
          items={data.items}
          onChange={handleItemsChange}
        />

        {/* Single Manual TOTAL PRICE & TOTAL ITEMS */}
        <TotalPriceSection
          totalItems={totalItemsCount}
          totalPrice={data.totalPrice}
          onTotalPriceChange={handleTotalPriceChange}
        />
      </main>

      {/* Bottom Sticky Action Bar */}
      <ActionButtons
        onPrint={handlePrint}
        onSavePdf={handleSavePdf}
        onClear={handleClearRequest}
        onNewNote={handleNewNoteRequest}
      />

      {/* Dedicated A4 Printable Document */}
      <PrintableStatement
        details={{
          date: data.date,
          eventName: data.eventName,
          clientName: data.clientName,
          eventLocation: data.eventLocation,
          phoneNumber: data.phoneNumber
        }}
        items={data.items}
        totalPrice={data.totalPrice}
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
