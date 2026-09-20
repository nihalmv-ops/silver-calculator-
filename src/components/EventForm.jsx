import React from 'react';
import { CalendarIcon, ClockIcon, MapPinIcon, TagIcon, SparklesIcon } from './icons';

export default function EventForm({ details, onChange, isInvoice = false }) {
  const handleChange = (field, value) => {
    onChange({ [field]: value });
  };

  const docLabel = isInvoice ? 'Invoice' : 'Quotation';
  const numberPrefix = isInvoice ? 'INV' : 'QT';

  return (
    <section className="form-card">
      <div className="section-header-banner">
        <div className="section-icon-bubble">
          <CalendarIcon className="w-5 h-5 text-emerald-800" />
        </div>
        <div>
          <h2 className="section-title">SECTION B: {docLabel.toUpperCase()} & EVENT DETAILS</h2>
          <p className="section-subtitle">Event scheduling, venue, and guest logistics</p>
        </div>
      </div>

      <div className="form-grid-3">
        {/* Document Number */}
        <div className="input-group">
          <label className="input-label" htmlFor="doc-number">
            <TagIcon className="w-4 h-4 text-emerald-700" />
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
            <CalendarIcon className="w-4 h-4 text-emerald-700" />
            <span>{docLabel} Date</span>
          </label>
          <input
            id="doc-date"
            type="date"
            className="input-field"
            value={details.date || ''}
            onChange={(e) => handleChange('date', e.target.value)}
          />
        </div>

        {/* Number of Guests / Pax */}
        <div className="input-group">
          <label className="input-label" htmlFor="event-guests">
            <span className="font-semibold text-emerald-800">👥</span>
            <span>Guests / Pax</span>
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

        {/* Event Name */}
        <div className="input-group">
          <label className="input-label" htmlFor="event-name">
            <SparklesIcon className="w-4 h-4 text-emerald-700" />
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

        {/* Event Date */}
        <div className="input-group">
          <label className="input-label" htmlFor="event-date">
            <CalendarIcon className="w-4 h-4 text-emerald-700" />
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
            <ClockIcon className="w-4 h-4 text-emerald-700" />
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
            <MapPinIcon className="w-4 h-4 text-emerald-700" />
            <span>Venue / Event Location</span>
          </label>
          <input
            id="event-venue"
            type="text"
            className="input-field"
            placeholder="e.g. Grand Convention Center, Kadavanthra, Kochi"
            value={details.venue || ''}
            onChange={(e) => handleChange('venue', e.target.value)}
          />
        </div>
      </div>
    </section>
  );
}

