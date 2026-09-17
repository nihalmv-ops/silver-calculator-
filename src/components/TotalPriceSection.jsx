import React from 'react';
import { formatINR, parseAmount } from '../utils/formatters';
import { TagIcon, FileTextIcon } from './icons';

export default function TotalPriceSection({ totalItems, totalPrice, onTotalPriceChange }) {
  const numericPrice = parseAmount(totalPrice);

  return (
    <section className="form-card summary-card total-price-card">
      <div className="summary-grid">
        {/* Total Items Counter */}
        <div className="summary-box items-count-box">
          <div className="summary-box-header">
            <span className="summary-icon food-icon">
              <FileTextIcon className="w-5 h-5 text-emerald" />
            </span>
            <span className="summary-label">TOTAL ITEMS</span>
          </div>
          <div className="summary-value items-value">
            {totalItems} <span className="items-unit-suffix">Items</span>
          </div>
          <div className="summary-hint">Total food dishes & provisions listed</div>
        </div>

        {/* Overall Total Price (Single Field) */}
        <div className="summary-box price-entry-box">
          <div className="summary-box-header">
            <span className="summary-icon price-icon">
              <TagIcon className="w-5 h-5" />
            </span>
            <span className="summary-label">TOTAL PRICE</span>
          </div>

          <div className="total-price-input-container">
            <div className="total-price-input-wrapper">
              <span className="rupee-adornment">₹</span>
              <input
                type="text"
                inputMode="numeric"
                className="total-price-input"
                placeholder="e.g. 75000"
                value={totalPrice}
                onChange={(e) => onTotalPriceChange(e.target.value)}
                aria-label="Overall Total Price"
              />
            </div>
            
            {/* Formatted Display Badge */}
            <div className="formatted-price-badge">
              <span className="formatted-prefix">Formatted:</span>
              <span className="formatted-value">
                {numericPrice > 0 ? formatINR(numericPrice) : '₹0'}
              </span>
            </div>
          </div>

          <div className="summary-hint price-hint">
            ✦ Single overall event price (no individual item pricing)
          </div>
        </div>
      </div>
    </section>
  );
}
