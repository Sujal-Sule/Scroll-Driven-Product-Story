"use client";

import PhoneScroll from "@/components/PhoneScroll";
import { useScroll, useTransform, motion, MotionValue } from "framer-motion";
import { useRef, useState } from "react";

// Helper for fading text in/out based on scroll ranges
function TextSection({
  children,
  range,
  className = "",
  scrollYProgress,
}: {
  children: React.ReactNode;
  range: [number, number];
  className?: string;
  scrollYProgress: MotionValue<number>;
}) {
  const opacity = useTransform(
    scrollYProgress,
    [range[0] - 0.05, range[0], range[1], range[1] + 0.05],
    [0, 1, 1, 0]
  );

  const y = useTransform(
    scrollYProgress,
    [range[0] - 0.05, range[0], range[1], range[1] + 0.05],
    [20, 0, 0, -20]
  );

  return (
    <motion.div
      style={{ opacity, y, pointerEvents: "none" }}
      className={`fixed top-0 left-0 w-full h-full flex flex-col justify-center px-8 md:px-20 ${className}`}
    >
      {children}
    </motion.div>
  );
}

export default function Home() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [immersive, setImmersive] = useState(false);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  return (
    <main ref={containerRef} className="relative h-[400vh] bg-[#050505] selection:bg-emerald-500/30">
      <PhoneScroll immersive={immersive} onReset={() => setImmersive(false)} />

      {/* Conditionally render Scroll Text sections */}
      <motion.div
        className="fixed inset-0 pointer-events-none"
        animate={{ opacity: immersive ? 0 : 1 }}
        transition={{ duration: 0.5 }}
      >
        {/* 0% - Intro - Centered */}
        <TextSection range={[0, 0.2]} scrollYProgress={scrollYProgress} className="items-center text-center">
          <h1 className="text-5xl md:text-7xl font-bold tracking-tighter text-white/90 mb-4">
            Redmi Note 8 Pro.
          </h1>
          <p className="text-xl md:text-2xl text-white/60 font-light tracking-wide">
            Performance, Refined.
          </p>
        </TextSection>

        {/* 25-40% - Camera - Left Aligned */}
        <TextSection range={[0.25, 0.40]} scrollYProgress={scrollYProgress} className="items-start">
          <div className="max-w-xl">
            <h2 className="text-4xl md:text-6xl font-bold tracking-tight text-white/90 mb-4">
              64MP Quad Camera System.
            </h2>
            <p className="text-lg md:text-xl text-white/60">
              Capture every detail with ultra-high resolution sensors.
            </p>
          </div>
        </TextSection>

        {/* 45-65% - Battery - Right Aligned */}
        <TextSection range={[0.45, 0.65]} scrollYProgress={scrollYProgress} className="items-end text-right">
          <div className="max-w-xl">
            <h2 className="text-4xl md:text-6xl font-bold tracking-tight text-white/90 mb-4">
              Power That Lasts.
            </h2>
            <p className="text-lg md:text-xl text-white/60">
              4500mAh Battery + Liquid Cooling technology for sustained performance.
            </p>
          </div>
        </TextSection>

        {/* 70-85% - Internal Explosion - Centered */}
        <TextSection range={[0.70, 0.85]} scrollYProgress={scrollYProgress} className="items-center text-center">
          <h2 className="text-4xl md:text-6xl font-bold tracking-tight text-white/90 mb-6">
            Engineered From the Inside.
          </h2>
          <p className="text-lg md:text-xl text-white/60 max-w-2xl mx-auto">
            A symphony of precision components working in perfect harmony.
          </p>
        </TextSection>

        {/* 90-100% - Reassembly - Centered CTA */}
        <TextSection range={[0.90, 1.0]} scrollYProgress={scrollYProgress} className="items-center text-center">
          <h2 className="text-5xl md:text-8xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-white to-white/40 mb-8">
            Built to Be Experienced.
          </h2>
          <button
            onClick={() => setImmersive(true)}
            className="pointer-events-auto px-8 py-4 bg-emerald-600 hover:bg-emerald-500 text-white rounded-full font-medium transition-all transform hover:scale-105 active:scale-95 shadow-[0_0_40px_-10px_rgba(16,185,129,0.5)]"
          >
            Experience Now
          </button>
        </TextSection>

        {/* Scroll Indicator */}
        <motion.div
          style={{ opacity: useTransform(scrollYProgress, [0, 0.1], [1, 0]) }}
          className="fixed bottom-10 left-1/2 -translate-x-1/2 text-white/40 text-sm animate-pulse"
        >
          Scroll to explore
        </motion.div>
      </motion.div>
    </main>
  );
}
