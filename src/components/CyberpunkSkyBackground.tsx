import React, { useMemo, useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';

export const CyberpunkSkyBackground: React.FC = () => {
  const skyMaterialRef = useRef<THREE.ShaderMaterial>(null);

  // 1. 360-DEGREE SEAMLESS CYBERPUNK SKY DOME SHADER
  const skyShader = useMemo(() => {
    return {
      uniforms: {
        topColor: { value: new THREE.Color('#010206') }, // Zenith deep space
        midColor: { value: new THREE.Color('#080614') }, // Upper atmosphere cyber-purple
        horizonCyan: { value: new THREE.Color('#061426') }, // Deep midnight horizon
        horizonMagenta: { value: new THREE.Color('#14051a') }, // Subtle dusk violet
        time: { value: 0 },
      },
      vertexShader: `
        varying vec3 vWorldPosition;
        varying vec2 vUv;
        void main() {
          vUv = uv;
          vec4 worldPosition = modelMatrix * vec4(position, 1.0);
          vWorldPosition = worldPosition.xyz;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform vec3 topColor;
        uniform vec3 midColor;
        uniform vec3 horizonCyan;
        uniform vec3 horizonMagenta;
        uniform float time;
        varying vec3 vWorldPosition;
        varying vec2 vUv;

        void main() {
          vec3 nPos = normalize(vWorldPosition);
          float h = nPos.y;

          // Upper sky gradient from purple into deep space zenith
          vec3 upperSky = mix(midColor, topColor, smoothstep(0.10, 0.75, max(0.0, h)));

          // Dual-tone horizon lighting: subtle midnight cyan and soft violet
          float angle = atan(nPos.z, nPos.x);
          float dualTone = sin(angle + 0.8) * 0.5 + 0.5;
          vec3 horizonColor = mix(horizonCyan, horizonMagenta, dualTone);

          // Atmospheric city light pollution glow on lower sky
          float horizonGlow = exp(-max(0.0, h) * 6.5);
          vec3 sky = mix(upperSky, horizonColor, horizonGlow * 0.65);

          // Subtle digital scanline & atmospheric neon waves
          float scanline = sin(vUv.y * 380.0) * 0.008;
          float aurora = sin(nPos.x * 5.0 + time * 0.25) * cos(nPos.z * 5.0 + time * 0.18) * 0.015;
          
          if (h > 0.05 && h < 0.65) {
            sky += vec3(0.02, 0.01, 0.04) * (aurora + scanline);
          }

          // Deep horizon ground falloff matching fog
          if (h < 0.0) {
            sky = mix(sky, vec3(0.01, 0.015, 0.025), clamp(-h * 4.0, 0.0, 1.0));
          }

          gl_FragColor = vec4(sky, 1.0);
        }
      `,
    };
  }, []);

  // 2. TWINKLING CYBER DATA STARS
  const starCount = 1800;
  const { starPositions, starColors } = useMemo(() => {
    const pos = new Float32Array(starCount * 3);
    const col = new Float32Array(starCount * 3);

    for (let i = 0; i < starCount; i++) {
      // Distribute on sphere upper dome
      const u = Math.random();
      const v = Math.random() * 0.75 + 0.10; // Upper dome
      const theta = u * 2.0 * Math.PI;
      const phi = Math.acos(2.0 * v - 1.0);
      const r = 520.0 + Math.random() * 40.0;

      pos[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      pos[i * 3 + 1] = Math.abs(r * Math.cos(phi)) + 15.0;
      pos[i * 3 + 2] = r * Math.sin(phi) * Math.sin(theta);

      // Cyber colors: diamond white, neon cyan, soft violet
      const palette = [
        [0.95, 0.98, 1.0],
        [0.35, 0.85, 1.0],
        [0.85, 0.55, 1.0],
        [1.0, 0.85, 0.95],
      ];
      const c = palette[i % palette.length];
      col[i * 3] = c[0];
      col[i * 3 + 1] = c[1];
      col[i * 3 + 2] = c[2];
    }

    return { starPositions: pos, starColors: col };
  }, [starCount]);

  // Animation Loop
  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    if (skyMaterialRef.current) {
      skyMaterialRef.current.uniforms.time.value = t;
    }
  });

  return (
    <group>
      {/* 1. 360-DEGREE SEAMLESS CYBERPUNK SKY DOME */}
      <mesh>
        <sphereGeometry args={[560, 36, 24]} />
        <shaderMaterial
          ref={skyMaterialRef}
          args={[skyShader]}
          side={THREE.BackSide}
          depthWrite={false}
          fog={false}
        />
      </mesh>

      {/* 2. TWINKLING CYBER STARS */}
      <points>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[starPositions, 3]}
          />
          <bufferAttribute
            attach="attributes-color"
            args={[starColors, 3]}
          />
        </bufferGeometry>
        <pointsMaterial
          size={1.6}
          vertexColors
          transparent
          opacity={0.85}
          fog={false}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </points>

      {/* 3. EXPANSIVE METROPOLITAN GROUND HORIZON */}
      <mesh position={[0, -0.4, -140]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[1400, 1400]} />
        <meshStandardMaterial
          color="#03060c"
          roughness={0.75}
          metalness={0.4}
        />
      </mesh>
    </group>
  );
};
