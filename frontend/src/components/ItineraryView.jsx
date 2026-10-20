import React, { useState } from 'react';

export default function ItineraryView({ itinerary, onToggleActivity, onExportClick }) {
  const [selectedDay, setSelectedDay] = useState(1);
  const [viewAll, setViewAll] = useState(false);

  if (!itinerary) return null;

  const displayedDays = viewAll 
    ? itinerary.days 
    : itinerary.days.filter(d => d.day_number === selectedDay);

  const completedActivitiesCount = itinerary.days.reduce(
    (acc, d) => acc + d.activities.filter(a => a.is_completed).length, 0
  );
  const totalActivitiesCount = itinerary.days.reduce(
    (acc, d) => acc + d.activities.length, 0
  );
  const progressPct = totalActivitiesCount > 0 
    ? Math.round((completedActivitiesCount / totalActivitiesCount) * 100) 
    : 0;

  return (
    <section className="animate-fade-in" style={{ marginBottom: '40px' }}>
      {/* Hero Destination Banner */}
      <div style={{
        position: 'relative',
        borderRadius: 'var(--radius-xl)',
        overflow: 'hidden',
        marginBottom: '28px',
        border: '1px solid var(--border-subtle)',
        boxShadow: 'var(--shadow-lg)'
      }}>
        <img
          src={itinerary.hero_image_url}
          alt={itinerary.destination}
          style={{
            width: '100%',
            height: '340px',
            objectFit: 'cover',
            filter: 'brightness(0.65)'
          }}
        />
        <div style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          padding: '32px',
          background: 'linear-gradient(180deg, transparent 0%, rgba(10, 15, 29, 0.95) 90%)'
        }}>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '12px' }}>
            <span className="badge badge-cyan">{itinerary.duration_days} Days</span>
            <span className="badge badge-purple">{itinerary.budget_tier} Tier</span>
            <span className="badge badge-emerald">{itinerary.travel_style}</span>
            <span className="badge badge-amber">{itinerary.companion_type} ({itinerary.group_size})</span>
          </div>

          <h2 style={{
            fontSize: '2.2rem',
            fontFamily: 'var(--font-display)',
            fontWeight: 800,
            color: '#ffffff',
            lineHeight: 1.2,
            marginBottom: '8px'
          }}>
            {itinerary.title}
          </h2>

          <p style={{
            fontSize: '0.98rem',
            color: '#cbd5e1',
            maxWidth: '850px',
            lineHeight: 1.5,
            marginBottom: '16px'
          }}>
            {itinerary.overview_summary}
          </p>

          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '16px',
            borderTop: '1px solid rgba(255, 255, 255, 0.1)',
            paddingTop: '16px'
          }}>
            <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap', fontSize: '0.85rem' }}>
              <div>
                <span style={{ color: 'var(--text-muted)' }}>Best Time to Visit: </span>
                <strong style={{ color: 'var(--text-primary)' }}>{itinerary.best_time_to_visit}</strong>
              </div>
              <div>
                <span style={{ color: 'var(--text-muted)' }}>Estimated Total: </span>
                <strong style={{ color: 'var(--accent-cyan)' }}>
                  ${itinerary.budget_summary.total_estimated_usd.toLocaleString()} USD
                </strong>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '10px' }}>
              <button onClick={onExportClick} className="btn btn-secondary" style={{ fontSize: '0.85rem', padding: '8px 16px' }}>
                📄 Export / Print PDF
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Progress & Day Switcher Bar */}
      <div className="glass-panel" style={{
        padding: '16px 24px',
        marginBottom: '24px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '16px'
      }}>
        {/* Day selection tabs */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
          <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)', marginRight: '4px' }}>
            Schedule:
          </span>
          {itinerary.days.map((day) => (
            <button
              key={day.day_number}
              onClick={() => { setSelectedDay(day.day_number); setViewAll(false); }}
              style={{
                background: !viewAll && selectedDay === day.day_number ? 'var(--accent-cyan)' : 'rgba(255, 255, 255, 0.05)',
                color: !viewAll && selectedDay === day.day_number ? '#0a0f1d' : 'var(--text-primary)',
                border: '1px solid',
                borderColor: !viewAll && selectedDay === day.day_number ? 'var(--accent-cyan)' : 'var(--border-subtle)',
                borderRadius: 'var(--radius-sm)',
                padding: '6px 14px',
                fontSize: '0.85rem',
                fontWeight: 700,
                cursor: 'pointer',
                transition: 'all 0.15s ease'
              }}
            >
              Day {day.day_number}
            </button>
          ))}
          <button
            onClick={() => setViewAll(true)}
            style={{
              background: viewAll ? 'var(--accent-purple)' : 'rgba(255, 255, 255, 0.05)',
              color: viewAll ? '#ffffff' : 'var(--text-primary)',
              border: '1px solid',
              borderColor: viewAll ? 'var(--accent-purple)' : 'var(--border-subtle)',
              borderRadius: 'var(--radius-sm)',
              padding: '6px 14px',
              fontSize: '0.85rem',
              fontWeight: 700,
              cursor: 'pointer'
            }}
          >
            View All Days
          </button>
        </div>

        {/* Activity tracking counter */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Trip Progress</div>
            <div style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--accent-emerald)' }}>
              {completedActivitiesCount} of {totalActivitiesCount} Activities Completed ({progressPct}%)
            </div>
          </div>
          <div style={{
            width: '80px',
            height: '8px',
            background: 'rgba(255, 255, 255, 0.1)',
            borderRadius: '4px',
            overflow: 'hidden'
          }}>
            <div style={{
              width: `${progressPct}%`,
              height: '100%',
              background: 'var(--accent-emerald)',
              transition: 'width 0.3s ease'
            }} />
          </div>
        </div>
      </div>

      {/* Days Breakdown */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
        {displayedDays.map((day) => (
          <div key={day.day_number} className="glass-panel" style={{ padding: '28px' }}>
            {/* Day Header */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              borderBottom: '1px solid var(--border-subtle)',
              paddingBottom: '16px',
              marginBottom: '20px',
              flexWrap: 'wrap',
              gap: '12px'
            }}>
              <div>
                <span className="badge badge-purple" style={{ marginBottom: '6px' }}>
                  Day {day.day_number} Focus
                </span>
                <h3 style={{ fontSize: '1.35rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                  {day.theme}
                </h3>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Estimated Day Budget</div>
                <div style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--accent-cyan)' }}>
                  ${day.daily_budget_estimated_usd} USD
                </div>
              </div>
            </div>

            {/* Transit Advice Box */}
            <div style={{
              padding: '12px 18px',
              background: 'rgba(56, 189, 248, 0.08)',
              border: '1px solid rgba(56, 189, 248, 0.2)',
              borderRadius: 'var(--radius-md)',
              marginBottom: '24px',
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              fontSize: '0.85rem',
              color: '#bae6fd'
            }}>
              <span style={{ fontSize: '1.2rem' }}>🚇</span>
              <div>
                <strong>Transit Recommendation: </strong> {day.transportation_tip}
              </div>
            </div>

            {/* Activities Timeline */}
            <h4 style={{
              fontSize: '1rem',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              color: 'var(--text-secondary)',
              marginBottom: '16px'
            }}>
              Curated Day Timeline & Landmarks
            </h4>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '28px' }}>
              {day.activities.map((act) => (
                <div
                  key={act.id}
                  style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '16px',
                    padding: '18px',
                    background: act.is_completed ? 'rgba(16, 185, 129, 0.08)' : 'rgba(255, 255, 255, 0.03)',
                    border: '1px solid',
                    borderColor: act.is_completed ? 'rgba(16, 185, 129, 0.3)' : 'var(--border-subtle)',
                    borderRadius: 'var(--radius-md)',
                    transition: 'all 0.2s ease'
                  }}
                >
                  {/* Interactive Checkbox */}
                  <input
                    type="checkbox"
                    checked={act.is_completed}
                    onChange={(e) => onToggleActivity(itinerary.id, act.id, e.target.checked)}
                    style={{
                      width: '20px',
                      height: '20px',
                      marginTop: '4px',
                      cursor: 'pointer',
                      accentColor: 'var(--accent-emerald)'
                    }}
                  />

                  {/* Activity Details */}
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px', marginBottom: '4px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span className="badge badge-cyan">{act.time_slot}</span>
                        <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{act.time_estimate}</span>
                        <span className="badge badge-purple">{act.category}</span>
                      </div>
                      <div style={{ fontWeight: 700, fontSize: '0.92rem', color: act.estimated_cost_usd === 0 ? '#34d399' : 'var(--text-primary)' }}>
                        {act.estimated_cost_usd === 0 ? 'Free Entry' : `$${act.estimated_cost_usd} USD`}
                      </div>
                    </div>

                    <h5 style={{
                      fontSize: '1.05rem',
                      fontWeight: 700,
                      color: act.is_completed ? 'var(--text-muted)' : 'var(--text-primary)',
                      textDecoration: act.is_completed ? 'line-through' : 'none',
                      marginBottom: '6px'
                    }}>
                      {act.title}
                    </h5>

                    <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '8px', lineHeight: 1.5 }}>
                      {act.description}
                    </p>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap', fontSize: '0.78rem' }}>
                      <span style={{ color: 'var(--text-muted)' }}>📍 <strong>{act.location}</strong></span>
                      {act.booking_tip && (
                        <span style={{ color: '#fbbf24', background: 'rgba(245, 158, 11, 0.1)', padding: '2px 8px', borderRadius: '4px' }}>
                          💡 Tip: {act.booking_tip}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Dining Recommendations */}
            <h4 style={{
              fontSize: '1rem',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              color: 'var(--text-secondary)',
              marginBottom: '16px'
            }}>
              🍽️ Authentic Dining & Local Gastronomy
            </h4>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: '16px'
            }}>
              {day.meals.map((m, mIdx) => (
                <div
                  key={mIdx}
                  style={{
                    padding: '16px',
                    background: 'rgba(255, 255, 255, 0.02)',
                    border: '1px solid var(--border-subtle)',
                    borderRadius: 'var(--radius-md)'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                    <span className="badge badge-amber">{m.meal_type}</span>
                    <span style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                      ~${m.estimated_cost_usd} USD
                    </span>
                  </div>
                  <div style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--text-primary)', marginBottom: '2px' }}>
                    {m.restaurant_name}
                  </div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '6px' }}>
                    {m.cuisine_type} • {m.neighborhood}
                  </div>
                  <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
                    🍴 <strong>Try:</strong> {m.dish_recommendation}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
