import React from 'react';

const POPULAR_DESTINATIONS = ["Kyoto", "Santorini", "Tokyo", "Paris", "Bali", "Rome", "Costa Rica", "Swiss Alps"];

export default function TripForm({ formData, setFormData, onSubmit, loading }) {
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'duration_days' || name === 'group_size' ? parseInt(value, 10) || 1 : value
    }));
  };

  const handleSelectQuickDest = (city) => {
    setFormData(prev => ({ ...prev, destination: city }));
  };

  return (
    <form onSubmit={onSubmit} className="glass-panel" style={{ padding: '28px', marginBottom: '36px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
        <div>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 700, fontFamily: 'var(--font-display)' }}>
            🎯 Smart Trip Architect
          </h2>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
            Configure your personalized parameters for algorithmic itinerary synthesis
          </p>
        </div>
        <span className="badge badge-emerald">Interactive Builder</span>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '20px' }}>
        {/* Destination */}
        <div className="form-group" style={{ gridColumn: '1 / -1' }}>
          <label className="form-label">Destination City or Region</label>
          <input
            type="text"
            name="destination"
            value={formData.destination}
            onChange={handleChange}
            placeholder="e.g. Kyoto, Paris, Santorini, Tokyo, Swiss Alps..."
            required
            className="form-control"
          />
          {/* Quick tags */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '8px' }}>
            <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', alignSelf: 'center' }}>Popular:</span>
            {POPULAR_DESTINATIONS.map(city => (
              <button
                key={city}
                type="button"
                onClick={() => handleSelectQuickDest(city)}
                style={{
                  background: formData.destination === city ? 'rgba(56, 189, 248, 0.2)' : 'rgba(255, 255, 255, 0.05)',
                  color: formData.destination === city ? 'var(--accent-cyan)' : 'var(--text-secondary)',
                  border: '1px solid',
                  borderColor: formData.destination === city ? 'var(--accent-cyan)' : 'var(--border-subtle)',
                  borderRadius: '9999px',
                  padding: '3px 10px',
                  fontSize: '0.75rem',
                  cursor: 'pointer'
                }}
              >
                {city}
              </button>
            ))}
          </div>
        </div>

        {/* Duration Days */}
        <div className="form-group">
          <label className="form-label">
            Duration: <strong style={{ color: 'var(--accent-cyan)' }}>{formData.duration_days} Days</strong>
          </label>
          <input
            type="range"
            name="duration_days"
            min="1"
            max="14"
            value={formData.duration_days}
            onChange={handleChange}
            style={{ width: '100%', accentColor: 'var(--accent-cyan)', cursor: 'pointer', height: '6px' }}
          />
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            <span>1 Day (Micro)</span>
            <span>7 Days (Week)</span>
            <span>14 Days (Extended)</span>
          </div>
        </div>

        {/* Budget Tier */}
        <div className="form-group">
          <label className="form-label">Budget Tier</label>
          <select
            name="budget_tier"
            value={formData.budget_tier}
            onChange={handleChange}
            className="form-control"
          >
            <option value="Budget">Budget ($ - Backpacker / Hostels)</option>
            <option value="Moderate">Moderate ($$ - Comfort Boutique / 3-4★)</option>
            <option value="Luxury">Luxury ($$$ - Premium 5★ / Private Tours)</option>
          </select>
        </div>

        {/* Travel Style */}
        <div className="form-group">
          <label className="form-label">Primary Travel Style</label>
          <select
            name="travel_style"
            value={formData.travel_style}
            onChange={handleChange}
            className="form-control"
          >
            <option value="Cultural & Historical">Cultural & Historical</option>
            <option value="Relaxed & Scenic">Relaxed & Scenic</option>
            <option value="Adventure & Outdoor">Adventure & Outdoor</option>
            <option value="Culinary & Foodie">Culinary & Foodie</option>
            <option value="Romantic Getaway">Romantic Getaway</option>
            <option value="Nightlife & City Exploration">Nightlife & City Exploration</option>
          </select>
        </div>

        {/* Companion Dynamics */}
        <div className="form-group">
          <label className="form-label">Companions & Dynamics</label>
          <select
            name="companion_type"
            value={formData.companion_type}
            onChange={handleChange}
            className="form-control"
          >
            <option value="Solo Traveler">Solo Traveler</option>
            <option value="Couple">Couple</option>
            <option value="Small Group / Friends">Small Group / Friends</option>
            <option value="Family with Kids">Family with Kids</option>
          </select>
        </div>

        {/* Group Size */}
        <div className="form-group">
          <label className="form-label">Total Travelers</label>
          <input
            type="number"
            name="group_size"
            min="1"
            max="20"
            value={formData.group_size}
            onChange={handleChange}
            className="form-control"
          />
        </div>
      </div>

      {/* Special Requests */}
      <div className="form-group" style={{ marginTop: '16px' }}>
        <label className="form-label">Special Requests, Dietary & Pace Notes</label>
        <textarea
          name="special_requests"
          rows="2"
          value={formData.special_requests || ''}
          onChange={handleChange}
          placeholder="e.g. Vegetarian dining, avoid steep stairs, focus on scenic sunset views, early morning photography..."
          className="form-control"
          style={{ resize: 'vertical' }}
        />
      </div>

      {/* Submit Button */}
      <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'flex-end' }}>
        <button
          type="submit"
          disabled={loading}
          className="btn btn-primary"
          style={{ padding: '14px 32px', fontSize: '1.05rem', minWidth: '240px' }}
        >
          {loading ? (
            <>
              <span style={{ animation: 'spin 1s linear infinite' }}>⚙️</span> Synthesizing Itinerary...
            </>
          ) : (
            <>🚀 Generate AI Itinerary</>
          )}
        </button>
      </div>
    </form>
  );
}
