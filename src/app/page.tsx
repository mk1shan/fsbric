import Scene from "@/components/Scene";

const sections = [
  { title: "Motion in 3D", text: "Scroll down — the object moves with you." },
  { title: "Built with Three.js", text: "React Three Fiber + Drei render the scene." },
  { title: "Animated by GSAP", text: "ScrollTrigger drives position, rotation and scale." },
];

export default function Home() {
  return (
    <main className="text-white">
      <Scene />
      <div id="content">
        {sections.map((s, i) => (
          <section
            key={s.title}
            className={`flex h-screen items-center px-8 md:px-24 ${
              i % 2 ? "justify-start" : "justify-end"
            }`}
          >
            <div className="max-w-md">
              <h1 className="text-5xl font-bold tracking-tight md:text-7xl">{s.title}</h1>
              <p className="mt-4 text-lg text-white/70">{s.text}</p>
            </div>
          </section>
        ))}
      </div>
    </main>
  );
}
