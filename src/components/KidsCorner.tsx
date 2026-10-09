import { useEffect, useRef, useState } from 'react'
import { ArrowLeft, Brain, Heart, Puzzle, RotateCcw, Sparkles, Trophy } from 'lucide-react'

type GameId = 'hearts' | 'memory' | 'story'
type MemoryCard = { id: number; pair: string; face: string }

const memoryFaces = ['🌸', '💍', '🪷', '🦋', '🌙', '🎉']
const storySteps = ['First hello', 'First trip', 'The proposal', 'Forever']
const shuffledMemoryDeck = (): MemoryCard[] => {
  const deck = [...memoryFaces, ...memoryFaces]
    .map((face, id) => ({ id, pair: face, face }))
  for (let index = deck.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(Math.random() * (index + 1))
    ;[deck[index], deck[swapIndex]] = [deck[swapIndex], deck[index]]
  }
  return deck
}

const games = [
  {
    id: 'hearts' as const,
    title: 'Find the Hearts',
    description: 'Look closely and uncover all four hidden hearts.',
    detail: 'A little game of love and lucky guesses',
    icon: Heart,
    tone: 'from-rose-100 via-pink-50 to-amber-50',
    accent: 'text-rose-500',
    badge: 'Look & find',
  },
  {
    id: 'memory' as const,
    title: 'Memory Garden',
    description: 'Turn over the tiles and find every matching pair.',
    detail: 'Six pairs are waiting among the flowers',
    icon: Brain,
    tone: 'from-emerald-100 via-green-50 to-amber-50',
    accent: 'text-emerald-700',
    badge: 'Match pairs',
  },
  {
    id: 'story' as const,
    title: 'Love Story Puzzle',
    description: 'Put the couple’s special moments in the right order.',
    detail: 'From the very first hello to forever',
    icon: Puzzle,
    tone: 'from-amber-100 via-orange-50 to-rose-50',
    accent: 'text-amber-700',
    badge: 'Put in order',
  },
]

export function KidsCorner() {
  const [activeGame, setActiveGame] = useState<GameId | null>(null)
  const [revealedHearts, setRevealedHearts] = useState<number[]>([])
  const [foundHearts, setFoundHearts] = useState<number[]>([])
  const [memoryDeck, setMemoryDeck] = useState<MemoryCard[]>([])
  const [openCards, setOpenCards] = useState<number[]>([])
  const [matchedCards, setMatchedCards] = useState<number[]>([])
  const [storyProgress, setStoryProgress] = useState<string[]>([])
  const [storyFeedback, setStoryFeedback] = useState('')
  const mismatchTimer = useRef<number | null>(null)

  useEffect(() => () => {
    if (mismatchTimer.current !== null) window.clearTimeout(mismatchTimer.current)
  }, [])

  const startGame = (game: GameId) => {
    if (mismatchTimer.current !== null) window.clearTimeout(mismatchTimer.current)
    setActiveGame(game)
    setRevealedHearts([])
    setFoundHearts([])
    setMemoryDeck(game === 'memory' ? shuffledMemoryDeck() : [])
    setOpenCards([])
    setMatchedCards([])
    setStoryProgress([])
    setStoryFeedback('')
  }

  const closeGame = () => {
    if (mismatchTimer.current !== null) window.clearTimeout(mismatchTimer.current)
    setActiveGame(null)
  }

  const revealHeart = (index: number) => {
    if (revealedHearts.includes(index)) return
    setRevealedHearts((current) => [...current, index])
    if ([1, 4, 7, 10].includes(index)) setFoundHearts((current) => [...current, index])
  }

  const turnMemoryCard = (id: number) => {
    if (openCards.length === 2 || openCards.includes(id) || matchedCards.includes(id)) return
    const nextOpenCards = [...openCards, id]
    setOpenCards(nextOpenCards)
    if (nextOpenCards.length !== 2) return

    const firstCard = memoryDeck.find((card) => card.id === nextOpenCards[0])
    const secondCard = memoryDeck.find((card) => card.id === nextOpenCards[1])
    if (firstCard?.pair === secondCard?.pair) {
      setMatchedCards((current) => [...current, ...nextOpenCards])
      setOpenCards([])
      return
    }

    mismatchTimer.current = window.setTimeout(() => {
      setOpenCards([])
      mismatchTimer.current = null
    }, 850)
  }

  const selectStoryStep = (step: string) => {
    if (storyProgress.includes(step)) return
    if (step === storySteps[storyProgress.length]) {
      setStoryProgress((current) => [...current, step])
      setStoryFeedback('')
      return
    }
    setStoryFeedback('Not quite — try the next moment in their story.')
  }

  const selectedGame = games.find((game) => game.id === activeGame)

  return (
    <section id="kids-corner" className="royal-wedding-wash relative isolate overflow-hidden bg-[#fff8f3] py-24">
      <div className="pointer-events-none absolute -left-24 top-20 h-72 w-72 rounded-full bg-rose-100/55 blur-3xl" aria-hidden="true" />
      <div className="pointer-events-none absolute -right-20 bottom-8 h-80 w-80 rounded-full bg-amber-100/60 blur-3xl" aria-hidden="true" />
      <div className="relative mx-auto max-w-7xl px-5 md:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full border border-rose-100 bg-white text-rose-500 shadow-[0_10px_30px_rgba(244,114,182,0.12)]">
            <Sparkles className="h-6 w-6" aria-hidden="true" />
          </div>
          <p className="mt-5 text-[10px] font-semibold uppercase tracking-[0.35em] text-rose-500">A little fun for little guests</p>
          <h2 className="mt-3 font-display text-4xl text-slate-900 md:text-5xl">The Kids’ Corner</h2>
          <p className="mt-4 text-sm leading-7 text-slate-600 md:text-base">
            Ready, little explorers? Pick a game, follow the clues, and celebrate every win.
          </p>
        </div>

        <div className="mt-12 grid gap-5 md:grid-cols-3">
          {games.map((game, index) => {
            const Icon = game.icon
            return (
              <article
                key={game.id}
                className={`group relative overflow-hidden rounded-[2rem] border border-white bg-gradient-to-br ${game.tone} p-6 shadow-[0_20px_55px_rgba(92,57,50,0.09)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_26px_65px_rgba(92,57,50,0.14)] md:p-7`}
              >
                <span className="absolute right-5 top-4 font-display text-5xl text-white/75" aria-hidden="true">0{index + 1}</span>
                <div className={`flex h-14 w-14 items-center justify-center rounded-2xl bg-white/85 shadow-sm ${game.accent}`}>
                  <Icon className="h-6 w-6" aria-hidden="true" />
                </div>
                <p className={`mt-6 text-[9px] font-semibold uppercase tracking-[0.28em] ${game.accent}`}>{game.badge}</p>
                <h3 className="mt-2 font-display text-2xl text-slate-900">{game.title}</h3>
                <p className="mt-2 min-h-12 text-sm leading-6 text-slate-600">{game.description}</p>
                <p className="mt-4 text-xs text-slate-500">{game.detail}</p>
                <button
                  type="button"
                  onClick={() => startGame(game.id)}
                  aria-expanded={activeGame === game.id}
                  aria-controls="kids-game"
                  className="mt-6 inline-flex min-h-11 items-center gap-2 rounded-full bg-slate-900 px-5 text-xs font-semibold uppercase tracking-[0.18em] text-white transition hover:bg-rose-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-500 focus-visible:ring-offset-2"
                >
                  Let’s play <span aria-hidden="true">→</span>
                </button>
              </article>
            )
          })}
        </div>

        {selectedGame ? (
          <div id="kids-game" className="mt-8 scroll-mt-8 rounded-[2rem] border border-rose-100 bg-white p-5 shadow-[0_25px_70px_rgba(15,23,42,0.08)] md:p-8" aria-live="polite">
            <div className="flex flex-wrap items-start justify-between gap-4 border-b border-rose-100 pb-5">
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-rose-500">Your game is ready</p>
                <h3 className="mt-2 font-display text-3xl text-slate-900">{selectedGame.title}</h3>
              </div>
              <button type="button" onClick={closeGame} className="inline-flex min-h-10 items-center gap-2 rounded-full border border-slate-200 px-4 text-xs font-semibold text-slate-600 transition hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-500">
                <ArrowLeft className="h-3.5 w-3.5" aria-hidden="true" /> All games
              </button>
            </div>

            {activeGame === 'hearts' ? (
              <div className="mt-6">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <p className="text-sm text-slate-600">Tap a tile to look for a hidden heart.</p>
                  <p className="rounded-full bg-rose-50 px-4 py-2 text-sm font-semibold text-rose-600" aria-live="polite">{foundHearts.length} / 4 hearts</p>
                </div>
                <div className="mx-auto mt-5 grid max-w-xl grid-cols-4 gap-3">
                  {Array.from({ length: 12 }, (_, index) => {
                    const found = foundHearts.includes(index)
                    const revealed = revealedHearts.includes(index)
                    return (
                      <button
                        key={index}
                        type="button"
                        onClick={() => revealHeart(index)}
                        disabled={revealed}
                        aria-label={revealed ? (found ? 'Heart found' : 'Empty flower tile') : `Search flower ${index + 1}`}
                        className={`flex aspect-square items-center justify-center rounded-2xl text-2xl transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-500 disabled:cursor-default ${revealed ? found ? 'bg-rose-100 text-rose-500' : 'bg-amber-50 text-amber-500' : 'bg-gradient-to-br from-rose-100 to-amber-50 text-rose-300 hover:scale-105 hover:shadow-md'}`}
                      >
                        {revealed ? found ? '♥' : '✿' : '✿'}
                      </button>
                    )
                  })}
                </div>
                {foundHearts.length === 4 ? <p className="mt-5 text-center font-display text-2xl text-rose-600">You found every heart! Great job. 💕</p> : null}
              </div>
            ) : null}

            {activeGame === 'memory' ? (
              <div className="mt-6">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <p className="text-sm text-slate-600">Find two matching garden friends.</p>
                  <p className="rounded-full bg-emerald-50 px-4 py-2 text-sm font-semibold text-emerald-700" aria-live="polite">{matchedCards.length / 2} / 6 pairs</p>
                </div>
                <div className="mx-auto mt-5 grid max-w-2xl grid-cols-4 gap-2 sm:gap-3">
                  {memoryDeck.map((card) => {
                    const flipped = openCards.includes(card.id) || matchedCards.includes(card.id)
                    return (
                      <button
                        key={card.id}
                        type="button"
                        onClick={() => turnMemoryCard(card.id)}
                        disabled={matchedCards.includes(card.id) || openCards.length === 2}
                        aria-label={flipped ? `Memory tile ${card.face}` : `Turn over memory tile ${card.id + 1}`}
                        aria-pressed={flipped}
                        className={`flex aspect-square items-center justify-center rounded-2xl text-3xl transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 disabled:cursor-default sm:text-4xl ${flipped ? 'bg-emerald-50 shadow-inner' : 'bg-gradient-to-br from-emerald-100 to-amber-50 hover:scale-105 hover:shadow-md'}`}
                      >
                        {flipped ? card.face : '✿'}
                      </button>
                    )
                  })}
                </div>
                {matchedCards.length === memoryDeck.length ? <p className="mt-5 text-center font-display text-2xl text-emerald-700">Every pair found — you’re a memory star! 🌟</p> : null}
              </div>
            ) : null}

            {activeGame === 'story' ? (
              <div className="mt-6">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <p className="text-sm text-slate-600">Tap the moments in the order they happened.</p>
                  <p className="rounded-full bg-amber-50 px-4 py-2 text-sm font-semibold text-amber-700" aria-live="polite">{storyProgress.length} / {storySteps.length} moments</p>
                </div>
                <ol className="mx-auto mt-5 grid max-w-3xl gap-3 sm:grid-cols-2">
                  {storySteps.map((step) => {
                    const completed = storyProgress.includes(step)
                    return (
                      <li key={step}>
                        <button
                          type="button"
                          onClick={() => selectStoryStep(step)}
                          disabled={completed || storyProgress.length === storySteps.length}
                          aria-pressed={completed}
                          className={`flex min-h-14 w-full items-center gap-3 rounded-2xl border px-4 text-left text-sm font-medium transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-600 disabled:cursor-default ${completed ? 'border-amber-200 bg-amber-50 text-amber-800' : 'border-slate-200 bg-white text-slate-700 hover:border-amber-300 hover:bg-amber-50/60'}`}
                        >
                          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white text-xs text-amber-700 shadow-sm">{completed ? '✓' : '♡'}</span>
                          {step}
                        </button>
                      </li>
                    )
                  })}
                </ol>
                {storyFeedback ? <p role="status" className="mt-4 text-center text-sm text-rose-600">{storyFeedback}</p> : null}
                {storyProgress.length === storySteps.length ? <p className="mt-5 text-center font-display text-2xl text-amber-700">Their story ends with forever — lovely ordering! ✨</p> : null}
              </div>
            ) : null}

            <div className="mt-6 flex justify-end">
              <button type="button" onClick={() => startGame(selectedGame.id)} className="inline-flex min-h-10 items-center gap-2 rounded-full px-4 text-xs font-semibold text-slate-500 transition hover:bg-slate-50 hover:text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-500">
                <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" /> Play again
              </button>
            </div>
            {((activeGame === 'hearts' && foundHearts.length === 4) || (activeGame === 'memory' && memoryDeck.length > 0 && matchedCards.length === memoryDeck.length) || (activeGame === 'story' && storyProgress.length === storySteps.length)) ? (
              <div className="sr-only"><Trophy aria-hidden="true" /> You completed the game.</div>
            ) : null}
          </div>
        ) : null}
      </div>
    </section>
  )
}
