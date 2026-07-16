import React, { useEffect, useState } from "react";
import { supabase } from "./supabaseClient";

function Expenses({ user }) {
  const [expenses, setExpenses] = useState([]);
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("Food");
  const [note, setNote] = useState("");
  const [paymentAccount, setPaymentAccount] = useState("Checking");
  
useEffect(() => {
  if (user) {
    loadExpenses();
  }
}, [user]);

 async function loadExpenses() {
  const { data, error } = await supabase
    .from("expenses")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  if (error) {
    console.log(error);
    return;
  }

  setExpenses(data || []);
}
async function addExpense() {
  console.log("Add expense clicked");
  console.log(user);
  console.log(amount, category, note);

  const { error } = await supabase
    .from("expenses")
    .insert([
     {
  user_id: user.id,
  amount: Number(amount),
  category,
  note,
  payment_account: paymentAccount,
  date: new Date().toISOString().split("T")[0],
},
    ]);

  if (error) {
    alert(error.message);
    console.log(error);
    return;
  }

  setAmount("");
  setNote("");
  loadExpenses();
}
async function deleteExpense(id) {
  const { error } = await supabase
    .from("expenses")
    .delete()
    .eq("id", id);

  if (error) {
    alert(error.message);
    console.log(error);
    return;
  }
  await loadExpenses();
}
  // remove it from the screen immediately
  setExpenses((current) =>
    current.filter((expense) => expense.id !== id)
  );
}

  return (
    <div className="section">
      <h2>💸 Expenses</h2>

      <input
        placeholder="Amount"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
      />

      <select
        value={category}
        onChange={(e) => setCategory(e.target.value)}
      >
        <option>Food</option>
        <option>Uber</option>
        <option>Shopping</option>
        <option>Pets</option>
        <option>Other</option>
      </select>
<select
  value={paymentAccount}
  onChange={(e) => setPaymentAccount(e.target.value)}
>
  <option>Checking</option>
  <option>Savings</option>
</select>
      <input
        placeholder="Note"
        value={note}
        onChange={(e) => setNote(e.target.value)}
      />

      <button onClick={addExpense}>
        Add Expense 🌱
      </button>

      <h3>Recent Expenses</h3>

      {expenses.map((expense) => (
  <div className="card" key={expense.id}>
    <p>
      ${expense.amount} — {expense.category}
    </p>

    <small>{expense.note}</small>

   <button
  onClick={() => {
    if (window.confirm("Delete this expense?")) {
      deleteExpense(expense.id);
    }
  }}
>
      🗑️ Delete
    </button>
  </div>
))}
    </div>
  );
}

export default Expenses;
