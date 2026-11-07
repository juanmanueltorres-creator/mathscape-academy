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
