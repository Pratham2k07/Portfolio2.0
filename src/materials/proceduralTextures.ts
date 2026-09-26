import * as THREE from 'three';

// Procedural texture generator for architectural basalt, brushed metal, and stone
export function createBasaltTexture(): THREE.CanvasTexture {
  const size = 1024;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d')!;

  // Base dark charcoal tone
  ctx.fillStyle = '#0f1115';
  ctx.fillRect(0, 0, size, size);

  // Layered noise for fine stone grain
  const imgData = ctx.getImageData(0, 0, size, size);
  const data = imgData.data;

  for (let i = 0; i < data.length; i += 4) {
    // Subtle per-pixel grain variation
    const noise = (Math.random() - 0.5) * 22;
    const base = 18 + noise;
    data[i] = Math.max(10, Math.min(45, base + 2));     // R
    data[i + 1] = Math.max(12, Math.min(48, base + 3)); // G
    data[i + 2] = Math.max(14, Math.min(55, base + 6)); // B - subtle cool tone
    data[i + 3] = 255;
  }
  ctx.putImageData(imgData, 0, 0);

  // Subtle architectural stratum lines (brutalist layered casting)
  ctx.fillStyle = 'rgba(255, 255, 255, 0.02)';
  for (let y = 0; y < size; y += 48 + Math.floor(Math.random() * 24)) {
    ctx.fillRect(0, y, size, 2);
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(4, 4);
  return texture;
}

export function createStoneNormalMap(): THREE.CanvasTexture {
  const size = 512;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d')!;

  // Flat normal base (128, 128, 255)
  ctx.fillStyle = 'rgb(128, 128, 255)';
  ctx.fillRect(0, 0, size, size);

  const imgData = ctx.getImageData(0, 0, size, size);
  const data = imgData.data;

  for (let i = 0; i < data.length; i += 4) {
    const nx = 128 + (Math.random() - 0.5) * 20;
    const ny = 128 + (Math.random() - 0.5) * 20;
    data[i] = nx;
    data[i + 1] = ny;
    data[i + 2] = 250;
    data[i + 3] = 255;
  }
  ctx.putImageData(imgData, 0, 0);

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(4, 4);
  return texture;
}

export function createFloorTileTexture(): THREE.CanvasTexture {
  const size = 1024;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d')!;

  // Deep dark ground
  ctx.fillStyle = '#0a0c10';
  ctx.fillRect(0, 0, size, size);

  // Architectural slabs / causeway tiles
  const gridSize = 128;
  ctx.strokeStyle = 'rgba(5, 7, 10, 0.9)';
  ctx.lineWidth = 3;

  for (let x = 0; x < size; x += gridSize) {
    for (let y = 0; y < size; y += gridSize) {
      // Slab tone variation
      const v = 12 + Math.floor(Math.random() * 8);
      ctx.fillStyle = `rgb(${v}, ${v + 1}, ${v + 3})`;
      ctx.fillRect(x + 2, y + 2, gridSize - 4, gridSize - 4);
      ctx.strokeRect(x, y, gridSize, gridSize);
    }
  }

  // Micro noise overlay
  const imgData = ctx.getImageData(0, 0, size, size);
  const data = imgData.data;
  for (let i = 0; i < data.length; i += 4) {
    const grain = (Math.random() - 0.5) * 12;
    data[i] = Math.max(0, Math.min(255, data[i] + grain));
    data[i + 1] = Math.max(0, Math.min(255, data[i + 1] + grain));
    data[i + 2] = Math.max(0, Math.min(255, data[i + 2] + grain));
  }
  ctx.putImageData(imgData, 0, 0);

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(8, 24);
  return texture;
}

// Integrated Architectural Typography Texture:
// Renders "PRATHAM LALWANI" and concise introduction physically mapped onto the monumental frieze
export function createArchitecturalFriezeTexture(): {
  colorMap: THREE.CanvasTexture;
  emissiveMap: THREE.CanvasTexture;
} {
  const width = 2048;
  const height = 512;

  // 1. Color / Diffuse Canvas (Dark textured granite with recessed engraved lettering)
  const cCanvas = document.createElement('canvas');
  cCanvas.width = width;
  cCanvas.height = height;
  const cCtx = cCanvas.getContext('2d')!;

  // 2. Emissive Canvas (Pure black with controlled, crisp warm emissive letter shapes)
  const eCanvas = document.createElement('canvas');
  eCanvas.width = width;
  eCanvas.height = height;
  const eCtx = eCanvas.getContext('2d')!;

  // Base background
  cCtx.fillStyle = '#0c0e12';
  cCtx.fillRect(0, 0, width, height);

  // Subtle panel borders & architectural division seams
  cCtx.strokeStyle = 'rgba(255, 255, 255, 0.04)';
  cCtx.lineWidth = 2;
  cCtx.strokeRect(20, 20, width - 40, height - 40);

  // Emissive canvas is pitch black
  eCtx.fillStyle = '#000000';
  eCtx.fillRect(0, 0, width, height);

  // Primary Typography: "PRATHAM"
  const titleText = 'P R A T H A M';
  cCtx.textAlign = 'center';
  cCtx.textBaseline = 'middle';
  eCtx.textAlign = 'center';
  eCtx.textBaseline = 'middle';

  // Architectural font styling
  cCtx.font = '600 78px "Space Grotesk", "Syne", -apple-system, sans-serif';
  eCtx.font = '600 78px "Space Grotesk", "Syne", -apple-system, sans-serif';

  const centerY = height * 0.44;

  // Diffuse: Light metallic stone tone
  cCtx.fillStyle = '#c5ccd6';
  cCtx.shadowColor = 'rgba(0, 0, 0, 0.9)';
  cCtx.shadowOffsetY = 4;
  cCtx.shadowBlur = 8;
  cCtx.fillText(titleText, width / 2, centerY);

  // Emissive: Subtle warm titanium glow
  eCtx.fillStyle = 'rgba(235, 240, 255, 0.92)';
  eCtx.shadowColor = 'rgba(220, 235, 255, 0.4)';
  eCtx.shadowBlur = 12;
  eCtx.fillText(titleText, width / 2, centerY);

  // Supporting Introduction Text (Clean, minimal, cinematic)
  const subText1 = 'CREATIVE TECHNOLOGIST  ·  DIGITAL ARCHITECT';
  const subText2 = 'CRAFTING IMMERSIVE DIGITAL REALITIES & INTERACTIVE SYSTEMS';

  // Diffuse Subtitle
  cCtx.shadowBlur = 0;
  cCtx.font = '400 24px "Space Grotesk", monospace';
  cCtx.fillStyle = '#828a96';
  cCtx.letterSpacing = '0.3em';
  cCtx.fillText(subText1, width / 2, centerY + 74);

  cCtx.font = '300 18px "Space Grotesk", monospace';
  cCtx.fillStyle = '#57606e';
  cCtx.letterSpacing = '0.35em';
  cCtx.fillText(subText2, width / 2, centerY + 114);

  // Emissive Subtitle (subtle, softer than the title)
  eCtx.shadowBlur = 0;
  eCtx.font = '400 24px "Space Grotesk", monospace';
  eCtx.fillStyle = 'rgba(180, 200, 230, 0.45)';
  eCtx.fillText(subText1, width / 2, centerY + 74);

  eCtx.font = '300 18px "Space Grotesk", monospace';
  eCtx.fillStyle = 'rgba(140, 160, 190, 0.3)';
  eCtx.fillText(subText2, width / 2, centerY + 114);

  // Subtle architectural glyphs / coordinates flanking the frieze
  cCtx.font = '400 16px "JetBrains Mono", monospace';
  cCtx.fillStyle = 'rgba(120, 130, 145, 0.4)';
  cCtx.fillText('// ARCHITECTURAL PORTAL · SCENE 01', 280, height - 42);
  cCtx.fillText('SYS.LOC 28.6139° N, 77.2090° E //', width - 280, height - 42);

  eCtx.font = '400 16px "JetBrains Mono", monospace';
  eCtx.fillStyle = 'rgba(150, 180, 220, 0.25)';
  eCtx.fillText('// ARCHITECTURAL PORTAL · SCENE 01', 280, height - 42);
  eCtx.fillText('SYS.LOC 28.6139° N, 77.2090° E //', width - 280, height - 42);

  const colorMap = new THREE.CanvasTexture(cCanvas);
  colorMap.needsUpdate = true;

  const emissiveMap = new THREE.CanvasTexture(eCanvas);
  emissiveMap.needsUpdate = true;

  return { colorMap, emissiveMap };
}
