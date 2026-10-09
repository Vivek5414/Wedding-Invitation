import { useState } from 'react'
import { Heart, MessageCircle, Send, Sparkles } from 'lucide-react'
import type { FormEvent } from 'react'

import { weddingConfig } from '../data/weddingConfig'

const reactionIcons = ['❤️', '🎉', '🥰', '😂', '✨'] as const
type Reaction = typeof reactionIcons[number]
type WallPost = {
  guest: string
  message: string
  timestamp: string
  image: string
  reactions: Record<Reaction, number>
}

const makePost = (post: typeof weddingConfig.weddingWallPosts[number]): WallPost => ({
  ...post,
  reactions: {
    '❤️': post.reactions['❤️'] ?? 0,
    '🎉': post.reactions['🎉'] ?? 0,
    '🥰': post.reactions['🥰'] ?? 0,
    '😂': post.reactions['😂'] ?? 0,
    '✨': post.reactions['✨'] ?? 0,
  },
})

export function WeddingWall() {
  const [posts, setPosts] = useState(() => weddingConfig.weddingWallPosts.map(makePost))
  const [selectedReactions, setSelectedReactions] = useState<Record<number, Reaction | null>>({})
  const [isComposerOpen, setIsComposerOpen] = useState(false)
  const [guestName, setGuestName] = useState('')
  const [guestMessage, setGuestMessage] = useState('')
  const [shareMessage, setShareMessage] = useState('')
  const [submissionFeedback, setSubmissionFeedback] = useState('')

  const toggleReaction = (postIndex: number, reaction: Reaction) => {
    const previous = selectedReactions[postIndex] ?? null
    const next = previous === reaction ? null : reaction

    setPosts((current) => current.map((post, index) => {
      if (index !== postIndex) return post
      const reactions = { ...post.reactions }
      if (previous) reactions[previous] = Math.max(0, reactions[previous] - 1)
      if (next) reactions[next] += 1
      return { ...post, reactions }
    }))
    setSelectedReactions((current) => ({ ...current, [postIndex]: next }))
  }

  const sharePost = async (post: WallPost) => {
    const shareData = { title: `A wish from ${post.guest}`, text: post.message, url: window.location.href }
    try {
      if (navigator.share) {
        await navigator.share(shareData)
        setShareMessage('Post shared.')
      } else if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(`${post.message} — ${post.guest}\n${window.location.href}`)
        setShareMessage('Post copied to clipboard.')
      } else {
        setShareMessage('Sharing is not available in this browser.')
      }
    } catch {
      setShareMessage('The post could not be shared.')
    }
  }

  const addMessage = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const name = guestName.trim()
    const message = guestMessage.trim()
    if (!name || !message) return

    setPosts((current) => [
      {
        guest: name,
        message,
        timestamp: 'Just now · local preview',
        image: '',
        reactions: { '❤️': 0, '🎉': 0, '🥰': 0, '😂': 0, '✨': 0 },
      },
      ...current,
    ])
    setGuestName('')
    setGuestMessage('')
    setIsComposerOpen(false)
    setSubmissionFeedback('Your note has been added to the local preview. It will disappear when you leave or refresh this page.')
  }

  return (
    <div className="space-y-6">
      <div className="overflow-hidden rounded-[2rem] border border-rose-200 bg-white shadow-[0_25px_70px_rgba(98,48,62,0.1)]">
        <div className="flex flex-col justify-between gap-5 bg-gradient-to-r from-[#3b2635] via-[#673b50] to-[#a45c68] px-6 py-6 text-white md:flex-row md:items-center md:px-8">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-[9px] font-semibold uppercase tracking-[0.2em] text-rose-100">
              <span className="h-1.5 w-1.5 rounded-full bg-amber-300" /> Wedding Wall preview
            </div>
            <h3 className="mt-3 font-display text-2xl md:text-3xl">Add your voice to our story.</h3>
            <p className="mt-1 text-sm text-white/75">A name, a few kind words, and a little love go a long way.</p>
          </div>
          <button
            type="button"
            onClick={() => {
              setIsComposerOpen((current) => !current)
              if (!isComposerOpen) setSubmissionFeedback('')
            }}
            aria-expanded={isComposerOpen}
            aria-controls="wedding-wall-composer"
            className="inline-flex min-h-12 shrink-0 items-center justify-center gap-2 rounded-full bg-white px-5 py-3 text-xs font-semibold uppercase tracking-[0.16em] text-[#3b2635] shadow-lg transition hover:-translate-y-0.5 hover:bg-rose-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#673b50]"
          >
            <MessageCircle className="h-4 w-4" /> {isComposerOpen ? 'Close note form' : 'Write a note'}
          </button>
        </div>
        <div className="flex flex-wrap items-center justify-between gap-2 border-t border-rose-100 bg-rose-50/60 px-6 py-3 text-xs text-slate-600 md:px-8">
          <span className="inline-flex items-center gap-2"><Sparkles className="h-3.5 w-3.5 text-rose-500" /> Notes and reactions are temporary in this preview.</span>
          <span>They disappear after you leave or refresh.</span>
        </div>
      </div>

      {submissionFeedback ? (
        <p className="rounded-2xl border border-emerald-200 bg-emerald-50 px-5 py-4 text-sm font-medium text-emerald-900 shadow-sm" role="status">{submissionFeedback}</p>
      ) : null}

      {isComposerOpen ? (
        <form
          id="wedding-wall-composer"
          onSubmit={addMessage}
          className="grid gap-5 rounded-[2rem] border border-rose-200 bg-white p-6 shadow-[0_25px_70px_rgba(98,48,62,0.1)] md:grid-cols-[0.72fr_1.28fr] md:p-8"
        >
          <div className="flex flex-col justify-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-rose-100 to-amber-100 text-rose-700">
              <Heart className="h-5 w-5" />
            </div>
            <p className="mt-4 text-[10px] font-semibold uppercase tracking-[0.24em] text-rose-600">A keepsake in words</p>
            <h3 className="mt-2 font-display text-2xl text-slate-900">Write from the heart.</h3>
            <p className="mt-2 text-sm leading-6 text-slate-600">Your message appears at the top of this wall for this visit only.</p>
          </div>
          <div className="space-y-4 rounded-2xl bg-[#fff9f6] p-4 md:p-5">
            <label className="block text-xs font-semibold uppercase tracking-[0.14em] text-slate-700">
              Your name
              <input
                value={guestName}
                onChange={(event) => setGuestName(event.target.value)}
                required
                maxLength={80}
                className="mt-2 min-h-11 w-full rounded-xl border border-rose-100 bg-white px-4 text-sm font-normal normal-case tracking-normal text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-rose-300 focus:ring-4 focus:ring-rose-100/70"
                placeholder="How should we sign your note?"
              />
            </label>
            <label className="block text-xs font-semibold uppercase tracking-[0.14em] text-slate-700">
              Your message
              <textarea
                value={guestMessage}
                onChange={(event) => setGuestMessage(event.target.value)}
                required
                maxLength={500}
                rows={3}
                className="mt-2 w-full resize-y rounded-xl border border-rose-100 bg-white px-4 py-3 text-sm font-normal normal-case leading-6 tracking-normal text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-rose-300 focus:ring-4 focus:ring-rose-100/70"
                placeholder="Write a wish, a memory, or a little note for the couple..."
              />
              <span className="mt-1 block text-right text-[10px] font-normal normal-case tracking-normal text-slate-400">{guestMessage.length}/500</span>
            </label>
            <div className="flex flex-wrap items-center gap-3">
              <button type="submit" className="inline-flex min-h-11 items-center gap-2 rounded-full bg-[#3b2635] px-5 py-2.5 text-xs font-semibold uppercase tracking-[0.15em] text-white transition hover:bg-rose-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-500 focus-visible:ring-offset-2">
                Post my note <Send className="h-3.5 w-3.5" />
              </button>
              <button type="button" onClick={() => { setIsComposerOpen(false); setGuestName(''); setGuestMessage(''); }} className="min-h-11 rounded-full border border-slate-200 bg-white px-5 py-2.5 text-xs font-semibold uppercase tracking-[0.15em] text-slate-600 transition hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-500">
                Cancel
              </button>
            </div>
          </div>
        </form>
      ) : null}

      <div className="grid gap-6 md:grid-cols-2">
      {posts.map((post, index) => (
        <article key={`${post.guest}-${index}`} className="group overflow-hidden rounded-[2rem] border border-rose-100 bg-white shadow-[0_25px_70px_rgba(98,48,62,0.08)] transition duration-300 hover:-translate-y-1 hover:border-rose-200 hover:shadow-[0_30px_75px_rgba(98,48,62,0.14)]">
          {post.image ? (
            <div className="relative overflow-hidden">
              <img src={post.image} alt={post.guest} loading="lazy" decoding="async" className="h-64 w-full object-cover transition duration-700 group-hover:scale-[1.03]" />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/40 via-transparent to-transparent" aria-hidden="true" />
              <span className="absolute bottom-4 left-4 inline-flex items-center gap-2 rounded-full border border-white/30 bg-black/20 px-3 py-1.5 text-[9px] font-semibold uppercase tracking-[0.18em] text-white backdrop-blur">
                <Heart className="h-3 w-3 text-rose-200" /> A wish for the couple
              </span>
            </div>
          ) : (
            <div className="relative flex h-48 items-center justify-center overflow-hidden bg-gradient-to-br from-rose-100 via-amber-50 to-fuchsia-100 text-lg font-medium text-slate-700">
              <div className="absolute -right-4 -top-12 h-40 w-40 rounded-full border border-white/70" aria-hidden="true" />
              <div className="relative flex items-center gap-2 rounded-full border border-white/70 bg-white/70 px-4 py-2 text-sm text-rose-800 shadow-sm">
                <Sparkles className="h-4 w-4 text-rose-500" /> A sweet memory
              </div>
            </div>
          )}

          <div className="space-y-4 p-5 md:p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-semibold text-slate-900">{post.guest}</h3>
                <p className="mt-1 text-[9px] font-semibold uppercase tracking-[0.18em] text-slate-400">{post.timestamp}</p>
              </div>
              <button type="button" onClick={() => void sharePost(post)} className="rounded-full border border-rose-100 bg-rose-50 px-3.5 py-2 text-[10px] font-semibold uppercase tracking-[0.16em] text-rose-700 transition hover:border-rose-200 hover:bg-rose-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-500">
                Share
              </button>
            </div>

            <div className="rounded-2xl border border-rose-100/80 bg-gradient-to-br from-[#fffdfb] to-rose-50/50 p-4">
              <p className="font-display text-lg leading-7 text-slate-700">“{post.message}”</p>
            </div>

            <div className="flex flex-wrap gap-2">
              {reactionIcons.map((icon) => (
                <button
                  key={icon}
                  type="button"
                  aria-label={`${selectedReactions[index] === icon ? 'Remove' : 'Add'} ${icon} reaction`}
                  aria-pressed={selectedReactions[index] === icon}
                  onClick={() => toggleReaction(index, icon)}
                  className={`flex min-h-9 items-center gap-2 rounded-full border px-3 py-1.5 text-xs transition hover:border-rose-200 hover:text-rose-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-500 ${selectedReactions[index] === icon ? 'border-rose-300 bg-rose-50 text-rose-600' : 'border-slate-200 bg-white text-slate-600'}`}
                >
                  <span>{icon}</span>
                  <span>{post.reactions[icon]}</span>
                </button>
              ))}
            </div>

          </div>
        </article>
      ))}
      </div>
      {shareMessage ? <p className="text-sm text-slate-600" role="status">{shareMessage}</p> : null}
    </div>
  )
}
