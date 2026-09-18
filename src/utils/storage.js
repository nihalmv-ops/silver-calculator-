const STORAGE_KEY = 'silver_catering_food_handover_v3';

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

// Demo Data matching the user's exact specification
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

export function loadNoteFromStorage() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      // Also check if v2 key exists to migrate
      const legacyRaw = localStorage.getItem('silver_catering_food_handover_v2');
      if (legacyRaw) {
        const legacyParsed = JSON.parse(legacyRaw);
        return {
          date: legacyParsed.date || new Date().toISOString().split('T')[0],
          eventName: legacyParsed.eventName || '',
          clientName: legacyParsed.clientName || legacyParsed.customerName || '',
          eventLocation: legacyParsed.eventLocation || '',
          phoneNumber: legacyParsed.phoneNumber || '',
          totalPrice: legacyParsed.totalPrice !== undefined ? legacyParsed.totalPrice : '75000',
          sections: {
            morning: [createEmptyItem()],
            afternoon: Array.isArray(legacyParsed.items) && legacyParsed.items.length > 0
              ? legacyParsed.items
              : [createEmptyItem()],
            evening: [createEmptyItem()],
            night: [createEmptyItem()]
          }
        };
      }
      return DEMO_DATA; // Default to demo data matching user spec
    }

    const parsed = JSON.parse(raw);
    const sections = parsed.sections || {};

    return {
      date: parsed.date || new Date().toISOString().split('T')[0],
      eventName: parsed.eventName || '',
      clientName: parsed.clientName || parsed.customerName || '',
      eventLocation: parsed.eventLocation || '',
      phoneNumber: parsed.phoneNumber || '',
      totalPrice: parsed.totalPrice !== undefined ? parsed.totalPrice : '',
      sections: {
        morning: Array.isArray(sections.morning) && sections.morning.length > 0
          ? sections.morning
          : [createEmptyItem()],
        afternoon: Array.isArray(sections.afternoon) && sections.afternoon.length > 0
          ? sections.afternoon
          : [createEmptyItem()],
        evening: Array.isArray(sections.evening) && sections.evening.length > 0
          ? sections.evening
          : [createEmptyItem()],
        night: Array.isArray(sections.night) && sections.night.length > 0
          ? sections.night
          : [createEmptyItem()]
      }
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
    localStorage.removeItem('silver_catering_food_handover_v2');
  } catch (err) {
    console.error('Failed to clear storage:', err);
  }
}
