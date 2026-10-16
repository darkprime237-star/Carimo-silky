'use client';
import {useEffect,useRef,useState} from 'react';
import {createPortal} from 'react-dom';

export function GoldenPetals(){
 return <div className="golden-petals" aria-hidden="true">{Array.from({length:32},(_,i)=><span className={`petal-drift petal-depth-${i%3}`} key={i} style={{'--petal-x':`${(i*47+3)%100}vw`,'--petal-drift':`${(i%2?1:-1)*(70+i%6*28)}px`,'--petal-size':`${13+(i*7)%25}px`,'--petal-delay':`${-i*2.73}s`,'--petal-time':`${23+(i*3)%19}s`,'--petal-turn':`${i*31}deg`}}><i/></span>)}</div>;
}

export function SilkyCursor({reduced}){
 const ring=useRef(null),dot=useRef(null),[mounted,setMounted]=useState(false);
 useEffect(()=>setMounted(true),[]);
 useEffect(()=>{
  if(!mounted||reduced)return;
  const fine=matchMedia('(hover: hover) and (pointer: fine)');if(!fine.matches)return;
  let frame=0,visible=false,targetX=0,targetY=0,x=0,y=0;
  const hide=()=>{visible=false;document.documentElement.classList.remove('silky-cursor-active');if(ring.current)ring.current.style.opacity='0';if(dot.current)dot.current.style.opacity='0'};
  const move=e=>{
   if(e.pointerType==='touch'||e.target.closest?.('dialog[open]')){hide();return}
   targetX=e.clientX;targetY=e.clientY;
   if(!visible){x=targetX;y=targetY;visible=true;document.documentElement.classList.add('silky-cursor-active');ring.current.style.opacity='1';dot.current.style.opacity='1'}
   const type=e.target.closest?.('.product-scene')?'drag':e.target.closest?.('a,button,[role="tab"]')?'link':'idle';
   ring.current.dataset.state=type;
   ring.current.querySelector('b').textContent=type==='drag'?'↔':type==='link'?'↗':'';
   dot.current.style.transform=`translate3d(${targetX}px,${targetY}px,0)`;
  };
  const down=()=>ring.current?.classList.add('is-down'),up=()=>ring.current?.classList.remove('is-down');
  const out=e=>{if(!e.relatedTarget)hide()};const key=e=>{if(e.key==='Tab'||e.key==='Escape')hide()};const focus=e=>{if(e.target.closest?.('dialog[open]'))hide()};
  const tick=()=>{if(visible){x+=(targetX-x)*.23;y+=(targetY-y)*.23;ring.current.style.transform=`translate3d(${x}px,${y}px,0)`}frame=requestAnimationFrame(tick)};
  frame=requestAnimationFrame(tick);window.addEventListener('pointermove',move,{passive:true});window.addEventListener('pointerdown',down);window.addEventListener('pointerup',up);window.addEventListener('pointerout',out);window.addEventListener('blur',hide);window.addEventListener('keydown',key);window.addEventListener('focusin',focus);fine.addEventListener('change',hide);
  return()=>{cancelAnimationFrame(frame);hide();window.removeEventListener('pointermove',move);window.removeEventListener('pointerdown',down);window.removeEventListener('pointerup',up);window.removeEventListener('pointerout',out);window.removeEventListener('blur',hide);window.removeEventListener('keydown',key);window.removeEventListener('focusin',focus);fine.removeEventListener('change',hide)};
 },[mounted,reduced]);
 if(!mounted)return null;
 return createPortal(<><div ref={ring} className="silky-cursor" aria-hidden="true"><span/><b/></div><div ref={dot} className="silky-cursor-dot" aria-hidden="true"/></>,document.body);
}

export function InvitationIcon({kind,...props}){
 const paths={whatsapp:<><path d="M27 15a12 12 0 0 1-18 11l-7 3 2-7A12 12 0 1 1 27 15Z"/><path d="m11 8-3 2c0 7 7 14 14 13l2-3-5-3-2 2c-3-1-5-3-6-5l2-2Z"/></>,gift:<><path d="M4 10h24v6H4zM6 16v14h20V16M16 10v20"/><path d="M16 10C5 10 5 1 11 3c4 1 5 7 5 7Zm0 0c11 0 11-9 5-7-4 1-5 7-5 7Z"/></>,people:<><circle cx="16" cy="9" r="4"/><path d="M9 28v-6a7 7 0 0 1 14 0v6M5 11a3 3 0 1 0 0 6M2 28v-5a5 5 0 0 1 5-5M27 11a3 3 0 1 1 0 6m3 11v-5a5 5 0 0 0-5-5"/></>,link:<><path d="m3 12 6-6 7 2 7-2 6 6-7 14-6 3-6-3Z"/><path d="m9 6 5 6 5 1 7 10M16 8l-5 7 3 2 5-4M10 21l7 6m-4-9 8 7"/></>,play:<><circle cx="16" cy="16" r="13"/><path d="m13 10 9 6-9 6Z"/></>,bottles:<><path d="M4 14h7v16H4zM6 10h3v4M19 11h10v19H19zM22 5h4v6M20 5h10M12 20h5v10h-5z"/></>,calendar:<><rect x="4" y="7" width="24" height="22" rx="3"/><path d="M4 14h24M10 3v8m12-8v8M10 20h3m6 0h3m-12 5h3"/></>,pin:<><path d="M26 12c0 8-10 18-10 18S6 20 6 12a10 10 0 1 1 20 0Z"/><circle cx="16" cy="12" r="3"/></>,phone:<path d="m10 3-6 3c-1 10 12 23 22 22l3-6-7-4-3 3c-5-2-7-4-9-9l3-3Z"/>};
 return <svg viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...props}>{paths[kind]}</svg>;
}

export function InvitationHighlights(){
 const [opened,setOpened]=useState(false);
 return <section className="invitation-section" id="invitation">
  <div className="invitation-heading" data-reveal><span className="section-label">VOTRE INVITATION PRIVILÉGIÉE</span><h2>Un rendez-vous.<br/><em>Trois belles raisons de venir.</em></h2><p>Promoteurs et promotrices de salons, Carimo vous réserve une découverte qui se prolonge au-delà de l’atelier.</p></div>
  <div className="invitation-highlights">
   <article className={`invitation-card gift-card ${opened?'gift-open':''}`} data-reveal><div className="card-eyebrow"><InvitationIcon kind="gift"/><span>UNE ATTENTION POUR VOUS</span><b>01</b></div><button className="gift-stage" aria-pressed={opened} aria-label={opened?'Refermer le coffret':'Ouvrir le coffret'} onClick={()=>setOpened(!opened)}><span className="gift-aura"/><span className="gift-spark s1">✦</span><span className="gift-spark s2">✧</span><span className="gift-spark s3">✦</span><span className="gift-box"><span className="gift-body"><span>CARIMO</span></span><span className="gift-light"/><span className="gift-lid"><i/><b/></span></span><span className="gift-interaction">{opened?'Refermer le coffret':'Ouvrir le coffret'} <span>↗</span></span></button><span className="benefit-tag">OFFERT À CHAQUE SALON PRÉSENT</span><h3>Votre kit<br/><em>découverte offert.</em></h3><p>Une attention Carimo remise à chaque salon présent à l’atelier.</p></article>
   <article className="invitation-card places-card" data-reveal><div className="card-eyebrow"><InvitationIcon kind="people"/><span>UNE RENCONTRE EN PETIT COMITÉ</span><b>02</b></div><div className="places-visual" aria-label="Capacité totale : 10 salons"><div className="places-orbit"/><strong>10</strong><span>SALONS SEULEMENT</span><div className="salon-seats" aria-hidden="true">{Array.from({length:10},(_,i)=><i key={i} style={{'--seat-delay':`${i*.13}s`}}><svg viewBox="0 0 20 25"><circle cx="10" cy="6" r="4"/><path d="M3 24v-7a7 7 0 0 1 14 0v7"/></svg></i>)}</div></div><span className="benefit-tag">PLACES LIMITÉES</span><h3>Une place pour<br/><em>votre salon.</em></h3><p>Un format privilégié pour échanger avec nos équipes. Confirmez votre présence avant le <strong>19 octobre 2026.</strong></p><a href="#salons" className="card-link">Consulter mon invitation <span>↗</span></a></article>
   <article className="invitation-card partnership-card" data-reveal><div className="card-eyebrow"><InvitationIcon kind="link"/><span>GRANDIR ENSEMBLE</span><b>03</b></div><div className="partnership-visual" aria-hidden="true"><div className="partner-node salon-node"><InvitationIcon kind="people"/><span>VOTRE SALON</span></div><div className="partner-bridge"><i/><i/><i/></div><div className="partner-node carimo-node"><img src="/assets/carimo.png" alt=""/></div></div><span className="benefit-tag">AUCUN ACHAT DE STOCK AU DÉPART</span><h3>Un partenariat.<br/><em>Un accompagnement.</em></h3><p>Découvrez une collaboration avec Carimo et l’accompagnement de nos équipes pour votre salon.</p><a href="#programme" className="card-link">Découvrir le programme <span>↗</span></a></article>
  </div>
 </section>;
}
