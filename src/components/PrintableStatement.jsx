import React from 'react';
import { formatINR, formatDate, parseAmount } from '../utils/formatters';

export default function PrintableStatement({ details, incomes, expenses, totalIncome, totalExpense }) {
  const balance = totalIncome - totalExpense;
  const isProfit = balance >= 0;

  // Filter out rows that have neither description nor amount
  const validIncomes = incomes.filter(
    (item) => (item.description && item.description.trim() !== '') || parseAmount(item.amount) > 0
  );
  const validExpenses = expenses.filter(
    (item) => (item.description && item.description.trim() !== '') || parseAmount(item.amount) > 0
  );

  return (
    <div className="printable-statement" id="printable-statement">
      {/* Formal Letterhead Header */}
      <div className="print-header">
        <div className="print-header-top">
          <div className="print-brand-badge">EST. 2010 • EXCELLENCE IN TRADITIONAL & MODERN BANQUETING</div>
          <h1 className="print-company-name">SILVER CATERING SERVICES</h1>
          <div className="print-ornament-line">
            <span className="print-ornament">❧ ✤ ☙</span>
          </div>
          <h2 className="print-doc-title">INCOME & EXPENSE NOTE</h2>
          <p className="print-doc-subtitle">Official Event Financial Statement & Settlement Record</p>
        </div>

        {/* Metadata Grid */}
        <div className="print-meta-grid">
          <div className="print-meta-item">
            <span className="print-meta-label">Date:</span>
            <span className="print-meta-value">{formatDate(details.date) || '—'}</span>
          </div>
          <div className="print-meta-item">
            <span className="print-meta-label">Event:</span>
            <span className="print-meta-value highlight-event">{details.eventName || '—'}</span>
          </div>
          <div className="print-meta-item">
            <span className="print-meta-label">Customer:</span>
            <span className="print-meta-value">{details.customerName || '—'}</span>
          </div>
          <div className="print-meta-item">
            <span className="print-meta-label">Location:</span>
            <span className="print-meta-value">{details.eventLocation || '—'}</span>
          </div>
          <div className="print-meta-item">
            <span className="print-meta-label">Phone:</span>
            <span className="print-meta-value">{details.phoneNumber || '—'}</span>
          </div>
          <div className="print-meta-item">
            <span className="print-meta-label">Statement Ref:</span>
            <span className="print-meta-value font-mono">SC-{details.date ? details.date.replace(/-/g, '') : 'NOTE'}-01</span>
          </div>
        </div>
      </div>

      <div className="print-tables-container">
        {/* Income Section */}
        <div className="print-section income-print-section">
          <div className="print-section-header">
            <h3>INCOME</h3>
            <span className="print-section-sub">Advances & Payments Received</span>
          </div>

          <table className="print-table">
            <thead>
              <tr>
                <th className="print-th-sl">#</th>
                <th className="print-th-desc">Description</th>
                <th className="print-th-amount">Amount</th>
              </tr>
            </thead>
            <tbody>
              {validIncomes.length > 0 ? (
                validIncomes.map((item, index) => (
                  <tr key={item.id || index}>
                    <td className="print-td-sl">{index + 1}</td>
                    <td className="print-td-desc">{item.description || 'General Income'}</td>
                    <td className="print-td-amount">{formatINR(parseAmount(item.amount))}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="3" className="print-empty-row">No income entries recorded</td>
                </tr>
              )}
            </tbody>
            <tfoot>
              <tr className="print-total-row income-total-row">
                <td colSpan="2" className="print-total-label">TOTAL INCOME</td>
                <td className="print-total-value">{formatINR(totalIncome)}</td>
              </tr>
            </tfoot>
          </table>
        </div>

        {/* Expense Section */}
        <div className="print-section expense-print-section">
          <div className="print-section-header">
            <h3>EXPENSE</h3>
            <span className="print-section-sub">Provisions, Labour & Operational Costs</span>
          </div>

          <table className="print-table">
            <thead>
              <tr>
                <th className="print-th-sl">#</th>
                <th className="print-th-desc">Description</th>
                <th className="print-th-amount">Amount</th>
              </tr>
            </thead>
            <tbody>
              {validExpenses.length > 0 ? (
                validExpenses.map((item, index) => (
                  <tr key={item.id || index}>
                    <td className="print-td-sl">{index + 1}</td>
                    <td className="print-td-desc">{item.description || 'Miscellaneous Expense'}</td>
                    <td className="print-td-amount">{formatINR(parseAmount(item.amount))}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="3" className="print-empty-row">No expense entries recorded</td>
                </tr>
              )}
            </tbody>
            <tfoot>
              <tr className="print-total-row expense-total-row">
                <td colSpan="2" className="print-total-label">TOTAL EXPENSE</td>
                <td className="print-total-value">{formatINR(totalExpense)}</td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>

      {/* Final Settlement Summary Box */}
      <div className="print-summary-card">
        <div className="print-summary-row">
          <span className="print-sum-label">TOTAL INCOME:</span>
          <span className="print-sum-val">{formatINR(totalIncome)}</span>
        </div>
        <div className="print-summary-row">
          <span className="print-sum-label">TOTAL EXPENSE:</span>
          <span className="print-sum-val">{formatINR(totalExpense)}</span>
        </div>
        <div className="print-summary-divider"></div>
        <div className={`print-summary-row print-final-balance ${isProfit ? 'print-profit' : 'print-loss'}`}>
          <span className="print-sum-label-final">
            {isProfit ? 'BALANCE / PROFIT' : 'BALANCE / LOSS'}
          </span>
          <span className="print-sum-val-final">
            {formatINR(balance)}
          </span>
        </div>
      </div>

      {/* Signature & Closing Acknowledgement */}
      <div className="print-footer-signatures">
        <div className="signature-col">
          <div className="signature-line"></div>
          <div className="signature-title">Customer / Representative Signature</div>
          <div className="signature-sub">({details.customerName || 'Customer'})</div>
        </div>

        <div className="signature-col signature-col-right">
          <div className="signature-line"></div>
          <div className="signature-title">Authorized Signatory</div>
          <div className="signature-sub">For Silver Catering Services</div>
        </div>
      </div>

      <div className="print-closing-statement">
        <p className="closing-thankyou">Thank you for choosing our catering service.</p>
        <p className="closing-note">This is a system generated statement of accounts for event catering services.</p>
      </div>
    </div>
  );
}
