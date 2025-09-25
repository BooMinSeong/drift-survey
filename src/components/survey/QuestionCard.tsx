interface QuestionCardProps {
  question: string
  questionNumber: number
  totalQuestions: number
}

export default function QuestionCard({ question, questionNumber, totalQuestions }: QuestionCardProps) {
  return (
    <div className="text-center text-white space-y-4">
      <div className="text-sm text-slate-400">
        {questionNumber} / {totalQuestions}
      </div>

      <h2 className="text-2xl md:text-3xl font-light leading-relaxed">
        {question}
      </h2>

      {/* Progress indicator */}
      <div className="w-full bg-slate-700/30 rounded-full h-1">
        <div
          className="bg-blue-400 h-1 rounded-full transition-all duration-500"
          style={{ width: `${(questionNumber / totalQuestions) * 100}%` }}
        />
      </div>
    </div>
  )
}