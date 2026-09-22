export const ROOM_STORAGE_KEY = 'bugyalu-room-layout-v1';
export const limits = {
  deskX: [-0.1, 1.6], deskZ: [-1.8, 0.3], deskAngle: [-90, 90], chairIn: [0, 1],
  lampAngle: [-100, 100], lampTilt: [-25, 30], lampElbow: [-50, 45], lampBrightness: [0.2, 1.4],
  armHeight: [0.3, 0.85], armAngle: [-180, 180], screenYaw: [-180, 180], screenTilt: [-85, 85],
} as const;
export type Setting = keyof typeof limits;
export type RoomState = Record<Setting, number> & { lampOn: boolean; purifierOn: boolean; soundOn: boolean };
// Default composition captured from the user's Chrome layout on 2026-09-23.
// First visits and the reset action both use this arrangement.
export const defaults: RoomState = {
  deskX: -0.08345388998487002, deskZ: -1.8, deskAngle: 0, chairIn: 0,
  lampAngle: -20.401562499999997, lampTilt: 10.811718749999999,
  lampElbow: -3.4218750000000004, lampBrightness: 1,
  armHeight: 0.46, armAngle: 0,
  screenYaw: 41.830468749999994, screenTilt: -1.5625000000000009,
  lampOn: true, purifierOn: true, soundOn: true,
};
export function parseRoomState(raw: string | null): RoomState {
  const state = { ...defaults };
  try {
    const data = JSON.parse(raw ?? 'null');
    if (!data || data.version !== 1 || !data.state) return state;
    for (const key of Object.keys(limits) as Setting[]) {
      const value = data.state[key];
      if (typeof value === 'number' && Number.isFinite(value)) {
        state[key] = Math.max(limits[key][0], Math.min(limits[key][1], value));
      }
    }
    for (const key of ['lampOn', 'purifierOn', 'soundOn'] as const) {
      if (typeof data.state[key] === 'boolean') state[key] = data.state[key];
    }
  } catch { /* A corrupt or obsolete save falls back to a usable room. */ }
  return state;
}

/** Continuous yaw: crossing 180 degrees wraps without a physical end stop. */
export const wrapDegrees = (angle: number) => ((angle + 180) % 360 + 360) % 360 - 180;
