import React, { useMemo } from 'react';
import * as THREE from 'three';

interface StreetFurnitureProps {
  zPositions: number[];
}

export const StreetFurniture: React.FC<StreetFurnitureProps> = ({ zPositions }) => {
  // Shared materials
  const metalMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: 0x121822,
        roughness: 0.35,
        metalness: 0.85,
      }),
    []
  );

  const darkAlloyMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: 0x080a0f,
        roughness: 0.7,
        metalness: 0.3,
      }),
    []
  );

  return (
    <group>
      {zPositions.map((z, idx) => (
        <group key={z}>
          {/* ============================================================= */}
          {/* 1. FUTURISTIC CYBERPUNK STREET LAMPS                          */}
          {/* ============================================================= */}
          {/* Left Lamp Post */}
          <group position={[-16.5, 0, z]}>
            <mesh position={[0, 5, 0]} material={metalMat}>
              <cylinderGeometry args={[0.15, 0.22, 10, 8]} />
            </mesh>
            <mesh position={[1, 9.8, 0]} rotation={[0, 0, -Math.PI / 4]} material={metalMat}>
              <boxGeometry args={[2.5, 0.2, 0.3]} />
            </mesh>
            <mesh position={[1.8, 8.8, 0]}>
              <boxGeometry args={[1.2, 0.2, 0.5]} />
              <meshBasicMaterial color="#5eead4" />
            </mesh>
          </group>

          {/* Right Lamp Post */}
          <group position={[16.5, 0, z + 12]}>
            <mesh position={[0, 5, 0]} material={metalMat}>
              <cylinderGeometry args={[0.15, 0.22, 10, 8]} />
            </mesh>
            <mesh position={[-1, 9.8, 0]} rotation={[0, 0, Math.PI / 4]} material={metalMat}>
              <boxGeometry args={[2.5, 0.2, 0.3]} />
            </mesh>
            <mesh position={[-1.8, 8.8, 0]}>
              <boxGeometry args={[1.2, 0.2, 0.5]} />
              <meshBasicMaterial color="#38bdf8" />
            </mesh>
          </group>

          {/* ============================================================= */}
          {/* 2. CYBER VENDING MACHINES                                     */}
          {/* ============================================================= */}
          {idx % 2 === 0 && (
            <group position={[-17.8, 0, z + 6]} rotation={[0, Math.PI / 2, 0]}>
              <mesh position={[0, 1.8, 0]} material={darkAlloyMat}>
                <boxGeometry args={[1.8, 3.6, 1.2]} />
              </mesh>
              <mesh position={[0, 2.2, 0.61]}>
                <planeGeometry args={[1.5, 1.8]} />
                <meshBasicMaterial color={idx % 4 === 0 ? '#ec4899' : '#eab308'} />
              </mesh>
              <mesh position={[0, 0.6, 0.61]}>
                <planeGeometry args={[1.2, 0.5]} />
                <meshBasicMaterial color="#0f172a" />
              </mesh>
            </group>
          )}

          {/* ============================================================= */}
          {/* 3. DIGITAL WAYFINDING BOLLARDS                                */}
          {/* ============================================================= */}
          <group position={[17.5, 0, z + 4]}>
            <mesh position={[0, 1.2, 0]} material={metalMat}>
              <boxGeometry args={[0.5, 2.4, 0.5]} />
            </mesh>
            <mesh position={[-0.26, 1.6, 0]}>
              <planeGeometry args={[0.02, 1.2]} />
              <meshBasicMaterial color="#38bdf8" />
            </mesh>
          </group>

          {/* ============================================================= */}
          {/* 4. SLEEK CANTILEVERED CYBER BENCHES                           */}
          {/* ============================================================= */}
          {idx % 2 === 1 && (
            <group position={[-17.2, 0, z - 8]}>
              <mesh position={[0, 0.6, 0]} material={darkAlloyMat}>
                <boxGeometry args={[1.4, 0.15, 3.2]} />
              </mesh>
              <mesh position={[0, 0.5, 0]}>
                <boxGeometry args={[1.2, 0.05, 3.0]} />
                <meshBasicMaterial color="#06b6d4" />
              </mesh>
            </group>
          )}

          {/* ============================================================= */}
          {/* 5. OVERHEAD INFRASTRUCTURE POWER CONDUITS & CABLES            */}
          {/* ============================================================= */}
          <group position={[0, 18, z]}>
            <mesh position={[0, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
              <cylinderGeometry args={[0.04, 0.04, 42, 6]} />
              <meshBasicMaterial color="#1e293b" />
            </mesh>
            <mesh position={[0, -0.6, 0]} rotation={[0, 0, Math.PI / 2]}>
              <cylinderGeometry args={[0.03, 0.03, 42, 6]} />
              <meshBasicMaterial color="#1e293b" />
            </mesh>
          </group>
        </group>
      ))}
    </group>
  );
};
