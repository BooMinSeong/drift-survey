import { motion } from 'framer-motion'

interface QuestionCardProps {
  question: string
  questionNumber: number
  totalQuestions: number
}

export default function QuestionCard({ question, questionNumber, totalQuestions }: QuestionCardProps) {
  return (
    <div className="text-center text-white space-y-4">

      <motion.h2
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{
          opacity: 1,
          scale: 1,
          x: [0, 2, -2, 0]
        }}
        transition={{
          duration: 0.6,
          x: {
            duration: 5,
            repeat: Infinity,
            ease: 'easeInOut'
          }
        }}
        className="text-lg sm:text-xl lg:text-2xl font-light leading-relaxed"
      >
        {question}
      </motion.h2>

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