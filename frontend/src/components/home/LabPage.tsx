"use client";

import { useEffect, useRef, useState } from "react";

// ─── Intersection Observer Hook ───────────────────────────────────────────────
function useInView(threshold = 0.15) {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setInView(true); observer.disconnect(); } },
      { threshold }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold]);
  return { ref, inView };
}

// ─── Animated Counter ─────────────────────────────────────────────────────────
function Counter({ target, run }: { target: number; run: boolean }) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!run) return;
    let start = 0;
    const step = Math.ceil(target / (1800 / 16));
    const timer = setInterval(() => {
      start += step;
      if (start >= target) { setCount(target); clearInterval(timer); }
      else setCount(start);
    }, 16);
    return () => clearInterval(timer);
  }, [run, target]);
  return <span>{count}</span>;
}

// ─── Icons ────────────────────────────────────────────────────────────────────
const IconEquipment = () => (
  <svg viewBox="0 0 40 40" fill="none" className="w-10 h-10" stroke="currentColor" strokeWidth="1.5">
    <rect x="4" y="8" width="32" height="24" rx="2" />
    <polyline points="10,20 16,14 22,20 28,14" />
    <line x1="4" y1="28" x2="36" y2="28" />
  </svg>
);
const IconExpertise = () => (
  <svg viewBox="0 0 40 40" fill="none" className="w-10 h-10" stroke="currentColor" strokeWidth="1.5">
    <circle cx="20" cy="20" r="14" /><circle cx="20" cy="20" r="6" />
    <line x1="20" y1="6" x2="20" y2="2" /><line x1="20" y1="38" x2="20" y2="34" />
    <line x1="6" y1="20" x2="2" y2="20" /><line x1="38" y1="20" x2="34" y2="20" />
    <path d="M20 14 L22 11 L18 11 Z" fill="currentColor" />
  </svg>
);
const IconCases = () => (
  <svg viewBox="0 0 40 40" fill="none" className="w-10 h-10" stroke="currentColor" strokeWidth="1.5">
    <rect x="6" y="12" width="28" height="22" rx="2" />
    <path d="M14 12V8a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v4" />
    <line x1="20" y1="20" x2="20" y2="28" /><line x1="16" y1="24" x2="24" y2="24" />
  </svg>
);
const IconAward = () => (
  <svg viewBox="0 0 40 40" fill="none" className="w-10 h-10" stroke="currentColor" strokeWidth="1.5">
    <circle cx="20" cy="16" r="10" />
    <polyline points="14,24 12,36 20,30 28,36 26,24" />
    <circle cx="20" cy="16" r="5" />
    <line x1="20" y1="6" x2="20" y2="4" />
  </svg>
);

// ─── Progress Bar ─────────────────────────────────────────────────────────────
function ProgressBar({ label, percent, run, delay }: { label: string; percent: number; run: boolean; delay: number }) {
  return (
    <div className="mb-6" style={{ opacity: run ? 1 : 0, transform: run ? "translateX(0)" : "translateX(-30px)", transition: `opacity 0.6s ease ${delay}ms, transform 0.6s ease ${delay}ms` }}>
      <div className="flex justify-between mb-1">
        <span className="text-gray-700 text-sm font-medium tracking-wide">{label}</span>
        <span className="text-[#1a3d8f] text-sm font-bold">{percent}%</span>
      </div>
      <div className="h-[5px] bg-gray-200 rounded-full overflow-hidden">
        <div className="h-full rounded-full" style={{ background: "linear-gradient(90deg, #BD171D 0%, #DF1F26 100%)", width: run ? `${percent}%` : "0%", transition: `width 1.2s cubic-bezier(0.4,0,0.2,1) ${delay + 200}ms` }} />
      </div>
    </div>
  );
}

// ─── LabSection (single export) ───────────────────────────────────────────────
export default function LabSection() {
  const { ref: statsRef, inView: statsInView } = useInView(0.2);
  const { ref: heroRef,  inView: heroInView  } = useInView(0.1);
  const { ref: cardRef,  inView: cardInView  } = useInView(0.15);
  const { ref: imgRef,   inView: imgInView   } = useInView(0.15);

  const stats = [
    { icon: <IconEquipment />, value: 24,  label: "Our Equipments"  },
    { icon: <IconExpertise />, value: 272, label: "Field Expertise" },
    { icon: <IconCases />,     value: 423, label: "Complete Cases"  },
    { icon: <IconAward />,     value: 576, label: "Awards Winning"  },
  ];

  const skills = [
    { label: "Environmental Testing", percent: 85 },
    { label: "Immune system",         percent: 75 },
    { label: "Advanced Microscopy",   percent: 95 },
    { label: "Management",            percent: 80 },
  ];

  return (
    <section className="bg-gray-50 font-sans">

      {/* ── Stats Row ────────────────────────────────────────────────────────── */}
      <div ref={statsRef} className="grid grid-cols-2 md:grid-cols-4 gap-8 py-10 px-6 md:px-16 bg-white">
        {stats.map((stat, i) => (
          <div
            key={i}
            className="flex flex-col items-center text-center"
            style={{
              opacity: statsInView ? 1 : 0,
              transform: statsInView ? "translateY(0)" : "translateY(30px)",
              transition: `opacity 0.6s ease ${i * 120}ms, transform 0.6s ease ${i * 120}ms`,
            }}
          >
            <div className="text-[#1a3d8f] mb-3">{stat.icon}</div>
            <div className="text-4xl font-black text-gray-900 leading-none tracking-tight">
              <Counter target={stat.value} run={statsInView} />
            </div>
            <p className="mt-1 text-xs text-gray-500 uppercase tracking-widest font-medium">
              {stat.label}
            </p>
          </div>
        ))}
      </div>

      {/* ── Hero + Skills + Video ─────────────────────────────────────────────── */}
      <div
        ref={heroRef}
        className="relative bg-[#0d1f4c] py-16 px-6 md:px-16 overflow-hidden min-h-[480px]"
      >
        {/* Dot grid */}
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: "radial-gradient(circle, #DF1F26 1px, transparent 1px)", backgroundSize: "28px 28px" }} />
        {/* Glow blob */}
        <div className="absolute top-1/2 left-1/4 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-brand-600 rounded-full opacity-10 blur-3xl pointer-events-none" />

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 items-start max-w-7xl mx-auto">

          {/* Left */}
          <div>
            <h2
              className="text-white text-3xl md:text-4xl font-black leading-tight mb-4"
              style={{ opacity: heroInView ? 1 : 0, transform: heroInView ? "translateY(0)" : "translateY(40px)", transition: "opacity 0.7s ease 0ms, transform 0.7s ease 0ms" }}
            >
              We&apos;re Setting the New Standards in Laboratory &amp; Research Professional.
            </h2>
            <p
              className="text-brand-200 text-sm mb-10"
              style={{ opacity: heroInView ? 1 : 0, transform: heroInView ? "translateY(0)" : "translateY(30px)", transition: "opacity 0.7s ease 150ms, transform 0.7s ease 150ms" }}
            >
              We Provide All Aspects Of Medical Practice For Your Whole Family!
            </p>

            {/* Skills Card */}
            <div
              ref={cardRef}
              className="bg-white rounded-xl shadow-2xl p-7"
              style={{ opacity: cardInView ? 1 : 0, transform: cardInView ? "translateY(0)" : "translateY(50px)", transition: "opacity 0.8s ease 200ms, transform 0.8s ease 200ms" }}
            >
              {skills.map((s, i) => (
                <ProgressBar key={i} label={s.label} percent={s.percent} run={cardInView} delay={i * 150} />
              ))}
            </div>
          </div>

          {/* Right: Video */}
          <div
            ref={imgRef}
            className="relative self-center"
            style={{ opacity: imgInView ? 1 : 0, transform: imgInView ? "scale(1) translateX(0)" : "scale(0.92) translateX(40px)", transition: "opacity 0.8s ease 300ms, transform 0.8s ease 300ms" }}
          >
            <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-brand-400/20 group cursor-pointer">
              {/* Replace with <Image src="..." fill alt="lab" /> in production */}
              <div className="w-full aspect-[4/3] bg-gradient-to-br from-brand-100 via-brand-500 to-brand-800">
                <div className="absolute inset-0 flex items-center justify-center">
                  <svg viewBox="0 0 200 140" className="w-full h-full opacity-30" fill="none">
                    <circle cx="60" cy="90" r="30" stroke="white" strokeWidth="1.5" />
                    <line x1="60" y1="20" x2="60" y2="60" stroke="white" strokeWidth="2" />
                    <ellipse cx="60" cy="85" rx="8" ry="4" stroke="white" strokeWidth="1.5" />
                    <line x1="100" y1="80" x2="150" y2="100" stroke="white" strokeWidth="1.5" />
                    <circle cx="155" cy="103" r="6" stroke="white" strokeWidth="1.5" />
                  </svg>
                  <span className="absolute text-white/40 text-xs tracking-widest uppercase">Lab Research</span>
                </div>
              </div>
              {/* Play Button */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-16 h-16 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-xl group-hover:scale-110 group-hover:bg-white transition-transform duration-300">
                  <svg viewBox="0 0 24 24" fill="#1a3d8f" className="w-7 h-7 translate-x-0.5">
                    <polygon points="5,3 19,12 5,21" />
                  </svg>
                </div>
              </div>
              {/* Hover shine */}
              <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
