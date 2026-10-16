'use client';
import {useEffect,useRef,useState} from 'react';
import {products} from './products';
import {createProductModels} from './ProductModels';

export default function ProductScene({mode='hero',selected=0,reduced=false,onReady}){
 const mount=useRef(null),selection=useRef(selected),motion=useRef(reduced),[error,setError]=useState(false),[ready,setReady]=useState(false);
 useEffect(()=>{selection.current=selected},[selected]);useEffect(()=>{motion.current=reduced},[reduced]);
 useEffect(()=>{
  let disposed=false,renderer,frame,resizeObserver,cleanup=()=>{};
  (async()=>{try{
   const THREE=await import('three');const {RoomEnvironment}=await import('three/addons/environments/RoomEnvironment.js');if(disposed)return;
   const host=mount.current,scene=new THREE.Scene(),camera=new THREE.PerspectiveCamera(33,1,.1,100);camera.position.set(0,.5,10.5);
   renderer=new THREE.WebGLRenderer({alpha:true,antialias:true,powerPreference:'high-performance'});renderer.setPixelRatio(Math.min(devicePixelRatio,1.7));renderer.setClearColor(0,0);renderer.toneMapping=THREE.ACESFilmicToneMapping;renderer.toneMappingExposure=1.05;renderer.outputColorSpace=THREE.SRGBColorSpace;host.appendChild(renderer.domElement);
   const pmrem=new THREE.PMREMGenerator(renderer),room=new RoomEnvironment(),env=pmrem.fromScene(room,.04);scene.environment=env.texture;room.dispose();pmrem.dispose();
   scene.add(new THREE.HemisphereLight(0xfff7df,0x33271a,1.4));const key=new THREE.DirectionalLight(0xfff5dd,3);key.position.set(-3,5,5);scene.add(key);const rim=new THREE.DirectionalLight(0xffffff,3);rim.position.set(4,2,-2);scene.add(rim);
   const {groups,textures,gold}=createProductModels(THREE,renderer,products);
   const root=new THREE.Group();scene.add(root);
   if(mode==='hero'){
    [0,2,5].forEach((idx,i)=>{const pivot=new THREE.Group();pivot.add(groups[idx]);root.add(pivot);pivot.position.set((i-1)*1.45,i===1?-.24:.12,i===1?.65:0);pivot.rotation.set(i===1?1.16:.04,i===0?.12:i===2?-.16:0,i===0?-.10:i===2?.10:-.18);if(i===1){groups[idx].scale.setScalar(1.12)}pivot.userData.base=pivot.position.y;pivot.userData.index=i});root.rotation.y=-.08;
   }else{groups.forEach((g,i)=>{g.visible=i===selection.current;root.add(g)});root.scale.setScalar(1.35)}
   // A fine metallic orbit gives the composition a sculptural depth.
   const orbit=new THREE.Mesh(new THREE.TorusGeometry(mode==='hero'?3.15:2.1,.006,8,160),gold);orbit.rotation.set(1.14,.18,-.2);orbit.position.y=-.4;scene.add(orbit);
   const pointer={x:0,y:0},drag={active:false,x:0,rotation:0},clock=new THREE.Clock();let inView=true,last=0;
   function pointerMove(e){const r=host.getBoundingClientRect();pointer.x=(e.clientX-r.left)/r.width-.5;pointer.y=(e.clientY-r.top)/r.height-.5;if(drag.active){drag.rotation+=(e.clientX-drag.x)*.008;drag.x=e.clientX}}
   function pointerDown(e){drag.active=true;drag.x=e.clientX;host.setPointerCapture?.(e.pointerId)}function pointerUp(){drag.active=false}function leave(){pointer.x=pointer.y=0;drag.active=false}
   host.addEventListener('pointermove',pointerMove);host.addEventListener('pointerdown',pointerDown);host.addEventListener('pointerup',pointerUp);host.addEventListener('pointerleave',leave);
   function resize(){const r=host.getBoundingClientRect();renderer.setSize(r.width,r.height);camera.aspect=r.width/r.height;camera.position.z=mode==='hero'?(r.width<600?11.4:9.5):8.5;camera.updateProjectionMatrix()}resizeObserver=new ResizeObserver(resize);resizeObserver.observe(host);resize();
   const visibility=new IntersectionObserver(([entry])=>inView=entry.isIntersecting,{rootMargin:'100px'});visibility.observe(host);
   function animate(ms){frame=requestAnimationFrame(animate);if(!inView||document.hidden||ms-last<25)return;last=ms;const t=clock.getElapsedTime(),r=host.getBoundingClientRect(),progress=Math.max(0,Math.min(1,-r.top/innerHeight));
    root.rotation.y+=((motion.current?0:pointer.x*.24+drag.rotation+progress*.7)-root.rotation.y)*.045;root.rotation.x+=((motion.current?0:pointer.y*.09)-root.rotation.x)*.04;
    if(mode==='hero'){root.children.forEach(g=>{g.position.y=g.userData.base+(motion.current?0:Math.sin(t*.7+g.userData.index*1.9)*.09);g.rotation.y=motion.current?0:Math.sin(t*.3+g.userData.index)*.08})}else{groups.forEach((g,i)=>{g.visible=i===selection.current;if(g.visible){g.rotation.y=motion.current?0:Math.sin(t*.45)*.12;g.rotation.x=g.userData.jar?1.05:0;g.position.y=g.userData.center+(motion.current?0:Math.sin(t*.8)*.07)}})}
    orbit.rotation.z=motion.current?-.2:-.2+Math.sin(t*.22)*.14;renderer.render(scene,camera)
   }frame=requestAnimationFrame(animate);setReady(true);onReady?.();
   cleanup=()=>{visibility.disconnect();host.removeEventListener('pointermove',pointerMove);host.removeEventListener('pointerdown',pointerDown);host.removeEventListener('pointerup',pointerUp);host.removeEventListener('pointerleave',leave);scene.traverse(o=>{o.geometry?.dispose();if(o.material){(Array.isArray(o.material)?o.material:[o.material]).forEach(m=>m.dispose())}});textures.forEach(t=>t.dispose());env.dispose();renderer.dispose();renderer.domElement.remove()};
  }catch(e){if(!disposed){console.error('Scene 3D unavailable:',e);setError(true);onReady?.()}}})();
  return()=>{disposed=true;cancelAnimationFrame(frame);resizeObserver?.disconnect();cleanup()};
 },[mode]);
 return <div className={`product-scene ${ready?'is-ready':''}`} ref={mount} role="img" aria-label={mode==='hero'?'Composition 3D des flacons et du masque Silky Carimo':`Modèle 3D : ${products[selected].name}`}>
  {!ready&&!error&&<div className="scene-loading"><span/>Mise en lumière…</div>}
  {error&&<img className="scene-fallback" src="/assets/collection.jpg" alt="Collection Carimo Silky"/>}
 </div>
}
