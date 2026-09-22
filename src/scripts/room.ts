import * as THREE from "three";
import { defaults, limits, parseRoomState, ROOM_STORAGE_KEY, wrapDegrees } from "./room-state";
import { RoomAudio } from "./room-audio";
import { mugPattern } from "./mug-pattern";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { createWorkstation } from "./workstation";

/* Personal workstation by a window, with a warm lamp and a day/night sky. */

// Window composition: positive moves right; 0 restores the original position.
// Moves the opening, frame, sill, plant and sky together. Furniture stays put.
const WINDOW_OFFSET_X = 1.27;

const clamp01 = (v: number) => Math.min(1, Math.max(0, v));
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

function radialTexture(stops: [number, string][], size = 128): THREE.CanvasTexture {
  const c = document.createElement("canvas");
  c.width = c.height = size;
  const ctx = c.getContext("2d")!;
  const g = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
  for (const [at, color] of stops) g.addColorStop(at, color);
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, size, size);
  return new THREE.CanvasTexture(c);
}

function codeTexture(): THREE.CanvasTexture {
  const c = document.createElement("canvas");
  c.width = 256;
  c.height = 160;
  const ctx = c.getContext("2d")!;
  ctx.fillStyle = "#0c1420";
  ctx.fillRect(0, 0, 256, 160);
  const palette = ["#7fb8d4", "#9fd8c6", "#c4b0e8", "#f2b268", "#5c6b7a"];
  let y = 14;
  let rng = 7;
  const rand = () => (rng = (rng * 16807) % 2147483647) / 2147483647;
  while (y < 148) {
    let x = 12 + (rand() < 0.25 ? 14 : 0);
    while (x < 230) {
      const w = 12 + rand() * 44;
      if (x + w > 240) break;
      ctx.fillStyle = palette[Math.floor(rand() * palette.length)];
      ctx.globalAlpha = 0.75;
      ctx.fillRect(x, y, w, 3.2);
      x += w + 7;
    }
    y += 9 + rand() * 3;
  }
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

function streakTexture(): THREE.CanvasTexture {
  const c = document.createElement("canvas");
  c.width = 64;
  c.height = 8;
  const ctx = c.getContext("2d")!;
  const g = ctx.createLinearGradient(0, 0, 64, 0);
  g.addColorStop(0, "rgba(255,255,255,0)");
  g.addColorStop(0.55, "rgba(255,255,255,0.85)");
  g.addColorStop(1, "rgba(255,255,255,1)");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, 64, 8);
  return new THREE.CanvasTexture(c);
}

interface Theme {
  mix: number; // 0 = night, 1 = day
  target: number;
}

export function initRoom(canvas: HTMLCanvasElement) {
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: false });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFShadowMap;
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.15;

  const scene = new THREE.Scene();
  const theme: Theme = {
    mix: document.documentElement.dataset.theme === "day" ? 1 : 0,
    target: document.documentElement.dataset.theme === "day" ? 1 : 0,
  };

  const fogNight = new THREE.Color(0x0e1319);
  const fogDay = new THREE.Color(0xe7e1d3);
  scene.fog = new THREE.Fog(fogNight.clone(), 7, 16);
  scene.background = scene.fog.color;

  const camera = new THREE.PerspectiveCamera(46, 1, 0.1, 40);
  // Center the frontal composition on the approved wooden desk position.
  const camBase = new THREE.Vector3(defaults.deskX, 1.62, 4.35);
  const camTarget = new THREE.Vector3(defaults.deskX, 1.16, -0.6);
  camera.position.copy(camBase);
  camera.lookAt(camTarget);

  /* ── sky (shader plane behind the window) ── */
  const skyUniforms = {
    uMix: { value: theme.mix },
  };
  const skyMat = new THREE.ShaderMaterial({
    uniforms: skyUniforms,
    vertexShader: `varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.); }`,
    fragmentShader: `
      uniform float uMix; varying vec2 vUv;
      void main(){
        vec3 nTop = vec3(0.035, 0.075, 0.16);
        vec3 nBot = vec3(0.11, 0.16, 0.28);
        vec3 dTop = vec3(0.34, 0.58, 0.88);
        vec3 dBot = vec3(0.78, 0.83, 0.87);
        vec3 top = mix(nTop, dTop, uMix);
        vec3 bot = mix(nBot, dBot, uMix);
        gl_FragColor = vec4(mix(bot, top, pow(vUv.y, 0.8)), 1.0);
      }`,
    depthWrite: false,
  });
  const sky = new THREE.Mesh(new THREE.PlaneGeometry(7, 4.4), skyMat);
  sky.position.set(WINDOW_OFFSET_X, 2.1, -3.05);
  scene.add(sky);

  /* ── stars ── */
  const starLayers: THREE.Points[] = [];
  const starTex = radialTexture([
    [0, "rgba(255,255,255,1)"],
    [0.35, "rgba(255,255,255,0.6)"],
    [1, "rgba(255,255,255,0)"],
  ]);
  for (let layer = 0; layer < 2; layer++) {
    const n = 170;
    const pos = new Float32Array(n * 3);
    for (let i = 0; i < n; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 4.6;
      pos[i * 3 + 1] = 1.1 + Math.random() * 2.5;
      pos[i * 3 + 2] = -2.95 - layer * 0.05;
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.BufferAttribute(pos, 3));
    const mat = new THREE.PointsMaterial({
      size: 0.028 - layer * 0.008,
      map: starTex,
      transparent: true,
      depthWrite: false,
      color: layer === 0 ? 0xffffff : 0xbcd4ff,
      opacity: 0.9,
    });
    const pts = new THREE.Points(geo, mat);
    pts.position.x = WINDOW_OFFSET_X;
    starLayers.push(pts);
    scene.add(pts);
  }

  /* ── moon ── */
  const moonGroup = new THREE.Group();
  const moonMat = new THREE.MeshBasicMaterial({ color: 0xf5ecd7, transparent: true });
  const moon = new THREE.Mesh(new THREE.CircleGeometry(0.17, 40), moonMat);
  const moonGlow = new THREE.Sprite(
    new THREE.SpriteMaterial({
      map: radialTexture([
        [0, "rgba(245,236,215,0.85)"],
        [0.3, "rgba(245,236,215,0.28)"],
        [1, "rgba(245,236,215,0)"],
      ]),
      transparent: true,
      depthWrite: false,
    }),
  );
  moonGlow.scale.setScalar(1.15);
  moonGroup.add(moonGlow, moon);
  moonGroup.position.set(WINDOW_OFFSET_X + 0.62, 2.62, -2.92);
  scene.add(moonGroup);

  /* ── sun ── */
  const sunGroup = new THREE.Group();
  const sun = new THREE.Mesh(
    new THREE.CircleGeometry(0.2, 40),
    new THREE.MeshBasicMaterial({ color: 0xfff4d4, transparent: true }),
  );
  const sunGlow = new THREE.Sprite(
    new THREE.SpriteMaterial({
      map: radialTexture([
        [0, "rgba(255,240,200,0.9)"],
        [0.35, "rgba(255,235,190,0.3)"],
        [1, "rgba(255,235,190,0)"],
      ]),
      transparent: true,
      depthWrite: false,
    }),
  );
  sunGlow.scale.setScalar(1.9);
  sunGroup.add(sunGlow, sun);
  sunGroup.position.set(WINDOW_OFFSET_X - 0.55, 2.35, -2.92);
  scene.add(sunGroup);

  /* ── meteors ── */
  const meteorTex = streakTexture();
  const meteors = Array.from({ length: 2 }, () => {
    const s = new THREE.Sprite(
      new THREE.SpriteMaterial({
        map: meteorTex,
        transparent: true,
        opacity: 0,
        depthWrite: false,
        rotation: -0.5,
      }),
    );
    s.scale.set(0.55, 0.045, 1);
    s.position.z = -2.9;
    scene.add(s);
    return { s, t: -Math.random() * 14 - 4 };
  });

  /* ── room surfaces ── */
  const WALL = 0x3a3f4a;
  const wallMat = new THREE.MeshStandardMaterial({ color: WALL, roughness: 0.95 });
  const mkWall = (w: number, h: number, x: number, y: number) => {
    const m = new THREE.Mesh(new THREE.PlaneGeometry(w, h), wallMat);
    m.position.set(x + WINDOW_OFFSET_X, y, -2.6);
    m.receiveShadow = true;
    scene.add(m);
    return m;
  };
  // Window opening uses local x ∈ [-0.95, 0.95], translated by WINDOW_OFFSET_X.
  mkWall(12, 20, -6.95, 2.5); // left of window
  mkWall(12, 20, 6.95, 2.5); // right of window
  mkWall(1.9, 1.32, 0, 0.66); // under window
  mkWall(1.9, 10, 0, 7.62); // above window

  const floorMat = new THREE.MeshStandardMaterial({ color: 0x2b241d, roughness: 0.9 });
  const floor = new THREE.Mesh(new THREE.PlaneGeometry(14, 12), floorMat);
  floor.rotation.x = -Math.PI / 2;
  floor.position.z = 1.5;
  floor.receiveShadow = true;
  scene.add(floor);

  /* window frame + mullions */
  const frameMat = new THREE.MeshStandardMaterial({ color: 0x54483a, roughness: 0.8 });
  const frame = new THREE.Group();
  frame.position.x = WINDOW_OFFSET_X;
  const fw = 0.07;
  const fr = (w: number, h: number, x: number, y: number) => {
    const m = new THREE.Mesh(new THREE.BoxGeometry(w, h, 0.1), frameMat);
    m.position.set(x, y, -2.58);
    frame.add(m);
  };
  fr(1.9 + fw, fw, 0, 2.62);
  fr(1.9 + fw, fw, 0, 1.32);
  fr(fw, 1.3 + fw, -0.95, 1.97);
  fr(fw, 1.3 + fw, 0.95, 1.97);
  fr(0.035, 1.3, 0, 1.97); // vertical mullion
  fr(1.9, 0.035, 0, 1.97); // horizontal mullion
  const sill = new THREE.Mesh(new THREE.BoxGeometry(2.15, 0.06, 0.2), frameMat);
  sill.position.set(0, 1.29, -2.5);
  frame.add(sill);
  scene.add(frame);

  const workstation = createWorkstation(codeTexture());
  workstation.root.getObjectByName("windowsill-plant")!.position.x += WINDOW_OFFSET_X;
  scene.add(workstation.root);
  const deskMat = workstation.wood;
  let state = { ...defaults };
  try { state = parseRoomState(localStorage.getItem(ROOM_STORAGE_KEY)); } catch { /* storage may be unavailable */ }
  // Site theme is authoritative when restoring older, independently saved lamps.
  state.lampOn = theme.target === 0;
  const sounds = new RoomAudio();
  const unlockSound = () => { try { sounds.unlock(); } catch { /* Web Audio unavailable */ } };
  window.addEventListener("pointerdown", unlockSound, { passive: true });
  window.addEventListener("keydown", unlockSound);
  document.addEventListener("visibilitychange", () => sounds.configure(state.soundOn, state.purifierOn));

  /* ── lamp (the day/night switch) ── */
  const lampGroup = new THREE.Group();
  const lampMat = new THREE.MeshStandardMaterial({ color: 0x3a4150, roughness: 0.45, metalness: 0.6 });
  const mkArm = (x1: number, y1: number, x2: number, y2: number, r: number) => {
    const len = Math.hypot(x2 - x1, y2 - y1);
    const m = new THREE.Mesh(new THREE.CylinderGeometry(r, r, len, 12), lampMat);
    m.position.set((x1 + x2) / 2, (y1 + y2) / 2, 0);
    m.rotation.z = -Math.atan2(x2 - x1, y2 - y1);
    return m;
  };
  const lampBase = new THREE.Mesh(new THREE.CylinderGeometry(0.13, 0.155, 0.03, 24), lampMat);
  lampBase.position.y = 0.015;
  const neck = new THREE.Mesh(new THREE.SphereGeometry(0.033, 16, 12), lampMat);
  neck.position.set(-0.02, 0.04, 0);
  const arm1 = mkArm(-0.02, 0.04, 0.14, 0.4, 0.02);
  const elbow = new THREE.Mesh(new THREE.SphereGeometry(0.032, 16, 12), lampMat);
  elbow.position.set(0.14, 0.4, 0);
  const arm2 = mkArm(0.14, 0.4, 0.3, 0.585, 0.017);
  const headJoint = new THREE.Mesh(new THREE.SphereGeometry(0.026, 16, 12), lampMat);
  headJoint.position.set(0.3, 0.585, 0);
  const shade = new THREE.Mesh(
    new THREE.ConeGeometry(0.105, 0.14, 28, 1, true),
    new THREE.MeshStandardMaterial({
      color: 0x3a4150,
      roughness: 0.5,
      metalness: 0.6,
      side: THREE.DoubleSide,
    }),
  );
  shade.position.set(0.345, 0.55, 0);
  shade.rotation.z = 0.55;
  const bulbMat = new THREE.MeshBasicMaterial({ color: 0xffd9a0 });
  const bulb = new THREE.Mesh(new THREE.SphereGeometry(0.034, 16, 12), bulbMat);
  bulb.position.set(0.365, 0.505, 0);
  const lampGlow = new THREE.Sprite(
    new THREE.SpriteMaterial({
      map: radialTexture([
        [0, "rgba(255,190,110,0.95)"],
        [0.25, "rgba(255,180,100,0.35)"],
        [1, "rgba(255,180,100,0)"],
      ]),
      transparent: true,
      depthWrite: false,
    }),
  );
  lampGlow.scale.setScalar(1.5);
  lampGlow.position.copy(bulb.position);
  lampGroup.add(lampBase, neck, arm1, elbow, arm2, headJoint, shade, bulb, lampGlow);
  lampGroup.position.set(-1.87, 1.245, -1.87);
  lampGroup.scale.setScalar(1.12);
  lampGroup.rotation.y = -0.12;
  lampGroup.traverse((o) => {
    if (o instanceof THREE.Mesh) o.castShadow = true;
  });
  const lampPivot = new THREE.Group();
  lampPivot.position.copy(neck.position);
  lampGroup.add(lampPivot);
  for (const part of [arm1, elbow, arm2, headJoint, shade, bulb, lampGlow]) {
    part.position.sub(lampPivot.position); lampPivot.add(part);
  }
  const lampElbowPivot = new THREE.Group();
  lampElbowPivot.position.copy(elbow.position);
  lampPivot.add(lampElbowPivot);
  for (const part of [elbow, arm2, headJoint, shade, bulb, lampGlow]) {
    part.position.sub(lampElbowPivot.position);
    lampElbowPivot.add(part);
  }
  // Decorative glow has no physical hit area.
  lampGlow.raycast = () => {};
  scene.add(lampGroup);

  const lampLight = new THREE.PointLight(0xffb168, 14, 0, 1.9);
  lampGroup.updateMatrixWorld(true);
  bulb.getWorldPosition(lampLight.position);
  lampLight.castShadow = true;
  lampLight.shadow.mapSize.set(1024, 1024);
  lampLight.shadow.bias = -0.001;
  lampLight.shadow.normalBias = 0.035;
  scene.add(lampLight);

  /* ── mug + steam ── */
  const mugGroup = new THREE.Group();
  const mugMat = new THREE.MeshStandardMaterial({ color: 0xd8cfc0, roughness: 0.55 });
  const mug = new THREE.Mesh(new THREE.CylinderGeometry(0.055, 0.048, 0.115, 48), [new THREE.MeshStandardMaterial({ map: mugPattern(), roughness: 0.55 }), mugMat, mugMat]);
  mug.position.y = 0.058;
  const coffee = new THREE.Mesh(
    new THREE.CircleGeometry(0.048, 24),
    new THREE.MeshStandardMaterial({ color: 0x33231a, roughness: 0.4 }),
  );
  coffee.rotation.x = -Math.PI / 2;
  coffee.position.y = 0.104;
  const handle = new THREE.Mesh(new THREE.TorusGeometry(0.038, 0.009, 10, 20, Math.PI), mugMat);
  handle.position.set(0.058, 0.062, 0);
  handle.rotation.z = -Math.PI / 2;
  mugGroup.add(mug, coffee, handle);
  mugGroup.position.copy(workstation.mugPosition);
  mugGroup.scale.setScalar(1.45);
  mugGroup.rotation.y = Math.PI;
  mugGroup.traverse((o) => {
    if (o instanceof THREE.Mesh) o.castShadow = true;
  });
  scene.add(mugGroup);
  scene.updateMatrixWorld(true);
  workstation.desk.attach(mugGroup);
  const steamOrigin = new THREE.Vector3();

  const steamTex = radialTexture([
    [0, "rgba(255,255,255,0.5)"],
    [0.5, "rgba(255,255,255,0.16)"],
    [1, "rgba(255,255,255,0)"],
  ]);
  const steams = Array.from({ length: 5 }, (_, i) => {
    const s = new THREE.Sprite(
      new THREE.SpriteMaterial({ map: steamTex, transparent: true, opacity: 0, depthWrite: false }),
    );
    s.position.copy(workstation.mugPosition);
    s.position.y += 0.18;
    scene.add(s);
    return { s, off: i / 5 };
  });

  /* ── dust motes in lamplight ── */
  const dustGeo = new THREE.BufferGeometry();
  const dustN = 46;
  const dustPos = new Float32Array(dustN * 3);
  const dustSeed = new Float32Array(dustN);
  for (let i = 0; i < dustN; i++) {
    dustPos[i * 3] = -0.9 + Math.random() * 1.4;
    dustPos[i * 3 + 1] = 1.15 + Math.random() * 0.9;
    dustPos[i * 3 + 2] = -1.9 + Math.random() * 0.8;
    dustSeed[i] = Math.random() * Math.PI * 2;
  }
  dustGeo.setAttribute("position", new THREE.BufferAttribute(dustPos, 3));
  const dustMat = new THREE.PointsMaterial({
    size: 0.011,
    map: starTex,
    color: 0xffd9a0,
    transparent: true,
    opacity: 0.4,
    depthWrite: false,
  });
  const dust = new THREE.Points(dustGeo, dustMat);
  scene.add(dust);

  /* ── lights ── */
  const ambient = new THREE.AmbientLight(0x33405c, 0.85);
  scene.add(ambient);
  const fill = new THREE.HemisphereLight(0xc1cfe5, 0x59402a, 0.9);
  scene.add(fill);
  const skyLight = new THREE.DirectionalLight(0x9fb8e8, 0.7);
  skyLight.position.set(0.4, 3.2, 1.2);
  skyLight.target.position.set(0, 1, -1.6);
  scene.add(skyLight, skyLight.target);

  /* ── theme application ── */
  const cNightAmb = new THREE.Color(0x33405c);
  const cDayAmb = new THREE.Color(0xdfe8f0);
  const cNightSky = new THREE.Color(0x9fb8e8);
  const cDaySun = new THREE.Color(0xffedc4);
  const cNightBulb = new THREE.Color(0xffd9a0);
  const cOffBulb = new THREE.Color(0x4a4438);
  const tmp = new THREE.Color();

  function applyTheme(m: number) {
    skyUniforms.uMix.value = m;
    (scene.fog as THREE.Fog).color.copy(tmp.copy(fogNight).lerp(fogDay, m));
    ambient.color.copy(tmp.copy(cNightAmb).lerp(cDayAmb, m));
    ambient.intensity = lerp(0.85, 1.5, m);
    skyLight.color.copy(tmp.copy(cNightSky).lerp(cDaySun, m));
    skyLight.intensity = lerp(0.7, 2.6, m);



    starLayers.forEach((l, i) => ((l.material as THREE.PointsMaterial).opacity = lerp(i === 0 ? 0.9 : 0.55, 0, m)));
    moonMat.opacity = lerp(1, 0, m);
    moonGlow.material.opacity = lerp(1, 0, m);
    (sun.material as THREE.MeshBasicMaterial).opacity = m;
    sunGlow.material.opacity = m;
    dustMat.opacity = lerp(0.42, 0, m);
    wallMat.color.setHex(WALL).lerp(new THREE.Color(0xe9e1cf), m * 0.85);
    floorMat.color.setHex(0x332b21).lerp(new THREE.Color(0xa98d68), m * 0.75);
    deskMat.color.setHex(0x985020).lerp(new THREE.Color(0xad6b35), m * 0.35);
  }
  applyTheme(theme.mix);

  window.addEventListener("themechange", (e) => {
    theme.target = (e as CustomEvent<string>).detail === "day" ? 1 : 0;
    const lampOn = theme.target === 0;
    if (state.lampOn !== lampOn) sounds.click();
    state.lampOn = lampOn;
    applyLayout(); saveLayout();
  });
  function syncThemeToLamp(lampOn: boolean) {
    const next = lampOn ? 'night' : 'day';
    document.documentElement.dataset.theme = next;
    try { localStorage.setItem('theme', next); } catch { /* rendering still works without storage */ }
    window.dispatchEvent(new CustomEvent('themechange', { detail: next }));
  }
  function toggleLamp() { syncThemeToLamp(!state.lampOn); }

  const controls = new OrbitControls(camera, canvas);
  controls.enabled = false;
  controls.enableDamping = true;
  controls.enablePan = false;
  controls.minDistance = 2.4;
  controls.maxDistance = 8;
  controls.minPolarAngle = 0.25;
  controls.maxPolarAngle = Math.PI / 2 - 0.04;
  controls.minAzimuthAngle = -Math.PI / 2;
  controls.maxAzimuthAngle = Math.PI / 2;
  controls.target.set(-0.45, 1.1, -1.5);
  const viewButton = document.getElementById("room-view-toggle")!;
  const toolbar = document.getElementById("room-toolbar")!;
  const rad = THREE.MathUtils.degToRad;
  const chairOffset = new THREE.Vector3();
  const armLower = workstation.arm.getObjectByName('lower-arm') as THREE.Mesh;
  const armUpper = workstation.arm.getObjectByName('upper-arm') as THREE.Mesh;
  const armLengths = [0.447, 0.52];
  // Preserve each segment's original local length, before any saved adjustment.
  armLower.geometry.computeBoundingBox(); armUpper.geometry.computeBoundingBox();
  armLengths[0] = armLower.geometry.boundingBox!.max.y - armLower.geometry.boundingBox!.min.y;
  armLengths[1] = armUpper.geometry.boundingBox!.max.y - armUpper.geometry.boundingBox!.min.y;
  const armJoints = workstation.arm.children.filter(o => o.name === 'hinge');
  const setSegment = (mesh: THREE.Mesh, start: THREE.Vector3, end: THREE.Vector3, length: number) => {
    const delta = end.clone().sub(start);
    mesh.position.copy(start).add(end).multiplyScalar(0.5);
    mesh.scale.y = delta.length() / length;
    mesh.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), delta.normalize());
  };
  function applyLayout() {
    workstation.desk.position.set(state.deskX, 0, state.deskZ);
    workstation.desk.rotation.y = rad(state.deskAngle);
    // The chair fits inside the open U-base, below the apron, without scaling on tuck.
    chairOffset.set(0, 0, lerp(0.94, 0, state.chairIn)).applyAxisAngle(new THREE.Vector3(0, 1, 0), rad(state.deskAngle));
    workstation.chair.position.copy(workstation.desk.position).add(chairOffset);
    workstation.chair.rotation.y = rad(state.deskAngle);
    lampGroup.rotation.y = rad(state.lampAngle);
    lampPivot.rotation.z = rad(state.lampTilt);
    lampElbowPivot.rotation.z = rad(state.lampElbow);
    const anchor = new THREE.Vector3(-1.12, 1.25, -1.71);
    const swivel = rad(state.armAngle);
    const endpoint = new THREE.Vector3(0.1, state.armHeight, 0.14).applyAxisAngle(new THREE.Vector3(0, 1, 0), swivel).add(anchor);
    const elbowPoint = new THREE.Vector3(-0.38, state.armHeight * 0.5, -0.05).applyAxisAngle(new THREE.Vector3(0, 1, 0), swivel).add(anchor);
    setSegment(armLower, anchor, elbowPoint, armLengths[0]);
    setSegment(armUpper, elbowPoint, endpoint, armLengths[1]);
    [anchor, elbowPoint, endpoint].forEach((position, index) => armJoints[index].position.copy(position));
    workstation.tablet.position.copy(endpoint);
    workstation.tablet.position.z += 0.075;
    workstation.tablet.rotation.set(rad(state.screenTilt), rad(state.screenYaw), 0);
    workstation.indicator.material.color.setHex(state.purifierOn ? 0xffffff : 0x080808);
    workstation.statusLight.material.color.setHex(state.purifierOn ? 0x71e69e : 0x16241b);
    sounds.configure(state.soundOn, state.purifierOn);
  }
  function saveLayout() {
    try {
      localStorage.setItem(ROOM_STORAGE_KEY, JSON.stringify({ version: 1, state }));
    } catch { console.warn('Room layout could not be saved: browser storage unavailable.'); }
  }
  document.getElementById('room-reset')!.addEventListener('click', () => {
    state = { ...defaults }; syncThemeToLamp(state.lampOn); sounds.click();
  });
  applyLayout();
  let exploring = false;
  function setExplore(active: boolean) {
    exploring = active;
    controls.enabled = active;
    canvas.style.pointerEvents = active ? "auto" : "none";
    canvas.style.zIndex = active ? "30" : "";
    canvas.style.touchAction = active ? "none" : "";
    // Keep the document scrollbar and viewport dimensions unchanged.
    // The canvas consumes orbit wheel/touch gestures while exploring.
    toolbar.hidden = !active;
    if (active) {
      // Keep the exact current view; entering only changes who controls it.
      controls.target.copy(camTarget);
      controls.update();
    } else {
      // Flush orbit inertia before restoring the default view, so the next
      // entry cannot inherit the previous drag's residual movement.
      controls.enableDamping = false;
      controls.update();
      controls.enableDamping = true;
      camera.position.copy(camBase);
      camera.lookAt(camTarget);
    }
    document.body.style.cursor = "";
  }
  viewButton.addEventListener("click", () => setExplore(false));
  window.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && exploring) setExplore(false);
  });

  const pointer = new THREE.Vector2(0, 0);
  const ray = new THREE.Raycaster();
  const objects = { lamp: lampGroup, desk: workstation.desk, chair: workstation.chair, arm: workstation.arm, purifier: workstation.purifier };
  type ObjectName = keyof typeof objects;
  function pointRay(e: { clientX: number; clientY: number }) {
    const bounds = canvas.getBoundingClientRect();
    ray.setFromCamera(new THREE.Vector2((e.clientX - bounds.left) / bounds.width * 2 - 1, -(e.clientY - bounds.top) / bounds.height * 2 + 1), camera);
  }
  function hitObject(e: { clientX: number; clientY: number }) {
    pointRay(e);
    const hit = ray.intersectObjects(Object.values(objects), true).find(hit => hit.object instanceof THREE.Mesh);
    if (!hit) return null;
    for (const [name, group] of Object.entries(objects)) {
      let object: THREE.Object3D | null = hit.object;
      let screen = false;
      let upperLamp = false;
      while (object) {
        if (object === workstation.tablet) screen = true;
        if (object === lampElbowPivot) upperLamp = true;
        if (object === group) return { name: name as ObjectName, screen, upperLamp, light: hit.object === shade || hit.object === bulb };
        object = object.parent;
      }
    }
    return null;
  }
  // A small halo target around the bulb, only outside exploration mode.
  // Physical objects always win, so this cannot steal clicks from the arm.
  const lightHitSphere = new THREE.Sphere(new THREE.Vector3(), 0.12);
  function hitLampLight(hit: ReturnType<typeof hitObject>) {
    if (hit?.light) return true;
    if (hit) return false;
    bulb.getWorldPosition(lightHitSphere.center);
    return ray.ray.intersectsSphere(lightHitSphere);
  }
  const ground = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0);
  function floorPoint(e: { clientX: number; clientY: number }, height = 0) {
    ground.constant = -height;
    pointRay(e); return ray.ray.intersectPlane(ground, new THREE.Vector3());
  }
  let gesture: { id: number; name: ObjectName; screen: boolean; upperLamp: boolean; start: THREE.Vector2; ground: THREE.Vector3 | null; height: number; initial: typeof state; moved: boolean; rotate: boolean } | null = null;
  let pressed = new THREE.Vector2();
  // Capture object gestures before OrbitControls sees them. Empty space still orbits.
  canvas.addEventListener('pointerdown', e => {
    if (!exploring || gesture) return;
    const hit = hitObject(e); if (!hit) return;
    e.preventDefault(); e.stopImmediatePropagation();
    controls.enabled = false;
    gesture = { ...hit, id: e.pointerId, start: new THREE.Vector2(e.clientX, e.clientY), ground: floorPoint(e, hit.name === 'desk' ? 1.1 : 0.5), height: hit.name === 'desk' ? 1.1 : 0.5, initial: { ...state }, moved: false, rotate: e.shiftKey || e.button === 2 };
    canvas.setPointerCapture(e.pointerId);
    canvas.style.cursor = hit.name === 'purifier' ? 'pointer' : 'grabbing';
  }, true);
  canvas.addEventListener('contextmenu', e => { if (exploring) e.preventDefault(); });
  canvas.addEventListener('pointermove', e => {
    if (!gesture || e.pointerId !== gesture.id) return;
    e.preventDefault(); e.stopImmediatePropagation();
    const dx = e.clientX - gesture.start.x, dy = e.clientY - gesture.start.y;
    if (Math.hypot(dx, dy) < 5 && !gesture.moved) return;
    gesture.moved = true;
    const initial = gesture.initial;
    const current = floorPoint(e, gesture.height);
    const delta = current && gesture.ground ? current.sub(gesture.ground) : new THREE.Vector3();
    if (gesture.name === 'desk') {
      if (gesture.rotate) state.deskAngle = THREE.MathUtils.clamp(initial.deskAngle + dx * 0.4, -90, 90);
      else {
        state.deskX = THREE.MathUtils.clamp(initial.deskX + delta.x, limits.deskX[0], limits.deskX[1]);
        state.deskZ = THREE.MathUtils.clamp(initial.deskZ + delta.z, limits.deskZ[0], limits.deskZ[1]);
      }
      sounds.roll();
      workstation.desk.traverse(o => { if (o.name === 'caster-wheel') o.rotateY((e.movementX + e.movementY) * 0.03); });
    } else if (gesture.name === 'chair') {
      const forward = new THREE.Vector3(0, 0, 1).applyAxisAngle(new THREE.Vector3(0, 1, 0), rad(state.deskAngle));
      state.chairIn = THREE.MathUtils.clamp(initial.chairIn - delta.dot(forward) / 0.94, 0, 1);
      sounds.roll();
    } else if (gesture.name === 'lamp') {
      if (gesture.upperLamp) {
        state.lampElbow = THREE.MathUtils.clamp(initial.lampElbow - dy * 0.4 + dx * 0.2, -50, 45);
      } else {
        state.lampAngle = THREE.MathUtils.clamp(initial.lampAngle + dx * 0.6, -100, 100);
        state.lampTilt = THREE.MathUtils.clamp(initial.lampTilt - dy * 0.3, -25, 30);
      }
    } else if (gesture.name === 'arm') {
      if (gesture.screen) {
        state.screenYaw = wrapDegrees(initial.screenYaw + dx * 0.6);
        state.screenTilt = THREE.MathUtils.clamp(initial.screenTilt + dy * 0.4, limits.screenTilt[0], limits.screenTilt[1]);
      } else {
        state.armHeight = THREE.MathUtils.clamp(initial.armHeight - dy * 0.004, 0.3, 0.85);
        state.armAngle = wrapDegrees(initial.armAngle + dx * 0.5);
      }
    }
    applyLayout(); saveLayout();
  }, true);
  const finishGesture = (e: PointerEvent) => {
    if (!gesture || e.pointerId !== gesture.id) return;
    e.stopImmediatePropagation();
    if (!gesture.moved && e.type === 'pointerup') {
      if (gesture.name === 'lamp') toggleLamp();
      if (gesture.name === 'purifier') { state.purifierOn = !state.purifierOn; sounds.click(); }
      if (gesture.name === 'chair') { state.chairIn = state.chairIn > 0.5 ? 0 : 1; sounds.roll(); }
      applyLayout(); saveLayout();
    }
    if (canvas.hasPointerCapture(e.pointerId)) canvas.releasePointerCapture(e.pointerId);
    gesture = null; controls.enabled = exploring; canvas.style.cursor = 'grab';
  };
  canvas.addEventListener('pointerup', finishGesture, true);
  canvas.addEventListener('pointercancel', finishGesture, true);
  canvas.addEventListener('wheel', e => {
    if (!exploring || hitObject(e)?.name !== 'lamp') return;
    e.preventDefault(); e.stopImmediatePropagation();
    state.lampBrightness = THREE.MathUtils.clamp(state.lampBrightness - e.deltaY * 0.001, 0.2, 1.4);
    applyLayout(); saveLayout();
  }, { capture: true, passive: false });
  window.addEventListener('pointerdown', e => pressed.set(e.clientX, e.clientY));
  window.addEventListener('pointermove', e => {
    if (gesture) return;
    const hit = hitObject(e);
    if (exploring) { canvas.style.cursor = hit?.name === 'purifier' ? 'pointer' : 'grab'; return; }
    pointer.set(e.clientX / window.innerWidth * 2 - 1, -e.clientY / window.innerHeight * 2 + 1);
    document.body.style.cursor = window.scrollY < window.innerHeight * 0.65 && (hit || hitLampLight(hit)) ? 'pointer' : '';
  });
  window.addEventListener('pointerup', e => {
    if (exploring || pressed.distanceTo(new THREE.Vector2(e.clientX, e.clientY)) > 6) return;
    if ((e.target as HTMLElement).closest('a,button,input') || window.scrollY > window.innerHeight * 0.65) return;
    const hit = hitObject(e);
    if (hitLampLight(hit)) {
      toggleLamp();
      return;
    }
    const other = ray.intersectObjects([frame, workstation.root.getObjectByName('white-high-table')!, workstation.root.getObjectByName('windowsill-plant')!], true).length;
    if (hit || other) setExplore(true);
  });

  /* ── resize ── */
  function resize() {
    const w = canvas.clientWidth || window.innerWidth;
    const h = canvas.clientHeight || window.innerHeight;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    // Keep the full workstation in portrait screens as well as desktop.
    camera.fov = THREE.MathUtils.radToDeg(2 * Math.atan(Math.tan(THREE.MathUtils.degToRad(46 / 2)) * Math.max(1, 1.12 / camera.aspect)));
    camera.updateProjectionMatrix();
  }
  resize();
  window.addEventListener("resize", resize);

  /* ── visibility: pause when offscreen / hidden ── */
  let visible = true;
  new IntersectionObserver(([e]) => (visible = e.isIntersecting), { threshold: 0.02 }).observe(canvas);

  /* ── main loop ── */
  const timer = new THREE.Timer();
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;


  function tick() {
    timer.update();
    const dt = Math.min(timer.getDelta(), 0.05);
    const t = timer.getElapsed();

    if (Math.abs(theme.target - theme.mix) > 0.0005) {
      theme.mix = lerp(theme.mix, theme.target, 1 - Math.pow(0.02, dt));
      applyTheme(clamp01(theme.mix));
    }

    // camera: breathing + pointer parallax
    const breathe = reduceMotion ? 0 : Math.sin(t * 0.45) * 0.012;
    if (exploring) {
      if (controls.enabled) controls.update();
    } else {
    camera.position.x = lerp(camera.position.x, camBase.x + pointer.x * 0.24, 0.05);
    camera.position.y = lerp(camera.position.y, camBase.y + pointer.y * 0.1 + breathe, 0.05);
    camera.lookAt(camTarget);
    }

    // lamp flicker
    const flick = 1 + Math.sin(t * 17.3) * 0.015 + Math.sin(t * 5.7) * 0.02;
    lampGroup.updateMatrixWorld(true);
    bulb.getWorldPosition(lampLight.position);
    lampLight.intensity = lerp(14, 0, theme.mix) * state.lampBrightness * flick;
    lampGlow.material.opacity = lerp(0.65, 0, theme.mix) * state.lampBrightness;
    bulbMat.color.copy(cNightBulb).lerp(cOffBulb, theme.mix);
    mugGroup.getWorldPosition(steamOrigin);

    // steam
    for (const st of steams) {
      const p = (t * 0.22 + st.off) % 1;
      st.s.position.y = steamOrigin.y + 0.18 + p * 0.5;
      st.s.position.z = steamOrigin.z;
      st.s.position.x = steamOrigin.x + Math.sin(t * 1.4 + st.off * 9) * 0.02 * p;
      st.s.scale.setScalar(0.05 + p * 0.1);
      st.s.material.opacity = Math.sin(p * Math.PI) * 0.4 * (1 - theme.mix * 0.3);
    }

    // stars twinkle
    (starLayers[0].material as THREE.PointsMaterial).opacity =
      lerp(0.9, 0, theme.mix) * (0.75 + 0.25 * Math.sin(t * 1.7));
    (starLayers[1].material as THREE.PointsMaterial).opacity =
      lerp(0.55, 0, theme.mix) * (0.75 + 0.25 * Math.sin(t * 1.3 + 2));

    // meteors
    for (const m of meteors) {
      m.t += dt;
      if (m.t > 0 && m.t < 0.9) {
        const p = m.t / 0.9;
        m.s.position.x = WINDOW_OFFSET_X - 1.1 + p * 1.7;
        m.s.position.y = 2.9 - p * 0.75;
        m.s.material.opacity = Math.sin(p * Math.PI) * 0.9 * (1 - theme.mix);
      } else if (m.t > 0.9) {
        m.s.material.opacity = 0;
        m.t = -(4 + Math.random() * 14);
      }
    }

    // dust drift
    const dp = dustGeo.attributes.position as THREE.BufferAttribute;
    for (let i = 0; i < dustN; i++) {
      const ph = dustSeed[i];
      dp.setY(i, 1.15 + ((ph + t * 0.045) % 0.9));
      dp.setX(i, -0.9 + ((ph * 7 + t * 0.03) % 1.4));
    }
    dp.needsUpdate = true;

    if (visible && !document.hidden) renderer.render(scene, camera);
    requestAnimationFrame(tick);
  }
  tick();
}
