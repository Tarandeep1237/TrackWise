import { apiFetch, checkAuth, showAlert } from './api.js';

document.addEventListener('DOMContentLoaded', () => {
    checkAuth();

    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');

    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            
            const btn = loginForm.querySelector('button');
            btn.textContent = 'Signing In...';
            btn.disabled = true;

            try {
                const data = await apiFetch('/auth/login', {
                    method: 'POST',
                    body: JSON.stringify({ email, password })
                });

                localStorage.setItem('token', data.token);
                localStorage.setItem('user', JSON.stringify(data.user));
                
                showAlert('alertBox', 'Login successful! Redirecting...', 'success');
                setTimeout(() => {
                    window.location.href = 'index.html';
                }, 1000);
            } catch (err) {
                showAlert('alertBox', err.message);
                btn.textContent = 'Sign In';
                btn.disabled = false;
            }
        });
    }

    if (registerForm) {
        registerForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;

            const btn = registerForm.querySelector('button');
            btn.textContent = 'Registering...';
            btn.disabled = true;

            try {
                await apiFetch('/auth/register', {
                    method: 'POST',
                    body: JSON.stringify({ name, email, password })
                });

                showAlert('alertBox', 'Registration successful! Please login.', 'success');
                setTimeout(() => {
                    window.location.href = 'login.html';
                }, 1500);
            } catch (err) {
                showAlert('alertBox', err.message);
                btn.textContent = 'Join TrackWise';
                btn.disabled = false;
            }
        });
    }
});
