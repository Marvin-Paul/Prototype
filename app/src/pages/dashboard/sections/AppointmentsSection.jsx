import { useEffect, useMemo, useState } from 'react'
import { useLanguage } from '../../../shared/LanguageProvider'
import { get, set as storageSet } from '../../../shared/storage'
import { notify } from '../../../shared/toast'
import Modal from '../components/Modal'
import SectionHeader from '../components/SectionHeader'

const COUNSELORS = {
  academic: {
    name: 'Dr. Sarah Johnson',
    specialty: 'Academic Stress & Time Management',
    description: 'Helps students manage academic pressure and develop effective study strategies.',
    icon: 'fa-user-graduate',
    experience: '8 years',
    rating: 4.9,
    sessions: 245,
    availability: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
    timeSlots: ['09:00', '10:00', '11:00', '14:00', '15:00', '16:00'],
  },
  relationship: {
    name: 'Dr. Michael Chen',
    specialty: 'Relationships & Social Life',
    description: 'Supports students navigating friendships, dating, and family dynamics.',
    icon: 'fa-users',
    experience: '6 years',
    rating: 4.8,
    sessions: 189,
    availability: ['Monday', 'Wednesday', 'Friday'],
    timeSlots: ['09:00', '11:00', '13:00', '15:00', '17:00'],
  },
  anxiety: {
    name: 'Dr. Emily Rodriguez',
    specialty: 'Anxiety & Depression',
    description: 'Specializes in treating anxiety disorders and mood-related concerns.',
    icon: 'fa-heartbeat',
    experience: '10 years',
    rating: 4.9,
    sessions: 312,
    availability: ['Tuesday', 'Thursday', 'Saturday'],
    timeSlots: ['10:00', '12:00', '14:00', '16:00'],
  },
  identity: {
    name: 'Dr. Alex Thompson',
    specialty: 'Identity & Personal Growth',
    description: 'Helps students explore identity, purpose, and personal development.',
    icon: 'fa-star',
    experience: '7 years',
    rating: 4.7,
    sessions: 156,
    availability: ['Monday', 'Tuesday', 'Thursday'],
    timeSlots: ['09:00', '11:00', '14:00', '16:00', '18:00'],
  },
}

const SESSION_TYPES = [
  { id: 'individual', label: 'Individual Session', note: '50 minutes', price: '$80', icon: 'fa-user' },
  { id: 'group', label: 'Group Session', note: '60 minutes', price: '$40', icon: 'fa-users' },
]

const isoDate = (d) => d.toISOString().split('T')[0]
const formatDisplayDate = (dateStr) => new Date(dateStr + 'T00:00:00').toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' })

export default function AppointmentsSection() {
  const { t } = useLanguage()
  const [appointments, setAppointments] = useState(() => get('appointments', []))
  const [bookingFor, setBookingFor] = useState(null)
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [lastBooked, setLastBooked] = useState(null)

  const upcoming = useMemo(
    () =>
      appointments
        .filter((apt) => apt.status !== 'cancelled' && new Date(`${apt.date}T${apt.timeSlot}:00`) >= new Date())
        .sort((a, b) => a.date.localeCompare(b.date) || a.timeSlot.localeCompare(b.timeSlot)),
    [appointments],
  )

  useEffect(() => {
    storageSet('appointments', appointments)
  }, [appointments])

  const saveBooking = (data) => {
    const appointment = {
      id: Date.now().toString(),
      counselorType: bookingFor,
      ...data,
      status: 'confirmed',
      createdAt: new Date().toISOString(),
      meetingLink: `https://meet.campusmindspace.edu/session/${Date.now()}`,
    }
    setAppointments((prev) => [...prev, appointment])
    setBookingFor(null)
    setLastBooked(appointment)
    setConfirmOpen(true)
    notify(t('appointment_booked'), 'success')
  }

  const cancelAppointment = (id) => {
    if (!window.confirm('Are you sure you want to cancel this appointment?')) return
    setAppointments((prev) => prev.map((a) => (a.id === id ? { ...a, status: 'cancelled' } : a)))
    notify('Appointment cancelled', 'info')
  }

  return (
    <div className="space-y-8">
      <SectionHeader title={t('appointments_title')} subtitle={t('appointments_subtitle')} />

      {/* Counselors */}
      <section>
        <h2 className="mb-4 text-xl font-bold text-ink">Our Counselors</h2>
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {Object.entries(COUNSELORS).map(([key, c]) => (
            <div key={key} className="flex flex-col rounded-3xl border border-line-light bg-surface p-6 shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
              <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-[linear-gradient(135deg,var(--primary-color),var(--secondary-color))] text-3xl text-white shadow-glow">
                <i className={`fas ${c.icon}`} />
              </div>
              <h3 className="mt-4 text-center font-bold text-ink">{c.name}</h3>
              <p className="mt-1 text-center text-xs font-semibold text-primary">{c.specialty}</p>
              <p className="mt-2 flex-1 text-center text-xs leading-relaxed text-ink-2">{c.description}</p>
              <div className="mt-4 flex flex-wrap justify-center gap-2 text-[11px] font-semibold text-ink-2">
                <span className="flex items-center gap-1 rounded-full bg-canvas px-2.5 py-1"><i className="fas fa-star text-amber-400" /> {c.rating}</span>
                <span className="flex items-center gap-1 rounded-full bg-canvas px-2.5 py-1"><i className="fas fa-clock text-primary" /> {c.experience}</span>
                <span className="flex items-center gap-1 rounded-full bg-canvas px-2.5 py-1"><i className="fas fa-users text-secondary" /> {c.sessions} sessions</span>
              </div>
              <button
                type="button"
                onClick={() => setBookingFor(key)}
                className="mt-5 w-full rounded-full bg-[linear-gradient(135deg,var(--primary-color),var(--primary-dark))] py-2.5 text-sm font-bold text-white shadow-md transition-transform hover:scale-105"
              >
                <i className="fas fa-calendar-plus mr-2" />
                {t('book_session')}
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* Upcoming appointments */}
      <section>
        <h2 className="mb-4 text-xl font-bold text-ink">Your Appointments</h2>
        {upcoming.length === 0 ? (
          <div className="flex flex-col items-center rounded-3xl border border-line-light bg-surface p-10 text-center shadow-md">
            <i className="fas fa-calendar-times mb-3 text-4xl text-ink-3" />
            <h3 className="font-bold text-ink">No Upcoming Appointments</h3>
            <p className="mt-1 max-w-sm text-sm text-ink-2">You don't have any upcoming appointments. Book a session with one of our counselors to get started.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {upcoming.map((apt) => {
              const counselor = COUNSELORS[apt.counselorType]
              return (
                <div key={apt.id} className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-line-light bg-surface p-5 shadow-md">
                  <div className="flex items-center gap-4">
                    <div className="flex h-14 w-14 shrink-0 flex-col items-center justify-center rounded-2xl bg-[linear-gradient(135deg,var(--primary-color),var(--primary-dark))] text-white">
                      <span className="text-lg font-extrabold leading-none">{new Date(`${apt.date}T00:00:00`).getDate()}</span>
                      <span className="text-[10px] uppercase">{new Date(`${apt.date}T00:00:00`).toLocaleDateString(undefined, { month: 'short' })}</span>
                    </div>
                    <div className="min-w-0">
                      <h4 className="truncate font-bold text-ink">{apt.counselorName}</h4>
                      <p className="text-xs text-primary">{counselor?.specialty}</p>
                      <p className="mt-1 flex flex-wrap gap-2 text-xs text-ink-2">
                        <span><i className="fas fa-clock mr-1" />{apt.timeSlot}</span>
                        <span className="capitalize"><i className="fas fa-users mr-1" />{apt.sessionType}</span>
                        <span className="capitalize"><i className="fas fa-video mr-1" />{apt.sessionType === 'individual' ? 'One-on-One' : 'Group'}</span>
                      </p>
                    </div>
                  </div>
                  <div className="flex shrink-0 items-center gap-2">
                    <a
                      href={apt.meetingLink}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 text-xs font-bold text-primary transition-colors hover:bg-primary hover:text-white"
                    >
                      <i className="fas fa-video" /> Join
                    </a>
                    <button
                      type="button"
                      onClick={() => setBookingFor(apt.counselorType)}
                      className="flex items-center gap-2 rounded-full border border-line-light px-4 py-2 text-xs font-bold text-ink-2 transition-colors hover:border-primary hover:text-primary"
                    >
                      <i className="fas fa-edit" /> Reschedule
                    </button>
                    <button
                      type="button"
                      onClick={() => cancelAppointment(apt.id)}
                      className="flex items-center gap-2 rounded-full border border-line-light px-4 py-2 text-xs font-bold text-danger transition-colors hover:border-danger hover:bg-danger/10"
                    >
                      <i className="fas fa-times" /> Cancel
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </section>

      <BookingModal open={!!bookingFor} counselor={bookingFor ? COUNSELORS[bookingFor] : null} onClose={() => setBookingFor(null)} onConfirm={saveBooking} />

      <ConfirmationModal open={confirmOpen} appointment={lastBooked} onClose={() => setConfirmOpen(false)} />
    </div>
  )
}

function BookingModal({ open, counselor, onClose, onConfirm }) {
  const { t } = useLanguage()
  const [date, setDate] = useState('')
  const [timeSlot, setTimeSlot] = useState('')
  const [sessionType, setSessionType] = useState('individual')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [focus, setFocus] = useState('')

  useEffect(() => {
    if (open) {
      setDate('')
      setTimeSlot('')
      setSessionType('individual')
      setName('')
      setEmail('')
      setPhone('')
      setFocus('')
    }
  }, [open])

  const minDate = isoDate(new Date())
  const maxDate = new Date()
  maxDate.setDate(maxDate.getDate() + 30)

  const dayOfWeek = date ? new Date(date + 'T00:00:00').toLocaleDateString('en-US', { weekday: 'long' }) : ''
  const availableSlots = date && counselor ? (counselor.availability.includes(dayOfWeek) ? counselor.timeSlots : []) : []
  const bookedSlots = get('appointments', [])
    .filter((a) => a.date === date && a.counselorType === Object.keys(COUNSELORS).find((k) => COUNSELORS[k].name === counselor.name) && a.status !== 'cancelled')
    .map((a) => a.timeSlot)
  const openSlots = availableSlots.filter((s) => !bookedSlots.includes(s))

  const submit = () => {
    if (!date || !timeSlot || !name.trim() || !email.trim()) {
      notify('Please fill in all required fields', 'warning')
      return
    }
    onConfirm({ counselorName: counselor.name, counselorSpecialty: counselor.specialty, date, timeSlot, sessionType, studentName: name, studentEmail: email, studentPhone: phone, sessionFocus: focus })
  }

  return (
    <Modal open={open} onClose={onClose} title={counselor ? `Book Appointment with ${counselor.name}` : 'Book Appointment'} icon="fa-calendar-plus" maxWidth="max-w-xl">
      {counselor && (
        <>
          <div className="mb-5 flex items-center gap-4 rounded-2xl bg-canvas p-4">
            <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-[linear-gradient(135deg,var(--primary-color),var(--secondary-color))] text-xl text-white">
              <i className={`fas ${counselor.icon}`} />
            </span>
            <div>
              <h3 className="font-bold text-ink">{counselor.name}</h3>
              <p className="text-xs font-semibold text-primary">{counselor.specialty}</p>
              <p className="mt-1 flex gap-3 text-[11px] text-ink-2">
                <span><i className="fas fa-star mr-1 text-amber-400" />{counselor.rating}</span>
                <span><i className="fas fa-clock mr-1" />{counselor.experience}</span>
                <span><i className="fas fa-users mr-1" />{counselor.sessions} sessions</span>
              </p>
            </div>
          </div>

          <div>
            <h4 className="mb-2 text-sm font-bold text-ink">Select Date</h4>
            <input
              type="date"
              min={minDate}
              max={isoDate(maxDate)}
              value={date}
              onChange={(e) => {
                setDate(e.target.value)
                setTimeSlot('')
              }}
              className="w-full rounded-xl border border-line bg-canvas px-4 py-2.5 text-sm text-ink focus:border-primary focus:outline-none"
            />
          </div>

          <div className="mt-4">
            <h4 className="mb-2 text-sm font-bold text-ink">Select Time</h4>
            {!date ? (
              <p className="text-sm text-ink-3">Please select a date first</p>
            ) : openSlots.length === 0 ? (
              <p className="text-sm text-danger">{counselor.availability.includes(dayOfWeek) ? 'No available time slots on this date.' : 'No availability on this day. Please select a different date.'}</p>
            ) : (
              <div className="flex flex-wrap gap-2">
                {openSlots.map((slot) => (
                  <button
                    key={slot}
                    type="button"
                    onClick={() => setTimeSlot(slot)}
                    className={`rounded-full border px-4 py-2 text-xs font-bold transition-colors ${
                      timeSlot === slot ? 'border-primary bg-primary text-white' : 'border-line-light bg-canvas text-ink-2 hover:border-primary'
                    }`}
                  >
                    {slot}
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="mt-4">
            <h4 className="mb-2 text-sm font-bold text-ink">Session Type</h4>
            <div className="grid gap-3 sm:grid-cols-2">
              {SESSION_TYPES.map((st) => (
                <button
                  key={st.id}
                  type="button"
                  onClick={() => setSessionType(st.id)}
                  className={`rounded-2xl border p-4 text-left transition-all ${
                    sessionType === st.id ? 'border-primary bg-primary/5 shadow-md' : 'border-line-light bg-canvas hover:border-primary'
                  }`}
                >
                  <span className={`text-lg ${sessionType === st.id ? 'text-primary' : 'text-ink-2'}`}><i className={`fas ${st.icon}`} /></span>
                  <p className="mt-1 text-sm font-bold text-ink">{st.label}</p>
                  <p className="text-[11px] text-ink-2">{st.note} &middot; {st.price}</p>
                </button>
              ))}
            </div>
          </div>

          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Your Name" className="rounded-xl border border-line bg-canvas px-4 py-2.5 text-sm text-ink placeholder:text-ink-3 focus:border-primary focus:outline-none" />
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email Address" className="rounded-xl border border-line bg-canvas px-4 py-2.5 text-sm text-ink placeholder:text-ink-3 focus:border-primary focus:outline-none" />
            <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="Phone Number" className="rounded-xl border border-line bg-canvas px-4 py-2.5 text-sm text-ink placeholder:text-ink-3 focus:border-primary focus:outline-none sm:col-span-2" />
          </div>

          <div className="mt-4">
            <h4 className="mb-2 text-sm font-bold text-ink">Session Focus (Optional)</h4>
            <textarea
              value={focus}
              onChange={(e) => setFocus(e.target.value)}
              placeholder="What would you like to focus on during this session? Any specific concerns or goals?"
              rows={3}
              className="w-full resize-none rounded-xl border border-line bg-canvas px-4 py-2.5 text-sm text-ink placeholder:text-ink-3 focus:border-primary focus:outline-none"
            />
          </div>

          <button
            type="button"
            onClick={submit}
            className="mt-6 w-full rounded-full bg-[linear-gradient(135deg,var(--primary-color),var(--primary-dark))] py-3 text-sm font-bold text-white shadow-md transition-transform hover:scale-[1.02]"
          >
            <i className="fas fa-check-circle mr-2" />
            {t('confirm_booking')}
          </button>
        </>
      )}
    </Modal>
  )
}

function ConfirmationModal({ open, appointment, onClose }) {
  if (!appointment) return null
  const startDate = new Date(`${appointment.date}T${appointment.timeSlot}:00`)
  const endDate = new Date(startDate.getTime() + 50 * 60000)
  const startStr = startDate.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z'
  const endStr = endDate.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z'
  const title = encodeURIComponent(`Counseling Session - ${appointment.counselorName}`)
  const details = encodeURIComponent(`Session with ${appointment.counselorName} (${appointment.counselorSpecialty})\n\nMeeting Link: ${appointment.meetingLink}`)
  const location = encodeURIComponent(appointment.meetingLink)
  const calendarLink = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${startStr}/${endStr}&details=${details}&location=${location}`

  const item = (label, value) => (
    <div className="flex items-center justify-between gap-4 py-2">
      <span className="text-sm text-ink-2">{label}</span>
      <span className="text-right text-sm font-semibold text-ink">{value}</span>
    </div>
  )

  return (
    <Modal open={open} onClose={onClose} title="Appointment Confirmed!" icon="fa-check-circle" maxWidth="max-w-md">
      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-success/15 text-3xl text-success">
        <i className="fas fa-check-circle" />
      </div>
      <div className="mt-4 divide-y divide-line rounded-2xl border border-line-light bg-canvas px-5">
        {item('Counselor', appointment.counselorName)}
        {item('Specialty', appointment.counselorSpecialty)}
        {item('Date', formatDisplayDate(appointment.date))}
        {item('Time', appointment.timeSlot)}
        {item('Session Type', appointment.sessionType.charAt(0).toUpperCase() + appointment.sessionType.slice(1))}
      </div>
      <div className="mt-5 flex flex-col gap-2.5">
        <a
          href={calendarLink}
          target="_blank"
          rel="noreferrer"
          className="flex items-center justify-center gap-2 rounded-full bg-[linear-gradient(135deg,var(--primary-color),var(--primary-dark))] py-2.5 text-sm font-bold text-white shadow-md transition-transform hover:scale-[1.02]"
        >
          <i className="fas fa-calendar-plus" /> Add to Calendar
        </a>
        <a
          href={appointment.meetingLink}
          target="_blank"
          rel="noreferrer"
          className="flex items-center justify-center gap-2 rounded-full border border-line-light py-2.5 text-sm font-bold text-primary transition-colors hover:border-primary hover:bg-primary/5"
        >
          <i className="fas fa-video" /> Join Session
        </a>
      </div>
    </Modal>
  )
}
