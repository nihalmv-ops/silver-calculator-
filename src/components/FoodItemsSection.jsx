import React, { useState } from 'react';
import { PlusIcon, TrashIcon, UtensilsIcon } from './icons';
import { UNIT_OPTIONS, SECTIONS_CONFIG, createEmptyItem } from '../utils/storage';

export default function FoodItemsSection({ sections, onSectionItemsChange }) {
  const [activeTab, setActiveTab] = useState('morning');

  const currentSectionConfig = SECTIONS_CONFIG.find((s) => s.key === activeTab) || SECTIONS_CONFIG[0];
  const currentItems = (sections && sections[activeTab]) || [createEmptyItem()];

  const handleItemChange = (id, field, value) => {
    const updated = currentItems.map((item) => {
      if (item.id === id) {
        return {
          ...item,
          [field]: value
        };
      }
      return item;
    });
    onSectionItemsChange(activeTab, updated);
  };

  const handleAddRow = () => {
    onSectionItemsChange(activeTab, [...currentItems, createEmptyItem()]);
  };

  const handleDeleteRow = (id) => {
    if (currentItems.length === 1) {
      onSectionItemsChange(activeTab, [createEmptyItem()]);
      return;
    }
    onSectionItemsChange(activeTab, currentItems.filter((item) => item.id !== id));
  };

  // Helper to count valid items in a section
  const getSectionCount = (sectionKey) => {
    const list = (sections && sections[sectionKey]) || [];
    return list.filter((it) => (it.name && it.name.trim() !== '') || (it.quantity && String(it.quantity).trim() !== '')).length;
  };

  // Total items combined
  const totalCombinedCount = SECTIONS_CONFIG.reduce((acc, s) => acc + getSectionCount(s.key), 0);

  return (
    <section className="form-card dynamic-section food-items-card">
      {/* Header */}
      <div className="card-header">
        <div className="card-header-title">
          <div className="section-badge food-badge">
            <UtensilsIcon className="w-4 h-4" />
          </div>
          <div>
            <h2>Food Handover Sections</h2>
            <span className="card-subtext">Manage items across Day Morning, Day Afternoon, Evening & Night</span>
          </div>
        </div>

        <div className="section-total-badge count-total-badge">
          <span className="badge-label">TOTAL ITEMS</span>
          <span className="badge-value">{totalCombinedCount}</span>
        </div>
      </div>

      {/* Section Selector Tabs */}
      <div className="section-tabs-bar">
        {SECTIONS_CONFIG.map((s) => {
          const count = getSectionCount(s.key);
          const isActive = s.key === activeTab;
          return (
            <button
              key={s.key}
              type="button"
              className={`section-tab-btn ${isActive ? 'active' : ''}`}
              onClick={() => setActiveTab(s.key)}
            >
              <span className="section-tab-icon">{s.iconText}</span>
              <span className="section-tab-label">{s.label}</span>
              <span className={`section-tab-badge ${count > 0 ? 'has-items' : ''}`}>
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Active Section Banner */}
      <div className="active-section-banner">
        <div className="active-banner-info">
          <span className="active-banner-tag">{currentSectionConfig.label}</span>
          <span className="active-banner-hint">{currentSectionConfig.timeHint}</span>
        </div>
        <span className="active-banner-count">
          {getSectionCount(activeTab)} {getSectionCount(activeTab) === 1 ? 'Item' : 'Items'}
        </span>
      </div>

      {/* Items Table for Active Section */}
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
              {currentItems.map((item, index) => (
                <tr key={item.id} className="table-row">
                  <td className="td-num">{index + 1}</td>
                  
                  {/* Food Item Name */}
                  <td className="td-food-item">
                    <input
                      type="text"
                      className="table-input food-item-input"
                      placeholder={`e.g. ${activeTab === 'morning' ? 'Tea, Milk, Breakfast' : activeTab === 'afternoon' ? 'Rice, Chicken, Vegetables' : activeTab === 'evening' ? 'Tea, Snacks' : 'Rice, Chicken, Payasam'}`}
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
                      placeholder="e.g. 25"
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

        {/* Card Footer */}
        <div className="section-footer">
          <button
            type="button"
            className="btn-add btn-add-food"
            onClick={handleAddRow}
          >
            <PlusIcon className="w-4 h-4" />
            <span>Add Item to {currentSectionConfig.label}</span>
          </button>

          <div className="subtotal-display">
            <span className="subtotal-label">Section Items:</span>
            <span className="subtotal-amount">
              {getSectionCount(activeTab)} Items
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}


