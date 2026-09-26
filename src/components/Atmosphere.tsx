import React, { useMemo, useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { createFloorTileTexture } from '../materials/proceduralTextures';

interface AtmosphereProps {
  atmosphereReveal: number; // 0 to 1
  openingProgress: number;  // 0 to 1
}

export const Atmosphere: React.FC<AtmosphereProps> = ({
  atmosphereReveal,
  openingProgress,
}) => {
  const floorTexture = useMemo(() => createFloorTileTexture(), []);

  // Floor material
  const floorMaterial = useMemo(() => {
    return new THREE.MeshStandardMaterial({
      color: new THREE.Color(0x111419),
      roughness: 0.85,
      metalness: 0.15,
      map: floorTexture,
    });
  }, [floorTexture]);

  // Distant horizon beacons
  const beaconMeshRef = useRef<THREE.InstancedMesh>(null);
  const beaconCount = 18;

  // Static positions for horizon silhouettes and distant beacons
  const beaconData = useMemo(() => {
    const data: { pos: [number, number, number]; color: THREE.Color }[] = [];
    for (let i = 0; i < beaconCount; i++) {
      const angle = (i / beaconCount) * Math.PI * 2;
      const dist = 70 + Math.random() * 50;
      const x = Math.sin(angle) * dist;
      const z = -20 - Math.abs(Math.cos(angle)) * dist; // Behind and around the gate
      const y = 8 + Math.random() * 24;
      const hue = Math.random() > 0.7 ? 0.08 : 0.58; // subtle warm gold or cool cyan/slate
      data.push({
        pos: [x, y, z],
        color: new THREE.Color().setHSL(hue, 0.45, 0.6),
      });
    }
    return data;
  }, []);

  // Setup instanced mesh
  useMemo(() => {
    if (!beaconMeshRef.current) return;
    const dummy = new THREE.Object3D();
    beaconData.forEach((b, i) => {
      dummy.position.set(...b.pos);
      dummy.scale.set(0.6, 0.6, 0.6);
      dummy.updateMatrix();
      beaconMeshRef.current?.setMatrixAt(i, dummy.matrix);
      beaconMeshRef.current?.setColorAt(i, b.color);
    });
    if (beaconMeshRef.current.instanceColor) {
      beaconMeshRef.current.instanceColor.needsUpdate = true;
    }
    beaconMeshRef.current.instanceMatrix.needsUpdate = true;
  }, [beaconData]);

  // Subtle ground mist particles
  const particleCount = 280;
  const { particlePositions, particleColors } = useMemo(() => {
    const pos = new Float32Array(particleCount * 3);
    const col = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 55;     // X: span across causeway
      pos[i * 3 + 1] = 0.2 + Math.random() * 2.8;  // Y: stay close to ground
      pos[i * 3 + 2] = -20 + Math.random() * 145;  // Z: from beyond gate through intro arrival area

      // Very soft slate & electric cyan tone
      col[i * 3] = 0.35 + Math.random() * 0.25;
      col[i * 3 + 1] = 0.65 + Math.random() * 0.25;
      col[i * 3 + 2] = 0.95;
    }
    return { particlePositions: pos, particleColors: col };
  }, []);

  const particlesRef = useRef<THREE.Points>(null);

  // Slow organic particle drift
  useFrame((_, delta) => {
    if (particlesRef.current) {
      const positions = particlesRef.current.geometry.attributes.position.array as Float32Array;
      for (let i = 0; i < particleCount; i++) {
        // Slow float upward and cycle
        positions[i * 3 + 1] += delta * 0.15;
        if (positions[i * 3 + 1] > 3.2) {
          positions[i * 3 + 1] = 0.2;
        }
      }
      particlesRef.current.geometry.attributes.position.needsUpdate = true;
    }
  });

  return (
    <group>
      {/* ================================================================= */}
      {/* 1. ATMOSPHERIC CAUSEWAY & GROUND                                  */}
      {/* ================================================================= */}
      {/* Central Processional Causeway Floor (Extends from Z=140 through Gate to Z=-40) */}
      <mesh
        position={[0, -0.05, 50]}
        rotation={[-Math.PI / 2, 0, 0]}
        material={floorMaterial}
        receiveShadow
      >
        <planeGeometry args={[34, 180]} />
      </mesh>

      {/* Flanking Causeway Curbs */}
      <mesh position={[-17.5, 0.4, 50]} material={floorMaterial} receiveShadow>
        <boxGeometry args={[1.5, 0.8, 180]} />
      </mesh>
      <mesh position={[17.5, 0.4, 50]} material={floorMaterial} receiveShadow>
        <boxGeometry args={[1.5, 0.8, 180]} />
      </mesh>

      {/* Flanking Architectural Monolith Markers along the grand approach */}
      {[-1, 1].map((side) =>
        [15, 35, 55, 75, 95, 115].map((zPos) => (
          <group key={`${side}-${zPos}`} position={[side * 18.5, 1.8, zPos]}>
            <mesh material={floorMaterial} castShadow receiveShadow>
              <boxGeometry args={[0.9, 3.8, 0.9]} />
            </mesh>
            {/* Subtle recessed cyan light slit on each marker */}
            <mesh position={[-side * 0.46, 0, 0]}>
              <planeGeometry args={[0.08, 3.0]} />
              <meshBasicMaterial
                color="#38bdf8"
                transparent
                opacity={0.5 * atmosphereReveal}
              />
            </mesh>
          </group>
        ))
      )}

      {/* Beyond the Gate: Threshold Void Floor */}
      <mesh
        position={[0, -0.05, -50]}
        rotation={[-Math.PI / 2, 0, 0]}
        material={floorMaterial}
        receiveShadow
      >
        <planeGeometry args={[90, 80]} />
      </mesh>

      {/* ================================================================= */}
      {/* 2. GROUND MIST / DUST PARTICLES                                   */}
      {/* ================================================================= */}
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
          opacity={0.28 * atmosphereReveal}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </points>

      {/* ================================================================= */}
      {/* 3. DISTANT HORIZON BEACONS & BACKLIGHT                            */}
      {/* ================================================================= */}
      <instancedMesh
        ref={beaconMeshRef}
        args={[undefined, undefined, beaconCount]}
      >
        <sphereGeometry args={[0.5, 8, 8]} />
        <meshBasicMaterial transparent opacity={0.6 * atmosphereReveal} />
      </instancedMesh>

      {/* Distant Rim Backlight: Casts deep architectural silhouette of the gate */}
      <directionalLight
        position={[0, 20, -45]}
        intensity={atmosphereReveal * 3.2}
        color="#8ab4f8"
      />

      {/* Distant Horizon Silhouette Rim */}
      <directionalLight
        position={[25, 30, -35]}
        intensity={atmosphereReveal * 1.5}
        color="#a5c4e8"
      />

      {/* Portal Inner Luminescence: Grows as the gate opens, drawing visitor forward */}
      <spotLight
        position={[0, 9, -20]}
        target-position={[0, 9, 20]}
        angle={0.7}
        penumbra={0.9}
        intensity={openingProgress * 12.0}
        color="#b0d4ff"
        distance={60}
      />
    </group>
  );
};
