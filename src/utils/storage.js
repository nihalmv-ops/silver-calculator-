/**
 * Storage and data model utilities for Silver Catering Quotation + Invoice Platform
 */
import { getNextQuotationNumber, getNextInvoiceNumber, ensureDocNumberSequence } from './documentNumber';

// Storage Keys
export const QUOTATIONS_STORAGE_KEY = 'silver_quotations';
export const INVOICES_STORAGE_KEY = 'silver_invoices';
export const LEGACY_HANDOVER_KEY = 'silver_catering_food_handover_v3';

// Available Units for Catering Services
export const SERVICE_UNIT_OPTIONS = [
  'Guests',
  'Plates',
  'Litre',
  'KG',
  'Nos',
  'Hours',
  'Fixed'
];

export const PAYMENT_METHODS = [
  'GPay / UPI',
  'Cash',
  'Bank Transfer (NEFT/RTGS)',
  'Cheque'
];

// Preset Services for Quick Add
export const PRESET_SERVICES = [
  { name: 'Breakfast', defaultUnit: 'Guests', defaultRate: 120 },
  { name: 'Lunch', defaultUnit: 'Guests', defaultRate: 250 },
  { name: 'Evening Reception', defaultUnit: 'Guests', defaultRate: 180 },
  { name: 'Wedding Eve', defaultUnit: 'Guests', defaultRate: 200 },
  { name: 'Reception – 3:00 PM', defaultUnit: 'Guests', defaultRate: 150 },
  { name: 'Arrangements', defaultUnit: 'Fixed', defaultRate: 15000 }
];

export const STANDARD_TERMS = [
  'Advance payment is mandatory to confirm the catering reservation.',
  'Final guest count and arrangement specifics must be confirmed at least 2 days prior to the event.',
  'Menu alterations can be accommodated up to 3 days before the function.',
  'All billing and dispute resolutions are subject to Malappuram jurisdiction.'
];

export const BANK_DETAILS = {
  accountName: 'Silver Catering Services',
  bankName: 'Federal Bank',
  branch: 'Valanchery',
  accountNumber: '12340200056789',
  ifscCode: 'FDRL0001234',
  upiId: '9846415767@upi',
  gpayNumber: '+91 98464 15767'
};

export const createEmptyServiceItem = (name = '', quantity = '', unit = 'Guests', rate = '') => ({
  id: 'srv-' + Date.now() + '-' + Math.random().toString(36).substring(2, 6),
  name,
  quantity,
  unit,
  rate,
  amount: 0
});

export const getEmptyQuotation = () => ({
  id: 'qt-' + Date.now(),
  type: 'quotation',
  number: getNextQuotationNumber(true),
  date: new Date().toISOString().split('T')[0],
  validUntil: new Date(Date.now() + 14 * 86400000).toISOString().split('T')[0],
  customerName: '',
  customerPhone: '',
  customerEmail: '',
  customerAddress: '',
  eventName: 'Wedding Reception',
  eventDate: new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0],
  eventTime: '12:30 PM - Lunch',
  venue: 'Ernakulam',
  guests: '500',
  items: [
    createEmptyServiceItem('Breakfast', '500', 'Guests', '120'),
    createEmptyServiceItem('Lunch', '500', 'Guests', '250'),
    createEmptyServiceItem('Arrangements', '1', 'Fixed', '15000')
  ],
  discountType: 'flat', // 'flat' | 'percent'
  discountValue: '0',
  discountAmount: 0,
  taxEnabled: true,
  gstPercent: '5',
  gstAmount: 0,
  subtotal: 0,
  grandTotal: 0,
  advancePaid: '0',
  balanceDue: 0,
  terms: [...STANDARD_TERMS],
  notes: 'We look forward to serving your prestigious event with delicious Kerala culinary excellence.'
});

export const getEmptyInvoice = (fromQuotation = null) => {
  if (fromQuotation) {
    const invNumber = getNextInvoiceNumber(true);
    return {
      id: 'inv-' + Date.now(),
      type: 'invoice',
      quotationId: fromQuotation.id,
      quotationNumber: fromQuotation.number,
      number: invNumber,
      date: new Date().toISOString().split('T')[0],
      dueDate: fromQuotation.eventDate || new Date().toISOString().split('T')[0],
      customerName: fromQuotation.customerName || '',
      customerPhone: fromQuotation.customerPhone || '',
      customerEmail: fromQuotation.customerEmail || '',
      customerAddress: fromQuotation.customerAddress || '',
      eventName: fromQuotation.eventName || '',
      eventDate: fromQuotation.eventDate || '',
      eventTime: fromQuotation.eventTime || '',
      venue: fromQuotation.venue || '',
      guests: fromQuotation.guests || '',
      items: (fromQuotation.items || []).map((it) => ({
        ...it,
        id: 'srv-' + Date.now() + '-' + Math.random().toString(36).substring(2, 6)
      })),
      discountType: fromQuotation.discountType || 'flat',
      discountValue: fromQuotation.discountValue || '0',
      discountAmount: fromQuotation.discountAmount || 0,
      taxEnabled: fromQuotation.taxEnabled !== undefined ? fromQuotation.taxEnabled : true,
      gstPercent: fromQuotation.gstPercent || '5',
      gstAmount: fromQuotation.gstAmount || 0,
      subtotal: fromQuotation.subtotal || 0,
      grandTotal: fromQuotation.grandTotal || 0,
      advancePaid: fromQuotation.advancePaid || '0',
      balanceDue: fromQuotation.balanceDue || fromQuotation.grandTotal || 0,
      paymentStatus: 'PENDING',
      paymentMethod: 'GPay / UPI',
      transactionNotes: '',
      terms: [...STANDARD_TERMS],
      notes: fromQuotation.notes || 'Thank you for your valued business!'
    };
  }

  return {
    id: 'inv-' + Date.now(),
    type: 'invoice',
    quotationId: null,
    quotationNumber: null,
    number: getNextInvoiceNumber(true),
    date: new Date().toISOString().split('T')[0],
    dueDate: new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0],
    customerName: '',
    customerPhone: '',
    customerEmail: '',
    customerAddress: '',
    eventName: 'Nikah Catering',
    eventDate: new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0],
    eventTime: '1:00 PM',
    venue: 'Valanchery Community Hall',
    guests: '600',
    items: [
      createEmptyServiceItem('Lunch (Biryani & Sides)', '600', 'Guests', '240'),
      createEmptyServiceItem('Evening Tea & Snacks', '600', 'Guests', '70')
    ],
    discountType: 'flat',
    discountValue: '0',
    discountAmount: 0,
    taxEnabled: true,
    gstPercent: '5',
    gstAmount: 0,
    subtotal: 0,
    grandTotal: 0,
    advancePaid: '50000',
    balanceDue: 0,
    paymentStatus: 'PARTIALLY PAID',
    paymentMethod: 'GPay / UPI',
    transactionNotes: 'Advance paid via Google Pay Ref: UPI/6291048',
    terms: [...STANDARD_TERMS],
    notes: 'Thank you for choosing Silver Catering Services.'
  };
};

// Demo sample data to populate if storage is completely empty
const INITIAL_SAMPLE_QUOTATIONS = [
  {
    id: 'qt-sample-01',
    type: 'quotation',
    number: 'QT-0001',
    date: '2026-09-20',
    validUntil: '2026-10-04',
    customerName: 'Rahul Menon',
    customerPhone: '+91 98470 12345',
    customerEmail: 'rahul.menon@example.com',
    customerAddress: 'Kadavanthra, Kochi, Ernakulam',
    eventName: 'Rahul & Ananya Wedding Reception',
    eventDate: '2026-10-15',
    eventTime: '12:00 PM - 3:30 PM',
    venue: 'Grand Hyatt Convention Centre, Bolgatty, Kochi',
    guests: '500',
    items: [
      { id: 'it-1', name: 'Breakfast (Kerala Sadhya / Tiffin)', quantity: '500', unit: 'Guests', rate: '120', amount: 60000 },
      { id: 'it-2', name: 'Grand Wedding Lunch Buffet', quantity: '500', unit: 'Guests', rate: '250', amount: 125000 },
      { id: 'it-3', name: 'Arrangements & Live Counters Setup', quantity: '1', unit: 'Fixed', rate: '15000', amount: 15000 }
    ],
    discountType: 'flat',
    discountValue: '5000',
    discountAmount: 5000,
    taxEnabled: true,
    gstPercent: '5',
    gstAmount: 9750,
    subtotal: 200000,
    grandTotal: 204750,
    advancePaid: '50000',
    balanceDue: 154750,
    terms: [...STANDARD_TERMS],
    notes: 'Includes buffet chafing dishes, premium cutlery, uniformed service crew, and supervisor.'
  }
];

const INITIAL_SAMPLE_INVOICES = [
  {
    id: 'inv-sample-01',
    type: 'invoice',
    quotationId: 'qt-sample-01',
    quotationNumber: 'QT-0001',
    number: 'INV-0001',
    date: '2026-09-20',
    dueDate: '2026-10-15',
    customerName: 'Shameer Babu',
    customerPhone: '+91 98460 99887',
    customerEmail: 'shameer.vly@gmail.com',
    customerAddress: 'Town Hall Road, Valanchery, Malappuram',
    eventName: 'Nikah & Reception Catering',
    eventDate: '2026-10-02',
    eventTime: '1:00 PM - Afternoon Lunch',
    venue: 'Rose Garden Convention Center, Valanchery',
    guests: '600',
    items: [
      { id: 'inv-it-1', name: 'Malabar Dum Biryani Special Lunch', quantity: '600', unit: 'Guests', rate: '260', amount: 156000 },
      { id: 'inv-it-2', name: 'Evening High Tea & Traditional Snacks', quantity: '600', unit: 'Guests', rate: '60', amount: 36000 },
      { id: 'inv-it-3', name: 'Live Dessert & Welcome Drink Counter', quantity: '1', unit: 'Fixed', rate: '18000', amount: 18000 }
    ],
    discountType: 'flat',
    discountValue: '0',
    discountAmount: 0,
    taxEnabled: true,
    gstPercent: '5',
    gstAmount: 10500,
    subtotal: 210000,
    grandTotal: 220500,
    advancePaid: '100000',
    balanceDue: 120500,
    paymentStatus: 'PARTIALLY PAID',
    paymentMethod: 'GPay / UPI',
    transactionNotes: 'Received ₹1,00,000 Advance via Google Pay Ref: UPI/9846415767-101',
    terms: [...STANDARD_TERMS],
    notes: 'Thank you for entrusting Silver Catering Services for your auspicious celebration!'
  }
];

// --- Quotations Storage Helpers ---
export function getQuotations() {
  try {
    const raw = localStorage.getItem(QUOTATIONS_STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(QUOTATIONS_STORAGE_KEY, JSON.stringify(INITIAL_SAMPLE_QUOTATIONS));
      ensureDocNumberSequence('QT', 'QT-0001');
      return INITIAL_SAMPLE_QUOTATIONS;
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (e) {
    console.error('Failed to get quotations:', e);
    return INITIAL_SAMPLE_QUOTATIONS;
  }
}

export function saveQuotation(quote) {
  try {
    const quotes = getQuotations();
    const index = quotes.findIndex((q) => q.id === quote.id);
    let updated;
    if (index >= 0) {
      updated = [...quotes];
      updated[index] = quote;
    } else {
      updated = [quote, ...quotes];
    }
    localStorage.setItem(QUOTATIONS_STORAGE_KEY, JSON.stringify(updated));
    ensureDocNumberSequence('QT', quote.number);
    return true;
  } catch (e) {
    console.error('Failed to save quotation:', e);
    return false;
  }
}

export function deleteQuotation(id) {
  try {
    const quotes = getQuotations().filter((q) => q.id !== id);
    localStorage.setItem(QUOTATIONS_STORAGE_KEY, JSON.stringify(quotes));
    return true;
  } catch (e) {
    console.error('Failed to delete quotation:', e);
    return false;
  }
}

export function getQuotationById(id) {
  const quotes = getQuotations();
  return quotes.find((q) => q.id === id) || null;
}

// --- Invoices Storage Helpers ---
export function getInvoices() {
  try {
    const raw = localStorage.getItem(INVOICES_STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(INVOICES_STORAGE_KEY, JSON.stringify(INITIAL_SAMPLE_INVOICES));
      ensureDocNumberSequence('INV', 'INV-0001');
      return INITIAL_SAMPLE_INVOICES;
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (e) {
    console.error('Failed to get invoices:', e);
    return INITIAL_SAMPLE_INVOICES;
  }
}

export function saveInvoice(inv) {
  try {
    const invoices = getInvoices();
    const index = invoices.findIndex((i) => i.id === inv.id);
    let updated;
    if (index >= 0) {
      updated = [...invoices];
      updated[index] = inv;
    } else {
      updated = [inv, ...invoices];
    }
    localStorage.setItem(INVOICES_STORAGE_KEY, JSON.stringify(updated));
    ensureDocNumberSequence('INV', inv.number);
    return true;
  } catch (e) {
    console.error('Failed to save invoice:', e);
    return false;
  }
}

export function deleteInvoice(id) {
  try {
    const invoices = getInvoices().filter((i) => i.id !== id);
    localStorage.setItem(INVOICES_STORAGE_KEY, JSON.stringify(invoices));
    return true;
  } catch (e) {
    console.error('Failed to delete invoice:', e);
    return false;
  }
}

export function getInvoiceById(id) {
  const invoices = getInvoices();
  return invoices.find((i) => i.id === id) || null;
}

// --- Legacy Handover Note Support (Preserved for compatibility) ---
export const UNIT_OPTIONS = [
  'KG', 'Gram', 'Litre', 'ML', 'PCS', 'Packet', 'Box', 'Bottle', 'Other'
];

export const SECTIONS_CONFIG = [
  { key: 'morning', label: 'DAY MORNING', timeHint: 'Morning & Breakfast Dispatch', iconText: '🌅' },
  { key: 'afternoon', label: 'DAY AFTERNOON', timeHint: 'Afternoon & Lunch Dispatch', iconText: '☀️' },
  { key: 'evening', label: 'EVENING', timeHint: 'Evening & High-Tea Dispatch', iconText: '☕' },
  { key: 'night', label: 'NIGHT', timeHint: 'Night & Dinner Dispatch', iconText: '🌙' }
];

export const createEmptyItem = () => ({
  id: 'item-' + Date.now() + '-' + Math.random().toString(36).substring(2, 6),
  name: '',
  quantity: '',
  unit: 'KG'
});

export const getEmptyNote = () => ({
  date: new Date().toISOString().split('T')[0],
  eventName: '',
  clientName: '',
  eventLocation: '',
  phoneNumber: '',
  totalPrice: '',
  sections: {
    morning: [createEmptyItem()],
    afternoon: [createEmptyItem()],
    evening: [createEmptyItem()],
    night: [createEmptyItem()]
  }
});

export function loadNoteFromStorage() {
  try {
    const raw = localStorage.getItem(LEGACY_HANDOVER_KEY);
    if (!raw) return getEmptyNote();
    return JSON.parse(raw);
  } catch {
    return getEmptyNote();
  }
}

export function saveNoteToStorage(data) {
  try {
    localStorage.setItem(LEGACY_HANDOVER_KEY, JSON.stringify(data));
  } catch (err) {
    console.error('Failed to save handover note:', err);
  }
}

export function clearNoteFromStorage() {
  try {
    localStorage.removeItem(LEGACY_HANDOVER_KEY);
  } catch (err) {
    console.error('Failed to clear handover note:', err);
  }
}

// Handover Note Demo Data (preserved)
export const DEMO_DATA = {
  date: '2026-09-18',
  eventName: 'Rahul Wedding',
  clientName: 'Rahul',
  eventLocation: 'Ernakulam',
  phoneNumber: '+91 98470 12345',
  totalPrice: '75000',
  sections: {
    morning: [
      { id: 'm-1', name: 'Tea', quantity: '20', unit: 'Litre' },
      { id: 'm-2', name: 'Milk', quantity: '10', unit: 'Litre' },
      { id: 'm-3', name: 'Breakfast', quantity: '50', unit: 'PCS' }
    ],
    afternoon: [
      { id: 'a-1', name: 'Rice', quantity: '25', unit: 'KG' },
      { id: 'a-2', name: 'Chicken', quantity: '35', unit: 'KG' },
      { id: 'a-3', name: 'Vegetables', quantity: '15', unit: 'KG' }
    ],
    evening: [
      { id: 'e-1', name: 'Tea', quantity: '20', unit: 'Litre' },
      { id: 'e-2', name: 'Snacks', quantity: '100', unit: 'PCS' }
    ],
    night: [
      { id: 'n-1', name: 'Rice', quantity: '30', unit: 'KG' },
      { id: 'n-2', name: 'Chicken', quantity: '40', unit: 'KG' },
      { id: 'n-3', name: 'Payasam', quantity: '25', unit: 'Litre' }
    ]
  }
};

