// Enhanced Games System - Comprehensive Interactive Activities
class EnhancedGamesSystem {
    constructor() {
        this.currentCategory = 'cognitive';
        this.gameData = this.initializeGameData();
        this.gameStats = JSON.parse(localStorage.getItem('gameStats')) || {};
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.initializeGames();
        this.loadGameStats();
        this.setupCategoryNavigation();
    }

    setupEventListeners() {
        document.addEventListener('click', (e) => {
            // Category navigation
            if (e.target.classList.contains('game-category-btn')) {
                this.switchGameCategory(e.target.dataset.category);
            }

            // Memory Game
            if (e.target.classList.contains('memory-card')) {
                this.handleMemoryCardClick(e.target);
            }
            if (e.target.id === 'resetMemory') {
                this.resetMemoryGame();
            }
            if (e.target.id === 'hintMemory') {
                this.giveMemoryHint();
            }

            // Word Association Game
            if (e.target.id === 'submitWord') {
                this.submitWord();
            }
            if (e.target.id === 'newWordGame') {
                this.startNewWordGame();
            }
            if (e.target.id === 'wordHint') {
                this.giveWordHint();
            }

            // Sequence Game
            if (e.target.classList.contains('sequence-option')) {
                this.selectSequenceOption(e.target);
            }
            if (e.target.id === 'newSequence') {
                this.generateNewSequence();
            }
            if (e.target.id === 'sequenceHint') {
                this.giveSequenceHint();
            }

            // Color Memory Game
            if (e.target.classList.contains('color-btn')) {
                this.handleColorClick(e.target);
            }
            if (e.target.id === 'startColorGame') {
                this.startColorGame();
            }

            // Gratitude Journal
            if (e.target.id === 'saveGratitude') {
                this.saveGratitudeEntry();
            }
            if (e.target.id === 'randomGratitude') {
                this.generateRandomGratitudePrompt();
            }
            if (e.target.classList.contains('prompt-tag')) {
                this.addGratitudePrompt(e.target.dataset.prompt);
            }

            // Affirmations
            if (e.target.id === 'spinBtn') {
                this.getRandomAffirmation();
            }
            if (e.target.id === 'favoriteAffirmation') {
                this.favoriteAffirmation();
            }
            if (e.target.classList.contains('category-btn') && e.target.closest('.affirmation-categories')) {
                this.changeAffirmationCategory(e.target.dataset.category);
            }

            // Breathing Exercise
            if (e.target.id === 'startBreathing') {
                this.startBreathingExercise();
            }
            if (e.target.id === 'stopBreathing') {
                this.stopBreathingExercise();
            }
            if (e.target.classList.contains('preset-btn')) {
                this.selectBreathingPreset(e.target.dataset.preset);
            }

            // Mood Check-in
            if (e.target.classList.contains('mood-option')) {
                this.selectMood(e.target.dataset.mood);
            }
            if (e.target.id === 'saveMoodCheck') {
                this.saveMoodCheck();
            }
            if (e.target.id === 'viewMoodInsights') {
                this.showMoodInsights();
            }

            // Digital Canvas
            if (e.target.classList.contains('tool-btn')) {
                this.selectCanvasTool(e.target.dataset.tool);
            }
            if (e.target.id === 'clearCanvas') {
                this.clearCanvas();
            }
            if (e.target.id === 'saveCanvas') {
                this.saveCanvas();
            }
            if (e.target.id === 'downloadCanvas') {
                this.downloadCanvas();
            }

            // Poetry Generator
            if (e.target.id === 'generatePrompt') {
                this.generatePoetryPrompt();
            }
            if (e.target.id === 'savePoetry') {
                this.savePoetry();
            }

            // Story Builder
            if (e.target.id === 'generateStoryElements') {
                this.generateStoryElements();
            }
            if (e.target.id === 'saveStory') {
                this.saveStory();
            }

            // Would You Rather
            if (e.target.classList.contains('option')) {
                this.selectWYROption(e.target.dataset.option);
            }
            if (e.target.id === 'newWyrQuestion') {
                this.generateNewWYRQuestion();
            }

            // Truth or Dare
            if (e.target.id === 'chooseTruth') {
                this.getTruth();
            }
            if (e.target.id === 'chooseDare') {
                this.getDare();
            }

            // Collaborative Drawing
            if (e.target.id === 'startCollabDrawing') {
                this.startCollaborativeDrawing();
            }
        });

        // Canvas drawing events
        document.addEventListener('DOMContentLoaded', () => {
            this.setupCanvasEvents();
        });

        // Input events
        document.addEventListener('keypress', (e) => {
            if (e.target.id === 'wordInput' && e.key === 'Enter') {
                this.submitWord();
            }
        });
    }

    setupCategoryNavigation() {
        const categoryButtons = document.querySelectorAll('.game-category-btn');
        categoryButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                categoryButtons.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
            });
        });
    }

    switchGameCategory(category) {
        this.currentCategory = category;
        
        // Hide all categories
        document.querySelectorAll('.game-category').forEach(cat => {
            cat.classList.remove('active');
        });
        
        // Show selected category
        const selectedCategory = document.getElementById(`${category}-category`);
        if (selectedCategory) {
            selectedCategory.classList.add('active');
        }

        this.showNotification(`Switched to ${this.getCategoryTitle(category)}`, 'info');
    }

    getCategoryTitle(category) {
        const titles = {
            cognitive: 'Cognitive Games',
            wellness: 'Wellness Activities',
            creativity: 'Creative Tools',
            social: 'Social Games'
        };
        return titles[category] || category;
    }

    initializeGameData() {
        return {
            affirmations: {
                general: [
                    "I am worthy of love and respect.",
                    "I have the power to create positive change in my life.",
                    "I am capable of achieving my goals.",
                    "I choose to focus on what I can control.",
                    "I am grateful for the opportunities in my life."
                ],
                academic: [
                    "I am a capable and intelligent student.",
                    "I can learn and grow from every challenge.",
                    "My hard work and dedication will pay off.",
                    "I have the skills to succeed in my studies.",
                    "I am making progress toward my academic goals."
                ],
                confidence: [
                    "I believe in myself and my abilities.",
                    "I am confident in who I am becoming.",
                    "I trust my instincts and judgment.",
                    "I am brave enough to face new challenges.",
                    "I am proud of my accomplishments."
                ],
                motivation: [
                    "I am motivated to pursue my dreams.",
                    "Every step forward is progress worth celebrating.",
                    "I have the determination to overcome obstacles.",
                    "My future is bright and full of possibilities.",
                    "I am inspired to be my best self."
                ]
            },
            wordAssociations: {
                'STUDY': ['learn', 'books', 'knowledge', 'education', 'school', 'homework', 'research'],
                'FRIENDS': ['companionship', 'support', 'fun', 'trust', 'loyalty', 'memories', 'bond'],
                'DREAMS': ['goals', 'aspirations', 'future', 'hope', 'ambition', 'vision', 'success'],
                'NATURE': ['trees', 'fresh air', 'peace', 'beauty', 'outdoors', 'wildlife', 'serenity']
            },
            sequences: [
                { pattern: [2, 4, 6, 8], answer: 10, hint: "Add 2 each time" },
                { pattern: [1, 4, 9, 16], answer: 25, hint: "Perfect squares" },
                { pattern: [1, 1, 2, 3], answer: 5, hint: "Fibonacci sequence" },
                { pattern: [5, 10, 20, 40], answer: 80, hint: "Multiply by 2" },
                { pattern: [3, 6, 12, 24], answer: 48, hint: "Double each number" }
            ],
            wyrQuestions: {
                random: [
                    { a: "Have the ability to fly", b: "Have the ability to be invisible" },
                    { a: "Always be 10 minutes late", b: "Always be 20 minutes early" },
                    { a: "Live without music", b: "Live without movies" },
                    { a: "Have unlimited money", b: "Have unlimited time" }
                ],
                academic: [
                    { a: "Study alone in silence", b: "Study in a group with music" },
                    { a: "Take all multiple choice tests", b: "Take all essay tests" },
                    { a: "Have perfect memory", b: "Have perfect understanding" },
                    { a: "Learn everything quickly", b: "Learn everything deeply" }
                ]
            },
            truthQuestions: {
                easy: [
                    "What's your favorite study spot on campus?",
                    "What's the best advice you've ever received?",
                    "What's your favorite way to relax?",
                    "What's something you're proud of this semester?"
                ],
                medium: [
                    "What's your biggest academic challenge?",
                    "What's something you wish you could change about your study habits?",
                    "What's the most important lesson you've learned in college?",
                    "What's something that motivates you when you're feeling stressed?"
                ],
                hard: [
                    "What's your biggest fear about your future?",
                    "What's something you've never told anyone about your academic struggles?",
                    "What's the hardest decision you've had to make as a student?",
                    "What's something you regret about your college experience so far?"
                ]
            },
            dareChallenges: {
                easy: [
                    "Do 10 jumping jacks right now",
                    "Send a positive message to a friend",
                    "Take 5 deep breaths",
                    "Write down 3 things you're grateful for"
                ],
                medium: [
                    "Study for 30 minutes without any distractions",
                    "Try a new study technique for one hour",
                    "Organize your study space",
                    "Call or text someone you haven't talked to in a while"
                ],
                hard: [
                    "Study for 2 hours straight without breaks",
                    "Ask a professor for help with something you're struggling with",
                    "Join a new club or organization",
                    "Set up a study group with classmates"
                ]
            }
        };
    }

    // Memory Game Functions
    initializeMemoryGame() {
        const emojis = ['🎓', '📚', '✏️', '💡', '🎯', '⭐', '🌈', '🎨'];
        const memoryGrid = document.getElementById('memoryGrid');
        if (!memoryGrid) return;

        // Create pairs
        const gameEmojis = [...emojis, ...emojis];
        this.shuffleArray(gameEmojis);

        memoryGrid.innerHTML = '';
        gameEmojis.forEach((emoji, index) => {
            const card = document.createElement('div');
            card.className = 'memory-card';
            card.dataset.emoji = emoji;
            card.dataset.index = index;
            card.innerHTML = '<span class="card-back">?</span>';
            memoryGrid.appendChild(card);
        });

        this.memoryGame = {
            cards: Array.from(memoryGrid.children),
            flippedCards: [],
            matchedPairs: 0,
            moves: 0,
            startTime: Date.now()
        };

        this.updateMemoryStats();
    }

    handleMemoryCardClick(card) {
        if (!this.memoryGame) return;
        
        const { flippedCards, cards } = this.memoryGame;
        
        // Don't flip if already flipped or matched
        if (card.classList.contains('flipped') || card.classList.contains('matched')) {
            return;
        }

        // Don't flip more than 2 cards
        if (flippedCards.length >= 2) {
            return;
        }

        // Flip the card
        card.classList.add('flipped');
        card.innerHTML = card.dataset.emoji;
        flippedCards.push(card);

        // Check for match when 2 cards are flipped
        if (flippedCards.length === 2) {
            this.memoryGame.moves++;
            this.updateMemoryStats();
            
            if (flippedCards[0].dataset.emoji === flippedCards[1].dataset.emoji) {
                // Match found
                flippedCards.forEach(card => card.classList.add('matched'));
                this.memoryGame.matchedPairs++;
                
                if (this.memoryGame.matchedPairs === 8) {
                    this.endMemoryGame();
                }
            } else {
                // No match, flip back after delay
                setTimeout(() => {
                    flippedCards.forEach(card => {
                        card.classList.remove('flipped');
                        card.innerHTML = '<span class="card-back">?</span>';
                    });
                    this.memoryGame.flippedCards = [];
                }, 1000);
            }
        }
    }

    resetMemoryGame() {
        this.initializeMemoryGame();
    }

    giveMemoryHint() {
        if (!this.memoryGame) return;
        
        const unmatchedCards = this.memoryGame.cards.filter(card => 
            !card.classList.contains('matched')
        );
        
        if (unmatchedCards.length > 0) {
            const randomCard = unmatchedCards[Math.floor(Math.random() * unmatchedCards.length)];
            randomCard.style.backgroundColor = '#ffeb3b';
            setTimeout(() => {
                randomCard.style.backgroundColor = '';
            }, 2000);
        }
    }

    endMemoryGame() {
        const timeSpent = Math.floor((Date.now() - this.memoryGame.startTime) / 1000);
        const bestTime = this.gameStats.memoryBestTime || Infinity;
        
        if (timeSpent < bestTime) {
            this.gameStats.memoryBestTime = timeSpent;
            this.showNotification('New best time! 🎉', 'success');
        }
        
        this.showNotification(`Game completed in ${timeSpent} seconds with ${this.memoryGame.moves} moves!`, 'success');
        this.saveGameStats();
    }

    updateMemoryStats() {
        if (!this.memoryGame) return;
        
        document.getElementById('memoryMoves').textContent = this.memoryGame.moves;
        document.getElementById('memoryMatches').textContent = `${this.memoryGame.matchedPairs}/8`;
        
        const timeElapsed = Math.floor((Date.now() - this.memoryGame.startTime) / 1000);
        document.getElementById('memoryTime').textContent = this.formatTime(timeElapsed);
        
        const bestTime = this.gameStats.memoryBestTime;
        document.getElementById('memoryBestScore').textContent = bestTime ? this.formatTime(bestTime) : '--';
    }

    // Word Association Game Functions
    startNewWordGame() {
        const words = Object.keys(this.gameData.wordAssociations);
        const randomWord = words[Math.floor(Math.random() * words.length)];
        
        document.querySelector('.current-word').textContent = randomWord;
        document.getElementById('wordInput').value = '';
        document.getElementById('wordAssociations').innerHTML = '';
        
        this.currentWord = randomWord;
        this.wordGame = {
            score: 0,
            streak: 0,
            words: 0
        };
        
        this.updateWordStats();
    }

    submitWord() {
        const input = document.getElementById('wordInput');
        const word = input.value.trim().toLowerCase();
        
        if (!word || !this.currentWord) return;
        
        const associations = this.gameData.wordAssociations[this.currentWord] || [];
        const isCorrect = associations.some(assoc => assoc.toLowerCase().includes(word) || word.includes(assoc.toLowerCase()));
        
        if (isCorrect) {
            this.wordGame.score += 10;
            this.wordGame.streak++;
            this.wordGame.words++;
            this.showNotification('Great association! +10 points', 'success');
            
            // Add to associations display
            const associationsDiv = document.getElementById('wordAssociations');
            const wordElement = document.createElement('span');
            wordElement.className = 'association-word';
            wordElement.textContent = word;
            associationsDiv.appendChild(wordElement);
        } else {
            this.wordGame.streak = 0;
            this.showNotification('Try another word!', 'warning');
        }
        
        input.value = '';
        this.updateWordStats();
    }

    updateWordStats() {
        if (!this.wordGame) return;
        
        document.getElementById('wordScore').textContent = this.wordGame.score;
        document.getElementById('wordStreak').textContent = this.wordGame.streak;
        document.getElementById('wordCount').textContent = this.wordGame.words;
    }

    // Sequence Game Functions
    generateNewSequence() {
        const sequence = this.gameData.sequences[Math.floor(Math.random() * this.gameData.sequences.length)];
        
        document.querySelector('.sequence-numbers').textContent = 
            sequence.pattern.slice(0, -1).join(', ') + ', ?';
        
        this.currentSequence = sequence;
        this.generateSequenceOptions();
    }

    generateSequenceOptions() {
        const optionsDiv = document.getElementById('sequenceOptions');
        const correctAnswer = this.currentSequence.answer;
        const wrongAnswers = [
            correctAnswer + Math.floor(Math.random() * 10) + 1,
            correctAnswer - Math.floor(Math.random() * 5) - 1,
            correctAnswer + Math.floor(Math.random() * 5) + 1
        ];
        
        const allOptions = [correctAnswer, ...wrongAnswers];
        this.shuffleArray(allOptions);
        
        optionsDiv.innerHTML = '';
        allOptions.forEach(option => {
            const button = document.createElement('button');
            button.className = 'sequence-option';
            button.textContent = option;
            button.dataset.value = option;
            optionsDiv.appendChild(button);
        });
    }

    selectSequenceOption(button) {
        const selectedValue = parseInt(button.dataset.value);
        const isCorrect = selectedValue === this.currentSequence.answer;
        
        if (isCorrect) {
            button.style.backgroundColor = '#4caf50';
            this.sequenceGame = (this.sequenceGame || { score: 0, level: 1, lives: 3 });
            this.sequenceGame.score += 10;
            this.sequenceGame.level++;
            this.showNotification('Correct! +10 points', 'success');
        } else {
            button.style.backgroundColor = '#f44336';
            this.sequenceGame = (this.sequenceGame || { score: 0, level: 1, lives: 3 });
            this.sequenceGame.lives--;
            this.showNotification('Wrong answer! Try again', 'warning');
            
            if (this.sequenceGame.lives <= 0) {
                this.showNotification('Game Over!', 'error');
                this.sequenceGame = { score: 0, level: 1, lives: 3 };
            }
        }
        
        this.updateSequenceStats();
        setTimeout(() => this.generateNewSequence(), 1500);
    }

    updateSequenceStats() {
        if (!this.sequenceGame) return;
        
        document.getElementById('sequenceLevel').textContent = this.sequenceGame.level;
        document.getElementById('sequenceScore').textContent = this.sequenceGame.score;
        document.getElementById('sequenceLives').textContent = this.sequenceGame.lives;
    }

    // Gratitude Journal Functions
    saveGratitudeEntry() {
        const text = document.getElementById('gratitudeText').value.trim();
        if (!text) {
            this.showNotification('Please write something you\'re grateful for!', 'warning');
            return;
        }
        
        const entry = {
            id: Date.now(),
            text: text,
            date: new Date().toISOString(),
            prompt: this.currentGratitudePrompt || 'general'
        };
        
        this.gameStats.gratitudeEntries = this.gameStats.gratitudeEntries || [];
        this.gameStats.gratitudeEntries.push(entry);
        
        document.getElementById('gratitudeText').value = '';
        this.updateGratitudeStats();
        this.renderGratitudeEntries();
        this.saveGameStats();
        
        this.showNotification('Gratitude entry saved!', 'success');
    }

    generateRandomGratitudePrompt() {
        const prompts = [
            "What made you smile today?",
            "Who are you thankful for and why?",
            "What challenge did you overcome recently?",
            "What simple pleasure brought you joy today?",
            "What opportunity are you grateful for?",
            "What lesson did you learn this week?",
            "What comfort are you grateful for?",
            "What beauty did you notice today?"
        ];
        
        const randomPrompt = prompts[Math.floor(Math.random() * prompts.length)];
        document.getElementById('gratitudeText').placeholder = randomPrompt;
        this.currentGratitudePrompt = randomPrompt;
    }

    renderGratitudeEntries() {
        const entriesList = document.getElementById('entriesList');
        if (!entriesList) return;
        
        const entries = this.gameStats.gratitudeEntries || [];
        const recentEntries = entries.slice(-5).reverse();
        
        entriesList.innerHTML = recentEntries.map(entry => `
            <div class="gratitude-entry">
                <div class="entry-date">${new Date(entry.date).toLocaleDateString()}</div>
                <div class="entry-text">${entry.text}</div>
            </div>
        `).join('');
    }

    updateGratitudeStats() {
        const entries = this.gameStats.gratitudeEntries || [];
        document.getElementById('gratitudeEntriesCount').textContent = entries.length;
        
        // Calculate streak
        let streak = 0;
        const today = new Date();
        for (let i = 0; i < 30; i++) {
            const checkDate = new Date(today);
            checkDate.setDate(checkDate.getDate() - i);
            
            const hasEntry = entries.some(entry => {
                const entryDate = new Date(entry.date);
                return entryDate.toDateString() === checkDate.toDateString();
            });
            
            if (hasEntry) {
                streak++;
            } else {
                break;
            }
        }
        
        document.getElementById('gratitudeStreak').textContent = streak;
        
        // This week count
        const weekAgo = new Date();
        weekAgo.setDate(weekAgo.getDate() - 7);
        const thisWeekCount = entries.filter(entry => new Date(entry.date) >= weekAgo).length;
        document.getElementById('gratitudeThisWeek').textContent = thisWeekCount;
    }

    // Affirmations Functions
    getRandomAffirmation() {
        const category = this.currentAffirmationCategory || 'general';
        const affirmations = this.gameData.affirmations[category] || this.gameData.affirmations.general;
        const randomAffirmation = affirmations[Math.floor(Math.random() * affirmations.length)];
        
        document.getElementById('affirmationDisplay').innerHTML = `
            <div class="affirmation-text">"${randomAffirmation}"</div>
        `;
        
        this.currentAffirmation = randomAffirmation;
        this.updateAffirmationStats();
    }

    changeAffirmationCategory(category) {
        document.querySelectorAll('.affirmation-categories .category-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        document.querySelector(`[data-category="${category}"]`).classList.add('active');
        
        this.currentAffirmationCategory = category;
    }

    favoriteAffirmation() {
        if (!this.currentAffirmation) {
            this.showNotification('Get an affirmation first!', 'warning');
            return;
        }
        
        this.gameStats.favoriteAffirmations = this.gameStats.favoriteAffirmations || [];
        if (!this.gameStats.favoriteAffirmations.includes(this.currentAffirmation)) {
            this.gameStats.favoriteAffirmations.push(this.currentAffirmation);
            this.showNotification('Added to favorites!', 'success');
            this.updateAffirmationStats();
            this.saveGameStats();
        } else {
            this.showNotification('Already in favorites!', 'info');
        }
    }

    updateAffirmationStats() {
        const today = new Date().toDateString();
        const todayAffirmations = this.gameStats.todayAffirmations || [];
        
        if (!todayAffirmations.includes(today)) {
            todayAffirmations.push(today);
            this.gameStats.todayAffirmations = todayAffirmations;
        }
        
        document.getElementById('affirmationDaily').textContent = todayAffirmations.length;
        document.getElementById('affirmationFavorites').textContent = (this.gameStats.favoriteAffirmations || []).length;
        
        // Calculate streak
        let streak = 0;
        const todayDate = new Date();
        for (let i = 0; i < 30; i++) {
            const checkDate = new Date(todayDate);
            checkDate.setDate(checkDate.getDate() - i);
            
            if (todayAffirmations.includes(checkDate.toDateString())) {
                streak++;
            } else {
                break;
            }
        }
        
        document.getElementById('affirmationStreak').textContent = streak;
    }

    // Breathing Exercise Functions
    startBreathingExercise() {
        const preset = this.currentBreathingPreset || '4-4-4';
        this.startBreathingCycle(preset);
    }

    startBreathingCycle(preset) {
        const presets = {
            '4-4-4': { inhale: 4, hold: 4, exhale: 4 },
            '4-7-8': { inhale: 4, hold: 7, exhale: 8 },
            'box': { inhale: 4, hold: 4, exhale: 4, pause: 4 },
            'custom': { inhale: 6, hold: 2, exhale: 6 }
        };
        
        const cycle = presets[preset];
        this.currentBreathingCycle = cycle;
        this.isBreathing = true;
        
        document.getElementById('startBreathing').style.display = 'none';
        document.getElementById('stopBreathing').style.display = 'inline-block';
        
        this.runBreathingCycle();
    }

    runBreathingCycle() {
        if (!this.isBreathing) return;
        
        const cycle = this.currentBreathingCycle;
        const circle = document.getElementById('breathingCircle');
        const text = document.getElementById('breathingText');
        const instruction = document.getElementById('breathingInstruction');
        
        // Inhale
        text.textContent = 'Breathe In';
        instruction.textContent = `Inhale for ${cycle.inhale} seconds`;
        circle.style.transform = 'scale(1.2)';
        
        setTimeout(() => {
            if (!this.isBreathing) return;
            
            // Hold
            text.textContent = 'Hold';
            instruction.textContent = `Hold for ${cycle.hold} seconds`;
            
            setTimeout(() => {
                if (!this.isBreathing) return;
                
                // Exhale
                text.textContent = 'Breathe Out';
                instruction.textContent = `Exhale for ${cycle.exhale} seconds`;
                circle.style.transform = 'scale(1)';
                
                setTimeout(() => {
                    if (this.isBreathing) {
                        this.runBreathingCycle();
                    }
                }, cycle.exhale * 1000);
            }, cycle.hold * 1000);
        }, cycle.inhale * 1000);
    }

    stopBreathingExercise() {
        this.isBreathing = false;
        document.getElementById('startBreathing').style.display = 'inline-block';
        document.getElementById('stopBreathing').style.display = 'none';
        
        const circle = document.getElementById('breathingCircle');
        const text = document.getElementById('breathingText');
        const instruction = document.getElementById('breathingInstruction');
        
        circle.style.transform = 'scale(1)';
        text.textContent = 'Get Ready';
        instruction.textContent = 'Click Start to begin';
        
        this.updateBreathingStats();
    }

    selectBreathingPreset(preset) {
        document.querySelectorAll('.preset-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        document.querySelector(`[data-preset="${preset}"]`).classList.add('active');
        
        this.currentBreathingPreset = preset;
    }

    updateBreathingStats() {
        this.gameStats.breathingSessions = (this.gameStats.breathingSessions || 0) + 1;
        this.gameStats.breathingTotalTime = (this.gameStats.breathingTotalTime || 0) + 1;
        
        document.getElementById('breathingSessions').textContent = this.gameStats.breathingSessions;
        document.getElementById('breathingTotalTime').textContent = `${this.gameStats.breathingTotalTime}m`;
        
        this.saveGameStats();
    }

    // Canvas Functions
    setupCanvasEvents() {
        const canvas = document.getElementById('artCanvas');
        if (!canvas) return;
        
        const ctx = canvas.getContext('2d');
        let isDrawing = false;
        let currentTool = 'brush';
        
        canvas.addEventListener('mousedown', (e) => {
            isDrawing = true;
            ctx.beginPath();
            ctx.moveTo(e.offsetX, e.offsetY);
        });
        
        canvas.addEventListener('mousemove', (e) => {
            if (!isDrawing) return;
            
            ctx.lineTo(e.offsetX, e.offsetY);
            ctx.stroke();
        });
        
        canvas.addEventListener('mouseup', () => {
            isDrawing = false;
        });
        
        // Brush size slider
        const brushSlider = document.getElementById('brushSizeSlider');
        if (brushSlider) {
            brushSlider.addEventListener('input', (e) => {
                ctx.lineWidth = e.target.value;
                document.getElementById('brushSize').textContent = e.target.value;
            });
        }
        
        // Color picker
        const colorPicker = document.getElementById('colorPicker');
        if (colorPicker) {
            colorPicker.addEventListener('change', (e) => {
                ctx.strokeStyle = e.target.value;
            });
        }
    }

    clearCanvas() {
        const canvas = document.getElementById('artCanvas');
        if (canvas) {
            const ctx = canvas.getContext('2d');
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            this.showNotification('Canvas cleared!', 'info');
        }
    }

    saveCanvas() {
        const canvas = document.getElementById('artCanvas');
        if (canvas) {
            const dataURL = canvas.toDataURL();
            this.gameStats.canvasArt = this.gameStats.canvasArt || [];
            this.gameStats.canvasArt.push({
                id: Date.now(),
                data: dataURL,
                date: new Date().toISOString()
            });
            this.saveGameStats();
            this.showNotification('Art saved!', 'success');
        }
    }

    downloadCanvas() {
        const canvas = document.getElementById('artCanvas');
        if (canvas) {
            const link = document.createElement('a');
            link.download = `artwork-${Date.now()}.png`;
            link.href = canvas.toDataURL();
            link.click();
            this.showNotification('Artwork downloaded!', 'success');
        }
    }

    // Utility Functions
    shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
    }

    formatTime(seconds) {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
    }

    saveGameStats() {
        localStorage.setItem('gameStats', JSON.stringify(this.gameStats));
    }

    loadGameStats() {
        this.gameStats = JSON.parse(localStorage.getItem('gameStats')) || {};
        this.updateAllStats();
    }

    updateAllStats() {
        this.updateGratitudeStats();
        this.updateAffirmationStats();
        this.renderGratitudeEntries();
    }

    initializeGames() {
        // Initialize games when their categories are shown
        if (document.getElementById('cognitive-category').classList.contains('active')) {
            this.initializeMemoryGame();
            this.startNewWordGame();
            this.generateNewSequence();
        }
    }

    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `game-notification ${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <span>${message}</span>
                <button class="close-notification">&times;</button>
            </div>
        `;
        
        notification.addEventListener('click', (e) => {
            if (e.target.classList.contains('close-notification')) {
                notification.remove();
            }
        });
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            if (notification.parentNode) {
                notification.remove();
            }
        }, 3000);
    }
}

// Initialize enhanced games system when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.enhancedGamesSystem = new EnhancedGamesSystem();
});
