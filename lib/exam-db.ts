import Dexie, { type EntityTable } from 'dexie'

export interface ExamQuestion {
  id: string
  subject: string
  grade: string
  concept: string
  questionText: string
  options: string[]
  correctAnswer: string
  simplifiedExplanation: string
  difficulty: 'easy' | 'medium' | 'hard'
  alternativeQuestionId?: string
}

export interface ExamAnswer {
  id: string
  questionId: string
  studentId: string
  studentAnswer: string
  isCorrect: boolean
  timestamp: Date
  synced: boolean
}

export interface ExamProgress {
  studentId: string
  examId: string
  currentQuestionIndex: number
  score: number
  startedAt: Date
  completedAt?: Date
  synced: boolean
}

const examDB = new Dexie('ExamEngineDB') as Dexie & {
  questions: EntityTable<ExamQuestion, 'id'>
  answers: EntityTable<ExamAnswer, 'id'>
  progress: EntityTable<ExamProgress, 'studentId'>
}

examDB.version(1).stores({
  questions: 'id, subject, grade, concept, difficulty',
  answers: 'id, questionId, studentId, synced',
  progress: 'studentId, examId',
})

export async function saveQuestions(questions: ExamQuestion[]) {
  await examDB.questions.bulkPut(questions)
}

export async function getQuestions(subject?: string, grade?: string) {
  let collection = examDB.questions.toCollection()
  if (subject && grade) {
    return examDB.questions
      .where({ subject, grade })
      .toArray()
  }
  return examDB.questions.toArray()
}

export async function getQuestionById(id: string) {
  return examDB.questions.get(id)
}

export async function saveAnswer(answer: ExamAnswer) {
  await examDB.answers.put(answer)
}

export async function getUnsyncedAnswers() {
  return examDB.answers.where({ synced: false }).toArray()
}

export async function markAnswerSynced(id: string) {
  await examDB.answers.update(id, { synced: true })
}

export async function saveProgress(progress: ExamProgress) {
  await examDB.progress.put(progress)
}

export async function getProgress(studentId: string) {
  return examDB.progress.get(studentId)
}

export async function clearAllData() {
  await examDB.questions.clear()
  await examDB.answers.clear()
  await examDB.progress.clear()
}

export default examDB
