'use client';
import {useEffect,useRef,useState} from 'react';
import {products} from './products';

export default function ProductScene({mode='hero',selected=0,reduced=false,onReady}){
 const mount=useRef(null),selection=useRef(selected),motion=useRef(reduced),[error,setError]=useState(false),[ready,setReady]=useState(false);
 useEffect(()=>{selection.current=selected},[selected]);useEffect(()=>{motion.current=reduced},[reduced]);
 useEffect(()=>{
  let disposed=false,renderer,frame,resizeObserver,cleanup=()=>{};
  (async()=>{try{
   const THREE=await import('three');const {RoomEnvironment}=await import('three/addons/environments/RoomEnvironment.js');if(disposed)return;
   const host=mount.current,scene=new THREE.Scene(),camera=new THREE.PerspectiveCamera(33,1,.1,100);camera.position.set(0,.5,10.5);
   renderer=new THREE.WebGLRenderer({alpha:true,antialias:true,powerPreference:'high-performance'});renderer.setPixelRatio(Math.min(devicePixelRatio,1.7));renderer.setClearColor(0,0);renderer.toneMapping=THREE.ACESFilmicToneMapping;renderer.toneMappingExposure=1.35;renderer.outputColorSpace=THREE.SRGBColorSpace;host.appendChild(renderer.domElement);
   const pmrem=new THREE.PMREMGenerator(renderer),room=new RoomEnvironment(),env=pmrem.fromScene(room,.04);scene.environment=env.texture;room.dispose();pmrem.dispose();
   scene.add(new THREE.HemisphereLight(0xfff7df,0x33271a,3));const key=new THREE.DirectionalLight(0xfff5dd,5);key.position.set(-3,5,5);scene.add(key);const rim=new THREE.DirectionalLight(0xffffff,4);rim.position.set(4,2,-2);scene.add(rim);
   const gold=new THREE.MeshStandardMaterial({color:0xd6b46b,metalness:.94,roughness:.24});const black=new THREE.MeshPhysicalMaterial({color:0x11110f,metalness:.25,roughness:.23,clearcoat:1});const amber=new THREE.MeshPhysicalMaterial({color:0x30160f,metalness:.16,roughness:.22,clearcoat:1,clearcoatRoughness:.12});
   const textures=[];const loader=new THREE.TextureLoader();
   function label(product){const canvas=document.createElement('canvas');canvas.width=1024;canvas.height=1024;const c=canvas.getContext('2d');c.fillStyle='#11120f';c.fillRect(0,0,1024,1024);c.fillStyle='#dbbf78';c.fillRect(0,0,1024,205);c.fillRect(0,975,1024,49);c.textAlign='center';c.fillStyle='#14140e';c.font='68px Georgia';c.fillText('CARIMO',512,132);c.fillStyle='#e7cc88';c.font='italic 65px Georgia';c.fillText('Silky',512,365);c.font='51px Georgia';c.fillText('ARGAN OIL',512,465);c.fillStyle='#e9e4d7';c.font='21px Arial';c.fillText(product.english,512,560);c.strokeStyle='#b89b5d';c.beginPath();c.moveTo(275,620);c.lineTo(749,620);c.stroke();c.font='24px Georgia';c.fillText('LE RITUEL DU SOIN',512,710);c.fillStyle='#b89b5d';c.font='18px Arial';c.fillText('CARIMO EMPIRE',512,855);const tex=new THREE.CanvasTexture(canvas);tex.colorSpace=THREE.SRGBColorSpace;tex.anisotropy=renderer.capabilities.getMaxAnisotropy();textures.push(tex);return new THREE.MeshStandardMaterial({map:tex,roughness:.4,metalness:.22})}
   function cylinder(radius,height,material,y,parent,r2=radius){const mesh=new THREE.Mesh(new THREE.CylinderGeometry(radius,r2,height,64),material);mesh.position.y=y;parent.add(mesh);return mesh}
   function bottle(product){const g=new THREE.Group();const jar=product.type==='jar',oil=product.type==='oil';const r=jar?.73:oil?.36:.48;const h=jar?1.05:oil?1.75:2.3;
    const profile=jar?[[0,0],[r*.9,0],[r,.08],[r,h-.12],[r*.93,h],[0,h]]:[[0,0],[r*.85,0],[r,.08],[r,h*.73],[r*.97,h*.83],[r*.8,h*.92],[r*.5,h],[r*.43,h+.08],[0,h+.08]];
    const body=new THREE.Mesh(new THREE.LatheGeometry(profile.map(p=>new THREE.Vector2(...p)),80),amber);g.add(body);
    cylinder(r+.005,.055,gold,.12,g);cylinder(r+.005,.055,gold,jar?h-.16:.34,g);
    // Partial cylinder: the label follows the curvature of the bottle and faces the camera.
    const labelHeight=jar?.65:oil?.93:1.35;const wrap=new THREE.Mesh(new THREE.CylinderGeometry(r+.008,r+.008,labelHeight,64,1,true,-1.32,2.64),label(product));wrap.position.y=jar?.5:oil?.75:1.12;g.add(wrap);
    if(jar){cylinder(r*1.03,.21,black,h,g);cylinder(r*1.035,.045,gold,h-.1,g);const lid=new THREE.Mesh(new THREE.CircleGeometry(r*.8,64),gold);lid.rotation.x=-Math.PI/2;lid.position.y=h+.108;g.add(lid)}else{cylinder(r*.49,.28,black,h+.17,g);cylinder(r*.51,.045,gold,h+.065,g);if(oil){cylinder(r*.48,.42,black,h+.47,g);cylinder(r*.18,.08,gold,h+.72,g)}else{cylinder(.12,.24,black,h+.42,g);const pump=new THREE.Mesh(new THREE.BoxGeometry(.66,.12,.22),black);pump.position.set(-.15,h+.58,0);g.add(pump)}}
    g.position.y=-(h+.6)/2;return g;
   }
   const root=new THREE.Group();scene.add(root);const groups=products.map(bottle);
   if(mode==='hero'){
    [0,2,5].forEach((idx,i)=>{const pivot=new THREE.Group();pivot.add(groups[idx]);root.add(pivot);pivot.position.set((i-1)*1.52,i===1?-.54:.2,i===1?.8:0);pivot.rotation.set(i===1?.08:.06,i===0?.18:i===2?-.22:0,i===0?-.13:i===2?.13:-.13);pivot.userData.base=pivot.position.y;pivot.userData.index=i});root.rotation.y=-.08;
   }else{groups.forEach((g,i)=>{g.visible=i===selection.current;root.add(g)});root.scale.setScalar(1.35)}
   // A fine metallic orbit gives the composition a sculptural depth.
   const orbit=new THREE.Mesh(new THREE.TorusGeometry(mode==='hero'?3.15:2.1,.006,8,160),gold);orbit.rotation.set(1.14,.18,-.2);orbit.position.y=-.4;scene.add(orbit);
   const pointer={x:0,y:0},drag={active:false,x:0,rotation:0},clock=new THREE.Clock();let inView=true,last=0;
   function pointerMove(e){const r=host.getBoundingClientRect();pointer.x=(e.clientX-r.left)/r.width-.5;pointer.y=(e.clientY-r.top)/r.height-.5;if(drag.active){drag.rotation+=(e.clientX-drag.x)*.008;drag.x=e.clientX}}
   function pointerDown(e){drag.active=true;drag.x=e.clientX;host.setPointerCapture?.(e.pointerId)}function pointerUp(){drag.active=false}function leave(){pointer.x=pointer.y=0;drag.active=false}
   host.addEventListener('pointermove',pointerMove);host.addEventListener('pointerdown',pointerDown);host.addEventListener('pointerup',pointerUp);host.addEventListener('pointerleave',leave);
   function resize(){const r=host.getBoundingClientRect();renderer.setSize(r.width,r.height);camera.aspect=r.width/r.height;camera.position.z=mode==='hero'?(r.width<600?12.2:10.3):8.5;camera.updateProjectionMatrix()}resizeObserver=new ResizeObserver(resize);resizeObserver.observe(host);resize();
   const visibility=new IntersectionObserver(([entry])=>inView=entry.isIntersecting,{rootMargin:'100px'});visibility.observe(host);
   function animate(ms){frame=requestAnimationFrame(animate);if(!inView||document.hidden||ms-last<25)return;last=ms;const t=clock.getElapsedTime(),r=host.getBoundingClientRect(),progress=Math.max(0,Math.min(1,-r.top/innerHeight));
    root.rotation.y+=((motion.current?0:pointer.x*.24+drag.rotation+progress*.7)-root.rotation.y)*.045;root.rotation.x+=((motion.current?0:pointer.y*.09)-root.rotation.x)*.04;
    if(mode==='hero'){root.children.forEach(g=>{g.position.y=g.userData.base+(motion.current?0:Math.sin(t*.7+g.userData.index*1.9)*.09);g.rotation.y=motion.current?0:Math.sin(t*.3+g.userData.index)*.08})}else{groups.forEach((g,i)=>{g.visible=i===selection.current;if(g.visible){g.rotation.y=motion.current?0:Math.sin(t*.45)*.12;g.position.y=-(products[i].type==='jar'?1.65:products[i].type==='oil'?2.35:2.9)/2+(motion.current?0:Math.sin(t*.8)*.07)}})}
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
