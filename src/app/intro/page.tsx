'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'

export default function IntroPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 flex flex-col items-center justify-center">
      <div className="w-full text-center text-white space-y-8 px-4">
        <div className="space-y-6">
          <motion.h2
            initial={{ opacity: 0, x: -30 }}
            animate={{
              opacity: 1,
              x: 0,
              y: [0, -3, 0]
            }}
            transition={{
              duration: 0.8,
              y: {
                duration: 4,
                repeat: Infinity,
                ease: 'easeInOut'
              }
            }}
            className="text-3xl font-light"
          >표류 프로젝트에 오신 것을 환영합니다</motion.h2>

          <div className="text-slate-300 space-y-4 text-base leading-relaxed">
            <p>
              이곳에서 당신은 몇 개의 질문에 답하게 됩니다.
            </p>
            <p>
              각 답변은 고유한 좌표가 되어 당신만의 그래프를 그려나갈 것입니다.
            </p>
            <p>
              모든 참여자들의 흔적이 모여 거대한 성운을 이루게 됩니다.
            </p>
          </div>
        </div>

        <Link
          href="/survey"
          className="inline-block bg-blue-600/20 hover:bg-blue-600/30 border border-blue-400/30 px-8 py-3 rounded-full text-blue-200 transition-all duration-300 hover:scale-105"
        >
          시작하기 →
        </Link>
      </div>
    </div>
  )
}