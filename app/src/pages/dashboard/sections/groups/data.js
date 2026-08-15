// Port of the prototype's mood-groups.js data: mood categories, sample
// members, welcome messages, mood resources, default polls, challenges and
// crisis support information.

export const MOODS = {
  happy: { color: '#10b981', description: 'Happy', groupName: 'Happy Group', icon: 'fa-smile' },
  anxious: { color: '#f59e0b', description: 'Anxious', groupName: 'Anxious Group', icon: 'fa-heartbeat' },
  stressed: { color: '#ef4444', description: 'Stressed', groupName: 'Stressed Group', icon: 'fa-exclamation-triangle' },
  excited: { color: '#8b5cf6', description: 'Excited', groupName: 'Excited Group', icon: 'fa-star' },
  sad: { color: '#3b82f6', description: 'Sad', groupName: 'Sad Group', icon: 'fa-frown' },
  motivated: { color: '#06b6d4', description: 'Motivated', groupName: 'Motivated Group', icon: 'fa-fire' },
  overwhelmed: { color: '#dc2626', description: 'Overwhelmed', groupName: 'Overwhelmed Group', icon: 'fa-exclamation-circle' },
  lonely: { color: '#6b7280', description: 'Lonely', groupName: 'Lonely Group', icon: 'fa-user' },
}

export const SAMPLE_MEMBERS = {
  happy: [
    { id: 'user1', fullName: 'Sarah Johnson', currentMood: 'happy', avatar: 'fa-graduation-cap' },
    { id: 'user2', fullName: 'Mike Chen', currentMood: 'happy', avatar: 'fa-laptop-code' },
    { id: 'user3', fullName: 'Emma Davis', currentMood: 'happy', avatar: 'fa-paint-brush' },
    { id: 'user4', fullName: 'Alex Rodriguez', currentMood: 'happy', avatar: 'fa-music' },
  ],
  anxious: [
    { id: 'user5', fullName: 'Jordan Smith', currentMood: 'anxious', avatar: 'fa-flask' },
    { id: 'user6', fullName: 'Taylor Brown', currentMood: 'anxious', avatar: 'fa-book' },
    { id: 'user7', fullName: 'Casey Wilson', currentMood: 'anxious', avatar: 'fa-briefcase' },
    { id: 'user8', fullName: 'Riley Martinez', currentMood: 'anxious', avatar: 'fa-theater-masks' },
  ],
  stressed: [
    { id: 'user9', fullName: 'Morgan Taylor', currentMood: 'stressed', avatar: 'fa-user-md' },
    { id: 'user10', fullName: 'Avery Johnson', currentMood: 'stressed', avatar: 'fa-chalkboard-teacher' },
    { id: 'user11', fullName: 'Quinn Anderson', currentMood: 'stressed', avatar: 'fa-tools' },
    { id: 'user12', fullName: 'Sage Thompson', currentMood: 'stressed', avatar: 'fa-laptop-code' },
  ],
  excited: [
    { id: 'user13', fullName: 'River Garcia', currentMood: 'excited', avatar: 'fa-rocket' },
    { id: 'user14', fullName: 'Phoenix Lee', currentMood: 'excited', avatar: 'fa-paint-brush' },
    { id: 'user15', fullName: 'Skyler White', currentMood: 'excited', avatar: 'fa-music' },
    { id: 'user16', fullName: 'Blake Cooper', currentMood: 'excited', avatar: 'fa-drum' },
  ],
  sad: [
    { id: 'user17', fullName: 'Dakota Murphy', currentMood: 'sad', avatar: 'fa-theater-masks' },
    { id: 'user18', fullName: 'Indigo Foster', currentMood: 'sad', avatar: 'fa-paint-brush' },
    { id: 'user19', fullName: 'Ocean Reed', currentMood: 'sad', avatar: 'fa-book' },
    { id: 'user20', fullName: 'Forest Green', currentMood: 'sad', avatar: 'fa-music' },
  ],
  motivated: [
    { id: 'user21', fullName: 'Aspen Hill', currentMood: 'motivated', avatar: 'fa-dumbbell' },
    { id: 'user22', fullName: 'Cedar Stone', currentMood: 'motivated', avatar: 'fa-running' },
    { id: 'user23', fullName: 'Sage Moon', currentMood: 'motivated', avatar: 'fa-bullseye' },
    { id: 'user24', fullName: 'River Star', currentMood: 'motivated', avatar: 'fa-rocket' },
  ],
  overwhelmed: [
    { id: 'user25', fullName: 'Storm Cloud', currentMood: 'overwhelmed', avatar: 'fa-briefcase' },
    { id: 'user26', fullName: 'Thunder Bolt', currentMood: 'overwhelmed', avatar: 'fa-chart-bar' },
    { id: 'user27', fullName: 'Lightning Flash', currentMood: 'overwhelmed', avatar: 'fa-bolt' },
    { id: 'user28', fullName: 'Rain Drop', currentMood: 'overwhelmed', avatar: 'fa-cloud-rain' },
  ],
  lonely: [
    { id: 'user29', fullName: 'Luna Night', currentMood: 'lonely', avatar: 'fa-moon' },
    { id: 'user30', fullName: 'Star Bright', currentMood: 'lonely', avatar: 'fa-star' },
    { id: 'user31', fullName: 'Moon Beam', currentMood: 'lonely', avatar: 'fa-moon' },
    { id: 'user32', fullName: 'Sky Blue', currentMood: 'lonely', avatar: 'fa-cloud' },
  ],
}

export const WELCOME_MESSAGES = {
  happy: [
    { userId: 'user1', userName: 'Sarah Johnson', message: "Hey everyone! Just finished my presentation and it went amazing!" },
    { userId: 'user2', userName: 'Mike Chen', message: "That's awesome Sarah! I love hearing good news. What was your presentation about?" },
    { userId: 'user3', userName: 'Emma Davis', message: "Congratulations! I'm feeling great today too - just got accepted into my dream internship!" },
  ],
  anxious: [
    { userId: 'user5', userName: 'Jordan Smith', message: "Hi everyone, I'm feeling really anxious about my upcoming exams. Anyone else in the same boat?" },
    { userId: 'user6', userName: 'Taylor Brown', message: "I totally understand Jordan. I've been using breathing exercises and they help a lot. Want to try together?" },
    { userId: 'user7', userName: 'Casey Wilson', message: "You're not alone! I find that breaking study sessions into smaller chunks helps me feel less overwhelmed." },
  ],
  stressed: [
    { userId: 'user9', userName: 'Morgan Taylor', message: "Ugh, I'm so stressed with all these deadlines coming up. How do you all manage your workload?" },
    { userId: 'user10', userName: 'Avery Johnson', message: "I feel you Morgan. I've started using a priority matrix to organize my tasks. It's been a game changer!" },
    { userId: 'user11', userName: 'Quinn Anderson', message: "Remember to take breaks! I set a timer for 25 minutes of work, then 5 minutes of rest. Pomodoro technique!" },
  ],
  excited: [
    { userId: 'user13', userName: 'River Garcia', message: "OMG! I just got the news I've been waiting for! Can't contain my excitement!" },
    { userId: 'user14', userName: 'Phoenix Lee', message: "Tell us more River! I love hearing exciting news! What happened?" },
    { userId: 'user15', userName: 'Skyler White', message: "I'm excited too! Just started a new creative project and the ideas are flowing!" },
  ],
  sad: [
    { userId: 'user17', userName: 'Dakota Murphy', message: "Having a really tough day today. Sometimes it feels like everything is going wrong." },
    { userId: 'user18', userName: 'Indigo Foster', message: "I'm here with you Dakota. Those days are really hard, but they don't last forever." },
    { userId: 'user19', userName: 'Ocean Reed', message: "You're not alone in this. Sometimes just acknowledging how we feel is the first step to feeling better." },
  ],
  motivated: [
    { userId: 'user21', userName: 'Aspen Hill', message: "Feeling super motivated today! Just crushed my workout and ready to tackle my goals!" },
    { userId: 'user22', userName: 'Cedar Stone', message: "That's amazing Aspen! I love this energy! What goals are you working on?" },
    { userId: 'user23', userName: 'Sage Moon', message: "I'm feeling motivated too! Just finished planning my week and I'm ready to make it count!" },
  ],
  overwhelmed: [
    { userId: 'user25', userName: 'Storm Cloud', message: "Feeling completely overwhelmed with everything on my plate. Anyone else feeling this way?" },
    { userId: 'user26', userName: 'Thunder Bolt', message: "I totally get it Storm. When I feel overwhelmed, I try to focus on just one thing at a time." },
    { userId: 'user27', userName: 'Lightning Flash', message: "Remember to breathe. Sometimes stepping back and taking a break helps us see things more clearly." },
  ],
  lonely: [
    { userId: 'user29', userName: 'Luna Night', message: "Feeling really lonely today. It's hard when you feel disconnected from everyone around you." },
    { userId: 'user30', userName: 'Star Bright', message: "I understand Luna. Loneliness can be really tough. You're not alone in feeling this way." },
    { userId: 'user31', userName: 'Moon Beam', message: "Sometimes reaching out, even in small ways, can help. I'm glad you're here sharing with us." },
  ],
}

export const MOOD_RESOURCES = {
  happy: [
    { title: 'Maintaining Positive Energy', description: 'Tips for sustaining your positive mood and spreading joy to others.', icon: 'fa-sun', exercise: 'gratitude_journal' },
    { title: 'Celebrating Success', description: 'How to properly celebrate achievements and build on positive momentum.', icon: 'fa-trophy' },
  ],
  anxious: [
    { title: 'Breathing Exercises', description: 'Simple breathing techniques to help calm anxiety and reduce stress.', icon: 'fa-lungs', exercise: 'breathing_exercise' },
    { title: 'Grounding Techniques', description: '5-4-3-2-1 grounding method and other anxiety management tools.', icon: 'fa-anchor', exercise: 'grounding_exercise' },
    { title: 'Anxiety Management Apps', description: 'Recommended apps and resources for managing anxiety.', icon: 'fa-mobile-alt' },
  ],
  stressed: [
    { title: 'Time Management Strategies', description: 'Effective techniques for managing workload and reducing stress.', icon: 'fa-clock' },
    { title: 'Stress Relief Exercises', description: 'Quick exercises to reduce stress and tension.', icon: 'fa-heartbeat', exercise: 'stress_relief' },
    { title: 'Pomodoro Technique', description: 'Learn the 25-minute work, 5-minute break method.', icon: 'fa-stopwatch' },
  ],
  excited: [
    { title: 'Channeling Excitement', description: 'How to channel positive energy into productive activities.', icon: 'fa-bolt' },
    { title: 'Goal Setting', description: 'Turn excitement into achievable goals and action plans.', icon: 'fa-bullseye', exercise: 'goal_setting' },
  ],
  sad: [
    { title: 'Coping with Sadness', description: 'Healthy ways to process and work through difficult emotions.', icon: 'fa-heart' },
    { title: 'Self-Care Activities', description: 'Gentle self-care practices for difficult times.', icon: 'fa-spa', exercise: 'self_care' },
    { title: 'Professional Support', description: 'When and how to seek professional help for persistent sadness.', icon: 'fa-user-md' },
  ],
  motivated: [
    { title: 'Sustaining Motivation', description: 'Strategies for maintaining motivation over the long term.', icon: 'fa-fire' },
    { title: 'Goal Achievement', description: 'Break down big goals into manageable steps.', icon: 'fa-tasks', exercise: 'goal_breakdown' },
  ],
  overwhelmed: [
    { title: 'Managing Overwhelm', description: 'Step-by-step approach to dealing with overwhelming situations.', icon: 'fa-compress', exercise: 'overwhelm_management' },
    { title: 'Prioritization Techniques', description: 'Learn to prioritize tasks and reduce mental load.', icon: 'fa-sort' },
    { title: 'Asking for Help', description: 'How to reach out and ask for support when needed.', icon: 'fa-hands-helping' },
  ],
  lonely: [
    { title: 'Building Connections', description: 'Strategies for building meaningful relationships and connections.', icon: 'fa-users' },
    { title: 'Social Skills', description: 'Tips for improving social interactions and communication.', icon: 'fa-comments' },
    { title: 'Community Resources', description: 'Find local groups and activities to meet new people.', icon: 'fa-map-marker-alt' },
  ],
}

export const DEFAULT_POLLS = {
  happy: [
    {
      id: 'happy_1',
      question: 'What makes you feel most grateful today?',
      options: [
        { text: 'Personal achievements', votes: 12 },
        { text: 'Supportive relationships', votes: 18 },
        { text: 'Good health', votes: 8 },
        { text: 'Learning opportunities', votes: 6 },
      ],
      active: true,
    },
  ],
  anxious: [
    {
      id: 'anxious_1',
      question: 'What helps you manage anxiety most effectively?',
      options: [
        { text: 'Breathing exercises', votes: 15 },
        { text: 'Talking to someone', votes: 10 },
        { text: 'Physical activity', votes: 8 },
        { text: 'Mindfulness meditation', votes: 12 },
      ],
      active: true,
    },
  ],
  stressed: [
    {
      id: 'stressed_1',
      question: 'What is your biggest source of stress right now?',
      options: [
        { text: 'Academic workload', votes: 20 },
        { text: 'Financial concerns', votes: 8 },
        { text: 'Social relationships', votes: 6 },
        { text: 'Future planning', votes: 10 },
      ],
      active: true,
    },
  ],
}

export const MOOD_CHALLENGES = {
  happy: [
    { id: 'happy_1', title: '30-Day Gratitude Challenge', description: "Share one thing you're grateful for every day for 30 days", category: 'Gratitude', duration: '30 days', participants: 12, progress: 65, reward: 'Gratitude Master Badge', icon: 'fa-heart' },
    { id: 'happy_2', title: 'Spread Joy Challenge', description: 'Perform one random act of kindness each week', category: 'Kindness', duration: '4 weeks', participants: 8, progress: 50, reward: 'Joy Spreader Badge', icon: 'fa-hands-helping' },
  ],
  anxious: [
    { id: 'anxious_1', title: 'Daily Breathing Practice', description: 'Practice 5-minute breathing exercises daily for 2 weeks', category: 'Mindfulness', duration: '14 days', participants: 15, progress: 70, reward: 'Calm Mind Badge', icon: 'fa-wind' },
    { id: 'anxious_2', title: 'Worry Journal Challenge', description: 'Write down 3 worries and 3 solutions every day', category: 'Journaling', duration: '21 days', participants: 10, progress: 45, reward: 'Anxiety Warrior Badge', icon: 'fa-book' },
  ],
  stressed: [
    { id: 'stressed_1', title: 'Work-Life Balance Challenge', description: 'Set clear boundaries and take breaks every 2 hours', category: 'Balance', duration: '14 days', participants: 20, progress: 60, reward: 'Balance Master Badge', icon: 'fa-balance-scale' },
    { id: 'stressed_2', title: 'Stress-Free Sundays', description: 'Dedicate Sundays to relaxation and self-care', category: 'Self-Care', duration: '4 weeks', participants: 14, progress: 75, reward: 'Self-Care Champion Badge', icon: 'fa-spa' },
  ],
  motivated: [
    { id: 'motivated_1', title: 'Goal Crusher Challenge', description: 'Set and achieve one weekly goal for 6 weeks', category: 'Goals', duration: '6 weeks', participants: 18, progress: 55, reward: 'Goal Achiever Badge', icon: 'fa-bullseye' },
    { id: 'motivated_2', title: 'Morning Routine Challenge', description: 'Follow a consistent morning routine for 21 days', category: 'Habits', duration: '21 days', participants: 16, progress: 80, reward: 'Early Bird Badge', icon: 'fa-sun' },
  ],
}

export const CRISIS_INFO = {
  phone: {
    title: 'Crisis Hotline: 988',
    description: 'Call 988 for immediate crisis support. Available 24/7.',
    action: 'Call 988',
    number: '988',
    icon: 'fa-phone-alt',
  },
  text: {
    title: 'Crisis Text Line: 741741',
    description: 'Text HOME to 741741 for crisis support via text.',
    action: 'Text HOME to 741741',
    number: '741741',
    icon: 'fa-comment',
  },
  '911': {
    title: 'Emergency Services: 911',
    description: 'Call 911 for immediate emergency assistance.',
    action: 'Call 911',
    number: '911',
    icon: 'fa-exclamation-triangle',
  },
}

export const GUIDELINES = [
  { icon: 'fa-heart', text: 'Be kind and supportive to all members' },
  { icon: 'fa-lock', text: "Respect privacy - don't share personal information" },
  { icon: 'fa-comments', text: 'Share your experiences to help others' },
  { icon: 'fa-handshake', text: 'Remember this is a safe space for everyone' },
]

export const CHAT_SETTINGS_DEFAULTS = {
  messageNotifications: true,
  typingNotifications: true,
  soundNotifications: true,
  showTimestamps: true,
  showAvatars: true,
  compactMode: false,
  readReceipts: true,
  onlineStatus: true,
}

export const REPORT_REASONS = [
  { value: 'inappropriate', label: 'Inappropriate content' },
  { value: 'harassment', label: 'Harassment or bullying' },
  { value: 'spam', label: 'Spam or irrelevant content' },
  { value: 'harmful', label: 'Harmful or dangerous content' },
  { value: 'other', label: 'Other' },
]

export function makeMessage(overrides) {
  const base = { id: Date.now().toString(), userId: null, userName: 'System', message: '', timestamp: new Date().toISOString(), type: 'system' }
  return { ...base, ...overrides }
}
