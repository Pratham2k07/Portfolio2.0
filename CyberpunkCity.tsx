import React, { useMemo, useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import {
  createCyberBoulevardTexture,
  createHologramTexture,
} from '../materials/cyberCityMaterials';

interface CyberpunkCityProps {
  revealProgress: number; // 0 to 1 as visitor enters city
}

export const CyberpunkCity: React.FC<CyberpunkCityProps> = ({ revealProgress }) => {
  // Road & pavement materials
  const boulevardMaterial = useMemo(() => {
    const roadTex = createCyberBoulevardTexture();
    return new THREE.MeshStandardMaterial({
      color: 0x0c0e14,
      map: roadTex,
      roughness: 0.25,
      metalness: 0.65,
    });
  }, []);

  // Holographic Billboard Textures
  const holoTex1 = useMemo(
    () => createHologramTexture('PRATHAM LALWANI', 'CREATIVE TECHNOLOGIST & ARCHITECT', '#38bdf8'),
    []
  );
  const holoTex2 = useMemo(
    () => createHologramTexture('PROJECT DISTRICT', 'EXPLORABLE DIGITAL REALMS // SECTOR 01', '#ec4899'),
    []
  );
  const holoTex3 = useMemo(
    () => createHologramTexture('CYBER METROPOLIS', 'REAL-TIME SHADER ARCHITECTURE', '#eab308'),
    []
  );

  // Cyber traffic particles moving along elevated rails
  const trafficCount = 120;
  const trafficPositions = useMemo(() => new Float32Array(trafficCount * 3), [trafficCount]);
  const trafficSpeeds = useMemo(() => {
    const speeds = new Float32Array(trafficCount);
    for (let i = 0; i < trafficCount; i++) {
      speeds[i] = 18 + Math.random() * 26;
    }
    return speeds;
  }, [trafficCount]);
  const trafficPointsRef = useRef<THREE.Points>(null);

  // Initialize traffic along left & right elevated rails (y = 18, x = -19 and +19)
  useMemo(() => {
    for (let i = 0; i < trafficCount; i++) {
      const side = i % 2 === 0 ? -19 : 19;
      trafficPositions[i * 3] = side;
      trafficPositions[i * 3 + 1] = 16.5;
      trafficPositions[i * 3 + 2] = -20 - Math.random() * 240;
    }
  }, [trafficCount, trafficPositions]);

  // Animated searchlights & cyber traffic update
  const searchlightRef1 = useRef<THREE.SpotLight>(null);
  const searchlightRef2 = useRef<THREE.SpotLight>(null);

  useFrame(({ clock }, delta) => {
    const time = clock.getElapsedTime();

    // 1. Move cyber traffic
    if (trafficPointsRef.current) {
      const pos = trafficPointsRef.current.geometry.attributes.position.array as Float32Array;
      for (let i = 0; i < trafficCount; i++) {
        // Move towards or away along Z
        const direction = i % 2 === 0 ? -1 : 1;
        pos[i * 3 + 2] += direction * trafficSpeeds[i] * delta;

        // Wrap around track
        if (pos[i * 3 + 2] < -260) pos[i * 3 + 2] = -20;
        if (pos[i * 3 + 2] > -20) pos[i * 3 + 2] = -260;
      }
      trafficPointsRef.current.geometry.attributes.position.needsUpdate = true;
    }

    // 2. Slow sweeping volumetric searchlights
    if (searchlightRef1.current) {
      searchlightRef1.current.target.position.set(
        Math.sin(time * 0.4) * 45,
        110,
        -140 + Math.cos(time * 0.3) * 35
      );
      searchlightRef1.current.target.updateMatrixWorld();
    }
    if (searchlightRef2.current) {
      searchlightRef2.current.target.position.set(
        Math.cos(time * 0.35) * 45,
        110,
        -160 + Math.sin(time * 0.45) * 35
      );
      searchlightRef2.current.target.updateMatrixWorld();
    }
  });

  return (
    <group position={[0, 0, 0]}>
      {/* ================================================================= */}
      {/* 1. CENTRAL PROCESSIONAL CYBER BOULEVARD                           */}
      {/* ================================================================= */}
      {/* Main Wet Asphalt Street extending into the city */}
      <mesh
        position={[0, -0.04, -150]}
        rotation={[-Math.PI / 2, 0, 0]}
        material={boulevardMaterial}
        receiveShadow
      >
        <planeGeometry args={[36, 280]} />
      </mesh>

      {/* Flanking Pedestrian Walkways */}
      <mesh position={[-20, 0.2, -150]} receiveShadow>
        <boxGeometry args={[4, 0.4, 280]} />
        <meshStandardMaterial color="#0f131a" roughness={0.4} metalness={0.7} />
      </mesh>
      <mesh position={[20, 0.2, -150]} receiveShadow>
        <boxGeometry args={[4, 0.4, 280]} />
        <meshStandardMaterial color="#0f131a" roughness={0.4} metalness={0.7} />
      </mesh>

      {/* ================================================================= */}
      {/* 2. ELEVATED MAGLEV TRANSIT RAILS                                  */}
      {/* ================================================================= */}
      {[-19, 19].map((railX) => (
        <group key={railX}>
          {/* Rail Beam */}
          <mesh position={[railX, 16, -150]}>
            <boxGeometry args={[1.6, 0.9, 280]} />
            <meshStandardMaterial color="#1a222e" roughness={0.3} metalness={0.9} />
          </mesh>
          {/* Glowing Rail Energy Strip */}
          <mesh position={[railX, 16.5, -150]}>
            <boxGeometry args={[0.25, 0.1, 280]} />
            <meshBasicMaterial color={railX < 0 ? '#38bdf8' : '#ec4899'} />
          </mesh>
          {/* Vertical Support Pylons */}
          {[-40, -90, -140, -190, -240].map((pz) => (
            <mesh key={pz} position={[railX, 8, pz]}>
              <boxGeometry args={[1.4, 16, 1.4]} />
              <meshStandardMaterial color="#12161f" roughness={0.5} metalness={0.8} />
            </mesh>
          ))}
        </group>
      ))}

      {/* Cyber Traffic Glow Particles */}
      <points ref={trafficPointsRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[trafficPositions, 3]}
          />
        </bufferGeometry>
        <pointsMaterial
          size={1.4}
          color="#38bdf8"
          transparent
          opacity={0.95}
          blending={THREE.AdditiveBlending}
        />
      </points>

      {/* ================================================================= */}
      {/* 3. ELEVATED SKY-BRIDGES CONNECTING DISTRICTS                      */}
      {/* ================================================================= */}
      {[-65, -135, -205].map((bz, idx) => (
        <group key={bz} position={[0, 26 + idx * 8, bz]}>
          {/* Bridge Tube */}
          <mesh castShadow receiveShadow>
            <boxGeometry args={[60, 4.5, 4.5]} />
            <meshStandardMaterial color="#111620" roughness={0.3} metalness={0.85} />
          </mesh>
          {/* Glass Windows on Bridge */}
          <mesh position={[0, 0, 2.3]}>
            <planeGeometry args={[56, 2.2]} />
            <meshBasicMaterial color="#38bdf8" transparent opacity={0.6} />
          </mesh>
          <mesh position={[0, 0, -2.3]} rotation={[0, Math.PI, 0]}>
            <planeGeometry args={[56, 2.2]} />
            <meshBasicMaterial color="#38bdf8" transparent opacity={0.6} />
          </mesh>
        </group>
      ))}

      {/* ================================================================= */}
      {/* 4. HOLOGRAPHIC BILLBOARDS                                         */}
      {/* ================================================================= */}
      {/* Billboard 1: Pratham Lalwani Identity */}
      <group position={[-21, 24, -58]} rotation={[0, 0.35, 0]}>
        <mesh>
          <planeGeometry args={[14, 7]} />
          <meshBasicMaterial
            map={holoTex1}
            transparent
            opacity={0.88 * revealProgress}
            side={THREE.DoubleSide}
          />
        </mesh>
        <pointLight color="#38bdf8" intensity={2 * revealProgress} distance={15} />
      </group>

      {/* Billboard 2: Projects Sector */}
      <group position={[21, 28, -110]} rotation={[0, -0.4, 0]}>
        <mesh>
          <planeGeometry args={[16, 8]} />
          <meshBasicMaterial
            map={holoTex2}
            transparent
            opacity={0.88 * revealProgress}
            side={THREE.DoubleSide}
          />
        </mesh>
        <pointLight color="#ec4899" intensity={2.5 * revealProgress} distance={18} />
      </group>

      {/* Billboard 3: Cyber Metropolis */}
      <group position={[-20, 35, -170]} rotation={[0, 0.45, 0]}>
        <mesh>
          <planeGeometry args={[18, 9]} />
          <meshBasicMaterial
            map={holoTex3}
            transparent
            opacity={0.88 * revealProgress}
            side={THREE.DoubleSide}
          />
        </mesh>
        <pointLight color="#eab308" intensity={2.2 * revealProgress} distance={18} />
      </group>

      {/* ================================================================= */}
      {/* 5. VOLUMETRIC SEARCHLIGHTS & CITY LIGHTING                        */}
      {/* ================================================================= */}
      {/* Left Searchlight */}
      <spotLight
        ref={searchlightRef1}
        position={[-35, 2, -100]}
        angle={0.22}
        penumbra={0.7}
        intensity={8 * revealProgress}
        color="#38bdf8"
        distance={220}
      />
      {/* Right Searchlight */}
      <spotLight
        ref={searchlightRef2}
        position={[35, 2, -160]}
        angle={0.25}
        penumbra={0.7}
        intensity={8 * revealProgress}
        color="#a855f7"
        distance={220}
      />

      {/* Boulevard Ambient Pools of Light */}
      {[-40, -85, -130, -175, -220].map((lz) => (
        <pointLight
          key={lz}
          position={[0, 6, lz]}
          color="#93c5fd"
          intensity={1.8 * revealProgress}
          distance={32}
          decay={2}
        />
      ))}
    </group>
  );
};
