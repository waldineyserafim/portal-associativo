#!/usr/bin/env python3
"""
Portal Associativo — exportação de PDF vetorial a partir dos SVGs mestre.

Gera PDF vetorial de verdade (não raster embutido em PDF) usando svglib para
interpretar o SVG e reportlab para desenhar os comandos vetoriais no PDF —
nenhuma das duas depende de bibliotecas de sistema como cairo/rsvg, o que as
torna reproduzíveis em qualquer máquina só com `pip install`.

Dependências:
    pip install svglib reportlab lxml

Uso:
    python3 assets/images/brand/tools/export_pdf.py
"""

import os
from svglib.svglib import svg2rlg
from reportlab.graphics import renderPDF

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))  # assets/images/brand

SOURCES = [
    ("logo/logo-horizontal.svg", "exports/pdf/logo-horizontal.pdf"),
    ("logo/logo-vertical.svg", "exports/pdf/logo-vertical.pdf"),
    ("logo/logo-positive.svg", "exports/pdf/logo-positive.pdf"),
    ("logo/logo-negative.svg", "exports/pdf/logo-negative.pdf"),
    ("logo/logo-monochrome.svg", "exports/pdf/logo-monochrome.pdf"),
    ("symbol/symbol-positive.svg", "exports/pdf/symbol.pdf"),
    ("print/logo-black.svg", "exports/pdf/logo-black.pdf"),
    ("print/logo-white.svg", "exports/pdf/logo-white.pdf"),
]


def main():
    for src_rel, dst_rel in SOURCES:
        src = os.path.join(ROOT, src_rel)
        dst = os.path.join(ROOT, dst_rel)
        os.makedirs(os.path.dirname(dst), exist_ok=True)
        drawing = svg2rlg(src)
        renderPDF.drawToFile(drawing, dst)
        print(f"{src_rel:35s} -> {dst_rel}")
    print("PDF export complete.")


if __name__ == "__main__":
    main()
