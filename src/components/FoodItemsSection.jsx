import React from 'react';
import { PlusIcon, TrashIcon, UtensilsIcon } from './icons';
import { UNIT_OPTIONS } from '../utils/storage';

export default function FoodItemsSection({ items, onChange }) {
  const handleItemChange = (id, field, value) => {
    const updated = items.map((item) => {
      if (item.id === id) {
        return {
          ...item,
          [field]: value
        };
      }
      return item;
    });
    onChange(updated);
  };

  const handleAddRow = () => {
    const newRow = {
      id: 'item-' + Date.now() + '-' + Math.random().toString(36).substring(2, 5),
      name: '',
      quantity: '',
      unit: 'KG'
    };
    onChange([...items, newRow]);
  };

  const handleDeleteRow = (id) => {
    if (items.length === 1) {
      onChange([{ id: 'item-' + Date.now(), name: '', quantity: '', unit: 'KG' }]);
      return;
    }
    onChange(items.filter((item) => item.id !== id));
  };

  return (
    <section className="form-card dynamic-section food-items-card">
      <div className="card-header">
        <div className="card-header-title">
          <div className="section-badge food-badge">
            <UtensilsIcon className="w-4 h-4" />
          </div>
          <div>
            <h2>Food Items Handover List</h2>
            <span className="card-subtext">Event Menu Items, Dispatch Quantities & Units</span>
          </div>
        </div>

        <div className="section-total-badge count-total-badge">
          <span className="badge-label">TOTAL ITEMS</span>
          <span className="badge-value">{items.filter((it) => it.name && it.name.trim() !== '').length || items.length}</span>
        </div>
      </div>

      <div className="card-body p-0">
        <div className="table-wrapper">
          <table className="data-table">
            <thead>
              <tr>
                <th className="th-num">#</th>
                <th className="th-food-item">FOOD ITEM</th>
                <th className="th-qty">QTY</th>
                <th className="th-unit">UNIT</th>
                <th className="th-action">ACTION</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item, index) => (
                <tr key={item.id} className="table-row">
                  <td className="td-num">{index + 1}</td>
                  
                  {/* Food Item Name */}
                  <td className="td-food-item">
                    <input
                      type="text"
                      className="table-input food-item-input"
                      placeholder="e.g. Rice, Chicken, Beef, Vegetables, Oil"
                      value={item.name}
                      onChange={(e) => handleItemChange(item.id, 'name', e.target.value)}
                    />
                  </td>

                  {/* Quantity */}
                  <td className="td-qty">
                    <input
                      type="text"
                      inputMode="decimal"
                      className="table-input qty-input"
                      placeholder="e.g. 25, 3.5"
                      value={item.quantity}
                      onChange={(e) => handleItemChange(item.id, 'quantity', e.target.value)}
                    />
                  </td>

                  {/* Unit Dropdown */}
                  <td className="td-unit">
                    <select
                      className="table-input unit-select"
                      value={item.unit || 'KG'}
                      onChange={(e) => handleItemChange(item.id, 'unit', e.target.value)}
                    >
                      {UNIT_OPTIONS.map((unit) => (
                        <option key={unit} value={unit}>
                          {unit}
                        </option>
                      ))}
                    </select>
                  </td>

                  {/* Delete Action */}
                  <td className="td-action">
                    <button
                      type="button"
                      className="btn-delete"
                      onClick={() => handleDeleteRow(item.id)}
                      title="Delete food item"
                    >
                      <TrashIcon className="w-4 h-4" />
                      <span className="btn-delete-text">Delete</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="section-footer">
          <button
            type="button"
            className="btn-add btn-add-food"
            onClick={handleAddRow}
          >
            <PlusIcon className="w-4 h-4" />
            <span>Add Food Item</span>
          </button>

          <div className="subtotal-display">
            <span className="subtotal-label">Items Count:</span>
            <span className="subtotal-amount">
              {items.filter((it) => it.name && it.name.trim() !== '').length} Items
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}

