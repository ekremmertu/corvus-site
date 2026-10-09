import json, sys
from PIL import Image, ImageDraw, ImageFont
FONT='/System/Library/Fonts/SFNS.ttf'
def font(size, w):
    f=ImageFont.truetype(FONT, size); f.set_variation_by_axes([100, 17 if size<20 else 28, 400, w]); return f
def dist(a,b): return sum((x-y)**2 for x,y in zip(a,b))**.5
def run(src, ocr, mp, out, extra=()):
    im=Image.open(src).convert('RGB'); px=im.load(); W,H=im.size; d=ImageDraw.Draw(im)
    boxes=json.load(open(ocr)); used=set()
    jobs=[]
    for b in boxes:
        if b['t'] in mp: jobs.append((b, mp[b['t']])); used.add(b['t'])
    for b,o in list(extra): jobs.append((b,o))
    miss=[k for k in mp if k not in used]; 
    if miss: print('MISSING', miss)
    # pass 1: measure colors before erasing
    meta=[]
    for b,o in jobs:
        if isinstance(o,str): o={'t':o}
        p=o.get('pad',4); x0,y0=max(0,b['x']-p),max(0,b['y']-p); x1,y1=min(W-1,b['x']+b['w']+p+o.get('padr',0)),min(H-1,b['y']+b['h']+p)
        L=lambda y: px[max(0,x0-3),y]; R=lambda y: px[min(W-1,x1+3),y]
        rows={y:(L(y),R(y)) for y in range(y0,y1+1)}
        mid=y0+(y1-y0)//2; bg=tuple((a+c)//2 for a,c in zip(*rows[mid]))
        cand=[px[x,y] for y in range(b['y'],b['y']+b['h']) for x in range(b['x'],b['x']+b['w'])]
        cand.sort(key=lambda c:-dist(c,bg)); top=cand[:max(1,len(cand)//12)]
        col=tuple(o['color']) if o.get('color') else tuple(sum(c[i] for c in top)//len(top) for i in range(3))
        meta.append((b,o,x0,y0,x1,y1,rows,col))
    for b,o,x0,y0,x1,y1,rows,col in meta:
        if o.get('keepbg'): pass
        for y in range(y0,y1+1):
            l,r=rows[y]
            for x in range(x0,x1+1):
                t=(x-x0)/max(1,x1-x0); px[x,y]=tuple(int(l[i]*(1-t)+r[i]*t) for i in range(3))
    for b,o,x0,y0,x1,y1,rows,col in meta:
        txt=o.get('t') or ''.join(t for t,_ in o.get('segs',[]))
        if not txt: continue
        w=o.get('w',500); size=o.get('size') or max(8,round(b['h']*o.get('k',0.86)))
        maxw=o.get('maxw', b['w']*1.35)
        f=font(size,w)
        while d.textlength(txt,font=f)>maxw and size>7: size-=1; f=font(size,w)
        if o.get('dot'):
            cy=b['y']+b['h']/2; d.ellipse((b['x']+1,cy-6,b['x']+13,cy+6),fill=tuple(o['dot']))
        if o.get('segs'):
            tw=sum(d.textlength(t,font=f) for t,_ in o['segs']); a=o.get('a','l')
            x={'l':b['x'],'c':b['x']+b['w']/2-tw/2,'r':b['x']+b['w']-tw}[a]
            for t,c in o['segs']:
                d.text((x,b['y']+b['h']/2+o.get('dy',0)),t,font=f,fill=tuple(c),anchor='lm'); x+=d.textlength(t,font=f)
            continue
        a=o.get('a','l'); x={'l':b['x']+o.get('dx',0),'c':b['x']+b['w']/2,'r':b['x']+b['w']}[a]
        d.text((x,b['y']+b['h']/2+o.get('dy',0)),txt,font=f,fill=col,anchor={'l':'lm','c':'mm','r':'rm'}[a])
    im.save(out,quality=90); print('ok',out)
if __name__=='__main__':
    cfg=json.load(open(sys.argv[1])); run(cfg['src'],cfg['ocr'],cfg['map'],cfg['out'])
