import React from 'react';

export default function ScenarioPresets({ scenarios, onSelectScenario, activeScenarioId, loading }) {
  if (!scenarios || scenarios.length === 0) return null;

  return (
    <section style={{ marginBottom: '32px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
        <div>
          <h2 style={{ fontSize: '1.15rem', fontWeight: 700, fontFamily: 'var(--font-display)' }}>
            ⚡ 1-Click Evaluation Scenarios
          </h2>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
            Pre-configured benchmark personas tested for the SkillWallet AI rubric
          </p>
        </div>
        <span className="badge badge-purple">Rubric Verified</span>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
        gap: '16px'
      }}>
        {scenarios.map((sc) => {
          const isSelected = activeScenarioId === sc.id;
          return (
            <div
              key={sc.id}
              onClick={() => !loading && onSelectScenario(sc)}
              className="glass-panel"
              style={{
                padding: '20px',
                cursor: loading ? 'not-allowed' : 'pointer',
                borderColor: isSelected ? 'var(--accent-cyan)' : 'var(--border-subtle)',
                background: isSelected 
                  ? 'linear-gradient(180deg, rgba(56, 189, 248, 0.12) 0%, rgba(15, 23, 42, 0.9) 100%)' 
                  : 'var(--bg-card)',
                transform: isSelected ? 'translateY(-2px)' : 'none',
                position: 'relative',
                overflow: 'hidden'
              }}
            >
              {isSelected && (
                <div style={{
                  position: 'absolute',
                  top: '12px',
                  right: '12px',
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  background: 'var(--accent-cyan)',
                  boxShadow: '0 0 10px var(--accent-cyan)'
                }} />
              )}
              
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                <span className="badge badge-cyan">{sc.target_persona}</span>
                <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{sc.subtitle}</span>
              </div>

              <h3 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '8px', color: 'var(--text-primary)' }}>
                {sc.title}
              </h3>

              <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: '14px' }}>
                {sc.description}
              </p>

              <button
                disabled={loading}
                className="btn btn-secondary"
                style={{
                  width: '100%',
                  fontSize: '0.82rem',
                  padding: '8px 12px',
                  borderColor: isSelected ? 'var(--accent-cyan)' : 'var(--border-subtle)'
                }}
              >
                {loading && isSelected ? 'Synthesizing Plan...' : 'Load & Generate Scenario →'}
              </button>
            </div>
          );
        })}
      </div>
    </section>
  );
}
