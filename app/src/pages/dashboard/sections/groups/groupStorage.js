// localStorage persistence helpers for the group chat section (port of the
// prototype's mood-groups.js data layer).

import { get, set } from '../../../../shared/storage'
import { MOODS, SAMPLE_MEMBERS, WELCOME_MESSAGES, DEFAULT_POLLS, makeMessage } from './data'

export const chatKey = (mood) => `group_chat_${mood}`
export const membersKey = (mood) => `group_members_${mood}`
export const pollsKey = (mood) => `group_polls_${mood}`
export const pollVotesKey = (mood) => `group_poll_votes_${mood}`
export const MOOD_STORAGE_KEY = 'campusMindspace_group_mood'
export const SETTINGS_STORAGE_KEY = 'campusMindspace_chat_settings'
export const movementsKey = () => 'user_movements'
export const reportedKey = () => 'reported_messages'

export function seedGroup(mood) {
  if (!get(chatKey(mood))) {
    const now = Date.now()
    const welcome = WELCOME_MESSAGES[mood] || []
    const messages = [
      makeMessage({
        id: `${now}-sys`,
        message: `Welcome to the ${MOODS[mood].groupName}! This is a safe space to share and connect with others who understand what you're going through.`,
      }),
      ...welcome.map((m, i) =>
        makeMessage({
          id: `${now}-${i}`,
          userId: m.userId,
          userName: m.userName,
          message: m.message,
          timestamp: new Date(now - 3600000 + i * 300000).toISOString(),
          type: 'user',
        })
      ),
    ]
    set(chatKey(mood), messages)
  }
  if (!get(membersKey(mood))) {
    set(membersKey(mood), SAMPLE_MEMBERS[mood] || [])
  }
  if (!get(pollsKey(mood))) {
    set(pollsKey(mood), DEFAULT_POLLS[mood] || [])
  }
}

export function seedAllGroups() {
  Object.keys(MOODS).forEach(seedGroup)
}

export function loadMembers(mood, currentUser) {
  const members = get(membersKey(mood), [])
  const list = members.slice()
  if (currentUser && !list.find((m) => m.id === currentUser.id)) {
    list.push({
      id: currentUser.id,
      fullName: currentUser.fullName,
      currentMood: mood,
      avatar: currentUser.avatar || '🙂',
    })
    set(membersKey(mood), list)
  }
  return list
}

export function loadMessages(mood) {
  return get(chatKey(mood), [])
}

export function saveMessages(mood, messages) {
  set(chatKey(mood), messages)
}

export function loadPolls(mood) {
  return get(pollsKey(mood), [])
}

export function savePolls(mood, polls) {
  set(pollsKey(mood), polls)
}

export function loadPollVotes(mood) {
  return get(pollVotesKey(mood), {})
}

export function savePollVotes(mood, votes) {
  set(pollVotesKey(mood), votes)
}

export function loadMovements() {
  return get(movementsKey(), [])
}

export function addMovement(movement) {
  const list = loadMovements()
  list.push(movement)
  set(movementsKey(), list)
}

export function loadReported() {
  return get(reportedKey(), [])
}

export function addReport(report) {
  const list = loadReported()
  list.push(report)
  set(reportedKey(), list)
}

export function loadChatSettings() {
  return get(SETTINGS_STORAGE_KEY, null)
}

export function saveChatSettings(settings) {
  set(SETTINGS_STORAGE_KEY, settings)
}
