/**
 * Soft UI sounds, synthesized with Web Audio (no audio files to download): a short tap for
 * buttons and links, a lighter tick for toggles, and a two-note chime for a finished task or
 * lesson. Quiet by design; learners turn them off in Settings → Sounds (stored per device).
 */

export type SoundName = "tap" | "tick" | "success";

const STORAGE_KEY = "kf_sounds";

let ctx: AudioContext | null = null;

export function soundsEnabled() {
  try {
    return localStorage.getItem(STORAGE_KEY) !== "off";
  } catch {
    return true;
  }
}

export function setSoundsEnabled(on: boolean) {
  try {
    localStorage.setItem(STORAGE_KEY, on ? "on" : "off");
  } catch {
    // storage blocked (private mode): the choice lasts for this page only
  }
}

function audio() {
  if (typeof window === "undefined") return null;
  if (!ctx) {
    const Ctor = window.AudioContext ?? (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!Ctor) return null;
    ctx = new Ctor();
  }
  if (ctx.state === "suspended") void ctx.resume();
  return ctx;
}

function tone(ac: AudioContext, freq: number, start: number, length: number, volume: number, type: OscillatorType = "sine", glideTo?: number) {
  const osc = ac.createOscillator();
  const gain = ac.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(freq, start);
  if (glideTo) osc.frequency.exponentialRampToValueAtTime(glideTo, start + length);
  gain.gain.setValueAtTime(0.0001, start);
  gain.gain.exponentialRampToValueAtTime(volume, start + 0.008);
  gain.gain.exponentialRampToValueAtTime(0.0001, start + length);
  osc.connect(gain).connect(ac.destination);
  osc.start(start);
  osc.stop(start + length + 0.02);
}

export function playSound(name: SoundName) {
  if (!soundsEnabled()) return;
  const ac = audio();
  if (!ac) return;
  const t = ac.currentTime;
  if (name === "tap") tone(ac, 720, t, 0.07, 0.045, "sine", 520);
  else if (name === "tick") tone(ac, 1150, t, 0.045, 0.03, "triangle");
  else {
    tone(ac, 784, t, 0.22, 0.05, "sine"); // G5
    tone(ac, 1175, t + 0.09, 0.32, 0.045, "sine"); // D6
  }
}
