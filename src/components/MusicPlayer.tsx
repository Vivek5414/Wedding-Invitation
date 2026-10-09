import { useCallback, useEffect, useRef, useState } from 'react'
import { Pause, Play, Volume2 } from 'lucide-react'

const weddingTune = [
  523.25, 659.25, 783.99, 659.25,
  587.33, 698.46, 880, 783.99,
  659.25, 587.33, 523.25, 392,
]

function readSavedPlayback() {
  try {
    return window.localStorage.getItem('wedding-player-state') === 'playing'
  } catch {
    return false
  }
}

function savePlaybackPreference(playing: boolean) {
  try {
    window.localStorage.setItem('wedding-player-state', playing ? 'playing' : 'paused')
    return true
  } catch {
    return false
  }
}

export function MusicPlayer() {
  const [isPlaying, setIsPlaying] = useState(readSavedPlayback)
  const [isStarting, setIsStarting] = useState(false)
  const [playbackMessage, setPlaybackMessage] = useState('')
  const contextRef = useRef<AudioContext | null>(null)
  const masterGainRef = useRef<GainNode | null>(null)
  const loopRef = useRef<number | null>(null)
  const noteIndexRef = useRef(0)
  const playingRef = useRef(false)
  const desiredPlaybackRef = useRef(false)
  const startingRef = useRef(false)
  const operationRef = useRef(0)
  const musicChannelRef = useRef<BroadcastChannel | null>(null)
  const shouldResumeOnMountRef = useRef(isPlaying)

  const stopLoop = useCallback(() => {
    if (loopRef.current !== null) {
      window.clearInterval(loopRef.current)
      loopRef.current = null
    }
  }, [])

  const notifyOtherTabs = useCallback((playing: boolean) => {
    musicChannelRef.current?.postMessage(playing ? 'playing' : 'paused')
  }, [])

  const playNote = useCallback(() => {
    const context = contextRef.current
    const masterGain = masterGainRef.current
    if (!context || !masterGain || context.state !== 'running') return

    const frequency = weddingTune[noteIndexRef.current % weddingTune.length]
    noteIndexRef.current += 1
    const now = context.currentTime

    for (const [tone, level] of [[frequency, 0.11], [frequency * 1.5, 0.025]] as const) {
      const oscillator = context.createOscillator()
      const envelope = context.createGain()
      oscillator.type = 'sine'
      oscillator.frequency.setValueAtTime(tone, now)
      envelope.gain.setValueAtTime(0.0001, now)
      envelope.gain.exponentialRampToValueAtTime(level, now + 0.08)
      envelope.gain.exponentialRampToValueAtTime(0.0001, now + 0.58)
      oscillator.connect(envelope)
      envelope.connect(masterGain)
      oscillator.start(now)
      oscillator.stop(now + 0.6)
    }
  }, [])

  const startMusic = useCallback(async (announceFailure = false) => {
    if (typeof window === 'undefined' || typeof window.AudioContext === 'undefined') {
      if (announceFailure) setPlaybackMessage('Wedding music is not supported in this browser.')
      return
    }

    if (desiredPlaybackRef.current) return
    desiredPlaybackRef.current = true
    const operation = ++operationRef.current
    startingRef.current = true
    setIsStarting(true)

    try {
      if (!contextRef.current || contextRef.current.state === 'closed') {
        const context = new window.AudioContext()
        const masterGain = context.createGain()
        masterGain.gain.value = 0.55
        masterGain.connect(context.destination)
        contextRef.current = context
        masterGainRef.current = masterGain
        context.addEventListener('statechange', () => {
          if (context.state !== 'running' && playingRef.current) {
            desiredPlaybackRef.current = false
            playingRef.current = false
            stopLoop()
            setIsPlaying(false)
            setPlaybackMessage(savePlaybackPreference(false) ? '' : 'Playback preference could not be saved.')
            notifyOtherTabs(false)
          }
        })
      }

      const context = contextRef.current
      await context.resume()
      if (context.state !== 'running') throw new Error('Audio context did not start.')
      if (operation !== operationRef.current || !desiredPlaybackRef.current) {
        if (!desiredPlaybackRef.current && context.state === 'running') await context.suspend()
        return
      }

      playingRef.current = true
      setPlaybackMessage(savePlaybackPreference(true) ? '' : 'Playback preference could not be saved.')
      setIsPlaying(true)
      playNote()
      stopLoop()
      loopRef.current = window.setInterval(playNote, 650)
      notifyOtherTabs(true)
    } catch {
      if (operation === operationRef.current) {
        desiredPlaybackRef.current = false
        playingRef.current = false
        stopLoop()
        setIsPlaying(false)
        savePlaybackPreference(false)
        if (announceFailure) setPlaybackMessage('Wedding music could not be played in this browser.')
      }
    } finally {
      if (operation === operationRef.current) {
        startingRef.current = false
        setIsStarting(false)
      }
    }
  }, [notifyOtherTabs, playNote, stopLoop])

  const pauseMusic = useCallback(async (notifyTabs = true) => {
    desiredPlaybackRef.current = false
    const operation = ++operationRef.current
    startingRef.current = false
    setIsStarting(false)
    playingRef.current = false
    stopLoop()
    setIsPlaying(false)
    const preferenceSaved = notifyTabs ? savePlaybackPreference(false) : true
    setPlaybackMessage(preferenceSaved ? '' : 'Playback preference could not be saved.')
    if (notifyTabs) notifyOtherTabs(false)

    try {
      const context = contextRef.current
      if (context?.state === 'running') {
        await context.suspend()
      }
    } catch {
      if (operation === operationRef.current) {
        setPlaybackMessage('Wedding music could not be paused in this browser.')
      }
    }
  }, [notifyOtherTabs, stopLoop])

  useEffect(() => {
    const channel = typeof BroadcastChannel === 'undefined'
      ? null
      : new BroadcastChannel('wedding-os:music')
    musicChannelRef.current = channel
    if (channel) {
      channel.addEventListener('message', (event: MessageEvent<unknown>) => {
        if (event.data === 'playing' || event.data === 'paused') void pauseMusic(false)
      })
    }

    const syncPlaybackAcrossTabs = (event: StorageEvent) => {
      if (event.key === 'wedding-player-state' && (event.newValue === 'playing' || event.newValue === 'paused')) {
        void pauseMusic(false)
      }
    }

    window.addEventListener('storage', syncPlaybackAcrossTabs)
    if (shouldResumeOnMountRef.current) void startMusic()

    const startAfterInteraction = (event: Event) => {
      if (event.target instanceof Element && event.target.closest('[data-music-player]')) {
        window.removeEventListener('pointerdown', startAfterInteraction)
        window.removeEventListener('keydown', startAfterInteraction)
        return
      }
      window.removeEventListener('pointerdown', startAfterInteraction)
      window.removeEventListener('keydown', startAfterInteraction)
      void startMusic()
    }

    window.addEventListener('pointerdown', startAfterInteraction)
    window.addEventListener('keydown', startAfterInteraction)
    return () => {
      window.removeEventListener('pointerdown', startAfterInteraction)
      window.removeEventListener('keydown', startAfterInteraction)
      window.removeEventListener('storage', syncPlaybackAcrossTabs)
      channel?.close()
      if (musicChannelRef.current === channel) musicChannelRef.current = null
      stopLoop()
    }
  }, [pauseMusic, startMusic, stopLoop])

  return (
    <div data-music-player className="fixed bottom-5 right-5 z-50 w-[260px] rounded-[1.75rem] border border-white/60 bg-white/80 p-3 shadow-[0_20px_60px_rgba(15,23,42,0.18)] backdrop-blur-xl">
      <div className="flex items-center gap-3">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-rose-200 via-rose-100 to-orange-100 text-rose-600">
          <Volume2 className="h-5 w-5" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="truncate text-sm font-medium text-slate-900">Wedding Tune</div>
          <div className="text-[11px] uppercase tracking-[0.25em] text-slate-500">Soft romantic</div>
        </div>
        <button
          type="button"
          onClick={() => {
            if (desiredPlaybackRef.current) void pauseMusic()
            else void startMusic(true)
          }}
          aria-label={isPlaying || isStarting ? 'Pause music' : 'Play music'}
          aria-busy={isStarting}
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-slate-900 text-white transition hover:bg-slate-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-500 focus-visible:ring-offset-2"
        >
          {isPlaying || isStarting ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
        </button>
      </div>
      <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-rose-100">
        <div className="h-full w-1/3 rounded-full bg-gradient-to-r from-rose-400 to-amber-400" />
      </div>
      <span className="sr-only" role="status">{playbackMessage || (isStarting ? 'Wedding music is starting.' : '')}</span>
    </div>
  )
}
