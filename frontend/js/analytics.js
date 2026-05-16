import { apiFetch, logout, checkAuth } from './api.js';

document.addEventListener('DOMContentLoaded', async () => {
    checkAuth();
    document.getElementById('logoutBtn').addEventListener('click', logout);

    try {
        const data = await apiFetch('/analytics');
        renderCategoryChart(data.categoryBreakdown);
        renderTrendChart(data.monthlyExpenses);
    } catch (err) {
        console.error('Failed to load analytics', err);
    }
});

function renderCategoryChart(data) {
    const ctx = document.getElementById('categoryChart').getContext('2d');
    
    if (!data || data.length === 0) {
        // Handle empty
        return;
    }

    const labels = data.map(d => d.category);
    const amounts = data.map(d => parseFloat(d.total));

    new Chart(ctx, {
        type: 'pie',
        data: {
            labels: labels,
            datasets: [{
                data: amounts,
                backgroundColor: [
                    '#58a6ff', '#2ea043', '#d29922', '#da3633', '#8b949e'
                ],
                borderWidth: 0
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { position: 'right', labels: { color: '#c9d1d9' } }
            }
        }
    });
}

function renderTrendChart(data) {
    const ctx = document.getElementById('trendChart').getContext('2d');
    
    if (!data || data.length === 0) {
        // Handle empty
        return;
    }

    const labels = data.map(d => d.month);
    const amounts = data.map(d => parseFloat(d.total));

    new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: 'Expenses',
                data: amounts,
                borderColor: '#da3633',
                backgroundColor: 'rgba(218, 54, 51, 0.1)',
                borderWidth: 2,
                fill: true,
                tension: 0.4
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: { grid: { color: 'rgba(255,255,255,0.05)' }, ticks: { color: '#8b949e' } },
                x: { grid: { color: 'rgba(255,255,255,0.05)' }, ticks: { color: '#8b949e' } }
            },
            plugins: {
                legend: { display: false }
            }
        }
    });
}
