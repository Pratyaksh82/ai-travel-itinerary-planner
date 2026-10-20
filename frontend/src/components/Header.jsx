import React from 'react';

export default function Header({ onOpenSaved, savedCount }) {
  return (
    <header style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '20px 0',
      marginBottom: '32px',
      borderBottom: '1px solid var(--border-subtle)',
      flexWrap: 'wrap',
      gap: '16px'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
        <div style={{
          width: '44px',
          height: '44px',
          borderRadius: '12px',
          background: 'var(--grad-hero)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '1.4rem',
          boxShadow: 'var(--shadow-glow)'
        }}>
          ✈️
        </div>
        <div>
          <h1 style={{
            fontSize: '1.5rem',
            fontFamily: 'var(--font-display)',
            fontWeight: 700,
            background: 'linear-gradient(90deg, #38bdf8, #818cf8, #c084fc)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            letterSpacing: '-0.02em'
          }}>
            VoyageCraft AI
          </h1>
          <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
            Personalized Travel Itinerary & Smart Budget Architecture
          </p>
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          padding: '6px 14px',
          background: 'rgba(16, 185, 129, 0.1)',
          border: '1px solid rgba(16, 185, 129, 0.3)',
          borderRadius: '9999px',
          fontSize: '0.8rem',
          color: '#34d399',
          fontWeight: 600
        }}>
          <span style={{
            width: '8px',
            height: '8px',
            borderRadius: '50%',
            background: '#10b981',
            boxShadow: '0 0 10px #10b981'
          }}></span>
          FastAPI & LLM Online
        </div>

        <button 
          onClick={onOpenSaved}
          className="btn btn-secondary"
          style={{ fontSize: '0.85rem', padding: '8px 16px' }}
        >
          📂 Saved Trips ({savedCount})
        </button>
      </div>
    </header>
  );
}
