'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import FloatingElements from '@/components/animations/FloatingElements'
import WaveBackground from '@/components/animations/WaveBackground'

export default function CoverPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 flex flex-col items-center justify-center p-4 relative overflow-hidden">
      <WaveBackground />
      <FloatingElements />

      <div className="max-w-md mx-auto text-center text-white space-y-8 relative z-10">
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.2 }}
          className="text-6xl font-light tracking-wider"
        >
          표류
        </motion.h1>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="space-y-4"
        >
          <motion.p
            animate={{
              y: [0, -2, 0],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
            className="text-slate-300 text-lg font-light"
          >
            당신만의 표류의 흔적을 남겨보세요
          </motion.p>
          <p className="text-slate-400 text-sm">
            Artist: HELI
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 1 }}
        >
          <Link
            href="/intro"
            className="inline-block bg-blue-600/20 hover:bg-blue-600/30 border border-blue-400/30 px-8 py-3 rounded-full text-blue-200 transition-all duration-300 hover:scale-105"
          >
            입장하기 →
          </Link>
        </motion.div>
      </div>
    </div>
  )
}
