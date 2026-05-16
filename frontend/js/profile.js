import { apiFetch, logout, checkAuth, formatDate } from './api.js';

document.addEventListener('DOMContentLoaded', async () => {
    checkAuth();
    
    document.getElementById('logoutBtn').addEventListener('click', logout);

    try {
        const userData = await apiFetch('/auth/me');
        
        document.getElementById('profileName').textContent = userData.name;
        document.getElementById('profileEmail').textContent = userData.email;
        document.getElementById('profileId').textContent = `#${userData.id.toString().padStart(4, '0')}`;
        document.getElementById('profileDate').textContent = formatDate(userData.created_at);
        
        // Generate Initials
        if (userData.name) {
            const initials = userData.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
            document.getElementById('profileInitials').textContent = initials;
        }

    } catch (err) {
        console.error('Failed to load profile', err);
        const alertBox = document.getElementById('alertBox');
        alertBox.textContent = 'Failed to load profile data.';
        alertBox.className = 'alert error';
        alertBox.style.display = 'block';
    }
});
