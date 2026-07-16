import React, { useEffect, useState } from "react";
import { supabase } from "./supabaseClient";

function Expenses({ user }) {
  const [expenses, setExpenses] = useState([]);
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("Food");
  const [note, setNote] = useState("");

  useEffect(() => {
    loadExpenses();
  }, []);

  async function loadExpenses() {
    const { data } = await supabase
      .from("expenses")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

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
    return;
  }

  loadExpenses();
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

    <button onClick={() => deleteExpense(expense.id)}>
      🗑️ Delete
    </button>
  </div>
))}
    </div>
  );
}

export default Expenses;
