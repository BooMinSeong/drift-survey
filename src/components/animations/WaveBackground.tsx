'use client'

import { motion } from 'framer-motion'

export default function WaveBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Wave layers */}
      <motion.div
        className="absolute inset-0 opacity-5"
        animate={{
          backgroundPosition: ['0% 0%', '100% 100%'],
        }}
        transition={{
          duration: 60,
          repeat: Infinity,
          ease: 'linear',
        }}
        style={{
          backgroundImage: `
            radial-gradient(circle at 20% 80%, rgba(120, 119, 198, 0.3) 0%, transparent 50%),
            radial-gradient(circle at 80% 20%, rgba(255, 119, 198, 0.3) 0%, transparent 50%),
            radial-gradient(circle at 40% 40%, rgba(120, 219, 255, 0.2) 0%, transparent 50%)
          `,
          backgroundSize: '200% 200%',
        }}
      />

      <motion.div
        className="absolute inset-0 opacity-10"
        animate={{
          backgroundPosition: ['100% 100%', '0% 0%'],
        }}
        transition={{
          duration: 40,
          repeat: Infinity,
          ease: 'linear',
        }}
        style={{
          backgroundImage: `
            linear-gradient(45deg, transparent 40%, rgba(120, 119, 198, 0.1) 50%, transparent 60%),
            linear-gradient(-45deg, transparent 40%, rgba(255, 119, 198, 0.1) 50%, transparent 60%)
          `,
          backgroundSize: '400% 400%',
        }}
      />
    </div>
  )
}