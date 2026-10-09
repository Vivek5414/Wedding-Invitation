import { useMemo, useState } from 'react'
import { Check, Heart, RotateCcw, Sparkles } from 'lucide-react'

import { weddingConfig } from '../data/weddingConfig'

type QuizAnswer = {
  [questionIndex: number]: string
}

export function Quiz() {
  const [answers, setAnswers] = useState<QuizAnswer>({})
  const [submitted, setSubmitted] = useState(false)

  const score = useMemo(() => {
    return weddingConfig.quizQuestions.reduce((total, question, index) => {
      if (answers[index] === question.correct) {
        return total + 1
      }
      return total
    }, 0)
  }, [answers])

  const handleAnswer = (questionIndex: number, option: string) => {
    setAnswers((current) => ({ ...current, [questionIndex]: option }))
  }

  const percentage = weddingConfig.quizQuestions.length ? Math.round((score / weddingConfig.quizQuestions.length) * 100) : 0
  const answeredCount = Object.keys(answers).length

  const resultText =
    percentage >= 75
      ? 'You officially know us better than we know ourselves 😂'
      : percentage >= 40
        ? 'You are definitely on the right track — our love story is pretty memorable.'
        : 'A few more memories and you will be catching up with us in no time.'

  return (
    <div className="relative overflow-hidden rounded-[2.25rem] border border-rose-200 bg-white shadow-[0_30px_85px_rgba(98,48,62,0.11)]">
      <div className="relative overflow-hidden bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-[#9e5a68] via-[#66384e] to-[#352331] px-6 py-7 text-white md:px-9 md:py-8">
        <div className="pointer-events-none absolute -right-8 -top-16 h-56 w-56 rounded-full border border-white/15" aria-hidden="true" />
        <div className="pointer-events-none absolute right-8 top-0 h-36 w-36 rounded-full border border-white/10" aria-hidden="true" />
        <div className="relative flex flex-col justify-between gap-5 md:flex-row md:items-center">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-[9px] font-semibold uppercase tracking-[0.22em] text-rose-100 backdrop-blur">
              <Sparkles className="h-3.5 w-3.5 text-amber-200" aria-hidden="true" /> A little love-story challenge
            </span>
            <p className="mt-2 text-sm text-white/75">Four questions about the two of us. No pressure—just for fun.</p>
          </div>
          <div className="flex shrink-0 items-center gap-3 self-start rounded-2xl border border-white/20 bg-white/10 px-4 py-3 backdrop-blur md:self-auto">
            <Heart className="h-5 w-5 fill-rose-200 text-rose-200" aria-hidden="true" />
            <div>
              <p className="text-[9px] font-semibold uppercase tracking-[0.16em] text-white/65">{submitted ? 'Your score' : 'Your progress'}</p>
              <p className="mt-0.5 text-sm font-semibold text-white">{submitted ? `${score} / ${weddingConfig.quizQuestions.length} correct` : `${answeredCount} / ${weddingConfig.quizQuestions.length} answered`}</p>
            </div>
          </div>
        </div>
        {!submitted ? (
          <div className="relative mt-6 h-1.5 overflow-hidden rounded-full bg-white/20" role="progressbar" aria-label="Quiz progress" aria-valuemin={0} aria-valuemax={weddingConfig.quizQuestions.length} aria-valuenow={answeredCount}>
            <div className="h-full rounded-full bg-gradient-to-r from-amber-200 to-rose-200 transition-all duration-500" style={{ width: `${weddingConfig.quizQuestions.length ? (answeredCount / weddingConfig.quizQuestions.length) * 100 : 0}%` }} />
          </div>
        ) : null}
      </div>

      <div className="grid gap-4 bg-[linear-gradient(145deg,#fffdfa,#fff8f5)] p-5 md:grid-cols-2 md:p-8">
        {weddingConfig.quizQuestions.map((question, index) => (
          <fieldset key={question.question} className="min-w-0 rounded-[1.5rem] border border-rose-100 bg-white p-4 shadow-[0_12px_32px_rgba(98,48,62,0.045)] md:p-5">
            <legend className="sr-only">{question.question}</legend>
            <div className="flex items-start gap-3">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-rose-100 to-amber-50 text-xs font-bold text-rose-700">
                {String(index + 1).padStart(2, '0')}
              </span>
              <div>
                <span className="text-[9px] font-semibold uppercase tracking-[0.18em] text-rose-500">Question {index + 1}</span>
                <p className="mt-1 text-base font-semibold leading-6 text-slate-900">{question.question}</p>
              </div>
            </div>
            <div className="mt-4 grid gap-2">
              {question.options.map((option) => {
                const selected = answers[index] === option

                return (
                  <button
                    key={option}
                    type="button"
                    aria-pressed={selected}
                    onClick={() => handleAnswer(index, option)}
                    className={`flex min-h-11 items-center justify-between gap-3 rounded-xl border px-3.5 py-2.5 text-left text-sm transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-500 focus-visible:ring-offset-2 ${
                      selected
                        ? 'border-rose-300 bg-gradient-to-r from-rose-50 to-amber-50 font-medium text-rose-900 shadow-sm'
                        : 'border-slate-200 bg-white text-slate-700 hover:border-rose-200 hover:bg-rose-50/50'
                    }`}
                  >
                    <span>{option}</span>
                    {selected ? <Check className="h-4 w-4 shrink-0 text-rose-600" aria-hidden="true" /> : null}
                  </button>
                )
              })}
            </div>
          </fieldset>
        ))}
      </div>

      <div className="border-t border-rose-100 bg-white px-5 py-5 md:px-8">
        {!submitted ? (
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-xs leading-5 text-slate-500">Pick your answers above, then see how well you know the couple.</p>
            <button
              type="button"
              onClick={() => setSubmitted(true)}
              disabled={answeredCount < weddingConfig.quizQuestions.length}
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-[#3b2635] px-6 py-3 text-xs font-semibold uppercase tracking-[0.18em] text-white shadow-lg shadow-rose-950/10 transition hover:-translate-y-0.5 hover:bg-rose-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:bg-slate-300 disabled:shadow-none"
            >
              <Sparkles className="h-4 w-4 text-amber-200" aria-hidden="true" /> See my score
            </button>
          </div>
        ) : (
          <div className="flex flex-col gap-5 rounded-[1.5rem] border border-amber-200 bg-gradient-to-r from-rose-50 via-white to-amber-50 p-5 md:flex-row md:items-center md:justify-between md:p-6">
            <div className="flex items-center gap-4">
              <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full border-4 border-white bg-gradient-to-br from-rose-500 to-[#8c4c63] text-xl font-bold text-white shadow-lg">
                {percentage}%
              </div>
              <div>
                <p className="text-[9px] font-semibold uppercase tracking-[0.22em] text-rose-600">Your love-story score</p>
                <p className="mt-1 text-base font-semibold text-slate-900">{resultText}</p>
                <p className="mt-1 text-xs text-slate-500">{score} of {weddingConfig.quizQuestions.length} answers were right.</p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setSubmitted(false)}
              className="inline-flex min-h-10 items-center justify-center gap-2 self-start rounded-full border border-rose-200 bg-white px-4 py-2 text-[10px] font-semibold uppercase tracking-[0.14em] text-rose-800 transition hover:bg-rose-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-500 md:self-center"
            >
              <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" /> Change answers
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
