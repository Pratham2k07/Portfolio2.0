import React, { useState, useEffect } from 'react';
import { phoenixFlightState } from '../flight/phoenixFlightStore';
import { REPOSITORIES_DATA } from '../data/repositoriesData';

interface FlightHUDProps {
  progress: number;
}

export const FlightHUD: React.FC<FlightHUDProps> = ({ progress }) => {
  const isFlightMode = progress >= 0.70;
  const [telemetry, setTelemetry] = useState({
    speed: 16,
    alt: 16,
    heading: 0,
    nearestRepo: 'JARVIS-AI',
    nearestDist: 45,
    nearestColor: '#00f0ff',
  });

  const [isFocus, setIsFocus] = useState(false);
  const [nearHoF, setNearHoF] = useState(false);

  // Update telemetry smoothly
  useEffect(() => {
    if (!isFlightMode) return;
    const interval = setInterval(() => {
      const speedKnots = Math.round(phoenixFlightState.speed * 2.8);
      const altMeters = Math.round(phoenixFlightState.position.y * 5.2);
      const headingDeg = Math.round(((-phoenixFlightState.yaw * 180) / Math.PI + 360) % 360);

      setIsFocus(phoenixFlightState.isFocusMode);
      setNearHoF(phoenixFlightState.position.z < -200);

      // Find nearest repository building
      let nearest = REPOSITORIES_DATA[0];
      let minD = Infinity;
      REPOSITORIES_DATA.forEach((r) => {
        const d = Math.hypot(
          phoenixFlightState.position.x - r.roofPosition[0],
          phoenixFlightState.position.z - r.roofPosition[2]
        );
        if (d < minD) {
          minD = d;
          nearest = r;
        }
      });

      setTelemetry({
        speed: speedKnots,
        alt: altMeters,
        heading: headingDeg,
        nearestRepo: nearest.name,
        nearestDist: Math.round(minD),
        nearestColor: nearest.accentColor,
      });
    }, 120);
    return () => clearInterval(interval);
  }, [isFlightMode]);

  const toggleFocus = () => {
    phoenixFlightState.isFocusMode = !phoenixFlightState.isFocusMode;
    setIsFocus(phoenixFlightState.isFocusMode);
  };

  return (
    <div
      style={{
        position: 'fixed',
        bottom: 24,
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 40,
        pointerEvents: 'none',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 6,
        transition: 'opacity 0.6s cubic-bezier(0.16, 1, 0.3, 1)',
        opacity: isFlightMode ? 0.95 : 0,
      }}
    >
      {/* Flight Control Telemetry Bar */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 16,
          padding: '8px 20px',
          background: 'rgba(5, 8, 14, 0.78)',
          backdropFilter: 'blur(12px)',
          border: '1px solid rgba(56, 189, 248, 0.28)',
          borderRadius: 4,
          boxShadow: '0 0 25px rgba(56, 189, 248, 0.12)',
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: '11px',
          letterSpacing: '0.08em',
          color: '#e2e8f0',
        }}
      >
        <span style={{ color: '#38bdf8', fontWeight: 600 }}>PHOENIX FLIGHT OS</span>
        <span style={{ color: 'rgba(255, 255, 255, 0.2)' }}>|</span>
        <span>
          <span style={{ color: 'rgba(255, 255, 255, 0.5)' }}>SPD: </span>
          <span style={{ color: '#38bdf8' }}>{telemetry.speed}</span> KTS
        </span>
        <span>
          <span style={{ color: 'rgba(255, 255, 255, 0.5)' }}>ALT: </span>
          <span style={{ color: '#a855f7' }}>{telemetry.alt}</span> M
        </span>
        <span>
          <span style={{ color: 'rgba(255, 255, 255, 0.5)' }}>HDG: </span>
          <span style={{ color: '#34d399' }}>{telemetry.heading}°</span>
        </span>
        <span style={{ color: 'rgba(255, 255, 255, 0.2)' }}>|</span>
        <span>
          <span style={{ color: 'rgba(255, 255, 255, 0.5)' }}>TARGET: </span>
          <b style={{ color: telemetry.nearestColor }}>{telemetry.nearestRepo}</b>
          <span style={{ color: 'rgba(255, 255, 255, 0.4)', marginLeft: 6 }}>
            ({telemetry.nearestDist}m)
          </span>
        </span>
      </div>

      {/* Dynamic Mode Guide: Standard Flight vs Focus Gallery Mode */}
      {isFocus ? (
        <div
          style={{
            pointerEvents: 'auto',
            display: 'flex',
            alignItems: 'center',
            gap: 14,
            padding: '6px 18px',
            background: 'rgba(4, 9, 20, 0.88)',
            backdropFilter: 'blur(12px)',
            border: '1px solid rgba(56, 189, 248, 0.55)',
            borderRadius: 4,
            boxShadow: '0 0 20px rgba(56, 189, 248, 0.25)',
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: '11px',
            letterSpacing: '0.06em',
            color: '#f8fafc',
          }}
        >
          <span style={{ color: '#38bdf8', fontWeight: 700 }}>[FOCUS MODE ACTIVE]</span>
          <span>
            <b style={{ color: '#38bdf8' }}>[A / D or ← / →]</b> PAN LEFT / RIGHT
          </span>
          <span>
            <b style={{ color: '#38bdf8' }}>[S or ↓]</b> PAN DOWN (CONNECT & CERTS)
          </span>
          <span>
            <b style={{ color: '#38bdf8' }}>[W or ↑]</b> PAN UP
          </span>
          <button
            onClick={toggleFocus}
            style={{
              cursor: 'pointer',
              background: 'rgba(244, 63, 94, 0.2)',
              border: '1px solid #f43f5e',
              color: '#f43f5e',
              borderRadius: 3,
              padding: '2px 8px',
              fontFamily: 'inherit',
              fontSize: '10px',
              fontWeight: 600,
            }}
          >
            [ESC / F] EXIT FOCUS
          </button>
        </div>
      ) : (
        <div
          style={{
            pointerEvents: nearHoF ? 'auto' : 'none',
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            padding: '4px 14px',
            background: 'rgba(5, 8, 14, 0.55)',
            backdropFilter: 'blur(8px)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            borderRadius: 3,
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: '10px',
            letterSpacing: '0.06em',
            color: 'rgba(226, 232, 240, 0.7)',
          }}
        >
          <span>
            <b style={{ color: '#38bdf8' }}>[W]</b> THRUST
          </span>
          <span>
            <b style={{ color: '#f43f5e' }}>[S]</b> BRAKE
          </span>
          <span>
            <b style={{ color: '#38bdf8' }}>[A/D]</b> STEER & BANK
          </span>
          <span>
            <b style={{ color: '#a855f7' }}>[SPACE]</b> CLIMB
          </span>
          <span>
            <b style={{ color: '#a855f7' }}>[SHIFT / WHEEL]</b> DIVE
          </span>
          {nearHoF && (
            <>
              <span style={{ color: 'rgba(255, 255, 255, 0.2)' }}>|</span>
              <button
                onClick={toggleFocus}
                style={{
                  cursor: 'pointer',
                  background: 'rgba(56, 189, 248, 0.2)',
                  border: '1px solid #38bdf8',
                  color: '#38bdf8',
                  borderRadius: 3,
                  padding: '2px 8px',
                  fontFamily: 'inherit',
                  fontSize: '10px',
                  fontWeight: 600,
                }}
              >
                [F] FOCUS HALL OF FAME
              </button>
            </>
          )}
          <span style={{ color: 'rgba(255, 255, 255, 0.2)' }}>|</span>
          <span>
            <b style={{ color: '#fbbf24' }}>[CLICK BUILDING]</b> OPEN REPO
          </span>
        </div>
      )}
    </div>
  );
};
