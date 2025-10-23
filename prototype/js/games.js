// Mind Games System - Embedded Version
class MindGames {
    constructor() {
        this.init();
    }
    
    init() {
        // Initialize all games directly on page load
        this.initMemoryGame();
        this.initRockPaperScissors();
        this.initGratitudeJournal();
        this.initAffirmationWheel();
        this.initBreathingExercise();
    }
    
    initMemoryGame() {
        const grid = AppUtils.$('#memoryGrid');
        if (!grid) return;
        
        const startGame = () => {
            grid.innerHTML = '';
            const emojis = ['🌟', '🎯', '🎨', '🎭', '🎪', '🎸', '🎮', '🎲'];
            const cards = [...emojis, ...emojis].sort(() => Math.random() - 0.5);
            
            let gameState = { flippedCards: [], matchedPairs: 0, moves: 0, startTime: Date.now(), timerInterval: null };
            
            cards.forEach((emoji, index) => {
                const card = AppUtils.createElement('div', 'memory-card', `
                    <div class="card-inner">
                        <div class="card-front">?</div>
                        <div class="card-back">${emoji}</div>
                    </div>
                `);
                card.dataset.emoji = emoji;
                card.dataset.index = index;
                
                AppUtils.on(card, 'click', () => this.handleCardClick(card, gameState));
                grid.appendChild(card);
            });
            
            this.startMemoryTimer(gameState);
            this.setupResetButton(gameState, startGame);
        };
        
        startGame();
    }
    
    handleCardClick(card, gameState) {
        if (gameState.flippedCards.length >= 2 || card.classList.contains('flipped') || card.classList.contains('matched')) return;
        
        card.classList.add('flipped');
        gameState.flippedCards.push(card);
        
        if (gameState.flippedCards.length === 2) {
            gameState.moves++;
            AppUtils.$('#memoryMoves').textContent = gameState.moves;
            
            const [card1, card2] = gameState.flippedCards;
            if (card1.dataset.emoji === card2.dataset.emoji) {
                card1.classList.add('matched');
                card2.classList.add('matched');
                gameState.matchedPairs++;
                AppUtils.$('#memoryMatches').textContent = `${gameState.matchedPairs}/8`;
                gameState.flippedCards = [];
                
                if (gameState.matchedPairs === 8) {
                    clearInterval(gameState.timerInterval);
                    setTimeout(() => AppUtils.showNotification(`🎉 Congratulations! You won in ${gameState.moves} moves!`, 'success'), 500);
                }
            } else {
                setTimeout(() => {
                    card1.classList.remove('flipped');
                    card2.classList.remove('flipped');
                    gameState.flippedCards = [];
                }, 1000);
            }
        }
    }
    
    startMemoryTimer(gameState) {
        gameState.timerInterval = setInterval(() => {
            const elapsed = Math.floor((Date.now() - gameState.startTime) / 1000);
            const minutes = Math.floor(elapsed / 60);
            const seconds = elapsed % 60;
            const timeEl = AppUtils.$('#memoryTime');
            if (timeEl) timeEl.textContent = `${minutes}:${seconds.toString().padStart(2, '0')}`;
        }, 1000);
    }
    
    setupResetButton(gameState, startGame) {
        const resetBtn = AppUtils.$('#resetMemory');
        if (resetBtn) {
            AppUtils.on(resetBtn, 'click', () => {
                clearInterval(gameState.timerInterval);
                AppUtils.$('#memoryMoves').textContent = '0';
                AppUtils.$('#memoryMatches').textContent = '0/8';
                AppUtils.$('#memoryTime').textContent = '0:00';
                startGame();
            });
        }
    }
    
    initRockPaperScissors() {
        const container = document.getElementById('rockPaperScissorsContainer');
        if (!container) return;
        
        // Game state
        let gameMode = 'computer'; // 'computer' or 'multiplayer'
        let playerScore = 0;
        let computerScore = 0;
        let player2Score = 0;
        let round = 1;
        let maxRounds = 5;
        let isGameActive = false;
        let playerChoice = null;
        let computerChoice = null;
        let player2Choice = null;
        let waitingForPlayer2 = false;
        let gameResult = null;
        
        // Multiplayer state
        let multiplayerRequests = [];
        let currentOpponent = null;
        let playerId = Math.random().toString(36).substr(2, 9);
        let isWaitingForResponse = false;
        
        // Game elements
        const choices = ['rock', 'paper', 'scissors'];
        const choiceIcons = {
            rock: '🪨',
            paper: '📄', 
            scissors: '✂️'
        };
        
        const initializeGame = () => {
            updateScoreDisplay();
            updateGameStatus('Choose your game mode to start playing!');
            resetChoices();
        };
        
        const updateScoreDisplay = () => {
            const playerScoreEl = document.getElementById('playerScore');
            const computerScoreEl = document.getElementById('computerScore');
            const player2ScoreEl = document.getElementById('player2Score');
            const roundEl = document.getElementById('currentRound');
            
            if (playerScoreEl) playerScoreEl.textContent = playerScore;
            if (computerScoreEl) computerScoreEl.textContent = computerScore;
            if (player2ScoreEl) player2ScoreEl.textContent = player2Score;
            if (roundEl) roundEl.textContent = `${round}/${maxRounds}`;
        };
        
        const updateGameStatus = (message, type = 'info') => {
            const statusEl = document.getElementById('rpsStatus');
            if (statusEl) {
                statusEl.innerHTML = message;
                statusEl.className = `rps-status ${type}`;
            }
        };
        
        const resetChoices = () => {
            playerChoice = null;
            computerChoice = null;
            player2Choice = null;
            
            // Reset choice displays
            const playerChoiceEl = document.getElementById('playerChoice');
            const computerChoiceEl = document.getElementById('computerChoice');
            const player2ChoiceEl = document.getElementById('player2Choice');
            
            if (playerChoiceEl) playerChoiceEl.innerHTML = '<div class="choice-placeholder">?</div>';
            if (computerChoiceEl) computerChoiceEl.innerHTML = '<div class="choice-placeholder">?</div>';
            if (player2ChoiceEl) player2ChoiceEl.innerHTML = '<div class="choice-placeholder">?</div>';
            
            // Reset choice buttons
            document.querySelectorAll('.choice-btn').forEach(btn => {
                btn.disabled = false;
                btn.classList.remove('selected');
            });
        };
        
        const makeChoice = (choice) => {
            if (!isGameActive || playerChoice) return;
            
            playerChoice = choice;
            
            // Update player choice display
            const playerChoiceEl = document.getElementById('playerChoice');
            if (playerChoiceEl) {
                playerChoiceEl.innerHTML = `<div class="choice-display ${choice}">${choiceIcons[choice]}</div>`;
            }
            
            // Disable choice buttons
            document.querySelectorAll('.choice-btn').forEach(btn => {
                btn.disabled = true;
                if (btn.dataset.choice === choice) {
                    btn.classList.add('selected');
                }
            });
            
            if (gameMode === 'computer') {
                playAgainstComputer();
            } else {
                sendChoiceToPlayer2(choice);
            }
        };
        
        const playAgainstComputer = () => {
            // Computer makes random choice
            computerChoice = choices[Math.floor(Math.random() * choices.length)];
            
            // Update computer choice display
            const computerChoiceEl = document.getElementById('computerChoice');
            if (computerChoiceEl) {
                computerChoiceEl.innerHTML = `<div class="choice-display ${computerChoice}">${choiceIcons[computerChoice]}</div>`;
            }
            
            // Determine winner
            setTimeout(() => {
                const result = determineWinner(playerChoice, computerChoice);
                handleGameResult(result, 'computer');
            }, 1000);
        };
        
        const sendChoiceToPlayer2 = (choice) => {
            // In a real implementation, this would send to a server
            // For now, we'll simulate the multiplayer experience
            updateGameStatus('Waiting for opponent to make their choice...', 'waiting');
            
            // Simulate player 2 making a choice after a delay
            setTimeout(() => {
                player2Choice = choices[Math.floor(Math.random() * choices.length)];
                
                const player2ChoiceEl = document.getElementById('player2Choice');
                if (player2ChoiceEl) {
                    player2ChoiceEl.innerHTML = `<div class="choice-display ${player2Choice}">${choiceIcons[player2Choice]}</div>`;
                }
                
                const result = determineWinner(playerChoice, player2Choice);
                handleGameResult(result, 'player2');
            }, 2000);
        };
        
        const determineWinner = (choice1, choice2) => {
            if (choice1 === choice2) {
                return 'tie';
            }
            
            const winConditions = {
                rock: 'scissors',
                paper: 'rock',
                scissors: 'paper'
            };
            
            return winConditions[choice1] === choice2 ? 'player1' : 'player2';
        };
        
        const handleGameResult = (result, opponent) => {
            gameResult = result;
            
            let message = '';
            let statusType = 'info';
            
            if (result === 'tie') {
                message = "It's a tie! 🤝";
                statusType = 'tie';
            } else if ((result === 'player1' && opponent === 'computer') || 
                      (result === 'player1' && opponent === 'player2')) {
                playerScore++;
                message = `You win! 🎉`;
                statusType = 'win';
            } else {
                if (opponent === 'computer') {
                    computerScore++;
                    message = `Computer wins! 🤖`;
                } else {
                    player2Score++;
                    message = `Opponent wins! 👤`;
                }
                statusType = 'lose';
            }
            
            updateGameStatus(message, statusType);
            updateScoreDisplay();
            
            // Check if game is over
            setTimeout(() => {
                round++;
                if (round > maxRounds) {
                    endGame();
                } else {
                    nextRound();
                }
            }, 2000);
        };
        
        const nextRound = () => {
            updateGameStatus(`Round ${round} - Make your choice!`);
            resetChoices();
        };
        
        const endGame = () => {
            isGameActive = false;
            
            let finalMessage = '';
            let finalType = 'info';
            
            if (playerScore > (gameMode === 'computer' ? computerScore : player2Score)) {
                finalMessage = `🎉 You won the game! Final score: ${playerScore}-${gameMode === 'computer' ? computerScore : player2Score}`;
                finalType = 'win';
            } else if (playerScore < (gameMode === 'computer' ? computerScore : player2Score)) {
                finalMessage = `😔 You lost the game. Final score: ${playerScore}-${gameMode === 'computer' ? computerScore : player2Score}`;
                finalType = 'lose';
            } else {
                finalMessage = `🤝 It's a tie! Final score: ${playerScore}-${gameMode === 'computer' ? computerScore : player2Score}`;
                finalType = 'tie';
            }
            
            updateGameStatus(finalMessage, finalType);
            
            // Disable choice buttons
            document.querySelectorAll('.choice-btn').forEach(btn => {
                btn.disabled = true;
            });
        };
        
        const startGame = (mode) => {
            gameMode = mode;
            isGameActive = true;
            playerScore = 0;
            computerScore = 0;
            player2Score = 0;
            round = 1;
            
            updateScoreDisplay();
            updateGameStatus(`Round 1 - Choose rock, paper, or scissors!`);
            resetChoices();
            
            // Enable choice buttons
            document.querySelectorAll('.choice-btn').forEach(btn => {
                btn.disabled = false;
            });
            
            // Show/hide appropriate score displays
            const computerScoreEl = document.getElementById('computerScore');
            const player2ScoreEl = document.getElementById('player2Score');
            
            if (mode === 'computer') {
                if (computerScoreEl) computerScoreEl.parentElement.style.display = 'block';
                if (player2ScoreEl) player2ScoreEl.parentElement.style.display = 'none';
            } else {
                if (computerScoreEl) computerScoreEl.parentElement.style.display = 'none';
                if (player2ScoreEl) player2ScoreEl.parentElement.style.display = 'block';
            }
        };
        
        const resetGame = () => {
            isGameActive = false;
            playerScore = 0;
            computerScore = 0;
            player2Score = 0;
            round = 1;
            currentOpponent = null;
            isWaitingForResponse = false;
            
            updateScoreDisplay();
            updateGameStatus('Choose your game mode to start playing!');
            resetChoices();
            
            // Disable choice buttons
            document.querySelectorAll('.choice-btn').forEach(btn => {
                btn.disabled = true;
            });
        };
        
        // Multiplayer functionality
        const sendGameRequest = (opponentId) => {
            if (isWaitingForResponse) {
                updateGameStatus('Already waiting for a response!', 'error');
                return;
            }
            
            isWaitingForResponse = true;
            updateGameStatus(`Sending game request to ${opponentId}...`, 'waiting');
            
            // In a real implementation, this would send to a server
            // For demo purposes, we'll simulate the response
            setTimeout(() => {
                const accepted = Math.random() > 0.3; // 70% chance of acceptance
                
                if (accepted) {
                    currentOpponent = opponentId;
                    updateGameStatus(`Request accepted by ${opponentId}! Starting game...`, 'success');
                    setTimeout(() => {
                        startGame('multiplayer');
                    }, 1000);
                } else {
                    updateGameStatus(`Request declined by ${opponentId}`, 'error');
                }
                
                isWaitingForResponse = false;
            }, 3000);
        };
        
        const acceptGameRequest = (requestId) => {
            // Accept the request and start multiplayer game
            currentOpponent = requestId;
            startGame('multiplayer');
        };
        
        const declineGameRequest = (requestId) => {
            // Decline the request
            updateGameStatus(`Request from ${requestId} declined`, 'info');
        };
        
        // Event listeners
        document.querySelectorAll('.choice-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                makeChoice(btn.dataset.choice);
            });
        });
        
        const startComputerBtn = document.getElementById('startComputerGame');
        if (startComputerBtn) {
            startComputerBtn.addEventListener('click', () => startGame('computer'));
        }
        
        const startMultiplayerBtn = document.getElementById('startMultiplayerGame');
        if (startMultiplayerBtn) {
            startMultiplayerBtn.addEventListener('click', () => {
                const opponentId = prompt('Enter opponent ID to send game request:');
                if (opponentId) {
                    sendGameRequest(opponentId);
                }
            });
        }
        
        const resetBtn = document.getElementById('resetRPS');
        if (resetBtn) {
            resetBtn.addEventListener('click', resetGame);
        }
        
        // Simulate incoming game requests (for demo)
        const simulateIncomingRequest = () => {
            const randomOpponent = 'Player' + Math.floor(Math.random() * 1000);
            const accept = confirm(`${randomOpponent} wants to play Rock Paper Scissors with you. Accept?`);
            
            if (accept) {
                acceptGameRequest(randomOpponent);
            } else {
                declineGameRequest(randomOpponent);
            }
        };
        
        // Add a button to simulate incoming requests for demo purposes
        const simulateRequestBtn = document.getElementById('simulateRequest');
        if (simulateRequestBtn) {
            simulateRequestBtn.addEventListener('click', simulateIncomingRequest);
        }
        
        // Initialize the game
        initializeGame();
    }
    
    initPatternCompletion() {
        const container = document.getElementById('patternCompletionContainer');
        if (!container) return;
        
        let currentLevel = 1;
        let score = 0;
        let currentPattern = null;
        let correctAnswer = null;
        let timeLeft = 30;
        let timerInterval = null;
        let isGameActive = false;
        
        const shapes = ['●', '▲', '■', '◆', '★', '♦', '♠', '♥'];
        const colors = ['#ff4757', '#2ed573', '#1e90ff', '#ffa502', '#ff6348', '#5352ed', '#ff3838', '#70a1ff'];
        
        const generatePattern = () => {
            const patterns = [
                // Shape rotation patterns
                {
                    type: 'rotation',
                    sequence: ['●', '▲', '■', '◆'],
                    answer: '★',
                    explanation: 'Shapes rotate through 4 positions'
                },
                // Color progression patterns
                {
                    type: 'color',
                    sequence: ['red', 'blue', 'green', 'orange'],
                    answer: 'purple',
                    explanation: 'Colors follow rainbow order'
                },
                // Size patterns
                {
                    type: 'size',
                    sequence: ['small', 'medium', 'large', 'small'],
                    answer: 'medium',
                    explanation: 'Size cycles: small → medium → large → repeat'
                },
                // Alternating patterns
                {
                    type: 'alternating',
                    sequence: ['circle', 'square', 'circle', 'square'],
                    answer: 'circle',
                    explanation: 'Alternates between circle and square'
                },
                // Progressive patterns
                {
                    type: 'progressive',
                    sequence: ['1', '2', '4', '8'],
                    answer: '16',
                    explanation: 'Numbers double each time'
                }
            ];
            
            // Select pattern based on level
            let patternIndex;
            if (currentLevel <= 2) {
                patternIndex = Math.floor(Math.random() * 3); // Simple patterns
            } else if (currentLevel <= 5) {
                patternIndex = Math.floor(Math.random() * 4); // Include alternating
            } else {
                patternIndex = Math.floor(Math.random() * patterns.length); // All patterns
            }
            
            return patterns[patternIndex];
        };
        
        const createPatternDisplay = (pattern) => {
            const sequenceContainer = document.getElementById('patternSequence');
            if (!sequenceContainer) return;
            
            sequenceContainer.innerHTML = '';
            
            // Display the sequence with missing last element
            pattern.sequence.forEach((item, index) => {
                const itemEl = document.createElement('div');
                itemEl.className = 'pattern-item';
                
                if (pattern.type === 'rotation' || pattern.type === 'alternating') {
                    itemEl.innerHTML = `<div class="shape-display">${item}</div>`;
                } else if (pattern.type === 'color') {
                    const colorMap = {
                        'red': '#ff4757',
                        'blue': '#1e90ff', 
                        'green': '#2ed573',
                        'orange': '#ffa502',
                        'purple': '#5352ed'
                    };
                    itemEl.innerHTML = `<div class="color-display" style="background-color: ${colorMap[item]}"></div>`;
                } else if (pattern.type === 'size') {
                    const sizeMap = {
                        'small': '20px',
                        'medium': '30px',
                        'large': '40px'
                    };
                    itemEl.innerHTML = `<div class="size-display" style="width: ${sizeMap[item]}; height: ${sizeMap[item]}; background-color: #6366f1;"></div>`;
                } else {
                    itemEl.innerHTML = `<div class="number-display">${item}</div>`;
                }
                
                sequenceContainer.appendChild(itemEl);
            });
            
            // Add question mark for missing element
            const questionEl = document.createElement('div');
            questionEl.className = 'pattern-item question-mark';
            questionEl.innerHTML = '<div class="question-display">?</div>';
            sequenceContainer.appendChild(questionEl);
        };
        
        const createAnswerOptions = (pattern) => {
            const optionsContainer = document.getElementById('answerOptions');
            if (!optionsContainer) return;
            
            optionsContainer.innerHTML = '';
            
            // Generate wrong answers
            const wrongAnswers = generateWrongAnswers(pattern);
            const allAnswers = [pattern.answer, ...wrongAnswers].sort(() => Math.random() - 0.5);
            
            allAnswers.forEach((answer, index) => {
                const optionEl = document.createElement('div');
                optionEl.className = 'answer-option';
                optionEl.dataset.answer = answer;
                
                if (pattern.type === 'rotation' || pattern.type === 'alternating') {
                    optionEl.innerHTML = `<div class="shape-display">${answer}</div>`;
                } else if (pattern.type === 'color') {
                    const colorMap = {
                        'red': '#ff4757',
                        'blue': '#1e90ff',
                        'green': '#2ed573', 
                        'orange': '#ffa502',
                        'purple': '#5352ed'
                    };
                    optionEl.innerHTML = `<div class="color-display" style="background-color: ${colorMap[answer]}"></div>`;
                } else if (pattern.type === 'size') {
                    const sizeMap = {
                        'small': '20px',
                        'medium': '30px',
                        'large': '40px'
                    };
                    optionEl.innerHTML = `<div class="size-display" style="width: ${sizeMap[answer]}; height: ${sizeMap[answer]}; background-color: #6366f1;"></div>`;
                } else {
                    optionEl.innerHTML = `<div class="number-display">${answer}</div>`;
                }
                
                optionEl.addEventListener('click', () => checkAnswer(answer, pattern));
                optionsContainer.appendChild(optionEl);
            });
        };
        
        const generateWrongAnswers = (pattern) => {
            if (pattern.type === 'rotation' || pattern.type === 'alternating') {
                return shapes.filter(s => s !== pattern.answer).slice(0, 3);
            } else if (pattern.type === 'color') {
                const colors = ['red', 'blue', 'green', 'orange', 'purple'];
                return colors.filter(c => c !== pattern.answer).slice(0, 3);
            } else if (pattern.type === 'size') {
                const sizes = ['small', 'medium', 'large'];
                return sizes.filter(s => s !== pattern.answer).slice(0, 3);
            } else {
                // For numbers, generate nearby numbers
                const num = parseInt(pattern.answer);
                return [
                    (num + 2).toString(),
                    (num - 1).toString(), 
                    (num + 5).toString()
                ];
            }
        };
        
        const checkAnswer = (selectedAnswer, pattern) => {
            if (!isGameActive) return;
            
            const isCorrect = selectedAnswer === pattern.answer;
            const statusEl = document.getElementById('patternStatus');
            
            if (isCorrect) {
                score += currentLevel * 10;
                currentLevel++;
                timeLeft = Math.max(15, 30 - currentLevel * 2); // Decrease time as level increases
                
                if (statusEl) {
                    statusEl.innerHTML = '🎉 Correct! Well done!';
                    statusEl.className = 'pattern-status success';
                }
                
                document.getElementById('patternLevel').textContent = currentLevel;
                document.getElementById('patternScore').textContent = score;
                
                setTimeout(() => {
                    startNewPattern();
                }, 1500);
            } else {
                if (statusEl) {
                    statusEl.innerHTML = `❌ Incorrect! The answer was: ${pattern.answer}<br><small>${pattern.explanation}</small>`;
                    statusEl.className = 'pattern-status error';
                }
                
                setTimeout(() => {
                    if (isGameActive) {
                        startNewPattern();
                    }
                }, 2000);
            }
        };
        
        const startNewPattern = () => {
            if (!isGameActive) return;
            
            currentPattern = generatePattern();
            correctAnswer = currentPattern.answer;
            
            createPatternDisplay(currentPattern);
            createAnswerOptions(currentPattern);
            
            const statusEl = document.getElementById('patternStatus');
            if (statusEl) {
                statusEl.innerHTML = 'Find the missing pattern element!';
                statusEl.className = 'pattern-status';
            }
            
            // Reset timer
            timeLeft = Math.max(15, 30 - currentLevel * 2);
            updateTimer();
        };
        
        const updateTimer = () => {
            const timerEl = document.getElementById('patternTimer');
            if (timerEl) {
                timerEl.textContent = timeLeft;
                
                if (timeLeft <= 5) {
                    timerEl.className = 'timer warning';
                } else {
                    timerEl.className = 'timer';
                }
            }
        };
        
        const startTimer = () => {
            timerInterval = setInterval(() => {
                timeLeft--;
                updateTimer();
                
                if (timeLeft <= 0) {
                    clearInterval(timerInterval);
                    const statusEl = document.getElementById('patternStatus');
                    if (statusEl) {
                        statusEl.innerHTML = '⏰ Time\'s up! Moving to next pattern...';
                        statusEl.className = 'pattern-status warning';
                    }
                    
                    setTimeout(() => {
                        if (isGameActive) {
                            startNewPattern();
                        }
                    }, 1000);
                }
            }, 1000);
        };
        
        const startGame = () => {
            isGameActive = true;
            currentLevel = 1;
            score = 0;
            timeLeft = 30;
            
            document.getElementById('patternLevel').textContent = currentLevel;
            document.getElementById('patternScore').textContent = score;
            
            startNewPattern();
            startTimer();
        };
        
        const stopGame = () => {
            isGameActive = false;
            clearInterval(timerInterval);
            
            const statusEl = document.getElementById('patternStatus');
            if (statusEl) {
                statusEl.innerHTML = `Game Over! Final Score: ${score} (Level ${currentLevel})`;
                statusEl.className = 'pattern-status';
            }
        };
        
        const resetGame = () => {
            isGameActive = false;
            clearInterval(timerInterval);
            currentLevel = 1;
            score = 0;
            timeLeft = 30;
            
            document.getElementById('patternLevel').textContent = currentLevel;
            document.getElementById('patternScore').textContent = score;
            document.getElementById('patternTimer').textContent = timeLeft;
            document.getElementById('patternTimer').className = 'timer';
            
            const statusEl = document.getElementById('patternStatus');
            if (statusEl) {
                statusEl.innerHTML = 'Ready to test your pattern recognition skills!';
                statusEl.className = 'pattern-status';
            }
            
            const sequenceEl = document.getElementById('patternSequence');
            if (sequenceEl) sequenceEl.innerHTML = '';
            
            const optionsEl = document.getElementById('answerOptions');
            if (optionsEl) optionsEl.innerHTML = '';
        };
        
        // Event listeners
        const startBtn = document.getElementById('startPatternCompletion');
        if (startBtn) {
            startBtn.addEventListener('click', startGame);
        }
        
        const stopBtn = document.getElementById('stopPatternCompletion');
        if (stopBtn) {
            stopBtn.addEventListener('click', stopGame);
        }
        
        const resetBtn = document.getElementById('resetPatternCompletion');
        if (resetBtn) {
            resetBtn.addEventListener('click', resetGame);
        }
        
        // Initialize
        resetGame();
    }
    
    initGratitudeJournal() {
        this.loadGratitudeEntries();
        
        const saveBtn = document.getElementById('saveGratitude');
        if (saveBtn) {
            saveBtn.addEventListener('click', () => {
                const text = document.getElementById('gratitudeText').value.trim();
                if (text) {
                    const entries = JSON.parse(localStorage.getItem('gratitudeEntries') || '[]');
                    entries.unshift({
                        text,
                        date: new Date().toLocaleDateString()
                    });
                    localStorage.setItem('gratitudeEntries', JSON.stringify(entries.slice(0, 10)));
                    document.getElementById('gratitudeText').value = '';
                    this.loadGratitudeEntries();
                    alert('✨ Your gratitude has been saved!');
                }
            });
        }
    }
    
    loadGratitudeEntries() {
        const entries = JSON.parse(localStorage.getItem('gratitudeEntries') || '[]');
        const list = document.getElementById('entriesList');
        
        if (list) {
            if (entries.length === 0) {
                list.innerHTML = '<p class="no-entries">No entries yet. Start writing!</p>';
            } else {
                list.innerHTML = entries.map(entry => `
                    <div class="gratitude-entry">
                        <p class="entry-date">${entry.date}</p>
                        <p class="entry-text">${entry.text}</p>
                    </div>
                `).join('');
            }
        }
    }
    
    initAffirmationWheel() {
        const affirmations = [
            "You are capable of amazing things! 🌟",
            "Your potential is limitless! 🚀",
            "You deserve happiness and success! 💫",
            "You are stronger than you think! 💪",
            "Today is full of possibilities! 🌈",
            "You are making progress every day! 📈",
            "Your efforts will pay off! 🎯",
            "You are worthy of love and respect! ❤️",
            "You have the power to create change! ⚡",
            "Your best days are ahead of you! 🌅",
            "You are enough, just as you are! ✨",
            "You bring value to the world! 🌍",
            "Your journey is unique and beautiful! 🦋",
            "You are resilient and brave! 🦁",
            "Great things are coming your way! 🎁"
        ];
        
        const spinBtn = document.getElementById('spinBtn');
        if (spinBtn) {
            spinBtn.addEventListener('click', () => {
                const wheel = document.getElementById('affirmationWheel');
                const display = document.getElementById('affirmationDisplay');
                
                spinBtn.disabled = true;
                wheel.classList.add('spinning');
                
                setTimeout(() => {
                    wheel.classList.remove('spinning');
                    const randomAffirmation = affirmations[Math.floor(Math.random() * affirmations.length)];
                    display.innerHTML = `<p class="affirmation-text">${randomAffirmation}</p>`;
                    spinBtn.disabled = false;
                }, 2000);
            });
        }
    }
    
    initBreathingExercise() {
        let breathingInterval;
        let durationInterval;
        let duration = 0;
        
        const startBtn = document.getElementById('startBreathing');
        const stopBtn = document.getElementById('stopBreathing');
        
        if (startBtn) {
            startBtn.addEventListener('click', () => {
                const circle = document.getElementById('breathingCircle');
                const text = document.getElementById('breathingText');
                duration = 0;
                
                const breathingCycle = () => {
                    // Breathe in (4 seconds)
                    text.textContent = 'Breathe In';
                    circle.classList.add('expand');
                    
                    setTimeout(() => {
                        // Hold (4 seconds)
                        text.textContent = 'Hold';
                        
                        setTimeout(() => {
                            // Breathe out (4 seconds)
                            text.textContent = 'Breathe Out';
                            circle.classList.remove('expand');
                            
                            setTimeout(() => {
                                // Hold (4 seconds)
                                text.textContent = 'Hold';
                            }, 4000);
                        }, 4000);
                    }, 4000);
                };
                
                breathingCycle();
                breathingInterval = setInterval(breathingCycle, 16000);
                
                durationInterval = setInterval(() => {
                    duration++;
                    const durationEl = document.getElementById('breathingDuration');
                    if (durationEl) {
                        durationEl.textContent = duration;
                    }
                }, 1000);
            });
        }
        
        if (stopBtn) {
            stopBtn.addEventListener('click', () => {
                clearInterval(breathingInterval);
                clearInterval(durationInterval);
                const circle = document.getElementById('breathingCircle');
                const text = document.getElementById('breathingText');
                circle.classList.remove('expand');
                text.textContent = 'Exercise Stopped';
            });
        }
    }
}

// Initialize games when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    const mindGames = new MindGames();
});
