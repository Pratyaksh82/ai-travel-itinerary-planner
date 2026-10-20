import React, { useState } from 'react';

export default function ExportModal({ itinerary, onClose }) {
  const [copied, setCopied] = useState(false);

  if (!itinerary) return null;

  const handleDownloadJSON = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(itinerary, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `${itinerary.destination.toLowerCase()}_itinerary.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
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
        maxWidth: '560px',
        width: '100%',
        padding: '32px',
        position: 'relative'
      }}>
        <button
          onClick={onClose}
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

        <h3 style={{ fontSize: '1.3rem', fontWeight: 700, fontFamily: 'var(--font-display)', marginBottom: '8px' }}>
          📤 Export & Share Itinerary
        </h3>
        <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '24px' }}>
          Export your synthesized plan for {itinerary.title} in multiple offline and printable formats.
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginBottom: '28px' }}>
          {/* Print / Save as PDF */}
          <button
            onClick={handlePrint}
            className="btn btn-primary"
            style={{ width: '100%', padding: '14px', justifyContent: 'flex-start' }}
          >
            🖨️ <span style={{ marginLeft: '8px' }}>Print / Save as PDF Document</span>
          </button>

          {/* Download JSON */}
          <button
            onClick={handleDownloadJSON}
            className="btn btn-secondary"
            style={{ width: '100%', padding: '14px', justifyContent: 'flex-start' }}
          >
            💾 <span style={{ marginLeft: '8px' }}>Download Raw Data (JSON Format)</span>
          </button>

          {/* Copy Share Link */}
          <button
            onClick={handleCopyLink}
            className="btn btn-secondary"
            style={{ width: '100%', padding: '14px', justifyContent: 'flex-start' }}
          >
            🔗 <span style={{ marginLeft: '8px' }}>{copied ? '✓ Shareable Link Copied!' : 'Copy Direct Web App Link'}</span>
          </button>
        </div>

        <div style={{ textAlign: 'right' }}>
          <button onClick={onClose} className="btn btn-secondary" style={{ fontSize: '0.85rem', padding: '8px 18px' }}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
