/** Motor matemático puro. La misma definición alimenta el gráfico, las métricas y las pruebas. */
export type Vec2 = readonly [number, number];
export type Vec3 = readonly [number, number, number];
export type Mat2 = readonly [number, number, number, number];
/** Cinco familias con restricciones de dominio explícitas. */
export const familyValue=(family:number,x:number,a:number,b:number,c:number):number=>{
  switch(family){
    case 1:return a*Math.sin(b*x)+c;
    case 2:return a*Math.exp(b*x)+c;
    case 3:return x>b?a*Math.log(x-b)+c:NaN;
    case 4:return x===b?NaN:a/(x-b)+c;
    default:return a*x*x+b*x+c;
  }
};
/** Punto de lectura estable y derivada analítica de cada familia. */
export const familyAnchor=(family:number,b:number)=>family>=3?b+1:0;
export const familyDerivative=(family:number,x:number,a:number,b:number):number=>{
  switch(family){
    case 1:return a*b*Math.cos(b*x);
    case 2:return a*b*Math.exp(b*x);
    case 3:return x>b?a/(x-b):NaN;
    case 4:return x===b?NaN:-a/((x-b)**2);
    default:return 2*a*x+b;
  }
};

export const quadratic = (x:number) => x*x;
export const derivativeQuadratic = (x:number) => 2*x;
export function secantQuadratic(x:number,h:number){
  if(!h) throw new RangeError('h no puede ser 0');
  return (quadratic(x+h)-quadratic(x))/h;
}
export const integrand = (x:number) => x*x/4+0.5;
export const exactIntegral = (a:number,b:number) => (b**3-a**3)/12+(b-a)/2;
export function leftRiemann(a:number,b:number,n:number){
  if(!Number.isInteger(n)||n<=0)throw new RangeError('n debe ser entero positivo');
  const dx=(b-a)/n;let sum=0;
  for(let i=0;i<n;i++)sum+=integrand(a+i*dx)*dx;
  return sum;
}
export const determinant=([a,b,c,d]:Mat2)=>a*d-b*c;
export const applyMatrix=([a,b,c,d]:Mat2,[x,y]:Vec2):Vec2=>[a*x+b*y,c*x+d*y];

/** Superficie positiva sobre R=[-b,b]². */
export const surface=(x:number,y:number,amplitude:number)=>1+amplitude*(x*x+y*y);
export function exactDoubleIntegral(amplitude:number,b:number){
  if(b<=0)throw new RangeError('b debe ser positivo');
  return 4*b*b+(8/3)*amplitude*b**4;
}
/** Suma de Riemann 2D: n×n prismas, puntos medios en el cuadrado. */
export function midpointDoubleIntegral(amplitude:number,b:number,n:number){
  if(!Number.isInteger(n)||n<=0||n>500)throw new RangeError('n inválido');
  if(b<=0)throw new RangeError('b debe ser positivo');
  const step=2*b/n;let sum=0;
  for(let i=0;i<n;i++)for(let j=0;j<n;j++){
    const x=-b+(i+.5)*step,y=-b+(j+.5)*step;
    sum+=surface(x,y,amplitude)*step*step;
  }
  return sum;
}

/** Solución analítica y Euler explícito para y' = k·y, y(0)=y0. */
export const odeExact=(k:number,y0:number,t:number)=>y0*Math.exp(k*t);
export function solveEuler(k:number,y0:number,end:number,h:number){
  if(h<=0||end<=0)throw new RangeError('h y tiempo final deben ser positivos');
  const points:{t:number;y:number;exact:number}[]=[{t:0,y:y0,exact:y0}];
  let t=0,y=y0;
  while(t<end-1e-10){
    const dt=Math.min(h,end-t);y+=dt*k*y;t+=dt;
    points.push({t,y,exact:odeExact(k,y0,t)});
  }
  return points;
}

/** Gradiente de z=a x²+b y². */
export const surfaceGradient=(a:number,b:number,x:number,y:number):Vec2=>[2*a*x,2*b*y];
export const gradientSurface=(a:number,b:number,x:number,y:number)=>a*x*x+b*y*y;
export const norm2=([x,y]:Vec2)=>Math.hypot(x,y);

/** Superfórmula de Gielis en 2D, con parámetros acotados para evitar singularidades. */
export function superRadius(theta:number,m:number,n1:number,n2=1.7,n3=1.7){
  const c=Math.abs(Math.cos(m*theta/4))**n2;
  const s=Math.abs(Math.sin(m*theta/4))**n3;
  return (Math.max(1e-10,c+s))**(-1/Math.max(.12,n1));
}

/** RK4 del atractor clásico de Lorenz (parámetros estables, sólo componente visual). */
export function lorenzPoints(count=1800,dt=.007):Vec3[]{
  const sigma=10,rho=28,beta=8/3;
  const f=([x,y,z]:Vec3):Vec3=>[sigma*(y-x),x*(rho-z)-y,x*y-beta*z];
  let q:Vec3=[.11,0,1];const points:Vec3[]=[];
  for(let i=0;i<count;i++){
    const a=f(q);const b=f([q[0]+a[0]*dt/2,q[1]+a[1]*dt/2,q[2]+a[2]*dt/2]);
    const c=f([q[0]+b[0]*dt/2,q[1]+b[1]*dt/2,q[2]+b[2]*dt/2]);
    const d=f([q[0]+c[0]*dt,q[1]+c[1]*dt,q[2]+c[2]*dt]);
    q=[q[0]+dt*(a[0]+2*b[0]+2*c[0]+d[0])/6,q[1]+dt*(a[1]+2*b[1]+2*c[1]+d[1])/6,q[2]+dt*(a[2]+2*b[2]+2*c[2]+d[2])/6];
    if(i>260)points.push(q);
  }
  return points;
}

/** Catálogo de ejemplos: fórmulas y cálculos idénticos para gráfica y evaluación. */
export const derivativeExample=(model:number,x:number)=>model===1?Math.sin(x):model===2?Math.exp(x):quadratic(x);
export const derivativeExampleSlope=(model:number,x:number)=>model===1?Math.cos(x):model===2?Math.exp(x):derivativeQuadratic(x);
export function secantExample(model:number,x:number,h:number){
  if(!(h>0))throw new RangeError('h debe ser positivo');
  return (derivativeExample(model,x+h)-derivativeExample(model,x))/h;
}
export const integrandExample=(model:number,x:number)=>model===1?1+Math.sin(x):model===2?1+x/2:integrand(x);
export function exactIntegralExample(model:number,a:number,b:number){
  if(model===1)return (b-a)-Math.cos(b)+Math.cos(a);
  if(model===2)return (b-a)+(b*b-a*a)/4;
  return exactIntegral(a,b);
}
export function leftRiemannExample(model:number,a:number,b:number,n:number){
  if(!Number.isInteger(n)||n<=0)throw new RangeError('n debe ser entero positivo');
  const dx=(b-a)/n;let sum=0;
  for(let i=0;i<n;i++)sum+=integrandExample(model,a+i*dx)*dx;
  return sum;
}
/** Casos: 0=cuadrática sobre cuadrado; 1=cilindro; 2=hemisferio; 3=paraboloide; 4=cono; 5=esfera completa mediante espesor vertical. */
export function solidHeight(model:number,x:number,y:number,r:number,h:number,a:number){
  const rr=x*x+y*y;
  if(model===0)return surface(x,y,a);
  if(r<=0||rr>r*r+1e-12)return NaN;
  const q=Math.min(1,rr/(r*r));
  switch(model){
    case 1:return h;
    case 2:return Math.sqrt(Math.max(0,r*r-rr));
    case 3:return h*(1-q);
    case 4:return h*(1-Math.sqrt(q));
    case 5:return 2*Math.sqrt(Math.max(0,r*r-rr));
    default:throw new RangeError('modelo geométrico inválido');
  }
}
export function exactSolidVolume(model:number,r:number,h:number,a:number){
  if(r<=0||h<=0)throw new RangeError('radio y altura deben ser positivos');
  switch(model){
    case 0:return exactDoubleIntegral(a,r);
    case 1:return Math.PI*r*r*h;
    case 2:return 2*Math.PI*r*r*r/3;
    case 3:return Math.PI*r*r*h/2;
    case 4:return Math.PI*r*r*h/3;
    case 5:return 4*Math.PI*r*r*r/3;
    default:throw new RangeError('modelo geométrico inválido');
  }
}
/** Riemann polar: r dr dθ sobre el disco; evita el error de tomar una región cuadrada. */
export function midpointSolidVolume(model:number,r:number,h:number,a:number,n:number){
  if(!Number.isInteger(n)||n<1||n>300)throw new RangeError('resolución inválida');
  if(r<=0||h<=0)throw new RangeError('radio y altura deben ser positivos');
  if(model===0)return midpointDoubleIntegral(a,r,n);
  const dr=r/n,angular=4*n,dtheta=2*Math.PI/angular;
  let sum=0;
  for(let i=0;i<n;i++){
    const radius=(i+.5)*dr;
    for(let j=0;j<angular;j++){
      const theta=(j+.5)*dtheta;
      sum+=solidHeight(model,radius*Math.cos(theta),radius*Math.sin(theta),r,h,a)*radius*dr*dtheta;
    }
  }
  return sum;
}
/** Ejemplos de límites; jump model tiene límites laterales distintos. */
export function limitExample(model:number,x:number){
  if(model===1)return Math.abs(x-1)<1e-12?NaN:x+1;
  if(model===2)return x<0?-1:1;
  return Math.abs(x)<1e-12?NaN:Math.sin(x)/x;
}
export const limitCenter=(model:number)=>model===1?1:0;
export const limitLeftRight=(model:number,h:number):Vec2=>[
  limitExample(model,limitCenter(model)-h),limitExample(model,limitCenter(model)+h)
];
/** Ecuación logística y caso exponencial. Para k=0 ambas mantienen y0. */
export const odeModelExact=(model:number,k:number,y0:number,t:number,K:number)=>{
  if(model===0)return odeExact(k,y0,t);
  if(K<=0||y0<=0)throw new RangeError('K e y0 deben ser positivos');
  return K/(1+(K/y0-1)*Math.exp(-k*t));
};
export const odeModelRate=(model:number,k:number,y:number,K:number)=>model===0?k*y:k*y*(1-y/K);
export function solveEulerModel(model:number,k:number,y0:number,end:number,dt:number,K:number){
  if(dt<=0||end<=0)throw new RangeError('paso y tiempo deben ser positivos');
  if(model!==0&&K<=0)throw new RangeError('capacidad inválida');
  const points:{t:number;y:number;exact:number}[]=[{t:0,y:y0,exact:y0}];
  let t=0,y=y0;
  while(t<end-1e-10){
    const step=Math.min(dt,end-t);y+=step*odeModelRate(model,k,y,K);t+=step;
    points.push({t,y,exact:odeModelExact(model,k,y0,t,K)});
  }
  return points;
}
/** Relieve 0=paraboloide, 1=silla de montar, 2=colina gaussiana. */
export function gradientExampleValue(model:number,a:number,b:number,x:number,y:number){
  if(model===1)return a*x*x-b*y*y;
  if(model===2)return a*Math.exp(-b*(x*x+y*y));
  return gradientSurface(a,b,x,y);
}
export function gradientExample(model:number,a:number,b:number,x:number,y:number):Vec2{
  if(model===1)return [2*a*x,-2*b*y];
  if(model===2){const z=gradientExampleValue(model,a,b,x,y);return [-2*b*x*z,-2*b*y*z];}
  return surfaceGradient(a,b,x,y);
}
