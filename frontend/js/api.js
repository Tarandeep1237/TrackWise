const API_URL = 'http://localhost:8080/api';

const apiFetch = async (endpoint, options = {}) => {
    const token = localStorage.getItem('token');
    
    const headers = {
        'Content-Type': 'application/json',
        ...options.headers
    };

    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    try {
        const response = await fetch(`${API_URL}${endpoint}`, {
            ...options,
            headers
        });

        if (response.status === 401 || response.status === 403) {
            if (!window.location.href.includes('login.html') && !window.location.href.includes('register.html')) {
                logout();
                return;
            }
        }

        let data;
        const contentType = response.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
            data = await response.json();
        } else {
            const text = await response.text();
            data = text ? { message: text, error: text } : {};
        }

        if (!response.ok) {
            const errorMsg = typeof data === 'string' ? data : (data.error || data.message || 'Something went wrong');
            throw new Error(errorMsg);
        }

        return data;
    } catch (err) {
        throw err;
    }
};

const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = 'login.html';
};

const checkAuth = () => {
    const token = localStorage.getItem('token');
    if (!token && !window.location.href.includes('login.html') && !window.location.href.includes('register.html')) {
        window.location.href = 'login.html';
    }
    if (token && (window.location.href.includes('login.html') || window.location.href.includes('register.html'))) {
        window.location.href = 'index.html';
    }
};

// Formatting helpers
const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD'
    }).format(amount);
};

const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
};

// UI Helpers
const showAlert = (elementId, message, type = 'error') => {
    const alertEl = document.getElementById(elementId);
    if (!alertEl) return;
    
    alertEl.textContent = message;
    alertEl.className = `alert ${type}`;
    
    setTimeout(() => {
        alertEl.style.display = 'none';
        alertEl.className = 'alert';
    }, 5000);
};

export { apiFetch, logout, checkAuth, formatCurrency, formatDate, showAlert, API_URL };
