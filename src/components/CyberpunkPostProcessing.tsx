import React, { useEffect, useMemo } from 'react';
import * as THREE from 'three';
import { useThree, useFrame } from '@react-three/fiber';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';
import { OutputPass } from 'three/examples/jsm/postprocessing/OutputPass.js';

interface CyberpunkPostProcessingProps {
  bloomStrength?: number;
  bloomRadius?: number;
  bloomThreshold?: number;
}

export const CyberpunkPostProcessing: React.FC<CyberpunkPostProcessingProps> = ({
  bloomStrength = 0.85,
  bloomRadius = 0.45,
  bloomThreshold = 0.78,
}) => {
  const { gl, scene, camera, size } = useThree();

  const composer = useMemo(() => {
    // High dynamic range render target for clean bloom gradients without banding
    const renderTarget = new THREE.WebGLRenderTarget(size.width, size.height, {
      type: THREE.HalfFloatType,
      format: THREE.RGBAFormat,
      minFilter: THREE.LinearFilter,
      magFilter: THREE.LinearFilter,
      stencilBuffer: false,
      depthBuffer: true,
    });

    const comp = new EffectComposer(gl, renderTarget);
    comp.setSize(size.width, size.height);

    // 1. Base Scene Pass
    const renderPass = new RenderPass(scene, camera);
    comp.addPass(renderPass);

    // 2. High-Performance Unreal Bloom Pass
    // threshold: only pixels with luminance > 0.78 bloom (emissive neon & lights)
    // strength: 0.85 delivers a vivid glow without washing out dark architecture
    // radius: 0.45 keeps neon lines crisp with subtle atmospheric dispersion
    const bloomPass = new UnrealBloomPass(
      new THREE.Vector2(size.width, size.height),
      bloomStrength,
      bloomRadius,
      bloomThreshold
    );
    comp.addPass(bloomPass);

    // 3. Proper ACESFilmic / sRGB Tone Mapping Output Pass
    const outputPass = new OutputPass();
    comp.addPass(outputPass);

    return { comp, bloomPass };
  }, [gl, scene, camera, size.width, size.height, bloomStrength, bloomRadius, bloomThreshold]);

  // Handle window resizing
  useEffect(() => {
    composer.comp.setSize(size.width, size.height);
    composer.bloomPass.resolution.set(size.width, size.height);
  }, [composer, size.width, size.height]);

  // Take over render loop at priority 1
  useFrame(() => {
    composer.comp.render();
  }, 1);

  return null;
};
