import { motion } from 'motion/react';

export default function AnimatedCubeLogo() {
  return (
    <div className="w-10 h-10 flex items-center justify-center" style={{ perspective: '900px' }}>
      <motion.div
        className="relative w-7 h-7 cube-wireframe"
        style={{ transformStyle: 'preserve-3d' }}
        initial={{ rotateX: -14, rotateY: 16, rotateZ: -2 }}
        animate={{
          rotateX: [-14, -10, -14],
          rotateY: [16, 196, 376],
          rotateZ: [-2, 0, -2],
        }}
        transition={{ duration: 16, repeat: Infinity, ease: 'linear' }}
      >
        <svg viewBox="0 0 72 72" className="absolute inset-0 w-full h-full overflow-visible">
          <defs>
            <linearGradient id="cubeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#b6f0ff" />
              <stop offset="45%" stopColor="#39d5ff" />
              <stop offset="100%" stopColor="#2d7dff" />
            </linearGradient>
            <filter id="cubeGlow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="1.8" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>
          <g filter="url(#cubeGlow)">
            <path
              d="M36 10 55 22 55 47 36 59 17 47 17 22 Z"
              fill="none"
              stroke="url(#cubeGradient)"
              strokeWidth="3.4"
              strokeLinejoin="round"
              strokeLinecap="round"
            />
            <path
              d="M36 10 36 59"
              fill="none"
              stroke="url(#cubeGradient)"
              strokeWidth="3.4"
              strokeLinejoin="round"
              strokeLinecap="round"
            />
            <path
              d="M17 22 36 34 55 22"
              fill="none"
              stroke="url(#cubeGradient)"
              strokeWidth="3.4"
              strokeLinejoin="round"
              strokeLinecap="round"
            />
          </g>
        </svg>
      </motion.div>
    </div>
  );
}
