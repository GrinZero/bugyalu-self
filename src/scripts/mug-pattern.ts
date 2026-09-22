import * as THREE from 'three';
/** Re-drawn from the user's mug photo; the photograph itself is not published. */
export function mugPattern() {
  const canvas = document.createElement('canvas'); canvas.width = 1024; canvas.height = 512;
  const c = canvas.getContext('2d')!;
  c.fillStyle = '#f6f1df'; c.fillRect(0, 0, 1024, 512);
  const colors = ['#efa92c', '#ec7746', '#5797a0', '#505385', '#23677e'];
  for (let i = 0; i < 36; i++) {
    const x = (i * 173 + 37) % 1024, y = (i * 113 + 45) % 512;
    if (Math.abs(x - 512) < 170 && Math.abs(y - 265) < 75) continue;
    c.strokeStyle = c.fillStyle = colors[i % 5]; c.lineWidth = 7;
    c.save(); c.translate(x, y); c.rotate(i * 0.7); c.beginPath();
    if (i % 3 === 0) {
      for (let j = 0; j < 10; j++) { const a = j * Math.PI / 5, r = j % 2 ? 11 : 23; c.lineTo(Math.cos(a) * r, Math.sin(a) * r); }
      c.closePath(); c.stroke();
    } else if (i % 3 === 1) {
      c.moveTo(-16, -7); c.lineTo(-8, 7); c.lineTo(0, -7); c.lineTo(8, 7); c.lineTo(16, -7); c.stroke();
    } else { c.moveTo(-11, -12); c.lineTo(14, 0); c.lineTo(-11, 12); c.closePath(); c.fill(); }
    c.restore();
  }
  c.font = 'bold 78px sans-serif'; c.textAlign = 'center';
  c.fillStyle = '#589ca6'; c.fillText('mi', 431, 280); c.fillStyle = '#245c78'; c.fillText('HoYo', 565, 280);
  c.font = '13px sans-serif'; c.fillStyle = '#778786'; c.fillText('TECH OTAKUS SAVE THE WORLD', 512, 309);
  const texture = new THREE.CanvasTexture(canvas); texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}
