import { apiFetch, logout, checkAuth, formatCurrency, formatDate } from './api.js';

document.addEventListener('DOMContentLoaded', async () => {
    checkAuth();
    
    document.getElementById('logoutBtn').addEventListener('click', logout);
    
    const user = JSON.parse(localStorage.getItem('user'));
    if (user) {
        document.getElementById('userNameDisplay').textContent = `${user.name}'s Dashboard`;
    }

    try {
        const [analyticsData, expensesData, incomeData] = await Promise.all([
            apiFetch('/analytics'),
            apiFetch('/expenses'),
            apiFetch('/income')
        ]);

        document.getElementById('incomeTotal').textContent = formatCurrency(analyticsData.totalIncome);
        document.getElementById('expenseTotal').textContent = formatCurrency(analyticsData.totalExpense);
        
        const balanceEl = document.getElementById('balanceTotal');
        balanceEl.textContent = formatCurrency(analyticsData.balance);
        if (analyticsData.balance < 0) balanceEl.className = 'amount negative';
        else if (analyticsData.balance > 0) balanceEl.className = 'amount positive';

        renderRecentTransactions(expensesData, incomeData);
        renderChart(analyticsData);

    } catch (err) {
        console.error('Error loading dashboard data:', err);
    }
});

function renderRecentTransactions(expenses, incomes) {
    const tbody = document.getElementById('recentTransactions');
    tbody.innerHTML = '';

    const allTransactions = [
        ...expenses.map(e => ({ ...e, type: 'Expense' })),
        ...incomes.map(i => ({ ...i, type: 'Income' }))
    ].sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 5);

    if (allTransactions.length === 0) {
        tbody.innerHTML = '<tr><td colspan="4" style="text-align: center;">No recent transactions</td></tr>';
        return;
    }

    allTransactions.forEach(t => {
        const tr = document.createElement('tr');
        const color = t.type === 'Income' ? 'var(--success)' : 'var(--danger)';
        
        tr.innerHTML = `
            <td>${formatDate(t.date)}</td>
            <td style="color: ${color}; font-weight: 500;">${t.type}</td>
            <td>${t.category || t.source}</td>
            <td style="color: ${color}; font-weight: 600;">${formatCurrency(t.amount)}</td>
        `;
        tbody.appendChild(tr);
    });
}

function renderChart(data) {
    const ctx = document.getElementById('balanceChart').getContext('2d');
    
    new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: ['Income', 'Expenses'],
            datasets: [{
                data: [data.totalIncome, data.totalExpense],
                backgroundColor: ['#2ea043', '#da3633'],
                borderWidth: 0,
                hoverOffset: 4
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: { position: 'bottom', labels: { color: '#8b949e' } }
            },
            cutout: '70%'
        }
    });
}
