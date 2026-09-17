import React from 'react';
import { PlusIcon, TrashIcon, TrendingUpIcon } from './icons';
import { formatINR } from '../utils/formatters';

export default function IncomeSection({ incomes, onChange, totalIncome }) {
  const handleItemChange = (id, field, value) => {
    const updated = incomes.map((item) => {
      if (item.id === id) {
        return {
          ...item,
          [field]: field === 'amount' ? (value === '' ? '' : value) : value
        };
      }
      return item;
    });
    onChange(updated);
  };

  const handleAddRow = () => {
    const newRow = {
      id: 'inc-' + Date.now() + '-' + Math.random().toString(36).substring(2, 5),
      description: '',
      amount: ''
    };
    onChange([...incomes, newRow]);
  };

  const handleDeleteRow = (id) => {
    if (incomes.length === 1) {
      // Keep at least one empty row if all deleted
      onChange([{ id: 'inc-' + Date.now(), description: '', amount: '' }]);
      return;
    }
    onChange(incomes.filter((item) => item.id !== id));
  };

  return (
    <section className="form-card dynamic-section income-card">
      <div className="card-header">
        <div className="card-header-title">
          <div className="section-badge income-badge">
            <TrendingUpIcon className="w-4 h-4" />
          </div>
          <div>
            <h2>Income Entries</h2>
            <span className="card-subtext">Payments, Advances & Other Receipts</span>
          </div>
        </div>

        <div className="section-total-badge income-total-badge">
          <span className="badge-label">TOTAL INCOME</span>
          <span className="badge-value">{formatINR(totalIncome)}</span>
        </div>
      </div>

      <div className="card-body p-0">
        <div className="table-wrapper">
          <table className="data-table">
            <thead>
              <tr>
                <th className="th-num">#</th>
                <th className="th-desc">Description</th>
                <th className="th-amount">Amount (₹)</th>
                <th className="th-action">Action</th>
              </tr>
            </thead>
            <tbody>
              {incomes.map((item, index) => (
                <tr key={item.id} className="table-row">
                  <td className="td-num">{index + 1}</td>
                  <td className="td-desc">
                    <input
                      type="text"
                      className="table-input"
                      placeholder="e.g. Catering Payment, Advance, Other"
                      value={item.description}
                      onChange={(e) => handleItemChange(item.id, 'description', e.target.value)}
                    />
                  </td>
                  <td className="td-amount">
                    <div className="amount-input-wrapper">
                      <span className="currency-prefix">₹</span>
                      <input
                        type="number"
                        min="0"
                        step="any"
                        className="table-input amount-input"
                        placeholder="0"
                        value={item.amount}
                        onChange={(e) => handleItemChange(item.id, 'amount', e.target.value)}
                      />
                    </div>
                  </td>
                  <td className="td-action">
                    <button
                      type="button"
                      className="btn-delete"
                      onClick={() => handleDeleteRow(item.id)}
                      title="Delete entry"
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
            className="btn-add btn-add-income"
            onClick={handleAddRow}
          >
            <PlusIcon className="w-4 h-4" />
            <span>Add Income</span>
          </button>

          <div className="subtotal-display">
            <span className="subtotal-label">Subtotal:</span>
            <span className="subtotal-amount income-amount">{formatINR(totalIncome)}</span>
          </div>
        </div>
      </div>
    </section>
  );
}
