import { motion } from 'motion/react';

export default function AnimatedCubeLogo() {
  return (
    <div className="w-10 h-10 flex items-center justify-center" style={{ perspective: '900px' }}>
      <motion.div
        className="relative w-7 h-7 cube-wireframe"
        style={{ transformStyle: 'preserve-3d' }}
        initial={{ rotateX: -18, rotateY: 22, rotateZ: -4 }}
        animate={{
          rotateX: [-18, -12, -18],
          rotateY: [22, 202, 382],
          rotateZ: [-4, -1, -4],
        }}
        transition={{ duration: 14, repeat: Infinity, ease: 'linear' }}
      >
        <svg viewBox="0 0 72 72" className="absolute inset-0 w-full h-full overflow-visible">
          <defs>
            <linearGradient id="cubeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#67e8f9" />
              <stop offset="45%" stopColor="#22d3ee" />
              <stop offset="100%" stopColor="#c084fc" />
            </linearGradient>
          </defs>
          <path d="M36 8 60 22 60 50 36 64 12 50 12 22 Z" fill="none" stroke="url(#cubeGradient)" strokeWidth="5" strokeLinejoin="round" strokeLinecap="round" />
          <path d="M36 8 36 64" fill="none" stroke="url(#cubeGradient)" strokeWidth="5" strokeLinejoin="round" strokeLinecap="round" />
          <path d="M12 22 36 36 60 22" fill="none" stroke="url(#cubeGradient)" strokeWidth="5" strokeLinejoin="round" strokeLinecap="round" />
        </svg>
      </motion.div>
    </div>
  );
}
