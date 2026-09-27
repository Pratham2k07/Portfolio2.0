import React, { useState, useEffect, useRef, useCallback } from 'react';
import gsap from 'gsap';
import { EntranceScene } from './components/EntranceScene';
import { ProjectDetailsModal } from './components/ProjectDetailsModal';
import { CertificationDetailModal } from './components/CertificationDetailModal';
import { audioEngine } from './audio/AudioEngine';
import { phoenixFlightState, MIN_SAFE_ALTITUDE, MAX_SAFE_ALTITUDE } from './flight/phoenixFlightStore';
import type { RepositoryProject } from './data/repositoriesData';
import type { CertificationItem } from './data/certificationsData';

export const App: React.FC = () => {
  // Current and target progress (0 to 1) for fluid world traversal
  // 0.0 - 0.28: INTRO AREA (Arrival Terminal & Architectural Monument at Z=74)
  // 0.28 - 0.52: PROCESIONAL AVENUE (Gliding past monument toward Gate at Z=0)
  // 0.52 - 0.68: GATE ACTIVATION & HYDRAULIC OPENING
  // 0.70 - 1.00: CITY ENTRY & FREE 3RD-PERSON DRAGON FLIGHT
  const [progress, setProgress] = useState<number>(0);
  const targetProgress = useRef<number>(0);
  const animFrameId = useRef<number>(0);
  const audioStarted = useRef<boolean>(false);

  // Selected project for inspection modal
  const [selectedProject, setSelectedProject] = useState<RepositoryProject | null>(null);
  // Selected certification for Hall of Fame inspection modal
  const [selectedCertification, setSelectedCertification] = useState<CertificationItem | null>(null);
  const [isAudioMuted, setIsAudioMuted] = useState<boolean>(true);

  // Init audio on first user gesture seamlessly (unobtrusive, ambient)
  const initAudioOnGesture = useCallback(() => {
    if (!audioStarted.current) {
      audioStarted.current = true;
      audioEngine.init();
      audioEngine.setMuted(false);
      audioEngine.playBgMusic();
      setIsAudioMuted(false);
    }
  }, []);

  // Cinematic Gate Activation & Entrance Sequence
  const handleEnterWorld = useCallback(() => {
    initAudioOnGesture();
    gsap.killTweensOf(targetProgress);
    gsap.to(targetProgress, {
      current: 0.78,
      duration: 5.2,
      ease: 'power2.inOut',
    });
  }, [initAudioOnGesture]);

  // Smooth animation loop (lerp toward target progress)
  useEffect(() => {
    const loop = () => {
      setProgress((prev) => {
        const diff = targetProgress.current - prev;
        const next = Math.abs(diff) < 0.0002 ? targetProgress.current : prev + diff * 0.08;

        // Update procedural audio reactively
        const gateOpen = Math.min(1, Math.max(0, (next - 0.50) / 0.18));
        audioEngine.updateSceneProgress(next, gateOpen);

        return next;
      });

      animFrameId.current = requestAnimationFrame(loop);
    };

    animFrameId.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animFrameId.current);
  }, []);

  useEffect(() => {
    phoenixFlightState.isModalOpen = selectedProject !== null || selectedCertification !== null;
  }, [selectedProject, selectedCertification]);

  // Natural scroll handling: advances along causeway, or adjusts altitude in flight mode
  const handleWheel = useCallback(
    (e: WheelEvent) => {
      // Allow native scrolling when inspecting a project or certification
      if (selectedProject || selectedCertification) return;

      e.preventDefault();
      initAudioOnGesture();
      if (targetProgress.current >= 0.72) {
        // In flight mode: Wheel adjusts altitude!
        phoenixFlightState.position.y = Math.max(
          MIN_SAFE_ALTITUDE,
          Math.min(MAX_SAFE_ALTITUDE, phoenixFlightState.position.y - e.deltaY * 0.02)
        );
        phoenixFlightState.altitude = phoenixFlightState.position.y;
      } else {
        const delta = e.deltaY * 0.00045;
        targetProgress.current = Math.min(1, Math.max(0, targetProgress.current + delta));
      }
    },
    [initAudioOnGesture, selectedProject, selectedCertification]
  );

  // Keyboard navigation: W / S or Arrow keys move forward / backward along the entire world
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      initAudioOnGesture();

      // Enter key triggers gate activation when in intro
      if (e.code === 'Enter' || e.code === 'NumpadEnter') {
        if (targetProgress.current < 0.50) {
          handleEnterWorld();
          return;
        }
      }

      // Advance along causeway until entering the gate; once in flight mode, W/S fly the phoenix
      if (targetProgress.current < 0.72) {
        if (e.code === 'KeyW' || e.code === 'ArrowUp') {
          targetProgress.current = Math.min(1, targetProgress.current + 0.025);
        } else if (e.code === 'KeyS' || e.code === 'ArrowDown') {
          targetProgress.current = Math.max(0, targetProgress.current - 0.025);
        }
      } else if (e.code === 'PageDown') {
        e.preventDefault();
        targetProgress.current = Math.min(1, targetProgress.current + 0.08);
      } else if (e.code === 'PageUp') {
        e.preventDefault();
        targetProgress.current = Math.max(0, targetProgress.current - 0.08);
      }
    },
    [initAudioOnGesture, handleEnterWorld]
  );

  // Touch drag support for mobile / touch devices
  const touchStartY = useRef<number>(0);
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartY.current = e.touches[0].clientY;
    initAudioOnGesture();
  };
  const handleTouchMove = (e: React.TouchEvent) => {
    const deltaY = touchStartY.current - e.touches[0].clientY;
    touchStartY.current = e.touches[0].clientY;
    targetProgress.current = Math.min(1, Math.max(0, targetProgress.current + deltaY * 0.0025));
  };

  useEffect(() => {
    window.addEventListener('wheel', handleWheel, { passive: false });
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('click', initAudioOnGesture, { once: true });

    return () => {
      window.removeEventListener('wheel', handleWheel);
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('click', initAudioOnGesture);
    };
  }, [handleWheel, handleKeyDown, initAudioOnGesture]);

  // Initial darkness fade
  const darknessOpacity = Math.max(0, 1 - progress / 0.12);

  return (
    <div
      style={{
        position: 'relative',
        width: '100vw',
        height: '100vh',
        overflow: 'hidden',
        cursor: 'default',
      }}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
    >
      {/* Pure 3D WebGL Canvas Layer */}
      <EntranceScene
        progress={progress}
        onSelectProject={setSelectedProject}
        onSelectCertification={setSelectedCertification}
      />

      {/* Cyberpunk Project Inspection & README Modal */}
      <ProjectDetailsModal
        project={selectedProject}
        onClose={() => setSelectedProject(null)}
      />

      {/* Hall of Fame Certification Inspection Terminal */}
      <CertificationDetailModal
        certification={selectedCertification}
        onClose={() => setSelectedCertification(null)}
      />

      {/* Audio & Music Control Button */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          if (!audioStarted.current) {
            initAudioOnGesture();
          } else {
            const nextMuted = audioEngine.toggleMute();
            setIsAudioMuted(nextMuted);
          }
        }}
        title="Toggle Cyberpunk Ambient & Background Music"
        style={{
          position: 'fixed',
          top: 20,
          right: 24,
          zIndex: 45,
          background: 'rgba(5, 8, 14, 0.82)',
          backdropFilter: 'blur(12px)',
          border: `1px solid ${isAudioMuted ? 'rgba(255, 255, 255, 0.16)' : '#38bdf8'}`,
          borderRadius: 4,
          padding: '6px 14px',
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: '11px',
          letterSpacing: '0.08em',
          color: isAudioMuted ? '#94a3b8' : '#38bdf8',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          boxShadow: isAudioMuted
            ? 'none'
            : '0 0 16px rgba(56, 189, 248, 0.25)',
          transition: 'all 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
        }}
      >
        <span>{isAudioMuted ? '🔇' : '🔊'}</span>
        <span>{isAudioMuted ? 'AUDIO: OFF' : 'AUDIO: ON'}</span>
      </button>

      {/* 1. Futuristic Minimal Intro Activation Prompt */}
      {progress < 0.45 && (
        <div
          style={{
            position: 'fixed',
            bottom: 34,
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 42,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 10,
            opacity: Math.max(0, 1 - progress / 0.32),
            pointerEvents: progress > 0.38 ? 'none' : 'auto',
            transition: 'opacity 0.35s ease-out',
          }}
        >
          <button
            onClick={handleEnterWorld}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 12,
              padding: '12px 28px',
              background: 'rgba(6, 10, 18, 0.88)',
              backdropFilter: 'blur(16px)',
              border: '1px solid #00f0ff',
              borderRadius: 3,
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: '12px',
              fontWeight: 600,
              letterSpacing: '0.14em',
              color: '#f0f9ff',
              cursor: 'pointer',
              boxShadow: '0 0 24px rgba(0, 240, 255, 0.3), inset 0 0 14px rgba(0, 240, 255, 0.15)',
              transition: 'all 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = '#38bdf8';
              e.currentTarget.style.boxShadow =
                '0 0 36px rgba(56, 189, 248, 0.5), inset 0 0 20px rgba(56, 189, 248, 0.25)';
              e.currentTarget.style.transform = 'scale(1.03)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = '#00f0ff';
              e.currentTarget.style.boxShadow =
                '0 0 24px rgba(0, 240, 255, 0.3), inset 0 0 14px rgba(0, 240, 255, 0.15)';
              e.currentTarget.style.transform = 'scale(1.0)';
            }}
          >
            <span style={{ color: '#00f0ff', fontSize: '13px' }}>[</span>
            <span>ENTER THE WORLD</span>
            <span style={{ color: '#00f0ff', fontSize: '13px' }}>]</span>
          </button>
          <div
            style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: '10px',
              letterSpacing: '0.18em',
              color: 'rgba(148, 163, 184, 0.75)',
              textTransform: 'uppercase',
            }}
          >
            PRESS ENTER OR CLICK // SCROLL TO ADVANCE
          </div>
        </div>
      )}

      {/* 2. Minimal Flight Control Hint (Visible once flying in city) */}
      {progress >= 0.70 && (
        <div
          style={{
            position: 'fixed',
            bottom: 22,
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 40,
            pointerEvents: 'none',
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            padding: '7px 18px',
            background: 'rgba(5, 8, 14, 0.75)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(56, 189, 248, 0.28)',
            borderRadius: 4,
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: '11px',
            letterSpacing: '0.06em',
            color: '#e2e8f0',
          }}
        >
          <span>
            <b style={{ color: '#38bdf8' }}>[W]</b> FORWARD
          </span>
          <span style={{ color: 'rgba(255, 255, 255, 0.2)' }}>|</span>
          <span>
            <b style={{ color: '#38bdf8' }}>[A/D]</b> STEER
          </span>
          <span style={{ color: 'rgba(255, 255, 255, 0.2)' }}>|</span>
          <span>
            <b style={{ color: '#34d399' }}>[SPACE / E]</b> CLIMB ▲
          </span>
          <span style={{ color: 'rgba(255, 255, 255, 0.2)' }}>|</span>
          <span>
            <b style={{ color: '#f43f5e' }}>[SHIFT / C / Q / WHEEL]</b> DESCEND ▼
          </span>
          <span style={{ color: 'rgba(255, 255, 255, 0.2)' }}>|</span>
          <span>
            <b style={{ color: '#00f0ff' }}>[F]</b> FOCUS ARCHIVE
          </span>
        </div>
      )}

      {/* Atmospheric Overlays */}
      <div className="cinematic-grain" />
      <div className="cinematic-vignette" />

      {/* Initial Darkness Fade */}
      <div
        style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: '#020305',
          opacity: darknessOpacity,
          pointerEvents: 'none',
          transition: 'opacity 0.2s ease-out',
          zIndex: 45,
        }}
      />
    </div>
  );
};

export default App;
