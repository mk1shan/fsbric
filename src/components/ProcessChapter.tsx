"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { tornFabric, repairedFabric, shirt, loop, randoms } from "./shapes";

gsap.registerPlugin(ScrollTrigger);

/* A real sequence, so the steps are numbered */
const STEPS = [
  {
    title: "A garment fails inspection",
    body: "A hole, a stain or a crooked seam is enough to reject a finished piece. Without repair, it becomes waste.",
  },
  {
    title: "Our technicians repair it",
    body: "We fix more than 60 types of defect. The repair can’t be seen, and it lasts as long as the garment does.",
  },
  {
    title: "It ships at export quality",
    body: "The piece goes back on the export line at full value, and helps close production shortfalls.",
  },
  {
    title: "Nothing goes to landfill",
    body: "Every repaired garment is pre-consumer waste avoided. That is the circular model Compreli is built on.",
  },
];

/* Pose of the thread object for each step: torn cloth, darned cloth, shirt, loop */
const POSES = [
  { rx: -0.5, ry: -0.55, s: 1.0 },
  { rx: -0.32, ry: 0.4, s: 1.0 },
  { rx: -0.05, ry: -0.3, s: 1.0 },
  { rx: 0.55, ry: -0.5, s: 0.95 },
];

const vertex = /* glsl */ `
  attribute vec4 aS0; attribute vec4 aS1; attribute vec4 aS2; attribute vec4 aS3;
  attribute float aRand;
  uniform float uMorph; uniform float uTime; uniform float uIntro; uniform float uSize; uniform float uPixel;
  varying float vStitch; varying float vAlpha;

  vec4 pick(float k) {
    if (k < 0.5) return aS0;
    if (k < 1.5) return aS1;
    if (k < 2.5) return aS2;
    return aS3;
  }

  void main() {
    float k = clamp(floor(uMorph), 0.0, 2.0);
    float t = clamp(uMorph - k, 0.0, 1.0);
    float delay = aRand * 0.45;
    float tt = smoothstep(delay, delay + 0.55, t);

    vec4 a = pick(k);
    vec4 b = pick(k + 1.0);
    vec3 pos = mix(a.xyz, b.xyz, tt);
    float st = mix(a.w, b.w, tt);

    // threads lift apart mid-change, then settle into the next form
    vec3 dir = normalize(vec3(sin(aRand * 91.7) + 0.001, cos(aRand * 47.3), sin(aRand * 13.1)));
    pos += dir * sin(tt * 3.14159) * (0.15 + aRand * 0.3);
    pos += 0.014 * vec3(sin(uTime * 0.7 + aRand * 40.0), cos(uTime * 0.6 + aRand * 30.0), 0.0);

    // first view: threads gather from a wide scatter into the torn cloth
    vec3 introPos = dir * (4.0 + aRand * 4.0);
    float ip = smoothstep(aRand * 0.5, aRand * 0.5 + 0.5, uIntro);
    pos = mix(introPos, pos, ip);

    vec4 mv = modelViewMatrix * vec4(pos, 1.0);
    gl_Position = projectionMatrix * mv;
    gl_PointSize = uSize * (1.0 + st * 0.9) * uPixel / -mv.z;
    vStitch = st;
    vAlpha = (0.32 + 0.5 * aRand) * ip;
  }
`;

const fragment = /* glsl */ `
  uniform vec3 uBase; uniform vec3 uThread;
  varying float vStitch; varying float vAlpha;
  void main() {
    float d = length(gl_PointCoord - 0.5);
    if (d > 0.5) discard;
    float a = smoothstep(0.5, 0.1, d) * vAlpha * mix(1.0, 1.6, vStitch);
    gl_FragColor = vec4(mix(uBase, uThread, vStitch), min(a, 1.0));
  }
`;

type Refs = {
  progress: React.RefObject<number>;
  intro: React.RefObject<{ v: number }>;
  pointer: React.RefObject<{ x: number; y: number }>;
};

function Threads({ progress, intro, pointer }: Refs) {
  const group = useRef<THREE.Group>(null);
  const mat = useRef<THREE.ShaderMaterial>(null);
  const { gl, size } = useThree();
  const N = size.width < 520 ? 8000 : 16000;

  const geometry = useMemo(() => {
    const g = new THREE.BufferGeometry();
    const shapes = [tornFabric(N), repairedFabric(N), shirt(N), loop(N)];
    g.setAttribute("position", new THREE.BufferAttribute(new Float32Array(N * 3), 3));
    shapes.forEach((s, i) => g.setAttribute(`aS${i}`, new THREE.BufferAttribute(s, 4)));
    g.setAttribute("aRand", new THREE.BufferAttribute(randoms(N), 1));
    g.boundingSphere = new THREE.Sphere(new THREE.Vector3(), 10);
    return g;
  }, [N]);

  const uniforms = useMemo(
    () => ({
      uMorph: { value: 0 },
      uTime: { value: 0 },
      uIntro: { value: 0 },
      uSize: { value: 12 },
      uPixel: { value: 1 },
      uBase: { value: new THREE.Color("#181615") },
      uThread: { value: new THREE.Color("#2b3a8c") },
    }),
    []
  );

  const cur = useRef({ rx: POSES[0].rx, ry: POSES[0].ry, s: POSES[0].s, m: 0 });

  useFrame((state, delta) => {
    if (!group.current || !mat.current) return;
    const p = Math.min(Math.max(progress.current ?? 0, 0), 3);
    const i = Math.min(Math.floor(p), 2);
    const f = p - i;
    const e = f < 0.5 ? 4 * f * f * f : 1 - Math.pow(-2 * f + 2, 3) / 2;
    const A = POSES[i], B = POSES[i + 1];
    const fit = Math.min(1.05, Math.max(0.75, size.width / size.height));
    // hold each form fully while its step is read; change only between steps
    const hold = i + (f < 0.3 ? 0 : f > 0.7 ? 1 : (f - 0.3) / 0.4);
    const target = { rx: A.rx + (B.rx - A.rx) * e, ry: A.ry + (B.ry - A.ry) * e, s: (A.s + (B.s - A.s) * e) * fit, m: hold };

    const c = cur.current;
    const k = 1 - Math.pow(0.003, delta);
    (Object.keys(target) as (keyof typeof target)[]).forEach((key) => (c[key] += (target[key] - c[key]) * k));

    const pt = pointer.current ?? { x: 0, y: 0 };
    group.current.rotation.set(c.rx + pt.y * 0.1, c.ry + pt.x * 0.16, 0);
    group.current.scale.setScalar(c.s);

    const u = mat.current.uniforms;
    u.uMorph.value = c.m;
    u.uTime.value = state.clock.elapsedTime;
    u.uIntro.value = intro.current?.v ?? 1;
    u.uPixel.value = gl.getPixelRatio();
  });

  return (
    <group ref={group}>
      <points geometry={geometry} frustumCulled={false}>
        <shaderMaterial ref={mat} vertexShader={vertex} fragmentShader={fragment} uniforms={uniforms} transparent depthWrite={false} />
      </points>
    </group>
  );
}

/*
  Vero-style transformation chapter. The section is four screens tall; its inner
  stage sticks to the viewport while one thread object changes form with each step.
  With reduced motion, CSS turns this into a plain list of steps.
*/
export default function ProcessChapter() {
  const section = useRef<HTMLElement>(null);
  const bar = useRef<HTMLSpanElement>(null);
  const progress = useRef(0);
  const intro = useRef({ v: 0 });
  const pointer = useRef({ x: 0, y: 0 });
  const [active, setActive] = useState(0);
  const [live, setLive] = useState(false);
  const activeRef = useRef(0);

  useEffect(() => {
    const el = section.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const st = ScrollTrigger.create({
      trigger: el,
      start: "top top",
      end: "bottom bottom",
      onUpdate: (self) => {
        progress.current = self.progress * 3;
        if (bar.current) bar.current.style.transform = `scaleY(${self.progress})`;
        const a = Math.min(3, Math.round(self.progress * 3));
        if (a !== activeRef.current) {
          activeRef.current = a;
          setActive(a);
        }
      },
    });
    const gather = ScrollTrigger.create({
      trigger: el,
      start: "top 70%",
      once: true,
      onEnter: () => gsap.to(intro.current, { v: 1, duration: 2.2, ease: "expo.out" }),
    });
    // only draw while the chapter is on screen
    const io = new IntersectionObserver(([entry]) => setLive(entry.isIntersecting), { rootMargin: "200px" });
    io.observe(el);
    const onMove = (e: PointerEvent) => {
      pointer.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      pointer.current.y = (e.clientY / window.innerHeight) * 2 - 1;
    };
    window.addEventListener("pointermove", onMove);
    return () => {
      st.kill();
      gather.kill();
      io.disconnect();
      window.removeEventListener("pointermove", onMove);
    };
  }, []);

  return (
    <section className="process" id="process" ref={section} aria-label="How a repair works">
      <div className="process-stage">
        <div className="process-canvas" aria-hidden="true">
          <Canvas camera={{ position: [0, 0, 6.4], fov: 40 }} dpr={[1, 2]} frameloop={live ? "always" : "never"} gl={{ antialias: false }}>
            <Threads progress={progress} intro={intro} pointer={pointer} />
          </Canvas>
        </div>

        <div className="process-copy">
          <p className="label">How a repair works</p>
          <ol className="steps">
            {STEPS.map((s, i) => (
              <li key={s.title} className={`step ${i === active ? "is-active" : ""}`} aria-current={i === active ? "step" : undefined}>
                <span className="step-num">0{i + 1} / 04</span>
                <h3>{s.title}</h3>
                <p>{s.body}</p>
              </li>
            ))}
          </ol>
          <div className="process-progress" aria-hidden="true">
            <span ref={bar} />
          </div>
        </div>
      </div>
    </section>
  );
}
