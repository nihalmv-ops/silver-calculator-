import React from 'react';
import { SERVICE_UNIT_OPTIONS, createEmptyServiceItem } from '../utils/storage';
import { calcRowAmount } from '../utils/calculations';
import { formatINR } from '../utils/formatters';
import { TrashIcon, PlusIcon, UtensilsIcon } from './icons';

export default function ServiceTable({ items = [], onChange, onAddItem }) {
  const handleItemChange = (id, field, value) => {
    const updated = items.map((item) => {
      if (item.id === id) {
        const newItem = { ...item, [field]: value };
        // Recalculate row amount
        const qty = field === 'quantity' ? value : newItem.quantity;
        const rate = field === 'rate' ? value : newItem.rate;
        newItem.amount = calcRowAmount(qty, rate);
        return newItem;
      }
      return item;
    });
    onChange(updated);
  };

  const handleRemoveItem = (id) => {
    const updated = items.filter((item) => item.id !== id);
    onChange(updated);
  };

  const handleAddNewRow = () => {
    if (onAddItem) {
      onAddItem(createEmptyServiceItem());
    } else {
      onChange([...items, createEmptyServiceItem()]);
    }
  };

  return (
    <section className="form-card service-table-section">
      <div className="section-header-banner flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="section-icon-bubble">
            <UtensilsIcon className="w-5 h-5 text-emerald-800" />
          </div>
          <div>
            <h2 className="section-title">SECTION D: SERVICE ITEMS & PRICING TABLE</h2>
            <p className="section-subtitle">Detailed itemization of catering services, quantities, rates, and totals</p>
          </div>
        </div>

        <button
          type="button"
          className="btn-add-row-top"
          onClick={handleAddNewRow}
        >
          <PlusIcon className="w-4 h-4" />
          <span>Add Service</span>
        </button>
      </div>

      <div className="service-table-responsive-wrapper">
        <table className="service-table">
          <thead>
            <tr>
              <th className="col-idx">#</th>
              <th className="col-service">Service / Function Name</th>
              <th className="col-qty">Quantity / Pax</th>
              <th className="col-unit">Unit</th>
              <th className="col-rate">Rate (₹)</th>
              <th className="col-amount">Amount (₹)</th>
              <th className="col-action">Action</th>
            </tr>
          </thead>
          <tbody>
            {items.length === 0 ? (
              <tr>
                <td colSpan="7" className="text-center py-8 text-gray-500">
                  <p className="mb-2">No catering services added yet.</p>
                  <button
                    type="button"
                    className="btn-quick-service inline-flex mx-auto"
                    onClick={handleAddNewRow}
                  >
                    <PlusIcon className="w-4 h-4" />
                    <span>Add First Service</span>
                  </button>
                </td>
              </tr>
            ) : (
              items.map((item, index) => {
                const rowAmount = calcRowAmount(item.quantity, item.rate);
                return (
                  <tr key={item.id || index} className="service-row">
                    <td className="col-idx">
                      <span className="row-number-badge">{index + 1}</span>
                    </td>
                    <td className="col-service">
                      <input
                        type="text"
                        className="table-input"
                        placeholder="e.g. Grand Lunch Buffet"
                        value={item.name || ''}
                        onChange={(e) => handleItemChange(item.id, 'name', e.target.value)}
                      />
                    </td>
                    <td className="col-qty">
                      <input
                        type="number"
                        min="0"
                        step="any"
                        className="table-input text-right"
                        placeholder="500"
                        value={item.quantity || ''}
                        onChange={(e) => handleItemChange(item.id, 'quantity', e.target.value)}
                      />
                    </td>
                    <td className="col-unit">
                      <select
                        className="table-select"
                        value={item.unit || 'Guests'}
                        onChange={(e) => handleItemChange(item.id, 'unit', e.target.value)}
                      >
                        {SERVICE_UNIT_OPTIONS.map((opt) => (
                          <option key={opt} value={opt}>
                            {opt}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="col-rate">
                      <div className="rate-input-wrap">
                        <span className="rate-prefix">₹</span>
                        <input
                          type="number"
                          min="0"
                          step="any"
                          className="table-input text-right"
                          placeholder="250"
                          value={item.rate || ''}
                          onChange={(e) => handleItemChange(item.id, 'rate', e.target.value)}
                        />
                      </div>
                    </td>
                    <td className="col-amount text-right font-mono font-bold text-emerald-950">
                      {formatINR(rowAmount)}
                    </td>
                    <td className="col-action text-center">
                      <button
                        type="button"
                        className="btn-row-delete"
                        onClick={() => handleRemoveItem(item.id)}
                        title="Remove this service"
                      >
                        <TrashIcon className="w-4 h-4 text-red-500 hover:text-red-700" />
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      <div className="table-footer-actions">
        <button
          type="button"
          className="btn-add-table-row"
          onClick={handleAddNewRow}
        >
          <PlusIcon className="w-4 h-4" />
          <span>+ Add Another Service Row</span>
        </button>
        <span className="text-xs text-gray-500 italic">
          Amounts calculate automatically as Quantity × Rate
        </span>
      </div>
    </section>
  );
}
