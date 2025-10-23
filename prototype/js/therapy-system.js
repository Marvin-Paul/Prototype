// Comprehensive Therapy System
class TherapySystem {
    constructor() {
        this.currentExercise = null;
        this.exerciseData = {};
        this.userProgress = JSON.parse(localStorage.getItem('therapyProgress')) || {};
        this.crisisResources = this.getCrisisResources();
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.loadUserProgress();
        this.initializeExercises();
        this.setupGoalsSystem();
        this.updateProgressDisplay();
    }

    setupEventListeners() {
        // Therapy exercise buttons
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('therapy-btn')) {
                const card = e.target.closest('.therapy-card');
                const therapyType = card.classList.contains('cbt-card') ? 'cbt' :
                                  card.classList.contains('dbt-card') ? 'dbt' :
                                  card.classList.contains('mbsr-card') ? 'mbsr' : null;
                
                if (e.target.textContent.includes('Start Exercise')) {
                    this.startExercise(therapyType);
                } else if (e.target.textContent.includes('Learn More')) {
                    this.showLearnMore(therapyType);
                }
            }

            // Crisis support
            if (e.target.classList.contains('crisis-support-btn')) {
                this.showCrisisSupport();
            }

            // Therapy goals
            if (e.target.id === 'addGoalBtn') {
                this.addTherapyGoal();
            }

            if (e.target.classList.contains('goal-btn')) {
                const goalItem = e.target.closest('.goal-item');
                const goalId = goalItem.dataset.goalId;
                
                if (e.target.classList.contains('complete')) {
                    this.completeGoal(goalId);
                } else if (e.target.classList.contains('delete')) {
                    this.deleteGoal(goalId);
                }
            }

            // Therapy tools
            if (e.target.classList.contains('tool-btn')) {
                const tool = e.target.closest('.therapy-tool');
                const toolName = tool.querySelector('h4').textContent;
                this.openTherapyTool(toolName);
            }
        });
    }

    initializeExercises() {
        this.exerciseData = {
            cbt: {
                title: 'Cognitive Behavioral Therapy',
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
                            'Rate your mood after reframing'
                        ]
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
                            'Practice the new thought pattern'
                        ]
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
                            'Update your belief based on evidence'
                        ]
                    }
                ]
            },
            dbt: {
                title: 'Dialectical Behavior Therapy',
                exercises: [
                    {
                        id: 'distress_tolerance',
                        name: 'Distress Tolerance Skills',
                        description: 'Cope with overwhelming emotions safely',
                        duration: '5-10 minutes',
                        difficulty: 'Beginner',
                        skills: [
                            'TIPP: Temperature, Intense exercise, Paced breathing, Paired muscle relaxation',
                            'ACCEPTS: Activities, Contributing, Comparisons, Emotions, Pushing away, Thoughts, Sensations',
                            'IMPROVE: Imagery, Meaning, Prayer, Relaxation, One thing at a time, Vacation, Encouragement',
                            'Radical Acceptance: Accepting reality as it is'
                        ]
                    },
                    {
                        id: 'emotion_regulation',
                        name: 'Emotion Regulation',
                        description: 'Understand and manage your emotions',
                        duration: '15-20 minutes',
                        difficulty: 'Intermediate',
                        skills: [
                            'Identify and label emotions',
                            'Understand emotion functions',
                            'Reduce vulnerability to emotion mind',
                            'Increase positive emotions',
                            'Take opposite action'
                        ]
                    },
                    {
                        id: 'interpersonal_effectiveness',
                        name: 'Interpersonal Effectiveness',
                        description: 'Build healthy relationships and communication',
                        duration: '20-30 minutes',
                        difficulty: 'Advanced',
                        skills: [
                            'DEAR MAN: Describe, Express, Assert, Reinforce, Mindful, Appear confident, Negotiate',
                            'GIVE: Gentle, Interested, Validate, Easy manner',
                            'FAST: Fair, Apologies, Stick to values, Truthful'
                        ]
                    }
                ]
            },
            mbsr: {
                title: 'Mindfulness-Based Stress Reduction',
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
                            'End with full body awareness'
                        ]
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
                            'End with gratitude for practice'
                        ]
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
                            'Rest in open-hearted awareness'
                        ]
                    }
                ]
            }
        };
    }

    startExercise(therapyType) {
        const exercises = this.exerciseData[therapyType];
        if (!exercises) return;

        this.showExerciseSelector(therapyType, exercises);
    }

    showExerciseSelector(therapyType, exercises) {
        const modal = this.createModal('exercise-selector');
        modal.innerHTML = `
            <div class="exercise-selector-modal">
                <div class="modal-header">
                    <h2>${exercises.title} Exercises</h2>
                    <button class="close-modal">&times;</button>
                </div>
                <div class="exercise-list">
                    ${exercises.exercises.map(exercise => `
                        <div class="exercise-item" data-exercise-id="${exercise.id}" data-therapy-type="${therapyType}">
                            <div class="exercise-header">
                                <h3>${exercise.name}</h3>
                                <div class="exercise-meta">
                                    <span class="duration">${exercise.duration}</span>
                                    <span class="difficulty ${exercise.difficulty.toLowerCase()}">${exercise.difficulty}</span>
                                </div>
                            </div>
                            <p class="exercise-description">${exercise.description}</p>
                            <button class="start-exercise-btn" data-exercise-id="${exercise.id}">Start Exercise</button>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;

        // Add event listeners
        modal.addEventListener('click', (e) => {
            if (e.target.classList.contains('close-modal')) {
                this.closeModal(modal);
            } else if (e.target.classList.contains('start-exercise-btn')) {
                const exerciseId = e.target.dataset.exerciseId;
                this.openExercise(therapyType, exerciseId);
                this.closeModal(modal);
            }
        });

        document.body.appendChild(modal);
    }

    openExercise(therapyType, exerciseId) {
        const exercise = this.exerciseData[therapyType].exercises.find(ex => ex.id === exerciseId);
        if (!exercise) return;

        this.currentExercise = { therapyType, exerciseId, ...exercise };
        this.showExerciseInterface();
    }

    showExerciseInterface() {
        const modal = this.createModal('exercise-interface');
        
        modal.innerHTML = `
            <div class="exercise-interface">
                <div class="exercise-header">
                    <h2>${this.currentExercise.name}</h2>
                    <button class="close-exercise">&times;</button>
                </div>
                <div class="exercise-content">
                    <div class="exercise-info">
                        <p class="exercise-description">${this.currentExercise.description}</p>
                        <div class="exercise-meta">
                            <span><i class="fas fa-clock"></i> ${this.currentExercise.duration}</span>
                            <span><i class="fas fa-signal"></i> ${this.currentExercise.difficulty}</span>
                        </div>
                    </div>
                    <div class="exercise-steps">
                        <h3>Exercise Steps</h3>
                        <div class="steps-container">
                            ${this.currentExercise.steps ? this.currentExercise.steps.map((step, index) => `
                                <div class="step-item">
                                    <div class="step-number">${index + 1}</div>
                                    <div class="step-content">
                                        <p>${step}</p>
                                        <div class="step-actions">
                                            <button class="step-complete-btn" data-step="${index}">Mark Complete</button>
                                        </div>
                                    </div>
                                </div>
                            `).join('') : ''}
                        </div>
                    </div>
                    <div class="exercise-notes">
                        <h3>Your Notes</h3>
                        <textarea class="exercise-notes-textarea" placeholder="Record your thoughts, insights, or reflections during this exercise..."></textarea>
                    </div>
                    <div class="exercise-actions">
                        <button class="save-progress-btn">Save Progress</button>
                        <button class="complete-exercise-btn">Complete Exercise</button>
                    </div>
                </div>
            </div>
        `;

        // Add event listeners
        modal.addEventListener('click', (e) => {
            if (e.target.classList.contains('close-exercise')) {
                this.closeModal(modal);
            } else if (e.target.classList.contains('step-complete-btn')) {
                this.markStepComplete(e.target.dataset.step);
                e.target.textContent = 'Completed ✓';
                e.target.classList.add('completed');
            } else if (e.target.classList.contains('save-progress-btn')) {
                this.saveProgress();
            } else if (e.target.classList.contains('complete-exercise-btn')) {
                this.completeExercise();
                this.closeModal(modal);
            }
        });

        document.body.appendChild(modal);
    }

    markStepComplete(stepIndex) {
        if (!this.userProgress[this.currentExercise.id]) {
            this.userProgress[this.currentExercise.id] = {
                completedSteps: [],
                notes: '',
                completionDate: null
            };
        }
        
        if (!this.userProgress[this.currentExercise.id].completedSteps.includes(parseInt(stepIndex))) {
            this.userProgress[this.currentExercise.id].completedSteps.push(parseInt(stepIndex));
            this.saveUserProgress();
        }
    }

    saveProgress() {
        const notes = document.querySelector('.exercise-notes-textarea').value;
        if (!this.userProgress[this.currentExercise.id]) {
            this.userProgress[this.currentExercise.id] = {
                completedSteps: [],
                notes: '',
                completionDate: null
            };
        }
        
        this.userProgress[this.currentExercise.id].notes = notes;
        this.saveUserProgress();
        
        // Show success message
        this.showNotification('Progress saved successfully!', 'success');
    }

    completeExercise() {
        if (!this.userProgress[this.currentExercise.id]) {
            this.userProgress[this.currentExercise.id] = {
                completedSteps: [],
                notes: '',
                completionDate: null
            };
        }
        
        this.userProgress[this.currentExercise.id].completionDate = new Date().toISOString();
        this.userProgress[this.currentExercise.id].notes = document.querySelector('.exercise-notes-textarea').value;
        
        this.saveUserProgress();
        this.showNotification('Exercise completed! Great job!', 'success');
        
        // Update progress tracking
        this.updateProgressStats();
    }

    showLearnMore(therapyType) {
        const therapyInfo = this.getTherapyInfo(therapyType);
        const modal = this.createModal('learn-more');
        
        modal.innerHTML = `
            <div class="learn-more-modal">
                <div class="modal-header">
                    <h2>About ${therapyInfo.title}</h2>
                    <button class="close-modal">&times;</button>
                </div>
                <div class="learn-more-content">
                    <div class="therapy-overview">
                        <h3>What is ${therapyInfo.title}?</h3>
                        <p>${therapyInfo.overview}</p>
                    </div>
                    <div class="therapy-benefits">
                        <h3>Benefits</h3>
                        <ul>
                            ${therapyInfo.benefits.map(benefit => `<li>${benefit}</li>`).join('')}
                        </ul>
                    </div>
                    <div class="therapy-techniques">
                        <h3>Key Techniques</h3>
                        <ul>
                            ${therapyInfo.techniques.map(technique => `<li>${technique}</li>`).join('')}
                        </ul>
                    </div>
                    <div class="therapy-resources">
                        <h3>Additional Resources</h3>
                        <div class="resource-links">
                            ${therapyInfo.resources.map(resource => `
                                <a href="${resource.url}" target="_blank" class="resource-link">
                                    <i class="${resource.icon}"></i>
                                    ${resource.title}
                                </a>
                            `).join('')}
                        </div>
                    </div>
                </div>
            </div>
        `;

        modal.addEventListener('click', (e) => {
            if (e.target.classList.contains('close-modal')) {
                this.closeModal(modal);
            }
        });

        document.body.appendChild(modal);
    }

    getTherapyInfo(therapyType) {
        const info = {
            cbt: {
                title: 'Cognitive Behavioral Therapy (CBT)',
                overview: 'CBT is a structured, time-limited therapy that focuses on identifying and changing negative thought patterns and behaviors. It helps individuals understand the connection between thoughts, feelings, and actions.',
                benefits: [
                    'Helps identify and change negative thinking patterns',
                    'Teaches practical coping strategies',
                    'Effective for anxiety, depression, and stress',
                    'Short-term, goal-oriented approach',
                    'Provides tools for long-term mental health'
                ],
                techniques: [
                    'Thought records and cognitive restructuring',
                    'Behavioral experiments',
                    'Problem-solving skills',
                    'Relaxation techniques',
                    'Exposure therapy for anxiety'
                ],
                resources: [
                    { title: 'CBT Worksheets', url: '#', icon: 'fas fa-file-alt' },
                    { title: 'Thought Record Template', url: '#', icon: 'fas fa-clipboard-list' },
                    { title: 'CBT Self-Help Guide', url: '#', icon: 'fas fa-book' }
                ]
            },
            dbt: {
                title: 'Dialectical Behavior Therapy (DBT)',
                overview: 'DBT combines cognitive-behavioral techniques with mindfulness practices. It focuses on teaching skills to manage emotions, tolerate distress, and improve relationships.',
                benefits: [
                    'Develops emotional regulation skills',
                    'Improves distress tolerance',
                    'Enhances interpersonal relationships',
                    'Reduces self-destructive behaviors',
                    'Increases mindfulness and awareness'
                ],
                techniques: [
                    'Mindfulness meditation',
                    'Distress tolerance skills',
                    'Emotion regulation strategies',
                    'Interpersonal effectiveness skills',
                    'Radical acceptance practices'
                ],
                resources: [
                    { title: 'DBT Skills Workbook', url: '#', icon: 'fas fa-book-open' },
                    { title: 'Crisis Survival Skills', url: '#', icon: 'fas fa-life-ring' },
                    { title: 'Mindfulness Exercises', url: '#', icon: 'fas fa-leaf' }
                ]
            },
            mbsr: {
                title: 'Mindfulness-Based Stress Reduction (MBSR)',
                overview: 'MBSR is an evidence-based program that uses mindfulness meditation to help people cope with stress, pain, and illness. It teaches present-moment awareness and non-judgmental observation.',
                benefits: [
                    'Reduces stress and anxiety',
                    'Improves focus and concentration',
                    'Enhances emotional regulation',
                    'Increases self-awareness',
                    'Promotes overall well-being'
                ],
                techniques: [
                    'Body scan meditation',
                    'Sitting meditation',
                    'Walking meditation',
                    'Loving-kindness meditation',
                    'Mindful movement and yoga'
                ],
                resources: [
                    { title: 'Guided Meditations', url: '#', icon: 'fas fa-play-circle' },
                    { title: 'Body Scan Audio', url: '#', icon: 'fas fa-volume-up' },
                    { title: 'Mindfulness Journal', url: '#', icon: 'fas fa-journal-whills' }
                ]
            }
        };
        
        return info[therapyType] || info.cbt;
    }

    showCrisisSupport() {
        const modal = this.createModal('crisis-support');
        
        modal.innerHTML = `
            <div class="crisis-support-modal">
                <div class="modal-header">
                    <h2><i class="fas fa-life-ring"></i> Crisis Support Resources</h2>
                    <button class="close-modal">&times;</button>
                </div>
                <div class="crisis-content">
                    <div class="crisis-warning">
                        <p><strong>If you're in immediate danger or having thoughts of self-harm, please call emergency services (911) or go to your nearest emergency room.</strong></p>
                    </div>
                    <div class="crisis-resources">
                        <h3>24/7 Crisis Hotlines</h3>
                        <div class="crisis-hotlines">
                            ${this.crisisResources.hotlines.map(hotline => `
                                <div class="crisis-hotline">
                                    <h4>${hotline.name}</h4>
                                    <p class="hotline-number">${hotline.number}</p>
                                    <p class="hotline-description">${hotline.description}</p>
                                    <a href="tel:${hotline.number}" class="call-btn">
                                        <i class="fas fa-phone"></i> Call Now
                                    </a>
                                </div>
                            `).join('')}
                        </div>
                        <div class="crisis-techniques">
                            <h3>Immediate Coping Techniques</h3>
                            <div class="coping-techniques">
                                ${this.crisisResources.techniques.map(technique => `
                                    <div class="technique-item">
                                        <h4>${technique.name}</h4>
                                        <p>${technique.description}</p>
                                        <button class="start-technique-btn" data-technique="${technique.id}">
                                            Try This Now
                                        </button>
                                    </div>
                                `).join('')}
                            </div>
                        </div>
                        <div class="crisis-contacts">
                            <h3>Trusted Contacts</h3>
                            <p>Reach out to someone you trust:</p>
                            <div class="contact-options">
                                <button class="contact-btn" data-type="family">Family Member</button>
                                <button class="contact-btn" data-type="friend">Close Friend</button>
                                <button class="contact-btn" data-type="counselor">Counselor</button>
                                <button class="contact-btn" data-type="emergency">Emergency Contact</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;

        modal.addEventListener('click', (e) => {
            if (e.target.classList.contains('close-modal')) {
                this.closeModal(modal);
            } else if (e.target.classList.contains('start-technique-btn')) {
                this.startCrisisTechnique(e.target.dataset.technique);
            } else if (e.target.classList.contains('contact-btn')) {
                this.initiateContact(e.target.dataset.type);
            }
        });

        document.body.appendChild(modal);
    }

    getCrisisResources() {
        return {
            hotlines: [
                {
                    name: 'National Suicide Prevention Lifeline',
                    number: '988',
                    description: '24/7 support for anyone in suicidal crisis or emotional distress'
                },
                {
                    name: 'Crisis Text Line',
                    number: 'Text HOME to 741741',
                    description: 'Free, 24/7 crisis support via text message'
                },
                {
                    name: 'SAMHSA National Helpline',
                    number: '1-800-662-4357',
                    description: '24/7 treatment referral and information service'
                },
                {
                    name: 'Trevor Project (LGBTQ+)',
                    number: '1-866-488-7386',
                    description: '24/7 crisis intervention and suicide prevention'
                }
            ],
            techniques: [
                {
                    id: 'breathing',
                    name: '4-7-8 Breathing',
                    description: 'Inhale for 4 counts, hold for 7, exhale for 8. Repeat 4 times.'
                },
                {
                    id: 'grounding',
                    name: '5-4-3-2-1 Grounding',
                    description: 'Name 5 things you see, 4 you can touch, 3 you hear, 2 you smell, 1 you taste.'
                },
                {
                    id: 'cold_water',
                    name: 'Cold Water Technique',
                    description: 'Splash cold water on your face or hold ice cubes to reset your nervous system.'
                },
                {
                    id: 'muscle_relaxation',
                    name: 'Progressive Muscle Relaxation',
                    description: 'Tense and release each muscle group from toes to head.'
                }
            ]
        };
    }

    startCrisisTechnique(techniqueId) {
        const technique = this.crisisResources.techniques.find(t => t.id === techniqueId);
        if (!technique) return;

        const modal = this.createModal('crisis-technique');
        
        modal.innerHTML = `
            <div class="crisis-technique-modal">
                <div class="modal-header">
                    <h2>${technique.name}</h2>
                    <button class="close-modal">&times;</button>
                </div>
                <div class="technique-content">
                    <div class="technique-description">
                        <p>${technique.description}</p>
                    </div>
                    <div class="technique-guide" id="technique-${techniqueId}">
                        ${this.getTechniqueGuide(techniqueId)}
                    </div>
                    <div class="technique-actions">
                        <button class="start-guided-technique">Start Guided Exercise</button>
                        <button class="emergency-contact">Still Need Help? Contact Someone</button>
                    </div>
                </div>
            </div>
        `;

        modal.addEventListener('click', (e) => {
            if (e.target.classList.contains('close-modal')) {
                this.closeModal(modal);
            } else if (e.target.classList.contains('start-guided-technique')) {
                this.startGuidedTechnique(techniqueId);
            } else if (e.target.classList.contains('emergency-contact')) {
                this.closeModal(modal);
                this.showCrisisSupport();
            }
        });

        document.body.appendChild(modal);
    }

    getTechniqueGuide(techniqueId) {
        const guides = {
            breathing: `
                <div class="breathing-guide">
                    <div class="breathing-circle">
                        <div class="breathing-inner"></div>
                    </div>
                    <div class="breathing-instructions">
                        <h3>Follow the circle:</h3>
                        <p class="breathing-step">Get ready to begin...</p>
                        <div class="breathing-counter">Cycle: <span id="cycle-count">0</span>/4</div>
                    </div>
                </div>
            `,
            grounding: `
                <div class="grounding-guide">
                    <div class="grounding-step" data-step="1">
                        <h3>5 Things You Can See</h3>
                        <p>Look around and name 5 things you can see</p>
                        <div class="grounding-input">
                            <input type="text" placeholder="Item 1">
                            <input type="text" placeholder="Item 2">
                            <input type="text" placeholder="Item 3">
                            <input type="text" placeholder="Item 4">
                            <input type="text" placeholder="Item 5">
                        </div>
                    </div>
                    <div class="grounding-step" data-step="2" style="display: none;">
                        <h3>4 Things You Can Touch</h3>
                        <p>Notice 4 different textures or objects you can touch</p>
                        <div class="grounding-input">
                            <input type="text" placeholder="Texture 1">
                            <input type="text" placeholder="Texture 2">
                            <input type="text" placeholder="Texture 3">
                            <input type="text" placeholder="Texture 4">
                        </div>
                    </div>
                    <div class="grounding-step" data-step="3" style="display: none;">
                        <h3>3 Things You Can Hear</h3>
                        <p>Listen carefully and identify 3 sounds</p>
                        <div class="grounding-input">
                            <input type="text" placeholder="Sound 1">
                            <input type="text" placeholder="Sound 2">
                            <input type="text" placeholder="Sound 3">
                        </div>
                    </div>
                    <div class="grounding-step" data-step="4" style="display: none;">
                        <h3>2 Things You Can Smell</h3>
                        <p>Take a deep breath and notice 2 scents</p>
                        <div class="grounding-input">
                            <input type="text" placeholder="Scent 1">
                            <input type="text" placeholder="Scent 2">
                        </div>
                    </div>
                    <div class="grounding-step" data-step="5" style="display: none;">
                        <h3>1 Thing You Can Taste</h3>
                        <p>Notice any taste in your mouth</p>
                        <div class="grounding-input">
                            <input type="text" placeholder="Taste">
                        </div>
                    </div>
                    <div class="grounding-navigation">
                        <button class="prev-step" disabled>Previous</button>
                        <button class="next-step">Next</button>
                        <button class="complete-grounding" style="display: none;">Complete</button>
                    </div>
                </div>
            `,
            cold_water: `
                <div class="cold-water-guide">
                    <h3>Cold Water Technique</h3>
                    <div class="cold-water-steps">
                        <div class="step">
                            <h4>Step 1: Prepare</h4>
                            <p>Fill a bowl with cold water or get ice cubes ready</p>
                        </div>
                        <div class="step">
                            <h4>Step 2: Apply</h4>
                            <p>Splash cold water on your face or hold ice cubes in your hands</p>
                        </div>
                        <div class="step">
                            <h4>Step 3: Notice</h4>
                            <p>Pay attention to how your body responds to the cold sensation</p>
                        </div>
                        <div class="step">
                            <h4>Step 4: Breathe</h4>
                            <p>Take slow, deep breaths as the cold sensation helps reset your nervous system</p>
                        </div>
                    </div>
                    <div class="cold-water-timer">
                        <button class="start-cold-water">Start 30-Second Timer</button>
                        <div class="timer-display" style="display: none;">
                            <span id="cold-water-countdown">30</span> seconds remaining
                        </div>
                    </div>
                </div>
            `,
            muscle_relaxation: `
                <div class="muscle-relaxation-guide">
                    <h3>Progressive Muscle Relaxation</h3>
                    <div class="relaxation-instructions">
                        <p>We'll go through each muscle group. Tense the muscles for 5 seconds, then relax completely.</p>
                        <div class="muscle-group" data-group="toes">
                            <h4>Toes</h4>
                            <p>Curl your toes tightly, hold for 5 seconds, then release</p>
                            <button class="tense-muscle">Tense Now</button>
                            <div class="tension-timer" style="display: none;">Hold for <span class="countdown">5</span> seconds</div>
                        </div>
                        <div class="muscle-group" data-group="feet" style="display: none;">
                            <h4>Feet and Calves</h4>
                            <p>Point your toes and flex your calf muscles</p>
                            <button class="tense-muscle">Tense Now</button>
                            <div class="tension-timer" style="display: none;">Hold for <span class="countdown">5</span> seconds</div>
                        </div>
                        <div class="muscle-group" data-group="thighs" style="display: none;">
                            <h4>Thighs</h4>
                            <p>Tighten your thigh muscles</p>
                            <button class="tense-muscle">Tense Now</button>
                            <div class="tension-timer" style="display: none;">Hold for <span class="countdown">5</span> seconds</div>
                        </div>
                        <div class="muscle-group" data-group="abdomen" style="display: none;">
                            <h4>Abdomen</h4>
                            <p>Tighten your stomach muscles</p>
                            <button class="tense-muscle">Tense Now</button>
                            <div class="tension-timer" style="display: none;">Hold for <span class="countdown">5</span> seconds</div>
                        </div>
                        <div class="muscle-group" data-group="arms" style="display: none;">
                            <h4>Arms and Hands</h4>
                            <p>Make fists and tense your arm muscles</p>
                            <button class="tense-muscle">Tense Now</button>
                            <div class="tension-timer" style="display: none;">Hold for <span class="countdown">5</span> seconds</div>
                        </div>
                        <div class="muscle-group" data-group="shoulders" style="display: none;">
                            <h4>Shoulders and Neck</h4>
                            <p>Raise your shoulders toward your ears</p>
                            <button class="tense-muscle">Tense Now</button>
                            <div class="tension-timer" style="display: none;">Hold for <span class="countdown">5</span> seconds</div>
                        </div>
                        <div class="muscle-group" data-group="face" style="display: none;">
                            <h4>Face</h4>
                            <p>Scrunch up your face muscles</p>
                            <button class="tense-muscle">Tense Now</button>
                            <div class="tension-timer" style="display: none;">Hold for <span class="countdown">5</span> seconds</div>
                        </div>
                        <div class="relaxation-complete" style="display: none;">
                            <h3>Complete Relaxation</h3>
                            <p>Take a few moments to notice how relaxed your body feels. Breathe deeply and enjoy the sensation of release.</p>
                        </div>
                    </div>
                </div>
            `
        };
        
        return guides[techniqueId] || '<p>Technique guide not available.</p>';
    }

    startGuidedTechnique(techniqueId) {
        // Implementation for guided techniques would go here
        this.showNotification('Guided technique started!', 'info');
    }

    initiateContact(contactType) {
        const contacts = {
            family: 'Call a trusted family member',
            friend: 'Reach out to a close friend',
            counselor: 'Contact your counselor or therapist',
            emergency: 'Call emergency services (911)'
        };
        
        this.showNotification(`Consider: ${contacts[contactType]}`, 'info');
    }

    updateProgressStats() {
        // Update progress tracking
        const totalExercises = Object.keys(this.exerciseData).reduce((total, therapyType) => {
            return total + this.exerciseData[therapyType].exercises.length;
        }, 0);
        
        const completedExercises = Object.keys(this.userProgress).filter(exerciseId => {
            return this.userProgress[exerciseId].completionDate;
        }).length;
        
        const progressPercentage = Math.round((completedExercises / totalExercises) * 100);
        
        // Update UI with progress stats
        this.displayProgressStats(progressPercentage, completedExercises, totalExercises);
    }

    displayProgressStats(percentage, completed, total) {
        // This would update the dashboard with therapy progress
        console.log(`Therapy Progress: ${percentage}% (${completed}/${total} exercises completed)`);
    }

    saveUserProgress() {
        localStorage.setItem('therapyProgress', JSON.stringify(this.userProgress));
    }

    loadUserProgress() {
        this.userProgress = JSON.parse(localStorage.getItem('therapyProgress')) || {};
    }

    createModal(className) {
        const modal = document.createElement('div');
        modal.className = `therapy-modal ${className}`;
        modal.innerHTML = '<div class="modal-overlay"></div>';
        return modal;
    }

    closeModal(modal) {
        if (modal && modal.parentNode) {
            modal.parentNode.removeChild(modal);
        }
    }

    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `therapy-notification ${type}`;
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
        
        // Auto-remove after 5 seconds
        setTimeout(() => {
            if (notification.parentNode) {
                notification.remove();
            }
        }, 5000);
    }

    // Therapy Goals System
    setupGoalsSystem() {
        this.therapyGoals = JSON.parse(localStorage.getItem('therapyGoals')) || [];
        this.renderGoals();
    }

    addTherapyGoal() {
        const goalInput = document.getElementById('therapyGoalInput');
        const goalText = goalInput.value.trim();
        
        if (!goalText) {
            this.showNotification('Please enter a therapy goal', 'warning');
            return;
        }

        const goal = {
            id: Date.now().toString(),
            text: goalText,
            createdAt: new Date().toISOString(),
            completed: false,
            completedAt: null
        };

        this.therapyGoals.push(goal);
        this.saveGoals();
        goalInput.value = '';
        this.renderGoals();
        this.showNotification('Therapy goal added successfully!', 'success');
    }

    completeGoal(goalId) {
        const goal = this.therapyGoals.find(g => g.id === goalId);
        if (goal) {
            goal.completed = true;
            goal.completedAt = new Date().toISOString();
            this.saveGoals();
            this.renderGoals();
            this.showNotification('Goal completed! Great job!', 'success');
        }
    }

    deleteGoal(goalId) {
        if (confirm('Are you sure you want to delete this goal?')) {
            this.therapyGoals = this.therapyGoals.filter(g => g.id !== goalId);
            this.saveGoals();
            this.renderGoals();
            this.showNotification('Goal deleted', 'info');
        }
    }

    renderGoals() {
        const goalsContainer = document.getElementById('currentGoals');
        if (!goalsContainer) return;

        if (this.therapyGoals.length === 0) {
            goalsContainer.innerHTML = `
                <div class="no-goals">
                    <p>No therapy goals set yet. Add your first goal above to get started!</p>
                </div>
            `;
            return;
        }

        goalsContainer.innerHTML = this.therapyGoals.map(goal => `
            <div class="goal-item ${goal.completed ? 'completed' : ''}" data-goal-id="${goal.id}">
                <div class="goal-text">${goal.text}</div>
                <div class="goal-actions">
                    ${!goal.completed ? `
                        <button class="goal-btn complete">Complete</button>
                    ` : ''}
                    <button class="goal-btn delete">Delete</button>
                </div>
            </div>
        `).join('');
    }

    saveGoals() {
        localStorage.setItem('therapyGoals', JSON.stringify(this.therapyGoals));
    }

    // Therapy Tools
    openTherapyTool(toolName) {
        switch(toolName) {
            case 'Mood Journal':
                this.openMoodJournal();
                break;
            case 'Gratitude Practice':
                this.openGratitudePractice();
                break;
            case 'Breathing Exercises':
                this.openBreathingExercises();
                break;
            case 'Progress Tracking':
                this.openProgressTracking();
                break;
            case 'Support Groups':
                this.openSupportGroups();
                break;
            case 'Resource Library':
                this.openResourceLibrary();
                break;
            default:
                this.showNotification(`${toolName} feature coming soon!`, 'info');
        }
    }

    openMoodJournal() {
        const modal = this.createModal('mood-journal');
        modal.innerHTML = `
            <div class="mood-journal-modal">
                <div class="modal-header">
                    <h2>Mood Journal</h2>
                    <button class="close-modal">&times;</button>
                </div>
                <div class="mood-journal-content">
                    <div class="mood-selector">
                        <h3>How are you feeling today?</h3>
                        <div class="mood-options">
                            <button class="mood-option" data-mood="excellent">😄 Excellent</button>
                            <button class="mood-option" data-mood="good">😊 Good</button>
                            <button class="mood-option" data-mood="okay">😐 Okay</button>
                            <button class="mood-option" data-mood="poor">😔 Poor</button>
                            <button class="mood-option" data-mood="terrible">😢 Terrible</button>
                        </div>
                    </div>
                    <div class="journal-entry">
                        <h3>Journal Entry</h3>
                        <textarea id="moodJournalEntry" placeholder="What's on your mind today? What events or thoughts affected your mood?"></textarea>
                    </div>
                    <div class="journal-actions">
                        <button class="save-journal-btn">Save Entry</button>
                        <button class="view-history-btn">View History</button>
                    </div>
                </div>
            </div>
        `;

        modal.addEventListener('click', (e) => {
            if (e.target.classList.contains('close-modal')) {
                this.closeModal(modal);
            } else if (e.target.classList.contains('mood-option')) {
                document.querySelectorAll('.mood-option').forEach(btn => btn.classList.remove('selected'));
                e.target.classList.add('selected');
            } else if (e.target.classList.contains('save-journal-btn')) {
                this.saveMoodJournal();
            } else if (e.target.classList.contains('view-history-btn')) {
                this.viewMoodHistory();
            }
        });

        document.body.appendChild(modal);
    }

    openGratitudePractice() {
        const modal = this.createModal('gratitude-practice');
        modal.innerHTML = `
            <div class="gratitude-practice-modal">
                <div class="modal-header">
                    <h2>Gratitude Practice</h2>
                    <button class="close-modal">&times;</button>
                </div>
                <div class="gratitude-content">
                    <div class="gratitude-prompt">
                        <h3>What are you grateful for today?</h3>
                        <p>Take a moment to reflect on the positive aspects of your day.</p>
                    </div>
                    <div class="gratitude-entries">
                        <div class="gratitude-item">
                            <label>1. I'm grateful for...</label>
                            <input type="text" class="gratitude-input" placeholder="Enter something you're grateful for">
                        </div>
                        <div class="gratitude-item">
                            <label>2. I'm grateful for...</label>
                            <input type="text" class="gratitude-input" placeholder="Enter something you're grateful for">
                        </div>
                        <div class="gratitude-item">
                            <label>3. I'm grateful for...</label>
                            <input type="text" class="gratitude-input" placeholder="Enter something you're grateful for">
                        </div>
                    </div>
                    <div class="gratitude-actions">
                        <button class="save-gratitude-btn">Save Gratitude</button>
                        <button class="random-prompt-btn">Get Random Prompt</button>
                    </div>
                </div>
            </div>
        `;

        modal.addEventListener('click', (e) => {
            if (e.target.classList.contains('close-modal')) {
                this.closeModal(modal);
            } else if (e.target.classList.contains('save-gratitude-btn')) {
                this.saveGratitudePractice();
            } else if (e.target.classList.contains('random-prompt-btn')) {
                this.showRandomGratitudePrompt();
            }
        });

        document.body.appendChild(modal);
    }

    openBreathingExercises() {
        // This would open the breathing exercise from crisis support
        this.showNotification('Opening breathing exercises...', 'info');
        // Could redirect to crisis support breathing technique
    }

    openProgressTracking() {
        const modal = this.createModal('progress-tracking');
        modal.innerHTML = `
            <div class="progress-tracking-modal">
                <div class="modal-header">
                    <h2>Your Progress</h2>
                    <button class="close-modal">&times;</button>
                </div>
                <div class="progress-content">
                    <div class="progress-summary">
                        <div class="progress-stat">
                            <h3>${this.getCompletedExercisesCount()}</h3>
                            <p>Exercises Completed</p>
                        </div>
                        <div class="progress-stat">
                            <h3>${this.getCurrentStreak()}</h3>
                            <p>Day Streak</p>
                        </div>
                        <div class="progress-stat">
                            <h3>${this.getProgressPercentage()}%</h3>
                            <p>Overall Progress</p>
                        </div>
                    </div>
                    <div class="progress-chart">
                        <h3>Weekly Activity</h3>
                        <div class="chart-placeholder">
                            <p>Progress chart would be displayed here</p>
                        </div>
                    </div>
                </div>
            </div>
        `;

        modal.addEventListener('click', (e) => {
            if (e.target.classList.contains('close-modal')) {
                this.closeModal(modal);
            }
        });

        document.body.appendChild(modal);
    }

    openSupportGroups() {
        this.showNotification('Support groups feature coming soon!', 'info');
    }

    openResourceLibrary() {
        this.showNotification('Resource library feature coming soon!', 'info');
    }

    // Progress tracking methods
    updateProgressDisplay() {
        const completedExercisesEl = document.getElementById('completedExercises');
        const currentStreakEl = document.getElementById('currentStreak');
        const progressPercentageEl = document.getElementById('progressPercentage');

        if (completedExercisesEl) {
            completedExercisesEl.textContent = this.getCompletedExercisesCount();
        }
        if (currentStreakEl) {
            currentStreakEl.textContent = this.getCurrentStreak();
        }
        if (progressPercentageEl) {
            progressPercentageEl.textContent = this.getProgressPercentage() + '%';
        }
    }

    getCompletedExercisesCount() {
        return Object.keys(this.userProgress).filter(exerciseId => {
            return this.userProgress[exerciseId].completionDate;
        }).length;
    }

    getCurrentStreak() {
        // Simple streak calculation - could be enhanced
        const today = new Date();
        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);
        
        // Check if user completed exercises today or yesterday
        const hasRecentActivity = Object.values(this.userProgress).some(progress => {
            if (!progress.completionDate) return false;
            const completionDate = new Date(progress.completionDate);
            return completionDate.toDateString() === today.toDateString() ||
                   completionDate.toDateString() === yesterday.toDateString();
        });
        
        return hasRecentActivity ? 1 : 0; // Simplified for now
    }

    getProgressPercentage() {
        const totalExercises = Object.keys(this.exerciseData).reduce((total, therapyType) => {
            return total + this.exerciseData[therapyType].exercises.length;
        }, 0);
        
        const completedExercises = this.getCompletedExercisesCount();
        
        return totalExercises > 0 ? Math.round((completedExercises / totalExercises) * 100) : 0;
    }

    // Mood journal methods
    saveMoodJournal() {
        const selectedMood = document.querySelector('.mood-option.selected');
        const journalEntry = document.getElementById('moodJournalEntry').value;
        
        if (!selectedMood) {
            this.showNotification('Please select your mood', 'warning');
            return;
        }

        const moodEntry = {
            mood: selectedMood.dataset.mood,
            entry: journalEntry,
            date: new Date().toISOString()
        };

        const moodHistory = JSON.parse(localStorage.getItem('moodHistory')) || [];
        moodHistory.push(moodEntry);
        localStorage.setItem('moodHistory', JSON.stringify(moodHistory));
        
        this.showNotification('Mood journal saved!', 'success');
        this.closeModal(document.querySelector('.mood-journal-modal').parentNode);
    }

    viewMoodHistory() {
        this.showNotification('Mood history feature coming soon!', 'info');
    }

    // Gratitude practice methods
    saveGratitudePractice() {
        const gratitudeInputs = document.querySelectorAll('.gratitude-input');
        const gratitudes = Array.from(gratitudeInputs).map(input => input.value.trim()).filter(value => value);
        
        if (gratitudes.length === 0) {
            this.showNotification('Please enter at least one gratitude', 'warning');
            return;
        }

        const gratitudeEntry = {
            gratitudes: gratitudes,
            date: new Date().toISOString()
        };

        const gratitudeHistory = JSON.parse(localStorage.getItem('gratitudeHistory')) || [];
        gratitudeHistory.push(gratitudeEntry);
        localStorage.setItem('gratitudeHistory', JSON.stringify(gratitudeHistory));
        
        this.showNotification('Gratitude practice saved!', 'success');
        this.closeModal(document.querySelector('.gratitude-practice-modal').parentNode);
    }

    showRandomGratitudePrompt() {
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
        this.showNotification(`Prompt: ${randomPrompt}`, 'info');
    }
}

// Initialize therapy system when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.therapySystem = new TherapySystem();
});
