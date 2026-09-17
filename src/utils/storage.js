const STORAGE_KEY = 'silver_catering_food_handover_v2';

export const UNIT_OPTIONS = [
  'KG',
  'Gram',
  'Litre',
  'ML',
  'PCS',
  'Packet',
  'Box',
  'Bottle',
  'Other'
];

export const getEmptyNote = () => ({
  date: new Date().toISOString().split('T')[0],
  eventName: '',
  clientName: '',
  eventLocation: '',
  phoneNumber: '',
  totalPrice: '',
  items: [
    { id: 'item-' + Date.now() + '-1', name: '', quantity: '', unit: 'KG' }
  ]
});

// Demo Data matching the user's exact specification
export const DEMO_DATA = {
  date: '2026-09-18',
  eventName: 'Rahul Wedding',
  clientName: 'Rahul',
  eventLocation: 'Ernakulam',
  phoneNumber: '+91 98470 12345',
  totalPrice: '75000',
  items: [
    { id: 'demo-1', name: 'Rice', quantity: '25', unit: 'KG' },
    { id: 'demo-2', name: 'Chicken', quantity: '35', unit: 'KG' },
    { id: 'demo-3', name: 'Beef', quantity: '20', unit: 'KG' },
    { id: 'demo-4', name: 'Vegetables', quantity: '15', unit: 'KG' },
    { id: 'demo-5', name: 'Oil', quantity: '8', unit: 'Litre' },
    { id: 'demo-6', name: 'Milk', quantity: '10', unit: 'Litre' },
    { id: 'demo-7', name: 'Payasam', quantity: '25', unit: 'Litre' },
    { id: 'demo-8', name: 'Pickle', quantity: '5', unit: 'KG' },
    { id: 'demo-9', name: 'Water', quantity: '20', unit: 'Litre' }
  ]
};

export function loadNoteFromStorage() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEMO_DATA; // Defaults to the standard handover sample for immediate use!
    const parsed = JSON.parse(raw);
    return {
      date: parsed.date || new Date().toISOString().split('T')[0],
      eventName: parsed.eventName || '',
      clientName: parsed.clientName || parsed.customerName || '',
      eventLocation: parsed.eventLocation || '',
      phoneNumber: parsed.phoneNumber || '',
      totalPrice: parsed.totalPrice !== undefined ? parsed.totalPrice : '',
      items: Array.isArray(parsed.items) && parsed.items.length > 0
        ? parsed.items
        : [{ id: 'item-' + Date.now(), name: '', quantity: '', unit: 'KG' }]
    };
  } catch (err) {
    console.error('Failed to load from storage:', err);
    return DEMO_DATA;
  }
}

export function saveNoteToStorage(data) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (err) {
    console.error('Failed to save to storage:', err);
  }
}

export function clearNoteFromStorage() {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (err) {
    console.error('Failed to clear storage:', err);
  }
}
