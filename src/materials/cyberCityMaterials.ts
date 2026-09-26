import * as THREE from 'three';

// Procedural skyscraper window & metallic panelling textures
export function createSkyscraperTexture(): {
  colorMap: THREE.CanvasTexture;
  emissiveMap: THREE.CanvasTexture;
} {
  const size = 1024;

  // Diffuse Canvas
  const cCanvas = document.createElement('canvas');
  cCanvas.width = size;
  cCanvas.height = size;
  const cCtx = cCanvas.getContext('2d')!;

  // Emissive Canvas
  const eCanvas = document.createElement('canvas');
  eCanvas.width = size;
  eCanvas.height = size;
  const eCtx = eCanvas.getContext('2d')!;

  // Base dark architectural alloy
  cCtx.fillStyle = '#0a0d12';
  cCtx.fillRect(0, 0, size, size);

  eCtx.fillStyle = '#000000';
  eCtx.fillRect(0, 0, size, size);

  // Structural column mullions
  const cols = 16;
  const rows = 32;
  const colW = size / cols;
  const rowH = size / rows;

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const x = c * colW + 4;
      const y = r * rowH + 4;
      const w = colW - 8;
      const h = rowH - 8;

      // Dark tinted glass in diffuse
      cCtx.fillStyle = '#141a24';
      cCtx.fillRect(x, y, w, h);

      // Random window illumination in emissive
      const rand = Math.random();
      if (rand > 0.62) {
        // Active illuminated window
        let emissiveColor = '#64dfdf'; // cool cyan
        if (rand > 0.88) emissiveColor = '#ffb703'; // warm amber
        else if (rand > 0.82) emissiveColor = '#7209b7'; // violet

        eCtx.fillStyle = emissiveColor;
        eCtx.fillRect(x, y, w, h);

        // Also tint diffuse window
        cCtx.fillStyle = emissiveColor;
        cCtx.fillRect(x, y, w, h);
      }
    }
  }

  // Vertical structural lighting strip down one facade seam
  eCtx.fillStyle = 'rgba(100, 223, 223, 0.8)';
  eCtx.fillRect(colW * 4 - 2, 0, 4, size);
  eCtx.fillRect(colW * 12 - 2, 0, 4, size);

  const colorMap = new THREE.CanvasTexture(cCanvas);
  colorMap.wrapS = THREE.RepeatWrapping;
  colorMap.wrapT = THREE.RepeatWrapping;

  const emissiveMap = new THREE.CanvasTexture(eCanvas);
  emissiveMap.wrapS = THREE.RepeatWrapping;
  emissiveMap.wrapT = THREE.RepeatWrapping;

  return { colorMap, emissiveMap };
}

// Procedural wet reflective cyberpunk city asphalt with neon lane lines
export function createCyberBoulevardTexture(): THREE.CanvasTexture {
  const size = 1024;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d')!;

  // Deep wet asphalt
  ctx.fillStyle = '#080a0e';
  ctx.fillRect(0, 0, size, size);

  // Micro surface noise
  const imgData = ctx.getImageData(0, 0, size, size);
  const data = imgData.data;
  for (let i = 0; i < data.length; i += 4) {
    const grain = (Math.random() - 0.5) * 14;
    data[i] = Math.max(0, Math.min(40, 8 + grain));
    data[i + 1] = Math.max(0, Math.min(45, 10 + grain));
    data[i + 2] = Math.max(0, Math.min(55, 14 + grain));
  }
  ctx.putImageData(imgData, 0, 0);

  // Center glowing neon traffic guide stripes
  ctx.fillStyle = '#5eead4';
  const lineWidth = 6;
  const centerX = size / 2;

  // Dual dashed neon lines
  for (let y = 0; y < size; y += 64) {
    ctx.fillRect(centerX - 16, y, lineWidth, 36);
    ctx.fillRect(centerX + 10, y, lineWidth, 36);
  }

  // Flanking curb neon channels
  ctx.fillStyle = '#38bdf8';
  ctx.fillRect(40, 0, 4, size);
  ctx.fillRect(size - 44, 0, 4, size);

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(1, 16);
  return texture;
}

// Holographic Cyber Billboard Textures
export function createHologramTexture(title: string, sub: string, accentColor: string): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 512;
  const ctx = canvas.getContext('2d')!;

  // Dark transparent backing with scanline overlay
  ctx.fillStyle = 'rgba(6, 10, 18, 0.88)';
  ctx.fillRect(0, 0, 1024, 512);

  // Outer glowing border
  ctx.strokeStyle = accentColor;
  ctx.lineWidth = 6;
  ctx.strokeRect(16, 16, 1024 - 32, 512 - 32);

  // Scanline grid
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
  ctx.lineWidth = 1;
  for (let y = 0; y < 512; y += 8) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(1024, y);
    ctx.stroke();
  }

  // Title Typography
  ctx.textAlign = 'center';
  ctx.fillStyle = accentColor;
  ctx.font = '700 64px "Space Grotesk", sans-serif';
  ctx.letterSpacing = '0.15em';
  ctx.shadowColor = accentColor;
  ctx.shadowBlur = 18;
  ctx.fillText(title, 512, 220);

  // Subtitle
  ctx.fillStyle = '#ffffff';
  ctx.font = '400 28px "JetBrains Mono", monospace';
  ctx.letterSpacing = '0.25em';
  ctx.shadowBlur = 8;
  ctx.fillText(sub, 512, 310);

  // Corner tech glyphs
  ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
  ctx.font = '400 16px "JetBrains Mono", monospace';
  ctx.fillText('// PRATHAM.SYS · VER 4.0', 220, 64);
  ctx.fillText('STATUS: ONLINE //', 840, 64);

  const texture = new THREE.CanvasTexture(canvas);
  texture.needsUpdate = true;
  return texture;
}
