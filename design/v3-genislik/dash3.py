import math, random
random.seed(41)
def smooth(pts):
  d=f'M{pts[0][0]:.1f},{pts[0][1]:.1f}'
  for i in range(1,len(pts)):
    x0,y0=pts[i-1]; x1,y1=pts[i]; cx=(x0+x1)/2
    d+=f' C{cx:.1f},{y0:.1f} {cx:.1f},{y1:.1f} {x1:.1f},{y1:.1f}'
  return d
# 26 hafta gerçek + 4 hafta tahmin
N=26; F=4
base=[11000+900*math.sin(i/26*2*math.pi*1.3+0.6)+i*45 for i in range(N+F)]
real=[b+random.uniform(-420,420) for b in base[:N]]
real[9]-=1500   # bayram düşüşü
real[18]+=1300  # kampanya
plan=[b+150 for b in base]
fc=base[N:]
def tr(n): return f'{n:,.0f}'.replace(',','.')
def dash(theme):
  dark=theme=='gece'
  bg='#0b0b0f' if dark else '#f6f4ef'; card='rgba(255,255,255,.035)' if dark else '#ffffff'
  stroke='rgba(255,255,255,.07)' if dark else 'rgba(0,0,0,.06)'; ink='#fff' if dark else '#0d0d0f'
  dim='#7c7c86' if dark else '#8a867e'; soft='#b9b9c2' if dark else '#4a4740'
  grid='rgba(255,255,255,.05)' if dark else 'rgba(0,0,0,.05)'; track='rgba(255,255,255,.07)' if dark else 'rgba(0,0,0,.07)'
  mint='#7DEBDA' if dark else '#0f9f86'; coral='#FF9A7A' if dark else '#e2603c'; lila='#C2A2FF' if dark else '#8a63e6'
  o=[]; A=o.append
  A('<svg viewBox="0 0 1040 650" xmlns="http://www.w3.org/2000/svg" font-family="Inter Tight, -apple-system, sans-serif">')
  A('<defs><linearGradient id="sh" x1="0" x2="1"><stop offset="0" stop-color="#8E9BFF"/><stop offset=".5" stop-color="#C2A2FF"/><stop offset="1" stop-color="#7DEBDA"/></linearGradient>'
    f'<linearGradient id="fa" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#C2A2FF" stop-opacity="{.28 if dark else .2}"/><stop offset="1" stop-color="#7DEBDA" stop-opacity="0"/></linearGradient>'
    f'<radialGradient id="glow" cx=".85" cy="0" r=".7"><stop offset="0" stop-color="#C2A2FF" stop-opacity="{.2 if dark else .16}"/><stop offset="1" stop-color="#C2A2FF" stop-opacity="0"/></radialGradient>'
    f'<pattern id="hatch" width="6" height="6" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><rect width="6" height="6" fill="{lila}" opacity=".07"/><line x1="0" y1="0" x2="0" y2="6" stroke="{lila}" stroke-opacity=".35" stroke-width="1.2"/></pattern>'
    '<filter id="bl"><feGaussianBlur stdDeviation="5"/></filter></defs>')
  A(f'<rect width="1040" height="650" fill="{bg}"/><rect width="1040" height="650" fill="url(#glow)"/>')
  # üst bar
  A(f'<circle cx="44" cy="40" r="5" fill="url(#sh)"/><text x="60" y="45" fill="{ink}" font-size="15" font-weight="600">Operasyon</text>')
  for x,t,on in [(160,'Genel bakış',1),(260,'Sevkiyat',0),(340,'Stok',0),(398,'Tahmin',0)]:
    A(f'<text x="{x}" y="45" fill="{ink if on else dim}" font-size="13">{t}</text>')
  A(f'<rect x="150" y="56" width="88" height="2" rx="1" fill="url(#sh)"/>')
  A(f'<rect x="700" y="24" width="96" height="30" rx="15" fill="{card}" stroke="{stroke}"/><text x="716" y="44" fill="{soft}" font-size="12">Tüm bölgeler</text>')
  A(f'<rect x="804" y="24" width="112" height="30" rx="15" fill="{card}" stroke="{stroke}"/><text x="820" y="44" fill="{soft}" font-size="12">Son 26 hafta</text>')
  A(f'<circle cx="932" cy="39" r="4" fill="{mint}"/><text x="942" y="43" fill="{dim}" font-size="11">Canlı · 09:41</text>')
  A(f'<line x1="32" y1="72" x2="1008" y2="72" stroke="{stroke}"/>')
  # ANA KART
  X0,X1,Y0,Y1=60,640,206,332  # çizgi alanı
  A(f'<rect x="32" y="88" width="640" height="318" rx="20" fill="{card}" stroke="{stroke}"/>')
  A(f'<text x="56" y="116" fill="{dim}" font-size="11" letter-spacing="2.2">HAFTALIK SEVKİYAT · KOLİ</text>')
  A(f'<text x="54" y="164" fill="{ink}" font-size="44" font-weight="500" letter-spacing="-2">{tr(real[-1])}</text>')
  A(f'<rect x="196" y="140" width="64" height="22" rx="11" fill="{mint}" fill-opacity=".13"/><text x="207" y="155" fill="{mint}" font-size="11.5" font-weight="600">▲ %8,2</text>')
  A(f'<text x="268" y="155" fill="{dim}" font-size="11.5">plana göre +%2,4  ·  26 haftalık toplam 297.360</text>')
  # legend
  lx=402
  for c,t,dsh in [('#A9B4FF','Gerçek',''),(dim,'Plan','3 4'),(lila,'Tahmin · %80','')]:
    if t.startswith('Tahmin'): A(f'<rect x="{lx}" y="104" width="14" height="10" rx="2" fill="url(#hatch)"/>')
    else: A(f'<line x1="{lx}" y1="109" x2="{lx+14}" y2="109" stroke="{c}" stroke-width="2.5" stroke-dasharray="{dsh}" stroke-linecap="round"/>')
    A(f'<text x="{lx+20}" y="113" fill="{dim}" font-size="11">{t}</text>'); lx+=len(t)*6+40
  lo,hi=8500,14000
  Y=lambda v: Y1-(v-lo)/(hi-lo)*(Y1-Y0)
  step=(X1-X0)/(N+F-1); Xi=lambda i: X0+i*step
  for v in [9000,11000,13000]:
    A(f'<line x1="{X0}" y1="{Y(v):.1f}" x2="{X1}" y2="{Y(v):.1f}" stroke="{grid}"/><text x="{X1+4}" y="{Y(v)+3:.1f}" fill="{dim}" font-size="9">{v//1000}b</text>')
  # tahmin bandı
  bx0=Xi(N-1)
  up=[(Xi(N-1),Y(real[-1]))]+[(Xi(N+k),Y(fc[k]+300+k*260)) for k in range(F)]
  dn=[(Xi(N+k),Y(fc[k]-300-k*260)) for k in range(F)][::-1]+[(Xi(N-1),Y(real[-1]))]
  A(f'<rect x="{bx0:.1f}" y="{Y0-14}" width="{X1-bx0:.1f}" height="{Y1-Y0+14}" fill="{lila}" opacity=".035"/>')
  A('<path d="M'+' L'.join(f'{x:.1f},{y:.1f}' for x,y in up+dn)+' Z" fill="url(#hatch)"/>')
  A(f'<path d="{smooth([(Xi(N-1),Y(real[-1]))]+[(Xi(N+k),Y(fc[k])) for k in range(F)])}" fill="none" stroke="{lila}" stroke-width="2" stroke-dasharray="2 4" stroke-linecap="round"/>')
  A(f'<text x="{bx0+6:.1f}" y="{Y0-4}" fill="{lila}" font-size="9.5" letter-spacing="1.2">TAHMİN</text>')
  # plan
  A(f'<path d="{smooth([(Xi(i),Y(plan[i])) for i in range(N)])}" fill="none" stroke="{dim}" stroke-width="1.3" stroke-dasharray="3 5" opacity=".8"/>')
  rp=[(Xi(i),Y(real[i])) for i in range(N)]; d=smooth(rp)
  A(f'<path d="{d} L{rp[-1][0]:.1f},{Y1} L{X0},{Y1} Z" fill="url(#fa)"/>')
  A(f'<path d="{d}" fill="none" stroke="url(#sh)" stroke-width="5" opacity=".4" filter="url(#bl)"/>')
  A(f'<path class="bi-line" d="{d}" fill="none" stroke="url(#sh)" stroke-width="2.4" stroke-linecap="round"/>')
  # olay notları
  for i,t in [(9,'Bayram'),(18,'Kampanya')]:
    x,y=Xi(i),Y(real[i])
    A(f'<line x1="{x:.1f}" y1="{Y0-10}" x2="{x:.1f}" y2="{Y1}" stroke="{stroke}" stroke-dasharray="2 3"/><circle cx="{x:.1f}" cy="{y:.1f}" r="3.5" fill="{bg}" stroke="{coral if i==9 else mint}" stroke-width="2"/>')
    w=len(t)*6+14; A(f'<rect x="{x-w/2:.1f}" y="{Y0-24}" width="{w}" height="16" rx="8" fill="{card}" stroke="{stroke}"/><text x="{x:.1f}" y="{Y0-13}" fill="{soft}" font-size="9.5" text-anchor="middle">{t}</text>')
  # son nokta
  px,py=rp[-1]; A(f'<circle cx="{px:.1f}" cy="{py:.1f}" r="10" fill="{mint}" opacity=".18"/><circle cx="{px:.1f}" cy="{py:.1f}" r="4" fill="{bg}" stroke="{mint}" stroke-width="2.2"/>')
  # hacim çubukları
  for i in range(N):
    h=8+ (real[i]-9000)/5000*26
    A(f'<rect x="{Xi(i)-4:.1f}" y="{388-h:.1f}" width="8" height="{h:.1f}" rx="2" fill="{track if i<N-1 else mint}" {"" if i<N-1 else "opacity=\".8\""}/>')
  A(f'<text x="{X0}" y="400" fill="{dim}" font-size="9">H16</text><text x="{Xi(N-1):.1f}" y="400" fill="{dim}" font-size="9" text-anchor="middle">H41</text><text x="{X1}" y="400" fill="{dim}" font-size="9" text-anchor="end">H45</text>')
  A(f'<text x="{X0}" y="352" fill="{dim}" font-size="9" letter-spacing="1.2">SİPARİŞ HACMİ</text>')
  # SAĞ: parçalı halka
  A(f'<rect x="688" y="88" width="320" height="200" rx="20" fill="{card}" stroke="{stroke}"/>')
  A(f'<text x="712" y="116" fill="{dim}" font-size="11" letter-spacing="2.2">TESLİM PERFORMANSI</text>')
  cx,cy,r=772,196,52; segs=[(0.964,'url(#sh)'),(0.024,'#e6b85c'),(0.012,coral)]
  A(f'<circle cx="{cx}" cy="{cy}" r="{r}" fill="none" stroke="{track}" stroke-width="9"/>')
  st=-90
  for f,c in segs:
    a0=math.radians(st+1.5); a1=math.radians(st+f*360-1.5); large=1 if f>0.5 else 0
    A(f'<path d="M{cx+r*math.cos(a0):.1f},{cy+r*math.sin(a0):.1f} A{r},{r} 0 {large} 1 {cx+r*math.cos(a1):.1f},{cy+r*math.sin(a1):.1f}" fill="none" stroke="{c}" stroke-width="9" stroke-linecap="round"/>')
    st+=f*360
  A(f'<text x="{cx}" y="{cy+5}" text-anchor="middle" fill="{ink}" font-size="22" font-weight="500" letter-spacing="-1">%96,4</text><text x="{cx}" y="{cy+21}" text-anchor="middle" fill="{dim}" font-size="9">hedef %95</text>')
  for i,(c,l,v) in enumerate([('#A9B4FF','Zamanında','%96,4'),('#e6b85c','1 gün gecikme','%2,4'),(coral,'2+ gün','%1,2')]):
    y=158+i*30; A(f'<rect x="846" y="{y-8}" width="8" height="8" rx="2" fill="{c}"/><text x="862" y="{y}" fill="{soft}" font-size="11.5">{l}</text><text x="988" y="{y}" fill="{ink}" font-size="11.5" font-weight="600" text-anchor="end">{v}</text>')
  A(f'<text x="846" y="258" fill="{dim}" font-size="10">OTIF · 4.812 teslimat</text>')
  # SAĞ: bullet KPI
  for i,(l,v,val,tgt,good) in enumerate([('Stok devir','18 gün',.55,.62,True),('Revize oranı','%3,1',.31,.4,True)]):
    x=688+i*164; A(f'<rect x="{x}" y="302" width="156" height="104" rx="20" fill="{card}" stroke="{stroke}"/><text x="{x+20}" y="328" fill="{dim}" font-size="11">{l}</text><text x="{x+18}" y="362" fill="{ink}" font-size="26" font-weight="500" letter-spacing="-1">{v}</text>')
    A(f'<rect x="{x+20}" y="378" width="116" height="6" rx="3" fill="{track}"/><rect x="{x+20}" y="378" width="{116*val:.0f}" height="6" rx="3" fill="url(#sh)"/><rect x="{x+20+116*tgt:.0f}" y="374" width="2" height="14" rx="1" fill="{ink}" opacity=".7"/><text x="{x+20}" y="398" fill="{dim}" font-size="9">hedef ▏{"20 gün" if i==0 else "%4,0"}</text>')
  # ALT SOL: ısı haritası
  A(f'<rect x="32" y="420" width="560" height="198" rx="20" fill="{card}" stroke="{stroke}"/>')
  A(f'<text x="56" y="448" fill="{dim}" font-size="11" letter-spacing="2.2">BÖLGE × HAFTA · HEDEFE ULAŞMA</text>')
  regs=['Marmara','İç Anadolu','Ege','Akdeniz','Karadeniz']
  for ri,rn in enumerate(regs):
    y=466+ri*27; A(f'<text x="56" y="{y+14}" fill="{soft}" font-size="11">{rn}</text>')
    for w in range(12):
      v=0.55+0.4*math.sin(w*0.7+ri*1.3)*0.5+random.uniform(-.15,.25)
      v=max(.12,min(1,v)); low = v<.42
      A(f'<rect x="{140+w*35}" y="{y}" width="31" height="21" rx="5" fill="{coral if low else "#8E9BFF"}" fill-opacity="{(.55 if low else v*.85):.2f}"/>')
  for w in [0,5,11]: A(f'<text x="{155+w*35}" y="612" fill="{dim}" font-size="9" text-anchor="middle">H{30+w}</text>')
  # ALT SAĞ: ürün listesi
  A(f'<rect x="606" y="420" width="402" height="198" rx="20" fill="{card}" stroke="{stroke}"/>')
  A(f'<text x="630" y="448" fill="{dim}" font-size="11" letter-spacing="2.2">EN ÇOK SAPAN ÜRÜNLER</text><text x="984" y="448" fill="{dim}" font-size="10" text-anchor="end">12 hafta</text>')
  items=[('Ürün A-1042','Marmara',-14.0),('Ürün B-2210','Ege',-10.5),('Ürün C-0874','Akdeniz',10.6),('Ürün D-3315','İç Anadolu',-7.8)]
  for i,(n,rg,dv) in enumerate(items):
    y=478+i*35; c=mint if dv>0 else coral
    A(f'<text x="630" y="{y}" fill="{ink}" font-size="12" font-weight="500">{n}</text><text x="630" y="{y+14}" fill="{dim}" font-size="10">{rg}</text>')
    pts=[(780+k*12, y+2-(math.sin(k*.9+i)*5)-(k*(0.9 if dv>0 else -0.9))) for k in range(10)]
    A(f'<path d="{smooth(pts)}" fill="none" stroke="{c}" stroke-width="1.6" stroke-linecap="round"/><circle cx="{pts[-1][0]}" cy="{pts[-1][1]:.1f}" r="2.4" fill="{c}"/>')
    t=f'{"+" if dv>0 else "−"}%{abs(dv):.1f}'.replace('.',',')
    A(f'<rect x="922" y="{y-12}" width="62" height="20" rx="10" fill="{c}" fill-opacity=".13"/><text x="953" y="{y+2}" fill="{c}" font-size="11" font-weight="600" text-anchor="middle">{t}</text>')
    if i<3: A(f'<line x1="630" y1="{y+22}" x2="984" y2="{y+22}" stroke="{stroke}"/>')
  A(f'<text x="1008" y="638" fill="{dim}" font-size="9.5" text-anchor="end" letter-spacing="1.5">ÖRNEK VERİ</text></svg>')
  return '\n'.join(o)
for t in ['gece','porselen']: open(f'img/dashboard-{t}.svg','w').write(dash(t))
open('dash3.html','w').write('<!doctype html><html><head><meta charset="utf-8"><link href="https://fonts.googleapis.com/css2?family=Inter+Tight:wght@400;500;600&display=swap" rel="stylesheet"><style>body{margin:0;background:#000;padding:40px;display:flex;flex-direction:column;gap:30px;font-family:Inter Tight}svg{width:1040px;border-radius:16px;display:block}p{color:#8e8e93;margin:0 0 -18px;font-size:15px;letter-spacing:.1em}</style></head><body><p>GECE</p>'+dash('gece')+'<p>PORSELEN</p>'+dash('porselen')+'</body></html>')
