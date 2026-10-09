import sys
lang=sys.argv[1]; tr=lang=="tr"
L=dict(idea=("Fikir","Ideas"),copy=("Metin","Copy"),design=("Tasarım","Design"),render=("Hazır görsel","Finished visual"),score=("Kalite","Quality"),week=("Bu hafta","This week"),
 days=(["Pzt","Sal","Çar","Per","Cum","Cmt","Paz"],["Mon","Tue","Wed","Thu","Fri","Sat","Sun"]),steps=(["Fikir","Metin","Render","Kalite","Takvim"],["Idea","Copy","Render","Score","Schedule"]))
t=lambda k: L[k][0 if tr else 1]
W,H=1600,1000
C=dict(coral="#ff7a59",amber="#ffc65c",mint="#5ee6b0",pink="#ff6fb1",cyan="#4cc9f0",violet="#a78bfa",ink="#0d0b12")
F='font-family="Inter, -apple-system, Helvetica, Arial, sans-serif"'
S=[f'<svg xmlns="http://www.w3.org/2000/svg" width="{W}" height="{H}" viewBox="0 0 {W} {H}" {F}>',
'<defs>',
'<radialGradient id="bg" cx="30%" cy="35%" r="85%"><stop offset="0" stop-color="#2a1626"/><stop offset=".5" stop-color="#120d17"/><stop offset="1" stop-color="#07060a"/></radialGradient>',
'<linearGradient id="post" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#ff7a59"/><stop offset=".55" stop-color="#ff6fb1"/><stop offset="1" stop-color="#a78bfa"/></linearGradient>',
'<linearGradient id="flow" x1="0" x2="1"><stop offset="0" stop-color="#ffc65c"/><stop offset="1" stop-color="#ff7a59"/></linearGradient>',
'<filter id="glow" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="16"/></filter>',
'<filter id="sh" x="-30%" y="-30%" width="160%" height="160%"><feDropShadow dx="0" dy="24" stdDeviation="24" flood-color="#000" flood-opacity=".55"/></filter>',
'<pattern id="dots" width="28" height="28" patternUnits="userSpaceOnUse"><circle cx="2" cy="2" r="1.2" fill="#fff" fill-opacity=".05"/></pattern>',
'</defs>',
f'<rect width="{W}" height="{H}" fill="url(#bg)"/><rect width="{W}" height="{H}" fill="url(#dots)"/>']
# agents left
agents=[("idea",C["amber"],"M12 3a6 6 0 00-4 10.5V16h8v-2.5A6 6 0 0012 3zM9 19h6M10 22h4"),
        ("copy",C["mint"],"M4 6h16M4 10h16M4 14h10M4 18h7"),
        ("design",C["pink"],"M4 4h16v16H4zM4 15l5-5 4 4 3-3 4 4")]
ys=[300,500,700]
for (k,c,ic),y in zip(agents,ys):
    x=110
    S.append(f'<rect x="{x}" y="{y-52}" width="290" height="104" rx="28" fill="{c}" opacity=".16" filter="url(#glow)"/>')
    S.append(f'<rect x="{x}" y="{y-48}" width="290" height="96" rx="26" fill="#17121d" stroke="{c}" stroke-opacity=".55" stroke-width="1.5"/>')
    S.append(f'<circle cx="{x+50}" cy="{y}" r="28" fill="{c}" fill-opacity=".15"/><g transform="translate({x+32} {y-18}) scale(1.5)"><path d="{ic}" fill="none" stroke="{c}" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"/></g>')
    S.append(f'<text x="{x+96}" y="{y-4}" font-size="26" font-weight="700" fill="#fff">{t(k)}</text>')
    S.append(f'<text x="{x+96}" y="{y+24}" font-size="15" fill="#fff" fill-opacity=".5">{"AI ajan" if tr else "AI agent"}</text>')
    S.append(f'<circle cx="{x+262}" cy="{y}" r="6" fill="{c}"/>')
    # flow to post
    S.append(f'<path d="M{x+290} {y} C{x+380} {y} 470 500 560 500" fill="none" stroke="{c}" stroke-width="2.4" stroke-opacity=".7"/>')
    S.append(f'<circle cx="{x+330+20*(ys.index(y))}" cy="{y+(500-y)*.22:.0f}" r="5" fill="#fff"/>')
# post card center
px,py,pw,ph=580,215,400,500
S.append(f'<g transform="rotate(-4 {px+pw/2} {py+ph/2})">')
S.append(f'<rect x="{px-20}" y="{py+30}" width="{pw+40}" height="{ph}" rx="34" fill="#ff6fb1" opacity=".22" filter="url(#glow)"/>')
S.append(f'<rect x="{px}" y="{py}" width="{pw}" height="{ph+70}" rx="30" fill="#fbf8f4" filter="url(#sh)"/>')
S.append(f'<circle cx="{px+38}" cy="{py+36}" r="14" fill="url(#post)"/><rect x="{px+62}" y="{py+28}" width="110" height="10" rx="5" fill="#1b1622"/><rect x="{px+62}" y="{py+44}" width="70" height="8" rx="4" fill="#bdb6c6"/>')
S.append(f'<rect x="{px+20}" y="{py+72}" width="{pw-40}" height="{ph-150}" rx="20" fill="url(#post)"/>')
S.append(f'<circle cx="{px+pw-90}" cy="{py+150}" r="56" fill="#fff" fill-opacity=".18"/><circle cx="{px+90}" cy="{py+ph-150}" r="90" fill="#fff" fill-opacity=".10"/>')
S.append(f'<rect x="{px+50}" y="{py+130}" width="230" height="26" rx="13" fill="#fff"/><rect x="{px+50}" y="{py+168}" width="180" height="26" rx="13" fill="#fff"/><rect x="{px+50}" y="{py+216}" width="120" height="14" rx="7" fill="#fff" fill-opacity=".75"/>')
S.append(f'<rect x="{px+50}" y="{py+ph-130}" width="140" height="40" rx="20" fill="#1b1622"/><rect x="{px+72}" y="{py+ph-115}" width="96" height="10" rx="5" fill="#fff"/>')
for i,c in enumerate(["#ff6fb1","#1b1622","#1b1622"]):
    S.append(f'<circle cx="{px+40+i*38}" cy="{py+ph+20}" r="11" fill="none" stroke="{c}" stroke-width="2.6"/>')
S.append(f'<rect x="{px+20}" y="{py+ph+44}" width="240" height="9" rx="4.5" fill="#cfc8d8"/>')
S.append('</g>')
# score ring
sx,sy,r=1095,165,58
S.append(f'<circle cx="{sx}" cy="{sy}" r="{r+20}" fill="{C["mint"]}" opacity=".18" filter="url(#glow)"/><circle cx="{sx}" cy="{sy}" r="{r}" fill="#141019" stroke="#2a2433" stroke-width="10"/>')
import math
a=2*math.pi*.94; ex=sx+r*math.sin(a); ey=sy-r*math.cos(a)
S.append(f'<path d="M{sx} {sy-r} A{r} {r} 0 1 1 {ex:.1f} {ey:.1f}" fill="none" stroke="{C["mint"]}" stroke-width="10" stroke-linecap="round"/>')
S.append(f'<text x="{sx}" y="{sy+12}" text-anchor="middle" font-size="40" font-weight="800" fill="#fff">94</text><text x="{sx}" y="{sy+r+38}" text-anchor="middle" font-size="15" letter-spacing="2.5" font-weight="600" fill="#fff" fill-opacity=".55">{t("score").upper()}</text>')
# arrow post -> calendar
S.append(f'<path d="M990 520 C1040 520 1070 520 1110 520" fill="none" stroke="url(#flow)" stroke-width="2.6" stroke-dasharray="7 8"/><path d="M1102 511 L1114 520 L1102 529" fill="none" stroke="#ff7a59" stroke-width="2.6"/>')
# calendar
cx0,cy0,cw,chh=1130,300,400,440
S.append(f'<rect x="{cx0}" y="{cy0}" width="{cw}" height="{chh}" rx="28" fill="#17121d" stroke="#ffffff" stroke-opacity=".1" filter="url(#sh)"/>')
S.append(f'<text x="{cx0+30}" y="{cy0+50}" font-size="22" font-weight="700" fill="#fff">{t("week")}</text><circle cx="{cx0+cw-40}" cy="{cy0+43}" r="7" fill="{C["mint"]}"/><circle cx="{cx0+cw-40}" cy="{cy0+43}" r="14" fill="{C["mint"]}" opacity=".25"/>')
days=L["days"][0 if tr else 1]; colw=(cw-40)/7
for i,dn in enumerate(days):
    S.append(f'<text x="{cx0+20+colw*i+colw/2:.0f}" y="{cy0+95}" text-anchor="middle" font-size="13" font-weight="600" fill="#fff" fill-opacity=".45">{dn}</text>')
plan={0:[(0,C["pink"])],1:[(1,C["cyan"]),(3,C["amber"])],2:[(0,C["pink"])],3:[(2,C["violet"])],4:[(0,C["pink"]),(2,C["cyan"])],5:[(1,C["amber"])],6:[(3,C["pink"])]}
for d_,items in plan.items():
    for row,c in items:
        x=cx0+20+colw*d_+5; y=cy0+118+row*74
        hl=(d_==4 and row==0)
        S.append(f'<rect x="{x:.0f}" y="{y}" width="{colw-10:.0f}" height="62" rx="12" fill="{c}" fill-opacity="{.9 if hl else .22}" stroke="{c}" stroke-opacity=".7"/>')
        S.append(f'<rect x="{x+8:.0f}" y="{y+12}" width="{colw-26:.0f}" height="7" rx="3.5" fill="#fff" fill-opacity="{.95 if hl else .5}"/><rect x="{x+8:.0f}" y="{y+26}" width="{(colw-26)*.6:.0f}" height="7" rx="3.5" fill="#fff" fill-opacity="{.8 if hl else .35}"/>')
    pass
S.append(f'<g transform="translate({cx0+20+colw*4+colw/2-32:.0f} {cy0+118+70})"><rect width="64" height="30" rx="15" fill="#fff"/><text x="32" y="20" text-anchor="middle" font-size="14" font-weight="700" fill="#1b1622">09:00</text></g>')
# step rail bottom
st=L["steps"][0 if tr else 1]; x0=300; gap=250
S.append(f'<line x1="{x0}" y1="880" x2="{x0+gap*4}" y2="880" stroke="#fff" stroke-opacity=".12" stroke-width="2"/>')
cols=[C["amber"],C["mint"],C["pink"],C["mint"],C["coral"]]
for i,s in enumerate(st):
    x=x0+gap*i
    S.append(f'<circle cx="{x}" cy="880" r="17" fill="#17121d" stroke="{cols[i]}" stroke-width="2"/><text x="{x}" y="886" text-anchor="middle" font-size="15" font-weight="700" fill="{cols[i]}">{i+1}</text>')
    S.append(f'<text x="{x}" y="930" text-anchor="middle" font-size="18" font-weight="600" fill="#fff" fill-opacity=".75">{s}</text>')
S.append('</svg>')
open(f"growth-{lang}.svg","w").write("\n".join(S))
