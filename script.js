let transactions = JSON.parse(localStorage.getItem("transactions")) || [];

const transactionList = document.getElementById("transactionList");
const incomeEl = document.getElementById("income");
const expenseEl = document.getElementById("expense");
const balanceEl = document.getElementById("balance");

let chart;

function addTransaction() {
    const description = document.getElementById("description").value;
    const amount = Number(document.getElementById("amount").value);
    const type = document.getElementById("type").value;

    if (description === "" || amount <= 0) {
        alert("Please enter valid details");
        return;
    }

    const transaction = {
        id: Date.now(),
        description,
        amount,
        type
    };

    transactions.push(transaction);

    localStorage.setItem(
        "transactions",
        JSON.stringify(transactions)
    );

    document.getElementById("description").value = "";
    document.getElementById("amount").value = "";

    updateUI();
}

function deleteTransaction(id) {
    transactions = transactions.filter(
        transaction => transaction.id !== id
    );

    localStorage.setItem(
        "transactions",
        JSON.stringify(transactions)
    );

    updateUI();
}

function updateUI() {
    transactionList.innerHTML = "";

    let income = 0;
    let expense = 0;

    transactions.forEach(transaction => {
        const li = document.createElement("li");

        li.innerHTML = `
            ${transaction.description}
            - ₹${transaction.amount}
            (${transaction.type})

            <button
            class="delete-btn"
            onclick="deleteTransaction(${transaction.id})">
            Delete
            </button>
        `;

        transactionList.appendChild(li);

        if (transaction.type === "income") {
            income += transaction.amount;
        } else {
            expense += transaction.amount;
        }
    });

    const balance = income - expense;

    incomeEl.textContent = `₹${income}`;
    expenseEl.textContent = `₹${expense}`;
    balanceEl.textContent = `₹${balance}`;

    updateChart(income, expense);
}

function updateChart(income, expense) {

    const ctx = document.getElementById("expenseChart");

    if (chart) {
        chart.destroy();
    }

    chart = new Chart(ctx, {
        type: "pie",
        data: {
            labels: ["Income", "Expense"],
            datasets: [{
                data: [income, expense],
                backgroundColor: [
                    "#28a745",
                    "#dc3545"
                ]
            }]
        }
    });
}

updateUI();