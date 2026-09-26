import React, { useMemo, useRef, useState } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { Text } from '@react-three/drei';
import { CERTIFICATIONS_DATA, type CertificationItem } from '../data/certificationsData';
import { phoenixFlightState } from '../flight/phoenixFlightStore';

interface HallOfFameBuildingProps {
  onSelectCertification: (cert: CertificationItem) => void;
}

export const HallOfFameBuilding: React.FC<HallOfFameBuildingProps> = ({
  onSelectCertification,
}) => {
  const groupRef = useRef<THREE.Group>(null);
  const crownRingRef = useRef<THREE.Group>(null);
  const centralCoreLightRef = useRef<THREE.PointLight>(null);
  const entranceLightRef = useRef<THREE.SpotLight>(null);
  const [hoveredCertId, setHoveredCertId] = useState<string | null>(null);

  // Center position of the Hall of Fame: [0, 0, -360]
  const HALL_Z = -360;

  // Materials for monumental architecture
  const {
    obsidianWallMat,
    brushedTrimMat,
    reflectiveFloorMat,
    glassVaultMat,
    goldAccentMat,
    cyanConduitMat,
  } = useMemo(() => {
    return {
      obsidianWallMat: new THREE.MeshStandardMaterial({
        color: new THREE.Color('#05070d'),
        roughness: 0.28,
        metalness: 0.92,
      }),
      brushedTrimMat: new THREE.MeshStandardMaterial({
        color: new THREE.Color('#0c1322'),
        roughness: 0.2,
        metalness: 0.95,
      }),
      reflectiveFloorMat: new THREE.MeshStandardMaterial({
        color: new THREE.Color('#020409'),
        roughness: 0.1,
        metalness: 0.98,
      }),
      glassVaultMat: new THREE.MeshStandardMaterial({
        color: new THREE.Color('#0a1628'),
        roughness: 0.05,
        metalness: 0.9,
        transparent: true,
        opacity: 0.65,
      }),
      goldAccentMat: new THREE.MeshStandardMaterial({
        color: new THREE.Color('#f59e0b'),
        emissive: new THREE.Color('#f59e0b'),
        emissiveIntensity: 1.2,
        roughness: 0.2,
        metalness: 0.8,
      }),
      cyanConduitMat: new THREE.MeshBasicMaterial({
        color: new THREE.Color('#00f0ff'),
        transparent: true,
        opacity: 0.85,
      }),
    };
  }, []);

  // Floating particles in the exhibition atrium
  const particleCount = 180;
  const { particlePositions, particleColors } = useMemo(() => {
    const pos = new Float32Array(particleCount * 3);
    const col = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 36;
      pos[i * 3 + 1] = 2 + Math.random() * 26;
      pos[i * 3 + 2] = -382 + Math.random() * 50;

      const isGold = Math.random() > 0.65;
      col[i * 3] = isGold ? 0.96 : 0.2;
      col[i * 3 + 1] = isGold ? 0.65 : 0.85;
      col[i * 3 + 2] = isGold ? 0.15 : 1.0;
    }
    return { particlePositions: pos, particleColors: col };
  }, []);

  const particlesRef = useRef<THREE.Points>(null);

  // Animation and Proximity Loop
  useFrame(({ clock }, delta) => {
    const time = clock.getElapsedTime();

    // 1. Slowly rotate the floating summit crown rings
    if (crownRingRef.current) {
      crownRingRef.current.rotation.y = time * 0.18;
    }

    // 2. Pulse central light column
    if (centralCoreLightRef.current) {
      centralCoreLightRef.current.intensity = 3.5 + Math.sin(time * 2.2) * 0.8;
    }

    // 3. Proximity activation of entrance lighting as dragon approaches
    const pPos = phoenixFlightState.position;
    const distToHall = Math.hypot(pPos.x, pPos.z - HALL_Z);
    if (entranceLightRef.current) {
      const approachFactor = Math.max(0, Math.min(1, (180 - distToHall) / 120));
      entranceLightRef.current.intensity = 4.0 + approachFactor * 14.0;
    }

    // 4. Subtle floating particle drift
    if (particlesRef.current) {
      const positions = particlesRef.current.geometry.attributes.position.array as Float32Array;
      for (let i = 0; i < particleCount; i++) {
        positions[i * 3 + 1] += delta * 0.35;
        if (positions[i * 3 + 1] > 28) {
          positions[i * 3 + 1] = 2;
        }
      }
      particlesRef.current.geometry.attributes.position.needsUpdate = true;
    }
  });

  return (
    <group ref={groupRef}>
      {/* =================================================================== */}
      {/* 1. EXTERIOR MONUMENTAL ARCHITECTURE                                 */}
      {/* =================================================================== */}
      {/* Foundation Platform & Plaza (Elevation 0 to 1.5m) */}
      <mesh
        position={[0, 0.75, HALL_Z]}
        material={reflectiveFloorMat}
        receiveShadow
        castShadow
      >
        <boxGeometry args={[72, 1.5, 64]} />
      </mesh>

      {/* Flanking Monumental Wings (West Wing & East Wing) */}
      <mesh
        position={[-28, 25, HALL_Z]}
        material={obsidianWallMat}
        castShadow
        receiveShadow
      >
        <boxGeometry args={[16, 50, 58]} />
      </mesh>
      <mesh
        position={[28, 25, HALL_Z]}
        material={obsidianWallMat}
        castShadow
        receiveShadow
      >
        <boxGeometry args={[16, 50, 58]} />
      </mesh>

      {/* Recessed Vertical Neon Accent Conduits on Exterior Wings */}
      {[-35.5, -20.5, 20.5, 35.5].map((x, i) => (
        <mesh key={`ext-conduit-${i}`} position={[x, 25, HALL_Z + 29.1]}>
          <planeGeometry args={[0.16, 46]} />
          <meshBasicMaterial color="#38bdf8" />
        </mesh>
      ))}

      {/* Massive Vaulted Roof Structure over Central Atrium */}
      <mesh
        position={[0, 42, HALL_Z]}
        material={obsidianWallMat}
        castShadow
        receiveShadow
      >
        <boxGeometry args={[42, 6, 58]} />
      </mesh>

      {/* High-Altitude Glass Skylight Panes */}
      <mesh
        position={[0, 39, HALL_Z]}
        material={glassVaultMat}
        receiveShadow
      >
        <boxGeometry args={[36, 0.4, 48]} />
      </mesh>

      {/* =================================================================== */}
      {/* 2. FLOATING SUMMIT CROWN RINGS (Y = 48m to 54m)                    */}
      {/* =================================================================== */}
      <group ref={crownRingRef} position={[0, 48, HALL_Z]}>
        {/* Outer Hexagonal Ring */}
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[18, 0.45, 8, 32]} />
          <meshStandardMaterial
            color="#0f172a"
            emissive="#00f0ff"
            emissiveIntensity={1.4}
            roughness={0.2}
            metalness={0.8}
          />
        </mesh>

        {/* Inner Golden Halo Ring */}
        <mesh rotation={[Math.PI / 2, 0, Math.PI / 6]} material={goldAccentMat}>
          <torusGeometry args={[12, 0.3, 8, 32]} />
        </mesh>
      </group>

      {/* =================================================================== */}
      {/* 3. EXTERIOR ARCHITECTURAL SIGNAGE: "HALL OF FAME"                  */}
      {/* =================================================================== */}
      {/* Mounted on the monumental lintel above the entrance portal */}
      <group position={[0, 36.5, HALL_Z + 29.3]}>
        {/* Sign Backplate */}
        <mesh position={[0, 0, -0.1]} material={brushedTrimMat}>
          <boxGeometry args={[34, 7.5, 0.3]} />
        </mesh>
        <mesh position={[0, 0, -0.02]} material={cyanConduitMat}>
          <planeGeometry args={[33.6, 7.1]} />
        </mesh>
        <mesh position={[0, 0, 0.02]} material={reflectiveFloorMat}>
          <planeGeometry args={[33.2, 6.7]} />
        </mesh>

        {/* Top Header Label */}
        <Text
          position={[0, 2.2, 0.1]}
          fontSize={0.65}
          letterSpacing={0.32}
          textAlign="center"
          color="#38bdf8"
        >
          {`// ACHIEVEMENTS & CREDENTIALS ARCHIVE`}
          <meshBasicMaterial color="#38bdf8" />
        </Text>

        {/* PRIMARY SIGN: "HALL OF FAME" */}
        <Text
          position={[0, 0.5, 0.1]}
          fontSize={2.6}
          letterSpacing={0.18}
          textAlign="center"
          color="#ffffff"
        >
          {`HALL OF FAME`}
          <meshStandardMaterial
            color="#f8fafc"
            emissive="#ffffff"
            emissiveIntensity={1.6}
            roughness={0.15}
            metalness={0.9}
          />
        </Text>

        {/* Subtitle Telemetry */}
        <Text
          position={[0, -1.8, 0.1]}
          fontSize={0.52}
          letterSpacing={0.28}
          textAlign="center"
          color="#f59e0b"
        >
          {`PRATHAM LALWANI  ●  VERIFIED MILESTONES`}
          <meshBasicMaterial color="#f59e0b" />
        </Text>
      </group>

      {/* =================================================================== */}
      {/* 4. MONUMENTAL ENTRANCE PORTAL & WELCOMING LIGHTING                  */}
      {/* =================================================================== */}
      {/* Welcoming Volumetric Spotlight washing down the entrance runway */}
      <spotLight
        ref={entranceLightRef}
        position={[0, 32, HALL_Z + 24]}
        target-position={[0, 1.5, HALL_Z + 60]}
        angle={0.65}
        penumbra={0.8}
        intensity={12.0}
        color="#cffafe"
        distance={95}
        decay={2}
      />

      {/* Runway Approach Beacons along the axis leading into the entrance */}
      {[HALL_Z + 55, HALL_Z + 45, HALL_Z + 35, HALL_Z + 25].map((zPos, i) => (
        <group key={`runway-${i}`} position={[0, 1.6, zPos]}>
          <mesh position={[-14, 0, 0]}>
            <boxGeometry args={[0.3, 0.2, 3]} />
            <meshBasicMaterial color="#00f0ff" />
          </mesh>
          <mesh position={[14, 0, 0]}>
            <boxGeometry args={[0.3, 0.2, 3]} />
            <meshBasicMaterial color="#00f0ff" />
          </mesh>
        </group>
      ))}

      {/* =================================================================== */}
      {/* 5. INTERIOR EXHIBITION HALL (Spacious Vaulted Atrium)               */}
      {/* =================================================================== */}
      {/* Interior High-Gloss Reflective Floor */}
      <mesh
        position={[0, 1.55, HALL_Z]}
        rotation={[-Math.PI / 2, 0, 0]}
        material={reflectiveFloorMat}
        receiveShadow
      >
        <planeGeometry args={[38, 54]} />
      </mesh>

      {/* Central Light Column / Holographic Monument at [0, 14, -360] */}
      <group position={[0, 14, HALL_Z]}>
        {/* Core Vertical Light Pillar */}
        <mesh>
          <cylinderGeometry args={[1.2, 1.2, 24, 16]} />
          <meshStandardMaterial
            color="#38bdf8"
            emissive="#00f0ff"
            emissiveIntensity={2.0}
            transparent
            opacity={0.45}
            roughness={0.1}
          />
        </mesh>

        {/* Orbiting Golden Energy Band */}
        <mesh rotation={[Math.PI / 3, 0, 0]}>
          <torusGeometry args={[3.2, 0.12, 8, 32]} />
          <meshBasicMaterial color="#f59e0b" />
        </mesh>

        {/* Central Core Point Light */}
        <pointLight
          ref={centralCoreLightRef}
          color="#38bdf8"
          intensity={4.5}
          distance={45}
          decay={2}
        />

        {/* Central Holographic Typography */}
        <Text
          position={[0, 4.5, 2.2]}
          fontSize={0.65}
          letterSpacing={0.22}
          textAlign="center"
          color="#ffffff"
        >
          {`PRATHAM LALWANI`}
          <meshStandardMaterial
            color="#ffffff"
            emissive="#38bdf8"
            emissiveIntensity={1.4}
          />
        </Text>

        <Text
          position={[0, 3.2, 2.2]}
          fontSize={0.42}
          letterSpacing={0.26}
          textAlign="center"
          color="#f59e0b"
        >
          {`ACHIEVEMENTS\n// CERTIFICATIONS\n// MILESTONES`}
          <meshBasicMaterial color="#f59e0b" />
        </Text>
      </group>

      {/* =================================================================== */}
      {/* 6. PHYSICAL CERTIFICATION DISPLAYS IN THE EXHIBITION HALL          */}
      {/* =================================================================== */}
      {CERTIFICATIONS_DATA.map((cert) => {
        const isHovered = hoveredCertId === cert.id;

        return (
          <group
            key={cert.id}
            position={cert.position}
            rotation={[0, cert.rotationY, 0]}
            onClick={(e) => {
              e.stopPropagation();
              onSelectCertification(cert);
            }}
            onPointerOver={(e) => {
              e.stopPropagation();
              setHoveredCertId(cert.id);
              document.body.style.cursor = 'pointer';
            }}
            onPointerOut={() => {
              setHoveredCertId(null);
              document.body.style.cursor = 'default';
            }}
          >
            {/* Architectural Display Pedestal Base */}
            <mesh position={[0, -5.5, 0]} material={brushedTrimMat} castShadow>
              <boxGeometry args={[7.2, 7.5, 1.2]} />
            </mesh>

            {/* Glowing Accent Conduits on Pedestal Base */}
            <mesh position={[0, -2.0, 0.62]}>
              <planeGeometry args={[6.8, 0.08]} />
              <meshBasicMaterial color={cert.accentColor} />
            </mesh>

            {/* The Certificate Display Screen Frame */}
            <mesh position={[0, 0, 0]} material={obsidianWallMat} castShadow>
              <boxGeometry args={[8.8, 5.8, 0.4]} />
            </mesh>

            {/* Outer Holographic Border */}
            <mesh position={[0, 0, 0.22]}>
              <planeGeometry args={[8.6, 5.6]} />
              <meshBasicMaterial
                color={cert.accentColor}
                transparent
                opacity={isHovered ? 0.95 : 0.45}
              />
            </mesh>

            {/* Screen Glass Face */}
            <mesh position={[0, 0, 0.24]} material={reflectiveFloorMat}>
              <planeGeometry args={[8.4, 5.4]} />
            </mesh>

            {/* Certificate Header Badge */}
            <Text
              position={[-3.6, 2.0, 0.28]}
              fontSize={0.24}
              letterSpacing={0.22}
              textAlign="left"
              anchorX="left"
              color={cert.accentColor}
            >
              {`// ${cert.badge}`}
              <meshBasicMaterial color={cert.accentColor} />
            </Text>

            {/* Certificate Title */}
            <Text
              position={[-3.6, 1.2, 0.28]}
              fontSize={0.44}
              maxWidth={7.2}
              lineHeight={1.1}
              letterSpacing={0.04}
              textAlign="left"
              anchorX="left"
              color="#ffffff"
            >
              {cert.title}
              <meshStandardMaterial
                color="#ffffff"
                emissive={cert.accentColor}
                emissiveIntensity={isHovered ? 1.5 : 0.8}
              />
            </Text>

            {/* Issuer & Year */}
            <Text
              position={[-3.6, 0.1, 0.28]}
              fontSize={0.32}
              letterSpacing={0.12}
              textAlign="left"
              anchorX="left"
              color="#94a3b8"
            >
              {`ISSUED BY ${cert.issuer.toUpperCase()}`}
              <meshBasicMaterial color="#94a3b8" />
            </Text>

            <Text
              position={[-3.6, -0.5, 0.28]}
              fontSize={0.28}
              letterSpacing={0.18}
              textAlign="left"
              anchorX="left"
              color="#f59e0b"
            >
              {`DATE // ${cert.date}`}
              <meshBasicMaterial color="#f59e0b" />
            </Text>

            {/* Interactive Prompt Cue */}
            <Text
              position={[0, -1.8, 0.28]}
              fontSize={0.26}
              letterSpacing={0.22}
              textAlign="center"
              color={isHovered ? '#00f0ff' : 'rgba(148, 163, 184, 0.65)'}
            >
              {isHovered ? `[ CLICK TO INSPECT DOSSIER ]` : `[ SELECT TO VIEW ]`}
              <meshBasicMaterial color={isHovered ? '#00f0ff' : '#94a3b8'} />
            </Text>

            {/* Proximity Facade Light on each display */}
            <pointLight
              position={[0, 0, 2.2]}
              color={cert.accentColor}
              intensity={isHovered ? 3.0 : 1.2}
              distance={12}
              decay={2}
            />
          </group>
        );
      })}

      {/* =================================================================== */}
      {/* 7. REAR OBSERVATION DECK & FINAL PANORAMIC CITY VISTA                */}
      {/* =================================================================== */}
      {/* Cantilevered Observation Terrace at Z = -388 to -398 */}
      <mesh
        position={[0, 1.5, -394]}
        material={reflectiveFloorMat}
        receiveShadow
      >
        <boxGeometry args={[34, 1.2, 16]} />
      </mesh>

      {/* Transparent Glass Observation Balustrade */}
      <mesh position={[0, 3.2, -401]} material={glassVaultMat}>
        <boxGeometry args={[33, 2.4, 0.2]} />
      </mesh>
      <mesh position={[-16.5, 3.2, -394]} material={glassVaultMat}>
        <boxGeometry args={[0.2, 2.4, 14]} />
      </mesh>
      <mesh position={[16.5, 3.2, -394]} material={glassVaultMat}>
        <boxGeometry args={[0.2, 2.4, 14]} />
      </mesh>

      {/* Glowing Handrail Top Trim */}
      <mesh position={[0, 4.45, -401]}>
        <boxGeometry args={[33.2, 0.1, 0.3]} />
        <meshBasicMaterial color="#38bdf8" />
      </mesh>

      {/* Floor Plaque / Inscription on Observation Deck */}
      <Text
        position={[0, 2.15, -394]}
        rotation={[-Math.PI / 2, 0, 0]}
        fontSize={0.42}
        letterSpacing={0.24}
        textAlign="center"
        color="#38bdf8"
      >
        {`// OBSERVATION DECK  ●  END OF SECTOR  ●  METROPOLIS IN SIGHT`}
        <meshBasicMaterial color="#38bdf8" />
      </Text>

      {/* Guidance Arrow pointing back toward the city */}
      <Text
        position={[0, 2.15, -390]}
        rotation={[-Math.PI / 2, 0, 0]}
        fontSize={0.32}
        letterSpacing={0.28}
        textAlign="center"
        color="#f59e0b"
      >
        {`▲  LOOK BACK: COMPLETE CITY PANORAMA  ▲`}
        <meshBasicMaterial color="#f59e0b" />
      </Text>

      {/* =================================================================== */}
      {/* 8. ATRIUM AMBIENT PARTICLES                                         */}
      {/* =================================================================== */}
      <points ref={particlesRef}>
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
          size={0.12}
          vertexColors
          transparent
          opacity={0.45}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </points>
    </group>
  );
};
