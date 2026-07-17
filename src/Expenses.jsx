import React, { useEffect, useState } from "react";
import { supabase } from "./supabaseClient";

function Expenses({ user, onExpenseAdded }) {
  const [expenses, setExpenses] = useState([]);
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("🍔 Food");
  const [note, setNote] = useState("");
  const [paymentAccount, setPaymentAccount] = useState("Checking");
  const [date, setDate] = useState(
    new Date().toISOString().split("T")[0]
  );

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

    if (!amount || Number(amount) <= 0) {
      alert("Please enter a valid amount.");
      return;
    }


    const { error } = await supabase
      .from("expenses")
      .insert([
        {
          user_id: user.id,
          amount: Number(amount),
          category,
          note,
          payment_account: paymentAccount,
          date,
        },
      ]);


    if (error) {
      alert(error.message);
      console.log(error);
      return;
    }


    setAmount("");
    setNote("");
    setCategory("🍔 Food");
    setPaymentAccount("Checking");
    setDate(new Date().toISOString().split("T")[0]);

  await loadExpenses();

if (onExpenseAdded) {
  onExpenseAdded();
}
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



  const totalSpent = expenses.reduce(
    (total, expense) =>
      total + Number(expense.amount),
    0
  );



  return (
    <div className="section">

      <h1>
        💸 Expenses
      </h1>


      <div className="card">

        <h2>
          This Month
        </h2>

        <h1>
          ${totalSpent.toFixed(2)}
        </h1>

      </div>



      <div className="card">


        <input
          type="number"
          placeholder="Amount"
          value={amount}
          onChange={(e) =>
            setAmount(e.target.value)
          }
        />



        <select
          value={category}
          onChange={(e) =>
            setCategory(e.target.value)
          }
        >
          <option>🍔 Food</option>
          <option>🚗 Transportation</option>
          <option>🛒 Groceries</option>
          <option>🛍 Shopping</option>
          <option>🏠 Bills</option>
          <option>💳 Credit Card</option>
          <option>🚢 Cruise</option>
          <option>✈️ Travel</option>
          <option>🐶 Pets</option>
          <option>🎓 School</option>
          <option>💊 Healthcare</option>
          <option>🎁 Gifts</option>
          <option>📦 Subscriptions</option>
          <option>✨ Other</option>
        </select>



        <select
          value={paymentAccount}
          onChange={(e) =>
            setPaymentAccount(e.target.value)
          }
        >
          <option>Checking</option>
          <option>Savings</option>
        </select>



        <input
          type="date"
          value={date}
          onChange={(e) =>
            setDate(e.target.value)
          }
        />



        <input
          placeholder="What was this for?"
          value={note}
          onChange={(e) =>
            setNote(e.target.value)
          }
        />



        <button onClick={addExpense}>
          Add Expense 🌱
        </button>


      </div>




      <h2>
        Recent Expenses
      </h2>



      {expenses.length === 0 ? (

        <div className="card">
          <p>
            No expenses yet 🌸
          </p>
        </div>

      ) : (

        expenses.map((expense) => (

          <div className="card" key={expense.id}>

            <h2>
              ${Number(expense.amount).toFixed(2)}
            </h2>


            <p>
              {expense.category}
            </p>


            <p>
              {expense.note || "No note added"}
            </p>


            <small>
              📅 {expense.date}
            </small>


            <br />


            <small>
              💳 Paid from: {expense.payment_account}
            </small>



            <br />


            <button
              onClick={() => {
                if (
                  window.confirm(
                    "Delete this expense?"
                  )
                ) {
                  deleteExpense(expense.id);
                }
              }}
            >
              🗑️ Delete
            </button>


          </div>

        ))

      )}


    </div>
  );
}

export default Expenses;
