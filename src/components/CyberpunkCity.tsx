import React, { useMemo, useRef, useEffect } from 'react';
import * as THREE from 'three';
import { useGLTF } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import { registerCityCollisionMeshes } from '../flight/phoenixFlightStore';

interface CyberpunkCityProps {
  revealProgress: number;
}

interface AnimatedNeonMaterial {
  material: THREE.MeshStandardMaterial;
  baseIntensity: number;
  pulseSpeed: number;
  phaseOffset: number;
  flickerRate?: number;
  isBeacon?: boolean;
}

export const CyberpunkCity: React.FC<CyberpunkCityProps> = ({ revealProgress }) => {
  // Load the user's cybercity .glb model from public folder
  const { scene } = useGLTF('/cybercity.glb');

  // Root city container ref
  const cityGroupRef = useRef<THREE.Group>(null);

  // Animated material registry ref for useFrame updates
  const animatedMatsRef = useRef<AnimatedNeonMaterial[]>([]);

  // Prepare cloned scene with high-contrast cyberpunk materials (80% dark metallic + 20% intense neon)
  const { model, scale, offset, animatedMaterials } = useMemo(() => {
    const clone = scene.clone();
    const animRegistry: AnimatedNeonMaterial[] = [];

    // Load clean publicity texture with iPOP completely erased
    const cleanPublicityTex = new THREE.TextureLoader().load('/textures/publicity_2d_clean.png');
    cleanPublicityTex.colorSpace = THREE.SRGBColorSpace;
    cleanPublicityTex.flipY = false;

    // 1. Purge all tree/foliage meshes and nodes from the city model
    const treeObjects: THREE.Object3D[] = [];
    clone.traverse((child) => {
      const mesh = child as THREE.Mesh;
      const mat = mesh.material;
      const matName = mat
        ? Array.isArray(mat)
          ? mat.map((m) => m.name).join(' ')
          : mat.name
        : '';

      const isTree =
        /tree|palm|foliage|plant|flora|leaf|leaves|pine|branch/i.test(child.name) ||
        /tree|palm|foliage|plant|flora|leaf|leaves|pine|branch/i.test(matName);

      if (isTree) {
        treeObjects.push(child);
      }
    });

    treeObjects.forEach((obj) => {
      obj.visible = false;
      if (obj.parent) {
        obj.parent.remove(obj);
      }
    });

    // 2. High-End Cyberpunk Material Transformation
    // Principle: 80% pitch-black / obsidian metallic architecture + 20% intense emissive neon details
    clone.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        const mesh = child as THREE.Mesh;
        mesh.castShadow = false;
        mesh.receiveShadow = true;

        if (mesh.material) {
          const originalMat = mesh.material as THREE.MeshStandardMaterial;
          const mat = originalMat.clone();
          const name = (mat.name || child.name || '').toLowerCase();

          // -------------------------------------------------------------
          // A. WINDOWS: Varied brightness, cyan, violet, amber, and unlit
          // -------------------------------------------------------------
          if (name.includes('windows_ilum_b')) {
            // Electric Cyan Windows (busy offices / data centers)
            mat.color = new THREE.Color('#38bdf8');
            mat.emissive = new THREE.Color('#00f0ff');
            mat.emissiveIntensity = 1.3;
            mat.roughness = 0.25;
            mat.metalness = 0.75;
            animRegistry.push({
              material: mat,
              baseIntensity: 1.3,
              pulseSpeed: 1.4,
              phaseOffset: 0.0,
              flickerRate: 0.02,
            });
          } else if (name.includes('windows_ilum_y')) {
            // Warm Amber / Neon Violet Windows (residential & luxury suites)
            mat.color = new THREE.Color('#fbbf24');
            mat.emissive = new THREE.Color('#f59e0b');
            mat.emissiveIntensity = 1.1;
            mat.roughness = 0.25;
            mat.metalness = 0.75;
            animRegistry.push({
              material: mat,
              baseIntensity: 1.1,
              pulseSpeed: 1.8,
              phaseOffset: 2.1,
              flickerRate: 0.015,
            });
          } else if (name.includes('windows_no_emit')) {
            // Unlit Dark Glass Windows with high specular reflectivity
            mat.color = new THREE.Color('#050811');
            mat.emissive = new THREE.Color('#01040a');
            mat.emissiveIntensity = 0.05;
            mat.roughness = 0.15;
            mat.metalness = 0.95;
          }

          // -------------------------------------------------------------
          // B. NEON ARCHITECTURAL STRIPS & ACCENT LINES
          // -------------------------------------------------------------
          else if (name.includes('buildings_neon')) {
            // Skyscraper vertical light conduits & edge strips (electric cyan)
            mat.color = new THREE.Color('#00f0ff');
            mat.emissive = new THREE.Color('#00f0ff');
            mat.emissiveIntensity = 1.6;
            mat.roughness = 0.15;
            mat.metalness = 0.2;
            animRegistry.push({
              material: mat,
              baseIntensity: 1.6,
              pulseSpeed: 2.2,
              phaseOffset: 1.0,
            });
          } else if (name.includes('top') && (name.includes('building') || name.includes('adds'))) {
            // Rooftop crowns, penthouse edges & floor bands (vibrant violet / magenta)
            mat.color = new THREE.Color('#0b0f19');
            mat.emissive = new THREE.Color('#8b5cf6');
            mat.emissiveIntensity = 1.0;
            mat.roughness = 0.35;
            mat.metalness = 0.85;
            animRegistry.push({
              material: mat,
              baseIntensity: 1.0,
              pulseSpeed: 1.1,
              phaseOffset: 3.4,
            });
          }

          // -------------------------------------------------------------
          // C. HOLOGRAPHIC BILLBOARDS & COMMERCIAL NEON
          // -------------------------------------------------------------
          else if (name.includes('publicity_2d')) {
            // Replace texture with clean non-iPOP version
            mat.map = cleanPublicityTex;
            mat.emissiveMap = cleanPublicityTex;
            mat.emissive = new THREE.Color('#ffffff');
            mat.emissiveIntensity = 0.85;
            mat.roughness = 0.25;
            mat.metalness = 0.2;
            mat.transparent = true;
            mat.depthWrite = true;

            // Purge all geometry quads mapping to iPOP
            if (mesh.geometry) {
              const geom = mesh.geometry;
              const uvAttr = geom.attributes.uv;
              const posAttr = geom.attributes.position;
              const indexAttr = geom.index;

              if (indexAttr && uvAttr && posAttr) {
                const indices = indexAttr.array;
                for (let i = 0; i < indices.length; i += 6) {
                  const q = [
                    indices[i],
                    indices[i + 1],
                    indices[i + 2],
                    indices[i + 3],
                    indices[i + 4],
                    indices[i + 5],
                  ];
                  const minU = Math.min(...q.map((idx) => uvAttr.getX(idx)));
                  const maxU = Math.max(...q.map((idx) => uvAttr.getX(idx)));
                  const minV = Math.min(...q.map((idx) => uvAttr.getY(idx)));
                  const maxV = Math.max(...q.map((idx) => uvAttr.getY(idx)));

                  // iPOP billboard UV regions
                  const isIpop =
                    (minU <= 0.25 && maxV >= 0.65) ||
                    (minU >= 0.75 && maxV >= 0.45) ||
                    (minU >= 0.38 && maxU <= 0.62 && minV >= 0.55);

                  if (isIpop) {
                    q.forEach((idx) => {
                      posAttr.setXYZ(idx, 0, -9999, 0);
                    });
                  }
                }
                posAttr.needsUpdate = true;
              }
            }
          } else if (name.includes('hologram') || name.includes('publicity')) {
            let neonColor = '#00f0ff';
            if (name.includes('pink') || name.includes('red')) neonColor = '#f43f5e';
            else if (name.includes('orange') || name.includes('yellow')) neonColor = '#f97316';
            else if (name.includes('green')) neonColor = '#10b981';
            else if (name.includes('blue')) neonColor = '#38bdf8';
            else neonColor = '#d946ef';

            mat.emissive = new THREE.Color(neonColor);
            mat.emissiveIntensity = 1.8;
            mat.roughness = 0.2;
            mat.metalness = 0.3;
            animRegistry.push({
              material: mat,
              baseIntensity: 1.8,
              pulseSpeed: 2.8,
              phaseOffset: Math.random() * Math.PI * 2,
              flickerRate: 0.04,
            });
          }

          // -------------------------------------------------------------
          // D. AVIATION BEACONS & WARNING LIGHTS
          // -------------------------------------------------------------
          else if (name.includes('red_light') || name.includes('beacon')) {
            mat.color = new THREE.Color('#ff0033');
            mat.emissive = new THREE.Color('#ff0033');
            mat.emissiveIntensity = 2.0;
            animRegistry.push({
              material: mat,
              baseIntensity: 2.0,
              pulseSpeed: 3.2,
              phaseOffset: 0.0,
              isBeacon: true,
            });
          }

          // -------------------------------------------------------------
          // E. ROADS & STREET GRID: Wet dark asphalt with glowing lane edges
          // -------------------------------------------------------------
          else if (name.includes('streets_outline')) {
            // Neon cyan road-edge guide ribbons
            mat.color = new THREE.Color('#00f0ff');
            mat.emissive = new THREE.Color('#00f0ff');
            mat.emissiveIntensity = 1.2;
            animRegistry.push({
              material: mat,
              baseIntensity: 1.2,
              pulseSpeed: 1.6,
              phaseOffset: 0.5,
            });
          } else if (name.includes('sidewalks_outline')) {
            // Neon magenta sidewalk boundaries
            mat.color = new THREE.Color('#d946ef');
            mat.emissive = new THREE.Color('#d946ef');
            mat.emissiveIntensity = 1.0;
          } else if (name.includes('street') || name.includes('road')) {
            // Wet-look dark asphalt that reflects city lights
            mat.color = new THREE.Color('#04070e');
            mat.emissive = new THREE.Color('#010307');
            mat.emissiveIntensity = 0.05;
            mat.roughness = 0.25; // Wet sheen
            mat.metalness = 0.75;
          } else if (name.includes('sidewalk')) {
            // Dark obsidian pavement
            mat.color = new THREE.Color('#070a13');
            mat.roughness = 0.55;
            mat.metalness = 0.45;
          }

          // -------------------------------------------------------------
          // F. HIGH-SPEED TRANSIT & INFRASTRUCTURE
          // -------------------------------------------------------------
          else if (name.includes('hyper_loop') || name.includes('bridge')) {
            mat.color = new THREE.Color('#0a1122');
            mat.emissive = new THREE.Color('#6366f1');
            mat.emissiveIntensity = 1.2;
            mat.roughness = 0.25;
            mat.metalness = 0.8;
            animRegistry.push({
              material: mat,
              baseIntensity: 1.2,
              pulseSpeed: 3.5,
              phaseOffset: 1.4,
            });
          } else if (name.includes('lamp')) {
            mat.color = new THREE.Color('#38bdf8');
            mat.emissive = new THREE.Color('#38bdf8');
            mat.emissiveIntensity = 1.5;
          }

          // -------------------------------------------------------------
          // G. MAIN BUILDING FACADES (The 80% Dark Metallic Architecture)
          // -------------------------------------------------------------
          else {
            mat.color = new THREE.Color('#060912');
            mat.emissive = new THREE.Color('#020409');
            mat.emissiveIntensity = 0.08;
            mat.roughness = 0.35;
            mat.metalness = 0.88;
          }

          mesh.material = mat;
        }
      }
    });

    // Compute bounding box and placement
    const box = new THREE.Box3().setFromObject(clone);
    const size = new THREE.Vector3();
    const center = new THREE.Vector3();
    box.getSize(size);
    box.getCenter(center);

    const maxHorizontal = Math.max(size.x, size.z);
    const targetScale = maxHorizontal > 0 ? 280 / maxHorizontal : 0.25;

    const offsetX = -center.x * targetScale;
    const offsetY = -box.min.y * targetScale;
    const offsetZ = -center.z * targetScale;

    return {
      model: clone,
      scale: targetScale,
      offset: [offsetX, offsetY, offsetZ] as [number, number, number],
      animatedMaterials: animRegistry,
    };
  }, [scene]);

  // Synchronize ref
  animatedMatsRef.current = animatedMaterials;

  // Register solid building meshes for dragon 3D obstacle avoidance
  useEffect(() => {
    if (!cityGroupRef.current) return;
    cityGroupRef.current.updateMatrixWorld(true);

    const solidColliders: THREE.Mesh[] = [];
    model.traverse((child: THREE.Object3D) => {
      if ((child as THREE.Mesh).isMesh) {
        const mesh = child as THREE.Mesh;
        const name = (mesh.name || '').toLowerCase();
        // Collect solid building architecture, towers, window blocks
        if (
          name.includes('building') ||
          name.includes('window') ||
          name.includes('tower') ||
          name.includes('bridge') ||
          name.includes('adds')
        ) {
          solidColliders.push(mesh);
        }
      }
    });

    registerCityCollisionMeshes(solidColliders);
  }, [model]);

  // 3. Dynamic Organic Light Animation in useFrame
  useFrame(({ clock }) => {
    const time = clock.getElapsedTime();

    animatedMatsRef.current.forEach((item) => {
      if (item.isBeacon) {
        // Aviation strobe pulse: quick double flash every cycle
        const cycle = (time * item.pulseSpeed + item.phaseOffset) % Math.PI;
        const flash = Math.sin(cycle) > 0.82 ? 1.0 : 0.12;
        item.material.emissiveIntensity = item.baseIntensity * flash;
      } else {
        // Organic sinusoidal pulse
        const wave = 0.78 + 0.22 * Math.sin(time * item.pulseSpeed + item.phaseOffset);

        // Subtle micro-flicker for neon authenticity
        let flicker = 1.0;
        if (item.flickerRate && Math.random() < item.flickerRate) {
          flicker = 0.4 + Math.random() * 0.4;
        }

        item.material.emissiveIntensity = item.baseIntensity * wave * flicker;
      }
    });
  });

  // 4. Strategic Cyberpunk Ground Traffic Streaks (gliding along road grid)
  const trafficCount = 42;
  const trafficVehicles = useMemo(() => {
    return Array.from({ length: trafficCount }, (_, i) => {
      const isEastWest = i % 2 === 0;
      const speed = (18 + (i % 5) * 6) * (i % 3 === 0 ? -1 : 1);
      const isHeadlight = i % 2 === 0;
      const color = isHeadlight ? '#00f0ff' : '#f43f5e';
      const laneOffset = ((i * 17) % 180) - 90;
      return {
        isEastWest,
        speed,
        color,
        laneOffset,
        y: 1.2 + (i % 3) * 0.4,
        startPos: ((i * 31) % 240) - 120,
      };
    });
  }, [trafficCount]);

  const trafficMeshRef = useRef<THREE.InstancedMesh>(null);
  const trafficDummy = useMemo(() => new THREE.Object3D(), []);

  useFrame(({ clock }) => {
    if (!trafficMeshRef.current) return;
    const time = clock.getElapsedTime();

    trafficVehicles.forEach((v, i) => {
      let x = 0;
      let z = 0;
      if (v.isEastWest) {
        x = ((v.startPos + time * v.speed + 120) % 240) - 120;
        z = v.laneOffset;
        trafficDummy.rotation.set(0, v.speed > 0 ? Math.PI / 2 : -Math.PI / 2, 0);
      } else {
        x = v.laneOffset;
        z = ((v.startPos + time * v.speed + 120) % 240) - 120;
        trafficDummy.rotation.set(0, v.speed > 0 ? 0 : Math.PI, 0);
      }

      trafficDummy.position.set(x, v.y, z);
      trafficDummy.scale.set(0.6, 0.4, 2.8);
      trafficDummy.updateMatrix();
      trafficMeshRef.current?.setMatrixAt(i, trafficDummy.matrix);
    });

    trafficMeshRef.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <group ref={cityGroupRef} position={[0, 0, -140]}>
      {/* 1. User's Upgraded Cyber City Model */}
      <primitive object={model} scale={[scale, scale, scale]} position={offset} />

      {/* 2. Moving Cyber Traffic Streaks on Ground Roads */}
      <instancedMesh
        ref={trafficMeshRef}
        args={[undefined, undefined, trafficCount]}
      >
        <boxGeometry args={[1, 1, 1]} />
        <meshBasicMaterial color="#38bdf8" transparent opacity={0.85} />
      </instancedMesh>

      {/* 3. Strategic Cyberpunk City Lighting (Rich High-Contrast Night Atmosphere) */}
      {/* Cool electric cyan rim light catching skyscraper summits */}
      <directionalLight
        position={[60, 95, -110]}
        intensity={Math.max(0.3, revealProgress * 0.9)}
        color="#38bdf8"
      />

      {/* Deep vibrant violet fill light from opposite angle */}
      <directionalLight
        position={[-65, 80, -170]}
        intensity={Math.max(0.2, revealProgress * 0.7)}
        color="#8b5cf6"
      />

      {/* High-altitude cyan moonlight defining architectural silhouettes */}
      <directionalLight
        position={[0, 120, -140]}
        intensity={Math.max(0.2, revealProgress * 0.6)}
        color="#06b6d4"
      />

    </group>
  );
};

useGLTF.preload('/cybercity.glb');
