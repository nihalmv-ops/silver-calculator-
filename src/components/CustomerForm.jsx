import React from 'react';
import { UserIcon, PhoneIcon, MailIcon, MapPinIcon } from './icons';

export default function CustomerForm({ details, onChange, errors = {} }) {
  const handleChange = (field, value) => {
    onChange({ [field]: value });
  };

  return (
    <section className="form-section-card">
      <div className="section-head-banner">
        <span className="section-step-badge">01</span>
        <div className="section-head-text">
          <h2 className="section-title">CUSTOMER DETAILS</h2>
          <p className="section-subtitle">Enter the customer's basic contact and billing information.</p>
        </div>
      </div>

      <div className="form-grid-2">
        {/* Customer Name */}
        <div className="input-group">
          <label className="input-label" htmlFor="customer-name">
            <UserIcon className="w-4 h-4 text-neutral-500" />
            <span>Customer Name <span className="text-red-500">*</span></span>
          </label>
          <input
            id="customer-name"
            type="text"
            className={`input-field ${errors.customerName ? 'input-error' : ''}`}
            placeholder="e.g. Rahul Menon / Shameer Babu"
            value={details.customerName || ''}
            onChange={(e) => handleChange('customerName', e.target.value)}
            required
          />
          {errors.customerName && (
            <p className="input-error-text">{errors.customerName}</p>
          )}
        </div>

        {/* Phone Number */}
        <div className="input-group">
          <label className="input-label" htmlFor="customer-phone">
            <PhoneIcon className="w-4 h-4 text-neutral-500" />
            <span>Phone Number <span className="text-red-500">*</span></span>
          </label>
          <input
            id="customer-phone"
            type="tel"
            className={`input-field ${errors.customerPhone ? 'input-error' : ''}`}
            placeholder="e.g. +91 98470 12345"
            value={details.customerPhone || ''}
            onChange={(e) => handleChange('customerPhone', e.target.value)}
            required
          />
          {errors.customerPhone && (
            <p className="input-error-text">{errors.customerPhone}</p>
          )}
        </div>

        {/* Email Address */}
        <div className="input-group">
          <label className="input-label" htmlFor="customer-email">
            <MailIcon className="w-4 h-4 text-neutral-500" />
            <span>Email Address <span className="text-neutral-400 font-normal">(Optional)</span></span>
          </label>
          <input
            id="customer-email"
            type="email"
            className="input-field"
            placeholder="e.g. client@example.com"
            value={details.customerEmail || ''}
            onChange={(e) => handleChange('customerEmail', e.target.value)}
          />
        </div>

        {/* Address */}
        <div className="input-group">
          <label className="input-label" htmlFor="customer-address">
            <MapPinIcon className="w-4 h-4 text-neutral-500" />
            <span>Address / City</span>
          </label>
          <input
            id="customer-address"
            type="text"
            className="input-field"
            placeholder="e.g. Valanchery, Malappuram"
            value={details.customerAddress || ''}
            onChange={(e) => handleChange('customerAddress', e.target.value)}
          />
        </div>
      </div>
    </section>
  );
}

