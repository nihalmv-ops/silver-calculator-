import React from 'react';
import { CalendarIcon, MapPinIcon, UserIcon, PhoneIcon, FileTextIcon } from './icons';

export default function EventDetails({ details, onChange }) {
  const handleChange = (field, value) => {
    onChange({
      ...details,
      [field]: value
    });
  };

  return (
    <section className="form-card event-details-card">
      <div className="card-header">
        <div className="card-header-title">
          <FileTextIcon className="w-5 h-5 text-gold" />
          <h2>Event Details</h2>
        </div>
        <span className="card-subtext">Basic Event & Client Information</span>
      </div>

      <div className="card-body">
        <div className="grid-form">
          {/* Date */}
          <div className="form-group">
            <label htmlFor="event-date">
              <CalendarIcon className="w-4 h-4 text-emerald" />
              <span>Date</span>
            </label>
            <input
              id="event-date"
              type="date"
              value={details.date || ''}
              onChange={(e) => handleChange('date', e.target.value)}
              className="form-input"
            />
          </div>

          {/* Event Name */}
          <div className="form-group">
            <label htmlFor="event-name">
              <span className="label-bullet">✦</span>
              <span>Event Name</span>
            </label>
            <input
              id="event-name"
              type="text"
              placeholder="e.g. Rahul Wedding, Reception"
              value={details.eventName || ''}
              onChange={(e) => handleChange('eventName', e.target.value)}
              className="form-input"
            />
          </div>

          {/* Customer Name */}
          <div className="form-group">
            <label htmlFor="customer-name">
              <UserIcon className="w-4 h-4 text-emerald" />
              <span>Customer Name</span>
            </label>
            <input
              id="customer-name"
              type="text"
              placeholder="e.g. Rahul Sharma"
              value={details.customerName || ''}
              onChange={(e) => handleChange('customerName', e.target.value)}
              className="form-input"
            />
          </div>

          {/* Event Location */}
          <div className="form-group">
            <label htmlFor="event-location">
              <MapPinIcon className="w-4 h-4 text-emerald" />
              <span>Event Location</span>
            </label>
            <input
              id="event-location"
              type="text"
              placeholder="e.g. Grand Palace, Kochi"
              value={details.eventLocation || ''}
              onChange={(e) => handleChange('eventLocation', e.target.value)}
              className="form-input"
            />
          </div>

          {/* Phone Number (optional) */}
          <div className="form-group phone-group">
            <label htmlFor="customer-phone">
              <PhoneIcon className="w-4 h-4 text-emerald" />
              <span>Phone Number <span className="optional-tag">(Optional)</span></span>
            </label>
            <input
              id="customer-phone"
              type="tel"
              placeholder="e.g. +91 98470 12345"
              value={details.phoneNumber || ''}
              onChange={(e) => handleChange('phoneNumber', e.target.value)}
              className="form-input"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
