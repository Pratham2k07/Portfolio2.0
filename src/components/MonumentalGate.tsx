import React, { useMemo, useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei';

interface MonumentalGateProps {
  openingProgress: number; // 0 to 1
  typographyReveal: number; // 0 (dim/dark) to 1 (fully illuminated)
}

export const MonumentalGate: React.FC<MonumentalGateProps> = ({
  openingProgress,
  typographyReveal,
}) => {
  // Load the user's custom 3D gate model from public folder
  const { scene } = useGLTF('/cyberpunk_torii_gate.glb');
  const portalGlowRef = useRef<THREE.PointLight>(null);
  const gateMeshesRef = useRef<THREE.MeshStandardMaterial[]>([]);

  // Hydraulic blast door references for physical opening animation
  const leftDoorRef = useRef<THREE.Group>(null);
  const rightDoorRef = useRef<THREE.Group>(null);
  const leftPistonRef = useRef<THREE.Mesh>(null);
  const rightPistonRef = useRef<THREE.Mesh>(null);

  // Prepare cloned scene with proper shadow casting and PBR material setup
  const model = useMemo(() => {
    const clone = scene.clone();
    const mats: THREE.MeshStandardMaterial[] = [];

    clone.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        const mesh = child as THREE.Mesh;
        mesh.castShadow = true;
        mesh.receiveShadow = true;
        if (mesh.material) {
          const origMat = mesh.material as THREE.MeshStandardMaterial;
          const mat = origMat.clone();
          mat.depthWrite = true; // Prevent transparency sorting glitch
          mesh.material = mat;
          mats.push(mat);
        }
      }
    });

    gateMeshesRef.current = mats;
    return clone;
  }, [scene]);

  // Model scale calculation (target world height = ~24.5m)
  const scale = 0.000195;

  // Door materials: Heavy cyber-steel with cyan energy conduits
  const { blastDoorMat, doorDetailMat, energySeamMat } = useMemo(() => {
    return {
      blastDoorMat: new THREE.MeshStandardMaterial({
        color: new THREE.Color('#080d16'),
        roughness: 0.32,
        metalness: 0.92,
      }),
      doorDetailMat: new THREE.MeshStandardMaterial({
        color: new THREE.Color('#101826'),
        roughness: 0.22,
        metalness: 0.88,
      }),
      energySeamMat: new THREE.MeshBasicMaterial({
        color: new THREE.Color('#00f0ff'),
        transparent: true,
        opacity: 0.9,
      }),
    };
  }, []);

  useFrame((_, delta) => {
    // 1. Gate model emissive intensity tied to reveal
    const targetEmissive = THREE.MathUtils.lerp(0.08, 1.4, typographyReveal);
    gateMeshesRef.current.forEach((mat) => {
      mat.emissiveIntensity = THREE.MathUtils.damp(
        mat.emissiveIntensity,
        targetEmissive,
        4,
        delta
      );
    });

    // 2. Physical Hydraulic Blast Doors Sliding Open Animation
    // Closed: left at -4.25, right at +4.25 (meeting in the middle at X=0)
    // Open: left slides to -13.5, right slides to +13.5 (fully clear of portal opening)
    const doorSlide = THREE.MathUtils.smoothstep(openingProgress, 0, 1);
    if (leftDoorRef.current) {
      const targetLeftX = -4.25 - doorSlide * 9.25;
      leftDoorRef.current.position.x = THREE.MathUtils.damp(
        leftDoorRef.current.position.x,
        targetLeftX,
        5.5,
        delta
      );
    }
    if (rightDoorRef.current) {
      const targetRightX = 4.25 + doorSlide * 9.25;
      rightDoorRef.current.position.x = THREE.MathUtils.damp(
        rightDoorRef.current.position.x,
        targetRightX,
        5.5,
        delta
      );
    }

    // 3. Hydraulic Piston extension / rotation
    if (leftPistonRef.current) {
      leftPistonRef.current.rotation.z = -0.15 - doorSlide * 0.45;
    }
    if (rightPistonRef.current) {
      rightPistonRef.current.rotation.z = 0.15 + doorSlide * 0.45;
    }

    // 4. Portal Inner Ambient Light
    if (portalGlowRef.current) {
      const targetIntensity = typographyReveal * 0.8 + openingProgress * 1.5;
      portalGlowRef.current.intensity = THREE.MathUtils.damp(
        portalGlowRef.current.intensity,
        targetIntensity,
        4,
        delta
      );
    }
  });

  return (
    <group position={[0, 0, 0]}>
      {/* ================================================================= */}
      {/* 1. USER'S MONUMENTAL 3D GATE MODEL (/cyberpunk_torii_gate.glb)    */}
      {/* ================================================================= */}
      <primitive
        object={model}
        scale={[scale, scale, scale]}
        position={[0, 0, 0]}
      />

      {/* ================================================================= */}
      {/* 2. PHYSICAL HYDRAULIC BLAST DOORS (SEALING & OPENING MECHANISM)   */}
      {/* ================================================================= */}
      {/* Portal dimensions: Opening is ~17m wide, ~14.5m tall */}
      
      {/* LEFT HYDRAULIC BLAST DOOR */}
      <group ref={leftDoorRef} position={[-4.25, 7.25, 0]}>
        {/* Main armored door plate */}
        <mesh material={blastDoorMat} castShadow receiveShadow>
          <boxGeometry args={[8.4, 14.5, 0.45]} />
        </mesh>

        {/* Horizontal structural reinforcing ribs */}
        {[-4.5, -1.8, 1.2, 4.2].map((y, i) => (
          <mesh key={`l-rib-${i}`} position={[0, y, 0.28]} material={doorDetailMat}>
            <boxGeometry args={[8.3, 0.45, 0.2]} />
          </mesh>
        ))}

        {/* Vertical Center Lock Seam Flange */}
        <mesh position={[4.15, 0, 0.15]} material={doorDetailMat}>
          <boxGeometry args={[0.35, 14.2, 0.3]} />
        </mesh>

        {/* Glowing Cyan Energy Conduit along door face */}
        <mesh position={[0, 0, 0.25]} material={energySeamMat}>
          <planeGeometry args={[0.08, 13.8]} />
        </mesh>

        {/* Diagonal Cyber Conduit Accents */}
        <mesh position={[1.8, 2.5, 0.25]} rotation={[0, 0, Math.PI / 4]} material={energySeamMat}>
          <planeGeometry args={[0.06, 3.2]} />
        </mesh>
        <mesh position={[1.8, -2.5, 0.25]} rotation={[0, 0, -Math.PI / 4]} material={energySeamMat}>
          <planeGeometry args={[0.06, 3.2]} />
        </mesh>

        {/* Top Hydraulic Piston Actuator Mount */}
        <mesh ref={leftPistonRef} position={[-2.8, 6.8, 0.45]} material={doorDetailMat}>
          <cylinderGeometry args={[0.18, 0.22, 2.2, 8]} />
        </mesh>
      </group>

      {/* RIGHT HYDRAULIC BLAST DOOR */}
      <group ref={rightDoorRef} position={[4.25, 7.25, 0]}>
        {/* Main armored door plate */}
        <mesh material={blastDoorMat} castShadow receiveShadow>
          <boxGeometry args={[8.4, 14.5, 0.45]} />
        </mesh>

        {/* Horizontal structural reinforcing ribs */}
        {[-4.5, -1.8, 1.2, 4.2].map((y, i) => (
          <mesh key={`r-rib-${i}`} position={[0, y, 0.28]} material={doorDetailMat}>
            <boxGeometry args={[8.3, 0.45, 0.2]} />
          </mesh>
        ))}

        {/* Vertical Center Lock Seam Flange */}
        <mesh position={[-4.15, 0, 0.15]} material={doorDetailMat}>
          <boxGeometry args={[0.35, 14.2, 0.3]} />
        </mesh>

        {/* Glowing Cyan Energy Conduit along door face */}
        <mesh position={[0, 0, 0.25]} material={energySeamMat}>
          <planeGeometry args={[0.08, 13.8]} />
        </mesh>

        {/* Diagonal Cyber Conduit Accents */}
        <mesh position={[-1.8, 2.5, 0.25]} rotation={[0, 0, -Math.PI / 4]} material={energySeamMat}>
          <planeGeometry args={[0.06, 3.2]} />
        </mesh>
        <mesh position={[-1.8, -2.5, 0.25]} rotation={[0, 0, Math.PI / 4]} material={energySeamMat}>
          <planeGeometry args={[0.06, 3.2]} />
        </mesh>

        {/* Top Hydraulic Piston Actuator Mount */}
        <mesh ref={rightPistonRef} position={[2.8, 6.8, 0.45]} material={doorDetailMat}>
          <cylinderGeometry args={[0.18, 0.22, 2.2, 8]} />
        </mesh>
      </group>

      {/* Over-Arch Heavy Header Lintel Beam (Houses Door Rail Tracks) */}
      <mesh position={[0, 14.8, 0]} material={doorDetailMat} castShadow receiveShadow>
        <boxGeometry args={[19.2, 1.2, 1.2]} />
      </mesh>
      {/* Recessed Cyan Lintel Power Rail */}
      <mesh position={[0, 14.3, 0.62]} material={energySeamMat}>
        <planeGeometry args={[17.5, 0.1]} />
      </mesh>

      {/* ================================================================= */}
      {/* 3. ATMOSPHERIC PORTAL LIGHTING & VOLUMETRIC BEAMS                */}
      {/* ================================================================= */}
      {/* Subtle Portal Center Ambient Glow */}
      <pointLight
        ref={portalGlowRef}
        position={[0, 8.5, -3]}
        color="#38bdf8"
        intensity={0.4}
        distance={25}
        decay={2}
      />

      {/* Ground portal threshold guide strips (Cyan) */}
      <mesh position={[-8.5, 0.05, 0]}>
        <boxGeometry args={[0.3, 0.1, 4]} />
        <meshBasicMaterial color="#00f0ff" />
      </mesh>
      <mesh position={[8.5, 0.05, 0]}>
        <boxGeometry args={[0.3, 0.1, 4]} />
        <meshBasicMaterial color="#00f0ff" />
      </mesh>
    </group>
  );
};

useGLTF.preload('/cyberpunk_torii_gate.glb');
