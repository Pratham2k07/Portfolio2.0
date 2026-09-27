import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import * as THREE from 'three';
import { IntroArrivalArea } from './IntroArrivalArea';
import { MonumentalGate } from './MonumentalGate';
import { Atmosphere } from './Atmosphere';
import { CameraRig } from './CameraRig';
import { CyberpunkCity } from './CyberpunkCity';
import { CyberDragon } from './CyberDragon';
import { CityDistantBackground } from './CityDistantBackground';
import { CityBuildingRepositories } from './CityBuildingRepositories';
import { HallOfFameBuilding } from './HallOfFameBuilding';
import { CyberpunkSkyBackground } from './CyberpunkSkyBackground';
import { CyberpunkPostProcessing } from './CyberpunkPostProcessing';
import type { RepositoryProject } from '../data/repositoriesData';
import type { CertificationItem } from '../data/certificationsData';

interface EntranceSceneProps {
  progress: number;
  onZChange?: (z: number, normalizedProgress: number) => void;
  onSelectProject?: (project: RepositoryProject) => void;
  onSelectCertification?: (cert: CertificationItem) => void;
}

export const EntranceScene: React.FC<EntranceSceneProps> = ({
  progress,
  onZChange,
  onSelectProject,
  onSelectCertification,
}) => {
  // Compute reveal states across the journey:
  // Sequence: INTRO (0 - 0.30) -> GATE APPROACH (0.30 - 0.52) -> GATE OPENS (0.52 - 0.68) -> ENTER CITY & FLIGHT (0.70+)
  const atmosphereReveal = Math.min(1, Math.max(0, (progress - 0.02) / 0.35));
  const typographyReveal = Math.min(1, Math.max(0, (progress - 0.18) / 0.32));
  const openingProgress = Math.min(1, Math.max(0, (progress - 0.50) / 0.18));
  const cityReveal = Math.min(1, Math.max(0, (progress - 0.52) / 0.32));

  // Dynamic atmospheric fog density:
  // Shrouds city during intro and approach (0.0030), clearing smoothly as gate opens (0.0018)
  const fogDensity = THREE.MathUtils.lerp(0.0030, 0.0018, openingProgress);

  return (
    <div className="canvas-container">
      <Canvas
        shadows
        dpr={[1, 1.5]}
        gl={{
          antialias: true,
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 1.02,
          powerPreference: 'high-performance',
        }}
        camera={{ position: [0, 3.8, 95], fov: 48, near: 0.1, far: 1100 }}
      >
        {/* Cinematic Cyberpunk Atmosphere: deep midnight cyber-blue with atmospheric depth */}
        <color attach="background" args={['#040714']} />
        <fogExp2 attach="fog" args={['#060a18', fogDensity]} />

        {/* Ambient Lighting - brightens deep shadows so architecture remains visible */}
        <ambientLight intensity={0.42 + atmosphereReveal * 0.45} color="#cbd5e1" />

        {/* Entrance Gate Directional Moonlight */}
        <directionalLight
          position={[-25, 45, 40]}
          intensity={0.35 + atmosphereReveal * 1.8}
          color="#d0e1fd"
          castShadow
          shadow-mapSize-width={1024}
          shadow-mapSize-height={1024}
          shadow-camera-near={1}
          shadow-camera-far={260}
          shadow-camera-left={-45}
          shadow-camera-right={45}
          shadow-camera-top={55}
          shadow-camera-bottom={-20}
          shadow-bias={-0.0003}
        />

        {/* City Metropolis Overhead Moonlight (Illuminates central city from Z=-60 to Z=-320) */}
        <directionalLight
          position={[-35, 90, -170]}
          intensity={cityReveal * 1.85}
          color="#e0e7ff"
        />

        {/* Deep City North Fill Light (Covers northern repositories like aarambh-26, sabrang-26, guess-game) */}
        <directionalLight
          position={[35, 80, -250]}
          intensity={cityReveal * 1.45}
          color="#c084fc"
        />

        {/* Cyber Sky Horizon Fill Light: Subtle Atmospheric Rim */}
        <directionalLight
          position={[40, 60, -180]}
          intensity={cityReveal * 0.45}
          color="#38bdf8"
        />

        {/* Unified Smooth Continuous Camera Rig (Zero Discontinuity) */}
        <CameraRig progress={progress} onZChange={onZChange} />

        <Suspense fallback={null}>
          {/* Cyberpunk Atmospheric Skydome, Cyber Moon, Starfield & Megastructures */}
          <CyberpunkSkyBackground />

          {/* Causeway & Ground Atmosphere (Spans from Z=140 to Z=-40) */}
          <Atmosphere
            atmosphereReveal={atmosphereReveal}
            openingProgress={openingProgress}
          />

          {/* 1. SEPARATE INTRO ARRIVAL TERMINAL & ARCHITECTURAL MONUMENT (Z = 74) */}
          <IntroArrivalArea progress={progress} />

          {/* 2. MONUMENTAL GATE ARCHITECTURE (Z = 0) WITH HYDRAULIC BLAST DOORS */}
          <MonumentalGate
            openingProgress={openingProgress}
            typographyReveal={typographyReveal}
          />

          {/* 3. OUTER CYBERPUNK CITY METROPOLIS & SKYLINE */}
          <CyberpunkCity revealProgress={cityReveal} />

          {/* Living Metropolis: Distant Skyscraper Towers, Elevated Traffic & Beacons */}
          <CityDistantBackground />

          {/* Interactive Repositories Mapped to Existing City Buildings */}
          <CityBuildingRepositories onSelectProject={onSelectProject || (() => {})} />

          {/* 4. MONUMENTAL HALL OF FAME: FINAL DESTINATION AT THE END OF THE CITY (Z = -360) */}
          <HallOfFameBuilding onSelectCertification={onSelectCertification || (() => {})} />

          {/* Animated Cyber Phoenix in 3rd-Person View (Emerges after entering gate) */}
          <CyberDragon progress={progress} />

          {/* High-End Cinematic UnrealBloom Post-Processing Pass */}
          <CyberpunkPostProcessing
            bloomStrength={0.22}
            bloomRadius={0.25}
            bloomThreshold={0.95}
          />
        </Suspense>
      </Canvas>
    </div>
  );
};
