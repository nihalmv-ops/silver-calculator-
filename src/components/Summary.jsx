import React from 'react';
import { formatINR } from '../utils/formatters';
import { TrendingUpIcon, TrendingDownIcon, SparklesIcon, AlertCircleIcon } from './icons';

export default function Summary({ totalIncome, totalExpense }) {
  const balance = totalIncome - totalExpense;
  const isProfit = balance >= 0;

  return (
    <section className="form-card summary-card">
      <div className="summary-grid">
        {/* Total Income */}
        <div className="summary-box income-box">
          <div className="summary-box-header">
            <span className="summary-icon income-icon">
              <TrendingUpIcon className="w-5 h-5" />
            </span>
            <span className="summary-label">TOTAL INCOME</span>
          </div>
          <div className="summary-value income-value">
            {formatINR(totalIncome)}
          </div>
          <div className="summary-hint">Sum of all advances & receipts</div>
        </div>

        {/* Total Expense */}
        <div className="summary-box expense-box">
          <div className="summary-box-header">
            <span className="summary-icon expense-icon">
              <TrendingDownIcon className="w-5 h-5" />
            </span>
            <span className="summary-label">TOTAL EXPENSE</span>
          </div>
          <div className="summary-value expense-value">
            {formatINR(totalExpense)}
          </div>
          <div className="summary-hint">Sum of groceries, labour & overheads</div>
        </div>

        {/* Balance / Profit / Loss */}
        <div className={`summary-box balance-box ${isProfit ? 'profit-state' : 'loss-state'}`}>
          <div className="summary-box-header">
            <span className={`summary-icon ${isProfit ? 'profit-icon' : 'loss-icon'}`}>
              {isProfit ? <SparklesIcon className="w-5 h-5" /> : <AlertCircleIcon className="w-5 h-5" />}
            </span>
            <span className="summary-label">
              {isProfit ? 'BALANCE / PROFIT' : 'BALANCE / LOSS'}
            </span>
          </div>
          <div className={`summary-value balance-value ${isProfit ? 'text-profit' : 'text-loss'}`}>
            {formatINR(balance)}
          </div>
          <div className="summary-status-tag">
            {isProfit ? (
              <span className="badge-profit">✦ Net Profit Margin</span>
            ) : (
              <span className="badge-loss">⚠ Net Operating Loss</span>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
