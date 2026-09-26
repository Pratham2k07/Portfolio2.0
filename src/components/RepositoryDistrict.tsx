import React, { useMemo, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { RepositoryBuilding, type RepoData } from './RepositoryBuilding';
import { StreetFurniture } from './StreetFurniture';
import { HallOfFame } from './HallOfFame';

export const RepositoryDistrict: React.FC = () => {
  // Proximity states
  const [nearbyRepoId, setNearbyRepoId] = useState<string | null>(null);

  // 6 Unique Signature Repositories
  const repositories: RepoData[] = useMemo(
    () => [
      {
        id: 'neural-nexus',
        name: 'NEURAL-NEXUS',
        category: 'Autonomous Agent Framework',
        tagline: 'Multi-agent orchestration & neural reasoning pipelines',
        stars: 482,
        forks: 64,
        language: 'TypeScript / Python',
        accentColor: '#38bdf8',
        secondaryColor: '#0284c7',
        techStack: ['Agentic AI', 'ONNX', 'LangGraph', 'WebSockets'],
        position: [-26, 0, -42],
        rotationY: Math.PI / 12,
        archType: 'monolith',
      },
      {
        id: 'kinetic-void',
        name: 'KINETIC-VOID',
        category: 'Real-Time Shader & Physics Engine',
        tagline: 'High-performance WebGL & WebGPU graphics toolkit',
        stars: 624,
        forks: 89,
        language: 'GLSL / TypeScript',
        accentColor: '#f59e0b',
        secondaryColor: '#d97706',
        techStack: ['Three.js', 'WebGPU', 'Compute Shaders', 'Post-FX'],
        position: [27, 0, -75],
        rotationY: -Math.PI / 10,
        archType: 'prism',
      },
      {
        id: 'synapse-protocol',
        name: 'SYNAPSE-PROTOCOL',
        category: 'P2P Mesh & Distributed State',
        tagline: 'Decentralized peer-to-peer event mesh & sync runtime',
        stars: 340,
        forks: 41,
        language: 'Rust / Go',
        accentColor: '#a855f7',
        secondaryColor: '#7e22ce',
        techStack: ['Rust', 'WebRTC', 'libp2p', 'CRDTs'],
        position: [-30, 0, -112],
        rotationY: Math.PI / 8,
        archType: 'orbital',
      },
      {
        id: 'hyper-canvas',
        name: 'HYPER-CANVAS',
        category: 'Creative Tech & Generative UI',
        tagline: 'Sculptural interactive web components and micro-interactions',
        stars: 512,
        forks: 73,
        language: 'TypeScript / React',
        accentColor: '#10b981',
        secondaryColor: '#059669',
        techStack: ['React Three Fiber', 'GSAP', 'Canvas 2D', 'Custom Shaders'],
        position: [25, 0, -148],
        rotationY: -Math.PI / 12,
        archType: 'cantilever',
      },
      {
        id: 'chrono-pulse',
        name: 'CHRONO-PULSE',
        category: 'Low-Latency Concurrency Engine',
        tagline: 'Zero-allocation event loop & high-throughput memory buffers',
        stars: 295,
        forks: 36,
        language: 'C++ / TypeScript',
        accentColor: '#ec4899',
        secondaryColor: '#db2777',
        techStack: ['C++20', 'SIMD', 'Lock-Free Queues', 'Benchmark Suite'],
        position: [-24, 0, -185],
        rotationY: Math.PI / 14,
        archType: 'blade',
      },
      {
        id: 'aether-audio',
        name: 'AETHER-AUDIO',
        category: 'Procedural DSP & Audio Synthesis',
        tagline: 'Web Audio API modular synth and reactive sound spatializer',
        stars: 388,
        forks: 52,
        language: 'TypeScript / WebAssembly',
        accentColor: '#06b6d4',
        secondaryColor: '#0891b2',
        techStack: ['AudioWorklet', 'FFT Analyzer', 'Procedural Synthesis', 'WASM'],
        position: [28, 0, -212],
        rotationY: -Math.PI / 8,
        archType: 'baffle',
      },
    ],
    []
  );

  // Street furniture layout points
  const furnitureZ = useMemo(
    () => [-30, -55, -80, -105, -130, -155, -180, -205],
    []
  );

  // Track proximity to visitor camera
  useFrame(({ camera }) => {
    let closestId: string | null = null;
    let minDistance = 24; // Detection radius

    repositories.forEach((repo) => {
      const dx = camera.position.x - repo.position[0];
      const dz = camera.position.z - repo.position[2];
      const dist = Math.sqrt(dx * dx + dz * dz);
      if (dist < minDistance) {
        minDistance = dist;
        closestId = repo.id;
      }
    });

    if (closestId !== nearbyRepoId) {
      setNearbyRepoId(closestId);
    }
  });

  return (
    <group>
      {/* ================================================================= */}
      {/* 1. UNIQUE REPOSITORY BUILDINGS                                    */}
      {/* ================================================================= */}
      {repositories.map((repo) => {
        const isNearby = repo.id === nearbyRepoId;
        return (
          <RepositoryBuilding
            key={repo.id}
            repo={repo}
            isNearby={isNearby}
            distanceToPlayer={0}
          />
        );
      })}

      {/* ================================================================= */}
      {/* 2. CYBERPUNK STREET FURNITURE & INFRASTRUCTURE                    */}
      {/* ================================================================= */}
      <StreetFurniture zPositions={furnitureZ} />

      {/* ================================================================= */}
      {/* 3. MONUMENTAL HALL OF FAME BILLBOARD AT DISTRICT END              */}
      {/* ================================================================= */}
      <HallOfFame position={[0, 0, -240]} />
    </group>
  );
};
