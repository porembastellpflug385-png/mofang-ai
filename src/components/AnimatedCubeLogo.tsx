import { motion } from 'motion/react';

export default function AnimatedCubeLogo() {
  return (
    <div className="w-10 h-10 flex items-center justify-center" style={{ perspective: '1200px' }}>
      <motion.div
        className="relative w-7 h-7 cube-wireframe"
        style={{ transformStyle: 'preserve-3d' }}
        initial={{ rotateX: -18, rotateY: 24, rotateZ: -4 }}
        animate={{
          rotateX: [-18, -14, -18],
          rotateY: [24, 204, 384],
          rotateZ: [-4, -2, -4],
        }}
        transition={{ duration: 18, repeat: Infinity, ease: 'linear' }}
      >
        <svg viewBox="0 0 72 72" className="absolute inset-0 w-full h-full overflow-visible">
          <defs>
            <linearGradient id="cubeGradientA" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#d7f6ff" />
              <stop offset="45%" stopColor="#4adeff" />
              <stop offset="100%" stopColor="#2563ff" />
            </linearGradient>
            <filter id="cubeGlow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="1.35" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>
          <g filter="url(#cubeGlow)">
            <path
              d="M36 10 55 21.5 55 49.5 36 61 17 49.5 17 21.5 Z"
              fill="none"
              stroke="url(#cubeGradientA)"
              strokeWidth="3.1"
              strokeLinejoin="round"
              strokeLinecap="round"
            />
            <path
              d="M36 32.5 36 61"
              fill="none"
              stroke="url(#cubeGradientA)"
              strokeWidth="3.1"
              strokeLinejoin="round"
              strokeLinecap="round"
            />
            <path
              d="M17 21.5 36 32.5 55 21.5"
              fill="none"
              stroke="url(#cubeGradientA)"
              strokeWidth="3.1"
              strokeLinejoin="round"
              strokeLinecap="round"
            />
          </g>
        </svg>
      </motion.div>
    </div>
  );
}
