import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';
import { useFrame, useThree } from '@react-three/fiber';
import { phoenixFlightState } from '../flight/phoenixFlightStore';

interface CameraRigProps {
  progress: number;
  onZChange?: (z: number, normalizedProgress: number) => void;
}

export const CameraRig: React.FC<CameraRigProps> = ({
  progress,
  onZChange,
}) => {
  const { camera } = useThree();

  // Unified camera kinematic state (Slightly low cinematic arrival perspective)
  const pos = useRef(new THREE.Vector3(0, 3.8, 95));
  const lookAt = useRef(new THREE.Vector3(0, 5.8, 69));

  // Dynamic user offsets from WASD / flight
  const userOffset = useRef({ x: 0, y: 0 });
  const keysPressed = useRef<{ [key: string]: boolean }>({});

  // Mouse look angles (smooth Euler angles)
  const mouseLook = useRef({ x: 0, y: 0 });

  // Keyboard listeners for free movement anywhere in the world
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      keysPressed.current[e.code] = true;
    };
    const handleKeyUp = (e: KeyboardEvent) => {
      keysPressed.current[e.code] = false;
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  useFrame(({ pointer }, delta) => {
    const clampedDelta = Math.min(delta, 0.1);

    // ===================================================================
    // 1. THIRD-PERSON CAMERA FOLLOWING BEHIND PHOENIX IN THE CITY
    // ===================================================================
    if (progress >= 0.70) {
      // Elevated third-person view: complete dragon visible with city skyline panorama below
      const camDist = 22.5;
      const camHeight = 7.8;

      const pPos = phoenixFlightState.position;
      const fwd = phoenixFlightState.forward;

      // Position camera behind and slightly above the dragon with clearance
      const idealX = pPos.x - fwd.x * camDist;
      const idealY = pPos.y + camHeight;
      const idealZ = pPos.z - fwd.z * camDist;

      // Look slightly over and down towards the dragon and ahead into the city
      const idealLookX = pPos.x + fwd.x * 12.0 + pointer.x * 2.0;
      const idealLookY = pPos.y - 1.0 + pointer.y * 1.5;
      const idealLookZ = pPos.z + fwd.z * 12.0;

      // Smooth camera follow with natural aerodynamic inertia (zero jitter)
      pos.current.x = THREE.MathUtils.damp(pos.current.x, idealX, 3.8, clampedDelta);
      pos.current.y = THREE.MathUtils.damp(pos.current.y, idealY, 3.8, clampedDelta);
      pos.current.z = THREE.MathUtils.damp(pos.current.z, idealZ, 3.8, clampedDelta);

      lookAt.current.x = THREE.MathUtils.damp(lookAt.current.x, idealLookX, 4.2, clampedDelta);
      lookAt.current.y = THREE.MathUtils.damp(lookAt.current.y, idealLookY, 4.2, clampedDelta);
      lookAt.current.z = THREE.MathUtils.damp(lookAt.current.z, idealLookZ, 4.2, clampedDelta);

      camera.position.copy(pos.current);
      camera.lookAt(lookAt.current);

      if (onZChange) {
        onZChange(pos.current.z, progress);
      }
      return;
    }

    // ===================================================================
    // 2. CINEMATIC PRE-GATE CAMERA TRAJECTORY
    // Sequence: INTRO AREA (Z=95..83) -> AVENUE APPROACH (Z=83..24) -> GATE PORTAL PASSAGE (Z=24..-12)
    // ===================================================================
    let baseZ: number;
    let baseY: number;
    let baseLookY: number;
    let baseLookZ: number;

    if (progress < 0.28) {
      // 1. Intro Arrival Area: slightly low cinematic perspective looking up at architectural monument
      const p = progress / 0.28;
      baseZ = THREE.MathUtils.lerp(95, 83, p);
      baseY = THREE.MathUtils.lerp(3.8, 4.4, p);
      baseLookY = 5.8;
      baseLookZ = baseZ - 26; // looking toward monument at Z=74
    } else if (progress < 0.52) {
      // 2. Processional Avenue: gliding past monument toward the monumental gate
      const p = (progress - 0.28) / 0.24;
      baseZ = THREE.MathUtils.lerp(84, 24, p);
      baseY = THREE.MathUtils.lerp(5.5, 6.2, p);
      baseLookY = THREE.MathUtils.lerp(6.2, 8.5, p); // looking up at the towering gate at Z=0
      baseLookZ = THREE.MathUtils.lerp(baseZ - 30, -5, p);
    } else {
      // 3. Passing Through Gate: doors open, entering city threshold
      const p = (progress - 0.52) / 0.18;
      baseZ = THREE.MathUtils.lerp(24, -12, p);
      baseY = THREE.MathUtils.lerp(6.2, 7.2, p);
      baseLookY = THREE.MathUtils.lerp(8.5, 9.5, p);
      baseLookZ = -45; // looking straight into the illuminated city boulevard
    }

    // ===================================================================
    // 2. WASD FREE STRAFE & ALTITUDE CONTROL
    // ===================================================================
    const moveSpeed = (keysPressed.current['ShiftLeft'] ? 36 : 22) * clampedDelta;

    // A/D or Left/Right strafes laterally across the city streets
    if (keysPressed.current['KeyA'] || keysPressed.current['ArrowLeft']) {
      userOffset.current.x = Math.max(-45, userOffset.current.x - moveSpeed);
    }
    if (keysPressed.current['KeyD'] || keysPressed.current['ArrowRight']) {
      userOffset.current.x = Math.min(45, userOffset.current.x + moveSpeed);
    }
    // Space or E flies upward, Shift or Q descends
    if (keysPressed.current['Space'] || keysPressed.current['KeyE']) {
      userOffset.current.y = Math.min(45, userOffset.current.y + moveSpeed * 0.9);
    }
    if (keysPressed.current['ShiftLeft'] || keysPressed.current['ShiftRight'] || keysPressed.current['KeyQ']) {
      userOffset.current.y = Math.max(-10, userOffset.current.y - moveSpeed * 0.9);
    }

    // ===================================================================
    // 3. ORGANIC, ZERO-POP MOUSE LOOK
    // ===================================================================
    const targetMouseLookX = pointer.x * 12;
    const targetMouseLookY = pointer.y * 6;

    mouseLook.current.x = THREE.MathUtils.damp(mouseLook.current.x, targetMouseLookX, 5, clampedDelta);
    mouseLook.current.y = THREE.MathUtils.damp(mouseLook.current.y, targetMouseLookY, 5, clampedDelta);

    // ===================================================================
    // 4. UNIFIED CAMERA SMOOTH DAMPING
    // ===================================================================
    const targetCameraPos = new THREE.Vector3(
      userOffset.current.x + pointer.x * 1.2,
      baseY + userOffset.current.y + pointer.y * 0.5,
      baseZ
    );

    const targetCameraLook = new THREE.Vector3(
      userOffset.current.x * 0.6 + mouseLook.current.x,
      baseLookY + userOffset.current.y * 0.5 + mouseLook.current.y,
      baseLookZ
    );

    // High-mass fluid damping
    pos.current.lerp(targetCameraPos, Math.min(clampedDelta * 4.0, 1));
    lookAt.current.lerp(targetCameraLook, Math.min(clampedDelta * 4.2, 1));

    camera.position.copy(pos.current);
    camera.lookAt(lookAt.current);

    if (onZChange) {
      onZChange(pos.current.z, progress);
    }
  });

  return null;
};
