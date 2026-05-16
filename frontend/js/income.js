import { apiFetch, logout, checkAuth, formatCurrency, formatDate, showAlert } from './api.js';

let incomes = [];

document.addEventListener('DOMContentLoaded', async () => {
    checkAuth();
    
    document.getElementById('logoutBtn').addEventListener('click', logout);
    document.getElementById('incomeForm').addEventListener('submit', handleIncomeSubmit);
    document.getElementById('cancelBtn').addEventListener('click', resetForm);

    await fetchIncomes();
});

async function fetchIncomes() {
    try {
        incomes = await apiFetch('/income');
        renderIncomes();
    } catch (err) {
        showAlert('alertBox', 'Failed to load income data', 'error');
    }
}

function renderIncomes() {
    const list = document.getElementById('incomeList');
    list.innerHTML = '';

    if (incomes.length === 0) {
        list.innerHTML = '<tr><td colspan="4" style="text-align: center;">No income recorded yet.</td></tr>';
        return;
    }

    incomes.forEach(i => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${formatDate(i.date)}</td>
            <td>${i.source}</td>
            <td style="color: var(--success); font-weight: 600;">${formatCurrency(i.amount)}</td>
            <td>
                <button class="btn btn-primary btn-sm edit-btn" style="padding: 6px 10px; font-size: 0.8rem; margin-right: 5px;" data-id="${i.id}">Edit</button>
                <button class="btn btn-danger btn-sm delete-btn" style="padding: 6px 10px; font-size: 0.8rem;" data-id="${i.id}">Del</button>
            </td>
        `;
        list.appendChild(tr);
    });

    document.querySelectorAll('.edit-btn').forEach(btn => {
        btn.addEventListener('click', (e) => editIncome(e.target.dataset.id));
    });

    document.querySelectorAll('.delete-btn').forEach(btn => {
        btn.addEventListener('click', (e) => removeIncome(e.target.dataset.id));
    });
}

function editIncome(id) {
    const income = incomes.find(i => i.id == id);
    if (!income) return;

    document.getElementById('incomeId').value = income.id;
    document.getElementById('amount').value = income.amount;
    document.getElementById('source').value = income.source;
    document.getElementById('date').value = income.date.split('T')[0];

    document.getElementById('submitBtn').textContent = 'Update Income';
    document.getElementById('cancelBtn').style.display = 'block';
}

function resetForm() {
    document.getElementById('incomeForm').reset();
    document.getElementById('incomeId').value = '';
    document.getElementById('submitBtn').textContent = 'Add Income';
    document.getElementById('cancelBtn').style.display = 'none';
}

async function handleIncomeSubmit(e) {
    e.preventDefault();
    
    const id = document.getElementById('incomeId').value;
    const amount = document.getElementById('amount').value;
    const source = document.getElementById('source').value;
    const date = document.getElementById('date').value;

    const payload = { amount, source, date };

    try {
        if (id) {
            await apiFetch(`/income/${id}`, { method: 'PUT', body: JSON.stringify(payload) });
            showAlert('alertBox', 'Income updated successfully', 'success');
        } else {
            await apiFetch('/income', { method: 'POST', body: JSON.stringify(payload) });
            showAlert('alertBox', 'Income added successfully', 'success');
        }
        
        resetForm();
        await fetchIncomes();
    } catch (err) {
        showAlert('alertBox', err.message, 'error');
    }
}

async function removeIncome(id) {
    if (!confirm('Are you sure you want to delete this income entry?')) return;
    
    try {
        await apiFetch(`/income/${id}`, { method: 'DELETE' });
        showAlert('alertBox', 'Income deleted', 'success');
        await fetchIncomes();
    } catch (err) {
        showAlert('alertBox', err.message, 'error');
    }
}
