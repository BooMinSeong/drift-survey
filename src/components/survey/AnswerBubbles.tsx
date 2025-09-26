'use client'

import { Answer } from '@/types'

interface AnswerBubblesProps {
  answers: Answer[]
  selectedAnswerId: string | null
  onSelect: (answer: Answer) => void
}

export default function AnswerBubbles({ answers, selectedAnswerId, onSelect }: AnswerBubblesProps) {
  return (
    <div className="w-full relative z-20">
      {/* Horizontal scrollable container */}
      <div className="overflow-x-auto overflow-y-visible pt-6 pb-4 snap-x snap-mandatory">
        <div className="flex space-x-6 px-8">
          {answers.map((answer) => {
            const isSelected = selectedAnswerId === answer.id

            return (
              <button
                key={answer.id}
                onClick={() => onSelect(answer)}
                className={`
                  flex-shrink-0 px-8 py-6 rounded-full border-2 transition-all duration-300
                  w-[280px] text-center font-medium snap-center transform
                  ${
                    isSelected
                      ? 'bg-blue-600/30 border-blue-400 text-blue-200 scale-105'
                      : 'bg-slate-800/50 border-slate-600/50 text-slate-300 hover:bg-slate-700/50 hover:border-slate-500/50'
                  }
                  active:scale-95
                `}
              >
                {answer.text}
              </button>
            )
          })}
        </div>
      </div>

      {/* Selection hint */}
      <div className="text-center text-slate-500 text-sm mt-2">
        {selectedAnswerId ? '선택됨 • 아래 버튼을 눌러 계속하세요' : '답변을 선택해주세요'}
      </div>
    </div>
  )
}