// Comprehensive Appointment Booking System
class AppointmentSystem {
    constructor() {
        this.appointments = JSON.parse(localStorage.getItem('appointments')) || [];
        this.counselors = this.getCounselorsData();
        this.availableTimeSlots = this.generateTimeSlots();
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.updateAppointmentDisplay();
    }

    setupEventListeners() {
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('book-btn')) {
                const counselorCard = e.target.closest('.counselor-card');
                const counselorType = counselorCard.dataset.counselor;
                this.showBookingModal(counselorType);
            }

            if (e.target.classList.contains('confirm-booking-btn')) {
                this.confirmBooking();
            }

            if (e.target.classList.contains('view-appointments-btn')) {
                this.showAppointmentsList();
            }

            if (e.target.classList.contains('cancel-appointment-btn')) {
                const appointmentId = e.target.dataset.appointmentId;
                this.cancelAppointment(appointmentId);
            }

            if (e.target.classList.contains('reschedule-appointment-btn')) {
                const appointmentId = e.target.dataset.appointmentId;
                this.rescheduleAppointment(appointmentId);
            }
        });

        // Date picker change
        document.addEventListener('change', (e) => {
            if (e.target.id === 'appointmentDate') {
                this.updateAvailableTimeSlots();
            }
        });
    }

    getCounselorsData() {
        return {
            academic: {
                name: 'Dr. Sarah Johnson',
                specialty: 'Academic Stress & Time Management',
                description: 'Helps students manage academic pressure and develop effective study strategies.',
                icon: 'fas fa-user-graduate',
                experience: '8 years',
                rating: 4.9,
                sessions: 245,
                availability: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
                timeSlots: ['09:00', '10:00', '11:00', '14:00', '15:00', '16:00']
            },
            relationship: {
                name: 'Dr. Michael Chen',
                specialty: 'Relationships & Social Life',
                description: 'Supports students navigating friendships, dating, and family dynamics.',
                icon: 'fas fa-users',
                experience: '6 years',
                rating: 4.8,
                sessions: 189,
                availability: ['Monday', 'Wednesday', 'Friday'],
                timeSlots: ['09:00', '11:00', '13:00', '15:00', '17:00']
            },
            anxiety: {
                name: 'Dr. Emily Rodriguez',
                specialty: 'Anxiety & Depression',
                description: 'Specializes in treating anxiety disorders and mood-related concerns.',
                icon: 'fas fa-heartbeat',
                experience: '10 years',
                rating: 4.9,
                sessions: 312,
                availability: ['Tuesday', 'Thursday', 'Saturday'],
                timeSlots: ['10:00', '12:00', '14:00', '16:00']
            },
            identity: {
                name: 'Dr. Alex Thompson',
                specialty: 'Identity & Personal Growth',
                description: 'Helps students explore identity, purpose, and personal development.',
                icon: 'fas fa-star',
                experience: '7 years',
                rating: 4.7,
                sessions: 156,
                availability: ['Monday', 'Tuesday', 'Thursday'],
                timeSlots: ['09:00', '11:00', '14:00', '16:00', '18:00']
            }
        };
    }

    generateTimeSlots() {
        const slots = [];
        for (let hour = 9; hour <= 18; hour++) {
            slots.push(`${hour.toString().padStart(2, '0')}:00`);
            if (hour < 18) {
                slots.push(`${hour.toString().padStart(2, '0')}:30`);
            }
        }
        return slots;
    }

    showBookingModal(counselorType) {
        const counselor = this.counselors[counselorType];
        if (!counselor) return;

        const modal = this.createModal('appointment-booking');
        
        modal.innerHTML = `
            <div class="appointment-booking-modal">
                <div class="modal-header">
                    <h2>Book Appointment with ${counselor.name}</h2>
                    <button class="close-modal">&times;</button>
                </div>
                <div class="booking-content">
                    <div class="counselor-info">
                        <div class="counselor-avatar">
                            <i class="${counselor.icon}"></i>
                        </div>
                        <div class="counselor-details">
                            <h3>${counselor.name}</h3>
                            <p class="specialty">${counselor.specialty}</p>
                            <div class="counselor-stats">
                                <span><i class="fas fa-star"></i> ${counselor.rating}</span>
                                <span><i class="fas fa-clock"></i> ${counselor.experience}</span>
                                <span><i class="fas fa-users"></i> ${counselor.sessions} sessions</span>
                            </div>
                        </div>
                    </div>

                    <div class="booking-form">
                        <div class="form-section">
                            <h3>Select Date</h3>
                            <input type="date" id="appointmentDate" min="${this.getMinDate()}" max="${this.getMaxDate()}">
                        </div>

                        <div class="form-section">
                            <h3>Select Time</h3>
                            <div class="time-slots" id="timeSlots">
                                <!-- Time slots will be populated here -->
                            </div>
                        </div>

                        <div class="form-section">
                            <h3>Session Type</h3>
                            <div class="session-types">
                                <label class="session-type-option">
                                    <input type="radio" name="sessionType" value="individual" checked>
                                    <div class="session-type-card">
                                        <i class="fas fa-user"></i>
                                        <span>Individual Session</span>
                                        <small>50 minutes • $80</small>
                                    </div>
                                </label>
                                <label class="session-type-option">
                                    <input type="radio" name="sessionType" value="group">
                                    <div class="session-type-card">
                                        <i class="fas fa-users"></i>
                                        <span>Group Session</span>
                                        <small>60 minutes • $40</small>
                                    </div>
                                </label>
                            </div>
                        </div>

                        <div class="form-section">
                            <h3>Your Information</h3>
                            <div class="info-fields">
                                <input type="text" id="studentName" placeholder="Your Name" required>
                                <input type="email" id="studentEmail" placeholder="Email Address" required>
                                <input type="tel" id="studentPhone" placeholder="Phone Number">
                            </div>
                        </div>

                        <div class="form-section">
                            <h3>Session Focus (Optional)</h3>
                            <textarea id="sessionFocus" placeholder="What would you like to focus on during this session? Any specific concerns or goals?"></textarea>
                        </div>

                        <div class="booking-actions">
                            <button class="confirm-booking-btn">Confirm Booking</button>
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
        this.updateAvailableTimeSlots();
    }

    updateAvailableTimeSlots() {
        const dateInput = document.getElementById('appointmentDate');
        const timeSlotsContainer = document.getElementById('timeSlots');
        
        if (!dateInput || !timeSlotsContainer) return;

        const selectedDate = dateInput.value;
        if (!selectedDate) {
            timeSlotsContainer.innerHTML = '<p>Please select a date first</p>';
            return;
        }

        const dayOfWeek = new Date(selectedDate).toLocaleDateString('en-US', { weekday: 'long' });
        const counselorType = this.getCurrentCounselorType();
        const counselor = this.counselors[counselorType];

        if (!counselor.availability.includes(dayOfWeek)) {
            timeSlotsContainer.innerHTML = '<p>No availability on this day. Please select a different date.</p>';
            return;
        }

        // Filter out booked time slots
        const bookedSlots = this.getBookedTimeSlots(selectedDate, counselorType);
        const availableSlots = counselor.timeSlots.filter(slot => !bookedSlots.includes(slot));

        if (availableSlots.length === 0) {
            timeSlotsContainer.innerHTML = '<p>No available time slots on this date.</p>';
            return;
        }

        timeSlotsContainer.innerHTML = availableSlots.map(slot => `
            <label class="time-slot-option">
                <input type="radio" name="timeSlot" value="${slot}">
                <span class="time-slot">${slot}</span>
            </label>
        `).join('');
    }

    getCurrentCounselorType() {
        const modal = document.querySelector('.appointment-booking-modal');
        if (!modal) return null;
        
        const counselorName = modal.querySelector('h2').textContent;
        return Object.keys(this.counselors).find(type => 
            counselorName.includes(this.counselors[type].name)
        );
    }

    getBookedTimeSlots(date, counselorType) {
        return this.appointments
            .filter(apt => apt.date === date && apt.counselorType === counselorType)
            .map(apt => apt.timeSlot);
    }

    getMinDate() {
        const today = new Date();
        return today.toISOString().split('T')[0];
    }

    getMaxDate() {
        const maxDate = new Date();
        maxDate.setDate(maxDate.getDate() + 30);
        return maxDate.toISOString().split('T')[0];
    }

    confirmBooking() {
        const counselorType = this.getCurrentCounselorType();
        const counselor = this.counselors[counselorType];
        
        const date = document.getElementById('appointmentDate').value;
        const timeSlot = document.querySelector('input[name="timeSlot"]:checked')?.value;
        const sessionType = document.querySelector('input[name="sessionType"]:checked')?.value;
        const name = document.getElementById('studentName').value;
        const email = document.getElementById('studentEmail').value;
        const phone = document.getElementById('studentPhone').value;
        const focus = document.getElementById('sessionFocus').value;

        // Validation
        if (!date || !timeSlot || !sessionType || !name || !email) {
            this.showNotification('Please fill in all required fields', 'warning');
            return;
        }

        const appointment = {
            id: Date.now().toString(),
            counselorType,
            counselorName: counselor.name,
            counselorSpecialty: counselor.specialty,
            date,
            timeSlot,
            sessionType,
            studentName: name,
            studentEmail: email,
            studentPhone: phone,
            sessionFocus: focus,
            status: 'confirmed',
            createdAt: new Date().toISOString(),
            meetingLink: this.generateMeetingLink()
        };

        this.appointments.push(appointment);
        this.saveAppointments();
        this.updateAppointmentDisplay();
        
        this.showNotification('Appointment booked successfully!', 'success');
        this.closeModal(document.querySelector('.appointment-booking-modal').parentNode);
        
        // Show confirmation details
        this.showBookingConfirmation(appointment);
    }

    generateMeetingLink() {
        return `https://meet.campusmindspace.edu/session/${Date.now()}`;
    }

    showBookingConfirmation(appointment) {
        const modal = this.createModal('booking-confirmation');
        
        modal.innerHTML = `
            <div class="booking-confirmation-modal">
                <div class="modal-header">
                    <h2>Appointment Confirmed!</h2>
                    <button class="close-modal">&times;</button>
                </div>
                <div class="confirmation-content">
                    <div class="confirmation-icon">
                        <i class="fas fa-check-circle"></i>
                    </div>
                    <div class="appointment-details">
                        <h3>Appointment Details</h3>
                        <div class="detail-item">
                            <strong>Counselor:</strong> ${appointment.counselorName}
                        </div>
                        <div class="detail-item">
                            <strong>Specialty:</strong> ${appointment.counselorSpecialty}
                        </div>
                        <div class="detail-item">
                            <strong>Date:</strong> ${new Date(appointment.date).toLocaleDateString()}
                        </div>
                        <div class="detail-item">
                            <strong>Time:</strong> ${appointment.timeSlot}
                        </div>
                        <div class="detail-item">
                            <strong>Session Type:</strong> ${appointment.sessionType.charAt(0).toUpperCase() + appointment.sessionType.slice(1)}
                        </div>
                        <div class="detail-item">
                            <strong>Meeting Link:</strong> 
                            <a href="${appointment.meetingLink}" target="_blank">Join Session</a>
                        </div>
                    </div>
                    <div class="confirmation-actions">
                        <button class="add-to-calendar-btn" onclick="window.open('${this.generateCalendarLink(appointment)}', '_blank')">
                            <i class="fas fa-calendar-plus"></i> Add to Calendar
                        </button>
                        <button class="view-appointments-btn">View All Appointments</button>
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

    generateCalendarLink(appointment) {
        const startDate = new Date(`${appointment.date}T${appointment.timeSlot}:00`);
        const endDate = new Date(startDate.getTime() + 50 * 60000); // 50 minutes later
        
        const title = encodeURIComponent(`Counseling Session - ${appointment.counselorName}`);
        const details = encodeURIComponent(`Session with ${appointment.counselorName} (${appointment.counselorSpecialty})\n\nMeeting Link: ${appointment.meetingLink}`);
        const location = encodeURIComponent(appointment.meetingLink);
        
        const startStr = startDate.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
        const endStr = endDate.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
        
        return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${startStr}/${endStr}&details=${details}&location=${location}`;
    }

    showAppointmentsList() {
        const modal = this.createModal('appointments-list');
        
        const upcomingAppointments = this.appointments
            .filter(apt => new Date(apt.date) >= new Date())
            .sort((a, b) => new Date(a.date + 'T' + a.timeSlot) - new Date(b.date + 'T' + b.timeSlot));
        
        modal.innerHTML = `
            <div class="appointments-list-modal">
                <div class="modal-header">
                    <h2>Your Appointments</h2>
                    <button class="close-modal">&times;</button>
                </div>
                <div class="appointments-content">
                    ${upcomingAppointments.length === 0 ? `
                        <div class="no-appointments">
                            <i class="fas fa-calendar-times"></i>
                            <h3>No Upcoming Appointments</h3>
                            <p>You don't have any upcoming appointments. Book a session to get started!</p>
                        </div>
                    ` : `
                        <div class="appointments-list">
                            ${upcomingAppointments.map(appointment => `
                                <div class="appointment-item">
                                    <div class="appointment-info">
                                        <div class="appointment-date">
                                            <div class="date-day">${new Date(appointment.date).getDate()}</div>
                                            <div class="date-month">${new Date(appointment.date).toLocaleDateString('en-US', { month: 'short' })}</div>
                                        </div>
                                        <div class="appointment-details">
                                            <h4>${appointment.counselorName}</h4>
                                            <p class="specialty">${appointment.counselorSpecialty}</p>
                                            <div class="appointment-meta">
                                                <span><i class="fas fa-clock"></i> ${appointment.timeSlot}</span>
                                                <span><i class="fas fa-users"></i> ${appointment.sessionType}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="appointment-actions">
                                        <a href="${appointment.meetingLink}" target="_blank" class="join-session-btn">
                                            <i class="fas fa-video"></i> Join
                                        </a>
                                        <button class="reschedule-appointment-btn" data-appointment-id="${appointment.id}">
                                            <i class="fas fa-edit"></i> Reschedule
                                        </button>
                                        <button class="cancel-appointment-btn" data-appointment-id="${appointment.id}">
                                            <i class="fas fa-times"></i> Cancel
                                        </button>
                                    </div>
                                </div>
                            `).join('')}
                        </div>
                    `}
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

    cancelAppointment(appointmentId) {
        if (confirm('Are you sure you want to cancel this appointment?')) {
            this.appointments = this.appointments.filter(apt => apt.id !== appointmentId);
            this.saveAppointments();
            this.updateAppointmentDisplay();
            this.showNotification('Appointment cancelled successfully', 'info');
            this.showAppointmentsList(); // Refresh the list
        }
    }

    rescheduleAppointment(appointmentId) {
        const appointment = this.appointments.find(apt => apt.id === appointmentId);
        if (appointment) {
            this.showBookingModal(appointment.counselorType);
            this.closeModal(document.querySelector('.appointments-list-modal').parentNode);
        }
    }

    updateAppointmentDisplay() {
        const upcomingCount = this.appointments.filter(apt => new Date(apt.date) >= new Date()).length;
        
        // Update any appointment counters in the UI
        const appointmentCounters = document.querySelectorAll('.appointment-count');
        appointmentCounters.forEach(counter => {
            counter.textContent = upcomingCount;
        });
    }

    saveAppointments() {
        localStorage.setItem('appointments', JSON.stringify(this.appointments));
    }

    createModal(className) {
        const modal = document.createElement('div');
        modal.className = `appointment-modal ${className}`;
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
        notification.className = `appointment-notification ${type}`;
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
        }, 5000);
    }
}

// Initialize appointment system when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.appointmentSystem = new AppointmentSystem();
});
