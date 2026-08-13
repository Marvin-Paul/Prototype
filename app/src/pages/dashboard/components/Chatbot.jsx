import { useEffect, useRef, useState } from 'react'
import { useLanguage } from '../../../shared/LanguageProvider'

// Port of prototype/js/chatbot.js (MindSpace AI Assistant).
// Conversation logic is kept English-only, matching the prototype behavior.
function generateResponse(userMessage) {
  const message = userMessage.toLowerCase()
  let response = ''
  let quickReplies = []

  if (message.includes('stress') || message.includes('overwhelmed') || message.includes('pressure')) {
    response = "I understand you're feeling stressed. Remember, it's okay to take breaks. Try the 4-7-8 breathing technique: breathe in for 4 seconds, hold for 7, exhale for 8. Would you like to try our guided meditation or breathing exercises?"
    quickReplies = ['Start breathing exercise', 'View meditation', 'Talk to counselor']
  } else if (message.includes('anxious') || message.includes('anxiety') || message.includes('worried')) {
    response = "Anxiety can be challenging. Try grounding yourself with the 5-4-3-2-1 technique: name 5 things you see, 4 you can touch, 3 you hear, 2 you smell, and 1 you taste. I'm here to help you through this."
    quickReplies = ['Learn more techniques', 'Book counseling', 'Relaxation exercises']
  } else if (message.includes('sleep') || message.includes('insomnia') || message.includes('tired')) {
    response = "Good sleep is crucial for mental health. Try establishing a bedtime routine, avoiding screens 1 hour before bed, and keeping your room cool and dark. Would you like some sleep hygiene tips?"
    quickReplies = ['Sleep tips', 'Relaxation music', 'Talk to someone']
  } else if (message.includes('study') || message.includes('exam') || message.includes('focus')) {
    response = "Effective studying is about quality, not just quantity. Try the Pomodoro Technique: 25 minutes of focused study, then a 5-minute break. Stay hydrated and take care of yourself!"
    quickReplies = ['Study resources', 'Time management', 'Stress relief']
  } else if (message.includes('sad') || message.includes('depressed') || message.includes('down')) {
    response = "I'm sorry you're feeling this way. Your feelings are valid. Sometimes talking helps - would you like to connect with a counselor? In the meantime, try doing something small that usually brings you joy."
    quickReplies = ['Book counseling', 'Self-care tips', 'Crisis support']
  } else if (message.includes('good') || message.includes('great') || message.includes('happy') || message.includes('better')) {
    response = "That's wonderful to hear! Keep up the positive momentum. Remember to celebrate your wins, no matter how small. What's been helping you feel good?"
    quickReplies = ['Share gratitude', 'Mood tracker', 'Keep the streak']
  } else if (message.includes('suicide') || message.includes('hurt myself') || message.includes('end it all')) {
    response = "I'm concerned about you. Please reach out to a crisis counselor immediately. National Crisis Hotline: 988 (available 24/7). You matter, and help is available. Would you like me to connect you with immediate support?"
    quickReplies = ['Call crisis line', 'Emergency contacts', 'Talk to counselor now']
  } else {
    response = "I'm here to support you with stress, anxiety, sleep issues, study tips, and general mental wellness. How can I help you today?"
    quickReplies = ['Mental health resources', 'Book counseling', 'Relaxation exercises', 'Study support']
  }

  return { response, quickReplies }
}

function MessageBubble({ sender, text, time }) {
  if (sender === 'user') {
    return (
      <div className="flex justify-end">
        <div className="max-w-[80%] rounded-2xl rounded-br-sm bg-gradient-to-br from-primary to-primary-dark px-4 py-2.5 text-white shadow-md">
          <p className="text-sm leading-snug">{text}</p>
          <span className="mt-1 block text-right text-[10px] text-white/70">{time}</span>
        </div>
      </div>
    )
  }
  return (
    <div className="flex justify-start">
      <div className="max-w-[80%] rounded-2xl rounded-bl-sm border border-line-light bg-surface px-4 py-2.5 text-ink shadow-sm">
        <p className="text-sm leading-snug">{text}</p>
        <span className="mt-1 block text-right text-[10px] text-ink-3">{time}</span>
      </div>
    </div>
  )
}

export default function Chatbot() {
  const { t } = useLanguage()
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [typing, setTyping] = useState(false)
  const scrollerRef = useRef(null)

  const addMessage = (sender, text) => {
    const time = new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
    setMessages((prev) => [...prev, { type: 'msg', sender, text, time }])
  }

  const addQuickReplies = (replies) => {
    setMessages((prev) => [...prev, { type: 'quick', replies }])
  }

  const handleQuickReply = (reply) => {
    setMessages((prev) => prev.filter((m) => m.type !== 'quick'))
    respondTo(reply)
  }

  const sendMessage = () => {
    const value = input.trim()
    if (!value) return
    setInput('')
    respondTo(value)
  }

  const respondTo = (text) => {
    addMessage('user', text)
    setTyping(true)
    setTimeout(() => {
      setTyping(false)
      const { response, quickReplies } = generateResponse(text)
      addMessage('bot', response)
      if (quickReplies.length > 0) addQuickReplies(quickReplies)
    }, 1000)
  }

  useEffect(() => {
    const timer = setTimeout(() => {
      addMessage('bot', "Welcome to Campus Mindspace! I'm here to support your mental wellness journey. How may I help you today?")
      addQuickReplies(["I'm feeling stressed", 'Need study tips', 'Feeling anxious', 'Sleep problems'])
    }, 500)
    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    const el = scrollerRef.current
    if (el) el.scrollTop = el.scrollHeight
  }, [messages, typing, open])

  return (
    <>
      {/* Chatbot button */}
      <button
        type="button"
        aria-label="Chat"
        onClick={() => setOpen(true)}
        className={`fixed bottom-5 right-5 z-[80] flex h-14 w-14 items-center justify-center rounded-full bg-[linear-gradient(135deg,var(--primary-color),var(--primary-dark))] text-on-primary shadow-glow transition-all duration-300 hover:scale-110 ${open ? 'hidden' : ''}`}
      >
        <i className="fas fa-comments text-xl" />
      </button>

      {/* Chatbot window */}
      <div
        className={`fixed right-5 bottom-5 z-[90] flex w-[calc(100vw-2.5rem)] max-w-sm flex-col overflow-hidden rounded-3xl border border-line-light bg-surface shadow-2xl transition-all duration-300 ${open ? 'translate-y-0 opacity-100' : 'pointer-events-none translate-y-6 opacity-0'}`}
        style={{ height: 'min(560px, calc(100vh - 2.5rem))' }}
      >
        {/* Header */}
        <div className="flex items-center justify-between bg-[linear-gradient(135deg,var(--primary-color),var(--primary-dark))] px-5 py-4 text-on-primary">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/20 text-lg backdrop-blur">
              <i className="fas fa-robot" />
            </div>
            <div>
              <h3 className="text-sm font-bold leading-tight">{t('chatbot_title')}</h3>
              <p className="text-xs text-white/80">{t('chatbot_subtitle')}</p>
            </div>
          </div>
          <button
            type="button"
            aria-label="Close chat"
            onClick={() => setOpen(false)}
            className="flex h-8 w-8 items-center justify-center rounded-full bg-white/15 transition-colors hover:bg-white/25"
          >
            <i className="fas fa-times text-sm" />
          </button>
        </div>

        {/* Messages */}
        <div ref={scrollerRef} className="flex-1 space-y-3 overflow-y-auto bg-canvas p-4">
          {messages.map((msg, idx) =>
            msg.type === 'quick' ? (
              <div key={idx} className="flex flex-wrap gap-2 pt-1">
                {msg.replies.map((reply) => (
                  <button
                    key={reply}
                    type="button"
                    onClick={() => handleQuickReply(reply)}
                    className="rounded-full border border-primary/40 bg-surface px-3 py-1.5 text-xs font-semibold text-primary-text transition-colors hover:bg-primary hover:text-on-primary"
                  >
                    {reply}
                  </button>
                ))}
              </div>
            ) : (
              <MessageBubble key={idx} sender={msg.sender} text={msg.text} time={msg.time} />
            ),
          )}
          {typing && (
            <div className="flex justify-start">
              <div className="flex items-center gap-1 rounded-2xl rounded-bl-sm border border-line-light bg-surface px-4 py-3 shadow-sm">
                <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-ink-3" style={{ animationDelay: '0ms' }} />
                <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-ink-3" style={{ animationDelay: '150ms' }} />
                <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-ink-3" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          )}
        </div>

        {/* Input */}
        <div className="flex items-center gap-2 border-t border-line-light bg-surface p-3">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') sendMessage()
            }}
            placeholder={t('chatbot_placeholder')}
            className="flex-1 rounded-full border border-line bg-canvas px-4 py-2.5 text-sm text-ink placeholder:text-ink-3 focus:border-primary focus:outline-none"
          />
          <button
            type="button"
            aria-label="Send"
            onClick={sendMessage}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-[linear-gradient(135deg,var(--primary-color),var(--primary-dark))] text-on-primary shadow-md transition-transform hover:scale-110"
          >
            <i className="fas fa-paper-plane text-sm" />
          </button>
        </div>
      </div>
    </>
  )
}
