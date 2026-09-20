import React from 'react';
import { CalendarIcon, ClockIcon, MapPinIcon, TagIcon, SparklesIcon, UsersIcon } from './icons';

export default function EventForm({ details, onChange, isInvoice = false }) {
  const handleChange = (field, value) => {
    onChange({ [field]: value });
  };

  const docLabel = isInvoice ? 'Invoice' : 'Quotation';
  const numberPrefix = isInvoice ? 'INV' : 'QT';

  return (
    <section className="form-section-card">
      <div className="section-head-banner">
        <span className="section-step-badge">02</span>
        <div className="section-head-text">
          <h2 className="section-title">EVENT DETAILS</h2>
          <p className="section-subtitle">Specify event schedule, venue, and guest count.</p>
        </div>
      </div>

      <div className="form-grid-2">
        {/* Event Name */}
        <div className="input-group">
          <label className="input-label" htmlFor="event-name">
            <SparklesIcon className="w-4 h-4 text-neutral-500" />
            <span>Event Name / Function</span>
          </label>
          <input
            id="event-name"
            type="text"
            className="input-field"
            placeholder="e.g. Wedding Reception, Nikah, Birthday"
            value={details.eventName || ''}
            onChange={(e) => handleChange('eventName', e.target.value)}
          />
        </div>

        {/* Number of Guests / Pax */}
        <div className="input-group">
          <label className="input-label" htmlFor="event-guests">
            <UsersIcon className="w-4 h-4 text-neutral-500" />
            <span>Number of Guests (Pax)</span>
          </label>
          <input
            id="event-guests"
            type="number"
            min="1"
            className="input-field"
            placeholder="e.g. 500"
            value={details.guests || ''}
            onChange={(e) => handleChange('guests', e.target.value)}
          />
        </div>

        {/* Event Date */}
        <div className="input-group">
          <label className="input-label" htmlFor="event-date">
            <CalendarIcon className="w-4 h-4 text-neutral-500" />
            <span>Event Date</span>
          </label>
          <input
            id="event-date"
            type="date"
            className="input-field"
            value={details.eventDate || ''}
            onChange={(e) => handleChange('eventDate', e.target.value)}
          />
        </div>

        {/* Event Time */}
        <div className="input-group">
          <label className="input-label" htmlFor="event-time">
            <ClockIcon className="w-4 h-4 text-neutral-500" />
            <span>Event Time</span>
          </label>
          <input
            id="event-time"
            type="text"
            className="input-field"
            placeholder="e.g. 12:30 PM (Lunch), Evening 6:00 PM"
            value={details.eventTime || ''}
            onChange={(e) => handleChange('eventTime', e.target.value)}
          />
        </div>

        {/* Venue / Location */}
        <div className="input-group span-full">
          <label className="input-label" htmlFor="event-venue">
            <MapPinIcon className="w-4 h-4 text-neutral-500" />
            <span>Venue / Event Location</span>
          </label>
          <input
            id="event-venue"
            type="text"
            className="input-field"
            placeholder="e.g. Convention Center, Valanchery, Malappuram"
            value={details.venue || ''}
            onChange={(e) => handleChange('venue', e.target.value)}
          />
        </div>

        {/* Document Number */}
        <div className="input-group">
          <label className="input-label" htmlFor="doc-number">
            <TagIcon className="w-4 h-4 text-neutral-500" />
            <span>{docLabel} Number</span>
          </label>
          <input
            id="doc-number"
            type="text"
            className="input-field font-mono font-semibold"
            placeholder={`e.g. ${numberPrefix}-0001`}
            value={details.number || ''}
            onChange={(e) => handleChange('number', e.target.value)}
          />
        </div>

        {/* Document Date */}
        <div className="input-group">
          <label className="input-label" htmlFor="doc-date">
            <CalendarIcon className="w-4 h-4 text-neutral-500" />
            <span>{docLabel} Issue Date</span>
          </label>
          <input
            id="doc-date"
            type="date"
            className="input-field"
            value={details.date || ''}
            onChange={(e) => handleChange('date', e.target.value)}
          />
        </div>
      </div>
    </section>
  );
}

