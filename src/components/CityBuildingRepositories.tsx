import React, { useRef, useState } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { Text, Billboard } from '@react-three/drei';
import { REPOSITORIES_DATA, type RepositoryProject } from '../data/repositoriesData';
import { phoenixFlightState } from '../flight/phoenixFlightStore';

interface CityBuildingRepositoriesProps {
  onSelectProject: (project: RepositoryProject) => void;
}

interface BuildingInteractionProps {
  repo: RepositoryProject;
  onSelect: (project: RepositoryProject) => void;
}

const ExistingBuildingInteraction: React.FC<BuildingInteractionProps> = ({ repo, onSelect }) => {
  const highlightLightRef = useRef<THREE.PointLight>(null);
  const signMeshRef = useRef<THREE.Mesh>(null);
  const borderMeshRef = useRef<THREE.Mesh>(null);
  const signGroupRef = useRef<THREE.Group>(null);
  const [hovered, setHovered] = useState<boolean>(false);

  const roofCenter = new THREE.Vector3(...repo.roofPosition);

  // Exact Sign Dimensions: compact, balanced architectural skyscraper signage
  const SIGN_WIDTH = 12.6;
  const SIGN_HEIGHT = 3.2;
  const MOUNT_HEIGHT = 1.6;
  const SIGN_Y_OFFSET = MOUNT_HEIGHT + SIGN_HEIGHT / 2; // 3.2m above roof surface

  useFrame(() => {
    const dist = phoenixFlightState.position.distanceTo(roofCenter);

    // 1. Proximity facade lighting (activates when phoenix approaches this building)
    const PROXIMITY_MAX = 60.0;
    const PROXIMITY_MIN = 15.0;
    let targetProx = 0;
    if (dist < PROXIMITY_MAX) {
      targetProx = Math.min(
        1.0,
        Math.max(0.0, (PROXIMITY_MAX - dist) / (PROXIMITY_MAX - PROXIMITY_MIN))
      );
    }

    if (highlightLightRef.current) {
      const targetIntensity = hovered ? 2.5 : targetProx * 1.8;
      highlightLightRef.current.intensity = THREE.MathUtils.lerp(
        highlightLightRef.current.intensity,
        targetIntensity,
        0.12
      );
    }

    // 2. Distance-based opacity: keeps skyline clean, fades out distant signs
    // Near (<55m): 100% visible & crisp. Far (>140m): faded/hidden
    const FADE_START = 50.0;
    const FADE_END = 140.0;
    let visibility = 1.0;
    if (dist > FADE_START) {
      visibility = Math.max(0.0, 1.0 - (dist - FADE_START) / (FADE_END - FADE_START));
    }

    if (signGroupRef.current) {
      // Subtle scale pop on hover, stays locked to 1.0 in world space
      const targetScale = hovered ? 1.06 : 1.0;
      const currentScale = signGroupRef.current.scale.x;
      const nextScale = THREE.MathUtils.lerp(currentScale, targetScale, 0.15);
      signGroupRef.current.scale.set(nextScale, nextScale, nextScale);
      signGroupRef.current.visible = visibility > 0.05;
    }

    if (signMeshRef.current && signMeshRef.current.material) {
      const mat = signMeshRef.current.material as THREE.MeshBasicMaterial;
      mat.opacity = THREE.MathUtils.lerp(mat.opacity, visibility * 0.90, 0.15);
    }
    if (borderMeshRef.current && borderMeshRef.current.material) {
      const mat = borderMeshRef.current.material as THREE.MeshBasicMaterial;
      const baseBorderOpacity = hovered ? 0.95 : 0.60;
      mat.opacity = THREE.MathUtils.lerp(mat.opacity, visibility * baseBorderOpacity, 0.15);
    }
  });

  return (
    // Root group is physically anchored to the building's exact roof center
    <group position={repo.roofPosition}>
      {/* 1. Structural Architectural Mounting Struts (Physical connection to roof) */}
      {/* Left pylon mast */}
      <mesh position={[-2.8, MOUNT_HEIGHT / 2, 0]}>
        <cylinderGeometry args={[0.08, 0.10, MOUNT_HEIGHT, 8]} />
        <meshStandardMaterial
          color="#0f172a"
          roughness={0.4}
          metalness={0.8}
        />
      </mesh>
      {/* Right pylon mast */}
      <mesh position={[2.8, MOUNT_HEIGHT / 2, 0]}>
        <cylinderGeometry args={[0.08, 0.10, MOUNT_HEIGHT, 8]} />
        <meshStandardMaterial
          color="#0f172a"
          roughness={0.4}
          metalness={0.8}
        />
      </mesh>
      {/* Rooftop anchor footplates */}
      <mesh position={[-2.8, 0.06, 0]}>
        <cylinderGeometry args={[0.45, 0.55, 0.12, 10]} />
        <meshBasicMaterial color={repo.accentColor} transparent opacity={0.65} />
      </mesh>
      <mesh position={[2.8, 0.06, 0]}>
        <cylinderGeometry args={[0.45, 0.55, 0.12, 10]} />
        <meshBasicMaterial color={repo.accentColor} transparent opacity={0.65} />
      </mesh>

      {/* 2. Facade Wash Light (Only illuminates building facade on approach) */}
      <pointLight
        ref={highlightLightRef}
        position={[0, -repo.buildingFootprint[1] * 0.25, 0]}
        color={repo.accentColor}
        intensity={0}
        distance={repo.buildingFootprint[0] * 1.8}
        decay={2}
      />

      {/* 3. Solid Raycast Click Collider covering the existing building geometry */}
      <mesh
        position={[0, -repo.buildingFootprint[1] / 2, 0]}
        onClick={(e) => {
          e.stopPropagation();
          onSelect(repo);
        }}
        onPointerOver={(e) => {
          e.stopPropagation();
          setHovered(true);
          document.body.style.cursor = 'pointer';
        }}
        onPointerOut={() => {
          setHovered(false);
          document.body.style.cursor = 'default';
        }}
        visible={false}
      >
        <boxGeometry args={repo.buildingFootprint} />
        <meshBasicMaterial transparent opacity={0} />
      </mesh>

      {/* 4. Architectural Building Sign (Directly above roof, faces camera without drifting) */}
      <group ref={signGroupRef} position={[0, SIGN_Y_OFFSET, 0]}>
        <Billboard follow={true} lockX={false} lockY={false} lockZ={false}>
          {/* Sign Glass Backing Plate */}
          <mesh
            ref={signMeshRef}
            onClick={(e) => {
              e.stopPropagation();
              onSelect(repo);
            }}
            onPointerOver={(e) => {
              e.stopPropagation();
              setHovered(true);
              document.body.style.cursor = 'pointer';
            }}
            onPointerOut={() => {
              setHovered(false);
              document.body.style.cursor = 'default';
            }}
          >
            <planeGeometry args={[SIGN_WIDTH, SIGN_HEIGHT]} />
            <meshBasicMaterial
              color="#030712"
              transparent
              opacity={0.90}
              side={THREE.DoubleSide}
            />
          </mesh>

          {/* Glowing Neon Outline Border */}
          <mesh ref={borderMeshRef} position={[0, 0, 0.01]}>
            <planeGeometry args={[SIGN_WIDTH + 0.12, SIGN_HEIGHT + 0.12]} />
            <meshBasicMaterial
              color={hovered ? '#ffffff' : repo.accentColor}
              wireframe
              transparent
              opacity={0.60}
            />
          </mesh>

          {/* Left Colored Accent Strip */}
          <mesh position={[-SIGN_WIDTH / 2 + 0.16, 0, 0.02]}>
            <planeGeometry args={[0.26, SIGN_HEIGHT - 0.28]} />
            <meshBasicMaterial
              color={repo.accentColor}
              transparent
              opacity={hovered ? 1.0 : 0.8}
            />
          </mesh>

          {/* Top Tag: CATEGORY / PLATFORM */}
          <Text
            position={[-SIGN_WIDTH / 2 + 0.65, 0.95, 0.05]}
            fontSize={0.38}
            color={repo.accentColor}
            anchorX="left"
            anchorY="middle"
            letterSpacing={0.06}
          >
            {`⬡ ${repo.category.toUpperCase()}`}
          </Text>

          {/* Center: REPOSITORY / PROJECT NAME */}
          <Text
            position={[-SIGN_WIDTH / 2 + 0.65, 0.22, 0.05]}
            fontSize={0.92}
            color={hovered ? '#ffffff' : '#f8fafc'}
            anchorX="left"
            anchorY="middle"
            letterSpacing={0.02}
          >
            {repo.name}
          </Text>

          {/* Bottom Bar: Interactive Cue or Tech Stack */}
          <Text
            position={[-SIGN_WIDTH / 2 + 0.65, -0.65, 0.05]}
            fontSize={0.34}
            color={hovered ? '#38bdf8' : '#94a3b8'}
            anchorX="left"
            anchorY="middle"
            letterSpacing={0.04}
          >
            {hovered ? '▶ CLICK BUILDING TO OPEN GITHUB REPO' : `[CLICK TO INSPECT] • ${repo.techStack.slice(0, 2).join(', ')}`}
          </Text>
        </Billboard>
      </group>
    </group>
  );
};

export const CityBuildingRepositories: React.FC<CityBuildingRepositoriesProps> = ({
  onSelectProject,
}) => {
  return (
    <group>
      {REPOSITORIES_DATA.map((repo) => (
        <ExistingBuildingInteraction
          key={repo.id}
          repo={repo}
          onSelect={onSelectProject}
        />
      ))}
    </group>
  );
};
