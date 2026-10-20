import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import ScenarioPresets from './components/ScenarioPresets';
import TripForm from './components/TripForm';
import ItineraryView from './components/ItineraryView';
import BudgetSummary from './components/BudgetSummary';
import PackingTips from './components/PackingTips';
import ExportModal from './components/ExportModal';

export default function App() {
  const [scenarios, setScenarios] = useState([]);
  const [activeScenarioId, setActiveScenarioId] = useState(null);
  const [savedTrips, setSavedTrips] = useState([]);
  const [isSavedDrawerOpen, setIsSavedDrawerOpen] = useState(false);
  const [isExportOpen, setIsExportOpen] = useState(false);

  const [formData, setFormData] = useState({
    destination: "Kyoto",
    duration_days: 3,
    budget_tier: "Budget",
    travel_style: "Cultural & Historical",
    companion_type: "Solo Traveler",
    group_size: 1,
    special_requests: "Early morning temple hikes, local ramen spots, and scenic photography"
  });

  const [currentItinerary, setCurrentItinerary] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);

  // Load scenarios & saved trips on mount
  useEffect(() => {
    fetchScenarios();
    fetchSavedTrips();
  }, []);

  const fetchScenarios = async () => {
    try {
      const res = await fetch('/api/scenarios');
      if (res.ok) {
        const data = await res.json();
        setScenarios(data);
      }
    } catch (err) {
      console.error("Failed to load scenarios:", err);
    }
  };

  const fetchSavedTrips = async () => {
    try {
      const res = await fetch('/api/trips');
      if (res.ok) {
        const data = await res.json();
        setSavedTrips(data);
      }
    } catch (err) {
      console.error("Failed to load saved trips:", err);
    }
  };

  const handleGenerate = async (e) => {
    if (e) e.preventDefault();
    setLoading(true);
    setErrorMsg(null);

    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.detail || "Itinerary synthesis failed");
      }

      const data = await res.json();
      setCurrentItinerary(data);
      fetchSavedTrips();
    } catch (err) {
      setErrorMsg(err.message || "An unexpected error occurred during synthesis.");
    } finally {
      setLoading(false);
    }
  };

  const handleSelectScenario = (sc) => {
    setActiveScenarioId(sc.id);
    setFormData({
      destination: sc.request.destination,
      duration_days: sc.request.duration_days,
      budget_tier: sc.request.budget_tier,
      travel_style: sc.request.travel_style,
      companion_type: sc.request.companion_type,
      group_size: sc.request.group_size,
      special_requests: sc.request.special_requests || ""
    });

    // Auto-trigger synthesis for selected scenario
    setLoading(true);
    setErrorMsg(null);

    fetch('/api/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(sc.request)
    })
      .then(res => {
        if (!res.ok) throw new Error("Scenario generation failed");
        return res.json();
      })
      .then(data => {
        setCurrentItinerary(data);
        fetchSavedTrips();
      })
      .catch(err => setErrorMsg(err.message))
      .finally(() => setLoading(false));
  };

  const handleToggleActivity = async (tripId, actId, completed) => {
    // Optimistic UI update
    setCurrentItinerary(prev => {
      if (!prev) return prev;
      return {
        ...prev,
        days: prev.days.map(d => ({
          ...d,
          activities: d.activities.map(a => a.id === actId ? { ...a, is_completed: completed } : a)
        }))
      };
    });

    try {
      await fetch(`/api/trips/${tripId}/activities/${actId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ completed })
      });
    } catch (err) {
      console.error("Failed to sync activity state:", err);
    }
  };

  const handleLoadSavedTrip = async (tripId) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/trips/${tripId}`);
      if (res.ok) {
        const data = await res.json();
        setCurrentItinerary(data);
        setIsSavedDrawerOpen(false);
      }
    } catch (err) {
      console.error("Failed to fetch saved trip:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteSavedTrip = async (tripId, e) => {
    e.stopPropagation();
    try {
      const res = await fetch(`/api/trips/${tripId}`, { method: 'DELETE' });
      if (res.ok) {
        setSavedTrips(prev => prev.filter(t => t.id !== tripId));
        if (currentItinerary && currentItinerary.id === tripId) {
          setCurrentItinerary(null);
        }
      }
    } catch (err) {
      console.error("Failed to delete trip:", err);
    }
  };

  return (
    <div className="app-container">
      <Header
        onOpenSaved={() => setIsSavedDrawerOpen(true)}
        savedCount={savedTrips.length}
      />

      {/* 1-Click Evaluation Scenarios */}
      <ScenarioPresets
        scenarios={scenarios}
        onSelectScenario={handleSelectScenario}
        activeScenarioId={activeScenarioId}
        loading={loading}
      />

      {/* Interactive Trip Builder */}
      <TripForm
        formData={formData}
        setFormData={setFormData}
        onSubmit={handleGenerate}
        loading={loading}
      />

      {/* Error Alert */}
      {errorMsg && (
        <div style={{
          padding: '16px 20px',
          background: 'rgba(244, 63, 94, 0.1)',
          border: '1px solid rgba(244, 63, 94, 0.3)',
          borderRadius: 'var(--radius-md)',
          color: '#fda4af',
          marginBottom: '28px',
          fontSize: '0.9rem'
        }}>
          ⚠️ <strong>Error:</strong> {errorMsg}
        </div>
      )}

      {/* Active Itinerary View */}
      {currentItinerary && (
        <>
          <ItineraryView
            itinerary={currentItinerary}
            onToggleActivity={handleToggleActivity}
            onExportClick={() => setIsExportOpen(true)}
          />

          <BudgetSummary
            budgetSummary={currentItinerary.budget_summary}
            currencyAdvice={currentItinerary.local_currency_advice}
          />

          <PackingTips
            packingChecklist={currentItinerary.packing_checklist}
            safetyAndEtiquette={currentItinerary.safety_and_etiquette}
            destination={currentItinerary.destination}
          />
        </>
      )}

      {/* Saved Trips Drawer / Modal */}
      {isSavedDrawerOpen && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(10, 15, 29, 0.85)',
          backdropFilter: 'blur(8px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 9999,
          padding: '20px'
        }}>
          <div className="glass-panel" style={{
            maxWidth: '680px',
            width: '100%',
            maxHeight: '80vh',
            display: 'flex',
            flexDirection: 'column',
            padding: '28px',
            position: 'relative'
          }}>
            <button
              onClick={() => setIsSavedDrawerOpen(false)}
              style={{
                position: 'absolute',
                top: '20px',
                right: '20px',
                background: 'none',
                border: 'none',
                color: 'var(--text-secondary)',
                fontSize: '1.2rem',
                cursor: 'pointer'
              }}
            >
              ✕
            </button>

            <h3 style={{ fontSize: '1.25rem', fontWeight: 700, fontFamily: 'var(--font-display)', marginBottom: '8px' }}>
              📂 Saved Trips & Database Archive
            </h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '20px' }}>
              Persisted in database ({savedTrips.length} itineraries stored)
            </p>

            <div style={{ overflowY: 'auto', flex: 1, display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {savedTrips.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>
                  No saved trips yet. Generate an itinerary to save it automatically!
                </div>
              ) : (
                savedTrips.map(trip => (
                  <div
                    key={trip.id}
                    onClick={() => handleLoadSavedTrip(trip.id)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '14px 18px',
                      background: 'rgba(255, 255, 255, 0.03)',
                      border: '1px solid var(--border-subtle)',
                      borderRadius: 'var(--radius-md)',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease'
                    }}
                  >
                    <div>
                      <div style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--text-primary)' }}>
                        {trip.title}
                      </div>
                      <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                        {trip.duration_days} Days • {trip.budget_tier} • {trip.companion_type} • ${trip.total_cost_usd} USD
                      </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <button className="btn btn-secondary" style={{ fontSize: '0.78rem', padding: '6px 12px' }}>
                        Load Plan →
                      </button>
                      <button
                        onClick={(e) => handleDeleteSavedTrip(trip.id, e)}
                        style={{
                          background: 'rgba(244, 63, 94, 0.15)',
                          color: '#fda4af',
                          border: 'none',
                          padding: '6px 10px',
                          borderRadius: '6px',
                          cursor: 'pointer',
                          fontSize: '0.8rem'
                        }}
                        title="Delete trip"
                      >
                        🗑️
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* Export Modal */}
      {isExportOpen && (
        <ExportModal
          itinerary={currentItinerary}
          onClose={() => setIsExportOpen(false)}
        />
      )}

      {/* Production Architecture Footer */}
      <footer style={{
        marginTop: '60px',
        borderTop: '1px solid var(--border-subtle)',
        paddingTop: '24px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '16px',
        fontSize: '0.82rem',
        color: 'var(--text-muted)'
      }}>
        <div>
          <strong>Personalized Travel Itinerary Planner</strong> • Multi-Agent Cognitive Architecture (Google ADK Spec)
        </div>
        <div style={{ display: 'flex', gap: '16px' }}>
          <span>React 18 + Vite</span>
          <span>•</span>
          <span>FastAPI</span>
          <span>•</span>
          <span>Supabase / SQLite</span>
          <span>•</span>
          <span>Unsplash API</span>
        </div>
      </footer>
    </div>
  );
}
