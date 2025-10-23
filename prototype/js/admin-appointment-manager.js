// Admin Appointment Management System
class AdminAppointmentManager {
    constructor() {
        this.appointments = JSON.parse(localStorage.getItem('appointments')) || [];
        this.filteredAppointments = [...this.appointments];
        this.currentAppointment = null;
        this.counselors = this.getCounselorsData();
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.loadAppointments();
        this.updateStatistics();
        this.setupAutoRefresh();
    }

    setupEventListeners() {
        // Filter change events
        document.addEventListener('change', (e) => {
            if (e.target.id === 'appointmentDateFilter' || 
                e.target.id === 'counselorFilter' || 
                e.target.id === 'statusFilter') {
                this.applyFilters();
            }
        });

        // Table row click events
        document.addEventListener('click', (e) => {
            if (e.target.closest('.appointment-row')) {
                const row = e.target.closest('.appointment-row');
                const appointmentId = row.dataset.appointmentId;
                this.showAppointmentDetails(appointmentId);
            }
        });
    }

    getCounselorsData() {
        return {
            academic: {
                name: 'Dr. Sarah Johnson',
                specialty: 'Academic Stress & Time Management',
                icon: 'fas fa-user-graduate'
            },
            relationship: {
                name: 'Dr. Michael Chen',
                specialty: 'Relationships & Social Life',
                icon: 'fas fa-users'
            },
            anxiety: {
                name: 'Dr. Emily Rodriguez',
                specialty: 'Anxiety & Depression',
                icon: 'fas fa-heartbeat'
            },
            identity: {
                name: 'Dr. Alex Thompson',
                specialty: 'Identity & Personal Growth',
                icon: 'fas fa-star'
            }
        };
    }

    loadAppointments() {
        this.appointments = JSON.parse(localStorage.getItem('appointments')) || [];
        this.filteredAppointments = [...this.appointments];
        this.renderAppointmentsTable();
        this.updateStatistics();
    }

    renderAppointmentsTable() {
        const tbody = document.getElementById('appointmentsTableBody');
        if (!tbody) return;

        if (this.filteredAppointments.length === 0) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="8" class="no-appointments">
                        <div class="no-appointments-content">
                            <i class="fas fa-calendar-times"></i>
                            <h3>No Appointments Found</h3>
                            <p>No appointments match the current filters.</p>
                        </div>
                    </td>
                </tr>
            `;
            return;
        }

        tbody.innerHTML = this.filteredAppointments.map(appointment => {
            const counselor = this.counselors[appointment.counselorType];
            const appointmentDate = new Date(appointment.date);
            const isToday = this.isToday(appointmentDate);
            const isPast = appointmentDate < new Date();
            
            return `
                <tr class="appointment-row ${isToday ? 'today' : ''} ${isPast ? 'past' : ''}" 
                    data-appointment-id="${appointment.id}">
                    <td class="student-info">
                        <div class="student-avatar">
                            <i class="fas fa-user"></i>
                        </div>
                        <div class="student-details">
                            <strong>${appointment.studentName}</strong>
                            <small>${appointment.studentEmail}</small>
                        </div>
                    </td>
                    <td class="counselor-info">
                        <div class="counselor-avatar">
                            <i class="${counselor.icon}"></i>
                        </div>
                        <div class="counselor-details">
                            <strong>${appointment.counselorName}</strong>
                            <small>${appointment.counselorSpecialty}</small>
                        </div>
                    </td>
                    <td class="datetime-info">
                        <div class="date-info">
                            <strong>${appointmentDate.toLocaleDateString()}</strong>
                            <small>${appointment.timeSlot}</small>
                        </div>
                        ${isToday ? '<span class="today-badge">Today</span>' : ''}
                    </td>
                    <td class="session-type">
                        <span class="session-badge ${appointment.sessionType}">
                            <i class="fas fa-${appointment.sessionType === 'individual' ? 'user' : 'users'}"></i>
                            ${appointment.sessionType.charAt(0).toUpperCase() + appointment.sessionType.slice(1)}
                        </span>
                    </td>
                    <td class="status-info">
                        <span class="status-badge ${appointment.status}">
                            ${this.getStatusIcon(appointment.status)}
                            ${appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
                        </span>
                    </td>
                    <td class="contact-info">
                        <div class="contact-details">
                            <div><i class="fas fa-envelope"></i> ${appointment.studentEmail}</div>
                            ${appointment.studentPhone ? `<div><i class="fas fa-phone"></i> ${appointment.studentPhone}</div>` : ''}
                        </div>
                    </td>
                    <td class="session-focus">
                        <div class="focus-text">
                            ${appointment.sessionFocus ? 
                                `<span title="${appointment.sessionFocus}">${this.truncateText(appointment.sessionFocus, 50)}</span>` : 
                                '<span class="no-focus">No focus specified</span>'
                            }
                        </div>
                    </td>
                    <td class="actions">
                        <div class="action-buttons">
                            <button class="view-btn" onclick="window.adminAppointmentManager.showAppointmentDetails('${appointment.id}')" title="View Details">
                                <i class="fas fa-eye"></i>
                            </button>
                            <button class="edit-btn" onclick="window.adminAppointmentManager.editAppointment('${appointment.id}')" title="Edit">
                                <i class="fas fa-edit"></i>
                            </button>
                            <button class="status-btn" onclick="window.adminAppointmentManager.toggleStatus('${appointment.id}')" title="Change Status">
                                <i class="fas fa-toggle-on"></i>
                            </button>
                        </div>
                    </td>
                </tr>
            `;
        }).join('');
    }

    updateStatistics() {
        const today = new Date();
        const startOfWeek = new Date(today);
        startOfWeek.setDate(today.getDate() - today.getDay());
        
        const todayAppointments = this.appointments.filter(apt => 
            this.isToday(new Date(apt.date))
        ).length;
        
        const weekAppointments = this.appointments.filter(apt => {
            const aptDate = new Date(apt.date);
            return aptDate >= startOfWeek && aptDate <= today;
        }).length;
        
        const pendingAppointments = this.appointments.filter(apt => 
            apt.status === 'confirmed' && new Date(apt.date) >= today
        ).length;
        
        const completedAppointments = this.appointments.filter(apt => 
            apt.status === 'completed'
        ).length;

        // Update statistics display
        this.updateStatElement('todayAppointments', todayAppointments);
        this.updateStatElement('weekAppointments', weekAppointments);
        this.updateStatElement('pendingAppointments', pendingAppointments);
        this.updateStatElement('completedAppointments', completedAppointments);
    }

    updateStatElement(id, value) {
        const element = document.getElementById(id);
        if (element) {
            element.textContent = value;
        }
    }

    applyFilters() {
        const dateFilter = document.getElementById('appointmentDateFilter')?.value;
        const counselorFilter = document.getElementById('counselorFilter')?.value;
        const statusFilter = document.getElementById('statusFilter')?.value;

        this.filteredAppointments = this.appointments.filter(appointment => {
            const matchesDate = !dateFilter || appointment.date === dateFilter;
            const matchesCounselor = !counselorFilter || appointment.counselorType === counselorFilter;
            const matchesStatus = !statusFilter || appointment.status === statusFilter;
            
            return matchesDate && matchesCounselor && matchesStatus;
        });

        this.renderAppointmentsTable();
    }

    showAppointmentDetails(appointmentId) {
        const appointment = this.appointments.find(apt => apt.id === appointmentId);
        if (!appointment) return;

        this.currentAppointment = appointment;
        const counselor = this.counselors[appointment.counselorType];
        const modal = document.getElementById('appointmentDetailsModal');
        const content = document.getElementById('appointmentDetailsContent');

        content.innerHTML = `
            <div class="appointment-details-content">
                <div class="details-header">
                    <div class="appointment-id">
                        <strong>Appointment ID:</strong> ${appointment.id}
                    </div>
                    <div class="appointment-status">
                        <span class="status-badge ${appointment.status}">
                            ${this.getStatusIcon(appointment.status)}
                            ${appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
                        </span>
                    </div>
                </div>

                <div class="details-grid">
                    <div class="detail-section">
                        <h4><i class="fas fa-user"></i> Student Information</h4>
                        <div class="detail-items">
                            <div class="detail-item">
                                <strong>Name:</strong> ${appointment.studentName}
                            </div>
                            <div class="detail-item">
                                <strong>Email:</strong> ${appointment.studentEmail}
                            </div>
                            <div class="detail-item">
                                <strong>Phone:</strong> ${appointment.studentPhone || 'Not provided'}
                            </div>
                        </div>
                    </div>

                    <div class="detail-section">
                        <h4><i class="fas fa-user-md"></i> Counselor Information</h4>
                        <div class="detail-items">
                            <div class="detail-item">
                                <strong>Name:</strong> ${appointment.counselorName}
                            </div>
                            <div class="detail-item">
                                <strong>Specialty:</strong> ${appointment.counselorSpecialty}
                            </div>
                            <div class="detail-item">
                                <strong>Type:</strong> ${appointment.counselorType.charAt(0).toUpperCase() + appointment.counselorType.slice(1)}
                            </div>
                        </div>
                    </div>

                    <div class="detail-section">
                        <h4><i class="fas fa-calendar"></i> Appointment Details</h4>
                        <div class="detail-items">
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
                    </div>

                    <div class="detail-section">
                        <h4><i class="fas fa-comment"></i> Session Focus</h4>
                        <div class="session-focus-content">
                            ${appointment.sessionFocus ? 
                                `<p>${appointment.sessionFocus}</p>` : 
                                '<p class="no-focus">No specific focus mentioned by the student.</p>'
                            }
                        </div>
                    </div>

                    <div class="detail-section">
                        <h4><i class="fas fa-info-circle"></i> Additional Information</h4>
                        <div class="detail-items">
                            <div class="detail-item">
                                <strong>Booked On:</strong> ${new Date(appointment.createdAt).toLocaleString()}
                            </div>
                            <div class="detail-item">
                                <strong>Last Updated:</strong> ${appointment.updatedAt ? new Date(appointment.updatedAt).toLocaleString() : 'Never'}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;

        modal.style.display = 'block';
    }

    closeDetailsModal() {
        const modal = document.getElementById('appointmentDetailsModal');
        if (modal) {
            modal.style.display = 'none';
        }
        this.currentAppointment = null;
    }

    editAppointment(appointmentId) {
        const appointment = appointmentId ? 
            this.appointments.find(apt => apt.id === appointmentId) : 
            this.currentAppointment;
        
        if (!appointment) return;

        // Create edit modal
        const modal = this.createModal('edit-appointment-modal');
        const counselor = this.counselors[appointment.counselorType];

        modal.innerHTML = `
            <div class="edit-appointment-modal">
                <div class="modal-header">
                    <h2>Edit Appointment</h2>
                    <button class="close-modal">&times;</button>
                </div>
                <div class="edit-content">
                    <form id="editAppointmentForm">
                        <div class="form-section">
                            <h3>Student Information</h3>
                            <div class="form-group">
                                <label for="editStudentName">Student Name:</label>
                                <input type="text" id="editStudentName" value="${appointment.studentName}" required>
                            </div>
                            <div class="form-group">
                                <label for="editStudentEmail">Email:</label>
                                <input type="email" id="editStudentEmail" value="${appointment.studentEmail}" required>
                            </div>
                            <div class="form-group">
                                <label for="editStudentPhone">Phone:</label>
                                <input type="tel" id="editStudentPhone" value="${appointment.studentPhone || ''}">
                            </div>
                        </div>

                        <div class="form-section">
                            <h3>Appointment Details</h3>
                            <div class="form-group">
                                <label for="editAppointmentDate">Date:</label>
                                <input type="date" id="editAppointmentDate" value="${appointment.date}" required>
                            </div>
                            <div class="form-group">
                                <label for="editTimeSlot">Time:</label>
                                <select id="editTimeSlot" required>
                                    <option value="${appointment.timeSlot}" selected>${appointment.timeSlot}</option>
                                    ${this.generateTimeSlotOptions(appointment.timeSlot)}
                                </select>
                            </div>
                            <div class="form-group">
                                <label for="editSessionType">Session Type:</label>
                                <select id="editSessionType" required>
                                    <option value="individual" ${appointment.sessionType === 'individual' ? 'selected' : ''}>Individual</option>
                                    <option value="group" ${appointment.sessionType === 'group' ? 'selected' : ''}>Group</option>
                                </select>
                            </div>
                            <div class="form-group">
                                <label for="editStatus">Status:</label>
                                <select id="editStatus" required>
                                    <option value="confirmed" ${appointment.status === 'confirmed' ? 'selected' : ''}>Confirmed</option>
                                    <option value="completed" ${appointment.status === 'completed' ? 'selected' : ''}>Completed</option>
                                    <option value="cancelled" ${appointment.status === 'cancelled' ? 'selected' : ''}>Cancelled</option>
                                    <option value="no-show" ${appointment.status === 'no-show' ? 'selected' : ''}>No Show</option>
                                </select>
                            </div>
                        </div>

                        <div class="form-section">
                            <h3>Session Focus</h3>
                            <div class="form-group">
                                <label for="editSessionFocus">Focus/Notes:</label>
                                <textarea id="editSessionFocus" rows="4">${appointment.sessionFocus || ''}</textarea>
                            </div>
                        </div>

                        <div class="form-actions">
                            <button type="button" class="cancel-btn" onclick="window.adminAppointmentManager.closeModal(this.closest('.appointment-modal'))">
                                Cancel
                            </button>
                            <button type="submit" class="save-btn">
                                <i class="fas fa-save"></i> Save Changes
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        `;

        modal.addEventListener('click', (e) => {
            if (e.target.classList.contains('close-modal')) {
                this.closeModal(modal);
            }
        });

        // Handle form submission
        const form = modal.querySelector('#editAppointmentForm');
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            this.saveAppointmentChanges(appointment.id, modal);
        });

        document.body.appendChild(modal);
    }

    saveAppointmentChanges(appointmentId, modal) {
        const appointment = this.appointments.find(apt => apt.id === appointmentId);
        if (!appointment) return;

        // Get form values
        const updatedData = {
            studentName: document.getElementById('editStudentName').value,
            studentEmail: document.getElementById('editStudentEmail').value,
            studentPhone: document.getElementById('editStudentPhone').value,
            date: document.getElementById('editAppointmentDate').value,
            timeSlot: document.getElementById('editTimeSlot').value,
            sessionType: document.getElementById('editSessionType').value,
            status: document.getElementById('editStatus').value,
            sessionFocus: document.getElementById('editSessionFocus').value,
            updatedAt: new Date().toISOString()
        };

        // Update appointment
        Object.assign(appointment, updatedData);
        
        // Save to localStorage
        localStorage.setItem('appointments', JSON.stringify(this.appointments));
        
        // Refresh display
        this.loadAppointments();
        this.closeModal(modal);
        
        this.showNotification('Appointment updated successfully!', 'success');
    }

    toggleStatus(appointmentId) {
        const appointment = this.appointments.find(apt => apt.id === appointmentId);
        if (!appointment) return;

        const statusOptions = ['confirmed', 'completed', 'cancelled', 'no-show'];
        const currentIndex = statusOptions.indexOf(appointment.status);
        const nextIndex = (currentIndex + 1) % statusOptions.length;
        
        appointment.status = statusOptions[nextIndex];
        appointment.updatedAt = new Date().toISOString();
        
        localStorage.setItem('appointments', JSON.stringify(this.appointments));
        this.loadAppointments();
        
        this.showNotification(`Appointment status changed to ${appointment.status}`, 'info');
    }

    exportAppointments() {
        const csvContent = this.generateCSV();
        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `appointments_${new Date().toISOString().split('T')[0]}.csv`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
        
        this.showNotification('Appointments exported successfully!', 'success');
    }

    generateCSV() {
        const headers = [
            'ID', 'Student Name', 'Student Email', 'Student Phone',
            'Counselor Name', 'Counselor Specialty', 'Date', 'Time',
            'Session Type', 'Status', 'Session Focus', 'Meeting Link',
            'Created At', 'Updated At'
        ];

        const rows = this.filteredAppointments.map(appointment => [
            appointment.id,
            appointment.studentName,
            appointment.studentEmail,
            appointment.studentPhone || '',
            appointment.counselorName,
            appointment.counselorSpecialty,
            appointment.date,
            appointment.timeSlot,
            appointment.sessionType,
            appointment.status,
            appointment.sessionFocus || '',
            appointment.meetingLink,
            appointment.createdAt,
            appointment.updatedAt || ''
        ]);

        return [headers, ...rows].map(row => 
            row.map(field => `"${field}"`).join(',')
        ).join('\n');
    }

    refreshAppointments() {
        this.loadAppointments();
        this.showNotification('Appointments refreshed!', 'info');
    }

    setupAutoRefresh() {
        // Refresh every 5 minutes
        setInterval(() => {
            this.loadAppointments();
        }, 5 * 60 * 1000);
    }

    // Utility methods
    isToday(date) {
        const today = new Date();
        return date.toDateString() === today.toDateString();
    }

    getStatusIcon(status) {
        const icons = {
            confirmed: '<i class="fas fa-check-circle"></i>',
            completed: '<i class="fas fa-check-double"></i>',
            cancelled: '<i class="fas fa-times-circle"></i>',
            'no-show': '<i class="fas fa-user-times"></i>'
        };
        return icons[status] || '<i class="fas fa-question-circle"></i>';
    }

    truncateText(text, maxLength) {
        return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
    }

    generateTimeSlotOptions(currentSlot) {
        const slots = [];
        for (let hour = 9; hour <= 18; hour++) {
            slots.push(`${hour.toString().padStart(2, '0')}:00`);
            if (hour < 18) {
                slots.push(`${hour.toString().padStart(2, '0')}:30`);
            }
        }
        
        return slots.filter(slot => slot !== currentSlot)
            .map(slot => `<option value="${slot}">${slot}</option>`)
            .join('');
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
        notification.className = `admin-notification ${type}`;
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

// Initialize admin appointment manager when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.adminAppointmentManager = new AdminAppointmentManager();
});
