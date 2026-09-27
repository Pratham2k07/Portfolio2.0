import React, { useMemo, useRef, useState } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { Text } from '@react-three/drei';
import { CERTIFICATIONS_DATA, type CertificationItem } from '../data/certificationsData';
import { TECH_CATEGORIES_DATA, type TechItem } from '../data/techStackData';
import { phoenixFlightState } from '../flight/phoenixFlightStore';

interface HallOfFameBuildingProps {
  onSelectCertification: (cert: CertificationItem) => void;
}

export const HallOfFameBuilding: React.FC<HallOfFameBuildingProps> = ({
  onSelectCertification,
}) => {
  const groupRef = useRef<THREE.Group>(null);

  // Interaction states
  const [hoveredCertId, setHoveredCertId] = useState<string | null>(null);
  const [hoveredTechId, setHoveredTechId] = useState<string | null>(null);
  const [selectedTech, setSelectedTech] = useState<TechItem | null>(null);
  const [hoveredSocial, setHoveredSocial] = useState<'github' | 'linkedin' | null>(null);
  const [hoveredInscriptionLink, setHoveredInscriptionLink] = useState<'github' | 'linkedin' | null>(null);

  // Architectural lights references
  const techGlowLightRef = useRef<THREE.PointLight>(null);
  const socialGlowLightRef = useRef<THREE.PointLight>(null);
  const ambientHoardingLightRef = useRef<THREE.PointLight>(null);

  // Position of the Monumental Hoarding at the end of the city
  const HOARDING_Z = -360;

  // Social Profile URLs
  const GITHUB_URL = 'https://github.com/Pratham2k07';
  const LINKEDIN_URL = 'https://www.linkedin.com/in/pratham2k07';

  const handleOpenLink = (url: string) => {
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  // Load authentic Google Cybersecurity certificate textures
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

  // Premium Architectural Cyberpunk Materials
  const materials = useMemo(() => {
    return {
      steelTruss: new THREE.MeshStandardMaterial({
        color: new THREE.Color('#141c2b'),
        roughness: 0.45,
        metalness: 0.85,
      }),
      darkHousing: new THREE.MeshStandardMaterial({
        color: new THREE.Color('#070b14'),
        roughness: 0.55,
        metalness: 0.8,
      }),
      screenFace: new THREE.MeshStandardMaterial({
        color: new THREE.Color('#040711'),
        roughness: 0.25,
        metalness: 0.9,
      }),
      frameTrim: new THREE.MeshStandardMaterial({
        color: new THREE.Color('#1e293b'),
        roughness: 0.4,
        metalness: 0.85,
      }),
      concretePlinth: new THREE.MeshStandardMaterial({
        color: new THREE.Color('#0a0e17'),
        roughness: 0.85,
        metalness: 0.25,
      }),
      plinthTerrace: new THREE.MeshStandardMaterial({
        color: new THREE.Color('#060a12'),
        roughness: 0.75,
        metalness: 0.35,
      }),
    };
  }, []);

  // Certifications splits
  const primaryCerts = useMemo(() => {
    return CERTIFICATIONS_DATA.filter((c) =>
      c.id.startsWith('google-cybersecurity') || c.id.startsWith('google-play')
    );
  }, []);

  const secondaryCerts = useMemo(() => {
    return CERTIFICATIONS_DATA.filter(
      (c) => !c.id.startsWith('google-cybersecurity') && !c.id.startsWith('google-play')
    );
  }, []);

  // Current active tech item (either currently hovered or clicked)
  const activeTechDisplay = useMemo(() => {
    if (hoveredTechId) {
      for (const cat of TECH_CATEGORIES_DATA) {
        const found = cat.technologies.find((t) => t.id === hoveredTechId);
        if (found) return found;
      }
    }
    return selectedTech;
  }, [hoveredTechId, selectedTech]);

  // Dynamic light pulse and proximity illumination
  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();

    // Proximity to the Hall of Fame building
    const dist = Math.hypot(
      phoenixFlightState.position.x,
      phoenixFlightState.position.z - HOARDING_Z
    );
    const proximity = Math.min(1, Math.max(0, (120 - dist) / 80));

    // Ambient Hoarding Key Light (Balanced exposure)
    if (ambientHoardingLightRef.current) {
      ambientHoardingLightRef.current.intensity = 1.2 + proximity * 0.8 + Math.sin(t * 1.8) * 0.2;
    }

    // Technology Stack Light
    if (techGlowLightRef.current) {
      const activePulse = hoveredTechId ? 1.6 : 0.8;
      techGlowLightRef.current.intensity = 0.8 + activePulse * proximity + Math.sin(t * 3.2) * 0.15;
    }

    // Social Links Panel Light
    if (socialGlowLightRef.current) {
      const socialBoost = hoveredSocial ? 2.0 : 0.9;
      socialGlowLightRef.current.intensity = 1.0 + socialBoost * proximity + Math.cos(t * 2.5) * 0.15;
    }
  });

  return (
    <group ref={groupRef} position={[0, 0, HOARDING_Z]}>
      {/* =================================================================== */}
      {/* DYNAMIC ARCHITECTURAL SPOTLIGHTS & ILLUMINATION RIG                 */}
      {/* =================================================================== */}
      <pointLight
        ref={ambientHoardingLightRef}
        position={[0, 44, 16]}
        color="#38bdf8"
        intensity={1.2}
        distance={50}
        decay={2}
      />
      <pointLight
        ref={techGlowLightRef}
        position={[0, 22, 12]}
        color="#60a5fa"
        intensity={1.0}
        distance={40}
        decay={2}
      />
      <pointLight
        ref={socialGlowLightRef}
        position={[0, 6.5, 16]}
        color="#00f0ff"
        intensity={1.2}
        distance={35}
        decay={2}
      />

      {/* =================================================================== */}
      {/* 1. MULTI-TIERED MASSIVE INDUSTRIAL FOUNDATION & PLINTHS             */}
      {/* =================================================================== */}
      <mesh position={[0, 0.4, 6]} material={materials.concretePlinth} receiveShadow>
        <boxGeometry args={[92, 0.8, 52]} />
      </mesh>

      <mesh position={[0, 0.9, 8]} material={materials.plinthTerrace} receiveShadow>
        <boxGeometry args={[86, 0.5, 44]} />
      </mesh>

      {/* Glowing Neon Cyber Edge Guides on Plinth */}
      <mesh position={[0, 1.16, 29.8]}>
        <boxGeometry args={[85.6, 0.06, 0.25]} />
        <meshBasicMaterial color="#38bdf8" transparent opacity={0.7} />
      </mesh>
      <mesh position={[-42.9, 1.16, 8]}>
        <boxGeometry args={[0.25, 0.06, 43.6]} />
        <meshBasicMaterial color="#38bdf8" transparent opacity={0.45} />
      </mesh>
      <mesh position={[42.9, 1.16, 8]}>
        <boxGeometry args={[0.25, 0.06, 43.6]} />
        <meshBasicMaterial color="#38bdf8" transparent opacity={0.45} />
      </mesh>

      {/* 6 Structural Heavy Pylon Bases */}
      {[-38, -22, -7, 7, 22, 38].map((xPos) => (
        <group key={`plinth-base-${xPos}`} position={[xPos, 1.8, -1]}>
          <mesh material={materials.concretePlinth} castShadow receiveShadow>
            <boxGeometry args={[4.4, 2.6, 4.4]} />
          </mesh>
          <mesh position={[0, 1.35, 0]} material={materials.steelTruss}>
            <boxGeometry args={[3.4, 0.35, 3.4]} />
          </mesh>
        </group>
      ))}

      {/* =================================================================== */}
      {/* 2. HEAVY INDUSTRIAL STEEL TRUSS TOWERS & PYLONS (UP TO Y=64)        */}
      {/* =================================================================== */}
      {[-38, -22, -7, 7, 22, 38].map((xPos) => (
        <group key={`vertical-column-${xPos}`} position={[xPos, 33, -1]}>
          <mesh material={materials.steelTruss} castShadow>
            <boxGeometry args={[1.8, 64, 1.8]} />
          </mesh>
          <mesh position={[0, 0, 1.0]} material={materials.steelTruss}>
            <boxGeometry args={[2.2, 64, 0.2]} />
          </mesh>
          <mesh position={[0, 0, -1.0]} material={materials.steelTruss}>
            <boxGeometry args={[2.2, 64, 0.2]} />
          </mesh>
        </group>
      ))}

      {/* Horizontal Heavy Steel Girders */}
      {[12, 28, 38, 54, 64].map((yLevel) => (
        <mesh
          key={`girder-level-${yLevel}`}
          position={[0, yLevel, -1.8]}
          material={materials.steelTruss}
          castShadow
        >
          <boxGeometry args={[88, 1.2, 1.2]} />
        </mesh>
      ))}

      {/* =================================================================== */}
      {/* 3. UPPER STRUCTURE: HALL OF FAME MONUMENTAL SCREEN BACKING          */}
      {/* =================================================================== */}
      <mesh position={[0, 35, -0.6]} material={materials.darkHousing} castShadow>
        <boxGeometry args={[88, 60, 2.2]} />
      </mesh>

      <mesh position={[0, 35, 0.52]} material={materials.screenFace}>
        <planeGeometry args={[86.8, 58.8]} />
      </mesh>

      {/* Outer Border Frame */}
      <mesh position={[0, 64.9, 0.55]} material={materials.frameTrim}>
        <boxGeometry args={[87.4, 0.4, 0.4]} />
      </mesh>
      <mesh position={[0, 5.1, 0.55]} material={materials.frameTrim}>
        <boxGeometry args={[87.4, 0.4, 0.4]} />
      </mesh>
      <mesh position={[-43.7, 35, 0.55]} material={materials.frameTrim}>
        <boxGeometry args={[0.4, 58.4, 0.4]} />
      </mesh>
      <mesh position={[43.7, 35, 0.55]} material={materials.frameTrim}>
        <boxGeometry args={[0.4, 58.4, 0.4]} />
      </mesh>

      {/* Top Outer Cyan Neon Crown */}
      <mesh position={[0, 65.15, 0.62]}>
        <boxGeometry args={[86.0, 0.18, 0.25]} />
        <meshBasicMaterial color="#38bdf8" />
      </mesh>

      {/* =================================================================== */}
      {/* 4. LEVEL 4: TOP HEADER & MONUMENTAL "HALL OF FAME" TITLE            */}
      {/* =================================================================== */}
      <group position={[0, 62.2, 0.65]}>
        <Text
          position={[-40.5, 0, 0]}
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
          position={[40.5, 0, 0]}
          fontSize={0.48}
          letterSpacing={0.22}
          anchorX="right"
          textAlign="right"
          color="#10b981"
        >
          {`GOOGLE CERTIFIED  ●  ONLINE [200 OK]`}
          <meshBasicMaterial color="#10b981" />
        </Text>

        <mesh position={[0, -0.65, 0]}>
          <planeGeometry args={[82.0, 0.05]} />
          <meshBasicMaterial color="#1e293b" />
        </mesh>
      </group>

      {/* MONUMENTAL TITLE: "HALL OF FAME" */}
      <group position={[0, 58.2, 0.65]}>
        <Text
          position={[0, 0, 0]}
          fontSize={2.8}
          letterSpacing={0.2}
          textAlign="center"
          color="#f8fafc"
        >
          {`HALL OF FAME`}
          <meshStandardMaterial color="#f8fafc" roughness={0.3} metalness={0.4} />
        </Text>

        <Text
          position={[0, -1.8, 0]}
          fontSize={0.52}
          letterSpacing={0.26}
          textAlign="center"
          color="#38bdf8"
        >
          {`OFFICIAL GOOGLE CYBERSECURITY CERTIFICATIONS & VERIFIED MILESTONES`}
          <meshBasicMaterial color="#38bdf8" />
        </Text>
      </group>

      {/* =================================================================== */}
      {/* 5. LEVEL 3: PRIMARY GOOGLE CYBERSECURITY CERTIFICATES (Y = 46.2)    */}
      {/* FULLY VISIBLE, BRIGHT, LUMINOUS AND CRISP                           */}
      {/* =================================================================== */}
      {primaryCerts.map((cert, index) => {
        const isHovered = hoveredCertId === cert.id;
        const xPos = index === 0 ? -21.5 : 21.5;
        const yPos = 45.8;
        const tex = certTextures[cert.id as keyof typeof certTextures];

        return (
          <group
            key={cert.id}
            position={[xPos, yPos, 0.70]}
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
            {/* Housing Frame Backplate */}
            <mesh position={[0, 0, 0]} material={materials.darkHousing}>
              <boxGeometry args={[37.5, 19.5, 0.1]} />
            </mesh>

            {/* Glowing Accent Border Frame */}
            <mesh position={[0, 0, 0.06]}>
              <planeGeometry args={[37.2, 19.2]} />
              <meshBasicMaterial
                color={cert.accentColor}
                transparent
                opacity={isHovered ? 0.95 : 0.45}
              />
            </mesh>

            {/* Top Badge Strip */}
            <Text
              position={[-17.2, 8.6, 0.12]}
              fontSize={0.44}
              letterSpacing={0.22}
              anchorX="left"
              color={cert.accentColor}
            >
              {`// ${cert.badge}  ●  AUTHORIZED BY GOOGLE`}
              <meshBasicMaterial color={cert.accentColor} />
            </Text>

            <Text
              position={[17.2, 8.6, 0.12]}
              fontSize={0.38}
              letterSpacing={0.16}
              anchorX="right"
              color="#f59e0b"
            >
              {cert.date}
              <meshBasicMaterial color="#f59e0b" />
            </Text>

            {/* ============================================================= */}
            {/* THE AUTHENTIC CERTIFICATE IMAGE (FULL BRIGHTNESS & VISIBILITY) */}
            {/* Positioned clearly in front of the box at Z = 0.16           */}
            {/* ============================================================= */}
            {/* Clean dark housing backing */}
            <mesh position={[0, 0.9, 0.14]}>
              <planeGeometry args={[35.6, 14.6]} />
              <meshBasicMaterial color="#0c121e" />
            </mesh>

            <mesh position={[0, 0.9, 0.16]}>
              <planeGeometry args={[35.2, 14.2]} />
              {tex ? (
                <meshBasicMaterial
                  map={tex}
                  color="#9baec4"
                  toneMapped={true}
                />
              ) : (
                <meshBasicMaterial color="#1e293b" />
              )}
            </mesh>

            {/* Certificate Title & Dossier Plaque */}
            <group position={[0, -7.5, 0.12]}>
              <mesh position={[0, 0, 0]} material={materials.darkHousing}>
                <planeGeometry args={[35.6, 2.2]} />
              </mesh>

              <Text
                position={[-16.8, 0.42, 0.04]}
                fontSize={0.46}
                letterSpacing={0.06}
                anchorX="left"
                color="#f8fafc"
              >
                {cert.title}
                <meshBasicMaterial color="#f8fafc" />
              </Text>

              <Text
                position={[-16.8, -0.42, 0.04]}
                fontSize={0.34}
                letterSpacing={0.14}
                anchorX="left"
                color="#94a3b8"
              >
                {`ID: ${cert.credentialId}  ●  COURSERA VERIFIED`}
                <meshBasicMaterial color="#94a3b8" />
              </Text>

              <Text
                position={[16.8, 0, 0.04]}
                fontSize={0.38}
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
      {/* 6. LEVEL 2: SECONDARY ENGINEERING MILESTONES (Y = 34.0)             */}
      {/* =================================================================== */}
      <group position={[0, 33.8, 0.70]}>
        {secondaryCerts.map((cert, index) => {
          const isHovered = hoveredCertId === cert.id;
          const xPos = (index - 1) * 28.5;

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
              <mesh position={[0, 0, 0]} material={materials.darkHousing}>
                <boxGeometry args={[27.2, 3.8, 0.1]} />
              </mesh>
              <mesh position={[0, 0, 0.06]}>
                <planeGeometry args={[26.9, 3.5]} />
                <meshBasicMaterial
                  color={cert.accentColor}
                  transparent
                  opacity={isHovered ? 0.9 : 0.35}
                />
              </mesh>

              <Text
                position={[-12.6, 0.9, 0.12]}
                fontSize={0.32}
                letterSpacing={0.2}
                anchorX="left"
                color={cert.accentColor}
              >
                {`// ${cert.badge}`}
                <meshBasicMaterial color={cert.accentColor} />
              </Text>

              <Text
                position={[-12.6, -0.22, 0.12]}
                fontSize={0.46}
                maxWidth={20}
                letterSpacing={0.04}
                anchorX="left"
                color="#ffffff"
              >
                {cert.title}
                <meshBasicMaterial color="#ffffff" />
              </Text>

              <Text
                position={[12.6, -0.22, 0.12]}
                fontSize={0.32}
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
      {/* 7. LEVEL 1: TECHNOLOGY STACK ARCHIVAL SECTION (Y = 13.5 TO 29.5)   */}
      {/* EXPANSIVE, HIGH-CONTRAST, AND EASILY READABLE FROM FLIGHT DISTANCE  */}
      {/* =================================================================== */}
      {/* Technology Stack Divider & Header */}
      <group position={[0, 29.2, 0.70]}>
        <mesh position={[0, 1.1, 0]}>
          <planeGeometry args={[82.0, 0.08]} />
          <meshBasicMaterial color="#38bdf8" transparent opacity={0.7} />
        </mesh>

        <Text
          position={[0, 0, 0]}
          fontSize={2.2}
          letterSpacing={0.22}
          textAlign="center"
          color="#f8fafc"
        >
          {`TECHNOLOGY STACK`}
          <meshStandardMaterial color="#f8fafc" roughness={0.3} metalness={0.4} />
        </Text>

        <Text
          position={[0, -1.2, 0]}
          fontSize={0.52}
          letterSpacing={0.26}
          textAlign="center"
          color="#60a5fa"
        >
          {`// TOOLS, LANGUAGES & TECHNOLOGIES I'VE WORKED WITH`}
          <meshBasicMaterial color="#60a5fa" />
        </Text>
      </group>

      {/* 6 Technology Category Columns with Bold, Large Typography */}
      <group position={[0, 20.8, 0.82]}>
        {TECH_CATEGORIES_DATA.map((category, catIdx) => {
          // Centers across width 82: -34.2, -20.5, -6.8, 6.8, 20.5, 34.2
          const colX = (catIdx - 2.5) * 13.6;
          const colWidth = 12.8;
          const colHeight = 11.2;

          return (
            <group key={category.id} position={[colX, 0, 0]}>
              {/* Column Housing Backing */}
              <mesh position={[0, 0, 0]} material={materials.darkHousing}>
                <boxGeometry args={[colWidth, colHeight, 0.12]} />
              </mesh>

              {/* Glowing Outline Border */}
              <mesh position={[0, 0, 0.07]}>
                <planeGeometry args={[colWidth - 0.2, colHeight - 0.2]} />
                <meshBasicMaterial
                  color={category.accentColor}
                  transparent
                  opacity={0.38}
                />
              </mesh>

              {/* Column Header Bar */}
              <group position={[0, colHeight / 2 - 0.8, 0.10]}>
                <mesh position={[0, 0, 0]} material={materials.screenFace}>
                  <planeGeometry args={[colWidth - 0.6, 1.2]} />
                </mesh>
                <Text
                  position={[-(colWidth / 2) + 0.6, 0.24, 0.04]}
                  fontSize={0.34}
                  letterSpacing={0.16}
                  anchorX="left"
                  color={category.accentColor}
                >
                  {`// ${category.code}`}
                  <meshBasicMaterial color={category.accentColor} />
                </Text>
                <Text
                  position={[-(colWidth / 2) + 0.6, -0.24, 0.04]}
                  fontSize={0.48}
                  letterSpacing={0.10}
                  anchorX="left"
                  color="#ffffff"
                >
                  {category.title}
                  <meshBasicMaterial color="#ffffff" />
                </Text>
              </group>

              {/* Technology Items Displayed inside Column (Large, Crisp Chips) */}
              <group position={[0, 0.15, 0.12]}>
                {category.technologies.map((tech, itemIdx) => {
                  const isHovered = hoveredTechId === tech.id;
                  const isSelected = selectedTech?.id === tech.id;
                  const totalItems = category.technologies.length;

                  // Adaptive vertical spacing
                  const rowHeight = Math.min(0.92, 8.4 / Math.max(totalItems, 5));
                  const itemY = ((totalItems - 1) / 2 - itemIdx) * rowHeight - 0.7;

                  return (
                    <group
                      key={tech.id}
                      position={[0, itemY, 0]}
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedTech((prev) => (prev?.id === tech.id ? null : tech));
                      }}
                      onPointerOver={(e) => {
                        e.stopPropagation();
                        setHoveredTechId(tech.id);
                        document.body.style.cursor = 'pointer';
                      }}
                      onPointerOut={() => {
                        setHoveredTechId(null);
                        document.body.style.cursor = 'default';
                      }}
                    >
                      {/* Tech Item Base Chip */}
                      <mesh position={[0, 0, 0]}>
                        <planeGeometry args={[colWidth - 0.8, rowHeight - 0.12]} />
                        <meshBasicMaterial
                          color={isHovered || isSelected ? '#1e3a8a' : '#0c1424'}
                          transparent
                          opacity={0.92}
                        />
                      </mesh>

                      {/* Accent indicator edge on left */}
                      <mesh position={[-(colWidth / 2) + 0.6, 0, 0.02]}>
                        <planeGeometry args={[0.20, rowHeight - 0.18]} />
                        <meshBasicMaterial
                          color={tech.accentColor}
                          transparent
                          opacity={isHovered || isSelected ? 1.0 : 0.75}
                        />
                      </mesh>

                      {/* Tech Name (Bolder and Larger: 0.44 - 0.50 font size) */}
                      <Text
                        position={[-(colWidth / 2) + 1.1, 0, 0.03]}
                        fontSize={rowHeight > 0.75 ? 0.44 : 0.38}
                        letterSpacing={0.06}
                        anchorX="left"
                        color={isHovered || isSelected ? '#ffffff' : '#f1f5f9'}
                      >
                        {tech.name}
                        <meshBasicMaterial
                          color={isHovered || isSelected ? '#ffffff' : '#f1f5f9'}
                        />
                      </Text>

                      {/* Mini Role / Badge Tag */}
                      <Text
                        position={[(colWidth / 2) - 0.7, 0, 0.03]}
                        fontSize={0.28}
                        letterSpacing={0.12}
                        anchorX="right"
                        color={isHovered || isSelected ? category.accentColor : '#94a3b8'}
                      >
                        {tech.badge || 'VERIFIED'}
                        <meshBasicMaterial
                          color={isHovered || isSelected ? category.accentColor : '#94a3b8'}
                        />
                      </Text>
                    </group>
                  );
                })}
              </group>
            </group>
          );
        })}
      </group>

      {/* Holographic Technology Telemetry Console Readout (Y = 13.8) */}
      <group position={[0, 13.8, 1.0]}>
        <mesh position={[0, 0, 0]} material={materials.darkHousing}>
          <boxGeometry args={[82.0, 2.4, 0.1]} />
        </mesh>
        <mesh position={[0, 0, 0.06]}>
          <planeGeometry args={[81.6, 2.2]} />
          <meshBasicMaterial color="#0b1329" transparent opacity={0.88} />
        </mesh>

        {activeTechDisplay ? (
          <group position={[0, 0, 0.10]}>
            <Text
              position={[-39.0, 0.48, 0]}
              fontSize={0.48}
              letterSpacing={0.14}
              anchorX="left"
              color={activeTechDisplay.accentColor}
            >
              {`● ARCHIVE NODE: ${activeTechDisplay.name.toUpperCase()}  [${activeTechDisplay.category}]`}
              <meshBasicMaterial color={activeTechDisplay.accentColor} />
            </Text>
            <Text
              position={[39.0, 0.48, 0]}
              fontSize={0.40}
              letterSpacing={0.18}
              anchorX="right"
              color="#38bdf8"
            >
              {`TAG: ${activeTechDisplay.roleTag}`}
              <meshBasicMaterial color="#38bdf8" />
            </Text>
            <Text
              position={[-39.0, -0.42, 0]}
              fontSize={0.42}
              letterSpacing={0.06}
              anchorX="left"
              color="#ffffff"
            >
              {activeTechDisplay.description}
              <meshBasicMaterial color="#ffffff" />
            </Text>
          </group>
        ) : (
          <group position={[0, 0, 0.10]}>
            <Text
              position={[0, 0.35, 0]}
              fontSize={0.46}
              letterSpacing={0.18}
              textAlign="center"
              color="#38bdf8"
            >
              {`// HOVER OR CLICK ANY TECHNOLOGY TO ACCESS ARCHIVAL SPECIFICATIONS & DOMAIN APPLICATION`}
              <meshBasicMaterial color="#38bdf8" />
            </Text>
            <Text
              position={[0, -0.38, 0]}
              fontSize={0.34}
              letterSpacing={0.22}
              textAlign="center"
              color="#94a3b8"
            >
              {`PROVEN TOOLCHAIN ECOSYSTEM: 26 VERIFIED LANGUAGES, RUNTIMES, FRAMEWORKS & 3D PLATFORMS`}
              <meshBasicMaterial color="#94a3b8" />
            </Text>
          </group>
        )}
      </group>

      {/* =================================================================== */}
      {/* 8. LEVEL 0: CONNECT WITH ME — FUTURISTIC ARCHITECTURAL PANELS       */}
      {/* MONUMENTAL, BOLD & IMMEDIATELY VISIBLE FROM APPARATUS / FLIGHT      */}
      {/* =================================================================== */}
      {/* Section Header (Y = 10.4, Z = 9.2) */}
      <group position={[0, 10.4, 9.2]}>
        <mesh position={[0, 1.0, 0]}>
          <planeGeometry args={[72.0, 0.08]} />
          <meshBasicMaterial color="#00f0ff" transparent opacity={0.75} />
        </mesh>

        <Text
          position={[0, 0, 0]}
          fontSize={1.8}
          letterSpacing={0.22}
          textAlign="center"
          color="#f8fafc"
        >
          {`CONNECT WITH ME`}
          <meshStandardMaterial color="#f8fafc" roughness={0.3} metalness={0.4} />
        </Text>

        <Text
          position={[0, -1.0, 0]}
          fontSize={0.48}
          letterSpacing={0.28}
          textAlign="center"
          color="#38bdf8"
        >
          {`// FIND ME BEYOND THIS WORLD`}
          <meshBasicMaterial color="#38bdf8" />
        </Text>
      </group>

      {/* The Two Dedicated Futuristic Digital Architectural Panels (Y = 5.4, Z = 10.0) */}
      <group position={[0, 5.4, 10.0]}>
        {/* PANEL 1: GITHUB (X = -19) */}
        <group
          position={[-19.0, 0, 0]}
          onClick={(e) => {
            e.stopPropagation();
            handleOpenLink(GITHUB_URL);
          }}
          onPointerOver={(e) => {
            e.stopPropagation();
            setHoveredSocial('github');
            document.body.style.cursor = 'pointer';
          }}
          onPointerOut={() => {
            setHoveredSocial(null);
            document.body.style.cursor = 'default';
          }}
        >
          {/* Panel Base Housing */}
          <mesh position={[0, 0, 0]} material={materials.darkHousing}>
            <boxGeometry args={[32.0, 7.8, 0.2]} />
          </mesh>

          {/* Electric Cyan Border Frame */}
          <mesh position={[0, 0, 0.08]}>
            <planeGeometry args={[31.6, 7.4]} />
            <meshBasicMaterial
              color="#38bdf8"
              transparent
              opacity={hoveredSocial === 'github' ? 1.0 : 0.45}
            />
          </mesh>

          {/* Inner Dark Glass Screen */}
          <mesh position={[0, 0, 0.10]} material={materials.screenFace}>
            <planeGeometry args={[30.8, 6.6]} />
          </mesh>

          {/* Technical Corner Brackets */}
          {[-14.8, 14.8].map((bx) => (
            <mesh key={`gh-bracket-${bx}`} position={[bx, 2.7, 0.12]}>
              <boxGeometry args={[0.8, 0.14, 0.05]} />
              <meshBasicMaterial color="#00f0ff" />
            </mesh>
          ))}

          {/* Panel Header */}
          <Text
            position={[-14.2, 2.2, 0.14]}
            fontSize={0.42}
            letterSpacing={0.2}
            anchorX="left"
            color="#38bdf8"
          >
            {`// PROFILE NODE [01]  ●  SOURCE REPOSITORY`}
            <meshBasicMaterial color="#38bdf8" />
          </Text>

          {/* Big GITHUB Label (Massive & High Legibility) */}
          <Text
            position={[-14.2, 0.9, 0.14]}
            fontSize={1.2}
            letterSpacing={0.16}
            anchorX="left"
            color="#ffffff"
          >
            {`GITHUB`}
            <meshStandardMaterial color="#ffffff" roughness={0.2} />
          </Text>

          {/* Handle / URL */}
          <Text
            position={[-14.2, -0.9, 0.14]}
            fontSize={0.72}
            letterSpacing={0.08}
            anchorX="left"
            color={hoveredSocial === 'github' ? '#00f0ff' : '#cbd5e1'}
          >
            {`/Pratham2k07`}
            <meshBasicMaterial color={hoveredSocial === 'github' ? '#00f0ff' : '#cbd5e1'} />
          </Text>

          {/* Arrow Glyph */}
          <Text
            position={[14.2, -0.6, 0.14]}
            fontSize={1.4}
            anchorX="right"
            color={hoveredSocial === 'github' ? '#00f0ff' : '#38bdf8'}
          >
            {`↗`}
            <meshBasicMaterial color={hoveredSocial === 'github' ? '#00f0ff' : '#38bdf8'} />
          </Text>

          {/* Hover Status Bar */}
          <Text
            position={[-14.2, -2.4, 0.14]}
            fontSize={0.34}
            letterSpacing={0.16}
            anchorX="left"
            color={hoveredSocial === 'github' ? '#38bdf8' : '#64748b'}
          >
            {hoveredSocial === 'github' ? `[ CLICK TO LAUNCH GITHUB PROFILE ]` : `github.com/Pratham2k07`}
            <meshBasicMaterial color={hoveredSocial === 'github' ? '#38bdf8' : '#64748b'} />
          </Text>
        </group>

        {/* PANEL 2: LINKEDIN (X = 19) */}
        <group
          position={[19.0, 0, 0]}
          onClick={(e) => {
            e.stopPropagation();
            handleOpenLink(LINKEDIN_URL);
          }}
          onPointerOver={(e) => {
            e.stopPropagation();
            setHoveredSocial('linkedin');
            document.body.style.cursor = 'pointer';
          }}
          onPointerOut={() => {
            setHoveredSocial(null);
            document.body.style.cursor = 'default';
          }}
        >
          {/* Panel Base Housing */}
          <mesh position={[0, 0, 0]} material={materials.darkHousing}>
            <boxGeometry args={[32.0, 7.8, 0.2]} />
          </mesh>

          {/* Electric Cyan Border Frame */}
          <mesh position={[0, 0, 0.08]}>
            <planeGeometry args={[31.6, 7.4]} />
            <meshBasicMaterial
              color="#00f0ff"
              transparent
              opacity={hoveredSocial === 'linkedin' ? 1.0 : 0.45}
            />
          </mesh>

          {/* Inner Dark Glass Screen */}
          <mesh position={[0, 0, 0.10]} material={materials.screenFace}>
            <planeGeometry args={[30.8, 6.6]} />
          </mesh>

          {/* Technical Corner Brackets */}
          {[-14.8, 14.8].map((bx) => (
            <mesh key={`li-bracket-${bx}`} position={[bx, 2.7, 0.12]}>
              <boxGeometry args={[0.8, 0.14, 0.05]} />
              <meshBasicMaterial color="#00f0ff" />
            </mesh>
          ))}

          {/* Panel Header */}
          <Text
            position={[-14.2, 2.2, 0.14]}
            fontSize={0.42}
            letterSpacing={0.2}
            anchorX="left"
            color="#00f0ff"
          >
            {`// PROFILE NODE [02]  ●  PROFESSIONAL NETWORK`}
            <meshBasicMaterial color="#00f0ff" />
          </Text>

          {/* Big LINKEDIN Label (Massive & High Legibility) */}
          <Text
            position={[-14.2, 0.9, 0.14]}
            fontSize={1.2}
            letterSpacing={0.16}
            anchorX="left"
            color="#ffffff"
          >
            {`LINKEDIN`}
            <meshStandardMaterial color="#ffffff" roughness={0.2} />
          </Text>

          {/* Handle / URL */}
          <Text
            position={[-14.2, -0.9, 0.14]}
            fontSize={0.72}
            letterSpacing={0.08}
            anchorX="left"
            color={hoveredSocial === 'linkedin' ? '#00f0ff' : '#cbd5e1'}
          >
            {`/in/pratham2k07`}
            <meshBasicMaterial color={hoveredSocial === 'linkedin' ? '#00f0ff' : '#cbd5e1'} />
          </Text>

          {/* Arrow Glyph */}
          <Text
            position={[14.2, -0.6, 0.14]}
            fontSize={1.4}
            anchorX="right"
            color={hoveredSocial === 'linkedin' ? '#00f0ff' : '#38bdf8'}
          >
            {`↗`}
            <meshBasicMaterial color={hoveredSocial === 'linkedin' ? '#00f0ff' : '#38bdf8'} />
          </Text>

          {/* Hover Status Bar */}
          <Text
            position={[-14.2, -2.4, 0.14]}
            fontSize={0.34}
            letterSpacing={0.16}
            anchorX="left"
            color={hoveredSocial === 'linkedin' ? '#00f0ff' : '#64748b'}
          >
            {hoveredSocial === 'linkedin' ? `[ CLICK TO LAUNCH LINKEDIN PROFILE ]` : `linkedin.com/in/pratham2k07`}
            <meshBasicMaterial color={hoveredSocial === 'linkedin' ? '#00f0ff' : '#64748b'} />
          </Text>
        </group>
      </group>

      {/* =================================================================== */}
      {/* 9. FINAL ARCHITECTURAL INSCRIPTION (FOREFRONT PLINTH AT Z = 19.5)   */}
      {/* =================================================================== */}
      <group position={[0, 1.6, 19.5]} rotation={[-Math.PI / 10, 0, 0]}>
        {/* Laser-Etched Recessed Inscription Plaque */}
        <mesh position={[0, 0, 0]} material={materials.darkHousing}>
          <planeGeometry args={[54.0, 4.2]} />
        </mesh>
        <mesh position={[0, 0, 0.04]}>
          <planeGeometry args={[53.6, 3.8]} />
          <meshBasicMaterial color="#0b1120" transparent opacity={0.92} />
        </mesh>

        {/* PRATHAM LALWANI */}
        <Text
          position={[0, 1.05, 0.08]}
          fontSize={0.95}
          letterSpacing={0.32}
          textAlign="center"
          color="#f8fafc"
        >
          {`PRATHAM LALWANI`}
          <meshStandardMaterial color="#f8fafc" roughness={0.3} metalness={0.5} />
        </Text>

        {/* // THE WORLD I BUILD */}
        <Text
          position={[0, 0.20, 0.08]}
          fontSize={0.46}
          letterSpacing={0.38}
          textAlign="center"
          color="#38bdf8"
        >
          {`// THE WORLD I BUILD`}
          <meshBasicMaterial color="#38bdf8" />
        </Text>

        {/* GITHUB ↗     LINKEDIN ↗ (Interactive Links on Plinth) */}
        <group position={[0, -0.85, 0.08]}>
          <Text
            position={[-8.2, 0, 0]}
            fontSize={0.50}
            letterSpacing={0.22}
            textAlign="center"
            color={hoveredInscriptionLink === 'github' ? '#00f0ff' : '#94a3b8'}
            onClick={(e) => {
              e.stopPropagation();
              handleOpenLink(GITHUB_URL);
            }}
            onPointerOver={(e) => {
              e.stopPropagation();
              setHoveredInscriptionLink('github');
              document.body.style.cursor = 'pointer';
            }}
            onPointerOut={() => {
              setHoveredInscriptionLink(null);
              document.body.style.cursor = 'default';
            }}
          >
            {`GITHUB ↗`}
            <meshBasicMaterial color={hoveredInscriptionLink === 'github' ? '#00f0ff' : '#94a3b8'} />
          </Text>

          <Text position={[0, 0, 0]} fontSize={0.38} color="#475569">
            {`●`}
            <meshBasicMaterial color="#475569" />
          </Text>

          <Text
            position={[8.2, 0, 0]}
            fontSize={0.50}
            letterSpacing={0.22}
            textAlign="center"
            color={hoveredInscriptionLink === 'linkedin' ? '#00f0ff' : '#94a3b8'}
            onClick={(e) => {
              e.stopPropagation();
              handleOpenLink(LINKEDIN_URL);
            }}
            onPointerOver={(e) => {
              e.stopPropagation();
              setHoveredInscriptionLink('linkedin');
              document.body.style.cursor = 'pointer';
            }}
            onPointerOut={() => {
              setHoveredInscriptionLink(null);
              document.body.style.cursor = 'default';
            }}
          >
            {`LINKEDIN ↗`}
            <meshBasicMaterial color={hoveredInscriptionLink === 'linkedin' ? '#00f0ff' : '#94a3b8'} />
          </Text>
        </group>
      </group>
    </group>
  );
};
