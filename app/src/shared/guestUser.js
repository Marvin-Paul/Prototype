// Port of prototype/js/guest-user.js
// Authentication is removed for the prototype. All features run under a fixed
// demo identity so mood logs, appointments, meditation sessions and mood groups
// keep persisting to Supabase without a login flow.
import { get, set } from './storage'

const STORAGE_KEY = 'campusMindspace_currentUser'

export function createGuestProfile() {
  return {
    id: 'demo-student-0001',
    fullName: 'Demo Student',
    firstName: 'Demo',
    email: 'demo@campusmindspace.app',
    initialMood: 'happy',
    currentMood: 'happy',
    isGuest: true,
  }
}

// Returns the active (demo) user and guarantees it is available in
// localStorage for pages that read campusMindspace_currentUser.
export function getGuestUser() {
  const saved = get(STORAGE_KEY)
  if (saved && saved.id) return saved
  const profile = createGuestProfile()
  set(STORAGE_KEY, profile)
  return profile
}

export const GuestUser = {
  profile: createGuestProfile,
  get: getGuestUser,
  currentUser: getGuestUser,
}
