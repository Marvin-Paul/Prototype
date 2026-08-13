import { useEffect, useRef, useState } from 'react'
import { useLanguage } from '../../../shared/LanguageProvider'
import { get, set as storageSet } from '../../../shared/storage'
import { notify } from '../../../shared/toast'
import Modal from '../components/Modal'
import SectionHeader from '../components/SectionHeader'

const EXERCISE_DATA = {
  cbt: {
    title: 'Cognitive Behavioral Therapy',
    tagline: 'Change negative thought patterns',
    icon: 'fa-brain',
    iconBg: 'bg-indigo-100 text-primary-text',
    tagColor: 'bg-indigo-50 text-indigo-800',
    featureTags: ['Thought Records', 'Restructuring', 'Behavioral Experiments'],
    exercises: [
      {
        id: 'thought_record',
        name: 'Thought Record',
        description: 'Identify and challenge negative thoughts',
        duration: '10-15 minutes',
        difficulty: 'Beginner',
        steps: [
          'Describe the situation that triggered your thoughts',
          'Identify your automatic thoughts',
          'Rate your emotional intensity (1-10)',
          'Look for thinking errors',
          'Create balanced thoughts',
          'Rate your mood after reframing',
        ],
      },
      {
        id: 'cognitive_restructuring',
        name: 'Cognitive Restructuring',
        description: 'Replace negative thoughts with balanced ones',
        duration: '15-20 minutes',
        difficulty: 'Intermediate',
        steps: [
          'Identify the negative thought',
          'Examine the evidence for and against',
          'Consider alternative explanations',
          'Develop a more balanced perspective',
          'Practice the new thought pattern',
        ],
      },
      {
        id: 'behavioral_experiment',
        name: 'Behavioral Experiment',
        description: 'Test your beliefs through safe experiments',
        duration: 'Variable',
        difficulty: 'Advanced',
        steps: [
          'Identify a belief to test',
          'Make a prediction about what will happen',
          'Design a safe experiment',
          'Conduct the experiment',
          'Compare results with your prediction',
          'Update your belief based on evidence',
        ],
      },
    ],
  },
  dbt: {
    title: 'Dialectical Behavior Therapy',
    tagline: 'Build skills to manage intense emotions',
    icon: 'fa-heart',
    iconBg: 'bg-pink-100 text-accent-pink',
    tagColor: 'bg-pink-50 text-pink-700',
    featureTags: ['Distress Tolerance', 'Emotion Regulation', 'Interpersonal Skills'],
    exercises: [
      {
        id: 'distress_tolerance',
        name: 'Distress Tolerance Skills',
        description: 'Cope with overwhelming emotions safely',
        duration: '5-10 minutes',
        difficulty: 'Beginner',
        steps: [
          'TIPP: Temperature, Intense exercise, Paced breathing, Paired muscle relaxation',
          'ACCEPTS: Activities, Contributing, Comparisons, Emotions, Pushing away, Thoughts, Sensations',
          'IMPROVE: Imagery, Meaning, Prayer, Relaxation, One thing at a time, Vacation, Encouragement',
          'Radical Acceptance: Accepting reality as it is',
        ],
      },
      {
        id: 'emotion_regulation',
        name: 'Emotion Regulation',
        description: 'Understand and manage your emotions',
        duration: '15-20 minutes',
        difficulty: 'Intermediate',
        steps: [
          'Identify and label emotions',
          'Understand emotion functions',
          'Reduce vulnerability to emotion mind',
          'Increase positive emotions',
          'Take opposite action',
        ],
      },
      {
        id: 'interpersonal_effectiveness',
        name: 'Interpersonal Effectiveness',
        description: 'Build healthy relationships and communication',
        duration: '20-30 minutes',
        difficulty: 'Advanced',
        steps: [
          'DEAR MAN: Describe, Express, Assert, Reinforce, Mindful, Appear confident, Negotiate',
          'GIVE: Gentle, Interested, Validate, Easy manner',
          'FAST: Fair, Apologies, Stick to values, Truthful',
        ],
      },
    ],
  },
  mbsr: {
    title: 'Mindfulness-Based Stress Reduction',
    tagline: 'Cultivate present-moment awareness',
    icon: 'fa-leaf',
    iconBg: 'bg-green-100 text-accent-green',
    tagColor: 'bg-sky-50 text-sky-800',
    featureTags: ['Body Scan', 'Mindful Breathing', 'Loving-Kindness'],
    exercises: [
      {
        id: 'body_scan',
        name: 'Body Scan Meditation',
        description: 'Mindful awareness of physical sensations',
        duration: '20-45 minutes',
        difficulty: 'Beginner',
        steps: [
          'Find a comfortable lying position',
          'Begin with attention to your breath',
          'Slowly scan from toes to head',
          'Notice sensations without judgment',
          'Return to breath when mind wanders',
          'End with full body awareness',
        ],
      },
      {
        id: 'mindful_breathing',
        name: 'Mindful Breathing',
        description: 'Focus on breath as anchor to present moment',
        duration: '5-20 minutes',
        difficulty: 'Beginner',
        steps: [
          'Sit comfortably with spine straight',
          'Close eyes or soften gaze',
          'Notice natural breathing rhythm',
          'Count breaths if helpful',
          'Gently return attention when distracted',
          'End with gratitude for practice',
        ],
      },
      {
        id: 'loving_kindness',
        name: 'Loving-Kindness Meditation',
        description: 'Cultivate compassion for self and others',
        duration: '15-30 minutes',
        difficulty: 'Intermediate',
        steps: [
          'Start with self-compassion phrases',
          'Extend to loved ones',
          'Include neutral people',
          'Extend to difficult people',
          'Include all beings',
          'Rest in open-hearted awareness',
        ],
      },
    ],
  },
}

const LEARN_MORE_INFO = {
  cbt: {
    title: 'Cognitive Behavioral Therapy (CBT)',
    overview:
      'CBT is a structured, time-limited therapy that focuses on identifying and changing negative thought patterns and behaviors. It helps individuals understand the connection between thoughts, feelings, and actions.',
    benefits: [
      'Helps identify and change negative thinking patterns',
      'Teaches practical coping strategies',
      'Effective for anxiety, depression, and stress',
      'Short-term, goal-oriented approach',
      'Provides tools for long-term mental health',
    ],
    techniques: [
      'Thought records and cognitive restructuring',
      'Behavioral experiments',
      'Problem-solving skills',
      'Relaxation techniques',
      'Exposure therapy for anxiety',
    ],
  },
  dbt: {
    title: 'Dialectical Behavior Therapy (DBT)',
    overview:
      'DBT combines cognitive-behavioral techniques with mindfulness practices. It focuses on teaching skills to manage emotions, tolerate distress, and improve relationships.',
    benefits: [
      'Develops emotional regulation skills',
      'Improves distress tolerance',
      'Enhances interpersonal relationships',
      'Reduces self-destructive behaviors',
      'Increases mindfulness and awareness',
    ],
    techniques: [
      'Mindfulness meditation',
      'Distress tolerance skills',
      'Emotion regulation strategies',
      'Interpersonal effectiveness skills',
      'Radical acceptance practices',
    ],
  },
  mbsr: {
    title: 'Mindfulness-Based Stress Reduction (MBSR)',
    overview:
      'MBSR is an evidence-based program that uses mindfulness meditation to help people cope with stress, pain, and illness. It teaches present-moment awareness and non-judgmental observation.',
    benefits: [
      'Reduces stress and anxiety',
      'Improves focus and concentration',
      'Enhances emotional regulation',
      'Increases self-awareness',
      'Promotes overall well-being',
    ],
    techniques: [
      'Body scan meditation',
      'Sitting meditation',
      'Walking meditation',
      'Loving-kindness meditation',
      'Mindful movement and yoga',
    ],
  },
}

const CRISIS_HOTLINES = [
  { name: 'National Suicide Prevention Lifeline', number: '988', description: '24/7 support for anyone in suicidal crisis or emotional distress' },
  { name: 'Crisis Text Line', number: 'Text HOME to 741741', description: 'Free, 24/7 crisis support via text message' },
  { name: 'SAMHSA National Helpline', number: '1-800-662-4357', description: '24/7 treatment referral and information service' },
  { name: 'Trevor Project (LGBTQ+)', number: '1-866-488-7386', description: '24/7 crisis intervention and suicide prevention' },
]

const CRISIS_TECHNIQUES = [
  { id: 'breathing', name: '4-7-8 Breathing', description: 'Inhale for 4 counts, hold for 7, exhale for 8. Repeat 4 times.' },
  { id: 'grounding', name: '5-4-3-2-1 Grounding', description: 'Name 5 things you see, 4 you can touch, 3 you hear, 2 you smell, 1 you taste.' },
  { id: 'cold_water', name: 'Cold Water Technique', description: 'Splash cold water on your face or hold ice cubes to reset your nervous system.' },
  { id: 'muscle_relaxation', name: 'Progressive Muscle Relaxation', description: 'Tense and release each muscle group from toes to head.' },
]

const COPING_STRATEGIES = [
  { title: 'Deep Breathing', description: 'Take slow, deep breaths to calm your nervous system', technique: '4-7-8 breathing: Inhale for 4, hold for 7, exhale for 8' },
  { title: 'Grounding (5-4-3-2-1)', description: 'Use your senses to ground yourself in the present moment', technique: 'Name 5 things you see, 4 you can touch, 3 you hear, 2 you smell, 1 you taste' },
  { title: 'Progressive Muscle Relaxation', description: 'Systematically tense and relax muscle groups', technique: 'Start with your toes and work up to your head, holding tension for 5 seconds' },
  { title: 'Mindful Observation', description: 'Focus on a single object to redirect your attention', technique: 'Choose an object and observe its color, texture, shape for 2-3 minutes' },
]

const GRATITUDE_PROMPTS = [
  'What made you smile today?',
  'Who are you thankful for and why?',
  'What challenge did you overcome recently?',
  'What simple pleasure brought you joy today?',
  'What opportunity are you grateful for?',
  'What lesson did you learn this week?',
  'What comfort are you grateful for?',
  'What beauty did you notice today?',
]

const MOOD_OPTIONS = [
  { value: 1, emoji: '😢', label: 'Very Low' },
  { value: 2, emoji: '😔', label: 'Low' },
  { value: 3, emoji: '😐', label: 'Neutral' },
  { value: 4, emoji: '😊', label: 'Good' },
  { value: 5, emoji: '😄', label: 'Great' },
]

const MOOD_FACTORS = ['sleep', 'exercise', 'social', 'work', 'weather', 'health', 'stress', 'medication']

const ALL_EXERCISES = Object.values(EXERCISE_DATA).flatMap((cat) => cat.exercises)
const TOTAL_EXERCISES = ALL_EXERCISES.length

function formatTime(totalSeconds) {
  const m = String(Math.floor(totalSeconds / 60)).padStart(2, '0')
  const s = String(totalSeconds % 60).padStart(2, '0')
  return `${m}:${s}`
}

export default function TherapySection({ onNavigate }) {
  const { t } = useLanguage()
  const [progress, setProgress] = useState(() => get('therapyProgress', {}))
  const [goals, setGoals] = useState(() => get('therapyGoals', []))
  const [goalInput, setGoalInput] = useState('')

  const [crisisOpen, setCrisisOpen] = useState(false)
  const [copingOpen, setCopingOpen] = useState(false)
  const [crisisPlanOpen, setCrisisPlanOpen] = useState(false)
  const [learnMore, setLearnMore] = useState(null)
  const [selector, setSelector] = useState(null)
  const [activeExerciseId, setActiveExerciseId] = useState(null)

  // CBT tool modals
  const [thoughtOpen, setThoughtOpen] = useState(false)
  const [breathingOpen, setBreathingOpen] = useState(false)
  const [moodOpen, setMoodOpen] = useState(false)
  const [gratitudeOpen, setGratitudeOpen] = useState(false)

  const completedCount = Object.values(progress).filter((p) => p.completionDate).length
  const streak = Object.values(progress).some((p) => p.completionDate === new Date().toDateString()) ? 1 : 0
  const pct = Math.round((completedCount / TOTAL_EXERCISES) * 100)

  const saveProgress = (next) => {
    setProgress(next)
    storageSet('therapyProgress', next)
  }

  const addGoal = () => {
    if (!goalInput.trim()) return
    const next = [...goals, { id: Date.now().toString(), text: goalInput.trim(), completed: false }]
    setGoals(next)
    storageSet('therapyGoals', next)
    setGoalInput('')
  }

  const completeGoal = (id) => {
    const next = goals.map((g) => (g.id === id ? { ...g, completed: !g.completed } : g))
    setGoals(next)
    storageSet('therapyGoals', next)
  }

  const deleteGoal = (id) => {
    if (!window.confirm('Delete this goal?')) return
    const next = goals.filter((g) => g.id !== id)
    setGoals(next)
    storageSet('therapyGoals', next)
  }

  const activeExercise = ALL_EXERCISES.find((ex) => ex.id === activeExerciseId)
  const activeProgress = activeExercise ? progress[activeExercise.id] ?? { completedSteps: [], notes: '' } : null

  const toggleStep = (index) => {
    if (!activeExercise) return
    const current = progress[activeExercise.id] ?? { completedSteps: [], notes: '' }
    const steps = current.completedSteps.includes(index)
      ? current.completedSteps.filter((i) => i !== index)
      : [...current.completedSteps, index]
    saveProgress({ ...progress, [activeExercise.id]: { ...current, completedSteps: steps } })
  }

  const saveNotes = (notes) => {
    if (!activeExercise) return
    const current = progress[activeExercise.id] ?? { completedSteps: [], notes: '' }
    saveProgress({ ...progress, [activeExercise.id]: { ...current, notes } })
  }

  const completeExercise = () => {
    if (!activeExercise) return
    const current = progress[activeExercise.id] ?? { completedSteps: [], notes: '' }
    saveProgress({
      ...progress,
      [activeExercise.id]: { ...current, completionDate: new Date().toDateString(), completedAt: new Date().toISOString() },
    })
    notify(t('exercise_completed'), 'success')
    setActiveExerciseId(null)
  }

  // ---- Tool modals handlers ----
  const [gratitudePrompt] = useState(() => GRATITUDE_PROMPTS[Math.floor(Math.random() * GRATITUDE_PROMPTS.length)])

  return (
    <div className="space-y-8">
      <SectionHeader title={t('therapy_title')} subtitle={t('therapy_subtitle')} />

      {/* Crisis banner */}
      <section className="flex flex-col items-center justify-between gap-4 rounded-3xl bg-[linear-gradient(135deg,#dc2626,#b91c1c)] p-6 text-white shadow-xl sm:flex-row">
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white/15 text-xl backdrop-blur">
            <i className="fas fa-hand-holding-heart" />
          </div>
          <div>
            <h3 className="text-lg font-bold">Need immediate support?</h3>
            <p className="text-sm text-white/85">Crisis resources are available 24/7. You matter.</p>
          </div>
        </div>
        <button
          type="button"
          onClick={() => setCrisisOpen(true)}
          className="flex items-center gap-2 rounded-full bg-white px-5 py-2.5 text-sm font-bold text-red-700 shadow-md transition-transform hover:scale-105"
        >
          <i className="fas fa-phone" /> {t('get_help_now')}
        </button>
      </section>

      {/* Progress overview */}
      <section className="flex flex-wrap items-center justify-center gap-6 rounded-3xl border border-line-light bg-gradient-to-br from-sky-50 to-blue-50 p-6 shadow-md dark:from-primary/5 dark:to-primary/10">
        {[
          { icon: 'fa-check-circle', value: completedCount, label: 'Exercises Completed' },
          { icon: 'fa-fire', value: streak, label: 'Day Streak' },
          { icon: 'fa-chart-line', value: `${pct}%`, label: 'Overall Progress' },
        ].map((stat) => (
          <div key={stat.label} className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[linear-gradient(135deg,#10b981,#059669)] text-lg text-white shadow-md">
              <i className={`fas ${stat.icon}`} />
            </div>
            <div>
              <div className="text-2xl font-extrabold text-gray-800 dark:text-ink">{stat.value}</div>
              <div className="text-xs font-medium text-gray-500 dark:text-ink-2">{stat.label}</div>
            </div>
          </div>
        ))}
      </section>

      {/* Therapy categories */}
      <section className="grid gap-5 md:grid-cols-3">
        {Object.entries(EXERCISE_DATA).map(([key, cat]) => (
          <div
            key={key}
            className="group relative overflow-hidden rounded-3xl border border-line-light bg-surface p-6 shadow-lg transition-all duration-300 hover:-translate-y-1.5 hover:shadow-2xl"
          >
            <div className={`mb-4 flex h-20 w-20 items-center justify-center rounded-2xl text-3xl ${cat.iconBg}`}>
              <i className={`fas ${cat.icon}`} />
            </div>
            <h3 className="text-lg font-bold text-ink">{cat.title}</h3>
            <p className="mt-1 text-sm text-ink-2">{cat.tagline}</p>
            <div className="mt-3 flex flex-wrap gap-1.5">
              {cat.featureTags.map((tag) => (
                <span key={tag} className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ${cat.tagColor}`}>
                  {tag}
                </span>
              ))}
            </div>
            <div className="mt-5 flex gap-2">
              <button
                type="button"
                onClick={() => setSelector(key)}
                className="flex-1 rounded-xl bg-[linear-gradient(135deg,var(--primary-color),var(--primary-dark))] px-4 py-2.5 text-sm font-semibold text-on-primary shadow-md transition-transform hover:scale-[1.03]"
              >
                {t('start_exercise')}
              </button>
              <button
                type="button"
                onClick={() => setLearnMore(key)}
                className="flex-1 rounded-xl border-2 border-primary px-4 py-2.5 text-sm font-semibold text-primary-text transition-colors hover:bg-primary/5"
              >
                {t('learn_more')}
              </button>
            </div>
          </div>
        ))}
      </section>

      {/* CBT tools grid */}
      <section>
        <div className="mb-6 text-center">
          <h2 className="text-2xl font-extrabold text-ink">Interactive Tools</h2>
          <p className="mt-1 text-ink-2">Practical exercises you can use right now</p>
        </div>
        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {[
            { icon: 'fa-clipboard-list', title: 'Thought Record', badge: 'CBT', open: () => setThoughtOpen(true) },
            { icon: 'fa-wind', title: 'Breathing Exercise', badge: 'Relaxation', open: () => setBreathingOpen(true) },
            { icon: 'fa-smile', title: 'Mood Tracker', badge: 'Analytics', open: () => setMoodOpen(true) },
            { icon: 'fa-heart', title: 'Gratitude Journal', badge: 'Positive', open: () => setGratitudeOpen(true) },
            { icon: 'fa-compass', title: 'Coping Strategies', badge: 'DBT', open: () => setCopingOpen(true) },
            { icon: 'fa-life-ring', title: 'Crisis Plan', badge: 'Safety', open: () => setCrisisPlanOpen(true) },
          ].map((tool) => (
            <div
              key={tool.title}
              className="group relative cursor-pointer overflow-hidden rounded-3xl border border-line-light bg-surface p-6 shadow-lg transition-all duration-300 hover:-translate-y-1.5 hover:shadow-2xl"
              onClick={tool.open}
              onKeyDown={(e) => {
                if (e.key === 'Enter') tool.open()
              }}
              role="button"
              tabIndex={0}
            >
              <span className="absolute top-0 left-0 h-1 w-full origin-left scale-x-0 bg-[linear-gradient(90deg,var(--primary-color),var(--secondary-color))] transition-transform duration-300 group-hover:scale-x-100" />
              <div className="flex items-start justify-between">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[linear-gradient(135deg,var(--primary-color),var(--secondary-color))] text-on-primary shadow-md">
                  <i className={`fas ${tool.icon}`} />
                </div>
                <span className="rounded-full bg-primary/10 px-2.5 py-1 text-[10px] font-bold text-primary-text">{tool.badge}</span>
              </div>
              <h3 className="mt-4 text-lg font-bold text-ink">{tool.title}</h3>
              <p className="mt-1 text-sm text-ink-2">Open the tool to get started</p>
            </div>
          ))}
        </div>
      </section>

      {/* Goals */}
      <section className="rounded-3xl border border-amber-200 bg-[linear-gradient(135deg,#fef3c7,#fde68a)] p-6 shadow-md dark:border-warning/30 dark:from-warning/10 dark:to-warning/20">
        <h2 className="text-lg font-bold text-amber-900 dark:text-warning">Therapy Goals</h2>
        <p className="mt-1 text-sm text-amber-800/80 dark:text-ink-2">Set small, achievable goals for your therapy journey</p>
        <div className="mt-4 flex gap-2">
          <input
            type="text"
            value={goalInput}
            onChange={(e) => setGoalInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') addGoal()
            }}
            placeholder="e.g. Practice deep breathing daily"
            className="flex-1 rounded-xl border border-amber-300 bg-white px-4 py-2.5 text-sm text-ink placeholder:text-ink-3 focus:border-amber-500 focus:outline-none"
          />
          <button
            type="button"
            onClick={addGoal}
            className="rounded-xl bg-amber-500 px-5 py-2.5 text-sm font-semibold text-white shadow-md transition-colors hover:bg-amber-600"
          >
            {t('add_goal')}
          </button>
        </div>
        {goals.length > 0 && (
          <ul className="mt-4 space-y-2">
            {goals.map((goal) => (
              <li
                key={goal.id}
                className={`flex items-center justify-between gap-3 rounded-xl border bg-white px-4 py-3 text-sm ${
                  goal.completed ? 'border-green-200 text-ink-3 line-through' : 'border-amber-200 text-ink'
                }`}
              >
                <span className="flex-1">{goal.text}</span>
                <button
                  type="button"
                  onClick={() => completeGoal(goal.id)}
                  title={t('complete')}
                  className="h-8 w-8 rounded-full bg-green-100 text-green-700 transition-colors hover:bg-green-200"
                >
                  <i className="fas fa-check" />
                </button>
                <button
                  type="button"
                  onClick={() => deleteGoal(goal.id)}
                  title={t('delete')}
                  className="h-8 w-8 rounded-full bg-red-100 text-red-600 transition-colors hover:bg-red-200"
                >
                  <i className="fas fa-trash" />
                </button>
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* ============ Modals ============ */}

      {/* Exercise selector */}
      <Modal open={!!selector} onClose={() => setSelector(null)} title={selector ? EXERCISE_DATA[selector].title : ''} icon={selector ? EXERCISE_DATA[selector].icon : undefined}>
        <p className="mb-4 text-sm text-ink-2">Choose an exercise to begin</p>
        <div className="space-y-3">
          {selector &&
            EXERCISE_DATA[selector].exercises.map((ex) => (
              <div
                key={ex.id}
                className="flex items-center justify-between gap-3 rounded-2xl border border-line-light bg-canvas p-4 transition-colors hover:border-primary"
              >
                <div className="min-w-0">
                  <h4 className="font-bold text-ink">{ex.name}</h4>
                  <p className="text-xs text-ink-2">{ex.description}</p>
                  <p className="mt-1 text-[11px] font-semibold text-ink-3">
                    {ex.duration} • {ex.difficulty}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setActiveExerciseId(ex.id)
                    setSelector(null)
                  }}
                  className="shrink-0 rounded-xl bg-[linear-gradient(135deg,var(--primary-color),var(--primary-dark))] px-4 py-2 text-xs font-semibold text-on-primary shadow-md transition-transform hover:scale-105"
                >
                  Start
                </button>
              </div>
            ))}
        </div>
      </Modal>

      {/* Exercise interface */}
      <Modal
        open={!!activeExercise}
        onClose={() => setActiveExerciseId(null)}
        title={activeExercise?.name}
        icon="fa-list-check"
        maxWidth="max-w-2xl"
      >
        {activeExercise && activeProgress && (
          <div>
            <p className="text-sm text-ink-2">{activeExercise.description}</p>
            <p className="mt-1 text-xs font-semibold text-ink-3">
              {activeExercise.duration} • {activeExercise.difficulty}
            </p>
            <ol className="mt-4 space-y-2">
              {activeExercise.steps.map((step, i) => (
                <li key={i}>
                  <button
                    type="button"
                    onClick={() => toggleStep(i)}
                    className={`flex w-full items-start gap-3 rounded-xl border p-3 text-left text-sm transition-colors ${
                      activeProgress.completedSteps.includes(i)
                        ? 'border-green-200 bg-green-50 text-green-800 dark:bg-success/10 dark:text-success'
                        : 'border-line-light bg-canvas text-ink hover:border-primary'
                    }`}
                  >
                    <span
                      className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-md text-[10px] ${
                        activeProgress.completedSteps.includes(i) ? 'bg-green-500 text-white' : 'border border-ink-3 text-transparent'
                      }`}
                    >
                      <i className="fas fa-check" />
                    </span>
                    <span>{step}</span>
                  </button>
                </li>
              ))}
            </ol>
            <textarea
              value={activeProgress.notes}
              onChange={(e) => saveNotes(e.target.value)}
              placeholder="Add notes about this exercise..."
              className="mt-4 w-full rounded-xl border border-line-light bg-canvas p-3 text-sm text-ink placeholder:text-ink-3 focus:border-primary focus:outline-none"
              rows={3}
            />
            <div className="mt-4 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setActiveExerciseId(null)}
                className="rounded-xl border border-line-light px-4 py-2.5 text-sm font-semibold text-ink-2 hover:bg-surface-hover"
              >
                {t('save')}
              </button>
              <button
                type="button"
                onClick={completeExercise}
                className="rounded-xl bg-[linear-gradient(135deg,var(--primary-color),var(--primary-dark))] px-4 py-2.5 text-sm font-semibold text-on-primary shadow-md transition-transform hover:scale-105"
              >
                {t('complete')}
              </button>
            </div>
          </div>
        )}
      </Modal>

      {/* Learn more */}
      <Modal open={!!learnMore} onClose={() => setLearnMore(null)} title={learnMore ? LEARN_MORE_INFO[learnMore].title : ''} icon="fa-book-open" maxWidth="max-w-2xl">
        {learnMore && (
          <div className="space-y-4 text-sm text-ink-2">
            <p className="leading-relaxed">{LEARN_MORE_INFO[learnMore].overview}</p>
            <div>
              <h4 className="mb-2 font-bold text-ink">Benefits</h4>
              <ul className="space-y-1.5">
                {LEARN_MORE_INFO[learnMore].benefits.map((b) => (
                  <li key={b} className="flex items-start gap-2">
                    <i className="fas fa-check-circle mt-0.5 text-success" /> {b}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="mb-2 font-bold text-ink">Techniques</h4>
              <ul className="space-y-1.5">
                {LEARN_MORE_INFO[learnMore].techniques.map((tech) => (
                  <li key={tech} className="flex items-start gap-2">
                    <i className="fas fa-chevron-right mt-0.5 text-primary-text" /> {tech}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </Modal>

      {/* Crisis support */}
      <Modal open={crisisOpen} onClose={() => setCrisisOpen(false)} title="Crisis Support" icon="fa-phone" maxWidth="max-w-xl">
        <div className="space-y-4">
          <div className="space-y-2">
            {CRISIS_HOTLINES.map((h) => (
              <div key={h.number} className="flex items-center justify-between gap-3 rounded-2xl border border-red-100 bg-red-50 p-4 dark:border-danger/30 dark:bg-danger/10">
                <div>
                  <h4 className="font-bold text-ink">{h.name}</h4>
                  <p className="text-xs text-ink-2">{h.description}</p>
                </div>
                <span className="shrink-0 rounded-full bg-danger px-3 py-1.5 text-xs font-bold text-white">{h.number}</span>
              </div>
            ))}
          </div>
          <div>
            <h4 className="mb-2 text-sm font-bold text-ink">Calming techniques</h4>
            <div className="grid gap-2 sm:grid-cols-2">
              {CRISIS_TECHNIQUES.map((tech) => (
                <div key={tech.id} className="rounded-xl border border-line-light bg-canvas p-3">
                  <h5 className="text-xs font-bold text-ink">{tech.name}</h5>
                  <p className="mt-1 text-[11px] text-ink-2">{tech.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Modal>

      {/* Coping strategies */}
      <Modal open={copingOpen} onClose={() => setCopingOpen(false)} title="Coping Strategies" icon="fa-compass" maxWidth="max-w-xl">
        <div className="space-y-3">
          {COPING_STRATEGIES.map((s) => (
            <div key={s.title} className="rounded-2xl border border-line-light bg-canvas p-4">
              <h4 className="font-bold text-ink">{s.title}</h4>
              <p className="mt-1 text-xs text-ink-2">{s.description}</p>
              <p className="mt-2 rounded-lg bg-primary/5 px-3 py-2 text-xs font-medium text-primary-text">{s.technique}</p>
            </div>
          ))}
        </div>
      </Modal>

      {/* Crisis plan */}
      <Modal open={crisisPlanOpen} onClose={() => setCrisisPlanOpen(false)} title="My Crisis Plan" icon="fa-life-ring" maxWidth="max-w-xl">
        <div className="space-y-4 text-sm text-ink-2">
          <div className="rounded-2xl border border-red-100 bg-red-50 p-4 dark:border-danger/30 dark:bg-danger/10">
            <h4 className="font-bold text-ink">Step 1 — Immediate Safety</h4>
            <p className="mt-1 text-xs">Call 988, text HOME to 741741, or call 911 in an emergency.</p>
          </div>
          <div className="rounded-2xl border border-line-light bg-canvas p-4">
            <h4 className="font-bold text-ink">Step 2 — Campus Resources</h4>
            <ul className="mt-2 space-y-1 text-xs">
              <li>Counseling Center: (555) 123-4567</li>
              <li>Crisis Hotline: (555) 987-6543</li>
              <li>Emergency Room — Campus Medical Center</li>
            </ul>
          </div>
          <div className="rounded-2xl border border-line-light bg-canvas p-4">
            <h4 className="font-bold text-ink">Step 3 — Self-Care</h4>
            <ul className="mt-2 space-y-1 text-xs">
              <li>Reach out to a trusted person</li>
              <li>Use calming breathing techniques</li>
              <li>Remove means of harm from reach</li>
              <li>Move to a safe, comforting space</li>
            </ul>
          </div>
        </div>
      </Modal>

      {/* Breathing exercise */}
      <BreathingModal open={breathingOpen} onClose={() => setBreathingOpen(false)} />

      {/* Mood tracker */}
      <MoodModal open={moodOpen} onClose={() => setMoodOpen(false)} />

      {/* Gratitude journal */}
      <GratitudeModal open={gratitudeOpen} onClose={() => setGratitudeOpen(false)} prompt={gratitudePrompt} />

      {/* Thought record */}
      <ThoughtRecordModal open={thoughtOpen} onClose={() => setThoughtOpen(false)} />
    </div>
  )
}

function BreathingModal({ open, onClose }) {
  const { t } = useLanguage()
  const [inhale, setInhale] = useState(4)
  const [exhale, setExhale] = useState(6)
  const [running, setRunning] = useState(false)
  const [phase, setPhase] = useState('inhale')
  const [elapsed, setElapsed] = useState(0)
  const timerRef = useRef(null)

  useEffect(() => {
    if (!running) return
    timerRef.current = setInterval(() => setElapsed((e) => e + 1), 1000)
    return () => clearInterval(timerRef.current)
  }, [running])

  useEffect(() => {
    if (!running) return
    const cycle = setInterval(() => {
      setPhase((p) => (p === 'inhale' ? 'exhale' : 'inhale'))
    }, (phase === 'inhale' ? inhale : exhale) * 1000)
    return () => clearInterval(cycle)
  }, [running, phase, inhale, exhale])

  const stop = () => {
    setRunning(false)
    setElapsed(0)
    setPhase('inhale')
  }

  const setPreset = (i, e) => {
    setInhale(i)
    setExhale(e)
  }

  const scale = phase === 'inhale' ? 1.3 : 1

  return (
    <Modal open={open} onClose={() => { stop(); onClose() }} title="Breathing Exercise" icon="fa-wind" maxWidth="max-w-md">
      <div className="flex flex-col items-center">
        <div className="flex items-center justify-center" style={{ width: 260, height: 260 }}>
          <div
            className="flex items-center justify-center rounded-full bg-[linear-gradient(135deg,var(--primary-color),var(--primary-light))] text-on-primary shadow-glow transition-transform ease-in-out"
            style={{
              width: 220,
              height: 220,
              transform: `scale(${scale})`,
              transitionDuration: `${running ? (phase === 'inhale' ? inhale : exhale) : 0.3}s`,
            }}
          >
            <div className="text-center">
              <div className="text-lg font-bold">{phase === 'inhale' ? 'Inhale' : 'Exhale'}</div>
              <div className="text-xs opacity-80">{formatTime(elapsed)}</div>
            </div>
          </div>
        </div>

        <div className="mt-4 w-full space-y-3">
          <label className="block text-xs font-semibold text-ink-2">
            Inhale duration: <span className="text-primary-text">{inhale}s</span>
            <input type="range" min={3} max={8} value={inhale} onChange={(e) => setInhale(Number(e.target.value))} className="mt-1 w-full accent-[var(--primary-color)]" />
          </label>
          <label className="block text-xs font-semibold text-ink-2">
            Exhale duration: <span className="text-primary-text">{exhale}s</span>
            <input type="range" min={3} max={8} value={exhale} onChange={(e) => setExhale(Number(e.target.value))} className="mt-1 w-full accent-[var(--primary-color)]" />
          </label>
          <div className="flex justify-center gap-2">
            {[
              { l: '5 min', i: 3, e: 4 },
              { l: '10 min', i: 4, e: 6 },
              { l: '15 min', i: 5, e: 7 },
            ].map((p) => (
              <button
                key={p.l}
                type="button"
                onClick={() => setPreset(p.i, p.e)}
                className="rounded-full border border-line-light px-3 py-1.5 text-xs font-semibold text-ink-2 transition-colors hover:border-primary hover:text-primary-text"
              >
                {p.l}
              </button>
            ))}
          </div>
          <div className="flex justify-center gap-2">
            {!running ? (
              <button
                type="button"
                onClick={() => setRunning(true)}
                className="rounded-full bg-[linear-gradient(135deg,var(--primary-color),var(--primary-dark))] px-6 py-2.5 text-sm font-semibold text-on-primary shadow-md transition-transform hover:scale-105"
              >
                <i className="fas fa-play mr-2" />Start
              </button>
            ) : (
              <>
                <button
                  type="button"
                  onClick={() => setRunning(false)}
                  className="rounded-full bg-warning px-6 py-2.5 text-sm font-semibold text-white shadow-md transition-transform hover:scale-105"
                >
                  <i className="fas fa-pause mr-2" />Pause
                </button>
                <button
                  type="button"
                  onClick={stop}
                  className="rounded-full bg-danger px-6 py-2.5 text-sm font-semibold text-white shadow-md transition-transform hover:scale-105"
                >
                  <i className="fas fa-stop mr-2" />Stop
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </Modal>
  )
}

function MoodModal({ open, onClose }) {
  const { t } = useLanguage()
  const [mood, setMood] = useState(null)
  const [factors, setFactors] = useState([])
  const [note, setNote] = useState('')

  const toggleFactor = (f) => {
    setFactors((prev) => (prev.includes(f) ? prev.filter((x) => x !== f) : [...prev, f]))
  }

  const save = () => {
    if (!mood) {
      notify('Please select how you are feeling', 'warning')
      return
    }
    const moodOpt = MOOD_OPTIONS.find((m) => m.value === mood)
    const history = get('moodHistory', [])
    storageSet('moodHistory', [
      ...history,
      { mood, moodText: `${moodOpt.emoji} ${moodOpt.label}`, factors, note, timestamp: new Date().toISOString(), date: new Date().toDateString() },
    ])
    notify(t('mood_updated'), 'success')
    setMood(null)
    setFactors([])
    setNote('')
    onClose()
  }

  return (
    <Modal open={open} onClose={onClose} title="Mood Tracker" icon="fa-smile" maxWidth="max-w-md">
      <p className="mb-3 text-sm font-semibold text-ink-2">How are you feeling right now?</p>
      <div className="flex flex-wrap justify-center gap-2">
        {MOOD_OPTIONS.map((m) => (
          <button
            key={m.value}
            type="button"
            onClick={() => setMood(m.value)}
            className={`flex flex-col items-center gap-1 rounded-2xl border px-4 py-3 text-center transition-all ${
              mood === m.value ? 'border-primary bg-primary/10 shadow-md' : 'border-line-light bg-canvas hover:border-primary'
            }`}
          >
            <span className="text-2xl">{m.emoji}</span>
            <span className="text-[11px] font-semibold text-ink-2">{m.label}</span>
          </button>
        ))}
      </div>
      <p className="mt-4 mb-2 text-sm font-semibold text-ink-2">What factors might be affecting your mood?</p>
      <div className="flex flex-wrap gap-2">
        {MOOD_FACTORS.map((f) => (
          <button
            key={f}
            type="button"
            onClick={() => toggleFactor(f)}
            className={`rounded-full border px-3 py-1.5 text-xs font-semibold capitalize transition-colors ${
              factors.includes(f) ? 'border-primary bg-primary text-on-primary' : 'border-line-light bg-canvas text-ink-2 hover:border-primary'
            }`}
          >
            {f}
          </button>
        ))}
      </div>
      <textarea
        value={note}
        onChange={(e) => setNote(e.target.value)}
        placeholder="Add a note (optional)..."
        rows={3}
        className="mt-4 w-full rounded-xl border border-line-light bg-canvas p-3 text-sm text-ink placeholder:text-ink-3 focus:border-primary focus:outline-none"
      />
      <div className="mt-4 flex justify-end">
        <button
          type="button"
          onClick={save}
          className="rounded-xl bg-[linear-gradient(135deg,var(--primary-color),var(--primary-dark))] px-6 py-2.5 text-sm font-semibold text-on-primary shadow-md transition-transform hover:scale-105"
        >
          {t('save')}
        </button>
      </div>
    </Modal>
  )
}

function GratitudeModal({ open, onClose, prompt }) {
  const { t } = useLanguage()
  const [entries, setEntries] = useState(['', '', ''])

  const save = () => {
    const filled = entries.filter((e) => e.trim())
    if (filled.length === 0) {
      notify('Add at least one gratitude entry', 'warning')
      return
    }
    const history = get('gratitudeHistory', [])
    storageSet('gratitudeHistory', [...history, { entries: filled, date: new Date().toDateString(), dayOfYear: String(Math.floor(Date.now() / 86400000)) }])
    notify('Gratitude saved!', 'success')
    setEntries(['', '', ''])
    onClose()
  }

  return (
    <Modal open={open} onClose={onClose} title="Gratitude Journal" icon="fa-heart" maxWidth="max-w-md">
      <div className="mb-4 rounded-xl bg-primary/5 px-4 py-3 text-sm font-medium text-primary-text">
        <i className="fas fa-lightbulb mr-2" />
        {prompt}
      </div>
      {entries.map((entry, i) => (
        <input
          key={i}
          type="text"
          value={entry}
          onChange={(e) => setEntries((prev) => prev.map((x, j) => (j === i ? e.target.value : x)))}
          placeholder={`Gratitude ${i + 1}`}
          className="mb-2 w-full rounded-xl border border-line-light bg-canvas px-4 py-2.5 text-sm text-ink placeholder:text-ink-3 focus:border-primary focus:outline-none"
        />
      ))}
      <div className="mt-4 flex justify-end">
        <button
          type="button"
          onClick={save}
          className="rounded-xl bg-[linear-gradient(135deg,var(--primary-color),var(--primary-dark))] px-6 py-2.5 text-sm font-semibold text-on-primary shadow-md transition-transform hover:scale-105"
        >
          {t('save')}
        </button>
      </div>
    </Modal>
  )
}

function ThoughtRecordModal({ open, onClose }) {
  const { t } = useLanguage()
  const [form, setForm] = useState({
    before: { anxiety: 5, sadness: 5, anger: 5 },
    situation: '',
    thoughts: '',
    evidenceFor: '',
    evidenceAgainst: '',
    balancedThought: '',
    after: { anxiety: 5, sadness: 5, anger: 5 },
  })

  const setBefore = (key, val) => setForm((f) => ({ ...f, before: { ...f.before, [key]: val } }))
  const setAfter = (key, val) => setForm((f) => ({ ...f, after: { ...f.after, [key]: val } }))

  const save = () => {
    const history = get('thoughtHistory', [])
    storageSet('thoughtHistory', [...history, { ...form, timestamp: new Date().toISOString(), date: new Date().toDateString() }])
    notify('Thought record saved!', 'success')
    setForm({ before: { anxiety: 5, sadness: 5, anger: 5 }, situation: '', thoughts: '', evidenceFor: '', evidenceAgainst: '', balancedThought: '', after: { anxiety: 5, sadness: 5, anger: 5 } })
    onClose()
  }

  const sliders = [
    { key: 'anxiety', label: 'Anxiety' },
    { key: 'sadness', label: 'Sadness' },
    { key: 'anger', label: 'Anger' },
  ]

  return (
    <Modal open={open} onClose={onClose} title="Thought Record" icon="fa-clipboard-list" maxWidth="max-w-2xl">
      <p className="mb-3 text-sm font-semibold text-ink-2">Rate your emotions before (1-10)</p>
      <div className="grid gap-3 sm:grid-cols-3">
        {sliders.map((s) => (
          <label key={s.key} className="rounded-xl border border-line-light bg-canvas p-3 text-xs font-semibold text-ink-2">
            {s.label}: <span className="text-primary-text">{form.before[s.key]}</span>
            <input type="range" min={1} max={10} value={form.before[s.key]} onChange={(e) => setBefore(s.key, Number(e.target.value))} className="mt-1 w-full accent-[var(--primary-color)]" />
          </label>
        ))}
      </div>
      {[
        { key: 'situation', label: 'Situation', ph: 'Describe what happened' },
        { key: 'thoughts', label: 'Automatic thoughts', ph: 'What went through your mind?' },
        { key: 'evidenceFor', label: 'Evidence for the thought', ph: 'Facts that support it' },
        { key: 'evidenceAgainst', label: 'Evidence against the thought', ph: 'Facts that challenge it' },
        { key: 'balancedThought', label: 'Balanced thought', ph: 'A more balanced perspective' },
      ].map((field) => (
        <div key={field.key}>
          <label className="mb-1 block text-xs font-semibold text-ink-2">{field.label}</label>
          <textarea
            value={form[field.key]}
            onChange={(e) => setForm((f) => ({ ...f, [field.key]: e.target.value }))}
            placeholder={field.ph}
            rows={2}
            className="mb-2 w-full rounded-xl border border-line-light bg-canvas p-3 text-sm text-ink placeholder:text-ink-3 focus:border-primary focus:outline-none"
          />
        </div>
      ))}
      <p className="mb-3 text-sm font-semibold text-ink-2">Rate your emotions after</p>
      <div className="grid gap-3 sm:grid-cols-3">
        {sliders.map((s) => (
          <label key={s.key} className="rounded-xl border border-line-light bg-canvas p-3 text-xs font-semibold text-ink-2">
            {s.label}: <span className="text-primary-text">{form.after[s.key]}</span>
            <input type="range" min={1} max={10} value={form.after[s.key]} onChange={(e) => setAfter(s.key, Number(e.target.value))} className="mt-1 w-full accent-[var(--primary-color)]" />
          </label>
        ))}
      </div>
      <div className="mt-4 flex justify-end">
        <button
          type="button"
          onClick={save}
          className="rounded-xl bg-[linear-gradient(135deg,var(--primary-color),var(--primary-dark))] px-6 py-2.5 text-sm font-semibold text-on-primary shadow-md transition-transform hover:scale-105"
        >
          {t('save')}
        </button>
      </div>
    </Modal>
  )
}
