import { useState } from 'react'
import { get, set as storageSet } from '../../../../shared/storage'
import { notify } from '../../../../shared/toast'
import GameCard from './GameCard'

const GENRES = ['fantasy', 'mystery', 'romance', 'sci-fi', 'adventure']

const ELEMENTS = {
  fantasy: {
    characters: ['a young cartographer who can draw living maps', 'a dragon who collects lost memories', 'an apprentice librarian of a floating city'],
    settings: ['the whispering forest of Alder Vale', 'a castle suspended above storm clouds', 'the drowned market of the old kingdom'],
    conflicts: ['a prophecy is slowly rewriting itself', 'the moon has stopped rising', 'an ancient ward begins to crack'],
  },
  mystery: {
    characters: ['a sleep-deprived campus detective', 'a barista who notices everything', 'a professor with a secret second life'],
    settings: ['a library after closing hours', 'a fogbound campus quad', 'an empty lecture hall with a single chalk message'],
    conflicts: ['a note that only appears in the rain', 'a stolen thesis with no suspects', 'a series of vanished coffee mugs'],
  },
  romance: {
    characters: ['a shy violinist', 'a runner who shares the same route', 'a poet who writes anonymous letters'],
    settings: ['the balcony of the music hall', 'a spring festival on campus green', 'a corner table in the student café'],
    conflicts: ['they only meet during power outages', 'a promise made before a long summer break', 'a mix-up with identical umbrellas'],
  },
  'sci-fi': {
    characters: ['a junior robotics engineer', 'an AI with a growing curiosity', 'a pilot who dreams in binary'],
    settings: ['a colony dome on a tidally locked planet', 'a university shipbound between stars', 'an orbital library of human knowledge'],
    conflicts: ['the backup memory keeps glitching', 'an alien signal grows clearer by the day', 'the last seed bank must be opened now'],
  },
  adventure: {
    characters: ['a treasure-hunting geography student', 'a ranger who knows every trail', 'a journalist chasing the same legend'],
    settings: ['the canyon beyond the university gates', 'an uncharted island on an old map', 'the ruins beneath the botanical garden'],
    conflicts: ['a rival team found the first clue', 'a storm is closing the only pass', 'the map starts to fade in daylight'],
  },
}

export default function StoryGame() {
  const [genre, setGenre] = useState('fantasy')
  const [elements, setElements] = useState(null)
  const [text, setText] = useState('')

  const generate = () => {
    const data = ELEMENTS[genre]
    const pick = (arr) => arr[Math.floor(Math.random() * arr.length)]
    setElements({ character: pick(data.characters), setting: pick(data.settings), conflict: pick(data.conflicts) })
    setText('')
  }

  const save = () => {
    if (!text.trim()) {
      notify('Write something first!', 'warning')
      return
    }
    const nextStats = get('gameStats', {})
    const stories = [
      ...(nextStats.savedStories || []),
      { id: Date.now(), genre, elements, text, date: new Date().toISOString() },
    ]
    storageSet('gameStats', { ...nextStats, savedStories: stories })
    notify('Story saved!', 'success')
  }

  const share = () => {
    if (!text.trim()) {
      notify('Write something first!', 'warning')
      return
    }
    navigator.clipboard?.writeText(text).catch(() => {})
    notify('Story copied to clipboard!', 'success')
  }

  return (
    <GameCard
      icon="fa-book-open"
      title="Story Builder"
      description="Create collaborative stories with random prompts and characters!"
      controls={
        <>
          <button type="button" onClick={generate} className="rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-on-primary transition-opacity hover:opacity-90">
            Generate Elements
          </button>
          <button type="button" onClick={save} className="rounded-xl border border-line-light px-4 py-2 text-sm font-semibold text-ink-2 transition-colors hover:border-primary hover:text-primary-text">
            Save Story
          </button>
          <button type="button" onClick={() => { setText(''); notify('Continue where you left off!', 'info') }} className="rounded-xl border border-line-light px-4 py-2 text-sm font-semibold text-ink-2 transition-colors hover:border-primary hover:text-primary-text">
            Continue
          </button>
          <button type="button" onClick={share} className="rounded-xl border border-line-light px-4 py-2 text-sm font-semibold text-ink-2 transition-colors hover:border-primary hover:text-primary-text">
            Share
          </button>
        </>
      }
    >
      <label className="flex items-center gap-2 text-sm font-semibold text-ink-2">
        Genre:
        <select
          value={genre}
          onChange={(e) => setGenre(e.target.value)}
          className="rounded-xl border border-line-light bg-canvas px-3 py-2 text-sm text-ink focus:border-primary focus:outline-none"
        >
          {GENRES.map((g) => (
            <option key={g} value={g}>
              {g}
            </option>
          ))}
        </select>
      </label>
      {elements ? (
        <div className="mt-3 space-y-2 rounded-2xl bg-canvas p-4 text-sm text-ink">
          <p>
            <strong className="text-primary-text">Character:</strong> {elements.character}
          </p>
          <p>
            <strong className="text-primary-text">Setting:</strong> {elements.setting}
          </p>
          <p>
            <strong className="text-primary-text">Conflict:</strong> {elements.conflict}
          </p>
        </div>
      ) : (
        <p className="mt-3 rounded-2xl bg-canvas p-4 text-sm text-ink-3">Press Generate Elements to create your story ingredients!</p>
      )}
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Start writing your story here..."
        rows={6}
        className="mt-3 w-full resize-none rounded-2xl border border-line-light bg-canvas px-4 py-3 text-sm text-ink placeholder:text-ink-3 focus:border-primary focus:outline-none"
      />
    </GameCard>
  )
}
