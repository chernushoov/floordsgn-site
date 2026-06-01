#!/usr/bin/env python3
"""Rebuild one material's PBR maps from a REAL source photo: clean square crop ->
mirror-free seamless (edge-blend) -> diffuse + derived normal + roughness.
Usage: rebuild-texture.py <src.jpg> <out_dir> [size=2048] [normal_strength=2.2]"""
import sys, os, numpy as np
from PIL import Image

def edge_blend(a, frac=0.12):
    a=a.astype(np.float32); H,W,C=a.shape; out=a.copy()
    m=max(8,int(W*frac))
    for i in range(m):
        wgt=0.5*(0.5*(1+np.cos(np.pi*i/m)))
        out[:,i]=a[:,i]*(1-wgt)+a[:,W-m+i]*wgt
        out[:,W-1-i]=a[:,W-1-i]*(1-wgt)+a[:,m-1-i]*wgt
    a2=out.copy(); m=max(8,int(H*frac))
    for j in range(m):
        wgt=0.5*(0.5*(1+np.cos(np.pi*j/m)))
        out[j,:]=a2[j,:]*(1-wgt)+a2[H-m+j,:]*wgt
        out[H-1-j,:]=a2[H-1-j,:]*(1-wgt)+a2[m-1-j,:]*wgt
    return np.clip(out,0,255).astype(np.uint8)

def square_crop(a, frac=0.92):
    # take a centered square = frac * min(H,W). Smaller frac avoids hexagon masks /
    # perspective edges / vignettes on awkward source photos.
    H,W,_=a.shape; s=int(min(H,W)*frac)
    y0=(H-s)//2; x0=(W-s)//2
    return a[y0:y0+s, x0:x0+s]

def sobel(g):
    import numpy as np
    kx=np.array([[-1,0,1],[-2,0,2],[-1,0,1]],dtype=np.float32)
    ky=kx.T
    from numpy.lib.stride_tricks import sliding_window_view
    gp=np.pad(g,1,mode='wrap')
    win=sliding_window_view(gp,(3,3))
    dx=np.einsum('ijkl,kl->ij',win,kx)
    dy=np.einsum('ijkl,kl->ij',win,ky)
    return dx,dy

def _blur(g, r=3):
    from numpy.lib.stride_tricks import sliding_window_view
    k=2*r+1; gp=np.pad(g,r,mode='wrap')
    return sliding_window_view(gp,(k,k)).mean(axis=(-1,-2))

def make_normal(diff, strength=2.2):
    g=(0.299*diff[:,:,0]+0.587*diff[:,:,1]+0.114*diff[:,:,2])/255.0
    g=_blur(g,3)              # smooth so chip COLOUR edges don't become fake relief (polished floors are flat)
    dx,dy=sobel(g)
    nx=-dx*strength; ny=-dy*strength; nz=np.ones_like(g)
    l=np.sqrt(nx*nx+ny*ny+nz*nz)+1e-6
    nx/=l; ny/=l; nz/=l
    out=np.stack([(nx*0.5+0.5),(ny*0.5+0.5),(nz*0.5+0.5)],-1)
    return (out*255).astype(np.uint8)

def make_rough(diff, base=0.62, amp=0.22):
    g=(0.299*diff[:,:,0]+0.587*diff[:,:,1]+0.114*diff[:,:,2])/255.0
    # chips (darker/harder) slightly glossier, matrix slightly rougher -> subtle variation
    r=base+amp*(g-g.mean())
    r=np.clip(r,0.25,0.95)
    return (r*255).astype(np.uint8)

def make_ao(diff, amp=0.30):
    # subtle cavity AO: aggregate edges darker than their neighbourhood = slight occlusion.
    g=(0.299*diff[:,:,0]+0.587*diff[:,:,1]+0.114*diff[:,:,2])/255.0
    from numpy.lib.stride_tricks import sliding_window_view
    gp=np.pad(g,2,mode='wrap'); win=sliding_window_view(gp,(5,5))
    cav=np.clip(win.mean(axis=(-1,-2))-g,0,None)
    ao=1.0-amp*(cav/(cav.max()+1e-6))
    return (np.clip(ao,0.45,1.0)*255).astype(np.uint8)

src,out_dir=sys.argv[1],sys.argv[2]
size=int(sys.argv[3]) if len(sys.argv)>3 else 2048
strength=float(sys.argv[4]) if len(sys.argv)>4 else 2.2
crop=float(sys.argv[5]) if len(sys.argv)>5 else 0.92
a=np.asarray(Image.open(src).convert('RGB'))
a=square_crop(a,crop)
im=Image.fromarray(a).resize((size,size),Image.LANCZOS)
diff=edge_blend(np.asarray(im))
if out_dir.lower().endswith(('.jpg','.jpeg')):     # diffuse-only mode (design tile)
    os.makedirs(os.path.dirname(out_dir) or '.',exist_ok=True)
    Image.fromarray(diff).save(out_dir,quality=92)
    print('wrote diffuse tile',out_dir,'size',size)
else:                                              # full PBR set (base material)
    os.makedirs(out_dir,exist_ok=True)
    Image.fromarray(diff).save(os.path.join(out_dir,'diffuse.jpg'),quality=92)
    Image.fromarray(make_normal(diff,strength)).save(os.path.join(out_dir,'normal.png'))
    Image.fromarray(make_rough(diff)).convert('L').save(os.path.join(out_dir,'roughness.png'))
    Image.fromarray(make_ao(diff)).convert('L').save(os.path.join(out_dir,'ao.png'))
    print('wrote diffuse/normal/roughness/ao to',out_dir,'size',size)
