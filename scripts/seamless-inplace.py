#!/usr/bin/env python3
"""Make an existing texture tile seamlessly by blending opposite edges IN PLACE.
Only ~frac of each border is touched, so the look/interior is preserved — it just
kills the hard repeat seam. Usage: seamless-inplace.py <file> [frac=0.06]"""
import sys, numpy as np
from PIL import Image

def edge_blend(a, frac=0.06):
    a=a.astype(np.float32); H,W=a.shape[0],a.shape[1]
    C=a.shape[2] if a.ndim==3 else 1
    if a.ndim==2: a=a[:,:,None]
    out=a.copy(); m=max(6,int(W*frac))
    for i in range(m):
        w=0.5*(0.5*(1+np.cos(np.pi*i/m)))
        out[:,i]=a[:,i]*(1-w)+a[:,W-m+i]*w
        out[:,W-1-i]=a[:,W-1-i]*(1-w)+a[:,m-1-i]*w
    a2=out.copy(); m=max(6,int(H*frac))
    for j in range(m):
        w=0.5*(0.5*(1+np.cos(np.pi*j/m)))
        out[j,:]=a2[j,:]*(1-w)+a2[H-m+j,:]*w
        out[H-1-j,:]=a2[H-1-j,:]*(1-w)+a2[m-1-j,:]*w
    out=np.clip(out,0,255).astype(np.uint8)
    return out[:,:,0] if C==1 else out

f=sys.argv[1]; frac=float(sys.argv[2]) if len(sys.argv)>2 else 0.06
im=Image.open(f); mode=im.mode
a=np.asarray(im.convert('RGB' if mode not in ('L','RGB') else mode))
b=edge_blend(a, frac)
out=Image.fromarray(b)
if f.lower().endswith(('.jpg','.jpeg')): out.convert('RGB').save(f,quality=93)
else: out.save(f)
print('seamless',f)
