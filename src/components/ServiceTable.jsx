import React from 'react';
import { SERVICE_UNIT_OPTIONS, createEmptyServiceItem } from '../utils/storage';
import { calcRowAmount } from '../utils/calculations';
import { formatINR } from '../utils/formatters';
import { TrashIcon, PlusIcon } from './icons';

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

  const itemsCount = items.filter((it) => it.name && it.name.trim() !== '').length;
  const runningSubtotal = items.reduce((acc, it) => acc + calcRowAmount(it.quantity, it.rate), 0);

  return (
    <section className="form-section-card service-table-section">
      <div className="section-head-banner flex justify-between items-center">
        <div className="flex items-center gap-3">
          <span className="section-step-badge">03</span>
          <div className="section-head-text">
            <h2 className="section-title">SERVICES & MENU ITEMS</h2>
            <p className="section-subtitle">Select and customize catering service items and pricing.</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {itemsCount > 0 && (
            <span className="service-count-badge font-mono">
              {itemsCount} {itemsCount === 1 ? 'Item' : 'Items'} • {formatINR(runningSubtotal)}
            </span>
          )}
          <button
            type="button"
            className="btn-add-service-sm"
            onClick={handleAddNewRow}
          >
            <PlusIcon className="w-3.5 h-3.5" />
            <span>Add Service</span>
          </button>
        </div>
      </div>

      {/* Internal Calculation Privacy Notice */}
      <div className="internal-calc-privacy-note">
        <span className="note-lock">🔒</span>
        <span>Internal Calculation: Individual rates, amounts, and tax breakdowns are hidden from customer documents. Customers see only <strong>Service & Quantity</strong> and the <strong>Total Amount</strong>.</span>
      </div>

      {/* Desktop Table View */}
      <div className="service-desktop-table-wrap">
        <table className="service-editor-table">
          <thead>
            <tr>
              <th className="col-idx">#</th>
              <th className="col-service">Service / Function Name</th>
              <th className="col-qty text-right">Quantity</th>
              <th className="col-unit text-center">Unit</th>
              <th className="col-rate text-right">Rate (₹)</th>
              <th className="col-amount text-right">Amount (₹)</th>
              <th className="col-action text-center"></th>
            </tr>
          </thead>
          <tbody>
            {items.length === 0 ? (
              <tr>
                <td colSpan="7" className="text-center py-8 text-neutral-400">
                  <p className="text-sm mb-2">No catering services itemized yet.</p>
                  <button
                    type="button"
                    className="btn-service-outline inline-flex"
                    onClick={handleAddNewRow}
                  >
                    <PlusIcon className="w-3.5 h-3.5" />
                    <span>Add First Service</span>
                  </button>
                </td>
              </tr>
            ) : (
              items.map((item, index) => {
                const rowAmount = calcRowAmount(item.quantity, item.rate);
                return (
                  <tr key={item.id || index} className="service-editor-row">
                    <td className="col-idx text-center">
                      <span className="row-num">{index + 1}</span>
                    </td>
                    <td className="col-service">
                      <input
                        type="text"
                        className="table-input"
                        placeholder="e.g. Breakfast / Lunch Buffet"
                        value={item.name || ''}
                        onChange={(e) => handleItemChange(item.id, 'name', e.target.value)}
                      />
                    </td>
                    <td className="col-qty">
                      <input
                        type="number"
                        min="0"
                        step="any"
                        className="table-input text-right font-mono"
                        placeholder="100"
                        value={item.quantity || ''}
                        onChange={(e) => handleItemChange(item.id, 'quantity', e.target.value)}
                      />
                    </td>
                    <td className="col-unit text-center">
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
                      <div className="rate-field-wrap">
                        <span className="rate-symbol">₹</span>
                        <input
                          type="number"
                          min="0"
                          step="any"
                          className="table-input text-right font-mono"
                          placeholder="250"
                          value={item.rate || ''}
                          onChange={(e) => handleItemChange(item.id, 'rate', e.target.value)}
                        />
                      </div>
                    </td>
                    <td className="col-amount text-right font-mono font-semibold text-neutral-900">
                      {formatINR(rowAmount)}
                    </td>
                    <td className="col-action text-center">
                      <button
                        type="button"
                        className="btn-row-remove"
                        onClick={() => handleRemoveItem(item.id)}
                        title="Remove this service"
                      >
                        <TrashIcon className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Mobile Service Cards View (Section 20: Table becomes cards on mobile) */}
      <div className="service-mobile-cards-wrap">
        {items.length === 0 ? (
          <div className="text-center py-6 text-neutral-400">
            <p className="text-sm mb-2">No catering services added yet.</p>
            <button
              type="button"
              className="btn-service-outline inline-flex"
              onClick={handleAddNewRow}
            >
              <PlusIcon className="w-3.5 h-3.5" />
              <span>Add First Service</span>
            </button>
          </div>
        ) : (
          items.map((item, index) => {
            const rowAmount = calcRowAmount(item.quantity, item.rate);
            return (
              <div key={item.id || index} className="mobile-service-card">
                <div className="mobile-card-top">
                  <span className="mobile-card-index">#{index + 1}</span>
                  <input
                    type="text"
                    className="mobile-card-name-input"
                    placeholder="Service Name (e.g. Lunch)"
                    value={item.name || ''}
                    onChange={(e) => handleItemChange(item.id, 'name', e.target.value)}
                  />
                  <button
                    type="button"
                    className="btn-row-remove"
                    onClick={() => handleRemoveItem(item.id)}
                    title="Remove service"
                  >
                    <TrashIcon className="w-4 h-4" />
                  </button>
                </div>

                <div className="mobile-card-grid">
                  <div className="mobile-input-field">
                    <label className="mobile-field-lbl">Quantity</label>
                    <input
                      type="number"
                      min="0"
                      step="any"
                      className="table-input font-mono"
                      placeholder="100"
                      value={item.quantity || ''}
                      onChange={(e) => handleItemChange(item.id, 'quantity', e.target.value)}
                    />
                  </div>

                  <div className="mobile-input-field">
                    <label className="mobile-field-lbl">Unit</label>
                    <select
                      className="table-select"
                      value={item.unit || 'Guests'}
                      onChange={(e) => handleItemChange(item.id, 'unit', e.target.value)}
                    >
                      {SERVICE_UNIT_OPTIONS.map((opt) => (
                        <option key={opt} value={opt}>{opt}</option>
                      ))}
                    </select>
                  </div>

                  <div className="mobile-input-field">
                    <label className="mobile-field-lbl">Rate (₹)</label>
                    <input
                      type="number"
                      min="0"
                      step="any"
                      className="table-input font-mono"
                      placeholder="250"
                      value={item.rate || ''}
                      onChange={(e) => handleItemChange(item.id, 'rate', e.target.value)}
                    />
                  </div>

                  <div className="mobile-input-field">
                    <label className="mobile-field-lbl">Amount</label>
                    <div className="mobile-amount-box font-mono">
                      {formatINR(rowAmount)}
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      <div className="table-bottom-actions">
        <button
          type="button"
          className="btn-add-service-bottom"
          onClick={handleAddNewRow}
        >
          <PlusIcon className="w-4 h-4" />
          <span>+ Add Another Service Row</span>
        </button>
        <span className="text-xs text-neutral-400 italic">
          Amounts calculate automatically as Quantity × Rate
        </span>
      </div>
    </section>
  );
}

