'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useSurveyStore } from '@/store/survey'
import { getQuestionByIndex, getTotalQuestions } from '@/lib/survey-data'
import { Answer } from '@/types'
import CanvasGraph from '@/components/canvas/CanvasGraph'
import QuestionCard from '@/components/survey/QuestionCard'
import AnswerBubbles from '@/components/survey/AnswerBubbles'
import FlowButton from '@/components/survey/FlowButton'
import FloatingElements from '@/components/animations/FloatingElements'

export default function SurveyPage() {
  const router = useRouter()
  const {
    currentQuestionIndex,
    coordinates,
    addResponse,
    addCoordinate,
    nextQuestion,
    complete
  } = useSurveyStore()

  const [selectedAnswer, setSelectedAnswer] = useState<Answer | null>(null)
  const [isAnimating, setIsAnimating] = useState(false)

  const currentQuestion = getQuestionByIndex(currentQuestionIndex)
  const totalQuestions = getTotalQuestions()

  // Reset selected answer when question changes
  useEffect(() => {
    setSelectedAnswer(null)
  }, [currentQuestionIndex])

  if (!currentQuestion) {
    router.push('/result')
    return null
  }

  const handleAnswerSelect = (answer: Answer) => {
    setSelectedAnswer(answer)
  }

  const handleFlow = async () => {
    if (!selectedAnswer) return

    setIsAnimating(true)

    // Add response to store
    addResponse(currentQuestion.id, selectedAnswer.id, selectedAnswer.coordinates)
    addCoordinate(selectedAnswer.coordinates)

    // Wait for animation with automatic progression
    setTimeout(() => {
      handleAnimationComplete()
    }, 1000) // 1 second animation time
  }

  const handleAnimationComplete = () => {
    setIsAnimating(false)

    // Check if this was the last question
    if (currentQuestionIndex >= totalQuestions - 1) {
      complete()
      setTimeout(() => {
        router.push('/result')
      }, 1000)
    } else {
      nextQuestion()
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 relative overflow-hidden">
      <FloatingElements />

      {/* Content */}
      <div className="relative z-10 flex flex-col min-h-screen">
        {/* Question Section */}
        <div className="flex-1 flex items-center justify-center">
          <div className="w-full space-y-12 px-4">
            <QuestionCard
              question={currentQuestion.text}
              questionNumber={currentQuestionIndex + 1}
              totalQuestions={totalQuestions}
            />
          </div>
        </div>

        {/* Coordinate Visualization Area */}
        <div className="w-full h-[min(375px,80vw)] mb-12 relative z-10">
          <CanvasGraph
            coordinates={coordinates}
            animateNewPoint={isAnimating}
            className=""
          />
        </div>

        {/* Answer Section */}
        <div className="pb-32 relative z-20">
          <AnswerBubbles
            answers={currentQuestion.answers}
            selectedAnswerId={selectedAnswer?.id || null}
            onSelect={handleAnswerSelect}
          />
        </div>
      </div>

      {/* Flow Button */}
      <FlowButton
        onClick={handleFlow}
        disabled={!selectedAnswer}
        isLoading={isAnimating}
      >
        흘러가기 →
      </FlowButton>
    </div>
  )
}