import React, { useMemo, useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';

export const CityDistantBackground: React.FC = () => {
  // =========================================================================
  // 1. DISTANT METROPOLITAN SKYSCRAPER TOWERS & SKYLINE SILHOUETTES
  // =========================================================================
  const towerCount = 96;
  const towersRef = useRef<THREE.InstancedMesh>(null);

  const towerTransforms = useMemo(() => {
    const tData: { x: number; y: number; z: number; sx: number; sy: number; sz: number; color: THREE.Color }[] = [];

    // Distribute towers in perimeter rings around the city center (Z = -140)
    for (let i = 0; i < towerCount; i++) {
      const angle = (i / towerCount) * Math.PI * 2 + (i % 3) * 0.15;
      const dist = 140 + ((i * 37) % 180);

      const x = Math.sin(angle) * (dist * 1.15);
      const z = -140 + Math.cos(angle) * dist;

      // Keep central boulevard clear
      if (Math.abs(x) < 55 && z > -370 && z < 20) continue;

      const height = 45 + ((i * 29) % 95);
      const width = 16 + ((i * 17) % 24);
      const depth = 16 + ((i * 23) % 24);

      // Deep obsidian architectural tones
      const colPalette = [
        new THREE.Color('#080d1a'),
        new THREE.Color('#0a1024'),
        new THREE.Color('#060914'),
        new THREE.Color('#0d1426'),
      ];
      const col = colPalette[i % colPalette.length];

      tData.push({ x, y: height / 2, z, sx: width, sy: height, sz: depth, color: col });
    }

    return tData;
  }, [towerCount]);

  // Initialize tower instanced transforms
  useFrame(() => {
    if (towersRef.current && towersRef.current.count === 0) {
      const dummy = new THREE.Object3D();
      towerTransforms.forEach((t, i) => {
        dummy.position.set(t.x, t.y, t.z);
        dummy.scale.set(t.sx, t.sy, t.sz);
        dummy.updateMatrix();
        towersRef.current?.setMatrixAt(i, dummy.matrix);
        towersRef.current?.setColorAt(i, t.color);
      });
      towersRef.current.instanceMatrix.needsUpdate = true;
      if (towersRef.current.instanceColor) towersRef.current.instanceColor.needsUpdate = true;
    }
  });

  // =========================================================================
  // 2. LIVING CITY: ELEVATED TRAFFIC & FLYING VEHICLES (STREAMING LIGHTS)
  // Clean cyber-blue & warm white cruiser lights (No red dots)
  // =========================================================================
  const trafficCount = 110;
  const trafficRef = useRef<THREE.InstancedMesh>(null);

  const trafficLanes = useMemo(() => {
    return Array.from({ length: trafficCount }, (_, i) => {
      const laneRadius = 55 + (i % 6) * 36;
      const height = 14 + ((i * 5) % 42);
      const speed = (0.2 + (i % 4) * 0.12) * (i % 2 === 0 ? 1 : -1);
      const angleOffset = (i / trafficCount) * Math.PI * 2;
      // Use clean cyber-blue and soft white cruiser lights (zero red)
      const color = i % 2 === 0 ? new THREE.Color('#38bdf8') : new THREE.Color('#e2e8f0');
      return { laneRadius, height, speed, angleOffset, color };
    });
  }, [trafficCount]);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();

    if (trafficRef.current) {
      const dummy = new THREE.Object3D();
      trafficLanes.forEach((lane, i) => {
        const angle = lane.angleOffset + t * lane.speed * 0.45;
        const x = Math.sin(angle) * lane.laneRadius;
        const z = -140 + Math.cos(angle) * lane.laneRadius;
        const y = lane.height + Math.sin(t * 1.5 + i) * 1.2;

        dummy.position.set(x, y, z);
        dummy.rotation.y = angle + (lane.speed > 0 ? Math.PI / 2 : -Math.PI / 2);
        dummy.scale.set(1.4, 0.45, 3.2);
        dummy.updateMatrix();

        trafficRef.current?.setMatrixAt(i, dummy.matrix);
        trafficRef.current?.setColorAt(i, lane.color);
      });

      if (trafficRef.current.instanceColor) trafficRef.current.instanceColor.needsUpdate = true;
      trafficRef.current.instanceMatrix.needsUpdate = true;
    }
  });

  return (
    <group>
      {/* 1. Distant Metropolitan Towers */}
      <instancedMesh
        ref={towersRef}
        args={[undefined, undefined, towerTransforms.length]}
        castShadow={false}
        receiveShadow
      >
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial
          roughness={0.7}
          metalness={0.8}
        />
      </instancedMesh>

      {/* 2. Streaming Skyway Vehicles (Living Traffic - Blue/White) */}
      <instancedMesh
        ref={trafficRef}
        args={[undefined, undefined, trafficCount]}
      >
        <boxGeometry args={[1, 1, 1]} />
        <meshBasicMaterial toneMapped={false} />
      </instancedMesh>
    </group>
  );
};
