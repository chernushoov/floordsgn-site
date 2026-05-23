#!/usr/bin/env python3
"""Generate floor-system SECTION DETAIL drawings (SVG) for architects/designers.
Technical line-drawing style, FloorDSGN brand. NTS — real thicknesses called out.
One SVG per system from the layer table. Output: <slug>-section.svg here.
"""
import os
HERE = os.path.dirname(os.path.abspath(__file__))

CARBON="#151515"; STEEL="#72716D"; SIGNAL="#C86B3C"; CONCRETE="#F3F0EA"; PAPER="#FFFFFF"
# (display name, [(layer label, thickness mm, fill)]) top->bottom ; substrate last
SYS = {
 "epoxy": ("Epoxy SL (self-levelling)", [("Topcoat / sealer",0.2,"#d9d4cb"),("Epoxy body",4,"#b9a98f"),("Primer",0.15,"#cdb2a0"),("Concrete substrate",40,"hatch")], ["EN 13813 SR","EN 1504-2","ASTM F2170 (RH ≤ 85%)","ICRI CSP 3-4"]),
 "pu-cement": ("PU-Cement (heavy duty)", [("Topcoat",0.5,"#d9d4cb"),("PU-cement body",6.5,"#a9b0a3"),("Primer",0.3,"#cdb2a0"),("Concrete substrate",40,"hatch")], ["EN 13813","EN 1504-2","ASTM F2170","ICRI CSP 4-6"]),
 "mma": ("MMA (fast-cure)", [("Sealer",1,"#d9d4cb"),("MMA body",4.5,"#c8c2b0"),("MMA primer",0.5,"#cdb2a0"),("Concrete substrate",40,"hatch")], ["EN 13813","DIN 51130 (slip)","ASTM F2170","ICRI CSP 3-5"]),
 "microtopping": ("Microtopping / microcement", [("Sealer (2 coats)",0.1,"#d9d4cb"),("Microcement body",2.4,"#cfc8ba"),("Fibreglass mesh",0.3,"#d8d23a"),("Primer",0.15,"#cdb2a0"),("Concrete substrate",40,"hatch")], ["EN 13813","EN 1504-2","ASTM F2170","substrate SR1-SR2"]),
 "terrazzo-cement": ("Terrazzo — cementitious (bonded)", [("Sealer",0.1,"#d9d4cb"),("Cement terrazzo body + aggregate",15,"#cbb9a0"),("Primer / slurry",0.2,"#cdb2a0"),("Concrete substrate",60,"hatch")], ["NTMA","EN 13813","EN 1504-2","divider strips @ field grid"]),
 "terrazzo-multi": ("Terrazzo — multi / Palladiana", [("Sealer",0.2,"#d9d4cb"),("Terrazzo body + large aggregate",15,"#c6b298"),("Primer",0.8,"#cdb2a0"),("Concrete substrate",60,"hatch")], ["NTMA","EN 13813","divider strips","aggregate single batch"]),
 "terrazzo-epoxy": ("Terrazzo — epoxy (thin-set)", [("Gloss topcoat",0.5,"#d9d4cb"),("Epoxy terrazzo body + aggregate",15,"#c9b59c"),("Epoxy primer",0.15,"#cdb2a0"),("Concrete substrate",60,"hatch")], ["NTMA","EN 13813","ASTM F2170","non-porous matrix"]),
 "comfortfloor": ("ComfortFloor (elastic PU)", [("Topcoat",0.3,"#d9d4cb"),("Elastic PU wear layer",2.4,"#cfc9c2"),("Recycled-PU comfort pad",5,"#9a9aa0"),("Primer",0.15,"#cdb2a0"),("Concrete substrate",40,"hatch")], ["EN 13813","EN ISO 10140 (acoustic)","ASTM F2170"]),
 "decorative-concrete": ("Decorative / polished concrete", [("Penetrating sealer",0.4,"#d9d4cb"),("Concrete wear body (ground & polished)",60,"#c7c3ba"),("Bonding bridge",0.3,"#cdb2a0"),("Slab substrate",40,"hatch")], ["EN 13813","DIN 51130","ACI 117 tolerances"]),
 "rubber": ("Rubber — poured EPDM", [("PU seal + EPDM granule",0.6,"#cdb2a0"),("EPDM rubber body (1-4mm granule)",11,"#6f6f73"),("Primer",0.15,"#cdb2a0"),("Concrete substrate",40,"hatch")], ["EN 14904 (sports)","EN 1177 (fall height)","ASTM F2170"]),
}

def esc(s): return str(s).replace("&","&amp;").replace("<","&lt;").replace(">","&gt;")

W,H = 1000,720
PLATE_X, PLATE_W = 360, 300        # section column
TOP_Y, STACK_H = 150, 380          # drawing area for the stack (visual, NTS)

def layer_vis_h(th, total):
    # NTS: give thin layers a readable min height, scale the rest
    base = max(14, (th/total)*STACK_H*0.7)
    return base

def svg(slug):
    name, layers, stds = SYS[slug]
    total = sum(t for _,t,_ in layers)
    vis = [layer_vis_h(t,total) for _,t,_ in layers]
    scale = STACK_H/sum(vis); vis=[v*scale for v in vis]
    o=[]
    o.append(f'<svg xmlns="http://www.w3.org/2000/svg" width="{W}" height="{H}" viewBox="0 0 {W} {H}" font-family="Montserrat,Arial,sans-serif">')
    o.append(f'<rect width="{W}" height="{H}" fill="{PAPER}"/>')
    # hatch pattern for concrete
    o.append(f'<defs><pattern id="hatch" width="9" height="9" patternTransform="rotate(45)" patternUnits="userSpaceOnUse"><line x1="0" y1="0" x2="0" y2="9" stroke="{STEEL}" stroke-width="1"/></pattern></defs>')
    # title block
    o.append(f'<text x="56" y="64" font-size="13" letter-spacing="3" fill="{SIGNAL}">FLOOR.DSGN — SECTION DETAIL</text>')
    o.append(f'<text x="56" y="98" font-size="30" font-weight="600" fill="{CARBON}">{esc(name)}</text>')
    o.append(f'<line x1="56" y1="116" x2="{W-56}" y2="116" stroke="{CARBON}" stroke-width="2"/>')
    o.append(f'<text x="56" y="140" font-size="13" fill="{STEEL}">Total build-up: <tspan font-weight="600" fill="{CARBON}">~{total:g} mm</tspan> · NTS — nominal thicknesses, verify substrate &amp; system on site</text>')
    # stack — pass 1: rects + layer centers
    y=TOP_Y; centers=[]
    for (lbl,th,fill),vh in zip(layers,vis):
        f = "url(#hatch)" if fill=="hatch" else fill
        o.append(f'<rect x="{PLATE_X}" y="{y:.1f}" width="{PLATE_W}" height="{vh:.1f}" fill="{f}" stroke="{CARBON}" stroke-width="1.4"/>')
        centers.append(y+vh/2); y+=vh
    # pass 2: declutter labels (min vertical gap) with angled leaders
    GAP=42; lx=PLATE_X+PLATE_W
    lys=list(centers)
    for i in range(1,len(lys)):
        if lys[i] < lys[i-1]+GAP: lys[i]=lys[i-1]+GAP
    for (lbl,th,fill),cy,lyl in zip(layers,centers,lys):
        o.append(f'<polyline points="{lx},{cy:.1f} {lx+26},{lyl:.1f} {lx+40},{lyl:.1f}" fill="none" stroke="{STEEL}" stroke-width="1"/>')
        o.append(f'<circle cx="{lx}" cy="{cy:.1f}" r="2" fill="{STEEL}"/>')
        o.append(f'<text x="{lx+48}" y="{lyl-2:.1f}" font-size="14" font-weight="500" fill="{CARBON}">{esc(lbl)}</text>')
        o.append(f'<text x="{lx+48}" y="{lyl+15:.1f}" font-size="12" fill="{STEEL}">{th:g} mm</text>')
    # total dimension line (left)
    dx=PLATE_X-46
    o.append(f'<line x1="{dx}" y1="{TOP_Y}" x2="{dx}" y2="{y:.1f}" stroke="{SIGNAL}" stroke-width="1.4"/>')
    for yy in (TOP_Y,y):
        o.append(f'<line x1="{dx-6}" y1="{yy:.1f}" x2="{dx+6}" y2="{yy:.1f}" stroke="{SIGNAL}" stroke-width="1.4"/>')
    o.append(f'<text x="{dx-12}" y="{(TOP_Y+y)/2:.1f}" font-size="13" font-weight="600" fill="{CARBON}" text-anchor="end" transform="rotate(-90 {dx-12} {(TOP_Y+y)/2:.1f})">~{total:g} mm</text>')
    # standards footer
    o.append(f'<text x="56" y="{H-70}" font-size="12" letter-spacing="2" fill="{STEEL}">STANDARDS / REFERENCES</text>')
    o.append(f'<text x="56" y="{H-48}" font-size="13" fill="{CARBON}">{esc("   ·   ".join(stds))}</text>')
    o.append(f'<text x="56" y="{H-22}" font-size="11" fill="{STEEL}">© Floor.DSGN · floordsgn.netlify.app · for specification use — confirm system &amp; warranty in project proposal.</text>')
    o.append('</svg>')
    return "\n".join(o)

if __name__=="__main__":
    for slug in SYS:
        open(os.path.join(HERE,f"{slug}-section.svg"),"w").write(svg(slug))
    print("generated", len(SYS), "section SVGs in", HERE)
