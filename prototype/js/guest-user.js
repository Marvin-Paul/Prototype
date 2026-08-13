// Guest / Demo User Module
// Authentication is removed for the prototype. All features run under a fixed
// demo identity so mood logs, appointments, meditation sessions and mood groups
// keep persisting to Supabase without a login flow.
class GuestUser {
    static profile() {
        return {
            id: 'demo-student-0001',
            fullName: 'Demo Student',
            firstName: 'Demo',
            email: 'demo@campusmindspace.app',
            initialMood: 'happy',
            currentMood: 'happy',
            isGuest: true
        };
    }

    // Returns the active (demo) user and guarantees it is available in
    // localStorage for pages that read campusMindspace_currentUser.
    static get() {
        const saved = AppUtils.get('campusMindspace_currentUser');
        if (saved && saved.id) return saved;
        const profile = this.profile();
        AppUtils.set('campusMindspace_currentUser', profile);
        return profile;
    }

    // Alias matching the old `const user = ...` call sites.
    static currentUser() {
        return this.get();
    }
}
