// ===== رسومات الشخصيات والأماكن (SVG مرسوم بالكود) =====
(function(){
const SK = { light:'#f3c9a0', mid:'#e0aa7c', tan:'#c98f63', dark:'#a8714b' };

function face(mood, o){
  const ink='#2a160c';
  const eyes = mood==='wow'
    ? `<circle cx="49" cy="62" r="5" fill="${ink}"/><circle cx="71" cy="62" r="5" fill="${ink}"/>`
    : `<ellipse cx="49" cy="62" rx="4.2" ry="5.2" fill="${ink}"/><ellipse cx="71" cy="62" rx="4.2" ry="5.2" fill="${ink}"/>`;
  const shine = `<circle cx="50.5" cy="60" r="1.5" fill="#fff"/><circle cx="72.5" cy="60" r="1.5" fill="#fff"/>`;
  const browC = o.brow || o.hair || ink;
  const brows = mood==='sad'
    ? `<path d="M42 53 L54 50" stroke="${browC}" stroke-width="3" stroke-linecap="round"/><path d="M78 53 L66 50" stroke="${browC}" stroke-width="3" stroke-linecap="round"/>`
    : `<path d="M43 52 Q48 48 54 51" stroke="${browC}" stroke-width="3" fill="none" stroke-linecap="round"/><path d="M66 51 Q72 48 77 52" stroke="${browC}" stroke-width="3" fill="none" stroke-linecap="round"/>`;
  let mouth;
  if(mood==='sad') mouth=`<path d="M51 82 Q60 75 69 82" stroke="${ink}" stroke-width="3" fill="none" stroke-linecap="round"/>`;
  else if(mood==='wow') mouth=`<ellipse cx="60" cy="80" rx="6" ry="7" fill="#7a2416"/>`;
  else mouth=`<path d="M49 75 Q60 89 71 75 Z" fill="#7a2416"/><path d="M52 77 Q60 81 68 77" stroke="#fff" stroke-width="2.5" fill="none"/>`;
  const tear = mood==='sad' && o.tear ? `<path d="M74 68 q3 6 0 9 q-3 -3 0 -9z" fill="#7fc7ff"/>` : '';
  const cheeks = `<circle cx="40" cy="73" r="5" fill="#f2907e" opacity=".45"/><circle cx="80" cy="73" r="5" fill="#f2907e" opacity=".45"/>`;
  return brows+eyes+shine+cheeks+mouth+tear;
}

function hairBack(o){
  const h=o.hair;
  if(o.style==='long') return `<path d="M26 60 Q24 20 60 18 Q96 20 94 60 L98 112 Q86 118 82 100 L38 100 Q34 118 22 112Z" fill="${h}"/>`;
  if(o.style==='pigtails') return `<circle cx="24" cy="66" r="13" fill="${h}"/><circle cx="96" cy="66" r="13" fill="${h}"/>`;
  return '';
}
function hairFront(o){
  const h=o.hair;
  switch(o.style){
    case 'short': return `<path d="M31 56 Q30 24 60 22 Q90 24 89 56 Q82 38 66 38 Q58 32 50 38 Q38 38 31 56Z" fill="${h}"/>`;
    case 'spiky': return `<path d="M31 54 L30 34 L40 38 L42 24 L52 32 L58 18 L64 31 L74 22 L78 36 L90 32 L89 54 Q80 40 60 40 Q40 40 31 54Z" fill="${h}"/>`;
    case 'curly': return `<g fill="${h}"><circle cx="38" cy="38" r="10"/><circle cx="50" cy="29" r="11"/><circle cx="63" cy="27" r="11"/><circle cx="76" cy="32" r="10"/><circle cx="85" cy="44" r="8"/><circle cx="33" cy="48" r="7"/></g>`;
    case 'long': return `<path d="M30 58 Q32 24 60 24 Q90 24 90 58 Q78 36 62 42 Q50 32 30 58Z" fill="${h}"/>`;
    case 'pigtails': return `<path d="M30 56 Q31 24 60 23 Q89 24 90 56 Q80 38 60 40 Q40 38 30 56Z" fill="${h}"/><circle cx="24" cy="66" r="4" fill="#e2453c"/><circle cx="96" cy="66" r="4" fill="#e2453c"/>`;
    case 'bun': return `<circle cx="60" cy="20" r="12" fill="${h}"/><path d="M30 56 Q30 26 60 26 Q90 26 90 56 Q80 40 60 40 Q40 40 30 56Z" fill="${h}"/>`;
    case 'bald': return `<path d="M30 58 Q30 44 36 40 L36 58Z M90 58 Q90 44 84 40 L84 58Z" fill="${h}"/>`;
    default: return '';
  }
}
function extras(o, where){
  let s='';
  if(where==='head'){
    if(o.glasses) s+=`<g fill="none" stroke="#5a3a24" stroke-width="2.5"><circle cx="49" cy="62" r="8"/><circle cx="71" cy="62" r="8"/><path d="M57 62 h6"/></g>`;
    if(o.mustache) s+=`<path d="M46 72 Q53 66 60 71 Q67 66 74 72 Q67 76 60 73 Q53 76 46 72Z" fill="${o.hair}"/>`;
    if(o.strawHat) s+=`<ellipse cx="60" cy="34" rx="44" ry="9" fill="#e8c26a"/><path d="M36 34 Q38 10 60 10 Q82 10 84 34Z" fill="#f1d27f"/><rect x="37" y="26" width="46" height="6" fill="#c0392b"/>`;
    if(o.cap) s+=`<path d="M30 46 Q30 20 60 20 Q90 20 90 46Z" fill="${o.cap}"/><path d="M60 44 L100 46 Q96 52 60 50Z" fill="${o.cap}" opacity=".85"/>`;
  } else {
    if(o.whistle) s+=`<path d="M48 98 Q60 120 72 98" stroke="#222" stroke-width="2" fill="none"/><rect x="56" y="116" width="10" height="6" rx="2" fill="#bbb"/>`;
    if(o.star) s+=`<path d="M60 112 l4 8 9 1 -6.5 6 1.7 9 -8.2-4.4 -8.2 4.4 1.7-9 -6.5-6 9-1z" fill="#f3b52f"/>`;
    if(o.apron) s+=`<path d="M44 110 L76 110 L80 160 L40 160Z" fill="#7a9e4e"/>`;
    if(o.bag) s+=`<rect x="80" y="104" width="34" height="30" rx="4" fill="#e2453c"/><text x="97" y="124" font-size="12" text-anchor="middle" fill="#fff" font-family="sans-serif">🍕</text>`;
    if(o.number) s+=`<text x="60" y="140" font-size="22" text-anchor="middle" fill="#fff" font-family="Lalezar, sans-serif">${o.number}</text>`;
  }
  return s;
}

function person(o, mood){
  mood = mood || 'happy';
  const skin=o.skin||SK.mid, shirt=o.shirt||'#1d8c8c', pants=o.pants||'#3b4a6b';
  const headInner = o.photo
    ? `<clipPath id="ph${o.id}"><circle cx="60" cy="58" r="34"/></clipPath><image href="${o.photo}" x="26" y="24" width="68" height="68" clip-path="url(#ph${o.id})" preserveAspectRatio="xMidYMid slice"/><circle cx="60" cy="58" r="34" fill="none" stroke="#fff" stroke-width="4"/>`
    : `<circle cx="27" cy="62" r="7" fill="${skin}"/><circle cx="93" cy="62" r="7" fill="${skin}"/><circle cx="60" cy="58" r="32" fill="${skin}"/>${hairFront(o)}${face(mood,o)}${extras(o,'head')}`;
  const arms = mood==='wow' || o.armsUp
    ? `<path d="M36 104 L18 70" stroke="${shirt}" stroke-width="13" stroke-linecap="round"/><circle cx="17" cy="66" r="7" fill="${skin}"/><path d="M84 104 L102 70" stroke="${shirt}" stroke-width="13" stroke-linecap="round"/><circle cx="103" cy="66" r="7" fill="${skin}"/>`
    : `<path d="M36 104 L28 146" stroke="${shirt}" stroke-width="13" stroke-linecap="round"/><circle cx="28" cy="150" r="7" fill="${skin}"/><path d="M84 104 L92 146" stroke="${shirt}" stroke-width="13" stroke-linecap="round"/><circle cx="92" cy="150" r="7" fill="${skin}"/>`;
  const legs = o.dress
    ? `<path d="M36 150 L84 150 L94 196 L26 196Z" fill="${shirt}"/><rect x="44" y="196" width="10" height="14" fill="${skin}"/><rect x="66" y="196" width="10" height="14" fill="${skin}"/>`
    : `<rect x="42" y="152" width="15" height="52" rx="6" fill="${pants}"/><rect x="63" y="152" width="15" height="52" rx="6" fill="${pants}"/>`;
  const cane = o.cane ? `<path d="M100 150 L104 214" stroke="#6b3e1d" stroke-width="5" stroke-linecap="round"/><path d="M100 150 Q100 140 92 142" stroke="#6b3e1d" stroke-width="5" fill="none" stroke-linecap="round"/>` : '';
  return `<svg viewBox="0 0 120 222" class="char-svg" aria-hidden="true">
    ${hairBack(o)}
    ${legs}
    <ellipse cx="49" cy="208" rx="11" ry="6" fill="#2b2b2b"/><ellipse cx="71" cy="208" rx="11" ry="6" fill="#2b2b2b"/>
    <path d="M34 106 Q34 94 60 92 Q86 94 86 106 L88 156 L32 156Z" fill="${shirt}"/>
    ${extras(o,'body')}
    ${arms}${cane}
    <rect x="52" y="84" width="16" height="12" rx="4" fill="${skin}"/>
    ${headInner}
  </svg>`;
}

function cat(mood){
  const eye = mood==='sad'
    ? `<path d="M44 50 q5 -4 10 0" stroke="#2a160c" stroke-width="3" fill="none"/><path d="M66 50 q5 -4 10 0" stroke="#2a160c" stroke-width="3" fill="none"/><path d="M76 56 q2 5 0 8 q-2 -3 0 -8z" fill="#7fc7ff"/>`
    : `<ellipse cx="49" cy="50" rx="4" ry="6" fill="#2a160c"/><ellipse cx="71" cy="50" rx="4" ry="6" fill="#2a160c"/>`;
  return `<svg viewBox="0 0 120 120" class="char-svg" aria-hidden="true">
    <path d="M96 96 Q118 80 108 60" stroke="#e8923a" stroke-width="9" fill="none" stroke-linecap="round"/>
    <ellipse cx="62" cy="92" rx="36" ry="22" fill="#f0a04b"/>
    <path d="M30 34 L36 8 L52 26Z M90 34 L84 8 L68 26Z" fill="#f0a04b"/>
    <circle cx="60" cy="50" r="30" fill="#f0a04b"/>
    <path d="M44 28 l4 10 M60 22 v10 M76 28 l-4 10" stroke="#c8742a" stroke-width="3"/>
    ${eye}<path d="M56 60 L64 60 L60 65Z" fill="#e26b7a"/>
    <path d="M60 65 q-5 6 -10 2 M60 65 q5 6 10 2" stroke="#2a160c" stroke-width="2" fill="none"/>
    <path d="M30 58 h-16 M30 63 h-14 M90 58 h16 M90 63 h14" stroke="#7a4a1f" stroke-width="1.5"/>
  </svg>`;
}

const CAST = {
  SB: {id:'SB', name:'عم صابر', skin:SK.tan, hair:'#9a9a9a', style:'bald', mustache:true, strawHat:true, shirt:'#5f8f3e', pants:'#6b5236', apron:true},
  M:  {id:'M', name:'ماما', skin:SK.light, hair:'#4a2a17', style:'long', shirt:'#d1557a', dress:true},
  K:  {id:'K', name:'كريم', skin:SK.mid, hair:'#2a1a10', style:'short', cap:'#e2453c', shirt:'#e2453c', pants:'#2d3446', bag:true},
  H:  {id:'H', name:'كابتن هشام', skin:SK.tan, hair:'#2a1a10', style:'short', shirt:'#2c62c9', pants:'#2c62c9', whistle:true, cap:'#1d3f8a'},
  ND: {id:'ND', name:'طنط نادية', skin:SK.light, hair:'#d9d9d9', style:'bun', glasses:true, shirt:'#8a5aa8', dress:true, cane:true},
  A:  {id:'A', name:'آدم', skin:SK.mid, hair:'#3b2314', style:'spiky', shirt:'#f08a24', pants:'#2d3446', number:'10', kid:true},
  O:  {id:'O', name:'عمر', skin:SK.light, hair:'#5a3a20', style:'curly', shirt:'#4aa3a0', pants:'#3b4a6b', glasses:true, kid:true, tear:true},
};
function heroDef(cfg){
  const g = cfg.gender==='g';
  return {id:'hero', name:cfg.name, skin:SK.mid, hair:'#3b2314', style:g?'pigtails':'short', shirt:g?'#e2453c':'#1d8c8c', pants:'#2d3446', star:true, kid:true, photo:cfg.photo||null, dress:g};
}

// ===== الأماكن =====
const sky = (a,b)=>`<defs><linearGradient id="sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${a}"/><stop offset="1" stop-color="${b}"/></linearGradient></defs><rect width="400" height="260" fill="url(#sky)"/>`;
const tree=(x,y,s=1)=>`<g transform="translate(${x} ${y}) scale(${s})"><rect x="-5" y="0" width="10" height="40" fill="#7a4a1f"/><circle cx="0" cy="-8" r="26" fill="#4f9a3f"/><circle cx="-16" cy="4" r="16" fill="#5aab47"/><circle cx="16" cy="2" r="17" fill="#468a37"/></g>`;
const palm=(x,y)=>`<g transform="translate(${x} ${y})"><path d="M0 70 Q-4 30 4 0" stroke="#8a5a2b" stroke-width="7" fill="none"/><path d="M4 0 Q-24 -8 -38 10 Q-16 0 4 4Z M4 0 Q34 -10 44 10 Q24 -2 4 4Z M4 0 Q-10 -26 -30 -22 Q-10 -16 4 2Z M4 0 Q20 -28 40 -20 Q20 -14 4 2Z" fill="#3f9440"/></g>`;
const villa=(x,y)=>`<g transform="translate(${x} ${y})"><rect x="0" y="20" width="150" height="90" fill="#f4ead8"/><rect x="0" y="12" width="150" height="10" fill="#d9c7a6"/><rect x="18" y="40" width="34" height="30" fill="#8fc4e0" stroke="#fff" stroke-width="3"/><rect x="98" y="40" width="34" height="30" fill="#8fc4e0" stroke="#fff" stroke-width="3"/><rect x="60" y="62" width="30" height="48" fill="#8a5a2b"/><circle cx="84" cy="88" r="2" fill="#f3b52f"/></g>`;
const BG = {
  garden: ()=>`${sky('#bfe6ff','#fff3d6')}<circle cx="340" cy="46" r="26" fill="#ffd56b"/>${villa(30,60)}${palm(330,120)}${tree(230,150,.9)}<rect y="190" width="400" height="70" fill="#7cc35b"/><rect y="186" width="400" height="8" fill="#a4d77c"/><path d="M0 230 Q200 210 400 236 L400 260 L0 260Z" fill="#e8d3a6"/><g>${[40,90,140,260,310,360].map(x=>`<circle cx="${x}" cy="200" r="5" fill="#f2668b"/><circle cx="${x+10}" cy="204" r="4" fill="#f3b52f"/>`).join('')}</g>`,
  park: ()=>`${sky('#bfe6ff','#fff3d6')}<circle cx="60" cy="44" r="24" fill="#ffd56b"/>${tree(70,150)}${tree(330,150,1.1)}${palm(190,110)}<rect y="185" width="400" height="75" fill="#7cc35b"/><path d="M0 240 Q200 220 400 244 L400 260 L0 260Z" fill="#e8d3a6"/><rect x="250" y="120" width="5" height="70" fill="#555"/><circle cx="252" cy="118" r="8" fill="#ffe9a0"/><g class="party-deco" opacity="0">${[40,100,160,220,280,340].map((x,i)=>`<path d="M${x} 20 v30" stroke="#999"/><ellipse cx="${x}" cy="${14}" rx="11" ry="14" fill="${['#e2453c','#f3b52f','#3d7fe0','#3f9440','#d1557a','#8a5aa8'][i]}"/>`).join('')}<path d="M0 60 Q100 90 200 60 T400 60" stroke="#e2453c" stroke-width="3" fill="none"/></g>`,
  bedroom: ()=>`<rect width="400" height="260" fill="#cfe3f5"/><rect y="200" width="400" height="60" fill="#d9b48a"/><rect x="40" y="40" width="80" height="70" fill="#9fd3ff" stroke="#fff" stroke-width="6"/><path d="M80 40 v70 M40 75 h80" stroke="#fff" stroke-width="4"/><rect x="220" y="120" width="160" height="70" rx="10" fill="#3d7fe0"/><rect x="220" y="110" width="40" height="40" rx="8" fill="#fff"/><rect x="150" y="70" width="60" height="8" fill="#a06a3a"/><rect x="150" y="110" width="60" height="8" fill="#a06a3a"/><ellipse cx="200" cy="230" rx="120" ry="18" fill="#f2b630" opacity=".7"/><text x="60" y="160" font-size="28">⭐</text>`,
  door: ()=>`${sky('#ffd99a','#ffb36b')}<circle cx="70" cy="50" r="34" fill="#fff1a8"/><circle cx="70" cy="50" r="48" fill="#ffe680" opacity=".35"/><rect x="150" y="40" width="220" height="170" fill="#f4ead8"/><rect x="230" y="90" width="70" height="120" fill="#8a5a2b"/><circle cx="290" cy="150" r="3" fill="#f3b52f"/><rect x="315" y="110" width="12" height="16" fill="#ddd"/><rect y="205" width="400" height="55" fill="#cbb08a"/>${palm(110,140)}<g opacity=".6" stroke="#fff" stroke-width="2"><path d="M20 150 q6 -8 0 -16 q-6 -8 0 -16" fill="none"/><path d="M40 160 q6 -8 0 -16 q-6 -8 0 -16" fill="none"/></g>`,
  living: ()=>`<rect width="400" height="260" fill="#f7e7cf"/><rect y="205" width="400" height="55" fill="#b98a5a"/><rect x="250" y="40" width="110" height="80" fill="#9fd3ff" stroke="#fff" stroke-width="6"/><rect x="30" y="140" width="170" height="60" rx="16" fill="#8a5aa8"/><rect x="30" y="120" width="170" height="30" rx="12" fill="#9e6cbd"/><rect x="230" y="150" width="60" height="55" fill="#a06a3a"/><g class="vase"><path d="M250 150 Q240 120 255 108 L265 108 Q280 120 270 150Z" fill="#3d9ad1"/></g><ellipse cx="200" cy="232" rx="140" ry="16" fill="#e2453c" opacity=".35"/>`,
  school: ()=>`${sky('#bfe6ff','#eaf7ff')}<rect x="20" y="50" width="250" height="140" fill="#f2c27c"/><rect x="20" y="40" width="250" height="14" fill="#c8742a"/>${[40,100,160,220].map(x=>`<rect x="${x}" y="80" width="34" height="34" fill="#9fd3ff" stroke="#fff" stroke-width="3"/>`).join('')}<rect x="120" y="140" width="40" height="50" fill="#7a4a1f"/>${tree(330,140)}<rect y="185" width="400" height="75" fill="#d9c7a6"/><rect x="300" y="200" width="80" height="10" fill="#8a5a2b"/><rect x="305" y="210" width="6" height="18" fill="#8a5a2b"/><rect x="369" y="210" width="6" height="18" fill="#8a5a2b"/>`,
  orphanage: ()=>`<rect width="400" height="260" fill="#fde6c8"/><rect y="200" width="400" height="60" fill="#e8a35a"/><path d="M0 30 Q50 60 100 30 T200 30 T300 30 T400 30" stroke="#e2453c" stroke-width="3" fill="none"/>${[30,90,150,210,270,330,390].map((x,i)=>`<path d="M${x-12} ${34+((i%2)*6)} l12 22 l12 -22z" fill="${['#3d7fe0','#f3b52f','#3f9440','#d1557a'][i%4]}"/>`).join('')}<rect x="150" y="80" width="100" height="70" fill="#9fd3ff" stroke="#fff" stroke-width="6"/><text x="60" y="150" font-size="34">🎈</text><text x="310" y="140" font-size="34">🎈</text>`,
  buffet: ()=>`<rect width="400" height="260" fill="#f3efe6"/><rect x="40" y="30" width="320" height="90" fill="#6fc7e8"/><rect x="40" y="90" width="320" height="30" fill="#2e8bbf"/><circle cx="320" cy="60" r="16" fill="#fff1a8"/><rect y="200" width="400" height="60" fill="#c9b79a"/><rect x="30" y="150" width="340" height="18" rx="6" fill="#fff"/><rect x="30" y="166" width="340" height="40" fill="#b5651d"/><text x="50" y="148" font-size="26">🍕🍝🍟🍰🍇🍗🥗</text>`,
  pitch: ()=>`${sky('#bfe6ff','#eaf7ff')}<rect y="60" width="400" height="40" fill="#8a8fa0"/>${Array.from({length:20},(_,i)=>`<circle cx="${10+i*20}" cy="${74+(i%2)*10}" r="6" fill="${['#e2453c','#3d7fe0','#f3b52f','#fff'][i%4]}"/>`).join('')}<rect y="100" width="400" height="160" fill="#4cae4c"/>${[0,1,2,3].map(i=>`<rect y="${100+i*40}" width="400" height="20" fill="#56b956"/>`).join('')}<rect x="150" y="110" width="100" height="50" fill="none" stroke="#fff" stroke-width="5"/><path d="M150 110 L170 96 L230 96 L250 110" fill="none" stroke="#fff" stroke-width="3"/><path d="M155 112 h90 M155 125 h90 M155 138 h90 M155 151 h90" stroke="#fff" opacity=".35"/>`,
};

window.ART = { person, cat, CAST, heroDef, BG };
})();
