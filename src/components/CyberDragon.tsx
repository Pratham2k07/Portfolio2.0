import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';
import { useGLTF, useAnimations } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import {
  phoenixFlightState,
  resetPhoenixPosition,
  cityCollisionMeshes,
  MIN_SAFE_ALTITUDE,
  MAX_SAFE_ALTITUDE,
} from '../flight/phoenixFlightStore';

interface CyberDragonProps {
  progress: number;
}

export const CyberDragon: React.FC<CyberDragonProps> = ({ progress }) => {
  const group = useRef<THREE.Group>(null);

  // Load the authentic animated phoenix GLB model from public folder
  const { scene, animations } = useGLTF('/phoenix_bird.glb');
  const { actions, names } = useAnimations(animations, group);

  // Keyboard input state
  const keys = useRef<{ [key: string]: boolean }>({});

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      keys.current[e.code] = true;
      keys.current[e.key] = true;
      if (e.key) keys.current[e.key.toLowerCase()] = true;
    };
    const onKeyUp = (e: KeyboardEvent) => {
      keys.current[e.code] = false;
      keys.current[e.key] = false;
      if (e.key) keys.current[e.key.toLowerCase()] = false;
    };

    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('keyup', onKeyUp);
    return () => {
      window.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('keyup', onKeyUp);
    };
  }, []);

  // Ensure SkinnedMeshes are double-sided with metallic specular reflectivity catching city neon
  useEffect(() => {
    scene.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        const mesh = child as THREE.Mesh;
        mesh.visible = true;
        mesh.frustumCulled = false;
        mesh.castShadow = true;
        mesh.receiveShadow = false;

        if (mesh.material) {
          const mat = mesh.material as THREE.MeshStandardMaterial;
          mat.side = THREE.DoubleSide;
          mat.transparent = true;
          mat.depthWrite = true;
          mat.roughness = 0.45;
          mat.metalness = 0.15;
          if (mat.emissive) {
            mat.emissive = new THREE.Color('#000000');
            mat.emissiveIntensity = 0;
          }
        }
      }
    });
  }, [scene]);

  // Continuous flight animation
  useEffect(() => {
    const animName = names.find((n) => /take|fly|wing/i.test(n)) || names[0] || 'Take 001';
    if (actions && actions[animName]) {
      const action = actions[animName];
      action.reset().fadeIn(0.2).play();
      action.timeScale = 1.0;
    }
  }, [actions, names]);

  // Track flight transition
  const wasFlightMode = useRef<boolean>(false);

  // Persistent reusable collision raycasters for zero-garbage collection
  const forwardRaycaster = useRef(new THREE.Raycaster());
  const leftWingRaycaster = useRef(new THREE.Raycaster());
  const rightWingRaycaster = useRef(new THREE.Raycaster());
  const lateralRaycaster = useRef(new THREE.Raycaster());

  useFrame(({ clock }, delta) => {
    if (!group.current) return;
    const clampedDelta = Math.min(delta, 0.08);
    const time = clock.getElapsedTime();

    // Flight mode activates at or past the gate portal
    const isFlightMode = progress >= 0.70;
    phoenixFlightState.isFlightMode = isFlightMode;

    if (!isFlightMode) {
      wasFlightMode.current = false;
      // Before entering the gate: The bird must NOT appear!
      group.current.visible = false;
      return;
    }

    // Entering the gate: The bird emerges and takes flight!
    group.current.visible = true;

    // Just crossed the gate threshold: Initialize at rooftop skyline height
    if (!wasFlightMode.current) {
      wasFlightMode.current = true;
      resetPhoenixPosition(-24);
    }

    // =========================================================================
    // 1. PLAYER INPUT HANDLING WITH INERTIA & NATURAL DRIFT
    // =========================================================================
    const modalOpen = phoenixFlightState.isModalOpen;
    const isW = !modalOpen && (keys.current['KeyW'] || keys.current['w'] || keys.current['ArrowUp']);
    const isS = !modalOpen && (keys.current['KeyS'] || keys.current['s'] || keys.current['ArrowDown']);
    const isA = !modalOpen && (keys.current['KeyA'] || keys.current['a'] || keys.current['ArrowLeft']);
    const isD = !modalOpen && (keys.current['KeyD'] || keys.current['d'] || keys.current['ArrowRight']);

    // Ascend: Space or E
    const isAscend =
      !modalOpen &&
      (keys.current['Space'] ||
        keys.current[' '] ||
        keys.current['KeyE'] ||
        keys.current['e']);

    // Descend: Shift, C, Q, or Ctrl
    const isDescend =
      !modalOpen &&
      (keys.current['ShiftLeft'] ||
        keys.current['ShiftRight'] ||
        keys.current['Shift'] ||
        keys.current['shift'] ||
        keys.current['KeyC'] ||
        keys.current['c'] ||
        keys.current['KeyQ'] ||
        keys.current['q'] ||
        keys.current['ControlLeft'] ||
        keys.current['ControlRight'] ||
        keys.current['Control'] ||
        keys.current['control']);

    // =========================================================================
    // 2. REALISTIC FLIGHT ACCELERATION & MOMENTUM
    // =========================================================================
    let targetSpeed = 0.0;
    if (isW) {
      targetSpeed = 26.0; // Powered thrust forward
    } else if (isS) {
      targetSpeed = 6.0; // Airbrake glide
    } else {
      targetSpeed = 0.0; // Stationary hover/glide
    }

    // Smooth inertia acceleration & deceleration
    phoenixFlightState.speed = THREE.MathUtils.damp(
      phoenixFlightState.speed,
      targetSpeed,
      3.2,
      clampedDelta
    );

    // Dynamic wing flap speed: active flapping on thrust, graceful gliding when stationary
    const animName = names.find((n) => /take|fly|wing/i.test(n)) || names[0] || 'Take 001';
    if (actions && actions[animName]) {
      const targetTimeScale = isW ? 1.35 : isS ? 0.75 : 0.85;
      actions[animName].timeScale = THREE.MathUtils.damp(
        actions[animName].timeScale,
        targetTimeScale,
        3.0,
        clampedDelta
      );
    }

    // =========================================================================
    // 3. TURNING RADIUS, ANGULAR INERTIA & VISUAL BANKING (ROLL)
    // =========================================================================
    let targetYawRate = 0.0;
    if (isA) {
      targetYawRate = 1.15; // Gentle wide aerodynamic turning radius left
    } else if (isD) {
      targetYawRate = -1.15; // Gentle wide aerodynamic turning radius right
    }

    // Smooth angular momentum for realistic creature inertia
    phoenixFlightState.yawVelocity = THREE.MathUtils.damp(
      phoenixFlightState.yawVelocity,
      targetYawRate,
      3.8,
      clampedDelta
    );
    phoenixFlightState.yaw += phoenixFlightState.yawVelocity * clampedDelta;

    // Visual leaning into turns: dragon gracefully banks its wings with turn rate
    const targetRoll = -phoenixFlightState.yawVelocity * 0.44;
    phoenixFlightState.roll = THREE.MathUtils.damp(
      phoenixFlightState.roll,
      targetRoll,
      4.5,
      clampedDelta
    );

    // =========================================================================
    // 4. ALTITUDE CONTROL: ROOFTOP TO SKYLINE HEIGHT WITH GROUND-EFFECT CUSHION
    // =========================================================================
    let targetVertSpeed = 0.0;
    if (isAscend) {
      targetVertSpeed = 15.0; // Smooth climb
    } else if (isDescend) {
      targetVertSpeed = -15.0; // Controlled dive
    }

    // Aerodynamic lift cushion: as dragon nears minimum safe altitude, gently level off
    if (phoenixFlightState.position.y < MIN_SAFE_ALTITUDE + 3.0 && targetVertSpeed < 0) {
      targetVertSpeed = 0;
    }

    phoenixFlightState.verticalSpeed = THREE.MathUtils.damp(
      phoenixFlightState.verticalSpeed,
      targetVertSpeed,
      3.5,
      clampedDelta
    );

    // Gradual pitch changes: nose elevates during climb, dips gently on dive
    const targetPitch =
      (phoenixFlightState.verticalSpeed / 15.0) * 0.24 -
      (phoenixFlightState.speed / 26.0) * 0.035;
    phoenixFlightState.pitch = THREE.MathUtils.damp(
      phoenixFlightState.pitch,
      targetPitch,
      4.0,
      clampedDelta
    );

    // =========================================================================
    // 5. VELOCITY INTEGRATION & FORWARD ORIENTATION
    // =========================================================================
    const sinY = Math.sin(phoenixFlightState.yaw);
    const cosY = Math.cos(phoenixFlightState.yaw);
    phoenixFlightState.forward.set(-sinY, 0, -cosY);

    // Left and Right wingtip vectors for wingspan collision
    const leftVec = new THREE.Vector3(-cosY, 0, sinY);
    const rightVec = new THREE.Vector3(cosY, 0, -sinY);

    // Natural 3D velocity with momentum
    const targetVelocity = phoenixFlightState.forward
      .clone()
      .multiplyScalar(phoenixFlightState.speed);
    targetVelocity.y = phoenixFlightState.verticalSpeed;

    phoenixFlightState.velocity.lerp(
      targetVelocity,
      Math.min(1.0, clampedDelta * 4.5)
    );

    // Advance position by integrated velocity
    phoenixFlightState.position.x += phoenixFlightState.velocity.x * clampedDelta;
    phoenixFlightState.position.y += phoenixFlightState.velocity.y * clampedDelta;
    phoenixFlightState.position.z += phoenixFlightState.velocity.z * clampedDelta;

    // Strict altitude clamp: dragon is kept well above streets and within city ceiling
    phoenixFlightState.position.y = Math.max(
      MIN_SAFE_ALTITUDE,
      Math.min(MAX_SAFE_ALTITUDE, phoenixFlightState.position.y)
    );
    phoenixFlightState.altitude = phoenixFlightState.position.y;

    // =========================================================================
    // 6. 3D BUILDING COLLISION DETECTION & SMOOTH FACADE DEFLECTION
    // =========================================================================
    if (cityCollisionMeshes && cityCollisionMeshes.length > 0) {
      const probeOrigin = phoenixFlightState.position.clone();
      const fwd = phoenixFlightState.forward;

      // 1. Center forward ray probe
      forwardRaycaster.current.set(probeOrigin, fwd);
      forwardRaycaster.current.far = 9.0;
      const centerHits = forwardRaycaster.current.intersectObjects(
        cityCollisionMeshes,
        false
      );

      // 2. Left wingtip forward probe (wingspan width ~4.2 units left)
      const leftOrigin = probeOrigin.clone().addScaledVector(leftVec, 4.2);
      leftWingRaycaster.current.set(leftOrigin, fwd);
      leftWingRaycaster.current.far = 8.0;
      const leftHits = leftWingRaycaster.current.intersectObjects(
        cityCollisionMeshes,
        false
      );

      // 3. Right wingtip forward probe (wingspan width ~4.2 units right)
      const rightOrigin = probeOrigin.clone().addScaledVector(rightVec, 4.2);
      rightWingRaycaster.current.set(rightOrigin, fwd);
      rightWingRaycaster.current.far = 8.0;
      const rightHits = rightWingRaycaster.current.intersectObjects(
        cityCollisionMeshes,
        false
      );

      // Identify closest obstacle hit across body and wingspan
      let closestHit: THREE.Intersection | null = null;
      let hitSource: 'center' | 'left' | 'right' = 'center';

      if (centerHits.length > 0) {
        closestHit = centerHits[0];
        hitSource = 'center';
      }
      if (
        leftHits.length > 0 &&
        (!closestHit || leftHits[0].distance < closestHit.distance)
      ) {
        closestHit = leftHits[0];
        hitSource = 'left';
      }
      if (
        rightHits.length > 0 &&
        (!closestHit || rightHits[0].distance < closestHit.distance)
      ) {
        closestHit = rightHits[0];
        hitSource = 'right';
      }

      // Handle building proximity & collision
      if (closestHit) {
        const worldNormal = closestHit.face
          ? closestHit.face.normal
              .clone()
              .transformDirection(closestHit.object.matrixWorld)
              .normalize()
          : fwd.clone().negate();
        worldNormal.y = 0; // horizontal planar deflection
        if (worldNormal.lengthSq() > 0.001) worldNormal.normalize();

        // A. Aerodynamic Steering Deflection (glance smoothly around buildings)
        let steerDir = 1.0;
        if (hitSource === 'left') {
          steerDir = -1.2; // Steer right away from left-side obstacle
        } else if (hitSource === 'right') {
          steerDir = 1.2; // Steer left away from right-side obstacle
        } else {
          // Center hit: steer toward the side that the wall faces
          const cross = fwd.clone().cross(worldNormal);
          steerDir = cross.y > 0 ? 1.4 : -1.4;
        }

        phoenixFlightState.yawVelocity = THREE.MathUtils.lerp(
          phoenixFlightState.yawVelocity,
          steerDir * 1.5,
          clampedDelta * 4.2
        );

        // B. Wingspan Penetration Prevention (hard clearance safety envelope)
        const SAFETY_MARGIN = 5.2; // Full body and wingspan clearance
        if (closestHit.distance < SAFETY_MARGIN) {
          const penetration = SAFETY_MARGIN - closestHit.distance;
          // Smoothly displace dragon out of the building facade
          phoenixFlightState.position.addScaledVector(
            worldNormal,
            penetration * 1.25
          );

          // Slide velocity along facade plane (zero penetration through walls)
          const normalVel = phoenixFlightState.velocity.dot(worldNormal);
          if (normalVel < 0) {
            phoenixFlightState.velocity.sub(
              worldNormal.clone().multiplyScalar(normalVel)
            );
          }
          phoenixFlightState.speed = Math.max(
            0,
            phoenixFlightState.velocity.length() * 0.8
          );
        }
      }

      // 4. Lateral Omni-Directional Clearance Probes (prevent clipping on tight turns)
      const lateralDirections = [
        new THREE.Vector3(1, 0, 0),
        new THREE.Vector3(-1, 0, 0),
        new THREE.Vector3(0, 0, 1),
        new THREE.Vector3(0, 0, -1),
      ];

      lateralDirections.forEach((dir) => {
        lateralRaycaster.current.set(phoenixFlightState.position, dir);
        lateralRaycaster.current.far = 4.6;
        const sideHits = lateralRaycaster.current.intersectObjects(
          cityCollisionMeshes,
          false
        );
        if (sideHits.length > 0 && sideHits[0].distance < 4.6) {
          const pushOut = (4.6 - sideHits[0].distance) * 1.1;
          phoenixFlightState.position.addScaledVector(dir, -pushOut);
        }
      });
    }

    // =========================================================================
    // 7. HORIZONTAL CITY METROPOLIS & HALL OF FAME WORLD BOUNDARIES
    // =========================================================================
    // Lateral X boundaries
    if (Math.abs(phoenixFlightState.position.x) > 130) {
      phoenixFlightState.position.x = Math.sign(phoenixFlightState.position.x) * 130;
      phoenixFlightState.yawVelocity = -Math.sign(phoenixFlightState.position.x) * 0.8;
    }
    // Southern boundary (toward entrance gate)
    if (phoenixFlightState.position.z > 15) {
      phoenixFlightState.position.z = 15;
      phoenixFlightState.yaw = THREE.MathUtils.lerp(phoenixFlightState.yaw, Math.PI, clampedDelta * 2.0);
    }
    // Northern boundary: End of the World past the Hall of Fame
    if (phoenixFlightState.position.z < -425) {
      phoenixFlightState.position.z = -425;
      phoenixFlightState.yaw = THREE.MathUtils.lerp(phoenixFlightState.yaw, 0, clampedDelta * 2.0);
    }

    // =========================================================================
    // 8. NATURAL BIOLOGICAL WING-BEAT BOBBING & ORIENTATION
    // =========================================================================
    const flapFreq = isW ? 4.2 : 2.5;
    const flapBob =
      Math.sin(time * flapFreq) *
      (phoenixFlightState.speed > 2.0 ? 0.32 : 0.12);

    group.current.position.set(
      phoenixFlightState.position.x,
      phoenixFlightState.position.y + flapBob,
      phoenixFlightState.position.z
    );

    group.current.rotation.set(
      phoenixFlightState.pitch,
      phoenixFlightState.yaw,
      phoenixFlightState.roll,
      'YXZ'
    );
  });

  return (
    <group ref={group} visible={true}>
      {/* 
        Inner positioning container:
        - Scale: 0.016 spans a majestic ~10.2 units wingspan
        - Rotation: +Math.PI / 2 aligns beak strictly forward (-Z)
        - Offset: [0, -2.8, -2.0] centers torso and wings exactly at origin
      */}
      <group
        position={[0, -2.8, -2.0]}
        rotation={[0, Math.PI / 2, 0]}
        scale={[0.016, 0.016, 0.016]}
      >
        <primitive object={scene} />
      </group>
    </group>
  );
};

useGLTF.preload('/phoenix_bird.glb');
