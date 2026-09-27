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

  // Focus mode for Hall of Fame inspection without dragon obstruction
  const isFocusMode = useRef(false);
  const focusOffset = useRef({ x: 0, y: 0, z: 0 });

  // Keyboard listeners for free movement anywhere in the world
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      keysPressed.current[e.code] = true;
      keysPressed.current[e.key] = true;
      if (e.key) keysPressed.current[e.key.toLowerCase()] = true;

      // Toggle focus mode when in the vicinity of the Hall of Fame exhibit (Z < -200)
      if ((e.code === 'KeyF' || e.key === 'f' || e.key === 'F') && phoenixFlightState.position.z < -200) {
        const nextMode = !isFocusMode.current;
        isFocusMode.current = nextMode;
        phoenixFlightState.isFocusMode = nextMode;
        if (!nextMode) {
          focusOffset.current = { x: 0, y: 0, z: 0 };
        }
      }
      if (e.code === 'Escape' || e.key === 'Escape') {
        isFocusMode.current = false;
        phoenixFlightState.isFocusMode = false;
        focusOffset.current = { x: 0, y: 0, z: 0 };
      }
    };
    const handleKeyUp = (e: KeyboardEvent) => {
      keysPressed.current[e.code] = false;
      keysPressed.current[e.key] = false;
      if (e.key) keysPressed.current[e.key.toLowerCase()] = false;
    };

    const handleWheel = (e: WheelEvent) => {
      if (isFocusMode.current) {
        // Vertical wheel scrolling moves camera up and down the monument board
        focusOffset.current.y = THREE.MathUtils.clamp(
          focusOffset.current.y - Math.sign(e.deltaY) * 2.8,
          -22.0,
          18.0
        );
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    window.addEventListener('wheel', handleWheel, { passive: true });

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      window.removeEventListener('wheel', handleWheel);
    };
  }, []);

  useFrame(({ pointer }, delta) => {
    const clampedDelta = Math.min(delta, 0.1);

    // ===================================================================
    // 1. THIRD-PERSON CAMERA FOLLOWING BEHIND PHOENIX IN THE CITY
    // ===================================================================
    if (progress >= 0.70) {
      const pPos = phoenixFlightState.position;
      const fwd = phoenixFlightState.forward;

      // Sync focus mode from external state if toggled via HUD button
      if (phoenixFlightState.isFocusMode !== isFocusMode.current) {
        isFocusMode.current = phoenixFlightState.isFocusMode;
      }

      // Automatically leave focus mode if player flies back into the city
      if (pPos.z > -180 && isFocusMode.current) {
        isFocusMode.current = false;
        phoenixFlightState.isFocusMode = false;
      }

      let idealX: number;
      let idealY: number;
      let idealZ: number;
      let idealLookX: number;
      let idealLookY: number;
      let idealLookZ: number;

      if (isFocusMode.current) {
        // Active Pan Controls in Focus Mode: Left, Right, Down, Up (A, D, S, W, Arrow Keys)
        const panSpeed = 24.0;
        const isLeft =
          keysPressed.current['ArrowLeft'] ||
          keysPressed.current['KeyA'] ||
          keysPressed.current['a'];
        const isRight =
          keysPressed.current['ArrowRight'] ||
          keysPressed.current['KeyD'] ||
          keysPressed.current['d'];
        const isDown =
          keysPressed.current['ArrowDown'] ||
          keysPressed.current['KeyS'] ||
          keysPressed.current['s'] ||
          keysPressed.current['ShiftLeft'] ||
          keysPressed.current['ShiftRight'] ||
          keysPressed.current['KeyC'] ||
          keysPressed.current['c'];
        const isUp =
          keysPressed.current['ArrowUp'] ||
          keysPressed.current['KeyW'] ||
          keysPressed.current['w'] ||
          keysPressed.current['Space'] ||
          keysPressed.current['KeyE'] ||
          keysPressed.current['e'];

        if (isLeft) {
          focusOffset.current.x = Math.max(-34.0, focusOffset.current.x - panSpeed * clampedDelta);
        }
        if (isRight) {
          focusOffset.current.x = Math.min(34.0, focusOffset.current.x + panSpeed * clampedDelta);
        }
        if (isDown) {
          // Pan down toward CONNECT WITH ME and lower foundation credentials
          focusOffset.current.y = Math.max(-22.0, focusOffset.current.y - panSpeed * clampedDelta);
        }
        if (isUp) {
          // Pan up toward top cybersecurity certificates
          focusOffset.current.y = Math.min(18.0, focusOffset.current.y + panSpeed * clampedDelta);
        }

        // Museum gallery framing with active pan offsets:
        // Spans left to right (-34m to +34m) and down to up (Y=4.5m to Y=44.5m)
        idealX = focusOffset.current.x + pointer.x * 4.5;
        idealY = 26.5 + focusOffset.current.y + pointer.y * 3.5;
        idealZ = -322.0 + focusOffset.current.z;

        idealLookX = focusOffset.current.x * 0.94 + pointer.x * 2.0;
        idealLookY = 27.5 + focusOffset.current.y * 0.94 + pointer.y * 1.5;
        idealLookZ = -360.0;
      } else {
        // Proximity to the Hall of Fame at Z = -360
        const hofProximity = THREE.MathUtils.clamp((-pPos.z - 250) / 75, 0, 1);

        // Elevated third-person view: when near Hall of Fame, raise camera significantly (18.5m)
        // and pull back so the phoenix drops to the lower screen edge and leaves the board unobstructed
        const camDist = THREE.MathUtils.lerp(22.5, 32.0, hofProximity);
        const camHeight = THREE.MathUtils.lerp(7.8, 18.5, hofProximity);

        idealX = pPos.x - fwd.x * camDist;
        idealY = pPos.y + camHeight;
        idealZ = pPos.z - fwd.z * camDist;

        idealLookX = pPos.x + fwd.x * 12.0 + pointer.x * 2.0;
        idealLookY = pPos.y + THREE.MathUtils.lerp(-1.0, 11.5, hofProximity) + pointer.y * 1.5;
        idealLookZ = pPos.z + fwd.z * 12.0;
      }

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
