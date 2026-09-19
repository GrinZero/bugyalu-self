import * as THREE from "three";

/* A small night room: a desk by a window, warm lamp, hot coffee,
   books, and a sky that can turn from night to morning. */

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
  const camBase = new THREE.Vector3(0, 1.62, 4.35);
  const camTarget = new THREE.Vector3(0, 1.16, -0.6);
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
  sky.position.set(0, 2.1, -3.05);
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
  moonGroup.position.set(0.62, 2.62, -2.92);
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
  sunGroup.position.set(-0.55, 2.35, -2.92);
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
    m.position.set(x, y, -2.6);
    m.receiveShadow = true;
    scene.add(m);
    return m;
  };
  // window hole: x ∈ [-0.95, 0.95], y ∈ [1.32, 2.62]
  mkWall(4.05, 5, -2.975, 2.5); // left of window
  mkWall(4.05, 5, 2.975, 2.5); // right of window
  mkWall(1.9, 1.32, 0, 0.66); // under window
  mkWall(1.9, 2.38, 0, 3.81); // above window

  const floorMat = new THREE.MeshStandardMaterial({ color: 0x2b241d, roughness: 0.9 });
  const floor = new THREE.Mesh(new THREE.PlaneGeometry(14, 12), floorMat);
  floor.rotation.x = -Math.PI / 2;
  floor.position.z = 1.5;
  floor.receiveShadow = true;
  scene.add(floor);

  /* window frame + mullions */
  const frameMat = new THREE.MeshStandardMaterial({ color: 0x54483a, roughness: 0.8 });
  const frame = new THREE.Group();
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

  /* ── desk ── */
  const deskMat = new THREE.MeshStandardMaterial({ color: 0x6b5136, roughness: 0.7 });
  const deskTop = new THREE.Mesh(new THREE.BoxGeometry(3.4, 0.09, 1.15), deskMat);
  deskTop.position.set(0, 1.1, -1.55);
  deskTop.castShadow = deskTop.receiveShadow = true;
  scene.add(deskTop);
  const sideMat = new THREE.MeshStandardMaterial({ color: 0x554026, roughness: 0.8 });
  for (const x of [-1.5, 1.5]) {
    const leg = new THREE.Mesh(new THREE.BoxGeometry(0.09, 1.06, 0.95), sideMat);
    leg.position.set(x, 0.53, -1.55);
    leg.castShadow = leg.receiveShadow = true;
    scene.add(leg);
  }
  const DESK = 1.145;

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
  lampGroup.position.set(-1.2, DESK, -1.78);
  lampGroup.rotation.y = -0.12;
  lampGroup.traverse((o) => {
    if (o instanceof THREE.Mesh) o.castShadow = true;
  });
  scene.add(lampGroup);

  const lampLight = new THREE.PointLight(0xffb168, 14, 0, 1.9);
  lampLight.position.set(-0.82, 1.66, -1.72);
  lampLight.castShadow = true;
  lampLight.shadow.mapSize.set(1024, 1024);
  lampLight.shadow.bias = -0.004;
  scene.add(lampLight);

  /* ── mug + steam ── */
  const mugGroup = new THREE.Group();
  const mugMat = new THREE.MeshStandardMaterial({ color: 0xd8cfc0, roughness: 0.55 });
  const mug = new THREE.Mesh(new THREE.CylinderGeometry(0.055, 0.048, 0.115, 24), mugMat);
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
  mugGroup.position.set(0.72, DESK, -1.28);
  mugGroup.traverse((o) => {
    if (o instanceof THREE.Mesh) o.castShadow = true;
  });
  scene.add(mugGroup);

  const steamTex = radialTexture([
    [0, "rgba(255,255,255,0.5)"],
    [0.5, "rgba(255,255,255,0.16)"],
    [1, "rgba(255,255,255,0)"],
  ]);
  const steams = Array.from({ length: 5 }, (_, i) => {
    const s = new THREE.Sprite(
      new THREE.SpriteMaterial({ map: steamTex, transparent: true, opacity: 0, depthWrite: false }),
    );
    s.position.set(0.72, DESK + 0.14, -1.28);
    scene.add(s);
    return { s, off: i / 5 };
  });

  /* ── books ── */
  const bookColors = [0x8a5a52, 0x4f6f68, 0xb3a089];
  const bookDims: [number, number, number][] = [
    [0.42, 0.055, 0.3],
    [0.38, 0.05, 0.27],
    [0.33, 0.045, 0.24],
  ];
  let bookY = DESK;
  const bookStack = new THREE.Group();
  bookDims.forEach(([w, h, d], i) => {
    const b = new THREE.Mesh(
      new THREE.BoxGeometry(w, h, d),
      new THREE.MeshStandardMaterial({ color: bookColors[i], roughness: 0.85 }),
    );
    b.position.set((Math.random() - 0.5) * 0.03, bookY + h / 2 - DESK, 0);
    b.rotation.y = (Math.random() - 0.5) * 0.3;
    b.castShadow = b.receiveShadow = true;
    bookStack.add(b);
    bookY += h;
  });
  bookStack.position.set(-0.35, DESK, -1.45);
  scene.add(bookStack);
  const bookTop = bookY;

  // leaning books
  const leanColors = [0x5a5f7a, 0x7a5a4a, 0x9c8a70];
  const leanGroup = new THREE.Group();
  leanColors.forEach((color, i) => {
    const h = 0.3 - i * 0.03;
    const b = new THREE.Mesh(
      new THREE.BoxGeometry(0.045, h, 0.21),
      new THREE.MeshStandardMaterial({ color, roughness: 0.85 }),
    );
    b.position.set(i * 0.06, h / 2, 0);
    b.rotation.z = i === 2 ? -0.18 : i * 0.04;
    b.castShadow = true;
    leanGroup.add(b);
  });
  leanGroup.position.set(1.12, DESK, -1.62);
  leanGroup.rotation.y = 0.2;
  scene.add(leanGroup);

  /* ── laptop ── */
  const laptop = new THREE.Group();
  const lapMat = new THREE.MeshStandardMaterial({ color: 0x8f959e, roughness: 0.4, metalness: 0.6 });
  const lapBase = new THREE.Mesh(new THREE.BoxGeometry(0.56, 0.02, 0.37), lapMat);
  lapBase.position.y = 0.01;
  const lid = new THREE.Mesh(new THREE.BoxGeometry(0.56, 0.36, 0.018), lapMat);
  lid.position.set(0, 0.18, -0.185);
  lid.rotation.x = -0.32;
  const screen = new THREE.Mesh(
    new THREE.PlaneGeometry(0.52, 0.32),
    new THREE.MeshBasicMaterial({ map: codeTexture() }),
  );
  screen.position.set(0, 0.006, 0.0105);
  lid.add(screen);
  const screenGlow = new THREE.Sprite(
    new THREE.SpriteMaterial({
      map: radialTexture([
        [0, "rgba(120,170,220,0.32)"],
        [1, "rgba(120,170,220,0)"],
      ]),
      transparent: true,
      depthWrite: false,
    }),
  );
  screenGlow.scale.set(0.85, 0.6, 1);
  screenGlow.position.set(0, 0.01, 0.06);
  lid.add(screenGlow);
  laptop.add(lapBase, lid);
  laptop.position.set(0.05, DESK, -1.7);
  laptop.rotation.y = -0.12;
  laptop.traverse((o) => {
    if (o instanceof THREE.Mesh) o.castShadow = true;
  });
  scene.add(laptop);

  /* ── plant ── */
  const plant = new THREE.Group();
  const pot = new THREE.Mesh(
    new THREE.CylinderGeometry(0.07, 0.055, 0.1, 16),
    new THREE.MeshStandardMaterial({ color: 0xa06b4d, roughness: 0.9 }),
  );
  pot.position.y = 0.05;
  const leafMat = new THREE.MeshStandardMaterial({ color: 0x4d7a55, roughness: 0.85 });
  const leaf1 = new THREE.Mesh(new THREE.SphereGeometry(0.075, 16, 12), leafMat);
  leaf1.position.y = 0.16;
  leaf1.scale.y = 0.8;
  const leaf2 = new THREE.Mesh(new THREE.SphereGeometry(0.055, 16, 12), leafMat);
  leaf2.position.set(0.05, 0.22, 0.02);
  const leaf3 = new THREE.Mesh(new THREE.SphereGeometry(0.05, 16, 12), leafMat);
  leaf3.position.set(-0.05, 0.2, -0.02);
  plant.add(pot, leaf1, leaf2, leaf3);
  plant.position.set(-1.42, DESK, -1.6);
  plant.traverse((o) => {
    if (o instanceof THREE.Mesh) o.castShadow = true;
  });
  scene.add(plant);

  /* ── papers ── */
  const paperMat = new THREE.MeshStandardMaterial({ color: 0xd9d4c8, roughness: 0.95 });
  for (const [x, z, r] of [
    [-0.85, -1.3, 0.3],
    [-0.78, -1.34, -0.15],
  ] as const) {
    const p = new THREE.Mesh(new THREE.BoxGeometry(0.24, 0.004, 0.32), paperMat);
    p.position.set(x, DESK + 0.003, z);
    p.rotation.y = r;
    p.receiveShadow = true;
    scene.add(p);
  }

  /* ── ladybug on the books ── */
  const bug = new THREE.Group();
  const bugBody = new THREE.Mesh(
    new THREE.SphereGeometry(0.02, 16, 12),
    new THREE.MeshStandardMaterial({ color: 0xc2402e, roughness: 0.5 }),
  );
  bugBody.scale.y = 0.72;
  const bugHead = new THREE.Mesh(
    new THREE.SphereGeometry(0.009, 10, 8),
    new THREE.MeshStandardMaterial({ color: 0x1c1c20, roughness: 0.5 }),
  );
  bugHead.position.set(0.02, -0.003, 0);
  const antMat = new THREE.MeshBasicMaterial({ color: 0x1c1c20 });
  const ant1 = new THREE.Mesh(new THREE.CylinderGeometry(0.0012, 0.0012, 0.018, 4), antMat);
  ant1.position.set(0.028, 0.008, 0.005);
  ant1.rotation.z = -0.8;
  const ant2 = ant1.clone();
  ant2.position.z = -0.005;
  bug.add(bugBody, bugHead, ant1, ant2);
  bug.position.set(-0.35, bookTop + 0.012, -1.42);
  bug.rotation.y = 0.5;
  scene.add(bug);

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
    lampLight.intensity = lerp(14, 0, m);
    bulbMat.color.copy(tmp.copy(cNightBulb).lerp(cOffBulb, m));
    lampGlow.material.opacity = lerp(0.9, 0, m);
    starLayers.forEach((l, i) => ((l.material as THREE.PointsMaterial).opacity = lerp(i === 0 ? 0.9 : 0.55, 0, m)));
    moonMat.opacity = lerp(1, 0, m);
    moonGlow.material.opacity = lerp(1, 0, m);
    (sun.material as THREE.MeshBasicMaterial).opacity = m;
    sunGlow.material.opacity = m;
    dustMat.opacity = lerp(0.42, 0, m);
    wallMat.color.setHex(WALL).lerp(new THREE.Color(0xe9e1cf), m * 0.85);
    floorMat.color.setHex(0x332b21).lerp(new THREE.Color(0xa98d68), m * 0.75);
    deskMat.color.setHex(0x6b5136).lerp(new THREE.Color(0x96754e), m * 0.55);
  }
  applyTheme(theme.mix);

  window.addEventListener("themechange", (e) => {
    theme.target = (e as CustomEvent<string>).detail === "day" ? 1 : 0;
  });

  /* ── pointer: parallax + lamp click ── */
  const pointer = new THREE.Vector2(0, 0);
  const ray = new THREE.Raycaster();
  const lampHitTargets: THREE.Object3D[] = [lampBase, arm1, arm2, elbow, headJoint, shade, bulb];
  let hoveringLamp = false;
  window.addEventListener("pointermove", (e) => {
    pointer.x = (e.clientX / window.innerWidth) * 2 - 1;
    pointer.y = -((e.clientY / window.innerHeight) * 2 - 1);
    ray.setFromCamera(pointer, camera);
    hoveringLamp = ray.intersectObjects(lampHitTargets, false).length > 0;
    document.body.style.cursor = hoveringLamp ? "pointer" : "";
  });
  window.addEventListener("pointerdown", (e) => {
    if (hoveringLamp && !(e.target as HTMLElement).closest("a,button")) {
      (window as any).__toggleTheme?.();
    }
  });

  /* ── resize ── */
  function resize() {
    const w = canvas.clientWidth || window.innerWidth;
    const h = canvas.clientHeight || window.innerHeight;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
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
  let bugTimer = 4;

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
    camera.position.x = lerp(camera.position.x, camBase.x + pointer.x * 0.24, 0.05);
    camera.position.y = lerp(camera.position.y, camBase.y + pointer.y * 0.1 + breathe, 0.05);
    camera.lookAt(camTarget);

    // lamp flicker
    const flick = 1 + Math.sin(t * 17.3) * 0.015 + Math.sin(t * 5.7) * 0.02;
    lampLight.intensity = lerp(14, 0, theme.mix) * flick;
    lampGlow.material.opacity = lerp(0.9, 0, theme.mix) * (0.92 + 0.08 * Math.sin(t * 9.1));

    // steam
    for (const st of steams) {
      const p = (t * 0.22 + st.off) % 1;
      st.s.position.y = DESK + 0.12 + p * 0.5;
      st.s.position.x = 0.72 + Math.sin(t * 1.4 + st.off * 9) * 0.02 * p;
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
        m.s.position.x = -1.1 + p * 1.7;
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

    // ladybug: occasional shuffle around the book top
    bugTimer -= dt;
    if (bugTimer < 0) {
      bugTimer = 5 + Math.random() * 9;
      bug.rotation.y += (Math.random() - 0.5) * 1.6;
      bug.position.x += (Math.random() - 0.5) * 0.04;
      bug.position.x = THREE.MathUtils.clamp(bug.position.x, -0.48, -0.22);
      bug.position.z = THREE.MathUtils.clamp(
        bug.position.z + (Math.random() - 0.5) * 0.03,
        -1.52,
        -1.34,
      );
    }
    ant1.rotation.x = Math.sin(t * 6) * 0.4;
    ant2.rotation.x = Math.sin(t * 6 + 1) * 0.4;

    if (visible && !document.hidden) renderer.render(scene, camera);
    requestAnimationFrame(tick);
  }
  tick();
}
