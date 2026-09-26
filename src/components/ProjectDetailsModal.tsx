import React, { useEffect, useMemo } from 'react';
import type { RepositoryProject } from '../data/repositoriesData';

interface ProjectDetailsModalProps {
  project: RepositoryProject | null;
  onClose: () => void;
}

export const ProjectDetailsModal: React.FC<ProjectDetailsModalProps> = ({
  project,
  onClose,
}) => {
  // ESC key closes the inspection terminal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    if (project) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [project, onClose]);

  // Derive quick info categories from techStack dynamically
  const quickInfo = useMemo(() => {
    if (!project) return { lang: 'TypeScript', framework: 'Next.js', styling: 'TailwindCSS', backend: 'Node.js', deploy: 'Vercel' };
    const stack = project.techStack;
    const lang = stack.find(t => /typescript|javascript|python|c\b/i.test(t)) || stack[0] || 'TypeScript';
    const framework = stack.find(t => /react|next|express|vite/i.test(t)) || stack[1] || 'React';
    const styling = stack.find(t => /tailwind|css|glsl|three/i.test(t)) || stack[2] || 'TailwindCSS';
    const backend = stack.find(t => /node|sql|openai|speech|api|express|dbms/i.test(t)) || stack[3] || 'Node.js';
    const deploy = stack.find(t => /vercel|windows|cloud|git/i.test(t)) || stack[4] || 'Vercel';
    return { lang, framework, styling, backend, deploy };
  }, [project]);

  if (!project) return null;

  const readmeLines = project.readme.split('\n').filter(l => l.trim().length > 0);

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 60,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(2, 4, 10, 0.45)',
        backdropFilter: 'blur(4px)',
        animation: 'terminalOverlayFade 0.25s ease-out',
        overflow: 'hidden',
      }}
      onClick={onClose}
    >
      <style>{`
        @keyframes terminalOverlayFade {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes terminalSlideIn {
          from {
            opacity: 0;
            transform: scale(0.98) translateX(16px);
          }
          to {
            opacity: 1;
            transform: scale(1) translateX(0);
          }
        }
        @keyframes calloutFloat {
          from {
            opacity: 0;
            transform: translateY(-8px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes pulseGlow {
          0%, 100% { opacity: 0.8; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.08); }
        }
        .readme-scroll::-webkit-scrollbar {
          width: 4px;
        }
        .readme-scroll::-webkit-scrollbar-track {
          background: rgba(3, 8, 20, 0.5);
        }
        .readme-scroll::-webkit-scrollbar-thumb {
          background: #00f0ff;
          border-radius: 2px;
        }
      `}</style>

      {/* Top Right ESC / CLOSE Button */}
      <button
        onClick={onClose}
        style={{
          position: 'fixed',
          top: '22px',
          right: '28px',
          zIndex: 80,
          background: 'rgba(5, 12, 28, 0.82)',
          border: '1px solid rgba(0, 240, 255, 0.75)',
          color: '#38bdf8',
          padding: '6px 16px',
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: '11px',
          letterSpacing: '0.12em',
          cursor: 'pointer',
          borderRadius: '2px',
          boxShadow: '0 0 14px rgba(0, 240, 255, 0.25)',
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          transition: 'all 0.2s ease',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = '#00f0ff';
          e.currentTarget.style.color = '#020612';
          e.currentTarget.style.boxShadow = '0 0 20px rgba(0, 240, 255, 0.6)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = 'rgba(5, 12, 28, 0.82)';
          e.currentTarget.style.color = '#38bdf8';
          e.currentTarget.style.boxShadow = '0 0 14px rgba(0, 240, 255, 0.25)';
        }}
      >
        <span>ESC</span>
        <span style={{ opacity: 0.5 }}>/</span>
        <span>CLOSE</span>
      </button>

      {/* Full Viewport HUD Container */}
      <div
        style={{
          position: 'relative',
          width: '94vw',
          maxWidth: '1440px',
          height: '86vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'flex-end',
          gap: '3vw',
          pointerEvents: 'none',
        }}
      >
        {/* ========================================================================= */}
        {/* 1. LEFT SIDE: FLOATING ROOFTOP BUILDING CALLOUT & HOLOGRAPHIC CONNECTOR    */}
        {/* ========================================================================= */}
        <div
          style={{
            position: 'relative',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            marginRight: 'auto',
            pointerEvents: 'auto',
            animation: 'calloutFloat 0.4s ease-out',
            marginLeft: '2vw',
          }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Floating Callout Box */}
          <div
            style={{
              position: 'relative',
              padding: '12px 18px',
              background: 'rgba(5, 12, 28, 0.88)',
              border: '1px solid #00f0ff',
              borderRadius: '2px',
              boxShadow: '0 0 20px rgba(0, 240, 255, 0.28), inset 0 0 15px rgba(0, 240, 255, 0.12)',
              fontFamily: "'Space Grotesk', sans-serif",
              minWidth: '220px',
            }}
          >
            {/* Top Cyan Accent Strip */}
            <div
              style={{
                position: 'absolute',
                top: -1,
                left: 12,
                right: 12,
                height: 2,
                background: '#00f0ff',
                boxShadow: '0 0 8px #00f0ff',
              }}
            />

            {/* Header: // PROJECT  ● ACTIVE */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: '10px',
                letterSpacing: '0.1em',
                color: '#38bdf8',
                marginBottom: 4,
              }}
            >
              <span>// PROJECT</span>
              <span style={{ color: '#10b981', display: 'flex', alignItems: 'center', gap: 4 }}>
                <span style={{ width: 5, height: 5, borderRadius: '50%', background: '#10b981', boxShadow: '0 0 6px #10b981' }} />
                ACTIVE
              </span>
            </div>

            {/* Project Title */}
            <h2
              style={{
                margin: '2px 0 4px 0',
                fontSize: '20px',
                fontWeight: 700,
                color: '#f8fafc',
                letterSpacing: '-0.01em',
              }}
            >
              {project.name}
            </h2>

            {/* Category Subtitle */}
            <div
              style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: '11px',
                color: '#94a3b8',
              }}
            >
              {project.category}
            </div>
          </div>

          {/* Vertical Stem from Box to Target Ring */}
          <div
            style={{
              width: '1px',
              height: '36px',
              background: 'linear-gradient(180deg, #00f0ff 0%, rgba(0, 240, 255, 0.3) 100%)',
              boxShadow: '0 0 6px rgba(0, 240, 255, 0.4)',
            }}
          />

          {/* Concentric Rooftop Holographic Target Reticle */}
          <div
            style={{
              position: 'relative',
              width: '26px',
              height: '26px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              animation: 'pulseGlow 2.5s infinite ease-in-out',
            }}
          >
            {/* Outer Ring */}
            <div
              style={{
                position: 'absolute',
                inset: 0,
                borderRadius: '50%',
                border: '1px dashed #00f0ff',
                boxShadow: '0 0 10px rgba(0, 240, 255, 0.4)',
              }}
            />
            {/* Inner Ring */}
            <div
              style={{
                position: 'absolute',
                inset: 4,
                borderRadius: '50%',
                border: '1px solid #00f0ff',
              }}
            />
            {/* Center Core */}
            <div
              style={{
                width: 6,
                height: 6,
                borderRadius: '50%',
                background: '#00f0ff',
                boxShadow: '0 0 8px #00f0ff',
              }}
            />
          </div>

          {/* Angled Holographic Trace Line extending to the right terminal */}
          <svg
            style={{
              position: 'absolute',
              top: '80px',
              left: '110px',
              width: '160px',
              height: '90px',
              pointerEvents: 'none',
              overflow: 'visible',
            }}
          >
            <path
              d="M 0 0 L 60 50 L 140 50"
              fill="none"
              stroke="#00f0ff"
              strokeWidth="1.2"
              strokeDasharray="4 2"
              opacity="0.65"
            />
            <circle cx="140" cy="50" r="2.5" fill="#00f0ff" />
          </svg>
        </div>

        {/* ========================================================================= */}
        {/* 2. RIGHT SIDE: MAIN FUTURISTIC PROJECT INSPECTION TERMINAL                */}
        {/* ========================================================================= */}
        <div
          style={{
            position: 'relative',
            width: '62vw',
            minWidth: '780px',
            maxWidth: '980px',
            maxHeight: '84vh',
            background: 'rgba(5, 11, 24, 0.90)',
            backdropFilter: 'blur(16px)',
            border: '1px solid rgba(0, 240, 255, 0.65)',
            boxShadow: '0 0 40px rgba(0, 240, 255, 0.16), 0 25px 60px rgba(0, 0, 0, 0.85)',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
            fontFamily: "'Space Grotesk', -apple-system, sans-serif",
            color: '#e2e8f0',
            pointerEvents: 'auto',
            animation: 'terminalSlideIn 0.32s cubic-bezier(0.16, 1, 0.3, 1)',
            clipPath: `polygon(
              0 14px, 14px 0,
              calc(100% - 14px) 0, 100% 14px,
              100% calc(100% - 14px), calc(100% - 14px) 100%,
              14px 100%, 0 calc(100% - 14px)
            )`,
          }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Subtle Cyber Corner Tabs */}
          <div style={{ position: 'absolute', top: 0, left: 16, width: 36, height: 2, background: '#00f0ff', boxShadow: '0 0 8px #00f0ff' }} />
          <div style={{ position: 'absolute', top: 0, right: 16, width: 36, height: 2, background: '#00f0ff', boxShadow: '0 0 8px #00f0ff' }} />
          <div style={{ position: 'absolute', bottom: 0, left: 16, width: 36, height: 2, background: '#00f0ff', boxShadow: '0 0 8px #00f0ff' }} />
          <div style={{ position: 'absolute', bottom: 0, right: 16, width: 36, height: 2, background: '#00f0ff', boxShadow: '0 0 8px #00f0ff' }} />

          {/* ───────────────────────────────────────────────────────────────── */}
          {/* A. TERMINAL HEADER: Title, Hologram Thumbnail, Metadata & Action   */}
          {/* ───────────────────────────────────────────────────────────────── */}
          <div
            style={{
              padding: '24px 28px 18px 28px',
              borderBottom: '1px solid rgba(0, 240, 255, 0.18)',
              display: 'grid',
              gridTemplateColumns: 'minmax(0, 1.8fr) 140px minmax(0, 1.15fr)',
              gap: '20px',
              alignItems: 'center',
              background: 'linear-gradient(180deg, rgba(0, 240, 255, 0.04) 0%, transparent 100%)',
            }}
          >
            {/* Left: Project Branding */}
            <div>
              {/* Category & Status */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 12,
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: '11px',
                  letterSpacing: '0.12em',
                  marginBottom: 6,
                }}
              >
                <span style={{ color: '#38bdf8' }}>// PROJECT</span>
                <span style={{ color: '#00f0ff', display: 'flex', alignItems: 'center', gap: 6, fontWeight: 600 }}>
                  <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#00f0ff', boxShadow: '0 0 8px #00f0ff' }} />
                  BUILDING LINKED
                </span>
              </div>

              {/* Dominant Project Name */}
              <h1
                style={{
                  margin: 0,
                  fontSize: '34px',
                  fontWeight: 800,
                  color: '#ffffff',
                  letterSpacing: '-0.02em',
                  lineHeight: 1.1,
                }}
              >
                {project.name}
              </h1>

              {/* Subheading Domain */}
              <div
                style={{
                  fontFamily: "'Space Grotesk', sans-serif",
                  fontSize: '14px',
                  color: '#38bdf8',
                  marginTop: 4,
                  fontWeight: 500,
                }}
              >
                {project.category}
              </div>

              {/* Brief Tagline / Description */}
              <p
                style={{
                  margin: '8px 0 0 0',
                  fontSize: '13px',
                  lineHeight: 1.45,
                  color: '#94a3b8',
                  maxWidth: '480px',
                }}
              >
                {project.tagline || project.description}
              </p>
            </div>

            {/* Middle: Futuristic Cyber City Holographic Building Thumbnail */}
            <div
              style={{
                position: 'relative',
                width: '135px',
                height: '88px',
                borderRadius: '3px',
                overflow: 'hidden',
                border: '1px solid rgba(0, 240, 255, 0.4)',
                background: 'radial-gradient(circle at 50% 50%, #0d1e3d 0%, #030815 100%)',
                boxShadow: '0 0 16px rgba(0, 240, 255, 0.15)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              {/* Stylized Cyber Skyscraper Vector Silhouette */}
              <svg width="100%" height="100%" viewBox="0 0 135 88" fill="none">
                {/* Background Grid */}
                <path d="M 0 20 L 135 20 M 0 44 L 135 44 M 0 68 L 135 68" stroke="rgba(0, 240, 255, 0.1)" strokeWidth="0.8" />
                <path d="M 30 0 L 30 88 M 67 0 L 67 88 M 105 0 L 105 88" stroke="rgba(0, 240, 255, 0.1)" strokeWidth="0.8" />

                {/* Horizon Glow */}
                <ellipse cx="67" cy="80" rx="60" ry="18" fill="rgba(168, 85, 247, 0.25)" />

                {/* Towers */}
                <rect x="24" y="28" width="22" height="60" fill="#081024" stroke="#38bdf8" strokeWidth="0.8" />
                <rect x="52" y="12" width="32" height="76" fill="#0a1532" stroke="#00f0ff" strokeWidth="1.0" />
                <rect x="90" y="36" width="20" height="52" fill="#081024" stroke="#a855f7" strokeWidth="0.8" />

                {/* Glowing Windows */}
                <rect x="58" y="20" width="3" height="4" fill="#00f0ff" />
                <rect x="66" y="20" width="3" height="4" fill="#facc15" />
                <rect x="74" y="20" width="3" height="4" fill="#00f0ff" />
                <rect x="58" y="32" width="3" height="4" fill="#facc15" />
                <rect x="66" y="32" width="3" height="4" fill="#00f0ff" />
                <rect x="74" y="32" width="3" height="4" fill="#facc15" />
                <rect x="58" y="44" width="3" height="4" fill="#00f0ff" />
                <rect x="66" y="44" width="3" height="4" fill="#00f0ff" />

                {/* Rooftop Beacons */}
                <circle cx="68" cy="11" r="1.5" fill="#f43f5e" />
                <line x1="68" y1="11" x2="68" y2="4" stroke="#f43f5e" strokeWidth="0.8" />
              </svg>

              {/* Scanline Overlay */}
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  background: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0, 240, 255, 0.06) 2px, rgba(0, 240, 255, 0.06) 4px)',
                  pointerEvents: 'none',
                }}
              />
            </div>

            {/* Right: Metadata Block & Open Repository Action */}
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: 6,
                paddingLeft: '16px',
                borderLeft: '1px solid rgba(0, 240, 255, 0.15)',
                fontFamily: "'JetBrains Mono', monospace",
              }}
            >
              <div>
                <span style={{ fontSize: '10px', color: '#64748b', letterSpacing: '0.06em', display: 'block' }}>PROJECT</span>
                <span style={{ fontSize: '12px', color: '#f1f5f9', fontWeight: 600 }}>{project.name}</span>
              </div>
              <div>
                <span style={{ fontSize: '10px', color: '#64748b', letterSpacing: '0.06em', display: 'block' }}>TYPE</span>
                <span style={{ fontSize: '12px', color: '#cbd5e1' }}>{project.category}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <span style={{ fontSize: '10px', color: '#64748b', letterSpacing: '0.06em' }}>STATUS</span>
                <span style={{ fontSize: '11px', color: '#10b981', display: 'inline-flex', alignItems: 'center', gap: 4, fontWeight: 600 }}>
                  <span style={{ width: 5, height: 5, borderRadius: '50%', background: '#10b981', boxShadow: '0 0 6px #10b981' }} />
                  Active
                </span>
              </div>

              {/* GitHub Action Button with Authentic Octocat Icon */}
              <a
                href={project.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  marginTop: 6,
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 8,
                  padding: '7px 14px',
                  background: 'rgba(5, 12, 28, 0.95)',
                  border: '1px solid #00f0ff',
                  borderRadius: '3px',
                  color: '#ffffff',
                  textDecoration: 'none',
                  fontSize: '11px',
                  fontWeight: 600,
                  letterSpacing: '0.04em',
                  boxShadow: '0 0 12px rgba(0, 240, 255, 0.22)',
                  transition: 'all 0.2s ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = '#00f0ff';
                  e.currentTarget.style.color = '#030815';
                  e.currentTarget.style.boxShadow = '0 0 22px rgba(0, 240, 255, 0.55)';
                  e.currentTarget.style.transform = 'translateY(-1px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'rgba(5, 12, 28, 0.95)';
                  e.currentTarget.style.color = '#ffffff';
                  e.currentTarget.style.boxShadow = '0 0 12px rgba(0, 240, 255, 0.22)';
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                {/* GitHub Octocat SVG */}
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                  <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
                </svg>
                <span>OPEN REPOSITORY</span>
                <span style={{ fontSize: '12px' }}>↗</span>
              </a>
            </div>
          </div>

          {/* ───────────────────────────────────────────────────────────────── */}
          {/* B. MIDDLE SECTION: TECHNOLOGIES                                    */}
          {/* ───────────────────────────────────────────────────────────────── */}
          <div
            style={{
              padding: '16px 28px',
              borderBottom: '1px solid rgba(0, 240, 255, 0.12)',
              background: 'rgba(0, 240, 255, 0.015)',
            }}
          >
            {/* Header: [◇] TECHNOLOGIES */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: '11px',
                letterSpacing: '0.1em',
                color: '#38bdf8',
                marginBottom: 10,
                fontWeight: 600,
              }}
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#00f0ff" strokeWidth="2">
                <polygon points="12 2 2 12 12 22 22 12 12 2" />
              </svg>
              <span>TECHNOLOGIES</span>
            </div>

            {/* Tech Chips */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {project.techStack.map((tech) => (
                <div
                  key={tech}
                  style={{
                    padding: '5px 14px',
                    background: 'rgba(3, 10, 24, 0.85)',
                    border: '1px solid rgba(0, 240, 255, 0.45)',
                    borderRadius: '4px',
                    fontFamily: "'JetBrains Mono', monospace",
                    fontSize: '11px',
                    color: '#e2e8f0',
                    letterSpacing: '0.04em',
                    boxShadow: '0 0 8px rgba(0, 240, 255, 0.08)',
                  }}
                >
                  {tech}
                </div>
              ))}
            </div>
          </div>

          {/* ───────────────────────────────────────────────────────────────── */}
          {/* C. LOWER DUAL-COLUMN SECTION: README TERMINAL & QUICK INFO COLUMN  */}
          {/* ───────────────────────────────────────────────────────────────── */}
          <div
            style={{
              flex: 1,
              display: 'grid',
              gridTemplateColumns: 'minmax(0, 1.8fr) minmax(0, 1fr)',
              gap: '24px',
              padding: '18px 28px',
              overflowY: 'hidden',
            }}
          >
            {/* 1. LEFT COLUMN: README TERMINAL */}
            <div style={{ display: 'flex', flexDirection: 'column', minHeight: 0 }}>
              {/* Header: [📄] README */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: '11px',
                  letterSpacing: '0.1em',
                  color: '#38bdf8',
                  marginBottom: 8,
                  fontWeight: 600,
                }}
              >
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#00f0ff" strokeWidth="2">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                  <polyline points="14 2 14 8 20 8" />
                  <line x1="16" y1="13" x2="8" y2="13" />
                  <line x1="16" y1="17" x2="8" y2="17" />
                  <polyline points="10 9 9 9 8 9" />
                </svg>
                <span>README</span>
              </div>

              {/* Inset Terminal Box */}
              <div
                className="readme-scroll"
                style={{
                  flex: 1,
                  padding: '16px 18px',
                  background: 'rgba(3, 7, 18, 0.85)',
                  border: '1px solid rgba(0, 240, 255, 0.25)',
                  borderRadius: '3px',
                  overflowY: 'auto',
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: '12px',
                  lineHeight: 1.65,
                  color: '#cbd5e1',
                }}
              >
                {readmeLines.map((line, idx) => {
                  const isMainHeader = line.startsWith('# ') && !line.startsWith('##');
                  const isSubHeader = line.startsWith('## ') || line.startsWith('### ');
                  const isBullet = line.trim().startsWith('-');

                  if (isMainHeader) {
                    return (
                      <div
                        key={idx}
                        style={{
                          color: '#00f0ff',
                          fontWeight: 700,
                          fontSize: '13px',
                          letterSpacing: '0.04em',
                          marginBottom: 8,
                        }}
                      >
                        {line}
                      </div>
                    );
                  }

                  if (isSubHeader) {
                    return (
                      <div
                        key={idx}
                        style={{
                          color: '#00f0ff',
                          fontWeight: 600,
                          fontSize: '12px',
                          marginTop: 14,
                          marginBottom: 6,
                          letterSpacing: '0.02em',
                        }}
                      >
                        {line}
                      </div>
                    );
                  }

                  if (isBullet) {
                    return (
                      <div
                        key={idx}
                        style={{
                          display: 'flex',
                          alignItems: 'flex-start',
                          gap: 8,
                          paddingLeft: 4,
                          color: '#cbd5e1',
                          marginBottom: 3,
                        }}
                      >
                        <span style={{ color: '#00f0ff', opacity: 0.8 }}>-</span>
                        <span>{line.replace(/^-\s*/, '')}</span>
                      </div>
                    );
                  }

                  return (
                    <div key={idx} style={{ marginBottom: 6, color: '#94a3b8' }}>
                      {line}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* 2. RIGHT COLUMN: QUICK INFO TELEMETRY STACK */}
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                borderLeft: '1px solid rgba(0, 240, 255, 0.12)',
                paddingLeft: '22px',
                minHeight: 0,
              }}
            >
              {/* Header: [⚙] QUICK INFO */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: '11px',
                  letterSpacing: '0.1em',
                  color: '#38bdf8',
                  marginBottom: 14,
                  fontWeight: 600,
                }}
              >
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#00f0ff" strokeWidth="2">
                  <circle cx="12" cy="12" r="3" />
                  <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
                </svg>
                <span>QUICK INFO</span>
              </div>

              {/* Stack Rows with Custom Cyber Badges */}
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 12,
                  fontFamily: "'JetBrains Mono', monospace",
                }}
              >
                {/* 1. Language */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                  <div
                    style={{
                      width: 32,
                      height: 32,
                      borderRadius: 4,
                      background: 'rgba(0, 240, 255, 0.08)',
                      border: '1px solid rgba(0, 240, 255, 0.4)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#00f0ff',
                      fontSize: '11px',
                      fontWeight: 700,
                    }}
                  >
                    {'</>'}
                  </div>
                  <div>
                    <span style={{ fontSize: '10px', color: '#64748b', display: 'block' }}>Language</span>
                    <span style={{ fontSize: '12px', color: '#ffffff', fontWeight: 600 }}>{quickInfo.lang}</span>
                  </div>
                </div>

                <div style={{ height: 1, background: 'rgba(0, 240, 255, 0.08)' }} />

                {/* 2. Framework */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                  <div
                    style={{
                      width: 32,
                      height: 32,
                      borderRadius: 4,
                      background: 'rgba(0, 240, 255, 0.08)',
                      border: '1px solid rgba(0, 240, 255, 0.4)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#00f0ff',
                      fontSize: '12px',
                    }}
                  >
                    ▲
                  </div>
                  <div>
                    <span style={{ fontSize: '10px', color: '#64748b', display: 'block' }}>Framework</span>
                    <span style={{ fontSize: '12px', color: '#ffffff', fontWeight: 600 }}>{quickInfo.framework}</span>
                  </div>
                </div>

                <div style={{ height: 1, background: 'rgba(0, 240, 255, 0.08)' }} />

                {/* 3. Styling */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                  <div
                    style={{
                      width: 32,
                      height: 32,
                      borderRadius: 4,
                      background: 'rgba(0, 240, 255, 0.08)',
                      border: '1px solid rgba(0, 240, 255, 0.4)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#00f0ff',
                      fontSize: '12px',
                    }}
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#00f0ff" strokeWidth="2">
                      <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z" />
                    </svg>
                  </div>
                  <div>
                    <span style={{ fontSize: '10px', color: '#64748b', display: 'block' }}>Styling</span>
                    <span style={{ fontSize: '12px', color: '#ffffff', fontWeight: 600 }}>{quickInfo.styling}</span>
                  </div>
                </div>

                <div style={{ height: 1, background: 'rgba(0, 240, 255, 0.08)' }} />

                {/* 4. Backend */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                  <div
                    style={{
                      width: 32,
                      height: 32,
                      borderRadius: 4,
                      background: 'rgba(0, 240, 255, 0.08)',
                      border: '1px solid rgba(0, 240, 255, 0.4)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#00f0ff',
                      fontSize: '12px',
                    }}
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#00f0ff" strokeWidth="2">
                      <rect x="2" y="2" width="20" height="8" rx="2" ry="2" />
                      <rect x="2" y="14" width="20" height="8" rx="2" ry="2" />
                      <line x1="6" y1="6" x2="6.01" y2="6" />
                      <line x1="6" y1="18" x2="6.01" y2="18" />
                    </svg>
                  </div>
                  <div>
                    <span style={{ fontSize: '10px', color: '#64748b', display: 'block' }}>Backend</span>
                    <span style={{ fontSize: '12px', color: '#ffffff', fontWeight: 600 }}>{quickInfo.backend}</span>
                  </div>
                </div>

                <div style={{ height: 1, background: 'rgba(0, 240, 255, 0.08)' }} />

                {/* 5. Deployment */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                  <div
                    style={{
                      width: 32,
                      height: 32,
                      borderRadius: 4,
                      background: 'rgba(0, 240, 255, 0.08)',
                      border: '1px solid rgba(0, 240, 255, 0.4)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#00f0ff',
                      fontSize: '12px',
                    }}
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#00f0ff" strokeWidth="2">
                      <path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z" />
                    </svg>
                  </div>
                  <div>
                    <span style={{ fontSize: '10px', color: '#64748b', display: 'block' }}>Deployment</span>
                    <span style={{ fontSize: '12px', color: '#ffffff', fontWeight: 600 }}>{quickInfo.deploy}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ───────────────────────────────────────────────────────────────── */}
          {/* D. TERMINAL FOOTER: System Status Marker                          */}
          {/* ───────────────────────────────────────────────────────────────── */}
          <div
            style={{
              padding: '8px 28px',
              borderTop: '1px solid rgba(0, 240, 255, 0.15)',
              background: 'rgba(2, 6, 16, 0.95)',
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: '10px',
              letterSpacing: '0.08em',
              color: '#38bdf8',
            }}
          >
            {'</> // AUTOMATICALLY LINKED TO GITHUB REPOSITORY'}
          </div>
        </div>
      </div>
    </div>
  );
};
