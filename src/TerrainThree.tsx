import {useEffect,useRef,useState} from 'react';
import * as THREE from 'three';
import {OrbitControls} from 'three/addons/controls/OrbitControls.js';
import {terrainElevation} from './terrain';
import {terrainMeshSamples} from './terrain-geometry';

type TerrainParams=Record<string,number>;
type Controller={update:(p:TerrainParams)=>void;dispose:()=>void};

/** Loaded with React.lazy only when the learner explicitly selects the 3D terrain. */
export default function TerrainThree({params,onFallback}:{params:TerrainParams;onFallback:()=>void}){
 const host=useRef<HTMLDivElement|null>(null);
 const controller=useRef<Controller|null>(null);
 const [error,setError]=useState(false);
 useEffect(()=>{
  const div=host.current;if(!div)return;
  let renderer:THREE.WebGLRenderer|undefined;
  let geometry:THREE.BufferGeometry|undefined;
  let controls:OrbitControls|undefined;
  let observer:ResizeObserver|undefined;
  let queued=0,disposed=false;
  const scene=new THREE.Scene();
  const camera=new THREE.PerspectiveCamera(42,1,.1,70);
  let mesh:THREE.Mesh|undefined;
  const surfaceMaterial=new THREE.MeshStandardMaterial({vertexColors:true,roughness:.84,metalness:.06,side:THREE.DoubleSide});
  const planeGeometry=new THREE.PlaneGeometry(10,10);
  const planeMaterial=new THREE.MeshBasicMaterial({color:0xf2b77a,transparent:true,opacity:.11,side:THREE.DoubleSide,depthWrite:false});
  const plane=new THREE.Mesh(planeGeometry,planeMaterial);plane.rotation.x=-Math.PI/2;scene.add(plane);
  const grid=new THREE.GridHelper(10,10,0x486080,0x263d55);grid.position.y=-.04;scene.add(grid);
  const markerGeometry=new THREE.SphereGeometry(.09,12,10);
  const markerMaterial=new THREE.MeshBasicMaterial({color:0xffdfa4});
  const marker=new THREE.Mesh(markerGeometry,markerMaterial);scene.add(marker);
  scene.add(new THREE.HemisphereLight(0xe9f9ff,0x2c3150,2.15));
  const sun=new THREE.DirectionalLight(0xffe6c4,2.1);sun.position.set(5,9,3);scene.add(sun);
  const initial=new THREE.Color('#1f536e'),peak=new THREE.Color('#a3f0c8');
  const render=()=>{queued=0;if(!disposed&&renderer)renderer.render(scene,camera)};
  const request=()=>{if(!queued&&!disposed)queued=requestAnimationFrame(render)};
  const resize=()=>{
   if(disposed||!renderer)return;
   const w=Math.max(1,div.clientWidth),h=Math.max(1,div.clientHeight);
   camera.aspect=w/h;camera.updateProjectionMatrix();
   renderer.setSize(w,h,false);request();
  };
  const update=(p:TerrainParams)=>{
   if(disposed)return;
   const n=Math.max(8,Math.min(48,Math.round(p.gridN||22)));
   const model=Math.round(p.landform||0),rough=p.irregularity??.8,datum=p.datum??1100;
   const samples=terrainMeshSamples(model,rough,n);
   const positions=new Float32Array(samples.vertices*3);
   const colors=new Float32Array(samples.vertices*3);
   for(let i=0;i<samples.vertices;i++){
    const x=samples.positions[i*3],y=samples.positions[i*3+1],z=samples.positions[i*3+2];
    positions[i*3]=x/100;positions[i*3+1]=(z-datum)/100;positions[i*3+2]=y/100;
    const color=initial.clone().lerp(peak,THREE.MathUtils.clamp((z-900)/530,0,1));
    colors[i*3]=color.r;colors[i*3+1]=color.g;colors[i*3+2]=color.b;
   }
   const next=new THREE.BufferGeometry();
   next.setAttribute('position',new THREE.BufferAttribute(positions,3));
   next.setAttribute('color',new THREE.BufferAttribute(colors,3));
   next.setIndex(samples.faces);next.computeVertexNormals();
   if(mesh){scene.remove(mesh);geometry?.dispose()}
   geometry=next;mesh=new THREE.Mesh(geometry,surfaceMaterial);scene.add(mesh);
   const x=p.pickX||0,y=p.pickY||0;
   marker.position.set(x/100,(terrainElevation(x,y,model,rough)-datum)/100+.14,y/100);
   request();
  };
  const dispose=()=>{
   disposed=true;if(queued)cancelAnimationFrame(queued);
   observer?.disconnect();controls?.removeEventListener('change',request);controls?.dispose();
   if(mesh)scene.remove(mesh);
   geometry?.dispose();planeGeometry.dispose();planeMaterial.dispose();surfaceMaterial.dispose();markerGeometry.dispose();markerMaterial.dispose();
   renderer?.dispose();if(renderer?.domElement.parentNode===div)div.removeChild(renderer.domElement);
   controller.current=null;
  };
  try{
   renderer=new THREE.WebGLRenderer({antialias:true,alpha:true,powerPreference:'default'});
   renderer.setClearColor(0x091321,0);
   renderer.setPixelRatio(Math.min(window.devicePixelRatio||1,1.5));
   renderer.domElement.className='terrain-three-canvas';div.appendChild(renderer.domElement);
   camera.position.set(9,8.5,11);
   controls=new OrbitControls(camera,renderer.domElement);
   controls.enablePan=false;controls.enableDamping=false;controls.minDistance=7;controls.maxDistance=29;
   controls.minPolarAngle=.1;controls.maxPolarAngle=Math.PI*.49;
   controls.target.set(0,.65,0);controls.update();
   controls.addEventListener('change',request);
   observer=new ResizeObserver(resize);observer.observe(div);
   controller.current={update,dispose};update(params);resize();
   renderer.domElement.addEventListener('webglcontextlost',()=>setError(true),{once:true});
  }catch{
   setError(true);dispose();
  }
  return dispose;
 // Only mount/unmount creates or releases a WebGL context; sliders just update geometry.
 // eslint-disable-next-line react-hooks/exhaustive-deps
 },[]);
 useEffect(()=>{controller.current?.update(params)},[params]);
 return <div ref={host} className='terrain-three-host' aria-label='Relieve sintético tridimensional interactivo'>
  {error?<div className='terrain-webgl-fallback'><strong>WebGL no disponible</strong><p>Podés continuar explorando el mismo modelo con Canvas 2D.</p><button onClick={onFallback}>Volver al relieve 2.5D</button></div>:<div className='terrain-three-caption'>THREE.JS · MALLA REAL · ESCALA 1:1<br/>Arrastrá para rotar · rueda o gesto para acercar</div>}
 </div>;
}
