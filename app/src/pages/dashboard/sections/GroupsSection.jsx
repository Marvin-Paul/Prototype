import { useEffect, useMemo, useRef, useState } from 'react'
import Icon from '../../../shared/Icon'
import { useLanguage } from '../../../shared/LanguageProvider'
import { getGuestUser } from '../../../shared/guestUser'
import { notify } from '../../../shared/toast'
import SectionHeader from '../components/SectionHeader'
import {
  MOODS,
  MOOD_RESOURCES,
  MOOD_CHALLENGES,
  CRISIS_INFO,
  GUIDELINES,
  CHAT_SETTINGS_DEFAULTS,
  REPORT_REASONS,
  makeMessage,
} from './groups/data'
import {
  seedAllGroups,
  loadMembers,
  loadMessages,
  saveMessages,
  loadDMs,
  saveDMs,
  seedDm,
  loadPolls,
  savePolls,
  loadPollVotes,
  savePollVotes,
  loadMovements,
  addMovement,
  addReport,
  loadChatSettings,
  saveChatSettings,
  MOOD_STORAGE_KEY,
  membersKey,
} from './groups/groupStorage'
import { get } from '../../../shared/storage'

function SectionTitle({ icon, title, subtitle }) {
  return (
    <div className="mb-5 flex items-start gap-4">
      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-xl text-primary-text">
        <Icon icon={icon} />
      </div>
      <div>
        <h3 className="text-xl font-bold text-ink">{title}</h3>
        {subtitle && <p className="mt-0.5 text-sm text-ink-2">{subtitle}</p>}
      </div>
    </div>
  )
}

function Modal({ onClose, children, wide }) {
  return (
    <div
      className="fixed inset-0 z-[150] flex items-center justify-center bg-ink/50 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className={`w-full ${wide ? 'max-w-2xl' : 'max-w-lg'} max-h-[88vh] animate-fade-up overflow-y-auto rounded-3xl border border-line-light bg-surface p-6 shadow-2xl`}
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </div>
    </div>
  )
}

function ModalHeader({ title, icon, onClose }) {
  return (
    <div className="mb-5 flex items-center justify-between gap-3">
      <h2 className="flex items-center gap-2 text-lg font-bold text-ink">
        <Icon icon={icon} className="text-primary-text" />
        {title}
      </h2>
      <button
        type="button"
        onClick={onClose}
        aria-label="Close"
        className="flex h-9 w-9 items-center justify-center rounded-full text-lg text-ink-2 transition-colors hover:bg-surface-hover hover:text-danger"
      >
        ×
      </button>
    </div>
  )
}

function MoodSelector({ currentMood, onSelect }) {
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
      {Object.entries(MOODS).map(([key, mood]) => {
        const isCurrent = key === currentMood
        return (
          <button
            key={key}
            type="button"
            onClick={() => onSelect(key)}
            className={`flex flex-col items-center gap-1.5 rounded-2xl border p-3 text-center transition-all duration-200 ${
              isCurrent
                ? 'border-primary bg-primary/10 shadow-md'
                : 'border-line-light bg-canvas hover:border-primary hover:shadow-md'
            }`}
          >
            <Icon icon={mood.icon} className="text-3xl" />
            <span className="text-xs font-semibold text-ink">{mood.description}</span>
            <span className="text-[10px] text-ink-2">{isCurrent ? 'Current' : `Join ${mood.groupName}`}</span>
          </button>
        )
      })}
    </div>
  )
}

function CrisisCard({ onCrisis }) {
  const items = [
    { key: 'phone', title: 'Call 988', subtitle: 'Crisis Hotline', icon: 'fa-phone-alt', color: 'bg-danger/10 text-danger' },
    { key: 'text', title: 'Text 741741', subtitle: 'Crisis Text Line', icon: 'fa-comment', color: 'bg-primary/10 text-primary-text' },
    { key: '911', title: 'Call 911', subtitle: 'Emergency Services', icon: 'fa-exclamation-triangle', color: 'bg-warning/10 text-warning' },
  ]
  return (
    <div className="mb-8 rounded-3xl border border-line-light bg-surface p-6 shadow-sm">
      <SectionTitle icon="fa-life-ring" title="Crisis Support" subtitle="Immediate help when you need it most" />
      <div className="grid gap-3 sm:grid-cols-3">
        {items.map((item) => (
          <button
            key={item.key}
            type="button"
            onClick={() => onCrisis(item.key)}
            className="flex items-center gap-3 rounded-2xl border border-line-light bg-canvas p-4 text-left transition-all duration-200 hover:-translate-y-0.5 hover:border-primary hover:shadow-md"
          >
            <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full ${item.color}`}>
              <Icon icon={item.icon} />
            </div>
            <div>
              <p className="text-sm font-bold text-ink">{item.title}</p>
              <p className="text-xs text-ink-2">{item.subtitle}</p>
            </div>
          </button>
        ))}
      </div>
    </div>
  )
}

function MoodReportCard({ onReport }) {
  return (
    <div className="mb-8 overflow-hidden rounded-3xl bg-[linear-gradient(135deg,var(--primary-color),var(--secondary-color))] p-8 text-on-primary shadow-lg">
      <div className="flex flex-col items-center justify-between gap-4 text-center sm:flex-row sm:text-left">
        <div>
          <h2 className="text-xl font-bold sm:text-2xl">
            <Icon icon="fa-heart" className="mr-2" />
            Join a Supportive Community
          </h2>
          <p className="mt-1 text-white/90">Share your current mood and connect with others who feel the same way</p>
        </div>
        <button
          type="button"
          onClick={onReport}
          className="shrink-0 rounded-full bg-white px-6 py-3 text-sm font-bold text-primary-text shadow-md transition-all duration-200 hover:-translate-y-0.5 hover:shadow-xl"
        >
          <Icon icon="fa-users" className="mr-2" />
          Report My Mood &amp; Join Group
        </button>
      </div>
    </div>
  )
}

function GroupsGrid({ currentMood, onJoin }) {
  return (
    <div className="mb-8">
      <SectionTitle
        icon="fa-users"
        title="Available Mood Groups"
        subtitle="Join a group that matches your current emotional state"
      />
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {Object.entries(MOODS).map(([key, mood]) => {
          const count = get(membersKey(key), []).length
          const isCurrent = key === currentMood
          return (
            <div
              key={key}
              className="flex flex-col rounded-3xl border border-line-light bg-surface p-5 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg"
            >
              <div className="flex items-center gap-3">
                <span
                  className="flex h-12 w-12 items-center justify-center rounded-2xl text-2xl"
                  style={{ backgroundColor: `${mood.color}1a` }}
                >
                  <Icon icon={mood.icon} className="text-2xl" />
                </span>
                <div className="min-w-0">
                  <h4 className="truncate text-sm font-bold text-ink">{mood.groupName}</h4>
                  <p className="text-xs text-ink-2">{mood.description}</p>
                </div>
              </div>
              <div className="mt-4 flex items-center justify-between text-xs text-ink-2">
                <span>
                  <Icon icon="fa-user" className="mr-1" />
                  {count} {count === 1 ? 'member' : 'members'}
                </span>
                <span
                  className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${
                    count > 0 ? 'bg-success/10 text-success' : 'bg-ink-2/10 text-ink-2'
                  }`}
                >
                  {count > 0 ? 'Active' : 'Inactive'}
                </span>
              </div>
              <button
                type="button"
                onClick={() => onJoin(key)}
                disabled={isCurrent}
                className={`mt-4 w-full rounded-xl px-4 py-2 text-sm font-semibold transition-all duration-200 ${
                  isCurrent
                    ? 'cursor-default bg-primary/10 text-primary-text'
                    : 'bg-primary text-on-primary hover:opacity-90'
                }`}
              >
                <Icon icon={isCurrent ? 'fa-check' : 'fa-sign-in-alt'} className="mr-2" />
                {isCurrent ? 'Current Group' : 'Join Group'}
              </button>
            </div>
          )
        })}
      </div>
    </div>
  )
}

function GuidelinesCard() {
  return (
    <div className="rounded-3xl border border-line-light bg-surface p-6 shadow-sm">
      <SectionTitle icon="fa-shield-alt" title="Community Guidelines" />
      <div className="grid gap-3 sm:grid-cols-2">
        {GUIDELINES.map((g) => (
          <div key={g.icon} className="flex items-center gap-3 rounded-2xl bg-canvas p-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary-text">
              <Icon icon={g.icon} />
            </div>
            <p className="text-sm text-ink">{g.text}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

function PollCard({ poll, votedIndex, showResults, onToggleResults, onVote }) {
  const total = poll.options.reduce((sum, o) => sum + o.votes, 0) || 1
  return (
    <div className="rounded-2xl border border-line-light bg-surface p-5">
      <div className="mb-4 flex items-start justify-between gap-3">
        <h4 className="text-sm font-bold text-ink">{poll.question}</h4>
        <span
          className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-semibold ${
            poll.active ? 'bg-success/10 text-success' : 'bg-ink-2/10 text-ink-2'
          }`}
        >
          {poll.active ? 'Active' : 'Closed'}
        </span>
      </div>
      <div className="space-y-2">
        {poll.options.map((option, idx) => {
          const pct = Math.round((option.votes / total) * 100)
          const isSelected = votedIndex === idx
          if (showResults || votedIndex !== undefined) {
            return (
              <div key={idx}>
                <div className="mb-1 flex items-center justify-between text-xs">
                  <span className={`font-medium ${isSelected ? 'text-primary-text' : 'text-ink'}`}>
                    {isSelected && <Icon icon="fa-check-circle" className="mr-1" />}
                    {option.text}
                  </span>
                  <span className="text-ink-2">
                    {option.votes} votes ({pct}%)
                  </span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-canvas">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${isSelected ? 'bg-primary' : 'bg-primary/30'}`}
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </div>
            )
          }
          return (
            <label
              key={idx}
              className={`flex cursor-pointer items-center gap-2 rounded-xl border p-3 text-sm transition-colors ${
                isSelected ? 'border-primary bg-primary/5 text-primary-text' : 'border-line-light bg-canvas text-ink hover:border-primary'
              }`}
            >
              <input
                type="radio"
                name={`poll_${poll.id}`}
                checked={isSelected}
                onChange={() => onVote(poll.id, idx)}
                className="accent-[var(--primary-color)]"
              />
              <span>{option.text}</span>
            </label>
          )
        })}
      </div>
      <div className="mt-4 flex items-center gap-2">
        {votedIndex === undefined ? (
          <>
            <button
              type="button"
              onClick={() => onVote(poll.id, 0)}
              className="flex items-center gap-1.5 rounded-full bg-primary px-4 py-1.5 text-xs font-semibold text-on-primary transition-opacity hover:opacity-90"
            >
              <Icon icon="fa-vote-yea" />
              Vote
            </button>
            <button
              type="button"
              onClick={onToggleResults}
              className="flex items-center gap-1.5 rounded-full border border-line-light px-4 py-1.5 text-xs font-semibold text-ink-2 transition-colors hover:border-primary hover:text-primary-text"
            >
              <Icon icon="fa-chart-bar" />
              Results
            </button>
          </>
        ) : (
          <button
            type="button"
            onClick={onToggleResults}
            className="flex items-center gap-1.5 rounded-full border border-line-light px-4 py-1.5 text-xs font-semibold text-ink-2 transition-colors hover:border-primary hover:text-primary-text"
          >
            <Icon icon="fa-chart-bar" />
            {showResults ? 'Hide Results' : 'Show Results'}
          </button>
        )}
      </div>
    </div>
  )
}

function ChallengeCard({ challenge, onJoin }) {
  return (
    <div className="flex flex-col rounded-2xl border border-line-light bg-surface p-5">
      <div className="mb-3 flex items-start justify-between gap-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[linear-gradient(135deg,#667eea,#764ba2)] text-white">
          <Icon icon={challenge.icon} />
        </div>
        <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-semibold text-primary-text">{challenge.category}</span>
      </div>
      <h4 className="text-sm font-bold text-ink">{challenge.title}</h4>
      <p className="mt-1 flex-1 text-xs leading-relaxed text-ink-2">{challenge.description}</p>
      <div className="mt-3 flex items-center gap-4 text-xs text-ink-2">
        <span>
          <Icon icon="fa-clock" className="mr-1" />
          {challenge.duration}
        </span>
        <span>
          <Icon icon="fa-users" className="mr-1" />
          {challenge.participants} participants
        </span>
      </div>
      <div className="mt-3">
        <div className="mb-1 flex items-center justify-between text-xs">
          <span className="text-ink-2">Progress</span>
          <span className="font-semibold text-ink">{challenge.progress}%</span>
        </div>
        <div className="h-2 overflow-hidden rounded-full bg-canvas">
          <div className="h-full rounded-full bg-primary" style={{ width: `${challenge.progress}%` }} />
        </div>
      </div>
      <div className="mt-3 flex items-center gap-2 rounded-xl bg-warning/10 px-3 py-2 text-xs font-medium text-warning">
        <Icon icon="fa-trophy" />
        Reward: {challenge.reward}
      </div>
      <button
        type="button"
        onClick={() => onJoin(challenge)}
        className="mt-4 w-full rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-on-primary transition-opacity hover:opacity-90"
      >
        <Icon icon="fa-plus" className="mr-2" />
        Join Challenge
      </button>
    </div>
  )
}

const PANEL_ACTIONS = [
  { id: 'resources', icon: 'fa-book', label: 'Resources' },
  { id: 'polls', icon: 'fa-poll', label: 'Polls' },
  { id: 'challenges', icon: 'fa-trophy', label: 'Challenges' },
  { id: 'analytics', icon: 'fa-chart-line', label: 'My Activity' },
]

export default function GroupsSection() {
  const { t } = useLanguage()
  const user = useMemo(() => getGuestUser(), [])
  const [mood, setMood] = useState(() => get(MOOD_STORAGE_KEY, 'happy'))
  const [messages, setMessages] = useState([])
  const [members, setMembers] = useState([])
  const [input, setInput] = useState('')
  const [typing, setTyping] = useState(false)
  const [autoScroll, setAutoScroll] = useState(true)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [onlineCount, setOnlineCount] = useState(0)

  const [modal, setModal] = useState(null)
  const [panel, setPanel] = useState(null)
  const [challengeTab, setChallengeTab] = useState('active')
  const [reportingMsgId, setReportingMsgId] = useState(null)
  const [reportReason, setReportReason] = useState('inappropriate')

  const [settings, setSettings] = useState(() => ({ ...CHAT_SETTINGS_DEFAULTS, ...(loadChatSettings() || {}) }))
  const [pollVotes, setPollVotes] = useState(() => loadPollVotes(mood))
  const [showPollResults, setShowPollResults] = useState({})

  const [recording, setRecording] = useState(null)
  const [recSeconds, setRecSeconds] = useState(0)
  const [previewVoice, setPreviewVoice] = useState(null)
  const [voiceUrls, setVoiceUrls] = useState({})

  const [pollQuestion, setPollQuestion] = useState('')
  const [pollOptions, setPollOptions] = useState(['', '', '', ''])
  const [challengeForm, setChallengeForm] = useState({ title: '', description: '', category: '', duration: '', reward: '' })

  const chatRef = useRef(null)
  const recStartRef = useRef(0)
  const recDurationRef = useRef(0)
  const cancelledRef = useRef(false)
  const typingTimeoutRef = useRef(null)
  const voiceUrlsRef = useRef({})

  const [dmPartner, setDmPartner] = useState(null)
  const [dmMessages, setDmMessages] = useState([])
  const [dmInput, setDmInput] = useState('')
  const dmChatRef = useRef(null)

  useEffect(() => {
    seedAllGroups()
    const membersList = loadMembers(mood, user)
    setMembers(membersList)
    setMessages(loadMessages(mood))
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    const membersList = loadMembers(mood, user)
    setMembers(membersList)
    setMessages(loadMessages(mood))
    setPollVotes(loadPollVotes(mood))
    setShowPollResults({})
  }, [mood]) // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    const timer = setInterval(() => {
      setOnlineCount(Math.max(1, Math.floor(Math.random() * members.length) + 1))
    }, 5000)
    setOnlineCount(Math.max(1, Math.floor(Math.random() * members.length) + 1))
    return () => clearInterval(timer)
  }, [members.length])

  useEffect(() => {
    if (autoScroll && chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight
    }
  }, [messages, autoScroll])

  useEffect(() => {
    if (dmChatRef.current) {
      dmChatRef.current.scrollTop = dmChatRef.current.scrollHeight
    }
  }, [dmMessages, dmPartner])

  useEffect(() => {
    return () => {
      Object.values(voiceUrlsRef.current).forEach((url) => URL.revokeObjectURL(url))
    }
  }, [])

  const moodData = MOODS[mood]
  const polls = loadPolls(mood)
  const movements = useMemo(() => loadMovements(), [pollVotes, messages])

  const closeModal = () => {
    setModal(null)
    setReportingMsgId(null)
    setReportReason('inappropriate')
  }

  const selectMood = (moodKey) => {
    if (moodKey !== mood) {
      addMovement({
        userId: user.id,
        userName: user.fullName,
        fromMood: mood,
        toMood: moodKey,
        timestamp: new Date().toISOString(),
        date: new Date().toLocaleDateString(),
      })
      setMood(moodKey)
    }
    closeModal()
    notify(`You've joined the ${MOODS[moodKey].groupName}!`, 'success')
  }

  const sendMessage = () => {
    const text = input.trim()
    if (!text) return
    const msg = makeMessage({
      userId: user.id,
      userName: user.fullName,
      message: text,
      timestamp: new Date().toISOString(),
      type: 'user',
    })
    const next = [...messages, msg]
    saveMessages(mood, next)
    setMessages(next)
    setInput('')
    setTyping(false)
  }

  const handleInputChange = (value) => {
    setInput(value)
    setTyping(true)
    clearTimeout(typingTimeoutRef.current)
    typingTimeoutRef.current = setTimeout(() => setTyping(false), 1500)
  }

  const handleInputKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  const openDm = (member) => {
    if (!member || member.id === user.id) return
    seedDm(user.id, member.id, member.fullName)
    setDmMessages(loadDMs(user.id, member.id))
    setDmPartner(member)
    setDmInput('')
  }

  const closeDm = () => {
    setDmPartner(null)
    setDmMessages([])
    setDmInput('')
  }

  const sendDm = () => {
    const text = dmInput.trim()
    if (!text || !dmPartner) return
    const msg = makeMessage({
      userId: user.id,
      userName: user.fullName,
      message: text,
      timestamp: new Date().toISOString(),
      type: 'user',
    })
    const next = [...dmMessages, msg]
    saveDMs(user.id, dmPartner.id, next)
    setDmMessages(next)
    setDmInput('')
  }

  const handleDmKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendDm()
    }
  }

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      const recorder = new MediaRecorder(stream)
      const chunks = []
      cancelledRef.current = false
      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunks.push(e.data)
      }
      recorder.onstop = () => {
        stream.getTracks().forEach((track) => track.stop())
        if (cancelledRef.current) {
          chunks.length = 0
          return
        }
        const blob = new Blob(chunks, { type: recorder.mimeType || 'audio/webm' })
        setPreviewVoice({ url: URL.createObjectURL(blob), duration: recDurationRef.current })
      }
      recStartRef.current = Date.now()
      recDurationRef.current = 0
      setRecSeconds(0)
      recorder.start()
      const timerId = setInterval(() => {
        setRecSeconds(Math.floor((Date.now() - recStartRef.current) / 1000))
      }, 250)
      setRecording({ recorder, timerId })
      notify('Voice recording started', 'success')
    } catch (err) {
      console.error('Voice recording error:', err)
      notify('Unable to access microphone. Please check permissions.', 'error')
    }
  }

  const stopRecording = () => {
    if (!recording) return
    recDurationRef.current = Math.floor((Date.now() - recStartRef.current) / 1000)
    clearInterval(recording.timerId)
    recording.recorder.stop()
    setRecording(null)
  }

  const cancelRecording = () => {
    if (!recording) return
    cancelledRef.current = true
    clearInterval(recording.timerId)
    recording.recorder.stop()
    setRecording(null)
    setRecSeconds(0)
    notify('Voice recording cancelled', 'info')
  }

  const sendVoiceMessage = () => {
    if (!previewVoice) return
    const msg = makeMessage({
      id: `${Date.now()}-v`,
      userId: user.id,
      userName: user.fullName,
      message: '[Voice Message]',
      timestamp: new Date().toISOString(),
      type: 'voice',
      audioUrl: previewVoice.url,
      duration: previewVoice.duration,
    })
    const next = [...messages, msg]
    saveMessages(mood, next)
    setMessages(next)
    voiceUrlsRef.current[msg.id] = previewVoice.url
    setVoiceUrls((prev) => ({ ...prev, [msg.id]: previewVoice.url }))
    setPreviewVoice(null)
    setRecSeconds(0)
    notify('Voice message sent!', 'success')
  }

  const playAudio = (url) => {
    if (url) {
      const audio = new Audio(url)
      audio.play().catch(() => {})
    }
  }

  const playStoredVoice = (id) => {
    const msg = messages.find((m) => m.id === id)
    playAudio(voiceUrls[id] || msg?.audioUrl)
  }

  const submitReport = () => {
    if (!reportingMsgId) return
    addReport({
      id: Date.now().toString(),
      messageId: reportingMsgId,
      reportedBy: user.id,
      reportedByName: user.fullName,
      reason: reportReason,
      timestamp: new Date().toISOString(),
    })
    closeModal()
    notify('Message reported successfully. Our moderators will review it.', 'success')
  }

  const confirmClearChat = () => {
    // Modal holds its own clear-type via state passed through; simplest
    // implementation clears all messages of the current group.
    saveMessages(mood, [])
    setMessages([])
    closeModal()
    notify('Chat cleared successfully!', 'success')
  }

  const saveSettingsNow = () => {
    saveChatSettings(settings)
    closeModal()
    notify('Chat settings saved!', 'success')
  }

  const resetSettingsNow = () => {
    setSettings(CHAT_SETTINGS_DEFAULTS)
    saveChatSettings(CHAT_SETTINGS_DEFAULTS)
    closeModal()
    notify('Settings reset to default!', 'info')
  }

  const vote = (pollId, optionIdx) => {
    const nextPolls = polls.map((poll) =>
      poll.id === pollId
        ? {
            ...poll,
            options: poll.options.map((opt, idx) => (idx === optionIdx ? { ...opt, votes: opt.votes + 1 } : opt)),
          }
        : poll
    )
    savePolls(mood, nextPolls)
    const nextVotes = { ...pollVotes, [pollId]: optionIdx }
    setPollVotes(nextVotes)
    savePollVotes(mood, nextVotes)
    setShowPollResults((prev) => ({ ...prev, [pollId]: true }))
    notify('Vote recorded!', 'success')
  }

  const createPoll = () => {
    const question = pollQuestion.trim()
    const options = pollOptions.map((o) => o.trim()).filter(Boolean)
    if (!question) {
      notify('Please enter a poll question.', 'warning')
      return
    }
    if (options.length < 2) {
      notify('Please provide at least 2 options for the poll.', 'warning')
      return
    }
    const poll = {
      id: Date.now().toString(),
      question,
      options: options.map((text) => ({ text, votes: 0 })),
      active: true,
      createdBy: user.id,
      createdAt: new Date().toISOString(),
    }
    savePolls(mood, [...polls, poll])
    setPollQuestion('')
    setPollOptions(['', '', '', ''])
    closeModal()
    notify('Poll created successfully!', 'success')
  }

  const createChallenge = () => {
    if (!challengeForm.title || !challengeForm.description) {
      notify('Please fill in the challenge title and description.', 'warning')
      return
    }
    notify('Challenge created successfully!', 'success')
    setChallengeForm({ title: '', description: '', category: '', duration: '', reward: '' })
    setChallengeTab('active')
  }

  const joinChallenge = (challenge) => {
    notify(`You've joined "${challenge.title}"! Keep up the great work!`, 'success')
  }

  const tryExercise = (exercise) => {
    notify(`The "${exercise}" exercise is available in the Therapy section!`, 'info')
  }

  const formatTime = (timestamp) => {
    if (!timestamp) return ''
    return new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  }

  const ownMessages = messages.filter((m) => m.userId === user.id).length

  const analytics = useMemo(() => {
    const monthAgo = new Date()
    monthAgo.setMonth(monthAgo.getMonth() - 1)
    const thisMonth = movements.filter((m) => new Date(m.timestamp) >= monthAgo)
    const groupsJoined = new Set(movements.map((m) => m.toMood)).size
    const pollCount = Object.keys(pollVotes).length
    return {
      messagesSent: ownMessages,
      groupsJoined: groupsJoined > 0 ? groupsJoined : 1,
      pollsParticipated: pollCount,
      moodChanges: thisMonth.length,
      moodTimeline: thisMonth.slice(-10).map((m) => ({ mood: m.toMood, date: new Date(m.timestamp).toLocaleDateString() })),
    }
  }, [movements, pollVotes, ownMessages])

  const inputCount = input.length

  return (
    <section>
      <SectionHeader title={t('groups_title')} subtitle={t('groups_description')} />

      <CrisisCard onCrisis={(type) => setModal(type === 'phone' ? 'crisis-phone' : type === 'text' ? 'crisis-text' : 'crisis-911')} />
      <MoodReportCard onReport={() => setModal('mood-report')} />
      <GroupsGrid currentMood={mood} onJoin={selectMood} />

      {/* Current group + chat */}
      <div className="mb-8 overflow-hidden rounded-3xl border border-line-light bg-surface shadow-lg">
        {/* Group header */}
        <div className="flex flex-col gap-4 border-b border-line-light p-5 sm:flex-row sm:items-center sm:justify-between">
          {dmPartner ? (
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={closeDm}
                title="Back to group chat"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-line-light text-ink-2 transition-colors hover:border-primary hover:text-primary-text"
              >
                <Icon icon="fa-arrow-left" />
              </button>
              <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-3xl">
                <Icon icon={dmPartner.avatar || 'fa-user'} className="text-3xl" />
              </span>
              <div>
                <h3 className="flex items-center gap-2 text-lg font-bold text-ink">
                  {dmPartner.fullName}
                  <span className="flex items-center gap-1 rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-semibold text-primary-text">
                    <Icon icon="fa-lock" className="text-[10px]" /> Private
                  </span>
                </h3>
                <p className="flex items-center gap-1.5 text-sm text-ink-2">
                  <span className="relative flex h-2 w-2">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-success opacity-60" />
                    <span className="relative inline-flex h-2 w-2 rounded-full bg-success" />
                  </span>
                  Online now
                </p>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <span
                className="flex h-14 w-14 items-center justify-center rounded-2xl text-3xl"
                style={{ backgroundColor: `${moodData.color}1a` }}
              >
                <Icon icon={moodData.icon} className="text-3xl" />
              </span>
              <div>
                <h3 className="text-lg font-bold text-ink">{moodData.groupName}</h3>
                <p className="text-sm text-ink-2">
                  {members.length} {members.length === 1 ? 'member' : 'members'}
                </p>
              </div>
            </div>
          )}
          {!dmPartner && (
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setModal('mood-update')}
                className="rounded-full bg-primary/10 px-4 py-2 text-sm font-semibold text-primary-text transition-colors hover:bg-primary/20"
              >
                <Icon icon="fa-edit" className="mr-2" />
                Change Mood
              </button>
              <button
                type="button"
                onClick={() => setModal('chat-settings')}
                title="Chat Settings"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-line-light text-ink-2 transition-colors hover:border-primary hover:text-primary-text"
              >
                <Icon icon="fa-cog" />
              </button>
              <button
                type="button"
                onClick={() => setModal('clear-chat')}
                title="Clear Chat"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-line-light text-ink-2 transition-colors hover:border-danger hover:text-danger"
              >
                <Icon icon="fa-trash" />
              </button>
            </div>
          )}
        </div>

        {/* Chat area */}
        <div className="flex">
          {/* Messages */}
          <div className="flex min-w-0 flex-1 flex-col">
            {/* Status bar */}
            <div className="flex items-center justify-between gap-2 border-b border-line-light bg-canvas/60 px-5 py-2.5">
              {dmPartner ? (
                <div className="flex items-center gap-1.5 text-xs text-ink-2">
                  <Icon icon="fa-lock" className="text-[10px] text-primary-text" />
                  Private chat with {dmPartner.fullName} — only you two can see these messages
                </div>
              ) : (
                <div className="flex items-center gap-4 text-xs text-ink-2">
                  <span className="flex items-center gap-1.5">
                    <span className="relative flex h-2.5 w-2.5">
                      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-success opacity-60" />
                      <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-success" />
                    </span>
                    {onlineCount} members online
                  </span>
                  <span>{messages.length} messages</span>
                </div>
              )}
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  title="Scroll to bottom"
                  onClick={() => chatRef.current && (chatRef.current.scrollTop = chatRef.current.scrollHeight)}
                  className="flex h-8 w-8 items-center justify-center rounded-full text-ink-2 transition-colors hover:bg-surface-hover hover:text-primary-text"
                >
                  <Icon icon="fa-arrow-down" />
                </button>
                <button
                  type="button"
                  title="Auto-scroll"
                  onClick={() => setAutoScroll((v) => !v)}
                  className={`flex h-8 w-8 items-center justify-center rounded-full transition-colors ${
                    autoScroll ? 'bg-primary/10 text-primary-text' : 'text-ink-2 hover:bg-surface-hover hover:text-primary-text'
                  }`}
                >
                  <Icon icon="fa-magic" />
                </button>
              </div>
            </div>

            {/* Messages list */}
            <div ref={dmPartner ? dmChatRef : chatRef} className="h-[440px] space-y-3 overflow-y-auto p-5">
              {dmPartner ? (
                dmMessages.length === 0 ? (
                  <div className="flex h-full flex-col items-center justify-center gap-2 text-center">
                    <span className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 text-2xl">
                      <Icon icon={dmPartner.avatar || 'fa-user'} className="text-2xl" />
                    </span>
                    <p className="text-sm font-semibold text-ink">This is the start of your private chat with {dmPartner.fullName}</p>
                    <p className="text-xs text-ink-2">Say hello and check in on each other</p>
                  </div>
                ) : (
                  dmMessages.map((msg) => {
                    const isOwn = msg.userId === user.id
                    if (msg.type === 'system') {
                      return (
                        <div key={msg.id} className="flex justify-center">
                          <span className="rounded-full bg-primary/10 px-4 py-1 text-center text-xs font-medium text-primary-text">
                            {msg.message}
                          </span>
                        </div>
                      )
                    }
                    return (
                      <div key={msg.id} className={`flex ${isOwn ? 'justify-end' : 'justify-start'} items-end gap-2`}>
                        {!isOwn && (
                          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/10 text-lg">
                            <Icon icon={dmPartner.avatar || 'fa-user'} className="text-lg" />
                          </span>
                        )}
                        <div className={`max-w-[75%] ${isOwn ? 'text-right' : ''}`}>
                          <div className={`flex items-center gap-2 ${isOwn ? 'justify-end' : ''} mb-1`}>
                            <span className="text-xs font-semibold text-ink">{msg.userName}</span>
                            <span className="text-[10px] text-ink-2">{formatTime(msg.timestamp)}</span>
                          </div>
                          <div
                            className={`inline-block rounded-2xl px-4 py-2 text-left text-sm break-words ${
                              isOwn
                                ? 'rounded-br-md bg-primary text-on-primary'
                                : 'rounded-bl-md border border-line-light bg-canvas text-ink'
                            }`}
                          >
                            {msg.message}
                          </div>
                        </div>
                      </div>
                    )
                  })
                )
              ) : (
                <>
                  {messages.map((msg) => {
                const isOwn = msg.userId === user.id
                const isSystem = msg.type === 'system'
                if (isSystem) {
                  return (
                    <div key={msg.id} className="flex justify-center">
                      <span className="rounded-full bg-primary/10 px-4 py-1 text-center text-xs font-medium text-primary-text">
                        {msg.message}
                      </span>
                    </div>
                  )
                }
                if (msg.type === 'voice') {
                  return (
                    <div key={msg.id} className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}>
                      <div
                        className={`flex max-w-[80%] items-center gap-3 rounded-2xl px-4 py-2.5 ${
                          isOwn
                            ? 'rounded-br-md bg-primary text-on-primary'
                            : 'rounded-bl-md border border-line-light bg-canvas text-ink'
                        }`}
                      >
                        <button
                          type="button"
                          onClick={() => playStoredVoice(msg.id)}
                          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white/20 text-sm"
                        >
                          <Icon icon="fa-play" />
                        </button>
                        <div className="min-w-0">
                          <p className={`text-xs font-semibold ${isOwn ? 'text-white/90' : 'text-ink'}`}>{msg.userName}</p>
                          <p className={`text-xs ${isOwn ? 'text-white/80' : 'text-ink-2'}`}>
                            Voice Message ({msg.duration || 0}s)
                          </p>
                        </div>
                        <span className={`text-[10px] ${isOwn ? 'text-white/70' : 'text-ink-2'}`}>{formatTime(msg.timestamp)}</span>
                      </div>
                    </div>
                  )
                }
                return (
                  <div key={msg.id} className={`flex ${isOwn ? 'justify-end' : 'justify-start'} items-end gap-2`}>
                    {!isOwn && (
                      <button
                        type="button"
                        onClick={() => {
                          const sender = members.find((m) => m.id === msg.userId)
                          if (sender) openDm(sender)
                        }}
                        title="Start private chat"
                        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/10 text-lg transition-colors hover:bg-primary/20"
                      >
                        <Icon icon={members.find((m) => m.id === msg.userId)?.avatar || 'fa-user'} className="text-lg" />
                      </button>
                    )}
                    <div className={`max-w-[75%] ${isOwn ? 'text-right' : ''}`}>
                      <div className={`flex items-center gap-2 ${isOwn ? 'justify-end' : ''} mb-1`}>
                        <span className="text-xs font-semibold text-ink">{msg.userName}</span>
                        <span className="text-[10px] text-ink-2">{formatTime(msg.timestamp)}</span>
                      </div>
                      <div
                        className={`inline-block rounded-2xl px-4 py-2 text-left text-sm break-words ${
                          isOwn
                            ? 'rounded-br-md bg-primary text-on-primary'
                            : 'rounded-bl-md border border-line-light bg-canvas text-ink'
                        }`}
                      >
                        {msg.message}
                      </div>
                      {!isOwn && (
                        <div className="mt-1 flex justify-end">
                          <button
                            type="button"
                            onClick={() => {
                              setReportingMsgId(msg.id)
                              setModal('report')
                            }}
                            className="flex items-center gap-1 text-[10px] text-ink-2 transition-colors hover:text-danger"
                          >
                            <Icon icon="fa-flag" />
                            Report
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                )
              })}
              {typing && (
                <div className="flex items-center gap-2 pl-1">
                  <span className="flex gap-1">
                    <span className="h-2 w-2 animate-bounce rounded-full bg-ink-2/40" style={{ animationDelay: '0ms' }} />
                    <span className="h-2 w-2 animate-bounce rounded-full bg-ink-2/40" style={{ animationDelay: '150ms' }} />
                    <span className="h-2 w-2 animate-bounce rounded-full bg-ink-2/40" style={{ animationDelay: '300ms' }} />
                  </span>
                  <span className="text-xs text-ink-2">Someone is typing...</span>
                </div>
              )}
                </>
              )}
            </div>
          </div>

          {/* Members sidebar */}
          {!sidebarCollapsed && (
            <aside className="hidden w-72 shrink-0 flex-col border-l border-line-light lg:flex">
              <div className="flex items-center justify-between border-b border-line-light px-4 py-3">
                <div className="flex items-center gap-2">
                  <Icon icon="fa-users" className="text-primary-text" />
                  <h4 className="text-sm font-bold text-ink">Group Members</h4>
                  <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-semibold text-primary-text">
                    {members.length}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setSidebarCollapsed(true)}
                  title="Hide Sidebar"
                  className="flex h-8 w-8 items-center justify-center rounded-full text-ink-2 transition-colors hover:bg-surface-hover hover:text-primary-text"
                >
                  <Icon icon="fa-chevron-right" />
                </button>
              </div>
              <div className="flex-1 space-y-1 overflow-y-auto p-3">
                {members.map((member) => {
                  const isYou = member.id === user.id
                  const activeDm = dmPartner?.id === member.id
                  return (
                    <div
                      key={member.id}
                      role={isYou ? undefined : 'button'}
                      tabIndex={isYou ? undefined : 0}
                      onClick={() => !isYou && openDm(member)}
                      onKeyDown={(e) => {
                        if (!isYou && (e.key === 'Enter' || e.key === ' ')) {
                          e.preventDefault()
                          openDm(member)
                        }
                      }}
                      title={isYou ? undefined : `Message ${member.fullName}`}
                      className={`group flex items-center gap-2.5 rounded-xl p-2 ${
                        activeDm ? 'bg-primary/10' : isYou ? 'bg-primary/5' : 'cursor-pointer hover:bg-surface-hover'
                      }`}
                    >
                      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/10 text-lg">
                        <Icon icon={member.avatar || 'fa-user'} className="text-lg" />
                      </span>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium text-ink">{member.fullName}</p>
                        {isYou && <p className="text-[10px] font-semibold text-primary-text">You</p>}
                      </div>
                      {!isYou && (
                        <Icon
                          icon="fa-comment"
                          className={`shrink-0 text-sm text-primary-text transition-opacity ${
                            activeDm ? 'opacity-100' : 'opacity-0 group-hover:opacity-100 group-focus-within:opacity-100'
                          }`}
                        />
                      )}
                    </div>
                  )
                })}
              </div>
              <div className="space-y-1 border-t border-line-light p-3">
                <button
                  type="button"
                  onClick={() => setModal('group-info')}
                  className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium text-ink-2 transition-colors hover:bg-surface-hover hover:text-primary-text"
                >
                  <Icon icon="fa-info-circle" className="text-primary-text" />
                  Group Info
                </button>
                {PANEL_ACTIONS.map((action) => (
                  <button
                    key={action.id}
                    type="button"
                    onClick={() => setPanel((p) => (p === action.id ? null : action.id))}
                    className={`flex w-full items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium transition-colors ${
                      panel === action.id ? 'bg-primary/10 text-primary-text' : 'text-ink-2 hover:bg-surface-hover hover:text-primary-text'
                    }`}
                  >
                    <Icon icon={action.icon} />
                    {action.label}
                  </button>
                ))}
              </div>
            </aside>
          )}
        </div>

        {/* Chat input / recording */}
        <div className="border-t border-line-light p-4">
          {dmPartner ? (
            <div className="flex items-end gap-2">
              <input
                type="text"
                value={dmInput}
                maxLength={500}
                onChange={(e) => setDmInput(e.target.value)}
                onKeyDown={handleDmKeyDown}
                placeholder={`Message ${dmPartner.fullName}...`}
                className="min-w-0 flex-1 rounded-2xl border border-line-light bg-canvas px-4 py-3 text-sm text-ink placeholder:text-ink-2/60 focus:border-primary focus:outline-none"
              />
              <button
                type="button"
                title="Send Message"
                onClick={sendDm}
                disabled={!dmInput.trim()}
                className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-primary text-on-primary transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
              >
                <Icon icon="fa-paper-plane" />
              </button>
            </div>
          ) : previewVoice ? (
            <div className="rounded-2xl border border-line-light bg-canvas p-4">
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => playAudio(previewVoice.url)}
                  className="flex h-11 w-11 items-center justify-center rounded-full bg-primary text-on-primary"
                >
                  <Icon icon="fa-play" />
                </button>
                <div className="flex flex-1 items-center gap-1">
                  {Array.from({ length: 16 }).map((_, i) => (
                    <div key={i} className="w-1 rounded-full bg-primary/40" style={{ height: `${6 + ((i * 37) % 22)}px` }} />
                  ))}
                </div>
                <span className="text-sm font-semibold text-ink">0:{previewVoice.duration}</span>
              </div>
              <div className="mt-3 flex gap-2">
                <button
                  type="button"
                  onClick={sendVoiceMessage}
                  className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-on-primary transition-opacity hover:opacity-90"
                >
                  <Icon icon="fa-paper-plane" />
                  Send Voice Message
                </button>
                <button
                  type="button"
                  onClick={startRecording}
                  className="flex items-center justify-center gap-2 rounded-xl border border-line-light px-4 py-2 text-sm font-semibold text-ink-2 transition-colors hover:border-primary hover:text-primary-text"
                >
                  <Icon icon="fa-redo" />
                  Re-record
                </button>
              </div>
            </div>
          ) : recording ? (
            <div className="rounded-2xl border border-danger/30 bg-danger/5 p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="relative flex h-3 w-3">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-danger opacity-60" />
                    <span className="relative inline-flex h-3 w-3 rounded-full bg-danger" />
                  </span>
                  <span className="text-sm font-semibold text-ink">Recording...</span>
                  <span className="text-sm font-bold text-danger">
                    {Math.floor(recSeconds / 60)
                      .toString()
                      .padStart(2, '0')}
                    :{(recSeconds % 60).toString().padStart(2, '0')}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={stopRecording}
                    className="flex items-center gap-2 rounded-full bg-danger px-4 py-2 text-sm font-semibold text-white transition-opacity hover:opacity-90"
                  >
                    <Icon icon="fa-stop" />
                    Stop
                  </button>
                  <button
                    type="button"
                    onClick={cancelRecording}
                    className="flex items-center gap-2 rounded-full border border-line-light px-4 py-2 text-sm font-semibold text-ink-2 transition-colors hover:border-danger hover:text-danger"
                  >
                    <Icon icon="fa-times" />
                    Cancel
                  </button>
                </div>
              </div>
              <div className="mt-3 flex items-center gap-1">
                {Array.from({ length: 12 }).map((_, i) => (
                  <div
                    key={i}
                    className="w-1.5 animate-pulse-soft rounded-full bg-danger/50"
                    style={{ height: `${10 + ((i * 53) % 26)}px`, animationDelay: `${i * 90}ms` }}
                  />
                ))}
              </div>
            </div>
          ) : (
            <>
              <div className="flex items-end gap-2">
                <input
                  type="text"
                  value={input}
                  maxLength={500}
                  onChange={(e) => handleInputChange(e.target.value)}
                  onKeyDown={handleInputKeyDown}
                  placeholder="Type your message..."
                  className="min-w-0 flex-1 rounded-2xl border border-line-light bg-canvas px-4 py-3 text-sm text-ink placeholder:text-ink-2/60 focus:border-primary focus:outline-none"
                />
                <button
                  type="button"
                  onClick={startRecording}
                  title="Record voice message"
                  className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-line-light text-ink-2 transition-colors hover:border-primary hover:text-primary-text"
                >
                  <Icon icon="fa-microphone" />
                </button>
                <button
                  type="button"
                  title="Add icon"
                  onClick={() => handleInputChange(`${input} `)}
                  className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-line-light text-ink-2 transition-colors hover:border-primary hover:text-primary-text"
                >
                  <Icon icon="fa-smile" />
                </button>
                <button
                  type="button"
                  title="Send Message"
                  onClick={sendMessage}
                  disabled={!input.trim()}
                  className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-primary text-on-primary transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <Icon icon="fa-paper-plane" />
                </button>
              </div>
              <div className="mt-2 flex items-center justify-between text-xs text-ink-2">
                <span className={inputCount > 450 ? 'text-danger' : inputCount > 400 ? 'text-warning' : ''}>
                  {inputCount}/500
                </span>
                <span>Press Enter to send, Shift+Enter for new line</span>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Side panels */}
      {panel === 'resources' && (
        <div className="mb-8 animate-fade-up rounded-3xl border border-line-light bg-surface p-6 shadow-sm">
          <SectionTitle
            icon="fa-book"
            title={`Resources for ${moodData.groupName}`}
            subtitle="Helpful tools and exercises tailored to your current mood"
          />
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {(MOOD_RESOURCES[mood] || []).map((resource) => (
              <div key={resource.title} className="rounded-2xl border border-line-light bg-canvas p-4">
                <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-2xl bg-primary/10 text-primary-text">
                  <Icon icon={resource.icon} />
                </div>
                <h4 className="text-sm font-bold text-ink">{resource.title}</h4>
                <p className="mt-1 text-xs leading-relaxed text-ink-2">{resource.description}</p>
                {resource.exercise ? (
                  <button
                    type="button"
                    onClick={() => tryExercise(resource.exercise)}
                    className="mt-3 w-full rounded-full bg-primary px-3 py-1.5 text-xs font-semibold text-on-primary transition-opacity hover:opacity-90"
                  >
                    Try Exercise
                  </button>
                ) : (
                  <a href="#" onClick={(e) => e.preventDefault()} className="mt-3 inline-block text-xs font-semibold text-primary-text">
                    Learn More <Icon icon="fa-external-link-alt" className="ml-1" />
                  </a>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {panel === 'polls' && (
        <div className="mb-8 animate-fade-up rounded-3xl border border-line-light bg-surface p-6 shadow-sm">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <SectionTitle
              icon="fa-poll"
              title="Group Polls"
              subtitle="Participate in group activities and share your thoughts"
            />
            <button
              type="button"
              onClick={() => setModal('create-poll')}
              className="shrink-0 rounded-full bg-primary px-4 py-2 text-sm font-semibold text-on-primary transition-opacity hover:opacity-90"
            >
              <Icon icon="fa-plus" className="mr-2" />
              Create New Poll
            </button>
          </div>
          {polls.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-line-light p-10 text-center">
              <Icon icon="fa-poll" className="mb-3 text-3xl text-ink-2/40" />
              <p className="text-sm text-ink-2">No polls yet. Create the first one!</p>
            </div>
          ) : (
            <div className="grid gap-4 lg:grid-cols-2">
              {polls.map((poll) => (
                <PollCard
                  key={poll.id}
                  poll={poll}
                  votedIndex={pollVotes[poll.id]}
                  showResults={showPollResults[poll.id]}
                  onToggleResults={() => setShowPollResults((prev) => ({ ...prev, [poll.id]: !prev[poll.id] }))}
                  onVote={vote}
                />
              ))}
            </div>
          )}
        </div>
      )}

      {panel === 'challenges' && (
        <div className="mb-8 animate-fade-up rounded-3xl border border-line-light bg-surface p-6 shadow-sm">
          <SectionTitle
            icon="fa-trophy"
            title="Group Challenges & Activities"
            subtitle="Participate in group challenges to support each other's growth"
          />
          <div className="mb-5 flex gap-2 overflow-x-auto pb-1">
            {[
              { id: 'active', icon: 'fa-fire', label: 'Active Challenges' },
              { id: 'completed', icon: 'fa-check-circle', label: 'Completed' },
              { id: 'create', icon: 'fa-plus-circle', label: 'Create Challenge' },
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setChallengeTab(tab.id)}
                className={`flex shrink-0 items-center gap-2 rounded-full border px-4 py-2 text-sm font-semibold transition-all ${
                  challengeTab === tab.id
                    ? 'border-primary bg-primary/10 text-primary-text'
                    : 'border-line-light bg-canvas text-ink-2 hover:border-primary hover:text-primary-text'
                }`}
              >
                <Icon icon={tab.icon} />
                {tab.label}
              </button>
            ))}
          </div>

          {challengeTab === 'active' && (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {(MOOD_CHALLENGES[mood] || []).map((challenge) => (
                <ChallengeCard key={challenge.id} challenge={challenge} onJoin={joinChallenge} />
              ))}
            </div>
          )}

          {challengeTab === 'completed' && (
            <div className="rounded-2xl border border-dashed border-line-light p-12 text-center">
              <Icon icon="fa-trophy" className="mb-3 text-4xl text-warning/50" />
              <h3 className="text-lg font-bold text-ink">No Completed Challenges Yet</h3>
              <p className="mt-1 text-sm text-ink-2">Complete challenges to see them here and earn badges!</p>
            </div>
          )}

          {challengeTab === 'create' && (
            <div className="mx-auto max-w-xl rounded-2xl border border-line-light bg-canvas p-5">
              <h4 className="mb-4 text-base font-bold text-ink">Create a New Challenge</h4>
              <div className="space-y-3">
                <div>
                  <label className="mb-1 block text-xs font-semibold text-ink-2">Challenge Title:</label>
                  <input
                    type="text"
                    value={challengeForm.title}
                    onChange={(e) => setChallengeForm((f) => ({ ...f, title: e.target.value }))}
                    placeholder="e.g., 30-Day Meditation Challenge"
                    className="w-full rounded-xl border border-line-light bg-surface px-3 py-2 text-sm text-ink placeholder:text-ink-2/60 focus:border-primary focus:outline-none"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-semibold text-ink-2">Description:</label>
                  <textarea
                    rows="3"
                    value={challengeForm.description}
                    onChange={(e) => setChallengeForm((f) => ({ ...f, description: e.target.value }))}
                    placeholder="Describe the challenge..."
                    className="w-full resize-none rounded-xl border border-line-light bg-surface px-3 py-2 text-sm text-ink placeholder:text-ink-2/60 focus:border-primary focus:outline-none"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="mb-1 block text-xs font-semibold text-ink-2">Category:</label>
                    <select
                      value={challengeForm.category}
                      onChange={(e) => setChallengeForm((f) => ({ ...f, category: e.target.value }))}
                      className="w-full rounded-xl border border-line-light bg-surface px-3 py-2 text-sm text-ink focus:border-primary focus:outline-none"
                    >
                      <option value="">Select category</option>
                      {['Mindfulness', 'Gratitude', 'Self-Care', 'Goals', 'Habits', 'Kindness'].map((c) => (
                        <option key={c} value={c}>
                          {c}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="mb-1 block text-xs font-semibold text-ink-2">Duration:</label>
                    <input
                      type="text"
                      value={challengeForm.duration}
                      onChange={(e) => setChallengeForm((f) => ({ ...f, duration: e.target.value }))}
                      placeholder="e.g., 30 days"
                      className="w-full rounded-xl border border-line-light bg-surface px-3 py-2 text-sm text-ink placeholder:text-ink-2/60 focus:border-primary focus:outline-none"
                    />
                  </div>
                </div>
                <div>
                  <label className="mb-1 block text-xs font-semibold text-ink-2">Reward Badge Name:</label>
                  <input
                    type="text"
                    value={challengeForm.reward}
                    onChange={(e) => setChallengeForm((f) => ({ ...f, reward: e.target.value }))}
                    placeholder="e.g., Meditation Master Badge"
                    className="w-full rounded-xl border border-line-light bg-surface px-3 py-2 text-sm text-ink placeholder:text-ink-2/60 focus:border-primary focus:outline-none"
                  />
                </div>
                <div className="flex gap-2 pt-1">
                  <button
                    type="button"
                    onClick={createChallenge}
                    className="rounded-full bg-primary px-5 py-2 text-sm font-semibold text-on-primary transition-opacity hover:opacity-90"
                  >
                    <Icon icon="fa-plus" className="mr-2" />
                    Create Challenge
                  </button>
                  <button
                    type="button"
                    onClick={() => setChallengeTab('active')}
                    className="rounded-full border border-line-light px-5 py-2 text-sm font-semibold text-ink-2 transition-colors hover:border-primary hover:text-primary-text"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {panel === 'analytics' && (
        <div className="mb-8 animate-fade-up rounded-3xl border border-line-light bg-surface p-6 shadow-sm">
          <SectionTitle icon="fa-chart-line" title="Your Group Activity" subtitle="Track your participation and growth in mood groups" />
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { icon: 'fa-comments', label: 'Messages Sent', value: analytics.messagesSent, period: 'This group' },
              { icon: 'fa-users', label: 'Groups Joined', value: analytics.groupsJoined, period: 'Total' },
              { icon: 'fa-poll', label: 'Polls Participated', value: analytics.pollsParticipated, period: 'This month' },
              { icon: 'fa-chart-line', label: 'Mood Changes', value: analytics.moodChanges, period: 'This month' },
            ].map((stat) => (
              <div key={stat.label} className="flex items-center gap-4 rounded-2xl border border-line-light bg-canvas p-4">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary-text">
                  <Icon icon={stat.icon} />
                </div>
                <div>
                  <p className="text-xs text-ink-2">{stat.label}</p>
                  <p className="text-2xl font-bold text-ink">{stat.value}</p>
                  <span className="text-[10px] text-ink-2">{stat.period}</span>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-6">
            <h4 className="mb-3 text-sm font-bold text-ink">Mood Journey</h4>
            {analytics.moodTimeline.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-line-light p-8 text-center">
                <Icon icon="fa-heart" className="mb-3 text-3xl text-primary-text/30" />
                <p className="text-sm text-ink-2">Change your mood to start tracking your journey.</p>
              </div>
            ) : (
              <div className="space-y-2">
                {analytics.moodTimeline.map((entry, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between rounded-xl border border-line-light bg-canvas px-4 py-2.5"
                  >
                    <span className="flex items-center gap-2 text-sm font-medium text-ink">
                      <Icon icon={MOODS[entry.mood]?.icon} className="text-lg" />
                      {MOODS[entry.mood]?.description || entry.mood}
                    </span>
                    <span className="text-xs text-ink-2">{entry.date}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      <GuidelinesCard />

      {/* ---------- Modals ---------- */}
      {modal === 'mood-report' && (
        <Modal onClose={closeModal}>
          <ModalHeader title="How are you feeling right now?" icon="fa-heart" onClose={closeModal} />
          <p className="mb-4 text-sm text-ink-2">Select your current mood to join a supportive group chat:</p>
          <MoodSelector currentMood={mood} onSelect={selectMood} />
          <p className="mt-4 flex items-start gap-2 rounded-xl bg-primary/5 p-3 text-xs text-ink-2">
            <Icon icon="fa-info-circle" className="mt-0.5 text-primary-text" />
            You'll be automatically added to a group chat with others feeling the same way. You can change your mood anytime!
          </p>
        </Modal>
      )}

      {modal === 'mood-update' && (
        <Modal onClose={closeModal}>
          <ModalHeader title="Update Your Mood" icon="fa-edit" onClose={closeModal} />
          <p className="mb-4 text-sm text-ink-2">
            Current mood: <strong className="text-ink"><Icon icon={moodData.icon} className="mr-1" />{moodData.description}</strong>
          </p>
          <MoodSelector currentMood={mood} onSelect={selectMood} />
        </Modal>
      )}

      {(modal === 'crisis-phone' || modal === 'crisis-text' || modal === 'crisis-911') && (
        <Modal onClose={closeModal}>
          {(() => {
            const info = CRISIS_INFO[modal.replace('crisis-', '')]
            return (
              <>
                <ModalHeader title={info.title} icon={info.icon} onClose={closeModal} />
                <p className="text-sm text-ink-2">{info.description}</p>
                <div className="mt-4 grid grid-cols-3 gap-3">
                  {[
                    { icon: 'fa-clock', label: 'Available 24/7' },
                    { icon: 'fa-lock', label: 'Confidential' },
                    { icon: 'fa-heart', label: 'Free Support' },
                  ].map((item) => (
                    <div key={item.icon} className="rounded-2xl bg-canvas p-3 text-center">
                      <Icon icon={item.icon} className="mb-1 block text-primary-text" />
                      <span className="text-xs text-ink-2">{item.label}</span>
                    </div>
                  ))}
                </div>
                <div className="mt-5 flex flex-col gap-2">
                  <a
                    href={`tel:${info.number}`}
                    className="flex items-center justify-center gap-2 rounded-xl bg-primary px-4 py-3 text-sm font-bold text-on-primary transition-opacity hover:opacity-90"
                  >
                    <Icon icon={info.icon} />
                    {info.action}
                  </a>
                  <button
                    type="button"
                    onClick={closeModal}
                    className="flex items-center justify-center gap-2 rounded-xl border border-line-light px-4 py-3 text-sm font-semibold text-ink-2 transition-colors hover:border-primary hover:text-primary-text"
                  >
                    <Icon icon="fa-times" />
                    Close
                  </button>
                </div>
                <div className="mt-5 rounded-2xl bg-canvas p-4">
                  <h4 className="mb-2 text-sm font-bold text-ink">Additional Resources:</h4>
                  <ul className="space-y-1 text-xs text-ink-2">
                    <li><strong className="text-ink">National Suicide Prevention Lifeline:</strong> 988</li>
                    <li><strong className="text-ink">Crisis Text Line:</strong> Text HOME to 741741</li>
                    <li><strong className="text-ink">Emergency:</strong> 911</li>
                    <li><strong className="text-ink">Online Chat:</strong> suicidepreventionlifeline.org</li>
                  </ul>
                </div>
              </>
            )
          })()}
        </Modal>
      )}

      {modal === 'report' && (
        <Modal onClose={closeModal}>
          <ModalHeader title="Report Message" icon="fa-flag" onClose={closeModal} />
          <p className="mb-4 text-sm text-ink-2">Please select a reason for reporting this message:</p>
          <div className="space-y-2">
            {REPORT_REASONS.map((reason) => (
              <label
                key={reason.value}
                className={`flex cursor-pointer items-center gap-2 rounded-xl border p-3 text-sm transition-colors ${
                  reportReason === reason.value
                    ? 'border-primary bg-primary/5 text-primary-text'
                    : 'border-line-light bg-canvas text-ink hover:border-primary'
                }`}
              >
                <input
                  type="radio"
                  name="reportReason"
                  value={reason.value}
                  checked={reportReason === reason.value}
                  onChange={() => setReportReason(reason.value)}
                  className="accent-[var(--primary-color)]"
                />
                <span>{reason.label}</span>
              </label>
            ))}
          </div>
          <div className="mt-5 flex gap-2">
            <button
              type="button"
              onClick={submitReport}
              className="flex-1 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-on-primary transition-opacity hover:opacity-90"
            >
              <Icon icon="fa-flag" className="mr-2" />
              Submit Report
            </button>
            <button
              type="button"
              onClick={closeModal}
              className="rounded-xl border border-line-light px-4 py-2.5 text-sm font-semibold text-ink-2 transition-colors hover:border-primary hover:text-primary-text"
            >
              Cancel
            </button>
          </div>
        </Modal>
      )}

      {modal === 'chat-settings' && (
        <Modal onClose={closeModal}>
          <ModalHeader title="Chat Settings" icon="fa-cog" onClose={closeModal} />
          {[
            { label: 'Notifications', items: [
              { key: 'messageNotifications', label: 'Message notifications' },
              { key: 'typingNotifications', label: 'Typing indicators' },
              { key: 'soundNotifications', label: 'Sound notifications' },
            ] },
            { label: 'Display', items: [
              { key: 'showTimestamps', label: 'Show message timestamps' },
              { key: 'showAvatars', label: 'Show user avatars' },
              { key: 'compactMode', label: 'Compact mode' },
            ] },
            { label: 'Privacy', items: [
              { key: 'readReceipts', label: 'Read receipts' },
              { key: 'onlineStatus', label: 'Show online status' },
            ] },
          ].map((group) => (
            <div key={group.label} className="mb-4">
              <h4 className="mb-2 text-xs font-bold tracking-wide text-ink-2 uppercase">{group.label}</h4>
              <div className="space-y-2">
                {group.items.map((item) => (
                  <label
                    key={item.key}
                    className="flex cursor-pointer items-center justify-between rounded-xl border border-line-light bg-canvas px-3 py-2.5 text-sm text-ink"
                  >
                    <span>{item.label}</span>
                    <input
                      type="checkbox"
                      checked={settings[item.key]}
                      onChange={(e) => setSettings((s) => ({ ...s, [item.key]: e.target.checked }))}
                      className="h-4 w-4 accent-[var(--primary-color)]"
                    />
                  </label>
                ))}
              </div>
            </div>
          ))}
          <div className="flex gap-2">
            <button
              type="button"
              onClick={saveSettingsNow}
              className="flex-1 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-on-primary transition-opacity hover:opacity-90"
            >
              <Icon icon="fa-save" className="mr-2" />
              Save Settings
            </button>
            <button
              type="button"
              onClick={resetSettingsNow}
              className="flex items-center gap-2 rounded-xl border border-line-light px-4 py-2.5 text-sm font-semibold text-ink-2 transition-colors hover:border-primary hover:text-primary-text"
            >
              <Icon icon="fa-undo" />
              Reset to Default
            </button>
          </div>
        </Modal>
      )}

      {modal === 'clear-chat' && (
        <Modal onClose={closeModal}>
          <ModalHeader title="Clear Chat" icon="fa-trash" onClose={closeModal} />
          <div className="rounded-2xl bg-danger/5 p-4">
            <div className="flex items-center gap-3">
              <Icon icon="fa-exclamation-triangle" className="text-2xl text-danger" />
              <div>
                <h3 className="text-base font-bold text-ink">Are you sure?</h3>
                <p className="text-sm text-ink-2">
                  This will permanently delete all messages in this group chat. This action cannot be undone.
                </p>
              </div>
            </div>
          </div>
          <div className="mt-5 flex gap-2">
            <button
              type="button"
              onClick={confirmClearChat}
              className="flex-1 rounded-xl bg-danger px-4 py-2.5 text-sm font-semibold text-white transition-opacity hover:opacity-90"
            >
              <Icon icon="fa-trash" className="mr-2" />
              Clear Chat
            </button>
            <button
              type="button"
              onClick={closeModal}
              className="rounded-xl border border-line-light px-4 py-2.5 text-sm font-semibold text-ink-2 transition-colors hover:border-primary hover:text-primary-text"
            >
              Cancel
            </button>
          </div>
        </Modal>
      )}

      {modal === 'group-info' && (
        <Modal onClose={closeModal}>
          <ModalHeader title={moodData.groupName} icon={moodData.icon} onClose={closeModal} />
          <div className="space-y-5">
            <div>
              <h4 className="mb-1 text-sm font-bold text-ink">About This Group</h4>
              <p className="text-sm text-ink-2">
                This is a supportive community for people experiencing {moodData.description.toLowerCase()} feelings. Share your
                experiences, offer support, and connect with others who understand what you're going through.
              </p>
            </div>
            <div>
              <h4 className="mb-2 text-sm font-bold text-ink">Group Statistics</h4>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { label: 'Members', value: members.length },
                  { label: 'Messages', value: messages.length },
                  { label: 'Active Polls', value: polls.filter((p) => p.active).length },
                ].map((stat) => (
                  <div key={stat.label} className="rounded-2xl bg-canvas p-3 text-center">
                    <p className="text-xl font-bold text-ink">{stat.value}</p>
                    <p className="text-xs text-ink-2">{stat.label}</p>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <h4 className="mb-2 text-sm font-bold text-ink">Group Guidelines</h4>
              <ul className="space-y-1.5 text-sm text-ink-2">
                <li>• Be respectful and supportive to all members</li>
                <li>• Keep conversations relevant to the group's purpose</li>
                <li>• Respect privacy and confidentiality</li>
                <li>• Report inappropriate content</li>
                <li>• Remember this is a safe space for everyone</li>
              </ul>
            </div>
          </div>
        </Modal>
      )}

      {modal === 'create-poll' && (
        <Modal onClose={closeModal}>
          <ModalHeader title="Create New Poll" icon="fa-plus" onClose={closeModal} />
          <div className="space-y-3">
            <div>
              <label className="mb-1 block text-xs font-semibold text-ink-2">Poll Question:</label>
              <input
                type="text"
                value={pollQuestion}
                onChange={(e) => setPollQuestion(e.target.value)}
                placeholder="What would you like to ask the group?"
                className="w-full rounded-xl border border-line-light bg-canvas px-3 py-2 text-sm text-ink placeholder:text-ink-2/60 focus:border-primary focus:outline-none"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-semibold text-ink-2">Poll Options:</label>
              <div className="space-y-2">
                {pollOptions.map((option, idx) => (
                  <input
                    key={idx}
                    type="text"
                    value={option}
                    onChange={(e) => setPollOptions((opts) => opts.map((o, i) => (i === idx ? e.target.value : o)))}
                    placeholder={`Option ${idx + 1}`}
                    className="w-full rounded-xl border border-line-light bg-canvas px-3 py-2 text-sm text-ink placeholder:text-ink-2/60 focus:border-primary focus:outline-none"
                  />
                ))}
              </div>
            </div>
            <div className="flex gap-2 pt-1">
              <button
                type="button"
                onClick={createPoll}
                className="flex-1 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-on-primary transition-opacity hover:opacity-90"
              >
                <Icon icon="fa-plus" className="mr-2" />
                Create Poll
              </button>
              <button
                type="button"
                onClick={closeModal}
                className="rounded-xl border border-line-light px-4 py-2.5 text-sm font-semibold text-ink-2 transition-colors hover:border-primary hover:text-primary-text"
              >
                Cancel
              </button>
            </div>
          </div>
        </Modal>
      )}
    </section>
  )
}
