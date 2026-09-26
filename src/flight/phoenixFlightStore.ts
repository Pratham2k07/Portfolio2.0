import * as THREE from 'three';

export interface PhoenixFlightState {
  isFlightMode: boolean;
  isModalOpen: boolean;
  position: THREE.Vector3;
  forward: THREE.Vector3;
  velocity: THREE.Vector3;
  yaw: number;
  yawVelocity: number;
  pitch: number;
  roll: number;
  speed: number;
  turnRate: number;
  verticalSpeed: number;
  altitude: number;
}

export const MIN_SAFE_ALTITUDE = 12.0;
export const MAX_SAFE_ALTITUDE = 92.0;
export const DEFAULT_FLIGHT_ALTITUDE = 36.0;

export const phoenixFlightState: PhoenixFlightState = {
  isFlightMode: false,
  isModalOpen: false,
  position: new THREE.Vector3(0, DEFAULT_FLIGHT_ALTITUDE, -24),
  forward: new THREE.Vector3(0, 0, -1),
  velocity: new THREE.Vector3(0, 0, 0),
  yaw: 0,
  yawVelocity: 0,
  pitch: 0,
  roll: 0,
  speed: 0,
  turnRate: 0,
  verticalSpeed: 0,
  altitude: DEFAULT_FLIGHT_ALTITUDE,
};

// Registered solid building meshes for 3D obstacle avoidance and collision
export let cityCollisionMeshes: THREE.Mesh[] = [];

export function registerCityCollisionMeshes(meshes: THREE.Mesh[]) {
  cityCollisionMeshes = meshes;
}

// Reset to entrance gate exit point at safe rooftop skyline height
export function resetPhoenixPosition(zOffset = -24) {
  phoenixFlightState.position.set(0, DEFAULT_FLIGHT_ALTITUDE, zOffset);
  phoenixFlightState.forward.set(0, 0, -1);
  phoenixFlightState.velocity.set(0, 0, 0);
  phoenixFlightState.yaw = 0;
  phoenixFlightState.yawVelocity = 0;
  phoenixFlightState.pitch = 0;
  phoenixFlightState.roll = 0;
  phoenixFlightState.speed = 0;
  phoenixFlightState.verticalSpeed = 0;
  phoenixFlightState.altitude = DEFAULT_FLIGHT_ALTITUDE;
}
