import { useState } from 'react'
import { useLanguage } from '../../../shared/LanguageProvider'
import SectionHeader from '../components/SectionHeader'
import MemoryGame from './games/MemoryGame'
import WordGame from './games/WordGame'
import SequenceGame from './games/SequenceGame'
import ColorMemoryGame from './games/ColorMemoryGame'
import GratitudeGame from './games/GratitudeGame'
import AffirmationGame from './games/AffirmationGame'
import BreathingGame from './games/BreathingGame'
import MoodCheckGame from './games/MoodCheckGame'
import CanvasGame from './games/CanvasGame'
import PoetryGame from './games/PoetryGame'
import StoryGame from './games/StoryGame'
import WyrGame from './games/WyrGame'
import TruthOrDareGame from './games/TruthOrDareGame'
import CollabDrawingGame from './games/CollabDrawingGame'

const CATEGORIES = [
  { id: 'cognitive', key: 'games_tab_cognitive', icon: 'fa-brain', title: 'Cognitive Enhancement Games' },
  { id: 'wellness', key: 'games_tab_wellness', icon: 'fa-heart', title: 'Wellness & Mindfulness Activities' },
  { id: 'creativity', key: 'games_tab_creativity', icon: 'fa-paint-brush', title: 'Creative Expression Tools' },
  { id: 'social', key: 'games_tab_social', icon: 'fa-users', title: 'Social & Collaborative Games' },
]

function GroupHeader({ icon, title }) {
  return (
    <h3 className="mb-4 flex items-center gap-2 text-xl font-bold text-ink">
      <i className={`fas ${icon} text-primary`} />
      {title}
    </h3>
  )
}

export default function GamesSection() {
  const { t } = useLanguage()
  const [category, setCategory] = useState('cognitive')

  return (
    <section>
      <SectionHeader title={t('games_title')} subtitle={t('games_description')} />

      <div className="mb-6 flex gap-2 overflow-x-auto pb-2">
        {CATEGORIES.map((cat) => (
          <button
            key={cat.id}
            type="button"
            onClick={() => setCategory(cat.id)}
            className={`flex shrink-0 items-center gap-2 rounded-full border px-4 py-2.5 text-sm font-semibold transition-all duration-200 ${
              category === cat.id
                ? 'border-primary bg-primary/10 text-primary shadow-sm'
                : 'border-line-light bg-surface text-ink-2 hover:border-primary hover:text-primary'
            }`}
          >
            <i className={`fas ${cat.icon}`} />
            {t(cat.key)}
          </button>
        ))}
      </div>

      {category === 'cognitive' && (
        <div className="animate-fade-up">
          <GroupHeader icon="fa-brain" title={CATEGORIES[0].title} />
          <div className="grid gap-5 md:grid-cols-2">
            <MemoryGame />
            <WordGame />
            <SequenceGame />
            <ColorMemoryGame />
          </div>
        </div>
      )}

      {category === 'wellness' && (
        <div className="animate-fade-up">
          <GroupHeader icon="fa-heart" title={CATEGORIES[1].title} />
          <div className="grid gap-5 md:grid-cols-2">
            <GratitudeGame />
            <AffirmationGame />
            <BreathingGame />
            <MoodCheckGame />
          </div>
        </div>
      )}

      {category === 'creativity' && (
        <div className="animate-fade-up">
          <GroupHeader icon="fa-paint-brush" title={CATEGORIES[2].title} />
          <div className="grid gap-5 md:grid-cols-2">
            <CanvasGame />
            <PoetryGame />
            <StoryGame />
          </div>
        </div>
      )}

      {category === 'social' && (
        <div className="animate-fade-up">
          <GroupHeader icon="fa-users" title={CATEGORIES[3].title} />
          <div className="grid gap-5 md:grid-cols-2">
            <WyrGame />
            <TruthOrDareGame />
            <CollabDrawingGame />
          </div>
        </div>
      )}
    </section>
  )
}
