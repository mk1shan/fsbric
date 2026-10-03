"use client";

import { useEffect, useMemo, useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { tornFabric, repairedFabric, shirt, globe, loop, randoms } from "./shapes";

gsap.registerPlugin(ScrollTrigger);

/*
  One particle object, five forms. Each <section data-stage> on the page
  moves the object one step: torn fabric → darned fabric → shirt → globe → loop.
  Stage 5 (contact) keeps the loop but centres and dims it behind the text.
*/
type Pose = { x: number; y: number; rx: number; ry: number; s: number; o: number };
const POSES: Pose[] = [
  { x: 1.75, y: 0.0, rx: -0.45, ry: -0.5, s: 1.0, o: 1 },  // torn fabric
  { x: -1.55, y: 0.0, rx: -0.3, ry: 0.45, s: 0.95, o: 1 }, // repaired
  { x: 1.8, y: -0.05, rx: -0.05, ry: -0.3, s: 1.0, o: 1 }, // shirt
  { x: -1.6, y: 0.0, rx: 0.15, ry: -2.62, s: 1.0, o: 1 },  // globe — Asia/Africa facing camera
  { x: 1.7, y: 0.0, rx: 0.5, ry: -3.4, s: 0.95, o: 1 },    // loop
  { x: 0.0, y: 0.0, rx: 0.8, ry: -3.14, s: 1.45, o: 0.28 }, // contact
];
const MORPH = [0, 1, 2, 3, 4, 4];

const vertex = /* glsl */ `
  attribute vec4 aS0; attribute vec4 aS1; attribute vec4 aS2; attribute vec4 aS3; attribute vec4 aS4;
  attribute float aRand;
  uniform float uMorph; uniform float uTime; uniform float uIntro; uniform float uSize; uniform float uPixel;
  varying float vStitch; varying float vAlpha;

  vec4 pick(float k) {
    if (k < 0.5) return aS0;
    if (k < 1.5) return aS1;
    if (k < 2.5) return aS2;
    if (k < 3.5) return aS3;
    return aS4;
  }

  void main() {
    float k = clamp(floor(uMorph), 0.0, 3.0);
    float t = clamp(uMorph - k, 0.0, 1.0);
    float delay = aRand * 0.45;
    float tt = smoothstep(delay, delay + 0.55, t);

    vec4 a = pick(k);
    vec4 b = pick(k + 1.0);
    vec3 pos = mix(a.xyz, b.xyz, tt);
    float st = mix(a.w, b.w, tt);

    // threads lift and drift apart mid-morph, then settle into the next form
    vec3 dir = normalize(vec3(sin(aRand * 91.7) + 0.001, cos(aRand * 47.3), sin(aRand * 13.1)));
    pos += dir * sin(tt * 3.14159) * (0.3 + aRand * 0.6);
    pos += 0.018 * vec3(sin(uTime * 0.8 + aRand * 40.0), cos(uTime * 0.7 + aRand * 30.0), 0.0);

    // page-load: threads fly in from far away and gather into the torn cloth
    vec3 introPos = dir * (5.0 + aRand * 5.0);
    float ip = smoothstep(aRand * 0.5, aRand * 0.5 + 0.5, uIntro);
    pos = mix(introPos, pos, ip);

    vec4 mv = modelViewMatrix * vec4(pos, 1.0);
    gl_Position = projectionMatrix * mv;
    gl_PointSize = uSize * (1.0 + st * 0.8) * uPixel / -mv.z;
    vStitch = st;
    vAlpha = (0.35 + 0.5 * aRand) * ip;
  }
`;

const fragment = /* glsl */ `
  uniform vec3 uBase; uniform vec3 uThread; uniform float uOpacity;
  varying float vStitch; varying float vAlpha;
  void main() {
    float d = length(gl_PointCoord - 0.5);
    if (d > 0.5) discard;
    float a = smoothstep(0.5, 0.05, d) * vAlpha * uOpacity;
    gl_FragColor = vec4(mix(uBase, uThread, vStitch), a);
  }
`;

function Threads({ intro }: { intro: React.RefObject<{ v: number }> }) {
  const group = useRef<THREE.Group>(null);
  const mat = useRef<THREE.ShaderMaterial>(null);
  const { gl, size } = useThree();
  const stage = useRef(0);
  const pointer = useRef({ x: 0, y: 0 });

  const N = size.width < 768 ? 9000 : 18000;

  const geometry = useMemo(() => {
    const g = new THREE.BufferGeometry();
    const shapes = [tornFabric(N), repairedFabric(N), shirt(N), globe(N), loop(N)];
    // position attribute is only used for bounds; the shader reads aS0..aS4
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
      uSize: { value: 13 },
      uPixel: { value: 1 },
      uOpacity: { value: 1 },
      uBase: { value: new THREE.Color("#1b1f3d") },   // indigo ink
      uThread: { value: new THREE.Color("#3346e0") }, // denim-blue repair thread
    }),
    []
  );

  // Each stage section drives one step of the journey via ScrollTrigger
  useEffect(() => {
    const sections = gsap.utils.toArray<HTMLElement>("[data-stage]").slice(1);
    // stage = sum of every section's 0..1 entry progress
    const triggers: ScrollTrigger[] = [];
    const update = () => {
      stage.current = triggers.reduce((sum, t) => sum + t.progress, 0);
    };
    sections.forEach((el) =>
      triggers.push(
        ScrollTrigger.create({ trigger: el, start: "top bottom", end: "top top", onUpdate: update, onRefresh: update })
      )
    );
    update();
    const onMove = (e: PointerEvent) => {
      pointer.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      pointer.current.y = (e.clientY / window.innerHeight) * 2 - 1;
    };
    window.addEventListener("pointermove", onMove);
    return () => {
      triggers.forEach((t) => t.kill());
      window.removeEventListener("pointermove", onMove);
    };
  }, []);

  const current = useRef({ ...POSES[0], m: 0 });

  useFrame((state, delta) => {
    if (!group.current || !mat.current) return;
    const s = Math.min(stage.current, POSES.length - 1);
    const i = Math.floor(s);
    const f = s - i;
    const A = POSES[i];
    const B = POSES[Math.min(i + 1, POSES.length - 1)];
    const e = f < 0.5 ? 4 * f * f * f : 1 - Math.pow(-2 * f + 2, 3) / 2; // easeInOutCubic
    const morph = MORPH[i] + (MORPH[Math.min(i + 1, MORPH.length - 1)] - MORPH[i]) * f;

    const mobile = size.width < 768;
    const target = {
      x: (A.x + (B.x - A.x) * e) * (mobile ? 0 : 1),
      y: (A.y + (B.y - A.y) * e) + (mobile ? 1.45 : 0),
      rx: A.rx + (B.rx - A.rx) * e,
      ry: A.ry + (B.ry - A.ry) * e,
      s: (A.s + (B.s - A.s) * e) * (mobile ? 0.5 : 1),
      o: A.o + (B.o - A.o) * e,
      m: morph,
    };

    const c = current.current;
    const k = 1 - Math.pow(0.002, delta); // frame-rate independent smoothing
    (Object.keys(target) as (keyof typeof target)[]).forEach((key) => {
      c[key] += (target[key] - c[key]) * k;
    });

    group.current.position.set(c.x, c.y, 0);
    group.current.rotation.set(
      c.rx + pointer.current.y * 0.12,
      c.ry + pointer.current.x * 0.2,
      0
    );
    group.current.scale.setScalar(c.s);

    const u = mat.current.uniforms;
    u.uMorph.value = c.m;
    u.uTime.value = state.clock.elapsedTime;
    u.uIntro.value = intro.current.v;
    u.uOpacity.value = c.o;
    u.uPixel.value = gl.getPixelRatio();
  });

  return (
    <group ref={group}>
      <points geometry={geometry} frustumCulled={false}>
        <shaderMaterial
          ref={mat}
          vertexShader={vertex}
          fragmentShader={fragment}
          uniforms={uniforms}
          transparent
          depthWrite={false}
          blending={THREE.NormalBlending}
        />
      </points>
    </group>
  );
}

export default function Scene() {
  const intro = useRef({ v: 0 });

  // Threads fly in and gather into the torn cloth when the first stage scrolls into view
  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const first = document.querySelector("[data-stage]");
    const play = () => gsap.to(intro.current, { v: 1, duration: reduce ? 0 : 2.4, ease: "power3.out" });
    if (!first) { play(); return; }
    const st = ScrollTrigger.create({ trigger: first, start: "top 85%", once: true, onEnter: play });
    return () => st.kill();
  }, []);

  return (
    <div className="scene" aria-hidden="true">
      <Canvas camera={{ position: [0, 0, 7], fov: 40 }} dpr={[1, 2]} gl={{ antialias: false }}>
        <Threads intro={intro} />
      </Canvas>
    </div>
  );
}
