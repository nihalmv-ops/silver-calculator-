import React, { useState, useEffect, useMemo } from 'react';
import Header from './components/Header';
import EventDetails from './components/EventDetails';
import IncomeSection from './components/IncomeSection';
import ExpenseSection from './components/ExpenseSection';
import Summary from './components/Summary';
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
import { parseAmount } from './utils/formatters';

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

  // Total calculations
  const totalIncome = useMemo(() => {
    return data.incomes.reduce((sum, item) => sum + parseAmount(item.amount), 0);
  }, [data.incomes]);

  const totalExpense = useMemo(() => {
    return data.expenses.reduce((sum, item) => sum + parseAmount(item.amount), 0);
  }, [data.expenses]);

  // Handlers for updating state
  const handleDetailsChange = (newDetails) => {
    setData((prev) => ({
      ...prev,
      ...newDetails
    }));
  };

  const handleIncomesChange = (newIncomes) => {
    setData((prev) => ({
      ...prev,
      incomes: newIncomes
    }));
  };

  const handleExpensesChange = (newExpenses) => {
    setData((prev) => ({
      ...prev,
      expenses: newExpenses
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
      message: 'This will reset all entered client details, income entries, and expense items. Are you sure you want to proceed?',
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
      title: 'Start a New Note?',
      message: 'This will create a blank statement for a new event. Unsaved entries from the current note will be replaced.',
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
      {/* Top Luxury Branding Banner */}
      <Header
        onLoadDemo={handleLoadDemo}
        onNewNote={handleNewNoteRequest}
      />

      {/* Main Screen Form Layout */}
      <main className="screen-container">
        {/* Basic Event & Client Fields */}
        <EventDetails
          details={{
            date: data.date,
            eventName: data.eventName,
            customerName: data.customerName,
            eventLocation: data.eventLocation,
            phoneNumber: data.phoneNumber
          }}
          onChange={handleDetailsChange}
        />

        {/* Dynamic Income Section */}
        <IncomeSection
          incomes={data.incomes}
          onChange={handleIncomesChange}
          totalIncome={totalIncome}
        />

        {/* Dynamic Expense Section */}
        <ExpenseSection
          expenses={data.expenses}
          onChange={handleExpensesChange}
          totalExpense={totalExpense}
        />

        {/* Summary Card with Balance / Profit or Loss */}
        <Summary
          totalIncome={totalIncome}
          totalExpense={totalExpense}
        />
      </main>

      {/* Bottom Sticky Action Bar */}
      <ActionButtons
        onPrint={handlePrint}
        onSavePdf={handleSavePdf}
        onClear={handleClearRequest}
        onNewNote={handleNewNoteRequest}
        onLoadDemo={handleLoadDemo}
      />

      {/* Dedicated A4 Printable Statement (Active in Print / PDF dialog) */}
      <PrintableStatement
        details={{
          date: data.date,
          eventName: data.eventName,
          customerName: data.customerName,
          eventLocation: data.eventLocation,
          phoneNumber: data.phoneNumber
        }}
        incomes={data.incomes}
        expenses={data.expenses}
        totalIncome={totalIncome}
        totalExpense={totalExpense}
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
