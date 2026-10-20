import React from 'react';

export default function PackingTips({ packingChecklist, safetyAndEtiquette, destination }) {
  if (!packingChecklist || packingChecklist.length === 0) return null;

  const importanceBadgeClass = (imp) => {
    switch (imp) {
      case 'Must Have': return 'badge-amber';
      case 'Recommended': return 'badge-cyan';
      default: return 'badge-purple';
    }
  };

  return (
    <section style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px', marginBottom: '36px' }}>
      {/* Packing Checklist */}
      <div className="glass-panel" style={{ padding: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, fontFamily: 'var(--font-display)' }}>
            🎒 Curated Packing Architecture
          </h3>
          <span className="badge badge-emerald">Weather & Tech Ready</span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {packingChecklist.map((item, idx) => (
            <div
              key={idx}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '10px 14px',
                background: 'rgba(255, 255, 255, 0.02)',
                border: '1px solid var(--border-subtle)',
                borderRadius: 'var(--radius-sm)',
                gap: '12px'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span style={{ fontSize: '0.85rem' }}>🧳</span>
                <span style={{ fontSize: '0.86rem', color: 'var(--text-primary)' }}>{item.item}</span>
              </div>
              <span className={`badge ${importanceBadgeClass(item.importance)}`} style={{ fontSize: '0.7rem' }}>
                {item.importance}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Safety & Local Etiquette */}
      <div className="glass-panel" style={{ padding: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, fontFamily: 'var(--font-display)' }}>
            🛡️ Local Customs & Cultural Protocols
          </h3>
          <span className="badge badge-purple">{destination} Protocol</span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {safetyAndEtiquette && safetyAndEtiquette.map((tip, idx) => (
            <div
              key={idx}
              style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: '12px',
                padding: '12px 14px',
                background: 'rgba(99, 102, 241, 0.06)',
                border: '1px solid rgba(99, 102, 241, 0.2)',
                borderRadius: 'var(--radius-sm)'
              }}
            >
              <span style={{ fontSize: '1.1rem', marginTop: '-2px' }}>⚖️</span>
              <p style={{ fontSize: '0.85rem', color: '#e0e7ff', lineHeight: 1.5 }}>
                {tip}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
