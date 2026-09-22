import * as THREE from 'three';
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js';

/** Photo-derived workstation. Dimensions are compositional estimates in metres.
 * Semantic groups remain editable; +Y is up, +Z faces the visitor. */
export function createWorkstation(screenTexture: THREE.Texture) {
  const root = new THREE.Group();
  root.name = 'personal-workstation';
  const wood = new THREE.MeshStandardMaterial({ color: 0x985020, roughness: 0.48 });
  const edge = new THREE.MeshStandardMaterial({ color: 0x663215, roughness: 0.58 });
  const silver = new THREE.MeshStandardMaterial({ color: 0xbfc4cd, metalness: 0.3, roughness: 0.38 });
  const white = new THREE.MeshStandardMaterial({ color: 0xe4e1d8, roughness: 0.48 });
  const dark = new THREE.MeshStandardMaterial({ color: 0x22262b, roughness: 0.6 });
  const group = (name: string, parent = root) => { const g = new THREE.Group(); g.name = name; parent.add(g); return g; };
  const box = (parent: THREE.Group, name: string, size: number[], pos: number[], mat: THREE.Material, radius = 0.015) => {
    const mesh = new THREE.Mesh(new RoundedBoxGeometry(size[0], size[1], size[2], 2, radius), mat);
    mesh.name = name; mesh.position.set(pos[0], pos[1], pos[2]); mesh.castShadow = mesh.receiveShadow = true; parent.add(mesh); return mesh;
  };
  const cylinder = (parent: THREE.Group, name: string, r: number, h: number, pos: number[], mat: THREE.Material) => {
    const mesh = new THREE.Mesh(new THREE.CylinderGeometry(r, r, h, 32), mat);
    mesh.name = name; mesh.position.set(pos[0], pos[1], pos[2]); mesh.castShadow = mesh.receiveShadow = true; parent.add(mesh); return mesh;
  };
  const beam = (parent: THREE.Group, name: string, a: number[], b: number[], width: number, depth: number, mat: THREE.Material) => {
    const start = new THREE.Vector3(...a as [number, number, number]);
    const end = new THREE.Vector3(...b as [number, number, number]);
    const m = box(parent, name, [width, start.distanceTo(end), depth], start.clone().add(end).multiplyScalar(0.5).toArray(), mat);
    m.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), end.sub(start).normalize()); return m;
  };

  const desk = group('compact-wood-desk');
  desk.position.z = -1.55;
  for (const x of [-0.49, 0.49]) {
    box(desk, 'upright', [0.085, 1.05, 0.085], [x, 0.535, 0.06], wood);
    box(desk, 'floor-runner', [0.105, 0.075, 0.83], [x, 0.14, 0], wood);
    box(desk, 'tray', [0.39, 0.055, 0.55], [x * 1.58, 1.08, 0], wood);
    beam(desk, 'tray-bracket', [x, 0.82, 0], [x * 1.68, 1.04, 0], 0.038, 0.045, edge);
  }
  const base = group('rolling-base', desk);
  box(base, 'base-rear-bridge', [1.08, 0.075, 0.09], [0, 0.14, -0.385], wood);
  for (const x of [-0.46, 0.46]) for (const z of [-0.34, 0.34]) {
    cylinder(base, 'caster-stem', 0.018, 0.055, [x, 0.1, z], silver);
    const wheel = cylinder(base, 'caster-wheel', 0.047, 0.04, [x, 0.047, z], dark);
    wheel.rotation.z = Math.PI / 2;
  }
  box(desk, 'lower-crossbar', [0.96, 0.09, 0.07], [0, 0.23, -0.385], wood);
  box(desk, 'front-apron', [1.01, 0.16, 0.08], [0, 0.965, 0.24], wood);
  const writingSurface = group('tilting-desktop', desk);
  writingSurface.position.y = 1.13; writingSurface.rotation.x = 0.17;
  box(writingSurface, 'desktop', [1.08, 0.06, 0.76], [0, 0, 0], wood, 0.025);
  box(writingSurface, 'front-stop', [0.78, 0.055, 0.045], [0, 0.052, 0.32], edge);

  const laptop = group('open-laptop', writingSurface);
  laptop.position.set(0, 0.041, -0.005);
  box(laptop, 'aluminium-base', [0.86, 0.025, 0.56], [0, 0.014, 0], silver);
  box(laptop, 'keyboard-well', [0.75, 0.003, 0.25], [0, 0.028, -0.085], dark, 0.005);
  // Shared geometry/material keeps the keyboard inexpensive to author and adjust.
  const keys = new THREE.InstancedMesh(new THREE.BoxGeometry(0.043, 0.003, 0.035), dark, 70);
  const keyTransform = new THREE.Object3D();
  for (let row = 0; row < 5; row++) for (let col = 0; col < 14; col++) {
    keyTransform.position.set(-0.345 + col * 0.053, 0.033, -0.183 + row * 0.047);
    keyTransform.updateMatrix(); keys.setMatrixAt(row * 14 + col, keyTransform.matrix);
  }
  laptop.add(keys);
  box(laptop, 'trackpad', [0.3, 0.003, 0.145], [0, 0.029, 0.155], silver, 0.007);
  const lid = group('display-hinge', laptop); lid.position.set(0, 0.025, -0.27); lid.rotation.x = -0.28;
  box(lid, 'display-frame', [0.86, 0.54, 0.024], [0, 0.27, 0], silver);
  box(lid, 'black-bezel', [0.824, 0.505, 0.004], [0, 0.27, 0.014], dark, 0.008);
  const display = new THREE.Mesh(new THREE.PlaneGeometry(0.785, 0.462), new THREE.MeshBasicMaterial({ map: screenTexture }));
  display.position.set(0, 0.272, 0.017); lid.add(display);

  cylinder(desk, 'cup-coaster', 0.115, 0.015, [-0.775, 1.115, 0.09], edge);
  const mouse = new THREE.Mesh(new THREE.SphereGeometry(1, 24, 16), dark);
  mouse.name = 'mouse'; mouse.scale.set(0.085, 0.032, 0.115); mouse.position.set(0.775, 1.14, 0.06); desk.add(mouse);

  const chair = group('wood-chair'); chair.position.set(0.14, 0, -0.61); chair.rotation.y = 0; chair.scale.set(0.9, 0.78, 0.9);
  const seat = cylinder(chair, 'round-seat', 0.36, 0.075, [0, 0.55, 0], wood); seat.scale.z = 0.91;
  for (const x of [-1, 1]) for (const z of [-1, 1]) {
    beam(chair, 'splayed-leg', [x * 0.29, 0.035, z * 0.27], [x * 0.22, 0.53, z * 0.2], 0.065, 0.065, wood);
  }
  beam(chair, 'central-back-support', [0, 0.38, 0.29], [0, 1.08, 0.36], 0.105, 0.065, wood);
  box(chair, 'wide-rounded-backrest', [0.79, 0.16, 0.075], [0, 1.035, 0.365], wood, 0.034);
  for (const y of [0.43, 0.49]) {
    const bolt = new THREE.Mesh(new THREE.SphereGeometry(0.012, 12, 8), dark); bolt.position.set(0, y, 0.331); chair.add(bolt);
  }

  const purifier = group('air-purifier'); purifier.position.set(-1.56, 0, -1.6);
  box(purifier, 'ivory-housing', [0.42, 0.85, 0.42], [0, 0.44, 0], white, 0.025);
  box(purifier, 'top-vent', [0.375, 0.015, 0.375], [0, 0.87, 0], dark);
  // Decorative default readings, not live room sensor data.
  const displayCanvas = document.createElement('canvas'); displayCanvas.width = displayCanvas.height = 256;
  const displayContext = displayCanvas.getContext('2d')!;
  displayContext.fillStyle = '#101719'; displayContext.fillRect(0, 0, 256, 256);
  displayContext.textAlign = 'center'; displayContext.fillStyle = '#f3f7f5';
  displayContext.font = '500 68px sans-serif'; displayContext.fillText('23°', 128, 105);
  displayContext.font = '500 49px sans-serif'; displayContext.fillText('40%', 128, 170);
  const displayTexture = new THREE.CanvasTexture(displayCanvas); displayTexture.colorSpace = THREE.SRGBColorSpace;
  const indicator = new THREE.Mesh(new THREE.CircleGeometry(0.068, 48), new THREE.MeshBasicMaterial({ map: displayTexture }));
  indicator.position.set(0, 0.64, 0.212); purifier.add(indicator);
  const statusLight = new THREE.Mesh(new RoundedBoxGeometry(0.045, 0.005, 0.003, 2, 0.002), new THREE.MeshBasicMaterial({ color: 0x16241b }));
  statusLight.position.set(0, 0.598, 0.216); purifier.add(statusLight);
  const ventCanvas = document.createElement('canvas'); ventCanvas.width = ventCanvas.height = 128;
  const ctx = ventCanvas.getContext('2d')!; ctx.fillStyle = '#e4e1d8'; ctx.fillRect(0, 0, 128, 128); ctx.fillStyle = '#515354';
  for (let y = 4; y < 128; y += 8) for (let x = 4; x < 128; x += 8) { ctx.beginPath(); ctx.arc(x + (y % 16 ? 2 : 0), y, 1.35, 0, Math.PI * 2); ctx.fill(); }
  const ventTexture = new THREE.CanvasTexture(ventCanvas); ventTexture.colorSpace = THREE.SRGBColorSpace;
  const ventMat = new THREE.MeshStandardMaterial({ map: ventTexture, roughness: 0.7 });
  for (const side of [false, true]) {
    const grille = new THREE.Mesh(new THREE.PlaneGeometry(0.37, 0.37), ventMat);
    grille.position.set(side ? -0.212 : 0, 0.245, side ? 0 : 0.212); if (side) grille.rotation.y = -Math.PI / 2; purifier.add(grille);
  }
  for (let i = 0; i < 12; i++) box(purifier, 'top-slats', [0.35, 0.008, 0.009], [0, 0.881, -0.16 + i * 0.029], white, 0.002);

  const sideTable = group('white-high-table');
  sideTable.position.set(-1.56, 0, -1.66);
  box(sideTable, 'white-tabletop', [0.93, 0.065, 0.73], [0, 1.21, 0], white, 0.028);
  for (const x of [-0.36, 0.36]) for (const z of [-0.26, 0.26]) {
    box(sideTable, 'white-leg', [0.052, 1.17, 0.052], [x, 0.6, z], white);
  }
  box(sideTable, 'rear-brace', [0.77, 0.065, 0.04], [0, 0.32, -0.26], white);

  const plant = group('windowsill-plant');
  plant.position.set(-0.65, 1.32, -2.47);
  const terracotta = new THREE.MeshStandardMaterial({ color: 0xb2764c, roughness: 0.9 });
  cylinder(plant, 'pot', 0.078, 0.13, [0, 0.065, 0], terracotta);
  cylinder(plant, 'soil', 0.068, 0.009, [0, 0.132, 0], edge);
  const green = new THREE.MeshStandardMaterial({ color: 0x40784c, roughness: 0.72 });
  for (let i = 0; i < 7; i++) {
    const angle = i * 2.4;
    const tip = [Math.cos(angle) * 0.09, 0.23 + (i % 3) * 0.045, Math.sin(angle) * 0.07];
    beam(plant, 'stem', [0, 0.12, 0], tip, 0.006, 0.006, green);
    const leaf = new THREE.Mesh(new THREE.SphereGeometry(1, 12, 8), green);
    leaf.scale.set(0.039, 0.074, 0.013); leaf.position.set(...tip as [number, number, number]);
    leaf.rotation.set(0.35, angle, -0.6); plant.add(leaf);
  }

  const arm = group('white-articulated-device-arm');
  box(arm, 'desk-clamp', [0.115, 0.15, 0.13], [-1.12, 1.19, -1.71], white);
  const joints = [[-1.12, 1.25, -1.71], [-1.5, 1.48, -1.76], [-1.07, 1.71, -1.57]];
  beam(arm, 'lower-arm', joints[0], joints[1], 0.06, 0.09, white);
  beam(arm, 'upper-arm', joints[1], joints[2], 0.055, 0.08, white);
  for (const p of joints) { const j = cylinder(arm, 'hinge', 0.052, 0.1, p, white); j.rotation.x = Math.PI / 2; }
  const tablet = group('mounted-device-screen-outward', arm); tablet.position.set(-1.02, 1.71, -1.5); tablet.rotation.set(0.08, -0.25, 0.09);
  box(tablet, 'aluminium-back', [0.61, 0.45, 0.022], [0, 0, 0], silver, 0.024);
  box(tablet, 'lower-holder', [0.08, 0.045, 0.052], [0, -0.219, 0], white);
  box(tablet, 'side-holder', [0.045, 0.1, 0.052], [-0.299, -0.08, 0], white);
  box(tablet, 'screen-bezel', [0.585, 0.425, 0.006], [0, 0, 0.014], dark, 0.017);
  const tabletScreen = new THREE.Mesh(new THREE.PlaneGeometry(0.545, 0.38), new THREE.MeshBasicMaterial({ map: screenTexture }));
  tabletScreen.position.z = 0.019; tablet.add(tabletScreen);
  const lens = new THREE.Mesh(new THREE.CircleGeometry(0.013, 16), dark); lens.position.set(0, 0.203, 0.019); tablet.add(lens);

  return { root, wood, desk, chair, purifier, indicator, statusLight, arm, tablet, mugPosition: new THREE.Vector3(-0.775, 1.125, -1.46) };
}
