(()=>{
  const projectTabs=[...document.querySelectorAll('.project-tab')];
  projectTabs.forEach(tab=>tab.addEventListener('click',()=>{
    projectTabs.forEach(t=>{t.classList.remove('active');t.setAttribute('aria-selected','false')});
    tab.classList.add('active');tab.setAttribute('aria-selected','true');
    document.querySelectorAll('.project-pane').forEach(p=>p.classList.toggle('active',p.id==='pane-'+tab.dataset.project));
  }));

  const galleries={
    clara:[
      ['assets/clara/clara_asistente.png','Clara: experiencia guiada','Asistente ciudadana para explorar, explicar, comparar y descargar.'],
      ['assets/clara/inicio_mnt.png','Inicio de la Métrica','Navegación institucional con acceso directo a las funciones clave.'],
      ['assets/clara/mapa_mnt.png','Mapa interactivo','Filtros, semáforo comparativo y ficha territorial en una sola vista.'],
      ['assets/clara/resultados_consulta.png','Resultados de consulta','Componentes, lectura ciudadana y preparación de reportes.'],
      ['assets/clara/resultados_generales.png','Lectura nacional','Índice, ranking por entidad y resultados específicos.'],
      ['assets/clara/guia_descargas.png','Guía y descargas','Videotutorial, JSON, CSV y reporte de selección activa.']
    ],
    conecta:[
      ['assets/conecta/dashboard.png','Tablero ejecutivo','Lectura semanal de temas, niveles, público y canales de atención.'],
      ['assets/conecta/trimestres.png','Seguimiento trimestral','Comportamiento de evaluaciones y semáforo de seguimiento.'],
      ['assets/conecta/estructura.png','Arquitectura de captura','Campos normalizados para consistencia y trazabilidad.']
    ],
    joya:[
      ['assets/joya/POS_02_Punto_de_Venta.png','Punto de venta','Venta, búsqueda, carrito, cobro y control operativo.'],
      ['assets/joya/POS_03_Inventario.png','Inventario','Existencias, precios, costos, ubicaciones y etiquetas.'],
      ['assets/joya/POS_04_Compras_Cantidad_Etiquetas.png','Compras','Proveedor, costo, margen, entrada de mercancía y etiquetado.'],
      ['assets/joya/POS_05_Reembolsos.png','Reembolsos','Consulta de venta y devolución por producto.'],
      ['assets/joya/POS_06_Caja_y_Gastos.png','Caja y gastos','Movimientos operativos, gastos y control de efectivo.'],
      ['assets/joya/POS_07_Tablero_Ejecutivo.png','Tablero ejecutivo','Ventas, utilidad, ticket promedio, inventario y productos.'],
      ['assets/joya/POS_08_Sincronizacion.png','Sincronización','Stock, web, imágenes y diagnóstico de integración.'],
      ['assets/joya/web_inicio.png','Canal web','Tienda pública de Refaccionaria La Joya.'],
      ['assets/joya/web_facturacion.png','Facturación web','Identificación del pedido para continuar el proceso de facturación.']
    ]
  };
  const states={};
  function setGallery(key,i){
    const s=states[key],item=s.data[i];s.i=i;
    const img=s.media.querySelector('.main-shot');
    img.style.opacity='.25';
    window.setTimeout(()=>{
      img.src=item[0];img.alt=item[1];
      s.media.querySelector('.cap-title').textContent=item[1];
      s.media.querySelector('.cap-sub').textContent=item[2];
      s.media.querySelectorAll('.thumb').forEach((t,n)=>t.classList.toggle('active',n===i));
      s.media.querySelector('.project-progress i').style.width=((i+1)/s.data.length*100)+'%';
      img.style.opacity='1';
    },120);
  }
  document.querySelectorAll('.project-pane').forEach(pane=>{
    const key=pane.dataset.gallery,data=galleries[key],media=pane.querySelector('.project-media'),rail=media.querySelector('.thumbrail');
    states[key]={i:0,data,media};
    data.forEach((item,i)=>{
      const b=document.createElement('button');b.type='button';b.className='thumb'+(i===0?' active':'');b.setAttribute('aria-label','Ver '+item[1]);
      b.innerHTML=`<img src="${item[0]}" alt="">`;b.addEventListener('click',()=>setGallery(key,i));rail.appendChild(b);
    });
    media.querySelector('.prev').addEventListener('click',()=>setGallery(key,(states[key].i-1+data.length)%data.length));
    media.querySelector('.next').addEventListener('click',()=>setGallery(key,(states[key].i+1)%data.length));
    setGallery(key,0);
  });

  const reveal=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add('in');reveal.unobserve(e.target)}}),{threshold:.12});
  document.querySelectorAll('.reveal').forEach(el=>reveal.observe(el));

  const progress=document.getElementById('progress');
  function onScroll(){const d=document.documentElement,m=d.scrollHeight-d.clientHeight;progress.style.width=(m?d.scrollTop/m*100:0)+'%'}
  addEventListener('scroll',onScroll,{passive:true});onScroll();

  const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
  const words=['personas','operación','datos','servicio','decisiones'];let wi=0;const rot=document.getElementById('rotator');
  if(!reduced){window.setInterval(()=>{wi=(wi+1)%words.length;const a=rot.animate([{opacity:1,transform:'translateY(0)'},{opacity:0,transform:'translateY(-6px)'}],{duration:180,fill:'forwards'});a.onfinish=()=>{rot.textContent=words[wi];rot.animate([{opacity:0,transform:'translateY(6px)'},{opacity:1,transform:'translateY(0)'}],{duration:230,fill:'forwards'})}},2400)}

  document.querySelectorAll('.tilt').forEach(el=>{
    el.addEventListener('pointermove',e=>{if(innerWidth<900)return;const r=el.getBoundingClientRect(),x=(e.clientX-r.left)/r.width-.5,y=(e.clientY-r.top)/r.height-.5;el.style.transform=`perspective(1000px) rotateX(${(-y*2.2).toFixed(2)}deg) rotateY(${(x*2.6).toFixed(2)}deg)`});
    el.addEventListener('pointerleave',()=>el.style.transform='');
  });

  const canvas=document.getElementById('mesh'),ctx=canvas.getContext('2d');let pts=[],raf=0;
  function resize(){const r=canvas.getBoundingClientRect(),d=Math.min(devicePixelRatio||1,2);canvas.width=r.width*d;canvas.height=r.height*d;ctx.setTransform(d,0,0,d,0,0);pts=Array.from({length:Math.min(64,Math.max(24,Math.floor(r.width/22)))},()=>({x:Math.random()*r.width,y:Math.random()*r.height,vx:(Math.random()-.5)*.18,vy:(Math.random()-.5)*.18}))}
  function draw(){const r=canvas.getBoundingClientRect();ctx.clearRect(0,0,r.width,r.height);ctx.fillStyle='rgba(85,242,208,.45)';for(const p of pts){if(!reduced){p.x+=p.vx;p.y+=p.vy;if(p.x<0||p.x>r.width)p.vx*=-1;if(p.y<0||p.y>r.height)p.vy*=-1}ctx.beginPath();ctx.arc(p.x,p.y,1.2,0,Math.PI*2);ctx.fill()}for(let i=0;i<pts.length;i++)for(let j=i+1;j<pts.length;j++){const a=pts[i],b=pts[j],dist=Math.hypot(a.x-b.x,a.y-b.y);if(dist<125){ctx.strokeStyle=`rgba(110,184,255,${(1-dist/125)*.12})`;ctx.lineWidth=.6;ctx.beginPath();ctx.moveTo(a.x,a.y);ctx.lineTo(b.x,b.y);ctx.stroke()}}if(!reduced)raf=requestAnimationFrame(draw)}
  resize();draw();addEventListener('resize',()=>{cancelAnimationFrame(raf);resize();draw()},{passive:true});
})();
