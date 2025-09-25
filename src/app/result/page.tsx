'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { useSurveyStore } from '@/store/survey'
import CanvasGraph from '@/components/canvas/CanvasGraph'
import FloatingElements from '@/components/animations/FloatingElements'

export default function ResultPage() {
  const router = useRouter()
  const { coordinates, responses, isComplete } = useSurveyStore()
  const [isSaved, setIsSaved] = useState(false)

  useEffect(() => {
    // Redirect to survey if not completed
    if (!isComplete || coordinates.length === 0) {
      router.push('/survey')
      return
    }

    // Save responses to server
    const saveResponses = async () => {
      if (isSaved) return

      try {
        const response = await fetch('/api/responses', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            responses,
            coordinates
          })
        })

        if (response.ok) {
          setIsSaved(true)
        } else {
          console.error('Failed to save responses')
        }
      } catch (error) {
        console.error('Error saving responses:', error)
      }
    }

    saveResponses()
  }, [isComplete, coordinates, responses, isSaved])

  if (!isComplete || coordinates.length === 0) {
    return null
  }

  const handleSaveTrace = () => {
    // TODO: Implement canvas to image conversion
    const canvas = document.querySelector('canvas')
    if (canvas) {
      const link = document.createElement('a')
      link.download = 'my-drift-trace.png'
      link.href = canvas.toDataURL()
      link.click()
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 flex flex-col items-center justify-center p-4 relative overflow-hidden">
      <FloatingElements />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="max-w-4xl mx-auto text-center text-white space-y-8 relative z-10"
      >
        <motion.h2
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-4xl font-light"
        >
          당신의 표류의 흔적입니다
        </motion.h2>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="bg-slate-800/30 backdrop-blur-sm border border-slate-600/30 rounded-lg p-4 min-h-[400px] relative"
        >
          <CanvasGraph
            coordinates={coordinates}
            className="rounded-lg"
          />

          {/* Overlay info */}
          <div className="absolute top-4 left-4 text-slate-400 text-sm">
            {coordinates.length}개의 점이 연결되었습니다
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="space-y-4"
        >
          <button
            onClick={handleSaveTrace}
            className="block w-full bg-green-600/20 hover:bg-green-600/30 border border-green-400/30 px-6 py-3 rounded-full text-green-200 transition-all duration-300 hover:scale-105"
          >
            나의 흔적 저장하기
          </button>

          <Link
            href="/archive"
            className="block w-full bg-blue-600/20 hover:bg-blue-600/30 border border-blue-400/30 px-6 py-3 rounded-full text-blue-200 transition-all duration-300 hover:scale-105"
          >
            다른 이들의 흔적 보기
          </Link>
        </motion.div>
      </motion.div>
    </div>
  )
}