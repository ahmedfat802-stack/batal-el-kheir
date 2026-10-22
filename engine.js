// ===== محرك لعبة بطل الخير =====
(function(){
const $=s=>document.querySelector(s), $$=s=>[...document.querySelectorAll(s)];
const sleep=ms=>new Promise(r=>setTimeout(r,ms));
const DEF = Object.assign({}, window.HERO_CONFIG);
let cfg = Object.assign({}, DEF);
try{ const s=JSON.parse(localStorage.getItem('bk-cfg')||'null'); if(s) cfg=Object.assign(cfg,s); }catch(e){}
const AV = new Set(window.AUDIO_CODES||[]);
const G = ()=>cfg.gender==='g';
const pkey = ()=>'bk-prog-'+cfg.name;
const msgFor=(g,n)=> g==='g' ? `إحنا فخورين بيكي قوي يا ${n}! إنتِ بطلة الخير بتاعتنا.` : `إحنا فخورين بيك قوي يا ${n}! إنت بطل الخير بتاعنا.`;
if(!cfg.customMsg) cfg.parentMessage = msgFor(cfg.gender, cfg.name);
const audioFor=n=> n===DEF.name ? DEF.nameAudio : null;  // الاسم الوحيد المتسجل بالصوت
let prog = loadProg();
function loadProg(){ try{ return JSON.parse(localStorage.getItem(pkey())||'null') || {done:[],missions:[],started:false}; }catch(e){ return {done:[],missions:[],started:false}; } }
function saveProg(){ try{ localStorage.setItem(pkey(), JSON.stringify(prog)); }catch(e){} }
function saveCfg(){ try{ localStorage.setItem('bk-cfg', JSON.stringify(cfg)); }catch(e){ try{ localStorage.setItem('bk-cfg', JSON.stringify(Object.assign({},cfg,{photo:null}))); }catch(e2){} } }

// ---------- صوت ----------
let ac=null;
function actx(){ try{ ac = ac || new (window.AudioContext||window.webkitAudioContext)(); if(ac.state==='suspended') ac.resume(); }catch(e){} return ac; }
function tone(f,d,type,delay,vol,slide){ const a=actx(); if(!a) return; const t=a.currentTime+(delay||0), o=a.createOscillator(), g=a.createGain(); o.type=type||'sine'; o.frequency.setValueAtTime(f,t); if(slide) o.frequency.exponentialRampToValueAtTime(slide,t+d); g.gain.setValueAtTime(vol||.15,t); g.gain.exponentialRampToValueAtTime(.001,t+d); o.connect(g).connect(a.destination); o.start(t); o.stop(t+d+.02); }
function noise(d,vol,delay,hp){ const a=actx(); if(!a) return; const n=a.sampleRate*d, b=a.createBuffer(1,n,a.sampleRate), x=b.getChannelData(0); for(let i=0;i<n;i++) x[i]=(Math.random()*2-1)*(1-i/n); const s=a.createBufferSource(); s.buffer=b; const g=a.createGain(); g.gain.value=vol||.2; const f=a.createBiquadFilter(); f.type='highpass'; f.frequency.value=hp||800; s.connect(f).connect(g).connect(a.destination); s.start(a.currentTime+(delay||0)); }
const SFX = {
  ok(){ tone(660,.15,'triangle'); tone(990,.25,'triangle',.1); },
  wrong(){ tone(260,.25,'sine',0,.12,180); },
  pop(){ tone(500,.08,'sine',0,.15,900); },
  bell(){ tone(880,.5,'sine',0,.2); tone(700,.7,'sine',.35,.2); },
  crash(){ noise(.6,.35,0,1500); tone(1400,.3,'triangle',0,.08,600); },
  cheer(){ noise(1.2,.12,0,600); [523,659,784,1046].forEach((f,i)=>tone(f,.3,'triangle',i*.1,.12)); },
  whistle(){ for(let i=0;i<6;i++) tone(2400+((i%2)*200),.08,'sine',i*.07,.12); },
  miss(){ tone(500,.5,'sawtooth',0,.06,150); },
  ping(){ tone(1320,.15,'sine',0,.15); tone(1760,.2,'sine',.15,.15); },
  purr(){ for(let i=0;i<8;i++) tone(60,.12,'sawtooth',i*.14,.05); },
  slap(){ noise(.12,.3,0,2000); },
  kick(){ tone(120,.15,'sine',0,.3,60); },
  flower(){ tone(784,.12,'sine'); tone(1175,.2,'sine',.08); },
  star(){ [784,988,1175,1568].forEach((f,i)=>tone(f,.25,'triangle',i*.08,.12)); }
};
function codeFile(code){ if(G() && AV.has(code+'_G')) return 'audio/'+code+'_G.mp3'; return 'audio/'+code+'.mp3'; }
function textOf(code){ if(G() && window.TEXT[code+'_G']) return window.TEXT[code+'_G']; return window.TEXT[code]||''; }
function speakerOf(code){ const m=code.match(/^(?:S\d\d|C)_([A-Z]+)/); const k=m?m[1]:'N'; return k; }
let curAudios=[];
function playSrc(src){ return new Promise(res=>{ const a=new Audio(src); curAudios.push(a); let done=false; const fin=()=>{ if(done) return; done=true; curAudios=curAudios.filter(x=>x!==a); res(); };
  a.addEventListener('ended',fin); a.addEventListener('error',()=>setTimeout(fin,600)); a.play().catch(()=>setTimeout(fin,1500)); setTimeout(fin,25000); }); }
function stopAll(){ curAudios.forEach(a=>{try{a.pause();}catch(e){}}); curAudios=[]; }

// ---------- عناصر الشاشة ----------
const stage=$('#stage'), bubble=$('#bubble'), act=$('#act');
function show(id){ $$('.screen').forEach(s=>s.hidden = s.id!==id); }
function setBubble(code){ const sp=speakerOf(code); bubble.hidden=false; bubble.querySelector('.who').textContent = sp==='N'?'الراوي':(window.SPEAKER[sp]||''); bubble.querySelector('.txt').textContent=textOf(code); bubble.dataset.sp=sp; }
async function say(code, name){
  setBubble(code); const sp=speakerOf(code); const el=charEl(sp==='N'?null:sp);
  if(el) el.classList.add('talking');
  if(name && cfg.nameAudio && cfg.nameAudio[name]) await playSrc(cfg.nameAudio[name]);
  await playSrc(codeFile(code));
  if(el) el.classList.remove('talking');
}

// ---------- المسرح والشخصيات ----------
let moods={};
function heroSVG(m){ return window.ART.person(window.ART.heroDef(cfg), m||'happy'); }
function charSVG(id,m){ if(id==='cat') return window.ART.cat(m); if(id==='hero') return heroSVG(m); return window.ART.person(window.ART.CAST[id], m); }
function bgSVG(k){ return `<svg viewBox="0 0 400 260" preserveAspectRatio="xMidYMax slice">${window.ART.BG[k]()}</svg>`; }
function charEl(id){ return id? stage.querySelector(`.char[data-id="${id}"]`) : null; }
function setMood(id,m){ moods[id]=m; const el=charEl(id); if(el) el.innerHTML=charSVG(id,m); }
function buildStage(sit, bgKey){
  stage.innerHTML = `<div class="bg">${bgSVG(bgKey||sit.bg)}</div>`;
  const ids = sit.cast||[];
  const slots = ids.length===1?[18]:ids.length===2?[8,32]:[4,22,40];
  ids.forEach((id,i)=>addChar(id, slots[i], (sit.hideStart||[]).includes(id)));
  addChar('hero', 70, false);
}
function addChar(id,left,hidden){
  const d=document.createElement('div'); d.className='char'+((window.ART.CAST[id]||{}).kid||id==='hero'?' kid':'')+(id==='cat'?' cat':''); d.dataset.id=id; d.style.left=left+'%'; d.innerHTML=charSVG(id,moods[id]||'happy'); if(hidden) d.classList.add('out'); stage.appendChild(d); return d;
}
function partyCast(){
  stage.querySelectorAll('.char:not([data-id="hero"])').forEach(c=>c.remove());
  const ids=['SB','K','O','ND','A','H','M']; ids.forEach((id,i)=>{ const d=addChar(id, 2+i*9.5, false); d.classList.add('party'); });
  const h=charEl('hero'); if(h){ h.style.left='74%'; }
  const deco=stage.querySelector('.party-deco'); if(deco) deco.setAttribute('opacity','1');
  confetti(60);
}

// ---------- مؤثرات ----------
function confetti(n){ const fx=$('#fx'); const cols=['#e2453c','#f3b52f','#1d8c8c','#3f9440','#d1557a','#3d7fe0']; for(let i=0;i<(n||30);i++){ const c=document.createElement('i'); c.className='conf'; c.style.left=Math.random()*100+'%'; c.style.background=cols[i%cols.length]; c.style.setProperty('--dx',(Math.random()*160-80)+'px'); c.style.setProperty('--r',(Math.random()*720)+'deg'); c.style.animationDelay=(Math.random()*.4)+'s'; fx.appendChild(c); setTimeout(()=>c.remove(),2600); } }
function rain(on){ let r=stage.querySelector('.rain'); if(on&&!r){ r=document.createElement('div'); r.className='rain'; stage.appendChild(r);} if(!on&&r) r.remove(); }
function floatIcon(e, x, y){ const d=document.createElement('div'); d.className='floaty'; d.textContent=e; d.style.left=x+'px'; d.style.top=y+'px'; $('#fx').appendChild(d); setTimeout(()=>d.remove(),1400); }
const praise=()=>'C_N0'+(6+Math.floor(Math.random()*4));

// ---------- مساعدة لو الطفل وقف ----------
let hintT=null;
function armHint(getTarget){ clearTimeout(hintT); hintT=setTimeout(async()=>{ const t=getTarget(); if(!t) return; const r=t.getBoundingClientRect(); const h=document.createElement('div'); h.className='hand'; h.textContent='👆'; h.style.left=(r.left+r.width/2-18)+'px'; h.style.top=(r.top+r.height/2)+'px'; document.body.appendChild(h); setTimeout(()=>h.remove(),3200); if(!curAudios.length) playSrc(codeFile('C_N04')); armHint(getTarget); }, 8000); }
function disarmHint(){ clearTimeout(hintT); }

// ---------- أنواع الخطوات ----------
const STEPS = {
  async say(s){ await say(s.a, s.name); },
  async mood(s){ setMood(s.who, s.m); await sleep(150); },
  async show(s){ const el=charEl(s.who); if(el) el.classList.remove('out'); await sleep(450); },
  async hide(s){ const el=charEl(s.who); if(el) el.classList.add('out'); await sleep(300); },
  async sfx(s){ SFX[s.s]&&SFX[s.s](); if(s.s==='crash'){ const v=stage.querySelector('.vase'); if(v) v.setAttribute('opacity','0'); stage.classList.add('shake'); setTimeout(()=>stage.classList.remove('shake'),500);} await sleep(s.s==='bell'?1100:700); },
  async scene(s){ const bg=stage.querySelector('.bg'); bg.innerHTML=bgSVG(s.bg); if(s.bg==='orphanage'){ addKids(); } await sleep(500); },
  async together(s){ s.a.forEach(c=>{ const sp=speakerOf(c); const el=charEl(sp); if(el){ el.classList.add('talking'); setTimeout(()=>el.classList.remove('talking'),1500);} }); setBubble(s.a[0]); await Promise.all(s.a.map(c=>playSrc(codeFile(c)))); },
  async party(){ partyCast(); SFX.cheer(); await sleep(900); },
  choice(s){ return new Promise(res=>{
    const ge=e=>G()?e.replace(/♂/g,'♀'):e;
    act.innerHTML=`<div class="choices"><button class="card" data-k="good"><span class="pic">${ge(s.good.e)}</span><span class="cap">${s.good.l}</span></button><button class="card" data-k="bad"><span class="pic">${ge(s.bad.e)}</span><span class="cap">${s.bad.l}</span></button></div>`;
    // نخلط مكان الكارتين
    const box=act.querySelector('.choices'); if(Math.random()<.5) box.appendChild(box.firstElementChild);
    let busy=false;
    box.querySelectorAll('.card').forEach(b=>b.onclick=async()=>{
      if(busy) return; busy=true; stopAll();
      if(b.dataset.k==='good'){ SFX.ok(); b.classList.add('ok'); confetti(18); await sleep(600); act.innerHTML=''; res(); }
      else { SFX.wrong(); b.classList.add('no'); if(s.badMood) setMood(s.badMood,'sad'); if(s.badShow){ const el=charEl(s.badShow); if(el) el.classList.remove('out'); }
        if(s.badFx==='rain') rain(true); if(s.badFx==='trash') floatIcon('🗑️', innerWidth/2, innerHeight*.3);
        await say(s.wrong); rain(false); b.classList.remove('no'); busy=false; }
    });
  }); },
  hold(s){ return new Promise(res=>{
    act.innerHTML=`<div class="grid hold">${s.items.map((e,i)=>`<button class="tile" data-i="${i}"><span class="bud">${s.bud}</span><span class="open">${e}</span><svg class="ring" viewBox="0 0 40 40"><circle cx="20" cy="20" r="17"/></svg></button>`).join('')}</div><p class="tip">✋ نسيب صباعنا على الوردة لحد ما تفتّح</p>`;
    let left=s.items.length, idx=0; const pending=[];
    const tiles=[...act.querySelectorAll('.tile')];
    armHint(()=>tiles.find(t=>!t.classList.contains('done')));
    tiles.forEach(t=>{ let timer=null, st=0;
      const start=e=>{ e.preventDefault(); if(t.classList.contains('done')) return; t.classList.add('holding'); st=Date.now(); timer=setInterval(()=>{ const p=Math.min(1,(Date.now()-st)/1100); t.style.setProperty('--p',p); if(p>=1){ clearInterval(timer); t.classList.remove('holding'); t.classList.add('done'); SFX.flower(); const ln=s.lines[idx]; idx++; left--; if(ln) pending.push(say(ln)); armHint(()=>tiles.find(x=>!x.classList.contains('done'))); if(!left){ disarmHint(); Promise.all(pending).then(()=>sleep(300)).then(()=>{act.innerHTML=''; res();}); } } },40); };
      const stop=()=>{ clearInterval(timer); if(!t.classList.contains('done')){ t.classList.remove('holding'); t.style.setProperty('--p',0);} };
      t.addEventListener('pointerdown',start); t.addEventListener('pointerup',stop); t.addEventListener('pointerleave',stop); t.addEventListener('pointercancel',stop);
    });
  }); },
  sort(s){ return new Promise(res=>{
    const need = s.need || s.items.filter(i=>!i.broken).length;
    const meter = s.meter ? `<div class="meter"><span>🙂 مقياس البطن</span><div class="bar"><i style="width:0%"></i></div></div>` : '';
    act.innerHTML=`${meter}<div class="bins ${s.puzzle?'puzzle':''}">${s.bins.map(b=>`<div class="bin" data-b="${b.id}" style="--c:${b.c||'#fff'}">${s.puzzle?`<span class="slot">${['🔸','🔹','🔶'][+b.id-1]}</span>`:`<span class="be">${b.e||'📦'}</span><span class="bl">${b.l}</span>`}<span class="cnt"></span></div>`).join('')}</div>
      <div class="tray">${s.items.map((it,i)=>`<div class="item ${it.broken?'broken':''}" data-i="${i}">${it.e}${it.broken?'<b class="crack">💔</b>':''}</div>`).join('')}</div>`;
    let placed=0, busy=false;
    const items=[...act.querySelectorAll('.item')];
    armHint(()=>items.find(x=>!x.classList.contains('gone')&&!x.classList.contains('broken')));
    items.forEach(el=>{ const it=s.items[+el.dataset.i];
      el.addEventListener('pointerdown',e=>{ if(busy||el.classList.contains('gone')) return; e.preventDefault(); actx();
        const g=el.cloneNode(true); g.classList.add('ghost'); document.body.appendChild(g); el.classList.add('lift');
        const mv=ev=>{ g.style.left=(ev.clientX-30)+'px'; g.style.top=(ev.clientY-30)+'px'; }; mv(e);
        const up=async ev=>{ removeEventListener('pointermove',mv); removeEventListener('pointerup',up); g.remove(); el.classList.remove('lift');
          const target=document.elementFromPoint(ev.clientX,ev.clientY); const bin=target&&target.closest('.bin'); if(!bin) return;
          busy=true;
          if(it.broken){ SFX.wrong(); el.classList.add('shakeit'); await say(s.brokenLine); el.classList.remove('shakeit'); el.classList.add('gone'); busy=false; return; }
          if(s.meter && placed>=s.meter){ SFX.wrong(); await say(s.fullLine); busy=false; return; }
          if(bin.dataset.b!==it.b){ SFX.wrong(); bin.classList.add('shakeit'); setTimeout(()=>bin.classList.remove('shakeit'),500); if(s.wrong) await say(s.wrong); busy=false; return; }
          SFX.pop(); el.classList.add('gone'); placed++; bin.classList.add('got'); setTimeout(()=>bin.classList.remove('got'),300);
          if(s.puzzle){ bin.classList.add('filled'); }
          const c=bin.querySelector('.cnt'); if(c&&!s.puzzle){ c.textContent=(c.textContent||'')+it.e; }
          if(s.meter){ act.querySelector('.meter i').style.width=Math.min(100,placed/s.meter*100)+'%'; }
          busy=false;
          if(placed>=need){ disarmHint(); SFX.ok(); confetti(20); if(s.meter){ await sleep(500); await say(s.fullLine); } else { await sleep(300); await say(praise()); } act.innerHTML=''; res(); }
        };
        addEventListener('pointermove',mv); addEventListener('pointerup',up);
      });
    });
  }); },
  rub(s){ return new Promise(res=>{
    act.innerHTML=`<div class="rubbox"><div class="rubtarget"><span class="re">${s.e}</span><div class="dirt"></div><div class="sparkle">✨</div></div><div class="bar"><i style="width:0%"></i></div><p class="tip">👆 نفرك بصباعنا يمين وشمال</p></div>`;
    const t=act.querySelector('.rubtarget'), bar=act.querySelector('.bar i'), dirt=act.querySelector('.dirt'); let dist=0, last=null, done=false, lastPurr=0;
    armHint(()=>t);
    const goal=2600;
    t.addEventListener('pointerdown',e=>{ e.preventDefault(); last=[e.clientX,e.clientY]; actx(); });
    t.addEventListener('pointermove',e=>{ if(!last||done) return; const d=Math.hypot(e.clientX-last[0],e.clientY-last[1]); last=[e.clientX,e.clientY]; dist+=d; const p=Math.min(1,dist/goal); bar.style.width=(p*100)+'%'; dirt.style.opacity=1-p; armHint(()=>t);
      if(s.purr && Date.now()-lastPurr>1200){ lastPurr=Date.now(); SFX.purr(); }
      if(p>=1){ done=true; disarmHint(); t.classList.add('clean'); SFX.ok(); confetti(16); sleep(500).then(()=>say(praise())).then(()=>{ act.innerHTML=''; res(); }); } });
    const end=()=>{ last=null; }; t.addEventListener('pointerup',end); t.addEventListener('pointerleave',end);
  }); },
  pick(s){ return new Promise(res=>{
    act.innerHTML=`<div class="fridge"><div class="fdoor">🧊 التلاجة</div><div class="grid">${s.options.map((o,i)=>`<button class="tile" data-i="${i}"><span class="open">${o.e}</span></button>`).join('')}</div></div>`;
    const tiles=[...act.querySelectorAll('.tile')]; let busy=false;
    armHint(()=>tiles[s.options.findIndex(o=>o.ok)]);
    tiles.forEach(t=>t.onclick=async()=>{ if(busy) return; busy=true; const o=s.options[+t.dataset.i];
      if(o.ok){ disarmHint(); SFX.ok(); t.classList.add('ok'); confetti(16); const r=t.getBoundingClientRect(); floatIcon('💧',r.left+20,r.top); await sleep(700); act.innerHTML=''; res(); }
      else { SFX.wrong(); t.classList.add('shakeit'); await say(s.wrong); t.classList.remove('shakeit'); busy=false; } });
  }); },
  tapAll(s){ return new Promise(res=>{
    let tiles;
    if(s.party){
      tiles = s.targets.map(tg=>{ const el=charEl(tg.who); el.classList.add('tappable'); return el; });
    } else {
      act.innerHTML=`<div class="grid tap ${s.pass?'pass':''} ${s.eat?'eat':''} ${s.five?'five':''}">${s.targets.map((tg,i)=>`<button class="tile" data-i="${i}"><span class="open">${tg.e}</span>${tg.l?`<span class="tl">${tg.l}</span>`:''}</button>`).join('')}</div>${s.pass?'<div class="ball">⚽</div>':''}`;
      tiles=[...act.querySelectorAll('.tile')];
    }
    let left=s.targets.length, busy=false;
    armHint(()=>tiles.find(t=>!t.classList.contains('done')));
    tiles.forEach((t,i)=>{ const h=async()=>{ if(busy) return; const tg=s.targets[i];
      if(t.classList.contains('done')){ if(s.again){ busy=true; await say(s.again); busy=false; } return; }
      busy=true; t.classList.add('done'); left--; armHint(()=>tiles.find(x=>!x.classList.contains('done')));
      if(s.pass){ SFX.kick(); const b=act.querySelector('.ball'), r=t.getBoundingClientRect(), ar=act.getBoundingClientRect(); b.style.left=(r.left-ar.left+r.width/2-18)+'px'; b.style.top=(r.top-ar.top-6)+'px'; await sleep(450); }
      else if(s.eat){ SFX.pop(); t.querySelector('.open').textContent='✨'; await sleep(300); }
      else if(s.five){ SFX.slap(); await sleep(250); }
      else if(s.party){ t.classList.remove('tappable'); }
      if(tg.line){ await say(tg.line); } else SFX.ok();
      busy=false;
      if(!left){ disarmHint(); confetti(20); await sleep(400); if(!s.party && !s.story) await say(praise()); act.innerHTML=''; res(); } };
      if(s.party) t.onclick=h; else t.onclick=h;
    });
  }); },
  shoot(){ return new Promise(res=>{
    act.innerHTML=`<div class="shoot"><div class="goal">🥅</div><div class="arrow"><span>⬆️</span></div><button class="kickbtn">⚽ شوّت!</button></div>`;
    const ar=act.querySelector('.arrow'); let ang=0, dir=1, run=true, busy=false;
    (function loop(){ if(!run) return; ang+=dir*1.6; if(ang>40||ang<-40) dir*=-1; ar.style.transform=`rotate(${ang}deg)`; requestAnimationFrame(loop); })();
    const btn=act.querySelector('.kickbtn'); armHint(()=>btn);
    btn.onclick=async()=>{ if(busy) return; busy=true; SFX.kick();
      if(Math.abs(ang)<12){ run=false; disarmHint(); act.querySelector('.goal').classList.add('scored'); confetti(40); await sleep(900); act.innerHTML=''; res(); }
      else { SFX.miss(); await say('C_N05'); busy=false; } };
  }); },
  async talk(s){
    await say(s.a);
    await new Promise(res=>{ act.innerHTML=`<div class="talkcard"><div class="mic">🎤</div><p>يلا نقولها بصوت عالي!</p><button class="big">قلتها! ✔</button></div>`; const b=act.querySelector('.big'); armHint(()=>b); b.onclick=()=>{ disarmHint(); SFX.star(); confetti(25); act.innerHTML=''; res(); }; });
    await say('C_N10');
  },
  async tree(s){
    const n = Math.min(10, prog.done.length + 1);
    $('#tree-ov').hidden=false; drawTree($('#tree-ov .treebox'), s.full?10:n, true);
    SFX.flower(); confetti(30);
    await say(s.a || 'C_N11'); await sleep(500); $('#tree-ov').hidden=true;
  },
  async mission(s){
    $('#mission-note').textContent = G() ? 'لما تعمليها، ماما أو بابا يضغطوا مطوّل على النجمة ⭐ في الخريطة، وتاخدي وسام 🏅' : 'لما تعملها، ماما أو بابا يضغطوا مطوّل على النجمة ⭐ في الخريطة، وتاخد وسام 🏅';
    $('#mission-ov').hidden=false; $('#mission-ov .mtext').textContent = textOf(s.a).replace(/^مهمتنا (النهارده|بكرة|الكبيرة):\s*/,'');
    const btn=$('#mission-ov .big'); let clicked=false, audioDone=false, fin;
    const done=new Promise(r=>fin=r); const check=()=>{ if(clicked&&audioDone){ $('#mission-ov').hidden=true; fin(); } };
    btn.classList.add('wait'); btn.onclick=()=>{ clicked=true; check(); };
    await say(s.a); await say('C_N12'); audioDone=true; btn.classList.remove('wait'); check();
    await done;
  },
  async cert(){ await showCert(); }
};
function addKids(){ ['A','O'].forEach((id,i)=>{ const d=addChar(id, 10+i*22, false); }); }

// ---------- شجرة الخير ----------
function drawTree(box, n, animateLast){
  const pos=[[50,22],[30,30],[70,30],[20,44],[40,42],[60,42],[80,44],[32,56],[52,56],[70,56]];
  const cols=['#e2453c','#f3b52f','#d1557a','#3d7fe0','#ff8c42','#8a5aa8','#e2453c','#f3b52f','#d1557a','#3d7fe0'];
  box.innerHTML = `<svg viewBox="0 0 100 100" class="treesvg"><path d="M46 96 L48 64 Q40 58 34 60 M48 66 Q56 58 64 60 M50 96 L52 64" stroke="#7a4a1f" stroke-width="4" fill="none" stroke-linecap="round"/><rect x="45" y="62" width="10" height="36" rx="3" fill="#8a5a2b"/><ellipse cx="50" cy="40" rx="42" ry="30" fill="#4f9a3f"/><ellipse cx="34" cy="48" rx="22" ry="16" fill="#5aab47"/><ellipse cx="66" cy="46" rx="22" ry="16" fill="#468a37"/>
   ${pos.map((p,i)=>i<n?`<g class="fl ${animateLast&&i===n-1?'newfl':''}" transform="translate(${p[0]} ${p[1]})"><circle r="4.2" fill="${cols[i]}"/><circle r="1.8" fill="#fff6a8"/></g>`:'').join('')}</svg>`;
}

// ---------- الشاشات ----------
function renderHome(){
  $('#home-hero').innerHTML=heroSVG('happy');
  $('#home-name').textContent=cfg.name;
  $('#home-sub').textContent = G()?'مغامرة بطلة الخير':'مغامرة بطل الخير';
  show('home');
}
function stationState(i){ const id=i+1; if(prog.done.includes(id)) return 'done'; const first=window.SITUATIONS.findIndex(s=>!prog.done.includes(s.id)); return i===first?'current':'locked'; }
function renderMap(playIntro){
  const list=$('#stations'); list.innerHTML='';
  window.SITUATIONS.forEach((s,i)=>{ const st=stationState(i); const b=document.createElement('button'); b.className='station '+st; b.disabled = st==='locked';
    const mDone=prog.missions.includes(s.id);
    b.innerHTML=`<span class="num">${i+1}</span><span class="sicon">${st==='done'?'🌸':s.icon}</span><span class="stitle">${s.title}</span><span class="sval">${s.value}</span>${st==='done'?`<span class="medal ${mDone?'got':''}" data-id="${s.id}" title="مهمة البيت">${mDone?'🏅':'⭐'}</span>`:''}`;
    b.onclick=e=>{ if(e.target.closest('.medal')) return; startSituation(s); };
    list.appendChild(b);
  });
  list.querySelectorAll('.medal:not(.got)').forEach(m=>bindParentHold(m, async()=>{ prog.missions.push(+m.dataset.id); saveProg(); SFX.star(); confetti(40); renderMap(); await playSrc(codeFile('C_N13')); }));
  drawTree($('#map-tree'), prog.done.length, false);
  $('#map-count').textContent = `${prog.done.length} / 10`;
  $('#map-medals').textContent = `🏅 ${prog.missions.length}`;
  show('map');
  if(playIntro) playIntro();
}
function bindParentHold(el, fn){ let t=null; const start=e=>{ e.preventDefault(); e.stopPropagation(); el.classList.add('holding'); t=setTimeout(()=>{ el.classList.remove('holding'); fn(); },1600); }; const stop=()=>{ clearTimeout(t); el.classList.remove('holding'); };
  el.addEventListener('pointerdown',start); el.addEventListener('pointerup',stop); el.addEventListener('pointerleave',stop); el.addEventListener('click',e=>e.stopPropagation()); }

let running=false, runId=0;
async function startSituation(sit){
  if(running) return; running=true; stopAll(); moods={}; const my=++runId;
  show('play'); $('#play-title').textContent=`${sit.id}. ${sit.title}`; act.innerHTML=''; bubble.hidden=true;
  buildStage(sit);
  try{
    for(const [si,step] of sit.steps.entries()){ if(!running || my!==runId) return; window.__curStep=sit.id+':'+si+':'+step.t; await STEPS[step.t](step); }
    if(my!==runId) return;
    if(!prog.done.includes(sit.id)){ prog.done.push(sit.id); saveProg(); }
    running=false;
    const next = window.SITUATIONS.find(s=>!prog.done.includes(s.id));
    renderMap(next? ()=>playSrc(codeFile('C_N14')) : null);
  }catch(e){ console.error(e); running=false; renderMap(); }
}
async function showCert(){
  $('#cert-hero').innerHTML=heroSVG('wow');
  $('#cert-name').textContent = (G()?'البطلة ':'البطل ')+cfg.name;
  $('#cert-line').innerHTML = G()?'بقت رسمي <b>بطلة الخير</b> 🌳':'بقى رسمي <b>بطل الخير</b> 🌳';
  $('#cert-values').innerHTML = window.SITUATIONS.map(s=>`<span>${s.icon} ${s.value}</span>`).join('');
  $('#cert-msg').textContent = cfg.parentMessage||'';
  try{ $('#cert-date').textContent=new Date().toLocaleDateString('ar-EG',{day:'numeric',month:'long',year:'numeric'}); }catch(e){}
  $('#cert-ov').hidden=false; SFX.star(); confetti(80);
  await new Promise(r=>{ $('#cert-ov .big').onclick=()=>{ $('#cert-ov').hidden=true; r(); }; });
}

// ---------- لوحة الأهل / المنفّذ ----------
function openSettings(){
  $('#s-name').value=cfg.name; $('#s-msg').value=cfg.parentMessage||''; $(cfg.gender==='g'?'#s-girl':'#s-boy').checked=true; $('#s-photo').value='';
  $('#settings').hidden=false;
}
let pendingPhoto;
$('#s-photo').onchange=e=>{ const f=e.target.files[0]; if(!f) return; const r=new FileReader(); r.onload=()=>pendingPhoto=r.result; r.readAsDataURL(f); };
$('#s-form').onsubmit=e=>{ e.preventDefault(); const nm=$('#s-name').value.trim()||DEF.name; cfg.nameAudio = audioFor(nm);
  const oldAuto=msgFor(cfg.gender,cfg.name); cfg.name=nm; cfg.gender=document.querySelector('input[name=g]:checked').value; const m=$('#s-msg').value.trim(); if(!m||m===oldAuto){ cfg.customMsg=false; cfg.parentMessage=msgFor(cfg.gender,cfg.name);} else { cfg.customMsg=true; cfg.parentMessage=m; } cfg.chosen=true; if(pendingPhoto!==undefined) cfg.photo=pendingPhoto; pendingPhoto=undefined;
  saveCfg(); prog=loadProg(); $('#settings').hidden=true; renderHome(); };
$('#s-reset').onclick=()=>{ prog={done:[],missions:[],started:false}; saveProg(); $('#settings').hidden=true; renderHome(); };
$('#s-unlock').onclick=()=>{ prog.done=window.SITUATIONS.map(s=>s.id).slice(0,9); saveProg(); $('#settings').hidden=true; renderMap(); };
$('#s-close').onclick=()=>$('#settings').hidden=true;
bindParentHold($('#gear'), openSettings);


// ---------- اختيار البطل (ولد / بنت) ----------
let whoG = cfg.gender;
function renderWho(){
  $('#who-boy').innerHTML = window.ART.person(window.ART.heroDef({name:'',gender:'b'}),'happy');
  $('#who-girl').innerHTML = window.ART.person(window.ART.heroDef({name:'',gender:'g'}),'happy');
  whoG = cfg.chosen ? cfg.gender : null;
  $('#who-name').value = cfg.chosen ? cfg.name : '';
  markWho(); show('who');
}
function markWho(){
  $$('.who-card').forEach(c=>c.classList.toggle('sel', c.dataset.g===whoG));
  $('#who-name').placeholder = whoG==='g' ? 'مثلًا: مريم' : 'مثلًا: يوسف';
  $('#who-go').disabled = !whoG; $('#who-go').style.opacity = whoG ? 1 : .45;
}
$$('.who-card').forEach(c=>c.onclick=()=>{ actx(); SFX.pop(); whoG=c.dataset.g; markWho(); });
$('#who-go').onclick=()=>{
  if(!whoG) return; actx();
  const nm = $('#who-name').value.trim() || (whoG==='g' ? 'مريم' : DEF.name);
  const changed = nm!==cfg.name || whoG!==cfg.gender;
  cfg.gender = whoG; cfg.name = nm; cfg.nameAudio = audioFor(nm); cfg.chosen = true;
  if(changed || !cfg.customMsg){ cfg.customMsg=false; cfg.parentMessage = msgFor(cfg.gender, cfg.name); }
  saveCfg(); prog = loadProg(); SFX.ok(); renderHome();
};
$('#change-hero').onclick=()=>{ stopAll(); renderWho(); };

// ---------- ربط الأزرار ----------
$('#start').onclick=()=>{ actx(); const first=!prog.started; prog.started=true; saveProg();
  renderMap(()=> first ? (async()=>{ if(cfg.nameAudio) await playSrc(cfg.nameAudio.call); await playSrc(codeFile('C_N01')); })() : playSrc(codeFile('C_N02'))); };
$('#map-home').onclick=()=>{ stopAll(); renderHome(); };
$('#play-back').onclick=()=>{ running=false; runId++; stopAll(); disarmHint(); act.innerHTML=''; $$('.overlay').forEach(o=>o.hidden=true); renderMap(); };
$('#bubble').onclick=()=>{ /* tap bubble = nothing; reserved */ };

if(cfg.askHero!==false && !cfg.chosen) renderWho(); else renderHome();
window.__BK = { STEPS, startSituation, prog:()=>prog, cfg:()=>cfg, renderMap };
})();
