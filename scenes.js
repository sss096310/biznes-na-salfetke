(function(){
  const T = window.THREE;
  const M = (c,o={})=>new T.MeshStandardMaterial({color:c,roughness:o.r??.6,metalness:o.m??0,emissive:o.e??0x000000,emissiveIntensity:o.ei??1,side:o.s??T.FrontSide,map:o.map||null});
  const add=(g,geo,mat,x=0,y=0,z=0,cast=true)=>{const m=new T.Mesh(geo,mat);m.position.set(x,y,z);m.castShadow=cast;m.receiveShadow=true;g.add(m);return m};
  function cv(w,h,f){const c=document.createElement('canvas');c.width=w;c.height=h;f(c.getContext('2d'),w,h);const t=new T.CanvasTexture(c);t.encoding=T.sRGBEncoding;t.anisotropy=8;return t}
  const noise=(x,w,h,n,a,col)=>{for(let i=0;i<n;i++){x.fillStyle=col(Math.random());x.globalAlpha=a;x.fillRect(Math.random()*w,Math.random()*h,2,2)}x.globalAlpha=1};

  function armchair(g,x,z,ry,col){
    const c=new T.Group(),m=M(col,{r:.55}),leg=M(0x161616,{m:.6,r:.3});
    add(c,new T.BoxGeometry(.9,.22,.82),m,0,.36,0);
    add(c,new T.BoxGeometry(.66,.12,.7),M(col,{r:.7}),0,.53,.04);
    const b=add(c,new T.BoxGeometry(.9,.62,.16),m,0,.72,-.36);b.rotation.x=-.18;
    add(c,new T.BoxGeometry(.13,.36,.82),m,-.39,.55,0);add(c,new T.BoxGeometry(.13,.36,.82),m,.39,.55,0);
    [[-.38,-.34],[.38,-.34],[-.38,.34],[.38,.34]].forEach(([a,bb])=>add(c,new T.CylinderGeometry(.02,.015,.25,8),leg,a,.125,bb));
    c.position.set(x,0,z);c.rotation.y=ry;g.add(c);return c;
  }
  function coffee(g,top=0x1b1714){
    add(g,new T.CylinderGeometry(.55,.55,.05,64),M(top,{r:.25,m:.1}),0,.4,0);
    add(g,new T.CylinderGeometry(.42,.48,.38,48),M(0x14110f,{r:.5}),0,.19,0);
    const brass=M(0xc9a35a,{m:1,r:.28});
    add(g,new T.BoxGeometry(.22,.07,.09),brass,.1,.46,.04);
    for(let i=0;i<3;i++){const n=add(g,new T.BoxGeometry(.18,.16,.004),M(0xffffff,{r:.9}),.1,.54,.025+i*.013);n.rotation.x=-.1+i*.1}
    add(g,new T.BoxGeometry(.2,.004,.2),M(0xffffff,{r:.9}),-.24,.43,-.08).rotation.y=.4;
    add(g,new T.CylinderGeometry(.006,.006,.15,8),M(0x111111),-.18,.437,.1).rotation.z=Math.PI/2;
  }
  // chairs face the camera side (+z): left and right turn toward each other and the lens, third sits at the back facing the lens
  function seats(g,col){
    const L=armchair(g,-1.35,.35,Math.PI/2-.42,col),R=armchair(g,1.35,.35,-Math.PI/2+.42,col),B=armchair(g,0,-1.15,0,col);
    return {third(on){B.visible=on}};
  }
  function cams(g,a){
    [['A',[0,1.35,6.6]],['B',[-3.2,1.3,2.6]],['C',[3.2,1.3,2.6]],['D',[0,4.9,.4]],['E',[2.2,1.15,4.6]]].forEach(([l,p])=>{
      const pos=new T.Vector3(...p);const m=new T.Mesh(new T.ConeGeometry(.12,.28,4),new T.MeshBasicMaterial({color:0x7fb2ff,toneMapped:false}));
      m.position.copy(pos);m.lookAt(0,.8,0);m.rotateX(-Math.PI/2);g.add(m);m.userData.cam=true;
      a.push({p:pos.clone().add(new T.Vector3(0,.32,0)),t:l,cam:true,obj:m});
    });
  }

  function tex(kind){
    if(kind==='carpet')return cv(1024,1024,(x,w,h)=>{x.fillStyle='#e98fb3';x.fillRect(0,0,w,h);noise(x,w,h,90000,.5,r=>r>.5?'#f7b6cf':'#c9668f')});
    if(kind==='asphalt')return cv(1024,1024,(x,w,h)=>{x.fillStyle='#2d2d30';x.fillRect(0,0,w,h);noise(x,w,h,120000,.6,r=>r>.5?'#47474b':'#1c1c1e');
      x.fillStyle='#f2f1ec';for(let i=0;i<7;i++)x.fillRect(90+i*130,492,80,40);for(let i=0;i<8;i++){x.fillRect(150+i*26,300,14,150);x.fillRect(150+i*26,574,14,150)}
      x.fillStyle='#e7c64a';x.fillRect(0,200,1024,8);x.fillRect(0,816,1024,8)});
    if(kind==='oak')return cv(1024,1024,(x,w,h)=>{for(let i=0;i<16;i++){const b=120+Math.random()*30;x.fillStyle=`rgb(${b|0},${b*.66|0},${b*.38|0})`;x.fillRect(0,i*64,w,64);x.fillStyle='rgba(30,18,10,.6)';x.fillRect(0,i*64,w,3)}noise(x,w,h,40000,.25,r=>r>.5?'#9b6b45':'#4a2e18')});
    if(kind==='board')return cv(1024,1024,(x,w,h)=>{x.fillStyle='#0f4a37';x.fillRect(0,0,w,h);x.strokeStyle='#d9b45f';x.lineWidth=5;
      for(let i=0;i<60;i++){x.beginPath();let px=Math.random()*w,py=Math.random()*h;x.moveTo(px,py);for(let k=0;k<4;k++){if(k%2)px+=(Math.random()-.5)*400;else py+=(Math.random()-.5)*400;x.lineTo(px,py)}x.stroke();x.fillStyle='#d9b45f';x.beginPath();x.arc(px,py,9,0,7);x.fill()}
      x.fillStyle='#1b1b1d';for(let i=0;i<9;i++)x.fillRect(Math.random()*900,Math.random()*900,90+Math.random()*60,60+Math.random()*40)});
    if(kind==='powder')return cv(2048,2048,(x,w,h)=>{const g=x.createRadialGradient(w/2,h/2,0,w/2,h/2,w/2);g.addColorStop(0,'#f0cdb8');g.addColorStop(1,'#d9a98f');x.fillStyle=g;x.fillRect(0,0,w,h);
      noise(x,w,h,60000,1,r=>r>.5?'rgba(255,240,230,.25)':'rgba(170,110,90,.18)');
      x.strokeStyle='rgba(150,95,75,.35)';x.lineWidth=6;for(let r0=160;r0<1000;r0+=120){x.beginPath();x.arc(w/2,h/2,r0,0,7);x.stroke()}
      x.save();x.translate(w/2,h/2);x.font='400 112px "Tenor Sans", Arial, sans-serif';x.textAlign='center';x.textBaseline='middle';x.fillStyle='rgba(140,85,65,.62)';x.strokeStyle='rgba(140,85,65,.62)';x.lineWidth=4;
      const txt='БИЗНЕС НА САЛФЕТКЕ  ·  БИЗНЕС НА САЛФЕТКЕ  ·  ';const R0=860,step=(Math.PI*2)/txt.length;for(const ch of txt){x.save();x.rotate(0);x.translate(0,-R0);x.fillText(ch,0,0);x.strokeText(ch,0,0);x.restore();x.rotate(step)}x.restore();
      x.strokeStyle='rgba(150,95,75,.5)';x.lineWidth=10;x.beginPath();x.arc(w/2,h/2,960,0,7);x.stroke();x.beginPath();x.arc(w/2,h/2,800,0,7);x.stroke()});
  }

  function ring(scene,anch){
    scene.add(new T.AmbientLight(0xffffff,.07));
    const floor=add(scene,new T.PlaneGeometry(40,40),M(0x0c0c0e,{r:.18,m:.6}),0,0,0,false);floor.rotation.x=-Math.PI/2;
    const podTop=new T.MeshStandardMaterial({roughness:1}),rim=M(0x161618,{r:.4});
    const pod=new T.Mesh(new T.CylinderGeometry(2.8,2.85,.18,128),[rim,podTop,rim]);pod.position.y=.09;pod.receiveShadow=true;scene.add(pod);
    const lip=new T.Mesh(new T.TorusGeometry(2.8,.05,16,160),rim);lip.rotation.x=Math.PI/2;lip.position.y=.18;scene.add(lip);
    const g=new T.Group();g.position.y=.18;scene.add(g);
    const st=seats(g,0x0b1238);coffee(g);
    const blueLine=new T.Mesh(new T.TorusGeometry(2.95,.025,12,200),new T.MeshBasicMaterial({color:0x4d6bff,toneMapped:false}));blueLine.rotation.x=Math.PI/2;blueLine.position.y=.01;scene.add(blueLine);
    const blueGlow=new T.Mesh(new T.RingGeometry(2.86,3.6,160),new T.MeshBasicMaterial({color:0x2a46d8,transparent:true,opacity:.09,blending:T.AdditiveBlending,depthWrite:false}));blueGlow.rotation.x=-Math.PI/2;blueGlow.position.y=.008;scene.add(blueGlow);
    const bb=new T.PointLight(0x2f4cff,.9,10,1.6);bb.position.set(0,1.2,-4.5);scene.add(bb);
    const ringMat=new T.MeshBasicMaterial({color:0xfff0dc});
    const rg=new T.Mesh(new T.TorusGeometry(2.1,.045,16,160),ringMat);rg.rotation.x=Math.PI/2;rg.position.y=3.5;scene.add(rg);
    const glowMat=new T.MeshBasicMaterial({color:0xffc98a,transparent:true,opacity:.2,blending:T.AdditiveBlending,depthWrite:false});
    const gl=new T.Mesh(new T.TorusGeometry(2.1,.18,16,160),glowMat);gl.rotation.x=Math.PI/2;gl.position.y=3.5;scene.add(gl);
    const coneMat=new T.MeshBasicMaterial({color:0xffd29a,transparent:true,opacity:.045,blending:T.AdditiveBlending,depthWrite:false,side:T.DoubleSide});
    add(scene,new T.CylinderGeometry(2.1,2.6,3.4,64,1,true),coneMat,0,1.8,0,false);
    const sp=new T.SpotLight(0xffe4c4,2.6,14,Math.PI/4,.55,1.1);sp.position.set(0,3.5,0);sp.target.position.set(0,0,0);sp.castShadow=true;sp.shadow.mapSize.set(1536,1536);scene.add(sp,sp.target);
    const fill=new T.SpotLight(0xffd8a8,.45,14,Math.PI/6,.7,1);fill.position.set(0,3,6);fill.target.position.set(0,.8,0);scene.add(fill,fill.target);
    anch.push({p:new T.Vector3(2.1,3.5,0),t:'1'},{p:new T.Vector3(-2.2,.2,1.6),t:'2'},{p:new T.Vector3(0,.66,.22),t:'3'},{p:new T.Vector3(-1.35,1.25,.35),t:'4'},{p:new T.Vector3(3.8,0,-1.4),t:'5'});
    cams(scene,anch);
    const kinds=['carpet','asphalt','oak','board','powder'],cache={};
    const rimCols=[0x0c1a66,0x0c1a66,0x0c1a66,0x0c1a66,0xd9a27e];
    function variant(i){const k=kinds[i];podTop.map=cache[k]||(cache[k]=tex(k));podTop.roughness=[1,.95,.45,.3,.95][i];podTop.metalness=i===3?.3:0;podTop.needsUpdate=true;
      rim.color.setHex(rimCols[i]);rim.metalness=i===4?1:0;rim.roughness=i===4?.25:.4;rim.needsUpdate=true}
    variant(0);
    let on=0;
    return {variant,third:st.third,tick(dt,reduce){if(on<1){on=Math.min(1,on+dt*.5);const k=reduce?1:on;ringMat.color.setRGB(k,k*.94,k*.86);glowMat.opacity=.2*k;sp.intensity=2.6*k;coneMat.opacity=.045*k}},settle(){on=1;ringMat.color.setRGB(1,.94,.86);glowMat.opacity=.2;sp.intensity=2.6;coneMat.opacity=.045}};
  }

  function pleatWall(scene,R,H,th0,len,n,a,mat){
    const geo=new T.CylinderGeometry(R,R,H,n*20,1,true,th0,len),p=geo.attributes.position;
    for(let i=0;i<p.count;i++){const x=p.getX(i),z=p.getZ(i);let th=Math.atan2(x,z);if(th<0)th+=Math.PI*2;
      const k=Math.abs(Math.sin((th-th0)/len*n*Math.PI));const rr=R-a+a*Math.pow(k,.55);p.setX(i,Math.sin(th)*rr);p.setZ(i,Math.cos(th)*rr)}
    geo.computeVertexNormals();const m=new T.Mesh(geo,mat);m.position.y=H/2;m.receiveShadow=true;scene.add(m);return m;
  }
  function panelTex(text,col){
    return cv(1024,1024,(x,w,h)=>{x.fillStyle='#faf6ee';x.fillRect(0,0,w,h);
      x.textAlign='center';x.textBaseline='middle';
      const big=text.length<=3;x.font=(big?'400 300px ':'400 118px ')+'"Tenor Sans", Arial, sans-serif';x.letterSpacing=big?'0px':'10px';
      const lines=text.split('\n');
      lines.forEach((ln,i)=>{const y=h/2+(i-(lines.length-1)/2)*(big?0:170);
        x.fillStyle='rgba(255,255,255,.9)';x.fillText(ln,w/2-3,y-3);x.fillStyle=col;x.strokeStyle=col;x.lineWidth=5;x.fillText(ln,w/2,y);x.strokeText(ln,w/2,y)});
      x.strokeStyle=col;x.globalAlpha=.5;x.lineWidth=4;x.strokeRect(60,60,w-120,h-120);x.globalAlpha=1});
  }
  function paper(scene,anch){
    scene.add(new T.AmbientLight(0xffffff,.2));
    const floor=add(scene,new T.PlaneGeometry(40,40),M(0xd6cdbd,{r:.95}),0,0,0,false);floor.rotation.x=-Math.PI/2;
    const wallMat=M(0xf7f2e8,{r:.95,e:0xffe3b0,ei:.32,s:T.DoubleSide});const white=new T.Color(0xf4efe6);
    const R=3.9,len=Math.PI*1.1,th0=Math.PI-len/2;
    pleatWall(scene,R,4.2,th0,len,34,.16,wallMat);
    const panelMat=new T.MeshStandardMaterial({roughness:.95,emissive:0xffffff,emissiveIntensity:.12});
    const panel=add(scene,new T.PlaneGeometry(1.5,1.5),panelMat,0,2.4,-R+.28,false);
    add(scene,new T.CylinderGeometry(2.1,2.1,.015,96),M(0xcdbfa6,{r:1}),0,.008,.15);
    const g=new T.Group();g.position.z=.15;scene.add(g);const st=seats(g,0x241d18);coffee(g);
    const back=new T.PointLight(0xffd9a0,1,10,1.2);back.position.set(0,2.4,-1);scene.add(back);
    const side=new T.SpotLight(0xffffff,.75,14,Math.PI/5,.7,1);side.position.set(-4,4,3);side.target.position.set(0,1.5,-3);side.castShadow=true;scene.add(side,side.target);
    const key=new T.SpotLight(0xffffff,.6,12,Math.PI/5,.6,1);key.position.set(0,4,2.5);key.target.position.set(0,.5,0);key.castShadow=true;key.shadow.mapSize.set(1536,1536);scene.add(key,key.target);
    anch.push({p:new T.Vector3(Math.sin(th0+len*.12)*R,3.4,Math.cos(th0+len*.12)*R),t:'1'},{p:new T.Vector3(Math.sin(th0+len*.86)*R,1.4,Math.cos(th0+len*.86)*R),t:'2'},{p:new T.Vector3(0,2.4,-R+.3),t:'3'},{p:new T.Vector3(-1.35,1.25,.5),t:'4'},{p:new T.Vector3(1.9,.02,2.3),t:'5'});
    cams(scene,anch);
    const V=[[0xf6e2c0,'БИЗНЕС\nНА\nСАЛФЕТКЕ','#b9a27a'],[0xf59ac0,'FRAMBINI','#c66a90'],[0xf0645a,'М.ВИДЕО','#c0443a'],[0xeeb7a6,'БИЗНЕС\nНА\nСАЛФЕТКЕ','#b9806c']];
    const cols=V.map(v=>new T.Color(v[0])),ptex=V.map(v=>null);
    let target=0,cur=cols[0].clone(),auto=true,timer=0,onV=null;
    function setPanel(i){panelMat.map=ptex[i]||(ptex[i]=panelTex(V[i][1],V[i][2]));panelMat.emissiveMap=panelMat.map;panelMat.needsUpdate=true}
    setPanel(0);
    const apply=c=>{wallMat.emissive.copy(c);wallMat.color.copy(white).lerp(c,.8);back.color.copy(c)};
    return {third:st.third,variant(i,user=true){target=i;setPanel(i);if(user)auto=false},onAuto(f){onV=f},
      tick(dt,reduce){if(auto&&!reduce){timer+=dt;if(timer>3.4){timer=0;target=(target+1)%cols.length;setPanel(target);onV&&onV(target)}}cur.lerp(cols[target],Math.min(1,dt*3));apply(cur)},
      settle(){cur.copy(cols[target]);apply(cur);auto=false}};
  }


  function inkTex(who){return cv(2048,2048,(x,w,h)=>{
    x.fillStyle='#f4f1ea';x.fillRect(0,0,w,h);
    for(let i=0;i<9000;i++){x.fillStyle='rgba(0,0,0,'+(Math.random()*.025)+')';x.fillRect(Math.random()*w,Math.random()*h,2,2)}
    x.strokeStyle='rgba(120,130,170,.22)';x.lineWidth=6;x.strokeRect(150,150,w-300,h-300);x.lineWidth=2;x.strokeRect(190,190,w-380,h-380);
    x.fillStyle='rgba(120,130,170,.2)';for(let i=230;i<w-230;i+=46){[[i,170],[i,h-170],[170,i],[w-170,i]].forEach(([a,b])=>{x.beginPath();x.arc(a,b,6,0,7);x.fill()})}
    const ink='#1d3592';x.fillStyle=ink;x.strokeStyle=ink;x.lineCap='round';x.textAlign='center';
    x.font='700 150px Caveat, "Comic Sans MS", cursive';x.fillText(who[0],w/2,h-520);
    x.lineWidth=10;x.beginPath();x.moveTo(w/2-520,h-470);x.bezierCurveTo(w/2-200,h-500,w/2+200,h-440,w/2+520,h-480);x.stroke();
    x.font='700 96px Caveat, "Comic Sans MS", cursive';x.fillText(who[1],w/2,h-330);
    x.save();x.translate(420,620);x.rotate(-.12);x.font='700 110px Caveat, cursive';x.fillText('1.',0,0);x.fillText('2.',0,150);x.fillText('3.',0,300);x.restore();
    x.lineWidth=7;for(let k=0;k<3;k++){x.beginPath();x.moveTo(520,600+k*150-k*18);x.bezierCurveTo(700,560+k*150,860,640+k*150,1020,590+k*150);x.stroke()}
    x.save();x.translate(w-560,700);x.rotate(.15);x.font='700 170px Caveat, cursive';x.fillText(who[2],0,0);x.lineWidth=8;x.beginPath();x.ellipse(0,-50,260,120,0,0,7);x.stroke();x.restore();
  })}
  function ink(scene,anch){
    scene.add(new T.AmbientLight(0xfff4e8,.1));
    scene.add(new T.HemisphereLight(0xfffaf2,0xb9b0a2,.18));
    const floor=add(scene,new T.PlaneGeometry(40,40),M(0xd8d2c7,{r:.85}),0,0,0,false);floor.rotation.x=-Math.PI/2;
    // curtains around: warm white folds
    const cur=M(0x8d9096,{r:.95}),cur2=M(0x7d8087,{r:.95}),cur3=M(0x9a9da3,{r:.95});[-1,1].forEach(sd=>{const sp=add(scene,new T.PlaneGeometry(10,5.2),cur,sd*6.6,2.6,0,false);sp.rotation.y=-sd*Math.PI/2});
    const N=70,R=5.2;for(let i=0;i<N;i++){const th=Math.PI*.18+i/(N-1)*Math.PI*.64;const x=Math.cos(th)*R*1.35,z=-Math.sin(th)*R*.75;
      const m=add(scene,new T.CylinderGeometry(.13,.13,5.2,10,1,false,0,Math.PI),[cur,cur2,cur3][i%3],x,2.6,z,false);m.rotation.y=-th+Math.PI/2}
    add(scene,new T.PlaneGeometry(16,5.2),cur2,0,2.6,-4.05,false);
    // blue runner: ink line across the floor
    const runMat=M(0x0c1a66,{r:.95});
    const run=add(scene,new T.PlaneGeometry(14,1.5),runMat,0,.012,.35,false);run.rotation.x=-Math.PI/2;
    const edge=M(0xf4f1ea,{r:.9});[-.68,.68].forEach(dz=>{const e=add(scene,new T.PlaneGeometry(14,.025),edge,0,.014,.35+dz,false);e.rotation.x=-Math.PI/2});
    const g=new T.Group();g.position.set(0,.015,.35);scene.add(g);
    const stt=seats(g,0x0b1238);
    // low table with name plaque
    const white=M(0xf4f1ea,{r:.6});
    add(g,new T.BoxGeometry(1.5,.08,.62),white,0,.44,0);
    add(g,new T.BoxGeometry(1.42,.36,.5),white,0,.2,0);
    const plate=new T.MeshStandardMaterial({roughness:.6});
    const pl=add(g,new T.PlaneGeometry(1.42,.26),plate,0,.25,.252,false);
    add(g,new T.BoxGeometry(.2,.06,.08),M(0xc49a4e,{r:.25,m:1}),.35,.51,0);
    for(let i=0;i<3;i++){const nn=add(g,new T.BoxGeometry(.012,.1,.075),M(0xf6f3ec,{r:1}),.32+i*.025,.56,0);}
    add(g,new T.CylinderGeometry(.012,.012,.16,8),M(0x1d3592,{r:.3}),-.3,.49,.08).rotation.z=Math.PI/2;
    // palms in white urns, symmetric
    const urnPts=[[0,0],[.28,0],[.3,.05],[.22,.12],[.26,.5],[.42,.78],[.46,.86],[.4,.88],[0,.88]].map(p=>new T.Vector2(p[0],p[1]));
    const leaf=M(0x22391f,{r:.7,s:T.DoubleSide});
    [-3.6,3.6].forEach(x=>{const u=add(scene,new T.LatheGeometry(urnPts,40),white,x,0,-1.6);
      for(let k=0;k<11;k++){const a=k/11*Math.PI*2,tilt=.5+(k%3)*.25;const l=new T.Mesh(new T.SphereGeometry(1,10,6),leaf);l.scale.set(.55,.04,.13);
        const grp=new T.Group();grp.position.set(x,1.25,-1.6);grp.rotation.y=a;l.position.set(.6,0,0);l.rotation.z=-tilt*.6;grp.add(l);l.castShadow=true;scene.add(grp)}
      add(scene,new T.CylinderGeometry(.04,.05,.5,8),M(0x5a4632,{r:.8}),x,1.05,-1.6)});
    // lights: soft daylight
    const key=new T.SpotLight(0xfff3e4,.95,18,Math.PI/4,.8,1);key.position.set(2,6,6);key.target.position.set(0,.6,0);key.castShadow=true;key.shadow.mapSize.set(1536,1536);key.shadow.radius=4;scene.add(key,key.target);
    const fill=new T.DirectionalLight(0xffffff,.18);fill.position.set(-4,4,3);scene.add(fill);
    anch.push({p:new T.Vector3(4.4,.02,.35),t:'1'},{p:new T.Vector3(0,.27,.9),t:'2'},{p:new T.Vector3(0,.6,.35),t:'3'},{p:new T.Vector3(3.6,1.6,-1.6),t:'4'},{p:new T.Vector3(-1.6,3.2,-3.9),t:'5'});
    cams(scene,anch);
    const V=['Катя Голден','Frambini','Пулково','Катя Голден'],G=['ГОСТЬ ВЫПУСКА','ОСНОВАТЕЛЬ FRAMBINI','ГЛАВА ПУЛКОВО','КАТЯ ГОЛДЕН'],cache={};
    function plTex(i){return cv(2048,376,(x,w,h)=>{x.fillStyle='#f4f1ea';x.fillRect(0,0,w,h);x.fillStyle='#1d3592';x.fillRect(w/2-3,40,6,h-80);x.textAlign='center';x.textBaseline='middle';
      x.font='700 150px Caveat, "Comic Sans MS", cursive';x.fillText('Кучмент',w/4,h/2);x.fillText(i===0?'гость':V[i],w*3/4,h/2)})}
    function variant(i){plate.map=cache[i]||(cache[i]=plTex(i));plate.needsUpdate=true}
    variant(0);
    return {variant,third:stt.third,tick(){},settle(){}};
  }
  window.SetScenes={ring,paper,ink};
})();
