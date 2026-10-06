# Usage: python3 scripts/recolor-splash.py <original.mp4> master.mkv brand - 10   (needs ffmpeg + numpy)
# Then: upscale master to 1080x1920 (lanczos + light unsharp), encode MP4 (x264 crf 18) and WebM (VP9 crf 22), and grab a poster frame.
"""Replace the paper background of the logo film: the paper's texture is dropped, its soft shadows are kept.
bg is 'flat:RRGGBB' or 'grad:TOPHEX:BOTTOMHEX'. With a time argument, writes one PNG frame."""
import sys, subprocess, numpy as np
src, out, bg = sys.argv[1], sys.argv[2], sys.argv[3]
still = sys.argv[4] if len(sys.argv) > 4 and sys.argv[4] != '-' else None
W, H = 720, 1280
hx = lambda h: np.array([int(h[i:i+2], 16) for i in (0, 2, 4)], np.float32)
kind, *cols = bg.split(':')
if kind == 'brand':
    sys.path.insert(0, __import__('os').path.dirname(__file__))
    from splash_gradient import plate
    PLATE = plate(W, H)
elif kind == 'flat':
    PLATE = np.broadcast_to(hx(cols[0]), (H, W, 3)).astype(np.float32)
else:
    t = np.linspace(0, 1, H, dtype=np.float32)[:, None, None]
    PLATE = np.broadcast_to(hx(cols[0]) * (1 - t) + hx(cols[1]) * t, (H, W, 3)).astype(np.float32)

def frame_at(ts):
    b = subprocess.run(['ffmpeg', '-v', 'error', '-ss', ts, '-i', src, '-frames:v', '1', '-f', 'rawvideo', '-pix_fmt', 'rgb24', '-'], capture_output=True).stdout
    return np.frombuffer(b, np.uint8).reshape(H, W, 3).astype(np.float32)

def box(a, r):  # separable box blur, edge-padded
    for ax in (0, 1):
        p = np.pad(a, [(r + 1, r) if i == ax else (0, 0) for i in range(a.ndim)], mode='edge')
        c = np.cumsum(p, axis=ax)
        a = (np.take(c, range(2 * r + 1, c.shape[ax]), axis=ax) - np.take(c, range(0, c.shape[ax] - 2 * r - 1), axis=ax)) / (2 * r + 1)
    return a

ref = frame_at('5.5')
B0 = np.median(np.concatenate([ref[:80].reshape(-1, 3), ref[-80:].reshape(-1, 3)]), axis=0)
def weight(f, B):
    luma = f.mean(axis=2, keepdims=True) + 1e-3
    Bm = B.mean(axis=-1, keepdims=True) if B.ndim == 3 else B.mean()
    chroma_d = np.linalg.norm(f / luma - B / Bm, axis=-1, keepdims=True)
    rel = luma / Bm
    tol = 0.10 + 0.30 * np.clip((rel - 0.97) / 0.08, 0, 1)
    return np.clip(1 - chroma_d / tol, 0, 1) * np.clip((rel - 0.45) / 0.25, 0, 1)

yy, xx = np.mgrid[0:H, 0:W]; x, y = xx / W - 0.5, yy / H - 0.5
mask = (weight(ref, B0)[..., 0] > 0.95) & (np.abs(ref.mean(2) - ref.mean(2).mean()) < 25) & ((np.abs(x) > 0.38) | (np.abs(y) > 0.25))
A = np.stack([np.ones_like(x), x, y, x * x, y * y, x * y], -1).reshape(-1, 6); idx = np.where(mask.ravel())[0][::7]
light = np.stack([A @ np.linalg.lstsq(A[idx], ref.reshape(-1, 3)[idx, c], rcond=None)[0] for c in range(3)], -1).reshape(H, W, 3)

DITHER = (np.random.default_rng(7).random((H, W, 1), dtype=np.float32) - 0.5)
R = int(sys.argv[5]) if len(sys.argv) > 5 else 10
def process(f):
    w = weight(f, light)
    shade = f.mean(2, keepdims=True) / light.mean(2, keepdims=True)  # 1 on clean paper, <1 in shadows, >1 in glows
    # blur only over paper pixels (normalised), so the grain goes but the logo doesn't bleed into it
    wb = box(box(w, R), R) + 1e-4
    shade = box(box(shade * w, R), R) / wb
    # static sub-LSB dither keeps the smooth gradient from banding after 8-bit encoding
    return np.clip(f * (1 - w) + PLATE * shade * w + DITHER * w, 0, 255).astype(np.uint8)

if still:
    o = process(frame_at(still))
    subprocess.run(['ffmpeg', '-v', 'error', '-y', '-f', 'rawvideo', '-pix_fmt', 'rgb24', '-s', f'{W}x{H}', '-i', '-', out], input=o.tobytes())
else:
    dec = subprocess.Popen(['ffmpeg', '-v', 'error', '-i', src, '-f', 'rawvideo', '-pix_fmt', 'rgb24', '-'], stdout=subprocess.PIPE)
    enc = subprocess.Popen(['ffmpeg', '-v', 'error', '-y', '-f', 'rawvideo', '-pix_fmt', 'rgb24', '-s', f'{W}x{H}', '-r', '24', '-i', '-',
                            '-i', src, '-map', '0:v', '-map', '1:a', '-c:v', 'libx264', '-qp', '0', '-preset', 'veryfast', '-c:a', 'copy', '-shortest', out], stdin=subprocess.PIPE)
    while True:
        buf = dec.stdout.read(W * H * 3)
        if len(buf) < W * H * 3: break
        enc.stdin.write(process(np.frombuffer(buf, np.uint8).reshape(H, W, 3).astype(np.float32)).tobytes())
    enc.stdin.close(); enc.wait()
