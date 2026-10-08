"use client";

import { useEffect, useRef, useState } from "react";
import styles from "./homepage.module.css";

const VERT = "attribute vec2 p;void main(){gl_Position=vec4(p,0.,1.);}";

/* Raymarched iridescent "liquid glass" blob: a wobbling sphere with two satellites melting into it. */
const FRAG = `precision highp float;
uniform vec2 r;uniform float t;
mat2 rot(float a){float c=cos(a),s=sin(a);return mat2(c,-s,s,c);}
float smin(float a,float b,float k){float h=clamp(.5+.5*(b-a)/k,0.,1.);return mix(b,a,h)-k*h*(1.-h);}
float map(vec3 p){
 p.xz*=rot(t*.22); p.yz*=rot(.3+.2*sin(t*.3));
 float d=length(p)-.8;
 d+=.08*sin(p.x*3.4+t*1.2)*sin(p.y*3.9+t*1.)*sin(p.z*3.6+t*.8);
 vec3 q=p; q.xy*=rot(t*.45);
 float s1=length(q-vec3(1.1*sin(t*.6),.4*cos(t*.8),.5*sin(t*.5)))-.32;
 float s2=length(q-vec3(-.95*cos(t*.55),-.75*sin(t*.7),.4*cos(t*.4)))-.26;
 d=smin(d,s1,.45); d=smin(d,s2,.45);
 return d;}
vec3 nor(vec3 p){vec2 e=vec2(.0015,0.);return normalize(vec3(map(p+e.xyy)-map(p-e.xyy),map(p+e.yxy)-map(p-e.yxy),map(p+e.yyx)-map(p-e.yyx)));}
vec3 pal(float x){return .5+.5*cos(6.2831*(x+vec3(0.,.33,.67)));}
void main(){
 vec2 uv=(gl_FragCoord.xy-.5*r)/r.y;
 vec3 ro=vec3(0.,0.,4.6), rd=normalize(vec3(uv,-1.55));
 float d=0.,h=1.; bool hit=false;
 for(int i=0;i<80;i++){vec3 p=ro+rd*d;h=map(p);if(h<.001){hit=true;break;}d+=h*.8;if(d>9.)break;}
 vec4 col=vec4(0.);
 if(hit){
  vec3 p=ro+rd*d; vec3 n=nor(p);
  float fr=pow(1.-max(dot(n,-rd),0.),2.2);
  vec3 ir=pal(fr*1.3+dot(n,vec3(.35,.55,.2))*.8+t*.04);
  vec3 pink=vec3(1.,.56,.78),cyan=vec3(.18,.9,.88),vio=vec3(.55,.36,.96),peach=vec3(1.,.77,.6);
  vec3 base=mix(mix(vio,pink,ir.r),mix(cyan,peach,ir.g),ir.b*.6);
  vec3 l=normalize(vec3(.6,.8,.55)); float dif=max(dot(n,l),0.);
  float sp=pow(max(dot(reflect(rd,n),l),0.),48.);
  vec3 c=base*(.38+.62*dif)+sp*.95+fr*vec3(.95,.97,1.)*.55;
  float a=.75+.25*fr; col=vec4(c*a,a);
 }
 gl_FragColor=col;
}`;

/** Live WebGL core behind the app screenshots. Renders only while on screen; static under reduced motion. */
export function GlassCore() {
  const ref = useRef<HTMLCanvasElement>(null);
  const [fallback, setFallback] = useState(false);

  useEffect(() => {
    const cv = ref.current;
    if (!cv) return;
    const gl = cv.getContext("webgl", { alpha: true, premultipliedAlpha: true, antialias: true });
    if (!gl) {
      setFallback(true);
      return;
    }
    const compile = (type: number, src: string) => {
      const s = gl.createShader(type)!;
      gl.shaderSource(s, src);
      gl.compileShader(s);
      return gl.getShaderParameter(s, gl.COMPILE_STATUS) ? s : null;
    };
    const vs = compile(gl.VERTEX_SHADER, VERT);
    const fs = compile(gl.FRAGMENT_SHADER, FRAG);
    const pr = gl.createProgram()!;
    if (!vs || !fs) {
      setFallback(true);
      return;
    }
    gl.attachShader(pr, vs);
    gl.attachShader(pr, fs);
    gl.linkProgram(pr);
    if (!gl.getProgramParameter(pr, gl.LINK_STATUS)) {
      setFallback(true);
      return;
    }
    gl.useProgram(pr);
    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]), gl.STATIC_DRAW);
    const loc = gl.getAttribLocation(pr, "p");
    gl.enableVertexAttribArray(loc);
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
    const uR = gl.getUniformLocation(pr, "r");
    const uT = gl.getUniformLocation(pr, "t");

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let visible = true;
    const io = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting;
    });
    io.observe(cv);

    let raf = 0;
    const t0 = performance.now();
    const frame = (now: number) => {
      const dpr = Math.min(window.devicePixelRatio || 1, 1.25);
      const w = Math.max(1, Math.round(cv.clientWidth * dpr));
      const h = Math.max(1, Math.round(cv.clientHeight * dpr));
      if (cv.width !== w || cv.height !== h) {
        cv.width = w;
        cv.height = h;
      }
      if (visible) {
        gl.viewport(0, 0, w, h);
        gl.clearColor(0, 0, 0, 0);
        gl.clear(gl.COLOR_BUFFER_BIT);
        gl.uniform2f(uR, w, h);
        gl.uniform1f(uT, reduce ? 2 : (now - t0) / 1000);
        gl.drawArrays(gl.TRIANGLES, 0, 6);
      }
      if (!reduce) raf = requestAnimationFrame(frame);
    };
    raf = requestAnimationFrame(frame);
    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
    };
  }, []);

  return (
    <>
      <canvas
        ref={ref}
        aria-hidden="true"
        className="pointer-events-none absolute top-1/2 left-1/2 z-0 aspect-square w-[min(760px,110%)] -translate-x-1/2 -translate-y-1/2"
      />
      {fallback && (
        <div
          aria-hidden="true"
          className={`pointer-events-none absolute top-1/2 left-1/2 z-0 size-[420px] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-55 blur-[6px] ${styles.pulse}`}
          style={{
            background:
              "radial-gradient(circle at 32% 28%, #FFFFFF 0%, #FFD6EC 14%, #FF8FC7 34%, #8B5CF6 62%, #2FE6E0 92%)",
          }}
        />
      )}
    </>
  );
}
