import React, { useMemo, useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';

export interface RepoData {
  id: string;
  name: string;
  category: string;
  tagline: string;
  stars: number;
  forks: number;
  language: string;
  accentColor: string;
  secondaryColor: string;
  techStack: string[];
  position: [number, number, number];
  rotationY: number;
  archType: 'monolith' | 'prism' | 'orbital' | 'cantilever' | 'blade' | 'baffle';
}

interface RepositoryBuildingProps {
  repo: RepoData;
  isNearby: boolean;
  distanceToPlayer: number;
}

export const RepositoryBuilding: React.FC<RepositoryBuildingProps> = ({
  repo,
  isNearby,
}) => {
  const entrancePortalRef = useRef<THREE.MeshBasicMaterial>(null);
  const beaconLightRef = useRef<THREE.PointLight>(null);
  const kineticPartRef = useRef<THREE.Group>(null);
  const proximityPlateRef = useRef<THREE.Group>(null);

  // Generate high-resolution facade texture with project name and technical glyphs
  const { facadeTexture, emissiveTexture } = useMemo(() => {
    const size = 1024;
    const cCanvas = document.createElement('canvas');
    cCanvas.width = size;
    cCanvas.height = size;
    const cCtx = cCanvas.getContext('2d')!;

    const eCanvas = document.createElement('canvas');
    eCanvas.width = size;
    eCanvas.height = size;
    const eCtx = eCanvas.getContext('2d')!;

    // Dark architectural base
    cCtx.fillStyle = '#0a0d13';
    cCtx.fillRect(0, 0, size, size);

    eCtx.fillStyle = '#000000';
    eCtx.fillRect(0, 0, size, size);

    // Subtle panel seam grid
    cCtx.strokeStyle = 'rgba(255, 255, 255, 0.04)';
    cCtx.lineWidth = 2;
    for (let x = 0; x < size; x += 128) {
      cCtx.beginPath();
      cCtx.moveTo(x, 0);
      cCtx.lineTo(x, size);
      cCtx.stroke();
    }
    for (let y = 0; y < size; y += 128) {
      cCtx.beginPath();
      cCtx.moveTo(0, y);
      cCtx.lineTo(size, y);
      cCtx.stroke();
    }

    // Vertical illuminated sign with repository name
    eCtx.fillStyle = repo.accentColor;
    eCtx.shadowColor = repo.accentColor;
    eCtx.shadowBlur = 14;

    cCtx.fillStyle = '#f1f5f9';
    cCtx.font = '700 48px "Space Grotesk", sans-serif';
    cCtx.textAlign = 'center';

    eCtx.font = '700 48px "Space Grotesk", sans-serif';
    eCtx.textAlign = 'center';

    // Draw vertical or horizontal branding
    cCtx.fillText(repo.name, size / 2, 220);
    eCtx.fillText(repo.name, size / 2, 220);

    // Category / Language
    cCtx.font = '400 24px "JetBrains Mono", monospace';
    cCtx.fillStyle = '#94a3b8';
    cCtx.fillText(`// ${repo.category.toUpperCase()}`, size / 2, 280);

    eCtx.font = '400 24px "JetBrains Mono", monospace';
    eCtx.fillStyle = repo.secondaryColor;
    eCtx.fillText(`// ${repo.category.toUpperCase()}`, size / 2, 280);

    // Tech Stack Badges
    const stackStr = repo.techStack.join('  ·  ');
    cCtx.font = '300 20px "JetBrains Mono", monospace';
    cCtx.fillStyle = '#64748b';
    cCtx.fillText(stackStr, size / 2, 330);

    // Decorative circuit trace lines on facade
    eCtx.strokeStyle = repo.accentColor;
    eCtx.lineWidth = 3;
    eCtx.beginPath();
    eCtx.moveTo(120, 420);
    eCtx.lineTo(380, 420);
    eCtx.lineTo(440, 480);
    eCtx.lineTo(900, 480);
    eCtx.stroke();

    const colorMap = new THREE.CanvasTexture(cCanvas);
    const emissiveMap = new THREE.CanvasTexture(eCanvas);
    return { facadeTexture: colorMap, emissiveTexture: emissiveMap };
  }, [repo]);

  // Shared dark metal & glass materials
  const metalMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: 0x121620,
        roughness: 0.28,
        metalness: 0.88,
      }),
    []
  );

  const darkAlloyMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: 0x080b10,
        roughness: 0.6,
        metalness: 0.4,
      }),
    []
  );

  const glassMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: 0x0d141e,
        roughness: 0.1,
        metalness: 0.8,
        transparent: true,
        opacity: 0.65,
      }),
    []
  );

  // Animate dynamic elements per frame
  useFrame(({ clock }, delta) => {
    const time = clock.getElapsedTime();

    // 1. Entrance portal glow responds to proximity
    if (entrancePortalRef.current) {
      const targetOpacity = isNearby ? 0.95 : 0.45;
      entrancePortalRef.current.opacity = THREE.MathUtils.damp(
        entrancePortalRef.current.opacity,
        targetOpacity,
        5,
        delta
      );
    }

    // 2. Beacon light pulse
    if (beaconLightRef.current) {
      const pulse = 1.8 + Math.sin(time * 3 + repo.position[0]) * 0.5;
      const targetIntensity = isNearby ? pulse * 2.5 : pulse;
      beaconLightRef.current.intensity = THREE.MathUtils.damp(
        beaconLightRef.current.intensity,
        targetIntensity,
        4,
        delta
      );
    }

    // 3. Kinetic architectural element animation (subtle floating or rotation)
    if (kineticPartRef.current) {
      if (repo.archType === 'orbital') {
        kineticPartRef.current.rotation.y += delta * 0.4;
      } else if (repo.archType === 'cantilever') {
        kineticPartRef.current.position.y = 18 + Math.sin(time * 1.5) * 0.6;
      } else {
        kineticPartRef.current.rotation.y = Math.sin(time * 0.5) * 0.08;
      }
    }

    // 4. Proximity information plate reveal
    if (proximityPlateRef.current) {
      const targetScale = isNearby ? 1 : 0.001;
      proximityPlateRef.current.scale.lerp(
        new THREE.Vector3(targetScale, targetScale, targetScale),
        Math.min(delta * 6, 1)
      );
    }
  });

  return (
    <group position={repo.position} rotation={[0, repo.rotationY, 0]}>
      {/* ================================================================= */}
      {/* UNIQUE ARCHITECTURAL SILHOUETTES BASED ON ARCH TYPE               */}
      {/* ================================================================= */}

      {/* 1. NEURAL MONOLITH ARCHITECTURE */}
      {repo.archType === 'monolith' && (
        <group>
          {/* Stepped central tower */}
          <mesh position={[0, 22, 0]} material={metalMat} castShadow receiveShadow>
            <boxGeometry args={[16, 44, 16]} />
          </mesh>
          {/* Facade display face */}
          <mesh position={[0, 22, 8.05]}>
            <planeGeometry args={[14, 28]} />
            <meshStandardMaterial
              map={facadeTexture}
              emissiveMap={emissiveTexture}
              emissive={new THREE.Color(repo.accentColor)}
              emissiveIntensity={isNearby ? 1.6 : 0.9}
              roughness={0.4}
              metalness={0.6}
            />
          </mesh>
          {/* Stepped side pylons */}
          <mesh position={[-9.5, 14, 0]} material={darkAlloyMat} castShadow>
            <boxGeometry args={[3, 28, 14]} />
          </mesh>
          <mesh position={[9.5, 14, 0]} material={darkAlloyMat} castShadow>
            <boxGeometry args={[3, 28, 14]} />
          </mesh>
          {/* Angular crown roof */}
          <mesh position={[0, 46, 0]} material={metalMat} castShadow>
            <coneGeometry args={[10, 8, 4]} />
          </mesh>
        </group>
      )}

      {/* 2. KINETIC PRISM ARCHITECTURE */}
      {repo.archType === 'prism' && (
        <group>
          {/* Main crystalline prism */}
          <mesh position={[0, 24, 0]} rotation={[0, Math.PI / 4, 0]} material={metalMat} castShadow receiveShadow>
            <cylinderGeometry args={[8, 13, 48, 4]} />
          </mesh>
          {/* Glass atrium inset */}
          <mesh position={[0, 18, 5]} material={glassMat}>
            <boxGeometry args={[10, 26, 6]} />
          </mesh>
          {/* Facade Branding Panel */}
          <mesh position={[0, 20, 8.2]}>
            <planeGeometry args={[12, 22]} />
            <meshStandardMaterial
              map={facadeTexture}
              emissiveMap={emissiveTexture}
              emissive={new THREE.Color(repo.accentColor)}
              emissiveIntensity={isNearby ? 1.6 : 0.9}
            />
          </mesh>
          {/* Kinetic light fins */}
          <group ref={kineticPartRef} position={[0, 36, 0]}>
            {[-1, 1].map((s) => (
              <mesh key={s} position={[s * 8, 0, 0]}>
                <boxGeometry args={[0.3, 12, 6]} />
                <meshBasicMaterial color={repo.accentColor} />
              </mesh>
            ))}
          </group>
        </group>
      )}

      {/* 3. ORBITAL CYLINDER ARCHITECTURE */}
      {repo.archType === 'orbital' && (
        <group>
          {/* Cylindrical core tower */}
          <mesh position={[0, 26, 0]} material={darkAlloyMat} castShadow receiveShadow>
            <cylinderGeometry args={[8, 9, 52, 24]} />
          </mesh>
          {/* Front Curved Display */}
          <mesh position={[0, 22, 7.8]}>
            <planeGeometry args={[11, 24]} />
            <meshStandardMaterial
              map={facadeTexture}
              emissiveMap={emissiveTexture}
              emissive={new THREE.Color(repo.accentColor)}
              emissiveIntensity={isNearby ? 1.6 : 0.9}
            />
          </mesh>
          {/* Rotating halo rings */}
          <group ref={kineticPartRef} position={[0, 42, 0]}>
            <mesh rotation={[Math.PI / 6, 0, 0]}>
              <torusGeometry args={[12, 0.4, 8, 36]} />
              <meshBasicMaterial color={repo.accentColor} />
            </mesh>
            <mesh rotation={[-Math.PI / 6, 0, 0]}>
              <torusGeometry args={[14, 0.3, 8, 36]} />
              <meshBasicMaterial color={repo.secondaryColor} />
            </mesh>
          </group>
        </group>
      )}

      {/* 4. CANTILEVER BRIDGE ARCHITECTURE */}
      {repo.archType === 'cantilever' && (
        <group>
          {/* Vertical spine pillar */}
          <mesh position={[-6, 26, 0]} material={metalMat} castShadow receiveShadow>
            <boxGeometry args={[8, 52, 14]} />
          </mesh>
          {/* Heavy cantilevered block extending outward over street */}
          <group ref={kineticPartRef} position={[2, 18, 4]}>
            <mesh material={darkAlloyMat} castShadow receiveShadow>
              <boxGeometry args={[18, 12, 16]} />
            </mesh>
            <mesh position={[0, 0, 8.05]}>
              <planeGeometry args={[16, 10]} />
              <meshStandardMaterial
                map={facadeTexture}
                emissiveMap={emissiveTexture}
                emissive={new THREE.Color(repo.accentColor)}
                emissiveIntensity={isNearby ? 1.6 : 0.9}
              />
            </mesh>
          </group>
        </group>
      )}

      {/* 5. BLADE SPIRE ARCHITECTURE */}
      {repo.archType === 'blade' && (
        <group>
          {/* Razor sharp triangular tower */}
          <mesh position={[0, 30, 0]} rotation={[0, Math.PI / 2, 0]} material={metalMat} castShadow receiveShadow>
            <cylinderGeometry args={[0.5, 12, 60, 3]} />
          </mesh>
          {/* Front facing illuminated strip */}
          <mesh position={[0, 24, 7.5]}>
            <planeGeometry args={[9, 32]} />
            <meshStandardMaterial
              map={facadeTexture}
              emissiveMap={emissiveTexture}
              emissive={new THREE.Color(repo.accentColor)}
              emissiveIntensity={isNearby ? 1.6 : 0.9}
            />
          </mesh>
          {/* Spire antenna */}
          <mesh position={[0, 64, 0]}>
            <cylinderGeometry args={[0.08, 0.4, 16, 6]} />
            <meshBasicMaterial color={repo.accentColor} />
          </mesh>
        </group>
      )}

      {/* 6. ACOUSTIC BAFFLE ARCHITECTURE */}
      {repo.archType === 'baffle' && (
        <group>
          {/* Layered acoustic slab tower */}
          {[0, 1, 2, 3].map((layer) => (
            <mesh key={layer} position={[0, 8 + layer * 11, 0]} material={metalMat} castShadow receiveShadow>
              <boxGeometry args={[18 - layer * 2, 9, 14 - layer]} />
            </mesh>
          ))}
          {/* Central facade */}
          <mesh position={[0, 24, 6.6]}>
            <planeGeometry args={[13, 26]} />
            <meshStandardMaterial
              map={facadeTexture}
              emissiveMap={emissiveTexture}
              emissive={new THREE.Color(repo.accentColor)}
              emissiveIntensity={isNearby ? 1.6 : 0.9}
            />
          </mesh>
          {/* Horizontal neon ribs */}
          {[12, 23, 34].map((y) => (
            <mesh key={y} position={[0, y, 6.7]}>
              <boxGeometry args={[14, 0.2, 0.2]} />
              <meshBasicMaterial color={repo.accentColor} />
            </mesh>
          ))}
        </group>
      )}

      {/* ================================================================= */}
      {/* UNIQUE ARCHITECTURAL ENTRANCE PORTAL                              */}
      {/* ================================================================= */}
      <group position={[0, 0, 7.8]}>
        {/* Recessed Portal Frame */}
        <mesh position={[0, 3.2, 0]} material={metalMat} castShadow>
          <boxGeometry args={[6.8, 6.4, 1.8]} />
        </mesh>
        {/* Inner Luminous Energy Doorway */}
        <mesh position={[0, 2.8, 0.92]}>
          <planeGeometry args={[4.2, 5.2]} />
          <meshBasicMaterial
            ref={entrancePortalRef}
            color={repo.accentColor}
            transparent
            opacity={0.45}
          />
        </mesh>
        {/* Entrance Light Beacon */}
        <pointLight
          ref={beaconLightRef}
          position={[0, 4.5, 2.2]}
          color={repo.accentColor}
          intensity={2}
          distance={16}
          decay={2}
        />
        {/* Entrance Threshold Steps */}
        <mesh position={[0, 0.15, 1.2]} material={darkAlloyMat} receiveShadow>
          <boxGeometry args={[7.2, 0.3, 1.8]} />
        </mesh>
      </group>

      {/* ================================================================= */}
      {/* PROXIMITY HOLOGRAPHIC REPO DATA HUD (Physically in 3D Space)       */}
      {/* Appears when the visitor walks close to the building              */}
      {/* ================================================================= */}
      <group ref={proximityPlateRef} position={[0, 7.5, 9.8]}>
        {/* Holographic frame */}
        <mesh>
          <planeGeometry args={[7.5, 3.6]} />
          <meshBasicMaterial
            color="#050810"
            transparent
            opacity={0.88}
            side={THREE.DoubleSide}
          />
        </mesh>
        {/* Glowing border wireframe */}
        <lineSegments>
          <edgesGeometry args={[new THREE.PlaneGeometry(7.5, 3.6)]} />
          <lineBasicMaterial color={repo.accentColor} linewidth={2} />
        </lineSegments>
      </group>
    </group>
  );
};
