import React, { useMemo, useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { Text } from '@react-three/drei';

interface IntroArrivalAreaProps {
  progress: number;
}

export const IntroArrivalArea: React.FC<IntroArrivalAreaProps> = ({ progress }) => {
  const groupRef = useRef<THREE.Group>(null);
  const cyanLightRef = useRef<THREE.PointLight>(null);
  const violetLightRef = useRef<THREE.PointLight>(null);
  const localParticlesRef = useRef<THREE.Points>(null);

  // Position of the primary architectural monument: Z = 74, Y = 0, X = 0
  const MONUMENT_Z = 74;

  // Fade out the intro area as camera advances past it toward the monumental gate
  // Visible from progress 0 to 0.45, smoothly fading out by 0.52
  const introVisibility = Math.max(0, Math.min(1, 1 - (progress - 0.24) / 0.26));

  // Pulse animation for cyan edge conduits, typography glow, and subtle particle drift
  useFrame(({ clock }, delta) => {
    const t = clock.getElapsedTime();
    if (cyanLightRef.current) {
      cyanLightRef.current.intensity = (2.4 + Math.sin(t * 1.6) * 0.4) * introVisibility;
    }
    if (violetLightRef.current) {
      violetLightRef.current.intensity = (1.9 + Math.cos(t * 1.3) * 0.35) * introVisibility;
    }

    // Gentle micro-particle drift
    if (localParticlesRef.current) {
      const positions = localParticlesRef.current.geometry.attributes.position.array as Float32Array;
      const count = positions.length / 3;
      for (let i = 0; i < count; i++) {
        positions[i * 3 + 1] += delta * 0.22;
        if (positions[i * 3 + 1] > 9.5) {
          positions[i * 3 + 1] = 0.4;
        }
      }
      localParticlesRef.current.geometry.attributes.position.needsUpdate = true;
    }
  });

  // Dark obsidian brutalist metallic materials
  const { monumentMat, panelFaceMat, accentTrimMat, glassPlinthMat } = useMemo(() => {
    return {
      monumentMat: new THREE.MeshStandardMaterial({
        color: new THREE.Color('#050811'),
        roughness: 0.32,
        metalness: 0.9,
      }),
      panelFaceMat: new THREE.MeshStandardMaterial({
        color: new THREE.Color('#070b16'),
        roughness: 0.24,
        metalness: 0.94,
      }),
      accentTrimMat: new THREE.MeshStandardMaterial({
        color: new THREE.Color('#0f172a'),
        roughness: 0.2,
        metalness: 0.88,
      }),
      glassPlinthMat: new THREE.MeshStandardMaterial({
        color: new THREE.Color('#03050a'),
        roughness: 0.14,
        metalness: 0.96,
      }),
    };
  }, []);

  // Subtle floating cyber embers / dust particles around the monument
  const particleCount = 140;
  const { particlePositions, particleColors } = useMemo(() => {
    const pos = new Float32Array(particleCount * 3);
    const col = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 26; // X: span around monument
      pos[i * 3 + 1] = 0.5 + Math.random() * 8.5; // Y: hover height
      pos[i * 3 + 2] = -5 + Math.random() * 20; // Z: in front of and around monument

      const isCyan = Math.random() > 0.35;
      col[i * 3] = isCyan ? 0.0 : 0.65;
      col[i * 3 + 1] = isCyan ? 0.94 : 0.35;
      col[i * 3 + 2] = 1.0;
    }
    return { particlePositions: pos, particleColors: col };
  }, []);

  return (
    <group ref={groupRef} position={[0, 0, MONUMENT_Z]}>
      {/* =================================================================== */}
      {/* 1. PHYSICAL ARCHITECTURAL MONUMENT & ARRIVAL TERMINAL               */}
      {/* =================================================================== */}
      {/* Foundation Platform: Wide polished obsidian plinth */}
      <mesh position={[0, 0.35, 0]} material={glassPlinthMat} receiveShadow castShadow>
        <boxGeometry args={[26, 0.7, 5.5]} />
      </mesh>

      {/* Stepped Upper Foundation Slab with Recessed Front Light Rail */}
      <mesh position={[0, 0.8, 0.4]} material={monumentMat} receiveShadow castShadow>
        <boxGeometry args={[22, 0.35, 4.2]} />
      </mesh>

      {/* Recessed Ground Cyan Light Conduit on Plinth Step */}
      <mesh position={[0, 0.98, 2.3]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[21, 0.06]} />
        <meshBasicMaterial color="#00f0ff" transparent opacity={0.8 * introVisibility} />
      </mesh>

      {/* Primary Vertical Architectural Monolithic Wall */}
      <mesh position={[0, 5.8, -0.6]} material={monumentMat} receiveShadow castShadow>
        <boxGeometry args={[18.4, 9.8, 0.7]} />
      </mesh>

      {/* Recessed Center Display Panel (Dark brushed titanium face) */}
      <mesh position={[0, 5.8, -0.22]} material={panelFaceMat} receiveShadow>
        <boxGeometry args={[17.6, 9.0, 0.1]} />
      </mesh>

      {/* Architectural Beveled Border Trim */}
      <mesh position={[0, 5.8, -0.26]} material={accentTrimMat}>
        <boxGeometry args={[18.0, 9.4, 0.05]} />
      </mesh>

      {/* Flanking Architectural Angled Pylons (Left & Right Wings) */}
      <group position={[-10.2, 4.4, 0.4]} rotation={[0, 0.38, 0]}>
        <mesh material={monumentMat} castShadow receiveShadow>
          <boxGeometry args={[1.6, 8.2, 2.6]} />
        </mesh>
        {/* Recessed Vertical Cyan Power Conduit */}
        <mesh position={[0.81, 0, 0]}>
          <planeGeometry args={[0.08, 7.6]} />
          <meshBasicMaterial color="#00f0ff" transparent opacity={0.8 * introVisibility} />
        </mesh>
      </group>

      <group position={[10.2, 4.4, 0.4]} rotation={[0, -0.38, 0]}>
        <mesh material={monumentMat} castShadow receiveShadow>
          <boxGeometry args={[1.6, 8.2, 2.6]} />
        </mesh>
        {/* Recessed Vertical Violet Power Conduit */}
        <mesh position={[-0.81, 0, 0]}>
          <planeGeometry args={[0.08, 7.6]} />
          <meshBasicMaterial color="#a855f7" transparent opacity={0.8 * introVisibility} />
        </mesh>
      </group>

      {/* =================================================================== */}
      {/* 2. ARCHITECTURAL UI DETAILS & CORNER BRACKETS                       */}
      {/* =================================================================== */}
      {/* Top Left Corner Bracket */}
      <mesh position={[-8.2, 9.7, -0.15]}>
        <planeGeometry args={[0.9, 0.04]} />
        <meshBasicMaterial color="#00f0ff" transparent opacity={0.85 * introVisibility} />
      </mesh>
      <mesh position={[-8.63, 9.27, -0.15]}>
        <planeGeometry args={[0.04, 0.9]} />
        <meshBasicMaterial color="#00f0ff" transparent opacity={0.85 * introVisibility} />
      </mesh>

      {/* Top Right Corner Bracket */}
      <mesh position={[8.2, 9.7, -0.15]}>
        <planeGeometry args={[0.9, 0.04]} />
        <meshBasicMaterial color="#00f0ff" transparent opacity={0.85 * introVisibility} />
      </mesh>
      <mesh position={[8.63, 9.27, -0.15]}>
        <planeGeometry args={[0.04, 0.9]} />
        <meshBasicMaterial color="#00f0ff" transparent opacity={0.85 * introVisibility} />
      </mesh>

      {/* Bottom Left Corner Bracket */}
      <mesh position={[-8.2, 1.9, -0.15]}>
        <planeGeometry args={[0.9, 0.04]} />
        <meshBasicMaterial color="#00f0ff" transparent opacity={0.85 * introVisibility} />
      </mesh>
      <mesh position={[-8.63, 2.33, -0.15]}>
        <planeGeometry args={[0.04, 0.9]} />
        <meshBasicMaterial color="#00f0ff" transparent opacity={0.85 * introVisibility} />
      </mesh>

      {/* Bottom Right Corner Bracket */}
      <mesh position={[8.2, 1.9, -0.15]}>
        <planeGeometry args={[0.9, 0.04]} />
        <meshBasicMaterial color="#00f0ff" transparent opacity={0.85 * introVisibility} />
      </mesh>
      <mesh position={[8.63, 2.33, -0.15]}>
        <planeGeometry args={[0.04, 0.9]} />
        <meshBasicMaterial color="#00f0ff" transparent opacity={0.85 * introVisibility} />
      </mesh>

      {/* Precision Measurement Tick Marks along Top Lintel */}
      {[-6, -4, -2, 0, 2, 4, 6].map((x, i) => (
        <mesh key={`top-tick-${i}`} position={[x, 9.7, -0.15]}>
          <planeGeometry args={[0.03, 0.16]} />
          <meshBasicMaterial color="#38bdf8" transparent opacity={0.6 * introVisibility} />
        </mesh>
      ))}

      {/* =================================================================== */}
      {/* 3. REAL-TIME 3D ARCHITECTURAL TYPOGRAPHY (PHYSICALLY INTEGRATED)    */}
      {/* =================================================================== */}
      <group position={[0, 0, 0.05]}>
        {/* Top Technical Hierarchy Header: // ARRIVAL SECTOR 01     ● SYSTEM IDENTITY */}
        <Text
          position={[-3.8, 9.25, 0]}
          fontSize={0.22}
          letterSpacing={0.26}
          textAlign="left"
          anchorX="left"
          anchorY="middle"
          color="#38bdf8"
        >
          {`// ARRIVAL SECTOR 01     ● SYSTEM IDENTITY`}
          <meshBasicMaterial color="#38bdf8" transparent opacity={0.8 * introVisibility} />
        </Text>

        {/* Top Right Technical Location Telemetry */}
        <Text
          position={[3.8, 9.25, 0]}
          fontSize={0.20}
          letterSpacing={0.22}
          textAlign="right"
          anchorX="right"
          anchorY="middle"
          color="#94a3b8"
        >
          {`LOC: 28°36'N · 77°12'E // ELEV: +12.4M`}
          <meshBasicMaterial color="#94a3b8" transparent opacity={0.65 * introVisibility} />
        </Text>

        {/* Thin Technical Divider Line */}
        <mesh position={[0, 8.95, 0]}>
          <planeGeometry args={[15.6, 0.015]} />
          <meshBasicMaterial color="#38bdf8" transparent opacity={0.4 * introVisibility} />
        </mesh>

        {/* PRIMARY NAME IDENTITY: PRATHAM */}
        {/* Extremely large, majestic illuminated architectural lettering */}
        <Text
          position={[0, 7.3, 0.08]}
          fontSize={2.1}
          letterSpacing={0.18}
          textAlign="center"
          anchorX="center"
          anchorY="middle"
          color="#ffffff"
        >
          {`PRATHAM`}
          <meshStandardMaterial
            color="#f8fafc"
            emissive="#38bdf8"
            emissiveIntensity={1.4 * introVisibility}
            roughness={0.22}
            metalness={0.8}
          />
        </Text>

        {/* Cyan Horizontal Accent Conduits Framing the Name */}
        <mesh position={[-6.2, 7.3, 0.02]}>
          <planeGeometry args={[0.06, 2.8]} />
          <meshBasicMaterial color="#00f0ff" transparent opacity={0.85 * introVisibility} />
        </mesh>
        <mesh position={[6.2, 7.3, 0.02]}>
          <planeGeometry args={[0.06, 2.8]} />
          <meshBasicMaterial color="#00f0ff" transparent opacity={0.85 * introVisibility} />
        </mesh>

        {/* IDENTITY LINE: DEVELOPER · BUILDER · EXPLORER */}
        <Text
          position={[0, 5.5, 0.08]}
          fontSize={0.46}
          letterSpacing={0.26}
          textAlign="center"
          anchorX="center"
          anchorY="middle"
          color="#38bdf8"
        >
          {`DEVELOPER  ·  BUILDER  ·  EXPLORER`}
          <meshStandardMaterial
            color="#38bdf8"
            emissive="#00f0ff"
            emissiveIntensity={1.2 * introVisibility}
            roughness={0.28}
            metalness={0.65}
          />
        </Text>

        {/* Subtle Horizontal Divider */}
        <mesh position={[0, 4.95, 0.02]}>
          <planeGeometry args={[10.2, 0.015]} />
          <meshBasicMaterial color="#38bdf8" transparent opacity={0.35 * introVisibility} />
        </mesh>

        {/* PERSONAL STATEMENT */}
        {/* I learn by building. */}
        {/* I build by experimenting. */}
        {/* And every project is another place to explore. */}
        <Text
          position={[0, 3.95, 0.08]}
          fontSize={0.38}
          lineHeight={1.48}
          letterSpacing={0.06}
          textAlign="center"
          anchorX="center"
          anchorY="middle"
          maxWidth={14.0}
          color="#f1f5f9"
        >
          {`I learn by building.\nI build by experimenting.\nAnd every project is another place to explore.`}
          <meshStandardMaterial
            color="#f1f5f9"
            emissive="#94a3b8"
            emissiveIntensity={0.5 * introVisibility}
            roughness={0.35}
            metalness={0.5}
          />
        </Text>

        {/* Subtle Violet Technical Separator */}
        <mesh position={[0, 2.85, 0.02]}>
          <planeGeometry args={[7.8, 0.015]} />
          <meshBasicMaterial color="#8b5cf6" transparent opacity={0.4 * introVisibility} />
        </mesh>

        {/* FINAL LINE / EMOTIONAL FOCAL POINT: Welcome to my world. */}
        <Text
          position={[0, 2.3, 0.08]}
          fontSize={0.46}
          letterSpacing={0.16}
          textAlign="center"
          anchorX="center"
          anchorY="middle"
          color="#c084fc"
        >
          {`Welcome to my world.`}
          <meshStandardMaterial
            color="#e879f9"
            emissive="#a855f7"
            emissiveIntensity={1.2 * introVisibility}
            roughness={0.25}
            metalness={0.6}
          />
        </Text>

        {/* GATE CONNECTION / SUBTLE ARCHITECTURAL INDICATOR */}
        {/* ▼ GATEWAY THRESHOLD AHEAD ▼ (Points down the avenue toward the physical Torii Gate) */}
        <Text
          position={[0, 1.4, 0.08]}
          fontSize={0.24}
          letterSpacing={0.32}
          textAlign="center"
          anchorX="center"
          anchorY="middle"
          color="#06b6d4"
        >
          {`▼   GATEWAY THRESHOLD AHEAD   ▼`}
          <meshBasicMaterial color="#06b6d4" transparent opacity={0.8 * introVisibility} />
        </Text>
      </group>

      {/* =================================================================== */}
      {/* 4. GROUND LIGHT CONDUITS LEADING FORWARD TOWARD THE MONUMENTAL GATE */}
      {/* =================================================================== */}
      {/* Left and Right embedded ground light rails running from Z=0 toward negative Z */}
      <mesh
        position={[-3.8, 0.02, -18]}
        rotation={[-Math.PI / 2, 0, 0]}
      >
        <planeGeometry args={[0.12, 38]} />
        <meshBasicMaterial color="#00f0ff" transparent opacity={0.65 * introVisibility} />
      </mesh>

      <mesh
        position={[3.8, 0.02, -18]}
        rotation={[-Math.PI / 2, 0, 0]}
      >
        <planeGeometry args={[0.12, 38]} />
        <meshBasicMaterial color="#00f0ff" transparent opacity={0.65 * introVisibility} />
      </mesh>

      {/* Center Avenue Pulsing Guidance Vector Arrow Dash Lines */}
      {[-5, -12, -19, -26, -33, -40].map((offsetZ, i) => (
        <mesh
          key={`arrow-${i}`}
          position={[0, 0.02, offsetZ]}
          rotation={[-Math.PI / 2, 0, 0]}
        >
          <planeGeometry args={[0.8, 1.6]} />
          <meshBasicMaterial
            color="#38bdf8"
            transparent
            opacity={(0.22 + i * 0.08) * introVisibility}
          />
        </mesh>
      ))}

      {/* =================================================================== */}
      {/* 5. FLOATING CYBER EMBERS / MICRO PARTICLES                          */}
      {/* =================================================================== */}
      <points ref={localParticlesRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[particlePositions, 3]}
          />
          <bufferAttribute
            attach="attributes-color"
            args={[particleColors, 3]}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.10}
          vertexColors
          transparent
          opacity={0.35 * introVisibility}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </points>

      {/* =================================================================== */}
      {/* 6. CONTROLLED ATMOSPHERIC ARCHITECTURAL LIGHTING (85% Dark, 15% Lit)*/}
      {/* =================================================================== */}
      {/* Dedicated Key Spotlight for 3D Typography */}
      <spotLight
        position={[0, 14, 16]}
        target-position={[0, 6.2, 0]}
        angle={0.62}
        penumbra={0.85}
        intensity={6.8 * introVisibility}
        color="#d0e8fd"
        distance={32}
        decay={2}
      />

      {/* Up-Lighting Plinth Wash (Electric Cyan) */}
      <pointLight
        ref={cyanLightRef}
        position={[-6, 1.8, 2.4]}
        color="#00f0ff"
        intensity={2.4 * introVisibility}
        distance={16}
        decay={2}
      />

      {/* Up-Lighting Plinth Wash (Deep Violet) */}
      <pointLight
        ref={violetLightRef}
        position={[6, 1.8, 2.4]}
        color="#8b5cf6"
        intensity={1.9 * introVisibility}
        distance={16}
        decay={2}
      />

      {/* Ground Horizon Accent Rim Light behind the monument */}
      <pointLight
        position={[0, 3.8, -3.2]}
        color="#38bdf8"
        intensity={1.4 * introVisibility}
        distance={14}
        decay={2}
      />
    </group>
  );
};
