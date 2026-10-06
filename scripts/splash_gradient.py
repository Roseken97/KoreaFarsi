"""KoreaFarsi splash gradient, defined in units of the film's height so the page CSS can draw the same thing
(the film is always 100dvh tall and horizontally centred). Mirrors SPLASH_BG in src/app/launch/page.tsx."""
import numpy as np
hx = lambda h: np.array([int(h[i:i+2], 16) for i in (1, 3, 5)], np.float32)
LINEAR = [(0.0, '#FFF9F2'), (0.55, '#F8DDE3'), (1.0, '#F3E7D7')]
RADIALS = [  # drawn bottom to top: (centre x%, centre y%, radius in H, colour, [(pos, alpha)])
    (0.5, 1.0, 0.55, '#F2C7D1', [(0, 0.45), (0.5, 0.2), (1, 0)]),
    (0.5, 0.45, 0.45, '#FFF9F2', [(0, 0.85), (0.4, 0.6), (0.75, 0.2), (1, 0)]),
]
def interp(stops, t):
    pos = np.array([p for p, _ in stops], np.float32); val = [v for _, v in stops]
    t = np.clip(t, pos[0], pos[-1])
    out = None
    for i in range(len(stops) - 1):
        a, b = pos[i], pos[i + 1]
        k = np.clip((t - a) / (b - a), 0, 1)
        seg = (val[i] * (1 - k) + val[i + 1] * k) if not isinstance(val[i], str) else (hx(val[i]) * (1 - k) + hx(val[i + 1]) * k)
        inside = (t >= a) & (t <= b) if i == 0 else (t > a) & (t <= b)
        out = np.where(inside, seg, out) if out is not None else np.where(inside, seg, 0)
    return out
def plate(W, H):
    yy, xx = np.mgrid[0:H, 0:W].astype(np.float32)
    y = (yy + 0.5) / H; x = (xx + 0.5 - W / 2) / H  # x in H units from the centre line
    img = interp(LINEAR, y[..., None])
    for cx, cy, r, col, st in RADIALS:
        d = np.sqrt((x - 0) ** 2 + (y - cy) ** 2) / r  # every centre is on the vertical centre line
        a = interp(st, d)[..., None]
        img = img * (1 - a) + hx(col) * a
    return img
