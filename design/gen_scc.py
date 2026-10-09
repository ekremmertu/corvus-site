import math
W,H=1600,1000; cx,cy=620,500; R=330
cols=["#7c6cff","#4fd1c5","#f6ad55","#f56565","#63b3ed","#b794f4","#68d391","#f687b3"]
icons=["M4 18h16M6 18V9m4 9V6m4 12v-7m4 7V4","M3 7l9-4 9 4-9 4-9-4zm0 5l9 4 9-4M3 17l9 4 9-4","M12 3v18M3 12h18M6 6l12 12M18 6L6 18","M12 2l3 7h7l-5.5 4 2 7L12 16l-6.5 4 2-7L2 9h7z","M3 12h4l3-8 4 16 3-8h4","M4 6h16v12H4zM4 10h16M9 6v12","M12 21s-7-5-7-11a7 7 0 0114 0c0 6-7 11-7 11zm0-8a3 3 0 100-6 3 3 0 000 6z","M5 12l4 4L19 6"]
nodes=[(cx+R*math.cos(-math.pi/2+math.pi/8+i*math.pi/4), cy+R*math.sin(-math.pi/2+math.pi/8+i*math.pi/4)) for i in range(8)]
S=[f'<svg xmlns="http://www.w3.org/2000/svg" width="{W}" height="{H}" viewBox="0 0 {W} {H}">',
'<defs><radialGradient id="bg" cx="40%" cy="50%" r="75%"><stop offset="0" stop-color="#1a1740"/><stop offset=".55" stop-color="#0b0b1a"/><stop offset="1" stop-color="#050508"/></radialGradient>',
'<radialGradient id="core" cx="50%" cy="50%" r="50%"><stop offset="0" stop-color="#fff"/><stop offset=".35" stop-color="#cfc8ff"/><stop offset="1" stop-color="#7c6cff" stop-opacity="0"/></radialGradient>',
'<filter id="glow" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="14"/></filter><filter id="soft"><feGaussianBlur stdDeviation="2"/></filter>',
'<pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse"><path d="M40 0H0V40" fill="none" stroke="#fff" stroke-opacity=".035"/></pattern>']
for i,c in enumerate(cols):
    x,y=nodes[i]; S.append(f'<linearGradient id="l{i}" gradientUnits="userSpaceOnUse" x1="{cx}" y1="{cy}" x2="{x:.0f}" y2="{y:.0f}"><stop offset="0" stop-color="#cfc8ff"/><stop offset="1" stop-color="{c}"/></linearGradient>')
S.append('</defs>')
S.append(f'<rect width="{W}" height="{H}" fill="url(#bg)"/><rect width="{W}" height="{H}" fill="url(#grid)"/>')
for r,o in [(R,.14),(R+90,.06),(170,.08)]: S.append(f'<circle cx="{cx}" cy="{cy}" r="{r}" fill="none" stroke="#fff" stroke-opacity="{o}" stroke-dasharray="2 8"/>')
for i in range(8):
    for j in (i+1,i+3):
        j%=8; (x1,y1),(x2,y2)=nodes[i],nodes[j]; mx,my=(x1+x2)/2,(y1+y2)/2; qx,qy=mx+(cx-mx)*.35,my+(cy-my)*.35
        S.append(f'<path d="M{x1:.0f} {y1:.0f} Q{qx:.0f} {qy:.0f} {x2:.0f} {y2:.0f}" fill="none" stroke="#fff" stroke-opacity=".08" stroke-width="1.2"/>')
for i,(x,y) in enumerate(nodes):
    S.append(f'<line x1="{cx}" y1="{cy}" x2="{x:.0f}" y2="{y:.0f}" stroke="url(#l{i})" stroke-width="2.4" stroke-opacity=".8"/>')
    t=.36+.1*(i%3); px,py=cx+(x-cx)*t,cy+(y-cy)*t
    S.append(f'<circle cx="{px:.0f}" cy="{py:.0f}" r="10" fill="{cols[i]}" opacity=".4" filter="url(#soft)"/><circle cx="{px:.0f}" cy="{py:.0f}" r="4" fill="#fff"/>')
for i,(x,y) in enumerate(nodes):
    c=cols[i]
    S.append(f'<circle cx="{x:.0f}" cy="{y:.0f}" r="62" fill="{c}" opacity=".3" filter="url(#glow)"/><circle cx="{x:.0f}" cy="{y:.0f}" r="50" fill="#12121f" stroke="{c}" stroke-width="2.4"/><circle cx="{x:.0f}" cy="{y:.0f}" r="41" fill="{c}" fill-opacity=".13"/>')
    S.append(f'<g transform="translate({x-26:.0f} {y-26:.0f}) scale(2.17)"><path d="{icons[i]}" fill="none" stroke="{c}" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></g>')
S.append(f'<circle cx="{cx}" cy="{cy}" r="160" fill="url(#core)" opacity=".55"/><circle cx="{cx}" cy="{cy}" r="84" fill="#151330" stroke="#cfc8ff" stroke-width="2.5"/><circle cx="{cx}" cy="{cy}" r="70" fill="none" stroke="#fff" stroke-opacity=".25"/>')
S.append(f'<g transform="translate({cx-33} {cy-33}) scale(2.75)"><path d="M3 17l2-10 4.5 5L12 5l2.5 7L19 7l2 10z M3 20h18" fill="none" stroke="#fff" stroke-width="1.3" stroke-linejoin="round" stroke-linecap="round"/></g>')
x0,y0,w,h=1110,290,380,420
S.append(f'<path d="M{cx+88} {cy} C{cx+200} {cy} 1000 {cy} {x0-14} {cy}" fill="none" stroke="#cfc8ff" stroke-width="2.4" stroke-dasharray="7 8" stroke-opacity=".8"/><path d="M{x0-24} {cy-9} L{x0-11} {cy} L{x0-24} {cy+9}" fill="none" stroke="#cfc8ff" stroke-width="2.4"/>')
S.append(f'<rect x="{x0+10}" y="{y0+18}" width="{w}" height="{h}" rx="24" fill="#7c6cff" opacity=".35" filter="url(#glow)"/><rect x="{x0}" y="{y0}" width="{w}" height="{h}" rx="24" fill="#f4f2ff"/>')
S.append(f'<rect x="{x0+32}" y="{y0+36}" width="96" height="12" rx="6" fill="#7c6cff"/><rect x="{x0+32}" y="{y0+68}" width="270" height="20" rx="10" fill="#1b1838"/><rect x="{x0+32}" y="{y0+98}" width="190" height="20" rx="10" fill="#1b1838"/>')
for k in range(4):
    yy=y0+152+k*44; c=cols[[0,1,6,2][k]]
    S.append(f'<circle cx="{x0+42}" cy="{yy+6}" r="10" fill="{c}"/><rect x="{x0+64}" y="{yy}" width="{[250,210,270,180][k]}" height="12" rx="6" fill="#c9c5e6"/>')
S.append(f'<rect x="{x0+32}" y="{y0+h-96}" width="{w-64}" height="64" rx="16" fill="#1b1838"/><g transform="translate({x0+52} {y0+h-80}) scale(1.35)"><path d="M5 12l4 4L19 6" fill="none" stroke="#68d391" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"/></g><rect x="{x0+100}" y="{y0+h-70}" width="170" height="12" rx="6" fill="#fff" opacity=".85"/>')
S.append('</svg>'); open("scc.svg","w").write("\n".join(S))
