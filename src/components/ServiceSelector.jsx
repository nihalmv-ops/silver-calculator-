import React from 'react';
import { PRESET_SERVICES } from '../utils/storage';
import { UtensilsIcon, PlusIcon } from './icons';

export default function ServiceSelector({ onAddService, eventGuests }) {
  const handleQuickAdd = (preset) => {
    const qty = preset.defaultUnit === 'Fixed' ? '1' : (eventGuests || '500');
    onAddService({
      name: preset.name,
      quantity: qty,
      unit: preset.defaultUnit,
      rate: String(preset.defaultRate)
    });
  };

  const handleAddCustom = () => {
    onAddService({
      name: '',
      quantity: eventGuests || '500',
      unit: 'Guests',
      rate: ''
    });
  };

  return (
    <div className="service-selector-container">
      <div className="service-selector-header">
        <div className="flex items-center gap-2">
          <UtensilsIcon className="w-4 h-4 text-emerald-800" />
          <span className="text-sm font-semibold text-emerald-950 uppercase tracking-wide">
            Quick-Add Catering Services / Functions:
          </span>
        </div>
        <span className="text-xs text-emerald-700 italic">
          Click any button to add to pricing table below
        </span>
      </div>

      <div className="quick-service-buttons">
        {PRESET_SERVICES.map((preset) => (
          <button
            key={preset.name}
            type="button"
            className="btn-quick-service"
            onClick={() => handleQuickAdd(preset)}
            title={`Add ${preset.name} (${preset.defaultUnit} @ ₹${preset.defaultRate})`}
          >
            <PlusIcon className="w-3.5 h-3.5 text-gold-600" />
            <span>{preset.name}</span>
            <span className="quick-service-rate-hint">₹{preset.defaultRate}</span>
          </button>
        ))}

        <button
          type="button"
          className="btn-quick-service btn-custom-service"
          onClick={handleAddCustom}
        >
          <PlusIcon className="w-3.5 h-3.5 text-emerald-600" />
          <span>+ Custom Service</span>
        </button>
      </div>
    </div>
  );
}
