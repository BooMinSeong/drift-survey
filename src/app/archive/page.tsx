'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import NebulaCanvas from '@/components/canvas/NebulaCanvas'
import FloatingElements from '@/components/animations/FloatingElements'
import WaveBackground from '@/components/animations/WaveBackground'
import { useSurveyStore } from '@/store/survey'
import { Coordinate } from '@/types'

interface ArchiveData {
  coordinates: (Coordinate & { created_at: string })[]
  total_points: number
  total_responses: number
}

export default function ArchivePage() {
  const [archiveData, setArchiveData] = useState<ArchiveData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()
  const { reset } = useSurveyStore()

  useEffect(() => {
    const fetchArchiveData = async () => {
      try {
        const response = await fetch('/api/archive')
        if (!response.ok) {
          throw new Error('Failed to fetch archive data')
        }
        const data = await response.json()
        setArchiveData(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error')
      } finally {
        setIsLoading(false)
      }
    }

    fetchArchiveData()
  }, [])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 flex items-center justify-center">
        <div className="text-white text-center space-y-4">
          <div className="w-8 h-8 border-2 border-blue-400 border-t-transparent rounded-full animate-spin mx-auto" />
          <p>표류의 흔적들을 불러오는 중...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 flex items-center justify-center">
        <div className="text-white text-center space-y-4">
          <p className="text-red-400">데이터를 불러올 수 없습니다</p>
          <p className="text-slate-400">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-blue-600/20 border border-blue-400/30 rounded-full hover:bg-blue-600/30 transition-colors"
          >
            다시 시도
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 flex flex-col items-center justify-center p-4 relative overflow-hidden">
      <WaveBackground />
      <FloatingElements />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="max-w-6xl mx-auto text-center text-white space-y-8 relative z-10"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="space-y-4"
        >
          <h2 className="text-4xl font-light">표류 아카이브</h2>
          <p className="text-slate-300 text-lg">
            모든 방문자들이 남긴 표류의 흔적입니다
          </p>

          {archiveData && (
            <div className="flex justify-center space-x-8 text-sm text-slate-400">
              <span>{archiveData.total_responses}명의 참여자</span>
              <span>{archiveData.total_points}개의 좌표</span>
            </div>
          )}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="bg-slate-900/30 backdrop-blur-sm border border-slate-600/20 rounded-lg p-4 min-h-[600px] relative"
        >
          {archiveData?.coordinates && archiveData.coordinates.length > 0 ? (
            <>
              <NebulaCanvas
                coordinates={archiveData.coordinates}
                className="rounded-lg"
              />

              {/* Overlay info */}
              <div className="absolute top-4 left-4 text-slate-400 text-sm">
                <div>실시간 성운 시각화</div>
                <div className="text-xs opacity-75 mt-1">
                  각 점은 한 사람의 선택을 나타냅니다
                </div>
              </div>
            </>
          ) : (
            <div className="flex items-center justify-center h-full">
              <div className="text-center text-slate-400">
                <p className="text-lg mb-2">아직 데이터가 없습니다</p>
                <p className="text-sm">첫 번째 참여자가 되어보세요</p>
              </div>
            </div>
          )}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
        >
          <button
            onClick={() => {
              reset()
              router.push('/')
            }}
            className="inline-block px-6 py-3 bg-blue-600/20 hover:bg-blue-600/30 border border-blue-400/30 rounded-full text-blue-200 transition-all duration-300 hover:scale-105"
          >
            ← 처음으로 돌아가기
          </button>
        </motion.div>
      </motion.div>
    </div>
  )
}