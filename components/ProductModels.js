// Sculpted packaging and print artwork, built locally without external assets.
export function createProductModels(THREE, renderer, products) {
 const textures=[];
 const gold=new THREE.MeshStandardMaterial({color:0xcba24b,metalness:.88,roughness:.28});
 const black=new THREE.MeshPhysicalMaterial({color:0x080909,metalness:.35,roughness:.19,clearcoat:1,clearcoatRoughness:.12});
 const amber=new THREE.MeshPhysicalMaterial({color:0x29120c,metalness:.12,roughness:.25,clearcoat:1,clearcoatRoughness:.13});
 const ribMaterial=new THREE.MeshStandardMaterial({color:0x151617,metalness:.35,roughness:.32});
 function artwork(product,lid=false){
  const canvas=document.createElement('canvas');canvas.width=1024;canvas.height=1024;const c=canvas.getContext('2d');
  c.fillStyle='#090b0b';c.fillRect(0,0,1024,1024);
  const foil=c.createLinearGradient(0,0,1024,100);foil.addColorStop(0,'#806021');foil.addColorStop(.25,'#e3bd65');foil.addColorStop(.48,'#f6dc91');foil.addColorStop(.7,'#b18a34');foil.addColorStop(1,'#e4c06e');
  c.fillStyle=foil;c.fillRect(0,0,1024,210);c.fillRect(0,930,1024,94);
  for(let i=0;i<210;i+=3){c.fillStyle=i%2?'#fff3b408':'#3c210b12';c.fillRect(0,i,1024,1)}
  c.textAlign='center';c.fillStyle='#16130c';c.font='100px Georgia';c.fillText('CARIMO',512,147);
  // Fine curved strands evoke the glossy hair motif on the supplied packaging.
  c.save();c.beginPath();c.ellipse(370,498,228,227,-.18,0,Math.PI*2);c.clip();c.fillStyle='#050607';c.fillRect(100,250,550,550);
  for(let i=0;i<340;i++){const x=126+i*1.5;const shine=Math.pow(Math.max(0,Math.sin(i*.019)),6);const v=Math.round(30+shine*150);c.strokeStyle=`rgba(${v},${v+2},${v+4},.75)`;c.lineWidth=.8+i%3*.3;c.beginPath();c.moveTo(x,720);c.bezierCurveTo(x-125,400,x+75,210,x+200,420);c.stroke()}
  c.restore();
  c.strokeStyle='#bba052';c.lineWidth=4;c.beginPath();c.ellipse(785,414,103,120,.2,0,Math.PI*2);c.stroke();
  for(let i=0;i<7;i++){const angle=-1.5+i*.49;c.save();c.translate(780,438);c.rotate(angle);const g=c.createLinearGradient(0,0,0,-110);g.addColorStop(0,'#645017');g.addColorStop(.6,i%2?'#b8a83d':'#e4bb60');g.addColorStop(1,'#eed98f');c.fillStyle=g;c.beginPath();c.ellipse(0,-48,15,52,.25,0,Math.PI*2);c.fill();c.restore()}
  c.fillStyle='#ae783b';c.beginPath();c.ellipse(790,465,24,35,.8,0,Math.PI*2);c.fill();
  c.fillStyle='#d6bd78';c.textAlign='left';c.font='22px Arial';c.fillText('CARIMO SILKY',168,678);c.font='bold 61px Arial';c.fillText('ARGAN OIL',166,740);c.font='25px Arial';c.fillText(product.english,168,785);c.font='22px Arial';c.fillText(product.name.toUpperCase(),168,819);c.fillStyle='#b9a979';c.font='19px Arial';c.fillText('POUR CHEVEUX NATURELS ET DÉFRISÉS',168,873);
  c.fillStyle='#1b180f';c.textAlign='center';c.font='18px Arial';c.fillText('LE RITUEL CAPILLAIRE • CARIMO EMPIRE',512,980);
  const texture=new THREE.CanvasTexture(canvas);texture.colorSpace=THREE.SRGBColorSpace;texture.anisotropy=Math.min(8,renderer.capabilities.getMaxAnisotropy());textures.push(texture);
  return new THREE.MeshPhysicalMaterial({map:texture,roughness:.34,metalness:.32,clearcoat:.5,side:THREE.FrontSide});
 }
 function lathe(points,mat,parent){const curve=new THREE.SplineCurve(points.map(p=>new THREE.Vector2(...p)));const mesh=new THREE.Mesh(new THREE.LatheGeometry(curve.getPoints(100),112),mat);parent.add(mesh);return mesh}
 function cylinder(r,h,mat,y,parent){const m=new THREE.Mesh(new THREE.CylinderGeometry(r,r,h,96),mat);m.position.y=y;parent.add(m);return m}
 function ring(r,y,parent,thickness=.012){const m=new THREE.Mesh(new THREE.TorusGeometry(r,thickness,8,96),gold);m.rotation.x=Math.PI/2;m.position.y=y;parent.add(m)}
 function ribs(r,y,h,parent){const geo=new THREE.BoxGeometry(.012,h,.012);const inst=new THREE.InstancedMesh(geo,ribMaterial,72);const dummy=new THREE.Object3D();for(let i=0;i<72;i++){const a=i/72*Math.PI*2;dummy.position.set(Math.sin(a)*r,y,Math.cos(a)*r);dummy.rotation.y=a;dummy.updateMatrix();inst.setMatrixAt(i,dummy.matrix)}parent.add(inst)}
 const groups=products.map(p=>{
  const g=new THREE.Group(),jar=p.type==='jar',oil=p.type==='oil';let total;
  if(jar){
   const r=.86;total=.69;
   lathe([[0,0],[.7,0],[.8,.025],[.83,.09],[.83,.42],[.81,.46],[0,.46]],black,g);
   cylinder(.848,.11,gold,.45,g);ring(.844,.39,g,.009);
   lathe([[0,.48],[.83,.48],[.88,.5],[.89,.55],[.89,.65],[.85,.69],[0,.69]],black,g);
   ribs(.886,.57,.085,g);ring(.88,.51,g);ring(.852,.675,g,.009);
   const lid=new THREE.Mesh(new THREE.CircleGeometry(.833,112),artwork(p,true));lid.rotation.x=-Math.PI/2;lid.position.y=.696;g.add(lid);
   const label=new THREE.Mesh(new THREE.CylinderGeometry(.834,.834,.25,96,1,true,-1.45,2.9),artwork(p));label.position.y=.24;g.add(label);
  }else{
   const r=oil?.34:.49,h=oil?1.76:2.45;total=oil?2.75:3.24;
   lathe([[0,0],[r*.7,0],[r*.94,.025],[r,.1],[r,.25],[r,h*.76],[r*.99,h*.82],[r*.92,h*.88],[r*.72,h*.94],[r*.48,h],[r*.47,h+.09],[0,h+.09]],oil?black:amber,g);
   const labelHeight=oil?1.48:1.7,y=oil?.88:1.16;
   const label=new THREE.Mesh(new THREE.CylinderGeometry(r+.004,r+.004,labelHeight,112,1,true,-1.48,2.96),artwork(p));label.position.y=y;g.add(label);
   ring(r+.003,y-labelHeight/2+.013,g,.006);ring(r+.003,y+labelHeight/2-.013,g,.006);
   if(oil){
    cylinder(.343,.09,gold,1.72,g);lathe([[0,1.76],[.32,1.76],[.345,1.8],[.345,2.66],[.33,2.72],[0,2.73]],black,g);ring(.34,1.79,g,.007);
    cylinder(.31,.009,black,2.733,g);
   }else{
    cylinder(.245,.3,black,h+.15,g);ribs(.247,h+.15,.265,g);ring(.24,h+.025,g,.005);
    cylinder(.102,.26,black,h+.42,g);cylinder(.117,.04,black,h+.51,g);
    const shape=new THREE.Shape();shape.moveTo(-.51,-.02);shape.bezierCurveTo(-.5,.05,-.24,.10,.08,.10);shape.bezierCurveTo(.2,.10,.23,.04,.23,-.04);shape.lineTo(-.39,-.04);shape.lineTo(-.48,-.10);shape.lineTo(-.54,-.07);shape.closePath();
    const head=new THREE.Mesh(new THREE.ExtrudeGeometry(shape,{depth:.18,bevelEnabled:true,bevelSegments:4,steps:1,bevelSize:.025,bevelThickness:.025,curveSegments:24}),black);head.position.set(0,h+.64,-.09);g.add(head);
    const opening=new THREE.Mesh(new THREE.CircleGeometry(.033,24),new THREE.MeshBasicMaterial({color:0x000000}));opening.rotation.y=-Math.PI/2;opening.position.set(-.55,h+.59,0);g.add(opening);
   }
  }
  g.position.y=-total/2;g.userData.center=-total/2;g.userData.jar=jar;return g;
 });
 return {groups,textures,gold};
}
