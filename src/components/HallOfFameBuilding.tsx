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

  // Load the authentic Google Cybersecurity certificate textures
  const certTextures = useMemo(() => {
    const loader = new THREE.TextureLoader();
    const tex1 = loader.load('/certificates/google-foundations-cybersecurity.jpeg');
    const tex2 = loader.load('/certificates/google-play-it-safe-security-risks.jpeg');

    [tex1, tex2].forEach((tex) => {
      tex.colorSpace = THREE.SRGBColorSpace;
      tex.minFilter = THREE.LinearFilter;
      tex.magFilter = THREE.LinearFilter;
    });

    return {
      'google-cybersecurity-foundations': tex1,
      'google-play-it-safe-security-risks': tex2,
    };
  }, []);

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

  // Primary Google Cybersecurity Certificates
  const primaryCerts = useMemo(() => {
    return CERTIFICATIONS_DATA.filter((c) =>
      c.id.startsWith('google-cybersecurity') || c.id.startsWith('google-play')
    );
  }, []);

  // Secondary milestone credentials
  const secondaryCerts = useMemo(() => {
    return CERTIFICATIONS_DATA.filter(
      (c) => !c.id.startsWith('google-cybersecurity') && !c.id.startsWith('google-play')
    );
  }, []);

  return (
    <group ref={groupRef} position={[0, 0, HOARDING_Z]}>
      {/* =================================================================== */}
      {/* 1. GROUND FOUNDATION & MASSIVE INDUSTRIAL PLINTHS                   */}
      {/* =================================================================== */}
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

      {/* Horizontal Heavy Girders */}
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

      {/* Cantilever Back-Stays */}
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
      <mesh position={[0, 24, -0.6]} material={darkHousingMat} castShadow>
        <boxGeometry args={[66, 31, 2.2]} />
      </mesh>

      <mesh position={[0, 24, 0.52]} material={screenFaceMat}>
        <planeGeometry args={[64.8, 29.8]} />
      </mesh>

      {/* Architectural Matte Edge Trim (Zero Glare) */}
      <mesh position={[0, 38.95, 0.55]} material={frameTrimMat}>
        <boxGeometry args={[65.2, 0.35, 0.35]} />
      </mesh>
      <mesh position={[0, 9.05, 0.55]} material={frameTrimMat}>
        <boxGeometry args={[65.2, 0.35, 0.35]} />
      </mesh>
      <mesh position={[-32.45, 24, 0.55]} material={frameTrimMat}>
        <boxGeometry args={[0.35, 30.1, 0.35]} />
      </mesh>
      <mesh position={[32.45, 24, 0.55]} material={frameTrimMat}>
        <boxGeometry args={[0.35, 30.1, 0.35]} />
      </mesh>

      {/* Lower Walkway (beneath hoarding screen at Y = 8.8m) */}
      <group position={[0, 8.8, 1.8]}>
        <mesh material={steelTrussMat}>
          <boxGeometry args={[66, 0.35, 3.2]} />
        </mesh>
        <mesh position={[0, 1.1, 1.55]} material={steelTrussMat}>
          <boxGeometry args={[66, 0.1, 0.1]} />
        </mesh>
        {[-30, -22, -14, -6, 2, 10, 18, 26, 30].map((rx) => (
          <mesh key={`lower-stanchion-${rx}`} position={[rx, 0.6, 1.55]} material={steelTrussMat}>
            <boxGeometry args={[0.08, 1.2, 0.08]} />
          </mesh>
        ))}
      </group>

      {/* =================================================================== */}
      {/* 4. HOARDING BRANDING, TELEMETRY & TYPOGRAPHY                        */}
      {/* =================================================================== */}
      {/* Top Header Protocol Bar */}
      <group position={[0, 37.2, 0.6]}>
        <Text
          position={[-29.5, 0, 0]}
          fontSize={0.48}
          letterSpacing={0.24}
          anchorX="left"
          textAlign="left"
          color="#38bdf8"
        >
          {`// PRATHAM LALWANI  ●  VERIFIED CREDENTIALS ARCHIVE`}
          <meshBasicMaterial color="#38bdf8" />
        </Text>

        <Text
          position={[29.5, 0, 0]}
          fontSize={0.44}
          letterSpacing={0.22}
          anchorX="right"
          textAlign="right"
          color="#10b981"
        >
          {`GOOGLE CERTIFIED  ●  ONLINE [200 OK]`}
          <meshBasicMaterial color="#10b981" />
        </Text>

        <mesh position={[0, -0.55, 0]}>
          <planeGeometry args={[60.0, 0.05]} />
          <meshBasicMaterial color="#1e293b" />
        </mesh>
      </group>

      {/* MONUMENTAL HOARDING HEADLINE: "HALL OF FAME" */}
      <group position={[0, 34.6, 0.6]}>
        <Text
          position={[0, 0, 0]}
          fontSize={2.1}
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
          position={[0, -1.35, 0]}
          fontSize={0.42}
          letterSpacing={0.24}
          textAlign="center"
          color="#38bdf8"
        >
          {`OFFICIAL GOOGLE CYBERSECURITY CERTIFICATIONS & VERIFIED MILESTONES`}
          <meshBasicMaterial color="#38bdf8" />
        </Text>
      </group>

      {/* =================================================================== */}
      {/* 5. DISPLAY OF PRATHAM'S 2 AUTHENTIC GOOGLE CYBERSECURITY CERTS     */}
      {/* =================================================================== */}
      {primaryCerts.map((cert, index) => {
        const isHovered = hoveredCertId === cert.id;
        const xPos = index === 0 ? -15.8 : 15.8;
        const yPos = 23.0;
        const tex = certTextures[cert.id as keyof typeof certTextures];

        return (
          <group
            key={cert.id}
            position={[xPos, yPos, 0.62]}
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
            {/* Background Card Base Frame */}
            <mesh position={[0, 0, -0.04]} material={darkHousingMat}>
              <boxGeometry args={[26.4, 16.8, 0.15]} />
            </mesh>

            {/* Subtle Non-Glare Tech Border */}
            <mesh position={[0, 0, 0.01]}>
              <planeGeometry args={[26.1, 16.5]} />
              <meshBasicMaterial
                color={cert.accentColor}
                transparent
                opacity={isHovered ? 0.85 : 0.35}
              />
            </mesh>

            {/* Top Badge Strip */}
            <Text
              position={[-12.0, 7.6, 0.06]}
              fontSize={0.32}
              letterSpacing={0.22}
              anchorX="left"
              color={cert.accentColor}
            >
              {`// ${cert.badge}  ●  AUTHORIZED BY GOOGLE`}
              <meshBasicMaterial color={cert.accentColor} />
            </Text>

            <Text
              position={[12.0, 7.6, 0.06]}
              fontSize={0.28}
              letterSpacing={0.16}
              anchorX="right"
              color="#f59e0b"
            >
              {cert.date}
              <meshBasicMaterial color="#f59e0b" />
            </Text>

            {/* THE ACTUAL GOOGLE CERTIFICATE IMAGE */}
            <mesh position={[0, 0.6, 0.05]}>
              <planeGeometry args={[24.6, 12.2]} />
              {tex ? (
                <meshBasicMaterial
                  map={tex}
                  color="#738296"
                  toneMapped={true}
                />
              ) : (
                <meshBasicMaterial color="#0f172a" />
              )}
            </mesh>

            {/* Certificate Title & ID Plaque Bar */}
            <group position={[0, -6.6, 0.06]}>
              <mesh position={[0, 0, -0.01]} material={darkHousingMat}>
                <planeGeometry args={[24.6, 1.6]} />
              </mesh>

              <Text
                position={[-11.6, 0.32, 0.02]}
                fontSize={0.34}
                letterSpacing={0.06}
                anchorX="left"
                color="#f8fafc"
              >
                {cert.title}
                <meshBasicMaterial color="#f8fafc" />
              </Text>

              <Text
                position={[-11.6, -0.32, 0.02]}
                fontSize={0.26}
                letterSpacing={0.14}
                anchorX="left"
                color="#94a3b8"
              >
                {`ID: ${cert.credentialId}  ●  COURSERA VERIFIED`}
                <meshBasicMaterial color="#94a3b8" />
              </Text>

              <Text
                position={[11.6, 0, 0.02]}
                fontSize={0.28}
                letterSpacing={0.18}
                anchorX="right"
                color={isHovered ? '#38bdf8' : '#64748b'}
              >
                {isHovered ? `[ CLICK TO INSPECT DOSSIER ]` : `[ VIEW CERTIFICATE ]`}
                <meshBasicMaterial color={isHovered ? '#38bdf8' : '#64748b'} />
              </Text>
            </group>
          </group>
        );
      })}

      {/* =================================================================== */}
      {/* 6. SECONDARY ENGINEERING MILESTONES (LOWER SECTION)                 */}
      {/* =================================================================== */}
      <group position={[0, 12.6, 0.6]}>
        {secondaryCerts.map((cert, index) => {
          const isHovered = hoveredCertId === cert.id;
          const xPos = (index - 1) * 20.4;

          return (
            <group
              key={cert.id}
              position={[xPos, 0, 0]}
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
              <mesh position={[0, 0, -0.02]} material={darkHousingMat}>
                <boxGeometry args={[19.2, 2.8, 0.1]} />
              </mesh>
              <mesh position={[0, 0, 0.01]}>
                <planeGeometry args={[19.0, 2.6]} />
                <meshBasicMaterial
                  color={cert.accentColor}
                  transparent
                  opacity={isHovered ? 0.75 : 0.25}
                />
              </mesh>

              <Text
                position={[-8.8, 0.6, 0.03]}
                fontSize={0.24}
                letterSpacing={0.2}
                anchorX="left"
                color={cert.accentColor}
              >
                {`// ${cert.badge}`}
                <meshBasicMaterial color={cert.accentColor} />
              </Text>

              <Text
                position={[-8.8, -0.2, 0.03]}
                fontSize={0.36}
                maxWidth={14}
                letterSpacing={0.04}
                anchorX="left"
                color="#ffffff"
              >
                {cert.title}
                <meshBasicMaterial color="#ffffff" />
              </Text>

              <Text
                position={[8.8, -0.2, 0.03]}
                fontSize={0.24}
                letterSpacing={0.16}
                anchorX="right"
                color={isHovered ? '#ffffff' : '#64748b'}
              >
                {isHovered ? `[ INSPECT ]` : `[ VIEW ]`}
                <meshBasicMaterial color={isHovered ? '#ffffff' : '#64748b'} />
              </Text>
            </group>
          );
        })}
      </group>

      {/* =================================================================== */}
      {/* 7. BOTTOM TICKER FOOTER BAR                                         */}
      {/* =================================================================== */}
      <group position={[0, 9.8, 0.6]}>
        <Text
          position={[0, 0, 0]}
          fontSize={0.32}
          letterSpacing={0.24}
          textAlign="center"
          color="#38bdf8"
        >
          {`// PRATHAM LALWANI  ●  GOOGLE CYBERSECURITY SPECIALIZATION  ●  ENTERPRISE RISK MANAGEMENT & ARCHITECTURE`}
          <meshBasicMaterial color="#38bdf8" />
        </Text>
      </group>
    </group>
  );
};
