# Usage: python3 scripts/recolor-splash.py <original.mp4> public/splash/logo-intro.mp4 fff8ef
# Needs ffmpeg and numpy. For the shipped files, render to a lossless master, then upscale to 1080x1920
# (lanczos + light unsharp) and encode MP4 (x264 crf 19) and WebM (VP9 crf 22) plus a poster frame.
"""Recolour the paper background of the logo film to one flat colour, keeping texture and shadows.
The paper's lighting is fitted once (smooth 2D quadratic, from a late frame) and divided out."""
import sys, subprocess, numpy as np
src, out, hexc = sys.argv[1], sys.argv[2], sys.argv[3]
W, H = 720, 1280
T = np.array([int(hexc[i:i+2], 16) for i in (0, 2, 4)], np.float32)

def frame_at(t):
    b = subprocess.run(['ffmpeg', '-v', 'error', '-ss', t, '-i', src, '-frames:v', '1', '-f', 'rawvideo', '-pix_fmt', 'rgb24', '-'], capture_output=True).stdout
    return np.frombuffer(b, np.uint8).reshape(H, W, 3).astype(np.float32)

ref = frame_at('5.5')
B0 = np.median(np.concatenate([ref[:80].reshape(-1, 3), ref[-80:].reshape(-1, 3)]), axis=0)
def weight(f, B):
    luma = f.mean(axis=2, keepdims=True) + 1e-3
    chroma_d = np.linalg.norm(f / luma - B / B.mean(), axis=-1)[..., None] if B.ndim == 1 else np.linalg.norm(f / luma - B / B.mean(axis=2, keepdims=True), axis=2, keepdims=True)
    rel = luma / (B.mean() if B.ndim == 1 else B.mean(axis=2, keepdims=True))
    tol = 0.10 + 0.30 * np.clip((rel - 0.97) / 0.08, 0, 1)
    return np.clip(1 - chroma_d / tol, 0, 1) * np.clip((rel - 0.45) / 0.25, 0, 1)

# fit lighting on clean paper pixels, away from the logo's shadows
yy, xx = np.mgrid[0:H, 0:W]
x, y = xx / W - 0.5, yy / H - 0.5
mask = (weight(ref, B0)[..., 0] > 0.95) & (np.abs(ref.mean(2) - ref.mean(2).mean()) < 25)
mask[::] &= ((np.abs(x) > 0.38) | (np.abs(y) > 0.25))
A = np.stack([np.ones_like(x), x, y, x * x, y * y, x * y], -1)
idx = np.where(mask.ravel())[0][::7]
Af = A.reshape(-1, 6)
light = np.stack([Af @ np.linalg.lstsq(Af[idx], ref.reshape(-1, 3)[idx, c], rcond=None)[0] for c in range(3)], -1).reshape(H, W, 3)
gain = T / light

dec = subprocess.Popen(['ffmpeg', '-v', 'error', '-i', src, '-f', 'rawvideo', '-pix_fmt', 'rgb24', '-'], stdout=subprocess.PIPE)
enc = subprocess.Popen(['ffmpeg', '-v', 'error', '-y', '-f', 'rawvideo', '-pix_fmt', 'rgb24', '-s', f'{W}x{H}', '-r', '24', '-i', '-',
                        '-i', src, '-map', '0:v', '-map', '1:a', '-c:v', 'libx264', '-pix_fmt', 'yuv420p', '-crf', '20', '-preset', 'slow',
                        '-c:a', 'aac', '-b:a', '128k', '-movflags', '+faststart', '-shortest', out], stdin=subprocess.PIPE)
while True:
    buf = dec.stdout.read(W * H * 3)
    if len(buf) < W * H * 3: break
    f = np.frombuffer(buf, np.uint8).reshape(H, W, 3).astype(np.float32)
    w = weight(f, light)
    o = np.clip(f * (1 - w) + f * gain * w, 0, 255).astype(np.uint8)
    enc.stdin.write(o.tobytes())
enc.stdin.close(); enc.wait()
