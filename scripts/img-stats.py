#!/usr/bin/env python3
"""Blind-QA helper: luminance stats per region so we can judge a render without viewing it.
Usage: python3 scripts/img-stats.py <png> [<png> ...]"""
import sys
from PIL import Image
import numpy as np

def stat(reg, name):
    return f"  {name:14s} mean={reg.mean():6.1f}  std={reg.std():6.1f}  min={reg.min():3.0f}  max={reg.max():3.0f}"

for path in sys.argv[1:]:
    try:
        im = Image.open(path).convert('RGB')
    except Exception as e:
        print(f"\n== {path}  FAILED: {e}"); continue
    a = np.asarray(im).astype(np.float32)
    lum = 0.2126*a[:,:,0] + 0.7152*a[:,:,1] + 0.0722*a[:,:,2]
    h, w = lum.shape
    print(f"\n== {path}  ({w}x{h}) ==")
    print(stat(lum, 'ALL'))
    print(stat(lum[:h//3], 'top(ceiling)'))
    print(stat(lum[h//3:2*h//3], 'mid(walls)'))
    bf = lum[2*h//3:]
    print(stat(bf, 'bottom(floor)'))
    print(f"  near-black={ (lum<10).mean()*100:5.1f}%   near-white={ (lum>245).mean()*100:5.1f}%")
    colmean = bf.mean(axis=0)
    print(f"  floor reflection cue: col-brightness spread={colmean.max()-colmean.min():.0f} "
          f"(min={colmean.min():.0f} max={colmean.max():.0f})  rowvar(std of row-means)={bf.mean(axis=1).std():.1f}")
