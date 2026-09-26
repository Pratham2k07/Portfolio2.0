import React, { useMemo, useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';

export const CityDistantBackground: React.FC = () => {
  // =========================================================================
  // 1. LIVING CITY: ELEVATED TRAFFIC & FLYING VEHICLES (STREAMING LIGHTS)
  // =========================================================================
  const trafficCount = 140;
  const trafficRef = useRef<THREE.InstancedMesh>(null);

  // Traffic vehicle orbits / lanes
  const trafficLanes = useMemo(() => {
    return Array.from({ length: trafficCount }, (_, i) => {
      const laneRadius = 45 + (i % 6) * 32;
      const height = 12 + ((i * 5) % 38);
      const speed = (0.2 + (i % 4) * 0.12) * (i % 2 === 0 ? 1 : -1);
      const angleOffset = (i / trafficCount) * Math.PI * 2;
      const isHeadlight = i % 2 === 0;
      const color = isHeadlight ? new THREE.Color('#38bdf8') : new THREE.Color('#ef4444');
      return { laneRadius, height, speed, angleOffset, color };
    });
  }, [trafficCount]);

  // Animate traffic vehicles along elevated flight paths
  useFrame(({ clock }) => {
    if (!trafficRef.current) return;
    const t = clock.getElapsedTime();
    const dummy = new THREE.Object3D();

    trafficLanes.forEach((lane, i) => {
      const angle = lane.angleOffset + t * lane.speed * 0.45;
      const x = Math.sin(angle) * lane.laneRadius;
      const z = -140 + Math.cos(angle) * lane.laneRadius;
      const y = lane.height + Math.sin(t * 1.5 + i) * 1.2;

      dummy.position.set(x, y, z);
      // Orient along velocity vector
      dummy.rotation.y = angle + (lane.speed > 0 ? Math.PI / 2 : -Math.PI / 2);
      dummy.scale.set(1.4, 0.45, 3.2); // streamlined cruiser shape
      dummy.updateMatrix();

      trafficRef.current?.setMatrixAt(i, dummy.matrix);
      trafficRef.current?.setColorAt(i, lane.color);
    });

    if (trafficRef.current.instanceColor) trafficRef.current.instanceColor.needsUpdate = true;
    trafficRef.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <group>
      {/* 1. Streaming Skyway Vehicles (Living Traffic) */}
      <instancedMesh
        ref={trafficRef}
        args={[undefined, undefined, trafficCount]}
      >
        <boxGeometry args={[1, 1, 1]} />
        <meshBasicMaterial toneMapped={false} />
      </instancedMesh>

      {/* 5. Distant Horizon Glow Disk */}
      <mesh position={[0, 4, -140]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[90, 320, 48]} />
        <meshBasicMaterial
          color="#0c1626"
          transparent
          opacity={0.35}
          side={THREE.DoubleSide}
          depthWrite={false}
        />
      </mesh>
    </group>
  );
};
