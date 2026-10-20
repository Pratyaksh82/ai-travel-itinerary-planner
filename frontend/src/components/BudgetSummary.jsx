import React from 'react';

export default function BudgetSummary({ budgetSummary, currencyAdvice }) {
  if (!budgetSummary) return null;

  const categoryColors = {
    "Accommodation": "#38bdf8",
    "Food & Dining": "#f59e0b",
    "Activities & Sightseeing": "#a855f7",
    "Local Transit": "#10b981",
    "Contingency Buffer (10%)": "#64748b"
  };

  return (
    <section className="glass-panel" style={{ padding: '28px', marginBottom: '36px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h3 style={{ fontSize: '1.2rem', fontWeight: 700, fontFamily: 'var(--font-display)' }}>
            📊 Financial Architecture & Budget Optimization
          </h3>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
            Algorithmic cost estimations adjusted for group size and budget tier
          </p>
        </div>
        <span className="badge badge-cyan">Automated Cost Model</span>
      </div>

      {/* KPI Cards Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
        gap: '16px',
        marginBottom: '28px'
      }}>
        {/* Total Cost */}
        <div style={{
          padding: '18px',
          background: 'rgba(56, 189, 248, 0.08)',
          border: '1px solid rgba(56, 189, 248, 0.25)',
          borderRadius: 'var(--radius-md)'
        }}>
          <div style={{ fontSize: '0.78rem', color: '#7dd3fc', textTransform: 'uppercase', fontWeight: 700 }}>
            Total Trip Est.
          </div>
          <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#ffffff', margin: '4px 0' }}>
            ${budgetSummary.total_estimated_usd.toLocaleString()}
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Inclusive of 10% contingency</div>
        </div>

        {/* Cost per person */}
        <div style={{
          padding: '18px',
          background: 'rgba(168, 85, 247, 0.08)',
          border: '1px solid rgba(168, 85, 247, 0.25)',
          borderRadius: 'var(--radius-md)'
        }}>
          <div style={{ fontSize: '0.78rem', color: '#d8b4fe', textTransform: 'uppercase', fontWeight: 700 }}>
            Cost Per Person
          </div>
          <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#ffffff', margin: '4px 0' }}>
            ${budgetSummary.cost_per_person_usd.toLocaleString()}
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Equitably distributed</div>
        </div>

        {/* Accommodation */}
        <div style={{
          padding: '18px',
          background: 'rgba(255, 255, 255, 0.03)',
          border: '1px solid var(--border-subtle)',
          borderRadius: 'var(--radius-md)'
        }}>
          <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', textTransform: 'uppercase', fontWeight: 700 }}>
            Lodging / Hotels
          </div>
          <div style={{ fontSize: '1.4rem', fontWeight: 700, color: 'var(--text-primary)', margin: '4px 0' }}>
            ${budgetSummary.accommodation_usd.toLocaleString()}
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Rooms optimized for group</div>
        </div>

        {/* Food & Dining */}
        <div style={{
          padding: '18px',
          background: 'rgba(255, 255, 255, 0.03)',
          border: '1px solid var(--border-subtle)',
          borderRadius: 'var(--radius-md)'
        }}>
          <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', textTransform: 'uppercase', fontWeight: 700 }}>
            Food & Dining
          </div>
          <div style={{ fontSize: '1.4rem', fontWeight: 700, color: 'var(--text-primary)', margin: '4px 0' }}>
            ${budgetSummary.food_and_dining_usd.toLocaleString()}
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Breakfast, lunch & dinners</div>
        </div>

        {/* Activities */}
        <div style={{
          padding: '18px',
          background: 'rgba(255, 255, 255, 0.03)',
          border: '1px solid var(--border-subtle)',
          borderRadius: 'var(--radius-md)'
        }}>
          <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', textTransform: 'uppercase', fontWeight: 700 }}>
            Attractions
          </div>
          <div style={{ fontSize: '1.4rem', fontWeight: 700, color: 'var(--text-primary)', margin: '4px 0' }}>
            ${budgetSummary.activities_and_attractions_usd.toLocaleString()}
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Tours, entries & passes</div>
        </div>
      </div>

      {/* Proportional Stacked Bar Chart */}
      <div style={{ marginBottom: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', marginBottom: '8px' }}>
          <span style={{ fontWeight: 600, color: 'var(--text-secondary)' }}>Budget Category Allocation</span>
          <span style={{ color: 'var(--text-muted)' }}>100% Normalized</span>
        </div>
        <div style={{
          display: 'flex',
          height: '14px',
          borderRadius: '7px',
          overflow: 'hidden',
          background: 'rgba(255, 255, 255, 0.05)',
          gap: '2px'
        }}>
          {budgetSummary.breakdown.map((cat, idx) => (
            <div
              key={idx}
              title={`${cat.category}: ${cat.percentage}% ($${cat.amount_usd})`}
              style={{
                width: `${cat.percentage}%`,
                background: categoryColors[cat.category] || 'var(--accent-indigo)',
                transition: 'width 0.4s ease'
              }}
            />
          ))}
        </div>

        {/* Legend */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', marginTop: '12px' }}>
          {budgetSummary.breakdown.map((cat, idx) => (
            <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.78rem' }}>
              <span style={{
                width: '10px',
                height: '10px',
                borderRadius: '2px',
                background: categoryColors[cat.category] || 'var(--accent-indigo)'
              }} />
              <span style={{ color: 'var(--text-secondary)' }}>{cat.category}:</span>
              <strong style={{ color: 'var(--text-primary)' }}>{cat.percentage}%</strong>
            </div>
          ))}
        </div>
      </div>

      {/* Local Currency Advice */}
      {currencyAdvice && (
        <div style={{
          padding: '14px 18px',
          background: 'rgba(245, 158, 11, 0.08)',
          border: '1px solid rgba(245, 158, 11, 0.25)',
          borderRadius: 'var(--radius-md)',
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          fontSize: '0.85rem',
          color: '#fef3c7'
        }}>
          <span style={{ fontSize: '1.3rem' }}>💵</span>
          <div>
            <strong>Currency & Payment Protocol: </strong> {currencyAdvice}
          </div>
        </div>
      )}
    </section>
  );
}
