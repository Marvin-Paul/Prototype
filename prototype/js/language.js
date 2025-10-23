// Language Management System
class LanguageManager {
    constructor() {
        this.currentLanguage = localStorage.getItem('campusMindspace_language') || 'en';
        this.translations = {
            en: {
                // Navigation & Common
                'welcome_title': 'Campus Mindspace',
                'welcome_subtitle': 'Your personal sanctuary for mental wellness',
                'welcome_description': 'A comprehensive mental health and wellness platform designed specifically for university students. Find support, resources, and tools to navigate the challenges of academic life.',
                
                // Authentication
                'login_tab': 'Login',
                'register_tab': 'Register',
                'login_title': 'Welcome Back',
                'register_title': 'Join Campus Mindspace',
                'email_label': 'University Email',
                'password_label': 'Password',
                'full_name_label': 'Full Name',
                'phone_label': 'Contact Number',
                'confirm_password_label': 'Confirm Password',
                'login_btn': 'Sign In',
                'register_btn': 'Create Account',
                'forgot_password': 'Forgot Password?',
                
                // Mood Check-in
                'mood_checkin_label': 'How are you feeling today?',
                'mood_checkin_subtitle': 'This helps us personalize your experience',
                'mood_overwhelmed': 'Feeling overwhelmed by studies',
                'mood_sleep': 'Difficulty sleeping',
                'mood_social': 'Stressed about social life',
                'mood_happy': 'Feeling generally happy/stable',
                'mood_anxious': 'Feeling anxious or worried',
                'mood_lonely': 'Feeling isolated or lonely',
                
                // Trust Indicators
                'secure_trusted': 'Secure & Trusted',
                'professional_counselors': 'Professional Counselors',
                'privacy_protected': 'Privacy Protected',
                
                // Navigation
                'nav_home': 'Home',
                'nav_therapy': 'Therapy',
                'nav_meditation': 'Meditation',
                'nav_resources': 'Resources',
                'nav_appointments': 'Appointments',
                'nav_games': 'Mind Games',
                'nav_groups': 'Group Chat',

                // Group Chat
                'groups_title': 'Group Chat',
                'groups_description': 'Connect with others who understand what you\'re going through',
                'mood_report_btn': 'Report My Mood & Join Group',
                'join_community': 'Join a Supportive Community',
                'mood_prompt': 'Share your current mood and connect with others who feel the same way',
                'current_group': 'Current Group',
                'group_members': 'Group Members',
                'change_mood': 'Change Mood',
                'type_message': 'Type your message...',
                'community_guidelines': 'Community Guidelines',
                'be_kind': 'Be kind and supportive to all members',
                'respect_privacy': 'Respect privacy - don\'t share personal information',
                'share_experiences': 'Share your experiences to help others',
                'safe_space': 'Remember this is a safe space for everyone',
                'group_chat': 'Group Chat',
                'share_thoughts': 'Share your thoughts and support others in your mood group',
                'you': 'You',
                'members': 'members',
                'member': 'member',
                'messages_today': 'messages today',
                'last_activity': 'Last activity',
                'no_activity': 'No activity',
                'view_details': 'View Details',
                'manage_group': 'Manage',
                'active': 'Active',
                'inactive': 'Inactive',
                'mood_updated': 'Mood updated successfully!',
                'joined_group': 'You\'ve joined the {groupName}!',
                'group_change_success': 'Successfully changed to {groupName}!',

                // Profile Menu
                'profile_settings': 'Settings',
                'profile_help': 'Help & Support',
                'profile_logout': 'Logout',

                // Section Titles and Descriptions
                'therapy_title': 'Therapy Resources',
                'therapy_description': 'Professional techniques and exercises for mental wellness',
                'meditation_title': 'Meditation & Mindfulness',
                'meditation_description': 'Guided practices for inner peace and focus',
                'resources_title': 'Resources & Support',
                'resources_description': 'Tools and materials for your wellness journey',
                'appointment_title': 'Counseling Appointments',
                'appointment_description': 'Book sessions with specialized counselors',
                'games_title': 'Mind Games & Activities',
                'games_description': 'Play interactive games to boost your mood and focus',
                'mood_tracker_title': 'How are you feeling today?',
                'feeling_great': 'Feeling great!',
                'update_mood': 'Update Mood',

                // Therapy Types
                'cbt_title': 'Cognitive Behavioral Therapy',
                'cbt_description': 'Learn to identify and change negative thought patterns',
                'dbt_title': 'Dialectical Behavior Therapy',
                'dbt_description': 'Build skills for emotional regulation and distress tolerance',
                'mbsr_title': 'Mindfulness-Based Stress Reduction',
                'mbsr_description': 'Cultivate present-moment awareness and reduce stress',
                'start_exercise': 'Start Exercise',
                'read_more': 'Learn More',

                // Meditation Types
                'body_scan_title': 'Body Scan Meditation',
                'body_scan_description': 'A systematic journey through physical sensations',
                'breathing_title': 'Focused Breathing',
                'breathing_description': 'Simple breath awareness for stress relief',
                'walking_title': 'Walking Meditation',
                'walking_description': 'Mindful movement for active relaxation',
                'loving_kindness_title': 'Loving-Kindness',
                'loving_kindness_description': 'Cultivate compassion for yourself and others',
                'start_meditation': 'Start Session',

                // Counselors
                'counselor_academic_name': 'Dr. Sarah Johnson',
                'counselor_academic_specialty': 'Academic Stress & Time Management',
                'counselor_academic_description': 'Helps students manage academic pressure and develop effective study strategies.',
                'counselor_relationship_name': 'Dr. Michael Chen',
                'counselor_relationship_specialty': 'Relationships & Social Life',
                'counselor_relationship_description': 'Supports students navigating friendships, dating, and family dynamics.',
                'counselor_anxiety_name': 'Dr. Emily Rodriguez',
                'counselor_anxiety_specialty': 'Anxiety & Depression',
                'counselor_anxiety_description': 'Specializes in treating anxiety disorders and mood-related concerns.',
                'counselor_identity_name': 'Dr. Alex Thompson',
                'counselor_identity_specialty': 'Identity & Personal Growth',
                'counselor_identity_description': 'Helps students explore identity, purpose, and personal development.',
                'book_session': 'Book Session',
                
                // Common Actions
                'loading': 'Loading...',
                'success': 'Success!',
                'error': 'Error',
                'save': 'Save',
                'cancel': 'Cancel',
                'close': 'Close',
                'next': 'Next',
                'previous': 'Previous',
                'continue': 'Continue',
                'back': 'Back',
                'submit': 'Submit',
                'delete': 'Delete',
                'edit': 'Edit'
            },
            es: {
                // Navigation & Common
                'welcome_title': 'Campus Mindspace',
                'welcome_subtitle': 'Tu santuario personal para el bienestar mental',
                'welcome_description': 'Una plataforma integral de salud mental y bienestar diseñada específicamente para estudiantes universitarios. Encuentra apoyo, recursos y herramientas para navegar los desafíos de la vida académica.',
                
                // Authentication
                'login_tab': 'Iniciar Sesión',
                'register_tab': 'Registrarse',
                'login_title': 'Bienvenido de Vuelta',
                'register_title': 'Únete a Campus Mindspace',
                'email_label': 'Correo Universitario',
                'password_label': 'Contraseña',
                'full_name_label': 'Nombre Completo',
                'phone_label': 'Número de Contacto',
                'confirm_password_label': 'Confirmar Contraseña',
                'login_btn': 'Iniciar Sesión',
                'register_btn': 'Crear Cuenta',
                'forgot_password': '¿Olvidaste tu contraseña?',
                
                // Mood Check-in
                'mood_checkin_label': '¿Cómo te sientes hoy?',
                'mood_checkin_subtitle': 'Esto nos ayuda a personalizar tu experiencia',
                'mood_overwhelmed': 'Sintiéndome abrumado por los estudios',
                'mood_sleep': 'Dificultad para dormir',
                'mood_social': 'Estresado por la vida social',
                'mood_happy': 'Sintiéndome generalmente feliz/estable',
                'mood_anxious': 'Sintiéndome ansioso o preocupado',
                'mood_lonely': 'Sintiéndome aislado o solo',
                
                // Trust Indicators
                'secure_trusted': 'Seguro y Confiable',
                'professional_counselors': 'Consejos Profesionales',
                'privacy_protected': 'Privacidad Protegida',
                
                // Navigation
                'nav_home': 'Inicio',
                'nav_therapy': 'Terapia',
                'nav_meditation': 'Meditación',
                'nav_resources': 'Recursos',
                'nav_appointments': 'Citas',
                'nav_games': 'Juegos Mentales',
                'nav_groups': 'Chat Grupal',

                // Group Chat
                'groups_title': 'Chat Grupal',
                'groups_description': 'Conéctate con otros que entienden por lo que estás pasando',
                'mood_report_btn': 'Reportar Mi Estado de Ánimo y Unirse al Grupo',
                'join_community': 'Únete a una Comunidad de Apoyo',
                'mood_prompt': 'Comparte tu estado de ánimo actual y conéctate con otros que se sienten igual',
                'current_group': 'Grupo Actual',
                'group_members': 'Miembros del Grupo',
                'change_mood': 'Cambiar Estado de Ánimo',
                'type_message': 'Escribe tu mensaje...',
                'community_guidelines': 'Pautas de la Comunidad',
                'be_kind': 'Sé amable y solidario con todos los miembros',
                'respect_privacy': 'Respeta la privacidad - no compartas información personal',
                'share_experiences': 'Comparte tus experiencias para ayudar a otros',
                'safe_space': 'Recuerda que este es un espacio seguro para todos',
                'group_chat': 'Chat Grupal',
                'share_thoughts': 'Comparte tus pensamientos y apoya a otros en tu grupo de estado de ánimo',
                'you': 'Tú',
                'members': 'miembros',
                'member': 'miembro',
                'messages_today': 'mensajes hoy',
                'last_activity': 'Última actividad',
                'no_activity': 'Sin actividad',
                'view_details': 'Ver Detalles',
                'manage_group': 'Gestionar',
                'active': 'Activo',
                'inactive': 'Inactivo',
                'mood_updated': '¡Estado de ánimo actualizado exitosamente!',
                'joined_group': '¡Te has unido al {groupName}!',
                'group_change_success': '¡Cambio exitoso a {groupName}!',

                // Profile Menu
                'profile_settings': 'Configuración',
                'profile_help': 'Ayuda y Soporte',
                'profile_logout': 'Cerrar Sesión',

                // Section Titles and Descriptions
                'therapy_title': 'Recursos de Terapia',
                'therapy_description': 'Técnicas y ejercicios profesionales para el bienestar mental',
                'meditation_title': 'Meditación y Mindfulness',
                'meditation_description': 'Prácticas guiadas para la paz interior y el enfoque',
                'resources_title': 'Recursos y Apoyo',
                'resources_description': 'Herramientas y materiales para tu viaje de bienestar',
                'appointment_title': 'Citas de Consejería',
                'appointment_description': 'Reserva sesiones con consejeros especializados',
                'games_title': 'Juegos y Actividades Mentales',
                'games_description': 'Juega juegos interactivos para mejorar tu estado de ánimo y enfoque',
                'mood_tracker_title': '¿Cómo te sientes hoy?',
                'feeling_great': '¡Me siento genial!',
                'update_mood': 'Actualizar Estado de Ánimo',

                // Therapy Types
                'cbt_title': 'Terapia Cognitivo-Conductual',
                'cbt_description': 'Aprende a identificar y cambiar patrones de pensamiento negativos',
                'dbt_title': 'Terapia Dialéctica-Conductual',
                'dbt_description': 'Desarrolla habilidades para la regulación emocional y la tolerancia a la angustia',
                'mbsr_title': 'Reducción del Estrés Basada en Mindfulness',
                'mbsr_description': 'Cultiva la conciencia del momento presente y reduce el estrés',
                'start_exercise': 'Iniciar Ejercicio',
                'read_more': 'Leer Más',

                // Meditation Types
                'body_scan_title': 'Meditación de Escaneo Corporal',
                'body_scan_description': 'Un viaje sistemático a través de las sensaciones físicas',
                'breathing_title': 'Respiración Focalizada',
                'breathing_description': 'Conciencia respiratoria simple para el alivio del estrés',
                'walking_title': 'Meditación Caminando',
                'walking_description': 'Movimiento consciente para la relajación activa',
                'loving_kindness_title': 'Bondad Amorosa',
                'loving_kindness_description': 'Cultiva la compasión hacia ti mismo y hacia los demás',
                'start_meditation': 'Iniciar Sesión',

                // Counselors
                'counselor_academic_name': 'Dra. Sarah Johnson',
                'counselor_academic_specialty': 'Estrés Académico y Gestión del Tiempo',
                'counselor_academic_description': 'Ayuda a los estudiantes a manejar la presión académica y desarrollar estrategias de estudio efectivas.',
                'counselor_relationship_name': 'Dr. Michael Chen',
                'counselor_relationship_specialty': 'Relaciones y Vida Social',
                'counselor_relationship_description': 'Apoya a los estudiantes en la navegación de amistades, citas y dinámicas familiares.',
                'counselor_anxiety_name': 'Dra. Emily Rodriguez',
                'counselor_anxiety_specialty': 'Ansiedad y Depresión',
                'counselor_anxiety_description': 'Se especializa en el tratamiento de trastornos de ansiedad y preocupaciones relacionadas con el estado de ánimo.',
                'counselor_identity_name': 'Dr. Alex Thompson',
                'counselor_identity_specialty': 'Identidad y Crecimiento Personal',
                'counselor_identity_description': 'Ayuda a los estudiantes a explorar la identidad, el propósito y el desarrollo personal.',
                'book_session': 'Reservar Sesión',
                
                // Common Actions
                'loading': 'Cargando...',
                'success': '¡Éxito!',
                'error': 'Error',
                'save': 'Guardar',
                'cancel': 'Cancelar',
                'close': 'Cerrar',
                'next': 'Siguiente',
                'previous': 'Anterior',
                'continue': 'Continuar',
                'back': 'Atrás',
                'submit': 'Enviar',
                'delete': 'Eliminar',
                'edit': 'Editar'
            },
            fr: {
                // Navigation & Common
                'welcome_title': 'Campus Mindspace',
                'welcome_subtitle': 'Votre sanctuaire personnel pour le bien-être mental',
                'welcome_description': 'Une plateforme complète de santé mentale et de bien-être conçue spécifiquement pour les étudiants universitaires. Trouvez du soutien, des ressources et des outils pour naviguer les défis de la vie académique.',
                
                // Authentication
                'login_tab': 'Connexion',
                'register_tab': 'S\'inscrire',
                'login_title': 'Bienvenue',
                'register_title': 'Rejoignez Campus Mindspace',
                'email_label': 'Email Universitaire',
                'password_label': 'Mot de Passe',
                'full_name_label': 'Nom Complet',
                'phone_label': 'Numéro de Contact',
                'confirm_password_label': 'Confirmer le Mot de Passe',
                'login_btn': 'Se Connecter',
                'register_btn': 'Créer un Compte',
                'forgot_password': 'Mot de passe oublié?',
                
                // Mood Check-in
                'mood_checkin_label': 'Comment vous sentez-vous aujourd\'hui?',
                'mood_checkin_subtitle': 'Cela nous aide à personnaliser votre expérience',
                'mood_overwhelmed': 'Me sentir dépassé par les études',
                'mood_sleep': 'Difficulté à dormir',
                'mood_social': 'Stressé par la vie sociale',
                'mood_happy': 'Me sentir généralement heureux/stable',
                'mood_anxious': 'Me sentir anxieux ou inquiet',
                'mood_lonely': 'Me sentir isolé ou seul',
                
                // Trust Indicators
                'secure_trusted': 'Sécurisé et Fiable',
                'professional_counselors': 'Conseillers Professionnels',
                'privacy_protected': 'Confidentialité Protégée',
                
                // Navigation
                'nav_home': 'Accueil',
                'nav_therapy': 'Thérapie',
                'nav_meditation': 'Méditation',
                'nav_resources': 'Ressources',
                'nav_appointments': 'Rendez-vous',
                'nav_games': 'Jeux Mentaux',
                'nav_groups': 'Chat de Groupe',

                // Group Chat
                'groups_title': 'Chat de Groupe',
                'groups_description': 'Connectez-vous avec d\'autres qui comprennent ce que vous vivez',
                'mood_report_btn': 'Signaler Mon Humeur et Rejoindre le Groupe',
                'join_community': 'Rejoignez une Communauté de Soutien',
                'mood_prompt': 'Partagez votre humeur actuelle et connectez-vous avec d\'autres qui se sentent pareil',
                'current_group': 'Groupe Actuel',
                'group_members': 'Membres du Groupe',
                'change_mood': 'Changer d\'Humeur',
                'type_message': 'Tapez votre message...',
                'community_guidelines': 'Directives de la Communauté',
                'be_kind': 'Soyez gentil et solidaire avec tous les membres',
                'respect_privacy': 'Respectez la vie privée - ne partagez pas d\'informations personnelles',
                'share_experiences': 'Partagez vos expériences pour aider les autres',
                'safe_space': 'Rappelez-vous que c\'est un espace sûr pour tous',
                'group_chat': 'Chat de Groupe',
                'share_thoughts': 'Partagez vos pensées et soutenez les autres dans votre groupe d\'humeur',
                'you': 'Vous',
                'members': 'membres',
                'member': 'membre',
                'messages_today': 'messages aujourd\'hui',
                'last_activity': 'Dernière activité',
                'no_activity': 'Aucune activité',
                'view_details': 'Voir les Détails',
                'manage_group': 'Gérer',
                'active': 'Actif',
                'inactive': 'Inactif',
                'mood_updated': 'Humeur mise à jour avec succès !',
                'joined_group': 'Vous avez rejoint le {groupName} !',
                'group_change_success': 'Changement réussi vers {groupName} !',

                // Profile Menu
                'profile_settings': 'Paramètres',
                'profile_help': 'Aide et Support',
                'profile_logout': 'Déconnexion',

                // Section Titles and Descriptions
                'therapy_title': 'Ressources de Thérapie',
                'therapy_description': 'Techniques et exercices professionnels pour le bien-être mental',
                'meditation_title': 'Méditation et Mindfulness',
                'meditation_description': 'Pratiques guidées pour la paix intérieure et la concentration',
                'resources_title': 'Ressources et Soutien',
                'resources_description': 'Outils et matériaux pour votre parcours de bien-être',
                'appointment_title': 'Rendez-vous de Conseils',
                'appointment_description': 'Réservez des séances avec des conseillers spécialisés',
                'games_title': 'Jeux et Activités Mentaux',
                'games_description': 'Jouez à des jeux interactifs pour améliorer votre humeur et votre concentration',
                'mood_tracker_title': 'Comment vous sentez-vous aujourd\'hui?',
                'feeling_great': 'Je me sens génial!',
                'update_mood': 'Mettre à Jour l\'Humeur',

                // Therapy Types
                'cbt_title': 'Thérapie Cognitivo-Comportementale',
                'cbt_description': 'Apprenez à identifier et à changer les schémas de pensée négatifs',
                'dbt_title': 'Thérapie Dialectique Comportementale',
                'dbt_description': 'Développez des compétences pour la régulation émotionnelle et la tolérance à la détresse',
                'mbsr_title': 'Réduction du Stress Basée sur la Pleine Conscience',
                'mbsr_description': 'Cultivez la conscience du moment présent et réduisez le stress',
                'start_exercise': 'Commencer l\'Exercice',
                'read_more': 'En Savoir Plus',

                // Meditation Types
                'body_scan_title': 'Méditation du Scan Corporel',
                'body_scan_description': 'Un voyage systématique à travers les sensations physiques',
                'breathing_title': 'Respiration Focalisée',
                'breathing_description': 'Conscience respiratoire simple pour le soulagement du stress',
                'walking_title': 'Méditation Marchante',
                'walking_description': 'Mouvement conscient pour la relaxation active',
                'loving_kindness_title': 'Bienveillance Aimante',
                'loving_kindness_description': 'Cultivez la compassion envers vous-même et envers les autres',
                'start_meditation': 'Commencer la Séance',

                // Counselors
                'counselor_academic_name': 'Dr Sarah Johnson',
                'counselor_academic_specialty': 'Stress Académique et Gestion du Temps',
                'counselor_academic_description': 'Aide les étudiants à gérer la pression académique et à développer des stratégies d\'étude efficaces.',
                'counselor_relationship_name': 'Dr Michael Chen',
                'counselor_relationship_specialty': 'Relations et Vie Sociale',
                'counselor_relationship_description': 'Soutient les étudiants dans la navigation des amitiés, des rencontres et des dynamiques familiales.',
                'counselor_anxiety_name': 'Dr Emily Rodriguez',
                'counselor_anxiety_specialty': 'Anxiété et Dépression',
                'counselor_anxiety_description': 'Se spécialise dans le traitement des troubles anxieux et des préoccupations liées à l\'humeur.',
                'counselor_identity_name': 'Dr Alex Thompson',
                'counselor_identity_specialty': 'Identité et Croissance Personnelle',
                'counselor_identity_description': 'Aide les étudiants à explorer l\'identité, le but et le développement personnel.',
                'book_session': 'Réserver une Séance',
                
                // Common Actions
                'loading': 'Chargement...',
                'success': 'Succès!',
                'error': 'Erreur',
                'save': 'Enregistrer',
                'cancel': 'Annuler',
                'close': 'Fermer',
                'next': 'Suivant',
                'previous': 'Précédent',
                'continue': 'Continuer',
                'back': 'Retour',
                'submit': 'Soumettre',
                'delete': 'Supprimer',
                'edit': 'Modifier'
            }
        };
        
        this.init();
    }
    
    init() {
        this.setupLanguageSelector();
        this.updateLanguage();
    }
    
    setupLanguageSelector() {
        const languageSelect = document.getElementById('languageSelect');
        if (languageSelect) {
            languageSelect.value = this.currentLanguage;
            languageSelect.addEventListener('change', (e) => {
                this.setLanguage(e.target.value);
            });
        }
    }
    
    setLanguage(lang) {
        this.currentLanguage = lang;
        localStorage.setItem('campusMindspace_language', lang);
        this.updateLanguage();
    }
    
    updateLanguage() {
        const elements = document.querySelectorAll('[data-lang]');
        elements.forEach(element => {
            const key = element.getAttribute('data-lang');
            if (this.translations[this.currentLanguage] && this.translations[this.currentLanguage][key]) {
                element.textContent = this.translations[this.currentLanguage][key];
            }
        });
        
        // Update document language
        document.documentElement.lang = this.currentLanguage;
    }
    
    getText(key) {
        return this.translations[this.currentLanguage]?.[key] || key;
    }
    
    getCurrentLanguage() {
        return this.currentLanguage;
    }
}

// Global language manager instance
const languageManager = new LanguageManager();
