export interface Question {
  id: string
  text: string
  answers: Answer[]
}

export interface Answer {
  id: string
  text: string
  coordinates: {
    x: number
    y: number
  }
}

export interface Survey {
  id: string
  questions: Question[]
  created_at: string
}

export interface UserResponse {
  id: string
  user_session: string
  survey_id: string
  answers: {
    question_id: string
    answer_id: string
    coordinates: {
      x: number
      y: number
    }
  }[]
  created_at: string
}

export interface Coordinate {
  x: number
  y: number
}

export interface SurveyState {
  currentQuestionIndex: number
  responses: UserResponse['answers']
  coordinates: Coordinate[]
  isComplete: boolean
}