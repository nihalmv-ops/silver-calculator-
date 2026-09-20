import React from 'react';
import { PRESET_SERVICES } from '../utils/storage';
import { PlusIcon, CheckIcon } from './icons';

export default function ServiceSelector({ onAddService, eventGuests, items = [] }) {
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

  const isPresetSelected = (presetName) => {
    return items.some(
      (it) => it.name && it.name.trim().toLowerCase() === presetName.toLowerCase()
    );
  };

  return (
    <div className="service-quick-selector">
      <div className="selector-title-row">
        <span className="selector-label">Quick-Add Catering Services:</span>
        <span className="selector-hint">Click to itemize in pricing table</span>
      </div>

      <div className="quick-service-buttons">
        {PRESET_SERVICES.map((preset) => {
          const selected = isPresetSelected(preset.name);
          return (
            <button
              key={preset.name}
              type="button"
              className={`btn-service-outline ${selected ? 'is-selected' : ''}`}
              onClick={() => handleQuickAdd(preset)}
              title={selected ? `${preset.name} added. Click to add another row.` : `Add ${preset.name}`}
            >
              {selected ? (
                <CheckIcon className="w-3.5 h-3.5 text-neutral-900 stroke-[2.5]" />
              ) : (
                <PlusIcon className="w-3.5 h-3.5 text-neutral-500" />
              )}
              <span>{preset.name}</span>
            </button>
          );
        })}

        <button
          type="button"
          className="btn-service-outline btn-custom-outline"
          onClick={handleAddCustom}
        >
          <PlusIcon className="w-3.5 h-3.5" />
          <span>Custom Service</span>
        </button>
      </div>
    </div>
  );
}

