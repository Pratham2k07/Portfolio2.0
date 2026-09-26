import React, { useMemo, useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';

export const CyberpunkSkyBackground: React.FC = () => {
  const moonGroupRef = useRef<THREE.Group>(null);
  const orbitalRing1Ref = useRef<THREE.Mesh>(null);
  const orbitalRing2Ref = useRef<THREE.Mesh>(null);
  const skyMaterialRef = useRef<THREE.ShaderMaterial>(null);
  const highTrafficRef = useRef<THREE.InstancedMesh>(null);

  // 1. CYBERPUNK SKY DOME SHADER
  const skyShader = useMemo(() => {
    return {
      uniforms: {
        topColor: { value: new THREE.Color('#02040b') }, // Zenith deep space
        midColor: { value: new THREE.Color('#140b2d') }, // Upper atmosphere cyber-purple
        horizonCyan: { value: new THREE.Color('#00d2ff') }, // Horizon cyan neon glow
        horizonMagenta: { value: new THREE.Color('#f43f5e') }, // Horizon hot pink glow
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

          // Dual-tone horizon lighting: blends cyan on one side, magenta on the other
          float angle = atan(nPos.z, nPos.x);
          float dualTone = sin(angle + 0.8) * 0.5 + 0.5;
          vec3 horizonColor = mix(horizonCyan, horizonMagenta, dualTone);

          // Atmospheric city light pollution glow on lower sky
          float horizonGlow = exp(-max(0.0, h) * 4.2);
          vec3 sky = mix(upperSky, horizonColor, horizonGlow * 0.82);

          // Subtle digital scanline & atmospheric neon waves
          float scanline = sin(vUv.y * 380.0) * 0.015;
          float aurora = sin(nPos.x * 5.0 + time * 0.25) * cos(nPos.z * 5.0 + time * 0.18) * 0.025;
          
          if (h > 0.05 && h < 0.65) {
            sky += vec3(0.04, 0.02, 0.08) * (aurora + scanline);
          }

          // Deep horizon ground falloff
          if (h < 0.0) {
            sky = mix(sky, vec3(0.01, 0.015, 0.03), clamp(-h * 4.0, 0.0, 1.0));
          }

          gl_FragColor = vec4(sky, 1.0);
        }
      `,
    };
  }, []);

  // 2. CELESTIAL CYBER MOON & MEGASTRUCTURE
  const moonPosition: [number, number, number] = [-150, 190, -360];

  // 3. TWINKLING CYBER DATA STARS
  const starCount = 1400;
  const { starPositions, starColors } = useMemo(() => {
    const pos = new Float32Array(starCount * 3);
    const col = new Float32Array(starCount * 3);

    for (let i = 0; i < starCount; i++) {
      // Distribute on sphere upper dome
      const u = Math.random();
      const v = Math.random() * 0.65 + 0.15; // Upper half
      const theta = u * 2.0 * Math.PI;
      const phi = Math.acos(2.0 * v - 1.0);
      const r = 520.0 + Math.random() * 40.0;

      pos[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      pos[i * 3 + 1] = Math.abs(r * Math.cos(phi)) + 20.0;
      pos[i * 3 + 2] = r * Math.sin(phi) * Math.sin(theta);

      // Cyber colors: diamond white, neon cyan, soft violet
      const palette = [
        [0.9, 0.95, 1.0],
        [0.2, 0.85, 1.0],
        [0.85, 0.45, 1.0],
        [1.0, 0.8, 0.9],
      ];
      const c = palette[i % palette.length];
      col[i * 3] = c[0];
      col[i * 3 + 1] = c[1];
      col[i * 3 + 2] = c[2];
    }

    return { starPositions: pos, starColors: col };
  }, []);

  // 4. HIGH-ALTITUDE STRATOSPHERIC FLYING TRANSPORTS (AERIAL SPINNERS)
  const highTrafficCount = 48;
  const highTrafficData = useMemo(() => {
    return Array.from({ length: highTrafficCount }, (_, i) => {
      const radius = 240 + (i % 5) * 50;
      const altitude = 110 + (i % 6) * 22;
      const speed = (0.08 + (i % 4) * 0.05) * (i % 2 === 0 ? 1 : -1);
      const startAngle = (i / highTrafficCount) * Math.PI * 2;
      const isCyan = i % 3 === 0;
      const color = isCyan ? new THREE.Color('#38bdf8') : new THREE.Color('#f43f5e');
      return { radius, altitude, speed, startAngle, color };
    });
  }, []);

  // Animation Loop
  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();

    // 1. Update sky shader time
    if (skyMaterialRef.current) {
      skyMaterialRef.current.uniforms.time.value = t;
    }

    // 2. Slowly rotate lunar orbital rings
    if (orbitalRing1Ref.current) {
      orbitalRing1Ref.current.rotation.z = t * 0.08;
    }
    if (orbitalRing2Ref.current) {
      orbitalRing2Ref.current.rotation.z = -t * 0.05;
    }

    // 3. Update high-altitude cruisers
    if (highTrafficRef.current) {
      const dummy = new THREE.Object3D();
      highTrafficData.forEach((cruiser, i) => {
        const curAngle = cruiser.startAngle + t * cruiser.speed * 0.25;
        const x = Math.sin(curAngle) * cruiser.radius;
        const z = -140 + Math.cos(curAngle) * cruiser.radius;
        const y = cruiser.altitude + Math.sin(t * 0.8 + i) * 2.0;

        dummy.position.set(x, y, z);
        dummy.rotation.y = curAngle + (cruiser.speed > 0 ? Math.PI / 2 : -Math.PI / 2);
        dummy.scale.set(2.4, 0.7, 5.8);
        dummy.updateMatrix();

        highTrafficRef.current?.setMatrixAt(i, dummy.matrix);
        highTrafficRef.current?.setColorAt(i, cruiser.color);
      });

      if (highTrafficRef.current.instanceColor) {
        highTrafficRef.current.instanceColor.needsUpdate = true;
      }
      highTrafficRef.current.instanceMatrix.needsUpdate = true;
    }
  });

  return (
    <group>
      {/* 1. 360-DEGREE CYBERPUNK SKY DOME */}
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

      {/* 3. CELESTIAL CYBER MOON & MEGASTRUCTURE */}
      <group ref={moonGroupRef} position={moonPosition}>
        {/* Core Cyber Moon */}
        <mesh>
          <sphereGeometry args={[38, 32, 32]} />
          <meshBasicMaterial color="#dbeafe" fog={false} />
        </mesh>

        {/* Soft Moon Corona Glow (Billboard) */}
        <mesh position={[0, 0, -2]}>
          <planeGeometry args={[115, 115]} />
          <meshBasicMaterial
            color="#38bdf8"
            transparent
            opacity={0.32}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
            side={THREE.DoubleSide}
            fog={false}
          />
        </mesh>
        <mesh position={[0, 0, -1]}>
          <planeGeometry args={[165, 165]} />
          <meshBasicMaterial
            color="#a855f7"
            transparent
            opacity={0.18}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
            side={THREE.DoubleSide}
            fog={false}
          />
        </mesh>

        {/* Orbital Megastructure Ring 1 */}
        <mesh ref={orbitalRing1Ref} rotation={[1.15, 0.45, 0]}>
          <ringGeometry args={[46, 51, 64]} />
          <meshBasicMaterial
            color="#00f0ff"
            transparent
            opacity={0.65}
            side={THREE.DoubleSide}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
            fog={false}
          />
        </mesh>

        {/* Orbital Megastructure Ring 2 */}
        <mesh ref={orbitalRing2Ref} rotation={[0.85, -0.65, 0.35]}>
          <ringGeometry args={[56, 58.5, 64]} />
          <meshBasicMaterial
            color="#f43f5e"
            transparent
            opacity={0.55}
            side={THREE.DoubleSide}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
            fog={false}
          />
        </mesh>
      </group>

      {/* 4. HIGH-ALTITUDE STRATOSPHERIC TRAFFIC */}
      <instancedMesh
        ref={highTrafficRef}
        args={[undefined, undefined, highTrafficCount]}
      >
        <boxGeometry args={[1, 1, 1]} />
        <meshBasicMaterial toneMapped={false} />
      </instancedMesh>

      {/* 5. EXPANSIVE METROPOLITAN GROUND HORIZON */}
      <mesh position={[0, -0.4, -140]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <circleGeometry args={[580, 64]} />
        <meshStandardMaterial
          color="#050814"
          roughness={0.9}
          metalness={0.15}
        />
      </mesh>
    </group>
  );
};
