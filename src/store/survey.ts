import { create } from 'zustand'
import { SurveyState, Coordinate } from '@/types'

interface SurveyStore extends SurveyState {
  // Actions
  nextQuestion: () => void
  prevQuestion: () => void
  addResponse: (questionId: string, answerId: string, coordinates: Coordinate) => void
  addCoordinate: (coordinate: Coordinate) => void
  reset: () => void
  complete: () => void
}

export const useSurveyStore = create<SurveyStore>((set) => ({
  // Initial state
  currentQuestionIndex: 0,
  responses: [],
  coordinates: [],
  isComplete: false,

  // Actions
  nextQuestion: () =>
    set((state) => ({
      currentQuestionIndex: Math.min(state.currentQuestionIndex + 1, 4) // Assuming 5 questions max
    })),

  prevQuestion: () =>
    set((state) => ({
      currentQuestionIndex: Math.max(state.currentQuestionIndex - 1, 0)
    })),

  addResponse: (questionId: string, answerId: string, coordinates: Coordinate) =>
    set((state) => ({
      responses: [
        ...state.responses.filter(r => r.question_id !== questionId),
        {
          question_id: questionId,
          answer_id: answerId,
          coordinates
        }
      ]
    })),

  addCoordinate: (coordinate: Coordinate) =>
    set((state) => ({
      coordinates: [...state.coordinates, coordinate]
    })),

  complete: () =>
    set({ isComplete: true }),

  reset: () =>
    set({
      currentQuestionIndex: 0,
      responses: [],
      coordinates: [],
      isComplete: false
    })
}))