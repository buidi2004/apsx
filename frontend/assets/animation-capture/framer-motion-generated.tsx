// Generated from ASUS ROG Scroll-Keyframe Sampling (0% -> 100%)
import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';

export function RogParallaxHero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  const opacity = useTransform(scrollYProgress, [0, 0.25, 0.5, 0.75, 1], [1, 0.9, 0.5, 0.2, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.25, 0.5, 0.75, 1], [1, 1.05, 1.15, 1.25, 1.4]);

  return (
    <div ref={containerRef} className="relative h-[250vh] bg-black">
      <motion.div 
        style={{ opacity, scale }}
        className="sticky top-0 h-screen w-full flex items-center justify-center overflow-hidden"
      >
        <h1 className="text-6xl font-black text-white uppercase tracking-widest">
          FOR THOSE WHO DARE
        </h1>
      </motion.div>
    </div>
  );
}