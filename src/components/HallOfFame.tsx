import React, { useMemo, useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';

interface HallOfFameProps {
  position: [number, number, number];
}

export const HallOfFame: React.FC<HallOfFameProps> = ({ position }) => {
  const ledCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const ledTextureRef = useRef<THREE.CanvasTexture | null>(null);
  const frameGlowRef = useRef<THREE.PointLight>(null);

  // Generate high-resolution animated Hall of Fame display canvas
  const { billboardTexture, billboardEmissive } = useMemo(() => {
    const width = 2048;
    const height = 1024;

    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    ledCanvasRef.current = canvas;

    const ctx = canvas.getContext('2d')!;

    // 1. Dark tech background with animated LED dot matrix grid
    ctx.fillStyle = '#06090e';
    ctx.fillRect(0, 0, width, height);

    // Grid dots
    ctx.fillStyle = 'rgba(255, 255, 255, 0.04)';
    for (let x = 0; x < width; x += 16) {
      for (let y = 0; y < height; y += 16) {
        ctx.fillRect(x, y, 2, 2);
      }
    }

    // Outer neon boundary
    ctx.strokeStyle = '#f59e0b'; // Electric gold
    ctx.lineWidth = 12;
    ctx.strokeRect(30, 30, width - 60, height - 60);

    ctx.strokeStyle = '#38bdf8'; // Sky blue offset accent
    ctx.lineWidth = 4;
    ctx.strokeRect(48, 48, width - 96, height - 96);

    // Top Header Banner
    ctx.fillStyle = '#f59e0b';
    ctx.font = '700 32px "JetBrains Mono", monospace';
    ctx.letterSpacing = '0.35em';
    ctx.fillText('// GITHUB ARCHIVE · CORE REPOSITORIES', 80, 110);

    ctx.fillStyle = '#38bdf8';
    ctx.textAlign = 'right';
    ctx.fillText('STATUS: SYNCHRONIZED [200 OK]', width - 80, 110);

    // MONUMENTAL TITLE: "PRATHAM LALWANI // HALL OF FAME"
    ctx.textAlign = 'left';
    ctx.fillStyle = '#ffffff';
    ctx.font = '800 86px "Space Grotesk", "Syne", sans-serif';
    ctx.letterSpacing = '0.08em';
    ctx.shadowColor = 'rgba(245, 158, 11, 0.7)';
    ctx.shadowBlur = 24;
    ctx.fillText('HALL OF FAME', 80, 240);

    ctx.font = '500 38px "Space Grotesk", sans-serif';
    ctx.fillStyle = '#e2e8f0';
    ctx.shadowBlur = 0;
    ctx.fillText('PRATHAM LALWANI  ·  CODEBASE MILESTONES & ARCHITECTURE', 80, 305);

    // MILESTONES TILES (Playful + Funky Cyberpunk Achievement Cards)
    const cards = [
      { label: 'GLOBAL STARS', val: '★ 1.8K+', color: '#f59e0b', sub: 'across open source' },
      { label: 'TOTAL COMMITS', val: '450+', color: '#38bdf8', sub: 'verified git commits' },
      { label: 'REPOSITORIES', val: '24 REPOS', color: '#ec4899', sub: 'full-stack & graphics' },
      { label: 'CORE IMPACT', val: '99.9%', color: '#10b981', sub: 'uptime & performance' },
    ];

    const cardW = 430;
    const cardH = 260;
    const startY = 370;

    cards.forEach((c, i) => {
      const cx = 80 + i * (cardW + 48);

      // Card background
      ctx.fillStyle = 'rgba(15, 23, 42, 0.85)';
      ctx.fillRect(cx, startY, cardW, cardH);

      // Card border
      ctx.strokeStyle = c.color;
      ctx.lineWidth = 3;
      ctx.strokeRect(cx, startY, cardW, cardH);

      // Card Header
      ctx.fillStyle = '#94a3b8';
      ctx.font = '500 20px "JetBrains Mono", monospace';
      ctx.fillText(c.label, cx + 24, startY + 50);

      // Metric Value
      ctx.fillStyle = c.color;
      ctx.font = '800 58px "Space Grotesk", sans-serif';
      ctx.shadowColor = c.color;
      ctx.shadowBlur = 18;
      ctx.fillText(c.val, cx + 24, startY + 140);

      // Subtitle
      ctx.shadowBlur = 0;
      ctx.fillStyle = '#64748b';
      ctx.font = '400 20px "Space Grotesk", sans-serif';
      ctx.fillText(c.sub, cx + 24, startY + 200);
    });

    // Bottom Ticker / Scrolling Protocol Bar
    ctx.fillStyle = 'rgba(2, 6, 23, 0.95)';
    ctx.fillRect(48, height - 160, width - 96, 88);

    ctx.fillStyle = '#f59e0b';
    ctx.font = '600 26px "JetBrains Mono", monospace';
    ctx.fillText('FEATURED: NEURAL-NEXUS  ·  KINETIC-VOID  ·  SYNAPSE-PROTOCOL  ·  HYPER-CANVAS  ·  CHRONO-PULSE', 80, height - 105);

    const texture = new THREE.CanvasTexture(canvas);
    texture.needsUpdate = true;
    ledTextureRef.current = texture;

    return { billboardTexture: texture, billboardEmissive: texture };
  }, []);

  // Frame steel & truss materials
  const trussMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: 0x18202c,
        roughness: 0.35,
        metalness: 0.9,
      }),
    []
  );

  const neonTrimMat = useMemo(
    () =>
      new THREE.MeshBasicMaterial({
        color: '#f59e0b',
      }),
    []
  );

  // Dynamic light pulse and billboard glow
  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    if (frameGlowRef.current) {
      frameGlowRef.current.intensity = 6.5 + Math.sin(t * 4) * 1.5;
    }
  });

  return (
    <group position={position}>
      {/* ================================================================= */}
      {/* 1. MONUMENTAL BILLBOARD / HOARDING SPANNING THE BOULEVARD         */}
      {/* Width: ~58 units, Height: ~28 units, Elevated at Y = 24            */}
      {/* ================================================================= */}

      {/* Main Display Screen */}
      <mesh position={[0, 24, 0]}>
        <planeGeometry args={[56, 26]} />
        <meshStandardMaterial
          map={billboardTexture}
          emissiveMap={billboardEmissive}
          emissive={new THREE.Color('#f59e0b')}
          emissiveIntensity={1.25}
          roughness={0.2}
          metalness={0.1}
        />
      </mesh>

      {/* Screen Backing Housing */}
      <mesh position={[0, 24, -1.2]} material={trussMat} castShadow>
        <boxGeometry args={[58, 28, 2.2]} />
      </mesh>

      {/* Neon Edge Highlight Frame */}
      {/* Top Trim */}
      <mesh position={[0, 38.1, 0.1]} material={neonTrimMat}>
        <boxGeometry args={[58.2, 0.4, 0.4]} />
      </mesh>
      {/* Bottom Trim */}
      <mesh position={[0, 9.9, 0.1]} material={neonTrimMat}>
        <boxGeometry args={[58.2, 0.4, 0.4]} />
      </mesh>
      {/* Left Trim */}
      <mesh position={[-29.1, 24, 0.1]} material={neonTrimMat}>
        <boxGeometry args={[0.4, 28.2, 0.4]} />
      </mesh>
      {/* Right Trim */}
      <mesh position={[29.1, 24, 0.1]} material={neonTrimMat}>
        <boxGeometry args={[0.4, 28.2, 0.4]} />
      </mesh>

      {/* ================================================================= */}
      {/* 2. HEAVY INDUSTRIAL STEEL SUPPORT PYLONS & TRUSSES                */}
      {/* ================================================================= */}
      {/* Left Colossal Pillar */}
      <group position={[-25, 12, -2]}>
        <mesh material={trussMat} castShadow receiveShadow>
          <boxGeometry args={[3.5, 26, 3.5]} />
        </mesh>
        {/* Foundation Plinth */}
        <mesh position={[0, -11.5, 0]} material={trussMat}>
          <boxGeometry args={[6, 2, 6]} />
        </mesh>
      </group>

      {/* Right Colossal Pillar */}
      <group position={[25, 12, -2]}>
        <mesh material={trussMat} castShadow receiveShadow>
          <boxGeometry args={[3.5, 26, 3.5]} />
        </mesh>
        {/* Foundation Plinth */}
        <mesh position={[0, -11.5, 0]} material={trussMat}>
          <boxGeometry args={[6, 2, 6]} />
        </mesh>
      </group>

      {/* Diagonal Support Struts */}
      <mesh position={[-16, 12, -2]} rotation={[0, 0, Math.PI / 4]} material={trussMat}>
        <boxGeometry args={[1.2, 14, 1.2]} />
      </mesh>
      <mesh position={[16, 12, -2]} rotation={[0, 0, -Math.PI / 4]} material={trussMat}>
        <boxGeometry args={[1.2, 14, 1.2]} />
      </mesh>

      {/* Maintenance Catwalk / Service Bridge beneath billboard */}
      <mesh position={[0, 9.5, 1.5]} material={trussMat}>
        <boxGeometry args={[56, 0.4, 2.5]} />
      </mesh>
      {/* Catwalk Safety Railing */}
      <mesh position={[0, 10.6, 2.7]}>
        <boxGeometry args={[56, 0.1, 0.1]} />
        <meshBasicMaterial color="#38bdf8" />
      </mesh>

      {/* ================================================================= */}
      {/* 3. LIGHTING RIG DESIGNED SPECIFICALLY FOR HALL OF FAME            */}
      {/* ================================================================= */}
      {/* Central Warm Gold Ambient Glow */}
      <pointLight
        ref={frameGlowRef}
        position={[0, 24, 6]}
        color="#f59e0b"
        intensity={7.5}
        distance={45}
        decay={2}
      />

      {/* Downward Floodlights illuminating street below the sign */}
      <spotLight
        position={[-18, 9, 3]}
        target-position={[-18, 0, 10]}
        angle={0.65}
        penumbra={0.8}
        intensity={8}
        color="#38bdf8"
        distance={30}
      />
      <spotLight
        position={[18, 9, 3]}
        target-position={[18, 0, 10]}
        angle={0.65}
        penumbra={0.8}
        intensity={8}
        color="#f59e0b"
        distance={30}
      />
    </group>
  );
};
