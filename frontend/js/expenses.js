import { apiFetch, logout, checkAuth, formatCurrency, formatDate, showAlert } from './api.js';

let expenses = [];

document.addEventListener('DOMContentLoaded', async () => {
    checkAuth();
    
    document.getElementById('logoutBtn').addEventListener('click', logout);
    document.getElementById('expenseForm').addEventListener('submit', handleExpenseSubmit);
    document.getElementById('cancelBtn').addEventListener('click', resetForm);

    await fetchExpenses();
});

async function fetchExpenses() {
    try {
        expenses = await apiFetch('/expenses');
        renderExpenses();
    } catch (err) {
        showAlert('alertBox', 'Failed to load expenses', 'error');
    }
}

function renderExpenses() {
    const list = document.getElementById('expensesList');
    list.innerHTML = '';

    if (expenses.length === 0) {
        list.innerHTML = '<tr><td colspan="5" style="text-align: center;">No expenses recorded yet.</td></tr>';
        return;
    }

    expenses.forEach(e => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${formatDate(e.date)}</td>
            <td><span class="badge" style="background: rgba(88, 166, 255, 0.1); color: var(--accent); padding: 4px 8px; border-radius: 4px; font-size: 0.8rem;">${e.category}</span></td>
            <td>${e.description || '-'}</td>
            <td style="color: var(--danger); font-weight: 600;">${formatCurrency(e.amount)}</td>
            <td>
                <button class="btn btn-primary btn-sm edit-btn" style="padding: 6px 10px; font-size: 0.8rem; margin-right: 5px;" data-id="${e.id}">Edit</button>
                <button class="btn btn-danger btn-sm delete-btn" style="padding: 6px 10px; font-size: 0.8rem;" data-id="${e.id}">Del</button>
            </td>
        `;
        list.appendChild(tr);
    });

    document.querySelectorAll('.edit-btn').forEach(btn => {
        btn.addEventListener('click', (e) => editExpense(e.target.dataset.id));
    });

    document.querySelectorAll('.delete-btn').forEach(btn => {
        btn.addEventListener('click', (e) => removeExpense(e.target.dataset.id));
    });
}

function editExpense(id) {
    const expense = expenses.find(e => e.id == id);
    if (!expense) return;

    document.getElementById('expenseId').value = expense.id;
    document.getElementById('amount').value = expense.amount;
    document.getElementById('category').value = expense.category;
    document.getElementById('date').value = expense.date.split('T')[0];
    document.getElementById('description').value = expense.description;

    document.getElementById('submitBtn').textContent = 'Update Expense';
    document.getElementById('cancelBtn').style.display = 'block';
}

function resetForm() {
    document.getElementById('expenseForm').reset();
    document.getElementById('expenseId').value = '';
    document.getElementById('submitBtn').textContent = 'Add Expense';
    document.getElementById('cancelBtn').style.display = 'none';
}

async function handleExpenseSubmit(e) {
    e.preventDefault();
    
    const id = document.getElementById('expenseId').value;
    const amount = document.getElementById('amount').value;
    const category = document.getElementById('category').value;
    const date = document.getElementById('date').value;
    const description = document.getElementById('description').value;

    const payload = { amount, category, date, description };

    try {
        if (id) {
            await apiFetch(`/expenses/${id}`, { method: 'PUT', body: JSON.stringify(payload) });
            showAlert('alertBox', 'Expense updated successfully', 'success');
        } else {
            await apiFetch('/expenses', { method: 'POST', body: JSON.stringify(payload) });
            showAlert('alertBox', 'Expense added successfully', 'success');
        }
        
        resetForm();
        await fetchExpenses();
    } catch (err) {
        showAlert('alertBox', err.message, 'error');
    }
}

async function removeExpense(id) {
    if (!confirm('Are you sure you want to delete this expense?')) return;
    
    try {
        await apiFetch(`/expenses/${id}`, { method: 'DELETE' });
        showAlert('alertBox', 'Expense deleted', 'success');
        await fetchExpenses();
    } catch (err) {
        showAlert('alertBox', err.message, 'error');
    }
}
