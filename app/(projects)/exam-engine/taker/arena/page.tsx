'use client'

import { useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { CheckCircle2, XCircle, ArrowLeft, RotateCcw } from 'lucide-react'
import IconFrame from '@/components/exam-engine/IconFrame'
import SmartTooltip from '@/components/exam-engine/SmartTooltip'
import { usePsychMessage } from '@/lib/psych-support'
import { saveAnswer } from '@/lib/exam-db'

interface Question {
  id: string
  text: string
  options: string[]
  correctIndex: number
  explanation: string
  concept: string
  alternative?: Question
}

const mockQuestions: Question[] = [
  {
    id: 'q1',
    text: 'ما حاصل ضرب 5 × 12؟',
    options: ['50', '60', '55', '65'],
    correctIndex: 1,
    explanation: '5 × 12 = 60. نضرب 5 في 12 فنحصل على 60.',
    concept: 'الضرب',
    alternative: {
      id: 'q1-alt',
      text: 'ما ناتج 6 × 10؟',
      options: ['50', '60', '70', '40'],
      correctIndex: 1,
      explanation: '6 × 10 = 60. جدول الضرب البسيط.',
      concept: 'الضرب',
    },
  },
  {
    id: 'q2',
    text: 'ما عاصمة المملكة العربية السعودية؟',
    options: ['جدة', 'مكة المكرمة', 'الرياض', 'الدمام'],
    correctIndex: 2,
    explanation: 'الرياض هي عاصمة المملكة العربية السعودية.',
    concept: 'الجغرافيا',
  },
  {
    id: 'q3',
    text: 'كم عدد أضلاع المثلث؟',
    options: ['2', '3', '4', '5'],
    correctIndex: 1,
    explanation: 'المثلث له 3 أضلاع.',
    concept: 'الأشكال الهندسية',
  },
]

type FeedbackState = 'correct' | 'wrong' | null

export default function ArenaPage() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [feedback, setFeedback] = useState<FeedbackState>(null)
  const [showExplanation, setShowExplanation] = useState(false)
  const [isAlternative, setIsAlternative] = useState(false)
  const [score, setScore] = useState(0)
  const [finished, setFinished] = useState(false)
  const [currentQuestionAlt, setCurrentQuestionAlt] = useState<Question | null>(null)
  const psych = usePsychMessage()

  const currentQuestion = isAlternative && currentQuestionAlt
    ? currentQuestionAlt
    : mockQuestions[currentIndex] ?? null

  const question = currentQuestion

  const goNext = useCallback(() => {
    setFeedback(null)
    setShowExplanation(false)
    setIsAlternative(false)
    setCurrentQuestionAlt(null)

    if (currentIndex < mockQuestions.length - 1) {
      setCurrentIndex((i) => i + 1)
    } else {
      setFinished(true)
    }
  }, [currentIndex])

  const handleAnswer = useCallback(async (selectedIndex: number) => {
    if (!question || feedback) return

    const isCorrect = selectedIndex === question.correctIndex

    await saveAnswer({
      id: `${question.id}-${Date.now()}`,
      questionId: question.id,
      studentId: 'local-student',
      studentAnswer: question.options[selectedIndex],
      isCorrect,
      timestamp: new Date(),
      synced: false,
    })

    if (isCorrect) {
      setFeedback('correct')
      setScore((s) => s + 1)
      setTimeout(() => {
        goNext()
      }, 1500)
    } else {
      setFeedback('wrong')
      if (question.alternative) {
        setShowExplanation(true)
        setCurrentQuestionAlt(question.alternative)
        setTimeout(() => {
          setFeedback(null)
          setShowExplanation(false)
          setIsAlternative(true)
        }, 2500)
      } else {
        setShowExplanation(true)
        setTimeout(() => {
          goNext()
        }, 2500)
      }
    }
  }, [question, feedback, goNext])

  if (finished) {
    const percentage = Math.round((score / mockQuestions.length) * 100)
    return (
      <div className="min-h-screen p-4 md:p-8 flex items-center justify-center" dir="rtl">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: 'spring', stiffness: 100, damping: 20 }}
          className="glass-card rounded-3xl p-8 md:p-12 max-w-md w-full glow-card text-center"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 200, damping: 15 }}
          >
            <IconFrame
              icon={percentage >= 70 ? <CheckCircle2 className="w-10 h-10 text-green-500" /> : <RotateCcw className="w-10 h-10" />}
              audience="student"
              className="mx-auto"
            />
          </motion.div>

          <h2 className="text-2xl font-bold mt-6">
            {percentage >= 70 ? 'أحسنتِ! 🎉' : 'لا بأس، حاولي مجدداً'}
          </h2>

          <div className="mt-4 glass-card rounded-2xl p-6">
            <div className="text-4xl font-bold" style={{ color: 'var(--primary)' }}>
              {score}/{mockQuestions.length}
            </div>
            <p className="text-sm mt-2" style={{ color: 'var(--text-muted)' }}>
              {psych.getResult()}
            </p>
          </div>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => {
              setCurrentIndex(0)
              setScore(0)
              setFinished(false)
              setFeedback(null)
              setShowExplanation(false)
              setIsAlternative(false)
              setCurrentQuestionAlt(null)
            }}
            className="glass-card rounded-2xl px-8 py-4 flex items-center gap-3 cursor-pointer glow-card mx-auto mt-6"
          >
            <RotateCcw className="w-5 h-5" />
            <span className="font-semibold">حاولي مرة أخرى</span>
          </motion.button>
        </motion.div>
      </div>
    )
  }

  if (!question) return null

  return (
    <div className="min-h-screen p-4 md:p-8 flex items-center justify-center" dir="rtl">
      <div className="max-w-2xl w-full space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <IconFrame icon={<ArrowLeft className="w-6 h-6" />} audience="student" />
            <div>
              <h2 className="text-lg font-bold">حلبة الاختبار</h2>
              <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
                السؤال {currentIndex + 1} من {mockQuestions.length}
              </p>
            </div>
          </div>
          <div className="glass-card rounded-xl px-4 py-2 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4" style={{ color: 'var(--primary)' }} />
            <span className="font-bold text-sm">{score}</span>
          </div>
        </div>

        <div className="glass-card rounded-3xl p-6 md:p-8 glow-card">
          <div className="flex items-start gap-2 mb-2">
            <span className="text-xs px-2 py-1 rounded-md" style={{ backgroundColor: 'var(--primary-light)', color: 'var(--primary)' }}>
              {question.concept}
            </span>
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={question.id}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ type: 'spring', stiffness: 100, damping: 20 }}
            >
              <p className="text-xl md:text-2xl font-bold mt-4 mb-8 leading-relaxed">
                {question.text}
              </p>

              <div className="space-y-3">
                {question.options.map((option, idx) => {
                  let optionStyle = {}
                  if (feedback === 'correct' && idx === question.correctIndex) {
                    optionStyle = { borderColor: '#22c55e', backgroundColor: 'rgba(34,197,94,0.08)' }
                  } else if (feedback === 'wrong' && idx === question.correctIndex) {
                    optionStyle = { borderColor: '#22c55e', backgroundColor: 'rgba(34,197,94,0.08)' }
                  } else if (feedback === 'wrong') {
                    // user's wrong selection - highlight differently
                  }

                  return (
                    <SmartTooltip key={idx} message={psych.getHover()}>
                      <motion.button
                        whileHover={{ scale: feedback ? 1 : 1.02 }}
                        whileTap={{ scale: feedback ? 1 : 0.98 }}
                        onClick={() => handleAnswer(idx)}
                        disabled={!!feedback}
                        className="glass-card w-full rounded-2xl p-4 text-right flex items-center gap-4 cursor-pointer"
                        style={{
                          ...optionStyle,
                          opacity: feedback && idx !== question.correctIndex ? 0.5 : 1,
                          cursor: feedback ? 'default' : 'pointer',
                        }}
                      >
                        <span className="w-10 h-10 rounded-full glass-card flex items-center justify-center text-sm font-bold shrink-0">
                          {String.fromCharCode(65 + idx)}
                        </span>
                        <span className="font-medium text-base">{option}</span>
                        {feedback === 'correct' && idx === question.correctIndex && (
                          <CheckCircle2 className="w-6 h-6 text-green-500 mr-auto" />
                        )}
                      </motion.button>
                    </SmartTooltip>
                  )
                })}
              </div>
            </motion.div>
          </AnimatePresence>

          <AnimatePresence>
            {showExplanation && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ type: 'spring', stiffness: 100, damping: 20 }}
                className="mt-6 glass-card rounded-2xl p-5 overflow-hidden"
                style={{ borderRight: '4px solid var(--primary)' }}
              >
                <p className="text-sm font-semibold mb-2" style={{ color: 'var(--primary)' }}>
                  {psych.getWrong()}
                </p>
                <p className="text-sm leading-relaxed" style={{ color: 'var(--text-muted)' }}>
                  {question.explanation}
                </p>
                {question.alternative && (
                  <p className="text-xs mt-3 font-medium">
                    تابعي السؤال البديل لنفس الفكرة...
                  </p>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="flex items-center justify-center gap-2">
          {mockQuestions.map((_, idx) => (
            <div
              key={idx}
              className="w-3 h-3 rounded-full transition-all duration-300"
              style={{
                backgroundColor: idx === currentIndex ? 'var(--primary)' : 'var(--card-border)',
                transform: idx === currentIndex ? 'scale(1.3)' : 'scale(1)',
              }}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
