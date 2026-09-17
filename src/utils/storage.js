const STORAGE_KEY = 'silver_catering_note_v1';

export const getEmptyNote = () => ({
  date: new Date().toISOString().split('T')[0],
  eventName: '',
  customerName: '',
  eventLocation: '',
  phoneNumber: '',
  incomes: [
    { id: 'inc-' + Date.now() + '-1', description: '', amount: '' }
  ],
  expenses: [
    { id: 'exp-' + Date.now() + '-1', description: '', amount: '' }
  ]
});

// Required prompt test case: "Rahul Wedding"
export const DEMO_DATA = {
  date: new Date().toISOString().split('T')[0],
  eventName: 'Rahul Wedding',
  customerName: 'Rahul',
  eventLocation: 'Ernakulam, Kerala',
  phoneNumber: '+91 98470 12345',
  incomes: [
    { id: 'inc-demo-1', description: 'Catering Payment', amount: 50000 },
    { id: 'inc-demo-2', description: 'Advance', amount: 20000 },
    { id: 'inc-demo-3', description: 'Other', amount: 5000 }
  ],
  expenses: [
    { id: 'exp-demo-1', description: 'Rice', amount: 5000 },
    { id: 'exp-demo-2', description: 'Chicken', amount: 12000 },
    { id: 'exp-demo-3', description: 'Vegetables', amount: 4000 },
    { id: 'exp-demo-4', description: 'Staff', amount: 8000 },
    { id: 'exp-demo-5', description: 'Transport', amount: 2000 }
  ]
};

export function loadNoteFromStorage() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return getEmptyNote();
    const parsed = JSON.parse(raw);
    return {
      date: parsed.date || new Date().toISOString().split('T')[0],
      eventName: parsed.eventName || '',
      customerName: parsed.customerName || '',
      eventLocation: parsed.eventLocation || '',
      phoneNumber: parsed.phoneNumber || '',
      incomes: Array.isArray(parsed.incomes) && parsed.incomes.length > 0
        ? parsed.incomes
        : [{ id: 'inc-' + Date.now(), description: '', amount: '' }],
      expenses: Array.isArray(parsed.expenses) && parsed.expenses.length > 0
        ? parsed.expenses
        : [{ id: 'exp-' + Date.now(), description: '', amount: '' }]
    };
  } catch (err) {
    console.error('Failed to load from storage:', err);
    return getEmptyNote();
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
