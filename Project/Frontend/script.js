let userId = null;

function showSection(section) {
  document.getElementById('signup').style.display = 'none';
  document.getElementById('login').style.display = 'none';
  document.getElementById('expense').style.display = 'none';
  document.getElementById(section).style.display = 'block';
}

showSection('signup');

async function signup() {
  const email = document.getElementById('signupEmail').value;
  const password = document.getElementById('signupPassword').value;

  try {
    const res = await fetch('http://localhost:5000/api/auth/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    const data = await res.json();
    if (data.userId) {
      userId = data.userId;
      showSection('expense');
      loadExpenses();
    } else {
      alert(data.error);
    }
  } catch (err) {
    alert("Signup failed");
  }
}

async function login() {
  const email = document.getElementById('loginEmail').value;
  const password = document.getElementById('loginPassword').value;

  try {
    const res = await fetch('http://localhost:5000/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    const data = await res.json();
    if (data.userId) {
      userId = data.userId;
      showSection('expense');
      loadExpenses();
    } else {
      alert(data.error);
    }
  } catch (err) {
    alert("Login failed");
  }
}

async function addExpense() {
  const title = document.getElementById('title').value;
  const amount = document.getElementById('amount').value;

  const res = await fetch('http://localhost:5000/api/expenses', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ title, amount, userId })
  });

  document.getElementById('title').value = '';
  document.getElementById('amount').value = '';
  loadExpenses();
}

async function loadExpenses() {
  const res = await fetch(`http://localhost:5000/api/expenses/${userId}`);
  const data = await res.json();

  const table = document.getElementById('expenseTable');
  table.innerHTML = '<tr><th>Title</th><th>Amount</th><th>Action</th></tr>';
  data.forEach(exp => {
    const row = table.insertRow();
    row.innerHTML = `
      <td>${exp.title}</td>
      <td>${exp.amount}</td>
      <td><button onclick="deleteExpense('${exp._id}')">Delete</button></td>
    `;
  });
}

async function deleteExpense(id) {
  await fetch(`http://localhost:5000/api/expenses/${id}`, {
    method: 'DELETE'
  });
  loadExpenses();
}
function logout() {
  userId = null;
  showSection('login');
  const table = document.getElementById('expenseTable');
  table.innerHTML = '<tr><th>Title</th><th>Amount</th><th>Action</th></tr>';
  alert("You have been logged out.");
}
function calculateTotal() {
  const table = document.getElementById("expenseTable");
  let total = 0;

  // Start from 1 to skip header row
  for (let i = 1; i < table.rows.length; i++) {
    const amount = parseFloat(table.rows[i].cells[1].innerText);
    total += amount;
  }

  document.getElementById("totalDisplay").innerText = `Total: ₹${total}`;
}
