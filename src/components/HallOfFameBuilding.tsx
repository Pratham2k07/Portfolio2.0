import React, { useMemo, useRef, useState } from 'react';
import * as THREE from 'three';
import { Text } from '@react-three/drei';
import { CERTIFICATIONS_DATA, type CertificationItem } from '../data/certificationsData';

interface HallOfFameBuildingProps {
  onSelectCertification: (cert: CertificationItem) => void;
}

export const HallOfFameBuilding: React.FC<HallOfFameBuildingProps> = ({
  onSelectCertification,
}) => {
  const groupRef = useRef<THREE.Group>(null);
  const [hoveredCertId, setHoveredCertId] = useState<string | null>(null);

  // Position of the Monumental Hoarding at the end of the city
  const HOARDING_Z = -360;

  // Steel & industrial materials for authentic cyberpunk hoarding scaffolding
  const {
    steelTrussMat,
    darkHousingMat,
    screenFaceMat,
    frameTrimMat,
    concretePlinthMat,
  } = useMemo(() => {
    return {
      steelTrussMat: new THREE.MeshStandardMaterial({
        color: new THREE.Color('#141c2b'),
        roughness: 0.45,
        metalness: 0.85,
      }),
      darkHousingMat: new THREE.MeshStandardMaterial({
        color: new THREE.Color('#070b14'),
        roughness: 0.55,
        metalness: 0.8,
      }),
      screenFaceMat: new THREE.MeshStandardMaterial({
        color: new THREE.Color('#040711'),
        roughness: 0.25,
        metalness: 0.9,
      }),
      frameTrimMat: new THREE.MeshStandardMaterial({
        color: new THREE.Color('#1e293b'),
        roughness: 0.4,
        metalness: 0.85,
      }),
      concretePlinthMat: new THREE.MeshStandardMaterial({
        color: new THREE.Color('#0d1117'),
        roughness: 0.85,
        metalness: 0.2,
      }),
    };
  }, []);

  // Map the 5 certification items to layout slots on the hoarding face
  const certSlots = useMemo(() => {
    const slots: Record<string, { x: number; y: number; width: number; height: number }> = {
      'google-cybersecurity': { x: -19.5, y: 22.8, width: 18.2, height: 6.2 },
      'fullstack-web-architecture': { x: 0, y: 22.8, width: 18.2, height: 6.2 },
      'threejs-webgl-creative-tech': { x: 19.5, y: 22.8, width: 18.2, height: 6.2 },
      'dsa-algorithmic-problem-solving': { x: -11, y: 15.2, width: 18.8, height: 6.0 },
      'cloud-infrastructure-devops': { x: 11, y: 15.2, width: 18.8, height: 6.0 },
    };

    return CERTIFICATIONS_DATA.map((cert) => ({
      ...cert,
      slot: slots[cert.id] || { x: 0, y: 15, width: 18, height: 6 },
    }));
  }, []);

  return (
    <group ref={groupRef} position={[0, 0, HOARDING_Z]}>
      {/* =================================================================== */}
      {/* 1. GROUND FOUNDATION & MASSIVE INDUSTRIAL PLINTHS                   */}
      {/* =================================================================== */}
      {/* Plaza Foundation Platform */}
      <mesh position={[0, 0.5, 0]} material={concretePlinthMat} receiveShadow>
        <boxGeometry args={[76, 1.0, 36]} />
      </mesh>

      {/* 4 Heavy Structural Pylon Bases */}
      {[-28, -10, 10, 28].map((xPos) => (
        <group key={`plinth-${xPos}`} position={[xPos, 2.0, -1]}>
          <mesh material={concretePlinthMat} castShadow receiveShadow>
            <boxGeometry args={[4.8, 3.2, 4.8]} />
          </mesh>
          <mesh position={[0, 1.65, 0]} material={steelTrussMat}>
            <boxGeometry args={[3.8, 0.4, 3.8]} />
          </mesh>
        </group>
      ))}

      {/* =================================================================== */}
      {/* 2. HEAVY STEEL TRUSS SCAFFOLDING & VERTICAL COLUMNS                 */}
      {/* =================================================================== */}
      {/* 4 Main Vertical Steel Support Columns rising to Y = 44m */}
      {[-28, -10, 10, 28].map((xPos) => (
        <group key={`column-${xPos}`} position={[xPos, 22, -1]}>
          <mesh material={steelTrussMat} castShadow>
            <boxGeometry args={[2.2, 40, 2.2]} />
          </mesh>
          <mesh position={[0, 0, 1.2]} material={steelTrussMat}>
            <boxGeometry args={[2.6, 40, 0.3]} />
          </mesh>
          <mesh position={[0, 0, -1.2]} material={steelTrussMat}>
            <boxGeometry args={[2.6, 40, 0.3]} />
          </mesh>
        </group>
      ))}

      {/* Diagonal Rear Cross-Bracing Lattice behind the billboard screen */}
      {[
        { x: -19, y: 15, rot: 0.58 },
        { x: -19, y: 15, rot: -0.58 },
        { x: 0, y: 15, rot: 0.58 },
        { x: 0, y: 15, rot: -0.58 },
        { x: 19, y: 15, rot: 0.58 },
        { x: 19, y: 15, rot: -0.58 },
        { x: -19, y: 28, rot: 0.58 },
        { x: -19, y: 28, rot: -0.58 },
        { x: 0, y: 28, rot: 0.58 },
        { x: 0, y: 28, rot: -0.58 },
        { x: 19, y: 28, rot: 0.58 },
        { x: 19, y: 28, rot: -0.58 },
      ].map((brace, i) => (
        <mesh
          key={`rear-brace-${i}`}
          position={[brace.x, brace.y, -2.4]}
          rotation={[0, 0, brace.rot]}
          material={steelTrussMat}
        >
          <boxGeometry args={[0.7, 22, 0.7]} />
        </mesh>
      ))}

      {/* Horizontal Heavy Girders Spanning across all columns */}
      {[10, 24, 38, 42].map((yLevel) => (
        <mesh
          key={`girder-${yLevel}`}
          position={[0, yLevel, -1.8]}
          material={steelTrussMat}
          castShadow
        >
          <boxGeometry args={[66, 1.4, 1.4]} />
        </mesh>
      ))}

      {/* Cantilever Back-Stays anchoring the structure into the rear foundation */}
      {[-24, -8, 8, 24].map((xPos) => (
        <mesh
          key={`back-stay-${xPos}`}
          position={[xPos, 14, -8]}
          rotation={[0.62, 0, 0]}
          material={steelTrussMat}
        >
          <boxGeometry args={[0.9, 28, 0.9]} />
        </mesh>
      ))}

      {/* =================================================================== */}
      {/* 3. MONUMENTAL BILLBOARD / HOARDING MAIN HOUSING & SCREEN            */}
      {/* =================================================================== */}
      {/* Heavy Steel Rear Enclosure Box */}
      <mesh position={[0, 24, -0.6]} material={darkHousingMat} castShadow>
        <boxGeometry args={[64, 30, 2.2]} />
      </mesh>

      {/* High-Gloss Digital Screen Face */}
      <mesh position={[0, 24, 0.52]} material={screenFaceMat}>
        <planeGeometry args={[62.8, 28.8]} />
      </mesh>

      {/* Architectural Matte Edge Trim (Zero Glare) */}
      <mesh position={[0, 38.45, 0.55]} material={frameTrimMat}>
        <boxGeometry args={[63.2, 0.35, 0.35]} />
      </mesh>
      <mesh position={[0, 9.55, 0.55]} material={frameTrimMat}>
        <boxGeometry args={[63.2, 0.35, 0.35]} />
      </mesh>
      <mesh position={[-31.45, 24, 0.55]} material={frameTrimMat}>
        <boxGeometry args={[0.35, 29.1, 0.35]} />
      </mesh>
      <mesh position={[31.45, 24, 0.55]} material={frameTrimMat}>
        <boxGeometry args={[0.35, 29.1, 0.35]} />
      </mesh>

      {/* =================================================================== */}
      {/* 4. LOWER & UPPER MAINTENANCE CATWALKS WITH SAFETY RAILINGS          */}
      {/* =================================================================== */}
      {/* Lower Walkway (beneath hoarding screen at Y = 9.2m) */}
      <group position={[0, 9.2, 1.8]}>
        <mesh material={steelTrussMat}>
          <boxGeometry args={[64, 0.35, 3.2]} />
        </mesh>
        {/* Front Safety Railing */}
        <mesh position={[0, 1.1, 1.55]} material={steelTrussMat}>
          <boxGeometry args={[64, 0.1, 0.1]} />
        </mesh>
        {/* Vertical Railing Stanchions */}
        {[-30, -22, -14, -6, 2, 10, 18, 26, 30].map((rx) => (
          <mesh key={`lower-stanchion-${rx}`} position={[rx, 0.6, 1.55]} material={steelTrussMat}>
            <boxGeometry args={[0.08, 1.2, 0.08]} />
          </mesh>
        ))}
      </group>

      {/* Upper Service Walkway (above hoarding screen at Y = 38.6m) */}
      <group position={[0, 38.6, 1.6]}>
        <mesh material={steelTrussMat}>
          <boxGeometry args={[64, 0.35, 2.8]} />
        </mesh>
        <mesh position={[0, 1.0, 1.35]} material={steelTrussMat}>
          <boxGeometry args={[64, 0.1, 0.1]} />
        </mesh>
      </group>

      {/* =================================================================== */}
      {/* 5. HOARDING BRANDING, TELEMETRY & TYPOGRAPHY                        */}
      {/* =================================================================== */}
      {/* Top Header Protocol Bar */}
      <group position={[0, 36.2, 0.6]}>
        <Text
          position={[-28.5, 0, 0]}
          fontSize={0.52}
          letterSpacing={0.24}
          anchorX="left"
          textAlign="left"
          color="#38bdf8"
        >
          {`// PRATHAM LALWANI  ●  VERIFIED CREDENTIALS ARCHIVE`}
          <meshBasicMaterial color="#38bdf8" />
        </Text>

        <Text
          position={[28.5, 0, 0]}
          fontSize={0.48}
          letterSpacing={0.22}
          anchorX="right"
          textAlign="right"
          color="#10b981"
        >
          {`STATUS: SYNCHRONIZED [200 OK]`}
          <meshBasicMaterial color="#10b981" />
        </Text>

        {/* Fine Separator Line */}
        <mesh position={[0, -0.65, 0]}>
          <planeGeometry args={[57.4, 0.05]} />
          <meshBasicMaterial color="#1e293b" />
        </mesh>
      </group>

      {/* MONUMENTAL HOARDING HEADLINE: "HALL OF FAME" */}
      <group position={[0, 33.2, 0.6]}>
        <Text
          position={[0, 0, 0]}
          fontSize={2.3}
          letterSpacing={0.16}
          textAlign="center"
          color="#f8fafc"
        >
          {`HALL OF FAME`}
          <meshStandardMaterial
            color="#f8fafc"
            roughness={0.4}
            metalness={0.2}
          />
        </Text>

        <Text
          position={[0, -1.45, 0]}
          fontSize={0.48}
          letterSpacing={0.28}
          textAlign="center"
          color="#f59e0b"
        >
          {`OFFICIAL CERTIFICATIONS  ·  ARCHITECTURAL MILESTONES  ·  OPEN SOURCE IMPACT`}
          <meshBasicMaterial color="#f59e0b" />
        </Text>
      </group>

      {/* TELEMETRY METRIC CHIPS BAR */}
      <group position={[0, 29.2, 0.6]}>
        {[
          { label: 'GLOBAL STARS', val: '★ 1.8K+', col: '#f59e0b', x: -21 },
          { label: 'GIT COMMITS', val: '450+ COMMITS', col: '#38bdf8', x: -7 },
          { label: 'REPOSITORIES', val: '24 REPOS', col: '#ec4899', x: 7 },
          { label: 'UPTIME & IMPACT', val: '99.9%', col: '#10b981', x: 21 },
        ].map((m, i) => (
          <group key={`chip-${i}`} position={[m.x, 0, 0]}>
            {/* Background pill */}
            <mesh position={[0, 0, -0.02]} material={darkHousingMat}>
              <boxGeometry args={[12.8, 1.8, 0.1]} />
            </mesh>
            {/* Thin edge border */}
            <mesh position={[0, 0, 0.01]}>
              <planeGeometry args={[12.6, 1.6]} />
              <meshBasicMaterial color={m.col} transparent opacity={0.25} />
            </mesh>
            {/* Metric Label */}
            <Text
              position={[-5.8, 0.35, 0.05]}
              fontSize={0.26}
              letterSpacing={0.18}
              anchorX="left"
              color="#94a3b8"
            >
              {m.label}
              <meshBasicMaterial color="#94a3b8" />
            </Text>
            {/* Metric Value */}
            <Text
              position={[-5.8, -0.32, 0.05]}
              fontSize={0.46}
              letterSpacing={0.12}
              anchorX="left"
              color={m.col}
            >
              {m.val}
              <meshBasicMaterial color={m.col} />
            </Text>
          </group>
        ))}
      </group>

      {/* =================================================================== */}
      {/* 6. INTERACTIVE CERTIFICATION PANELS DIRECTLY ON THE HOARDING        */}
      {/* =================================================================== */}
      {certSlots.map((cert) => {
        const isHovered = hoveredCertId === cert.id;
        const { x, y, width, height } = cert.slot;

        return (
          <group
            key={cert.id}
            position={[x, y, 0.62]}
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
            {/* Background Card Base */}
            <mesh position={[0, 0, -0.04]} material={darkHousingMat}>
              <boxGeometry args={[width, height, 0.12]} />
            </mesh>

            {/* Accent Border (Crisp & Non-Blown) */}
            <mesh position={[0, 0, 0.01]}>
              <planeGeometry args={[width - 0.2, height - 0.2]} />
              <meshBasicMaterial
                color={cert.accentColor}
                transparent
                opacity={isHovered ? 0.85 : 0.35}
              />
            </mesh>

            {/* Inner Dark Surface */}
            <mesh position={[0, 0, 0.03]} material={screenFaceMat}>
              <planeGeometry args={[width - 0.6, height - 0.6]} />
            </mesh>

            {/* Corner Bracket Accents */}
            <mesh position={[-width / 2 + 0.5, height / 2 - 0.5, 0.05]}>
              <planeGeometry args={[0.6, 0.08]} />
              <meshBasicMaterial color={cert.accentColor} />
            </mesh>
            <mesh position={[-width / 2 + 0.5, height / 2 - 0.5, 0.05]}>
              <planeGeometry args={[0.08, 0.6]} />
              <meshBasicMaterial color={cert.accentColor} />
            </mesh>

            {/* Category Badge Header */}
            <Text
              position={[-width / 2 + 0.8, height / 2 - 0.85, 0.06]}
              fontSize={0.24}
              letterSpacing={0.22}
              anchorX="left"
              color={cert.accentColor}
            >
              {`// ${cert.badge}`}
              <meshBasicMaterial color={cert.accentColor} />
            </Text>

            {/* Date Tag */}
            <Text
              position={[width / 2 - 0.8, height / 2 - 0.85, 0.06]}
              fontSize={0.24}
              letterSpacing={0.16}
              anchorX="right"
              color="#f59e0b"
            >
              {cert.date}
              <meshBasicMaterial color="#f59e0b" />
            </Text>

            {/* Certificate Title */}
            <Text
              position={[-width / 2 + 0.8, height / 2 - 1.85, 0.06]}
              fontSize={0.42}
              maxWidth={width - 1.6}
              lineHeight={1.12}
              letterSpacing={0.03}
              anchorX="left"
              color="#ffffff"
            >
              {cert.title}
              <meshBasicMaterial color="#ffffff" />
            </Text>

            {/* Issuer Information */}
            <Text
              position={[-width / 2 + 0.8, height / 2 - 3.25, 0.06]}
              fontSize={0.28}
              letterSpacing={0.12}
              anchorX="left"
              color="#94a3b8"
            >
              {`ISSUED BY ${cert.issuer.toUpperCase()}`}
              <meshBasicMaterial color="#94a3b8" />
            </Text>

            {/* Interactive Inspection Cue Button */}
            <group position={[0, -height / 2 + 0.9, 0.06]}>
              <mesh position={[0, 0, -0.01]}>
                <planeGeometry args={[width - 1.6, 0.7]} />
                <meshBasicMaterial
                  color={isHovered ? cert.accentColor : '#0f172a'}
                  transparent
                  opacity={isHovered ? 0.35 : 0.8}
                />
              </mesh>
              <Text
                position={[0, 0, 0.02]}
                fontSize={0.24}
                letterSpacing={0.24}
                textAlign="center"
                color={isHovered ? '#ffffff' : cert.accentColor}
              >
                {isHovered ? `[ CLICK TO INSPECT FULL DOSSIER ]` : `[ SELECT TO VIEW ]`}
                <meshBasicMaterial color={isHovered ? '#ffffff' : cert.accentColor} />
              </Text>
            </group>
          </group>
        );
      })}

      {/* =================================================================== */}
      {/* 7. BOTTOM TICKER FOOTER BAR                                         */}
      {/* =================================================================== */}
      <group position={[0, 10.4, 0.6]}>
        <Text
          position={[0, 0, 0]}
          fontSize={0.34}
          letterSpacing={0.26}
          textAlign="center"
          color="#38bdf8"
        >
          {`// FULL-STACK ARCHITECTURE  ·  CYBERSECURITY  ·  ALGORITHMS  ·  REAL-TIME 3D GRAPHICS  ·  PRODUCTION REPOSITORIES`}
          <meshBasicMaterial color="#38bdf8" />
        </Text>
      </group>
    </group>
  );
};
