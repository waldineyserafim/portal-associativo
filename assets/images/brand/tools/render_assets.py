#!/usr/bin/env python3
"""
Portal Associativo — gerador de exportações raster (PNG) e PDF vetorial
a partir da MESMA definição geométrica usada nos arquivos-fonte em
assets/images/brand/{symbol,logo}/*.svg (ver docs/brand-system/VISUAL_IDENTITY.md, seção 4.2).

Por que este script existe no repositório (e não só como resultado avulso):
qualquer pessoa deve conseguir regenerar/expandir os ativos da marca sem depender
do Claude — basta rodar `python3 assets/images/brand/tools/render_assets.py`.

Dependências: Pillow (raster), svglib + reportlab (PDF vetorial a partir do SVG).
    pip install Pillow svglib reportlab lxml

Este script NÃO faz rasterização de SVG (nenhuma biblioteca de conversão SVG->PNG
com dependência de sistema, como cairo, estava disponível no ambiente de build) —
em vez disso, redesenha a mesma geometria paramétrica diretamente com PIL, o que
garante fidelidade 1:1 com os arquivos .svg (mesmo raio, mesmo ângulo, mesma
espessura de traço) sem introduzir uma segunda fonte de verdade divergente.
"""

import math
import os
from PIL import Image, ImageDraw, ImageFont

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))  # assets/images/brand

# ---------------------------------------------------------------- palette ----
INK = (33, 29, 24, 255)            # #211D18
TERRACOTA = (168, 90, 52, 255)     # #A85A34
TERRACOTA_DEEP = (124, 67, 38, 255)  # #7C4326
PAPER = (245, 240, 230, 255)       # #F5F0E6
WHITE = (255, 255, 255, 255)
BLACK = (0, 0, 0, 255)

FONT_REGULAR = "/System/Library/Fonts/Supplemental/Arial.ttf"
FONT_BOLD = "/System/Library/Fonts/Supplemental/Arial Bold.ttf"

# ------------------------------------------------------- core geometry ------
# Native symbol space: viewBox 0 0 100 100, ring center (50,54), radius 34,
# stroke width 16, 40 degree gap centered at 90 degrees (bottom, 6 o'clock).
# Angle convention verified empirically against PIL's ImageDraw.arc(): 0 deg is
# 3 o'clock, increasing clockwise (same convention used in the .svg arc math).


def draw_ring(draw, cx, cy, r, width, color, gap_deg=40, gap_center_deg=90):
    """Renders the ring as a dense union of overlapping filled circles ("stamping")
    along the centerline arc, radius = width/2 at every step.

    BUGFIX (found during brand audit): the previous implementation used PIL's
    ImageDraw.arc(..., width=...) — which draws a stroke with *flat/tapered*
    ends, not round ones — and then bolted a full-radius circle onto each
    endpoint to fake a round cap. Because the arc's own end tapered inward
    while the bolted-on circle stayed full width, the two joined into a
    visible narrow "neck" + bulge: exactly the disallowed "duas bolinhas"
    silhouette. Stamping avoids the problem structurally: the first and last
    stamps in the sequence ARE the round caps (a circle of diameter == stroke
    width centered on the path endpoint — the literal SVG definition of
    stroke-linecap="round"), and every stamp in between overlaps enough with
    its neighbors to fill the band solidly, so there is no separate element
    that can visually detach into a "ball" — it's one continuous union.
    """
    half = gap_deg / 2
    start = gap_center_deg + half            # 110
    end = gap_center_deg - half + 360         # 430 (wraps to 70)
    sweep = end - start                      # 320
    cap_r = width / 2
    # Angular step small enough that consecutive stamp centers never drift
    # apart by more than a fraction of the stamp radius, at any r/width.
    steps = max(400, int(sweep * 8))
    for i in range(steps + 1):
        t = start + sweep * i / steps
        rad = math.radians(t)
        x = cx + r * math.cos(rad)
        y = cy + r * math.sin(rad)
        draw.ellipse([x - cap_r, y - cap_r, x + cap_r, y + cap_r], fill=color)


def draw_symbol_in_box(draw, x0, y0, box_size, color):
    """Draws the native 0-100 symbol scaled+translated into a square box."""
    scale = box_size / 100
    cx = x0 + 50 * scale
    cy = y0 + 54 * scale
    r = 34 * scale
    width = 16 * scale
    draw_ring(draw, cx, cy, r, width, color)


# ------------------------------------------------------------- exporters ----

def export_symbol_png(path, size, color, disc_fallback=False, supersample=8):
    """Symbol alone, transparent background."""
    S = size * supersample
    canvas = Image.new("RGBA", (S, S), (0, 0, 0, 0))
    d = ImageDraw.Draw(canvas)
    if disc_fallback:
        # graceful degradation (docs/brand-system/VISUAL_IDENTITY.md §4.12): below ~20px the
        # gap is closed and the mark becomes a solid disc of the same diameter.
        r = 34 / 100 * S
        cx, cy = 50 / 100 * S, 54 / 100 * S
        d.ellipse([cx - r, cy - r, cx + r, cy + r], fill=color)
    else:
        draw_symbol_in_box(d, 0, 0, S, color)
    canvas.resize((size, size), Image.LANCZOS).save(path)


def export_icon_png(path, size, bg_color, symbol_color, rounded=True,
                     corner_ratio=0.2237, symbol_ratio=0.62, supersample=8):
    """App-icon style: opaque background tile + inset symbol. corner_ratio
    0.2237 approximates the iOS 'superellipse' visual rounding at this scale."""
    S = size * supersample
    canvas = Image.new("RGBA", (S, S), (0, 0, 0, 0))
    d = ImageDraw.Draw(canvas)
    if rounded:
        d.rounded_rectangle([0, 0, S, S], radius=S * corner_ratio, fill=bg_color)
    else:
        d.rectangle([0, 0, S, S], fill=bg_color)
    box = S * symbol_ratio
    inset = (S - box) / 2
    draw_symbol_in_box(d, inset, inset, box, symbol_color)
    canvas.resize((size, size), Image.LANCZOS).save(path)


def export_maskable_png(path, size, bg_color, symbol_color, symbol_ratio=0.72, supersample=8):
    """Full-bleed, no rounding (OS applies its own mask). symbol_ratio=0.72
    matches android-maskable.svg exactly (kept in sync deliberately — see
    that file's comment for the safe-zone math) — comfortably inside the
    40%-radius / 80%-diameter 'safe zone' required by the maskable-icon spec."""
    S = size * supersample
    canvas = Image.new("RGBA", (S, S), bg_color)
    d = ImageDraw.Draw(canvas)
    box = S * symbol_ratio
    inset = (S - box) / 2
    draw_symbol_in_box(d, inset, inset, box, symbol_color)
    canvas.resize((size, size), Image.LANCZOS).save(path)


def _text_width(draw, text, font):
    bbox = draw.textbbox((0, 0), text, font=font)
    return bbox[2] - bbox[0]


def export_lockup_png(path, target_width, color, transparent=True,
                       bg_color=None, supersample=4):
    """Horizontal lockup (symbol + wordmark), scaled from the 500x100 SVG
    viewBox used in logo-horizontal.svg."""
    scale = target_width / 500
    W = round(500 * scale * supersample)
    H = round(100 * scale * supersample)
    bg = (0, 0, 0, 0) if transparent else bg_color
    canvas = Image.new("RGBA", (W, H), bg)
    d = ImageDraw.Draw(canvas)

    sym_box = 100 * scale * supersample
    draw_symbol_in_box(d, 0, 0, sym_box, color)

    font_size = round(36 * scale * supersample)
    f_reg = ImageFont.truetype(FONT_REGULAR, font_size)
    f_bold = ImageFont.truetype(FONT_BOLD, font_size)

    x = 116 * scale * supersample
    y_baseline = 66 * scale * supersample
    d.text((x, y_baseline), "Portal ", font=f_reg, fill=color, anchor="ls")
    w1 = _text_width(d, "Portal ", f_reg)
    d.text((x + w1, y_baseline), "associativo", font=f_bold, fill=color, anchor="ls")

    out_w, out_h = round(W / supersample), round(H / supersample)
    canvas.resize((out_w, out_h), Image.LANCZOS).save(path)


def export_banner_linkedin(path, width=1584, height=396):
    canvas = Image.new("RGBA", (width, height), PAPER)
    d = ImageDraw.Draw(canvas)
    # lockup, left aligned with generous clear space (padding = its own stroke width)
    lockup_w = width * 0.34
    scale = lockup_w / 500
    sym_box = 100 * scale
    pad_x = width * 0.09
    pad_y = (height - 100 * scale) / 2
    draw_symbol_in_box(d, pad_x, pad_y, sym_box, TERRACOTA)

    font_size = round(36 * scale)
    f_reg = ImageFont.truetype(FONT_REGULAR, font_size)
    f_bold = ImageFont.truetype(FONT_BOLD, font_size)
    x = pad_x + 116 * scale
    y_baseline = pad_y + 66 * scale
    d.text((x, y_baseline), "Portal ", font=f_reg, fill=INK, anchor="ls")
    w1 = _text_width(d, "Portal ", f_reg)
    d.text((x + w1, y_baseline), "associativo", font=f_bold, fill=INK, anchor="ls")
    canvas.save(path)


TEXT_MUTED = (107, 97, 86, 255)  # #6B6156


def export_og_cover(path, width=1200, height=630):
    """Open Graph / Twitter Card cover. Mirrors og-cover.svg exactly (same
    symbol transform, same text positions/sizes) — kept in sync deliberately
    because a previous og-cover.png (found during the brand audit) had text
    clipped past the right edge of the canvas: it had gone stale relative to
    a since-revised og-cover.svg. Asserting the fit here, not just eyeballing
    it, is what prevents that regression from happening silently again."""
    canvas = Image.new("RGBA", (width, height), PAPER)
    d = ImageDraw.Draw(canvas)

    # symbol: native (50,54) center maps to canvas (230,315) at scale 4.1176
    sym_scale = 4.1176
    draw_ring(d, 230, 315, 34 * sym_scale, 16 * sym_scale, TERRACOTA)

    title, subtitle = "Portal associativo", "O seu maior ativo é o sócio ativo."
    x, right_margin = 430, 60
    max_w = width - x - right_margin

    f_title = ImageFont.truetype(FONT_BOLD, 66)
    f_sub = ImageFont.truetype(FONT_REGULAR, 30)
    tw, sw = _text_width(d, title, f_title), _text_width(d, subtitle, f_sub)
    assert tw <= max_w, f"og-cover title overflows canvas: {tw:.0f}px > {max_w}px available"
    assert sw <= max_w, f"og-cover subtitle overflows canvas: {sw:.0f}px > {max_w}px available"

    d.text((x, 300), title, font=f_title, fill=INK, anchor="ls")
    d.text((x, 352), subtitle, font=f_sub, fill=TEXT_MUTED, anchor="ls")
    canvas.save(path)


# ------------------------------------------------------------------ main ----

def main():
    # Icons live in the pre-existing sibling "assets/images/icons/" folder —
    # a convention already established by this project before the brand
    # package existed (see manifest.webmanifest / index.html) — not nested
    # under assets/images/brand/. Everything else nests under ROOT as before.
    icon_dir = os.path.join(ROOT, "..", "icons")
    social_dir = os.path.join(ROOT, "social")
    pres_dir = os.path.join(ROOT, "presentations")
    exp_png = os.path.join(ROOT, "exports", "png")
    exp_svg = os.path.join(ROOT, "exports", "svg")

    # --- favicons: transparent, terracota, symbol only ---
    # 16px keeps the gap barely legible; below that graceful degradation kicks in
    # (see docs/brand-system/VISUAL_IDENTITY.md §4.12) — used here for the smallest tile only.
    export_symbol_png(os.path.join(icon_dir, "favicon-16.png"), 16, TERRACOTA, disc_fallback=True)
    export_symbol_png(os.path.join(icon_dir, "favicon-32.png"), 32, TERRACOTA)
    export_symbol_png(os.path.join(icon_dir, "favicon-48.png"), 48, TERRACOTA)
    export_symbol_png(os.path.join(icon_dir, "favicon-64.png"), 64, TERRACOTA)
    export_symbol_png(os.path.join(icon_dir, "favicon-128.png"), 128, TERRACOTA)

    # --- app icons: opaque, off-white SQUARE tile + terracota symbol.
    # Deliberately NOT pre-rounded: Apple's App Store Connect rejects icons
    # with an alpha channel and expects a full square (it applies its own
    # corner mask), and Android's Play Store icon upload does the same for
    # the legacy/adaptive foreground. Pre-rounding here would both violate
    # store requirements and duplicate a rounding the OS already applies.
    for size in (192, 256, 512, 1024):
        export_icon_png(os.path.join(icon_dir, f"app-icon-{size}.png"), size, PAPER, TERRACOTA, rounded=False)

    # --- apple touch icon: opaque, NO pre-rounding (iOS applies its own mask) ---
    export_icon_png(os.path.join(icon_dir, "apple-touch-icon.png"), 180, PAPER, TERRACOTA, rounded=False)

    # --- android maskable: full-bleed opaque, symbol inside 80% safe zone ---
    export_maskable_png(os.path.join(icon_dir, "android-maskable.png"), 512, PAPER, TERRACOTA)

    # --- social avatars: opaque, square (every platform crops to its own
    # circular/rounded mask on upload — pre-rounding here would fight that) ---
    export_icon_png(os.path.join(social_dir, "avatar-instagram.png"), 1080, PAPER, TERRACOTA, rounded=False)
    export_icon_png(os.path.join(social_dir, "avatar-linkedin.png"), 400, PAPER, TERRACOTA, rounded=False)
    export_icon_png(os.path.join(social_dir, "avatar-whatsapp.png"), 640, PAPER, TERRACOTA, rounded=False)
    export_icon_png(os.path.join(social_dir, "avatar-facebook.png"), 720, PAPER, TERRACOTA, rounded=False)
    export_banner_linkedin(os.path.join(social_dir, "banner-linkedin.png"))

    # --- Open Graph / Twitter Card cover (mirrors og-cover.svg) ---
    export_og_cover(os.path.join(ROOT, "og-cover.png"))

    # --- presentations: transparent lockups, large ---
    export_lockup_png(os.path.join(pres_dir, "logo-png-transparent.png"), 2400, INK, transparent=True)
    export_lockup_png(os.path.join(pres_dir, "logo-white-transparent.png"), 2400, WHITE, transparent=True)

    # --- flattened export bundle (png) ---
    export_symbol_png(os.path.join(exp_png, "symbol-1024.png"), 1024, TERRACOTA)
    export_lockup_png(os.path.join(exp_png, "logo-horizontal-2400.png"), 2400, INK, transparent=True)
    export_icon_png(os.path.join(exp_png, "app-icon-1024.png"), 1024, PAPER, TERRACOTA, rounded=False)

    print("PNG export complete.")


if __name__ == "__main__":
    main()
