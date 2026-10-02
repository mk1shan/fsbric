"use client";

import { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import {
  Environment,
  Float,
  Lightformer,
  MeshDistortMaterial,
  ContactShadows,
} from "@react-three/drei";
import * as THREE from "three";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger, useGSAP);

function Blob() {
  const group = useRef<THREE.Group>(null);
  const mesh = useRef<THREE.Mesh>(null);

  // Idle spin every frame
  useFrame((_, delta) => {
    if (mesh.current) mesh.current.rotation.y += delta * 0.3;
  });

  // Scroll-driven motion: moves/rotates/scales the object as the page scrolls
  useGSAP(() => {
    if (!group.current) return;
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: "#content",
        start: "top top",
        end: "bottom bottom",
        scrub: 1.2,
      },
    });
    tl.to(group.current.position, { x: 2, y: -0.3, ease: "none" })
      .to(group.current.rotation, { x: Math.PI, z: Math.PI / 4, ease: "none" }, "<")
      .to(group.current.position, { x: -2, y: 0.2, ease: "none" })
      .to(group.current.scale, { x: 1.4, y: 1.4, z: 1.4, ease: "none" }, "<");
  });

  return (
    <group ref={group}>
      <Float speed={2} rotationIntensity={0.6} floatIntensity={1.2}>
        <mesh ref={mesh}>
          <torusKnotGeometry args={[1, 0.35, 256, 64]} />
          <MeshDistortMaterial
            color="#7c5cff"
            roughness={0.15}
            metalness={0.6}
            distort={0.25}
            speed={2}
          />
        </mesh>
      </Float>
    </group>
  );
}

export default function Scene() {
  return (
    <div className="fixed inset-0 -z-10">
      <Canvas camera={{ position: [0, 0, 6], fov: 45 }} dpr={[1, 2]}>
        <color attach="background" args={["#0a0a12"]} />
        <ambientLight intensity={0.4} />
        <directionalLight position={[5, 5, 5]} intensity={1.5} />
        <Blob />
        <ContactShadows position={[0, -2, 0]} opacity={0.5} blur={2.5} scale={10} />
        {/* Local studio lighting — no external HDR download needed */}
        <Environment resolution={256}>
          <Lightformer intensity={2} position={[0, 5, -5]} scale={[10, 2, 1]} />
          <Lightformer intensity={1.5} color="#ff6ad5" position={[-5, 1, 0]} rotation-y={Math.PI / 2} scale={[10, 2, 1]} />
          <Lightformer intensity={1.5} color="#3ad1ff" position={[5, 1, 0]} rotation-y={-Math.PI / 2} scale={[10, 2, 1]} />
        </Environment>
      </Canvas>
    </div>
  );
}
