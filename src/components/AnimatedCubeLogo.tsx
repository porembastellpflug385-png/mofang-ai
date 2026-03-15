import { motion } from 'motion/react';

const edges = [
  { width: 26, height: 26, transform: 'translateZ(13px)' },
  { width: 26, height: 26, transform: 'rotateY(90deg) translateZ(13px)' },
  { width: 26, height: 26, transform: 'rotateX(90deg) translateZ(13px)' },
];

export default function AnimatedCubeLogo() {
  return (
    <div className="w-10 h-10 flex items-center justify-center" style={{ perspective: '900px' }}>
      <motion.div
        className="relative w-6 h-6 cube-wireframe"
        style={{ transformStyle: 'preserve-3d' }}
        initial={{ rotateX: -26, rotateY: 34, rotateZ: -14 }}
        animate={{
          rotateX: [-26, -18, -26],
          rotateY: [34, 214, 394],
          rotateZ: [-14, -8, -14],
        }}
        transition={{ duration: 13, repeat: Infinity, ease: 'linear' }}
      >
        {edges.map((edge) => (
          <div
            key={edge.transform}
            className="absolute left-0 top-0 border border-current bg-transparent"
            style={{
              width: edge.width,
              height: edge.height,
              transform: edge.transform,
            }}
          />
        ))}
      </motion.div>
    </div>
  );
}
