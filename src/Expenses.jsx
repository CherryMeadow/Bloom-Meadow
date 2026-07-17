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

  const [editingExpense, setEditingExpense] = useState(null);



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
      .order("created_at", { ascending:false });


    if (error) {
      console.log(error);
      return;
    }


    setExpenses(data || []);

  }





  async function saveExpense() {

    if (!amount) {
      alert("Enter an amount.");
      return;
    }



    const expenseData = {

      amount: Number(amount),
      category,
      note,
      payment_account: paymentAccount,
      date,

    };



    if (editingExpense) {


      await supabase
        .from("expenses")
        .update(expenseData)
        .eq("id", editingExpense.id);



    } else {


      await supabase
        .from("expenses")
        .insert([
          {
            user_id:user.id,
            ...expenseData,
          },
        ]);

    }



    clearForm();

    loadExpenses();

    if(onExpenseAdded){
      onExpenseAdded();
    }

  }





  function editExpense(expense){

    setEditingExpense(expense);

    setAmount(expense.amount);
    setCategory(expense.category);
    setNote(expense.note || "");
    setPaymentAccount(expense.payment_account);
    setDate(expense.date);

  }




  function clearForm(){

    setEditingExpense(null);
    setAmount("");
    setCategory("🍔 Food");
    setNote("");
    setPaymentAccount("Checking");
    setDate(
      new Date().toISOString().split("T")[0]
    );

  }





  async function deleteExpense(id){

    await supabase
      .from("expenses")
      .delete()
      .eq("id",id);


    loadExpenses();

  }




  return (

    <div className="section">


      <h1>
        💸 Expenses
      </h1>



      <div className="card">


        <input
          placeholder="Amount"
          value={amount}
          onChange={(e)=>setAmount(e.target.value)}
        />



        <select
          value={category}
          onChange={(e)=>setCategory(e.target.value)}
        >

          <option>🍔 Food</option>
          <option>🚗 Uber</option>
          <option>🛍️ Shopping</option>
          <option>🐾 Pets</option>
          <option>🏠 Bills</option>
          <option>Other</option>

        </select>




        <select
          value={paymentAccount}
          onChange={(e)=>setPaymentAccount(e.target.value)}
        >

          <option>Checking</option>
          <option>Savings</option>

        </select>




        <input
          type="date"
          value={date}
          onChange={(e)=>setDate(e.target.value)}
        />



        <input
          placeholder="Note"
          value={note}
          onChange={(e)=>setNote(e.target.value)}
        />



        <button onClick={saveExpense}>
          {editingExpense
            ? "Save Changes ✏️"
            : "Add Expense 🌱"}
        </button>



      </div>




      <h2>
        Recent Expenses
      </h2>



      {expenses.map((expense)=>(

        <div
          className="card"
          key={expense.id}
        >


          <h2>
            ${Number(expense.amount).toFixed(2)}
          </h2>


          <p>
            {expense.category}
          </p>


          <p>
            {expense.note || "No note"}
          </p>


          <small>
            📅 {expense.date}
            <br/>
            💳 {expense.payment_account}
          </small>



          <br/>


          <button
            onClick={() =>
              editExpense(expense)
            }
          >
            ✏️ Edit
          </button>



          <button
            onClick={() =>
              deleteExpense(expense.id)
            }
          >
            🗑️ Delete
          </button>


        </div>

      ))}



    </div>

  );

}


export default Expenses;
