import React, { useEffect } from 'react';
import type { CertificationItem } from '../data/certificationsData';

interface CertificationDetailModalProps {
  certification: CertificationItem | null;
  onClose: () => void;
}

export const CertificationDetailModal: React.FC<CertificationDetailModalProps> = ({
  certification,
  onClose,
}) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    if (certification) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [certification, onClose]);

  if (!certification) return null;

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 60,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(2, 4, 10, 0.55)',
        backdropFilter: 'blur(6px)',
        animation: 'certModalFade 0.25s ease-out',
        overflow: 'hidden',
      }}
      onClick={onClose}
    >
      <style>{`
        @keyframes certModalFade {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes certModalSlide {
          from { opacity: 0; transform: scale(0.96) translateY(12px); }
          to { opacity: 1; transform: scale(1) translateY(0); }
        }
      `}</style>

      {/* Close button */}
      <button
        onClick={onClose}
        style={{
          position: 'fixed',
          top: 24,
          right: 32,
          zIndex: 70,
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          background: 'rgba(4, 8, 16, 0.85)',
          border: '1px solid rgba(56, 189, 248, 0.45)',
          color: '#38bdf8',
          padding: '8px 16px',
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: '11px',
          fontWeight: 600,
          letterSpacing: '0.12em',
          cursor: 'pointer',
          borderRadius: 3,
          boxShadow: '0 0 16px rgba(56, 189, 248, 0.25)',
          transition: 'all 0.2s ease',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.borderColor = '#00f0ff';
          e.currentTarget.style.boxShadow = '0 0 24px rgba(0, 240, 255, 0.5)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.borderColor = 'rgba(56, 189, 248, 0.45)';
          e.currentTarget.style.boxShadow = '0 0 16px rgba(56, 189, 248, 0.25)';
        }}
      >
        <span>ESC / CLOSE</span>
        <span style={{ fontSize: '13px' }}>✕</span>
      </button>

      {/* Main Terminal Window */}
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: '90%',
          maxWidth: '740px',
          background: 'linear-gradient(135deg, rgba(6, 10, 20, 0.94) 0%, rgba(3, 6, 14, 0.96) 100%)',
          border: '1px solid rgba(56, 189, 248, 0.35)',
          borderRadius: 4,
          boxShadow: '0 0 45px rgba(0, 240, 255, 0.22), inset 0 0 30px rgba(0, 0, 0, 0.6)',
          animation: 'certModalSlide 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          position: 'relative',
        }}
      >
        {/* Top Architectural Neon Header Bar */}
        <div
          style={{
            padding: '14px 22px',
            borderBottom: '1px solid rgba(56, 189, 248, 0.2)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            background: 'rgba(56, 189, 248, 0.04)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span
              style={{
                width: 8,
                height: 8,
                borderRadius: '50%',
                backgroundColor: certification.accentColor || '#38bdf8',
                boxShadow: `0 0 10px ${certification.accentColor || '#38bdf8'}`,
                display: 'inline-block',
              }}
            />
            <span
              style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: '11px',
                letterSpacing: '0.18em',
                color: '#38bdf8',
                fontWeight: 600,
              }}
            >
              &gt; CERTIFICATION RECORD
            </span>
          </div>

          <span
            style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: '10px',
              letterSpacing: '0.12em',
              color: 'rgba(148, 163, 184, 0.65)',
            }}
          >
            HALL OF FAME // ARCHIVE NODE
          </span>
        </div>

        {/* Content Body */}
        <div style={{ padding: '28px 28px 22px 28px', display: 'flex', flexDirection: 'column', gap: 20 }}>
          {/* Badge & Title */}
          <div>
            <div
              style={{
                display: 'inline-block',
                padding: '3px 9px',
                background: 'rgba(56, 189, 248, 0.1)',
                border: `1px solid ${certification.accentColor || '#38bdf8'}`,
                borderRadius: 2,
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: '10px',
                letterSpacing: '0.18em',
                color: certification.accentColor || '#38bdf8',
                marginBottom: 10,
              }}
            >
              {certification.badge}
            </div>

            <h2
              style={{
                margin: 0,
                fontFamily: "'Space Grotesk', -apple-system, sans-serif",
                fontSize: '26px',
                fontWeight: 700,
                letterSpacing: '0.04em',
                color: '#ffffff',
                textShadow: '0 0 18px rgba(56, 189, 248, 0.4)',
              }}
            >
              {certification.title}
            </h2>
          </div>

          {/* Key Metadata Grid */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
              gap: 16,
              background: 'rgba(5, 9, 18, 0.6)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              borderRadius: 3,
              padding: '16px 20px',
            }}
          >
            <div>
              <div
                style={{
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: '10px',
                  letterSpacing: '0.15em',
                  color: '#64748b',
                  marginBottom: 4,
                }}
              >
                ISSUER
              </div>
              <div
                style={{
                  fontFamily: "'Space Grotesk', sans-serif",
                  fontSize: '15px',
                  fontWeight: 600,
                  color: '#f8fafc',
                }}
              >
                {certification.issuer}
              </div>
            </div>

            <div>
              <div
                style={{
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: '10px',
                  letterSpacing: '0.15em',
                  color: '#64748b',
                  marginBottom: 4,
                }}
              >
                DATE
              </div>
              <div
                style={{
                  fontFamily: "'Space Grotesk', sans-serif",
                  fontSize: '15px',
                  fontWeight: 600,
                  color: '#f8fafc',
                }}
              >
                {certification.date}
              </div>
            </div>

            {certification.credentialId && (
              <div>
                <div
                  style={{
                    fontFamily: "'JetBrains Mono', monospace",
                    fontSize: '10px',
                    letterSpacing: '0.15em',
                    color: '#64748b',
                    marginBottom: 4,
                  }}
                >
                  CREDENTIAL ID
                </div>
                <div
                  style={{
                    fontFamily: "'JetBrains Mono', monospace",
                    fontSize: '13px',
                    color: '#38bdf8',
                  }}
                >
                  {certification.credentialId}
                </div>
              </div>
            )}
          </div>

          {/* Description */}
          {certification.description && (
            <div>
              <div
                style={{
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: '10px',
                  letterSpacing: '0.16em',
                  color: '#64748b',
                  marginBottom: 6,
                }}
              >
                // SCOPE & COMPETENCIES
              </div>
              <p
                style={{
                  margin: 0,
                  fontFamily: "'Space Grotesk', -apple-system, sans-serif",
                  fontSize: '13.5px',
                  lineHeight: '1.65',
                  color: '#cbd5e1',
                }}
              >
                {certification.description}
              </p>
            </div>
          )}

          {/* Skills tags (if available) */}
          {certification.skills && certification.skills.length > 0 && (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {certification.skills.map((skill, i) => (
                <span
                  key={i}
                  style={{
                    padding: '3px 10px',
                    background: 'rgba(15, 23, 42, 0.8)',
                    border: '1px solid rgba(56, 189, 248, 0.25)',
                    borderRadius: 2,
                    fontFamily: "'JetBrains Mono', monospace",
                    fontSize: '10.5px',
                    color: '#94a3b8',
                  }}
                >
                  {skill}
                </span>
              ))}
            </div>
          )}

          {/* Optional Certificate Image (if user adds one) */}
          {certification.image && (
            <div
              style={{
                marginTop: 6,
                border: '1px solid rgba(56, 189, 248, 0.3)',
                borderRadius: 3,
                overflow: 'hidden',
                maxHeight: '260px',
                display: 'flex',
                justifyContent: 'center',
                background: '#000000',
              }}
            >
              <img
                src={certification.image}
                alt={certification.title}
                style={{ maxWidth: '100%', maxHeight: '260px', objectFit: 'contain' }}
              />
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div
          style={{
            padding: '16px 28px',
            borderTop: '1px solid rgba(56, 189, 248, 0.15)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-end',
            gap: 12,
            background: 'rgba(5, 9, 18, 0.4)',
          }}
        >
          {certification.verificationUrl && (
            <a
              href={certification.verificationUrl}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                padding: '9px 18px',
                background: 'rgba(56, 189, 248, 0.15)',
                border: '1px solid #38bdf8',
                borderRadius: 2,
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: '11px',
                fontWeight: 600,
                letterSpacing: '0.12em',
                color: '#38bdf8',
                textDecoration: 'none',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
              }}
            >
              [ VERIFY CREDENTIAL ]
            </a>
          )}

          <button
            onClick={onClose}
            style={{
              padding: '9px 20px',
              background: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              borderRadius: 2,
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: '11px',
              fontWeight: 600,
              letterSpacing: '0.12em',
              color: '#f8fafc',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.12)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
            }}
          >
            [ CLOSE ]
          </button>
        </div>
      </div>
    </div>
  );
};
