import { motion } from 'motion/react';

const faces = [
  'translateZ(11px)',
  'rotateY(180deg) translateZ(11px)',
  'rotateY(90deg) translateZ(11px)',
  'rotateY(-90deg) translateZ(11px)',
  'rotateX(90deg) translateZ(11px)',
  'rotateX(-90deg) translateZ(11px)',
];

export default function AnimatedCubeLogo() {
  return (
    <div className="w-9 h-9 flex items-center justify-center" style={{ perspective: '700px' }}>
      <motion.div
        className="relative w-5 h-5 cube-wireframe"
        style={{ transformStyle: 'preserve-3d' }}
        initial={{ rotateX: -28, rotateY: 25 }}
        animate={{ rotateX: [-28, -28, 332], rotateY: [25, 205, 385] }}
        transition={{ duration: 9, repeat: Infinity, ease: 'linear' }}
      >
        {faces.map((transform) => (
          <div
            key={transform}
            className="absolute inset-0 rounded-[2px] border border-current bg-transparent"
            style={{ transform }}
          />
        ))}
      </motion.div>
    </div>
  );
}
