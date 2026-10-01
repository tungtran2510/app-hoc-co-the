// Tiện ích âm thanh phản hồi vi mô chuẩn Web Audio API (0 KB, không tốn băng thông)
let audioCtx: AudioContext | null = null;

function getAudioContext(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  try {
    if (!audioCtx) {
      const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioContextClass) {
        audioCtx = new AudioContextClass();
      }
    }
    if (audioCtx && audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
    return audioCtx;
  } catch {
    return null;
  }
}

let cachedSoundEnabled: boolean | null = null;

export function isSoundEnabled(): boolean {
  if (typeof window === 'undefined') return true;
  if (cachedSoundEnabled !== null) return cachedSoundEnabled;
  try {
    cachedSoundEnabled = localStorage.getItem('qbiz_sound_enabled') !== 'false';
    return cachedSoundEnabled;
  } catch {
    return true;
  }
}

export function setSoundEnabled(enabled: boolean): void {
  cachedSoundEnabled = enabled;
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem('qbiz_sound_enabled', enabled ? 'true' : 'false');
    window.dispatchEvent(new CustomEvent('qbiz_sound_toggle', { detail: { enabled } }));
  } catch {}
}

/**
 * 1. Âm thanh "Tách / Pop" vi mô (15ms): Khi bấm chuyển tab, chọn video, bấm nút
 * Âm lượng nhỏ (5%), êm dịu, không gây giật mình
 */
export function playTapSound(): void {
  if (!isSoundEnabled()) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  try {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    const now = ctx.currentTime;
    osc.type = 'sine';
    // Tần số từ 880Hz hạ nhanh xuống 440Hz trong 18ms tạo cảm giác gõ nảy
    osc.frequency.setValueAtTime(880, now);
    osc.frequency.exponentialRampToValueAtTime(440, now + 0.018);

    // Âm lượng siêu nhẹ 0.04 (4%)
    gain.gain.setValueAtTime(0.04, now);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.018);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.02);
  } catch {}
}

/**
 * 2. Tiếng "Ting" thủy tinh êm dịu: Khi bấm "Đánh dấu đã hiểu" (hoàn thành bài học)
 * Âm vang 2 nốt hòa âm C5 (523Hz) và G5 (784Hz) kéo dài 0.3s
 */
export function playSuccessChime(): void {
  if (!isSoundEnabled()) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  try {
    const now = ctx.currentTime;

    // Nốt thứ nhất: C5 (523.25 Hz)
    const osc1 = ctx.createOscillator();
    const gain1 = ctx.createGain();
    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(523.25, now);
    gain1.gain.setValueAtTime(0.05, now);
    gain1.gain.exponentialRampToValueAtTime(0.0001, now + 0.32);
    osc1.connect(gain1);
    gain1.connect(ctx.destination);
    osc1.start(now);
    osc1.stop(now + 0.35);

    // Nốt thứ hai: G5 (783.99 Hz) ngân sau 40ms
    const osc2 = ctx.createOscillator();
    const gain2 = ctx.createGain();
    osc2.type = 'sine';
    osc2.frequency.setValueAtTime(783.99, now + 0.04);
    gain2.gain.setValueAtTime(0.001, now);
    gain2.gain.setValueAtTime(0.06, now + 0.04);
    gain2.gain.exponentialRampToValueAtTime(0.0001, now + 0.38);
    osc2.connect(gain2);
    gain2.connect(ctx.destination);
    osc2.start(now + 0.04);
    osc2.stop(now + 0.4);
  } catch {}
}
