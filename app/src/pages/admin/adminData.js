// Data + persistence layer for the admin/counselor portal (port of the
// prototype's admin-auth.js, admin-dashboard.js, admin-mood-groups.js and
// admin-appointment-manager.js data handling).

import { get, set } from '../../shared/storage'
import { MOODS } from '../dashboard/sections/groups/data'

export const COUNSELORS = {
  academic: { name: 'Dr. Sarah Johnson', specialty: 'Academic Stress & Time Management', icon: 'fa-user-graduate' },
  relationship: { name: 'Dr. Michael Chen', specialty: 'Relationships & Social Life', icon: 'fa-users' },
  anxiety: { name: 'Dr. Emily Rodriguez', specialty: 'Anxiety & Depression', icon: 'fa-heartbeat' },
  identity: { name: 'Dr. Alex Thompson', specialty: 'Identity & Personal Growth', icon: 'fa-star' },
}

export const FEATURE_USAGE = [
  { title: 'Therapy Resources', pct: 85, gradient: 'linear-gradient(90deg,#9fe870 0%,#7ed24b 100%)', icon: 'fa-user-md' },
  { title: 'Meditation', pct: 72, gradient: 'linear-gradient(90deg,#b5e88a 0%,#86d84e 100%)', icon: 'fa-om' },
  { title: 'Resources', pct: 68, gradient: 'linear-gradient(90deg,#cdffad 0%,#9fe870 100%)', icon: 'fa-music' },
  { title: 'Appointments', pct: 45, gradient: 'linear-gradient(90deg,#7ed24b 0%,#4fae2a 100%)', icon: 'fa-calendar-check' },
  { title: 'Mind Games', pct: 91, gradient: 'linear-gradient(90deg,#4fae2a 0%,#2e8b14 100%)', icon: 'fa-gamepad' },
]

export const COUNSELING_DEMAND = [
  { label: 'Academic Stress', bookings: 156, pct: 95, status: 'High Demand', color: 'var(--primary-color)' },
  { label: 'Anxiety & Depression', bookings: 142, pct: 88, status: 'High Demand', color: 'var(--accent-red)' },
  { label: 'Relationships & Social', bookings: 98, pct: 60, status: 'Medium Demand', color: 'var(--accent-pink)' },
  { label: 'Identity & Growth', bookings: 67, pct: 42, status: 'Moderate Demand', color: 'var(--accent-purple)' },
]

export const SAMPLE_ACTIVITIES = [
  { icon: 'fa-user-plus', text: 'New user registered', time: '5 minutes ago', type: 'success' },
  { icon: 'fa-calendar-check', text: 'Appointment booked with Dr. Sarah Johnson', time: '12 minutes ago', type: 'info' },
  { icon: 'fa-gamepad', text: 'Mind game completed: Memory Challenge', time: '18 minutes ago', type: 'primary' },
  { icon: 'fa-om', text: 'Meditation session started', time: '25 minutes ago', type: 'secondary' },
  { icon: 'fa-user-plus', text: 'New user registered', time: '32 minutes ago', type: 'success' },
  { icon: 'fa-download', text: 'Data export completed', time: '1 hour ago', type: 'warning' },
  { icon: 'fa-music', text: 'Resource accessed: Calming Music', time: '1 hour ago', type: 'info' },
  { icon: 'fa-brain', text: 'Therapy resource viewed: CBT', time: '2 hours ago', type: 'primary' },
]

export const TIME_SLOTS = (() => {
  const slots = []
  for (let hour = 9; hour <= 18; hour++) {
    slots.push(`${String(hour).padStart(2, '0')}:00`)
    if (hour < 18) slots.push(`${String(hour).padStart(2, '0')}:30`)
  }
  return slots
})()

export function loadUsers() {
  return get('campusMindspace_users', [])
}

export function loadAppointments() {
  return get('appointments', [])
}

export function saveAppointments(list) {
  set('appointments', list)
}

export function loadMoodData() {
  return get('campusMindspace_moodData', {})
}

export function loadMovements() {
  return get('user_movements', [])
}

export function loadGroupMessages(mood) {
  return get(`group_chat_${mood}`, [])
}

export function loadGroupMembers(mood) {
  return get(`group_members_${mood}`, [])
}

export function buildGroupStats() {
  const stats = {}
  Object.keys(MOODS).forEach((mood) => {
    const messages = loadGroupMessages(mood)
    const members = loadGroupMembers(mood)
    const today = new Date().toDateString()
    stats[mood] = {
      memberCount: members.length,
      messagesToday: messages.filter((m) => new Date(m.timestamp).toDateString() === today).length,
      lastActivity: messages.length > 0 ? messages[messages.length - 1].timestamp : null,
    }
  })
  return stats
}

export function isToday(date) {
  return date.toDateString() === new Date().toDateString()
}

export function formatTime(timestamp) {
  if (!timestamp) return 'No activity'
  return new Date(timestamp).toLocaleString()
}

export function downloadFile(content, filename, type = 'text/plain') {
  const blob = new Blob([content], { type })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}

export function csvEscape(value) {
  return `"${String(value ?? '').replace(/"/g, '""')}"`
}
