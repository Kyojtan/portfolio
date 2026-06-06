#!/usr/bin/env python3
"""Re-process AI cover PNGs: flood-fill background from edges, trim, keep 3D object intact."""
from __future__ import annotations

from collections import deque
from pathlib import Path

from PIL import Image

ROOT = Path(__file__).resolve().parents[1]
ASSETS = (
    Path.home()
    / ".cursor/projects/Users-yukkwantam-Documents-xujun-tan-portfolio/assets"
)
OUT = ROOT / "public/ai-covers"

MAPPING = {
    "retro": "retro-63814b5c-9efa-4ccd-afea-10442aa42fce.png",
    "mix": "ai_dj_mix-f397152d-aae5-41a0-803a-c72bfd6a2b41.png",
    "location": "location-92813c5b-d1b4-428b-abb0-e414deea2c45.png",
    "rag": "RAG-70acedae-3f49-4fab-89ef-99adf1380919.png",
    "mindmap": "mindmap-643c284b-79fa-4a6f-8585-6fce8b553fb1.png",
}


def is_background(r: int, g: int, b: int, a: int) -> bool:
    if a < 12:
        return True
    lum = 0.299 * r + 0.587 * g + 0.114 * b
    ch = max(r, g, b) - min(r, g, b)
    return lum >= 236 and ch <= 28


def is_watermark_gray(r: int, g: int, b: int, a: int) -> bool:
    if a < 12:
        return False
    lum = 0.299 * r + 0.587 * g + 0.114 * b
    ch = max(r, g, b) - min(r, g, b)
    return lum >= 188 and ch <= 38 and max(r, g, b) < 252


def flood_remove_bg(im: Image.Image) -> Image.Image:
    im = im.convert("RGBA")
    w, h = im.size
    px = im.load()
    visited = [[False] * w for _ in range(h)]
    q: deque[tuple[int, int]] = deque()

    def push(x: int, y: int) -> None:
        if 0 <= x < w and 0 <= y < h and not visited[y][x]:
            r, g, b, a = px[x, y]
            if is_background(r, g, b, a):
                visited[y][x] = True
                q.append((x, y))

    for x in range(w):
        push(x, 0)
        push(x, h - 1)
    for y in range(h):
        push(0, y)
        push(w - 1, y)

    while q:
        x, y = q.popleft()
        px[x, y] = (px[x, y][0], px[x, y][1], px[x, y][2], 0)
        for nx, ny in ((x + 1, y), (x - 1, y), (x, y + 1), (x, y - 1)):
            push(nx, ny)

    # NZ watermark: top band only, flat gray pixels
    y_cut = int(h * 0.13)
    for y in range(y_cut):
        for x in range(w):
            r, g, b, a = px[x, y]
            if is_watermark_gray(r, g, b, a):
                px[x, y] = (r, g, b, 0)

    return im


def soften_edges(im: Image.Image) -> Image.Image:
    px = im.load()
    w, h = im.size
    for y in range(h):
        for x in range(w):
            r, g, b, a = px[x, y]
            if a == 0 or a == 255:
                continue
            lum = 0.299 * r + 0.587 * g + 0.114 * b
            ch = max(r, g, b) - min(r, g, b)
            if lum > 242 and ch < 20:
                px[x, y] = (r, g, b, min(a, int(a * 0.5)))
    return im


def trim_alpha(im: Image.Image, pad: int = 14) -> Image.Image:
    alpha = im.split()[3]
    bbox = alpha.getbbox()
    if not bbox:
        return im
    x0, y0, x1, y1 = bbox
    x0 = max(0, x0 - pad)
    y0 = max(0, y0 - pad)
    x1 = min(im.width, x1 + pad)
    y1 = min(im.height, y1 + pad)
    return im.crop((x0, y0, x1, y1))


def main() -> None:
    OUT.mkdir(parents=True, exist_ok=True)
    for out_name, src_name in MAPPING.items():
        src = ASSETS / src_name
        if not src.exists():
            raise FileNotFoundError(src)
        im = Image.open(src)
        im = flood_remove_bg(im)
        im = soften_edges(im)
        im = trim_alpha(im, pad=14)
        max_side = 1200
        if max(im.size) > max_side:
            im.thumbnail((max_side, max_side), Image.Resampling.LANCZOS)
        dst = OUT / f"{out_name}.png"
        im.save(dst, optimize=True)
        print(f"ok {dst.name} {im.size}")


if __name__ == "__main__":
    main()
