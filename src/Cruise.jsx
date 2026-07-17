import React, { useEffect, useState } from "react";
import { supabase } from "./supabaseClient";

function Cruise({ user }) {
  const [items, setItems] = useState([]);
  const [item, setItem] = useState("");
  const [totalAmount, setTotalAmount] = useState("");
  const [paidAmount, setPaidAmount] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("Checking");


  useEffect(() => {
    if (user) {
      loadCruise();
    }
  }, [user]);


  async function loadCruise() {
    const { data, error } = await supabase
      .from("cruise")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });


    if (error) {
      console.log(error);
      return;
    }

    setItems(data || []);
  }



  async function addItem() {

    if (!item || !totalAmount) {
      alert("Please add an item and amount.");
      return;
    }


    const { error } = await supabase
      .from("cruise")
      .insert([
        {
          user_id: user.id,
          item,
          total_amount: Number(totalAmount),
          paid_amount: Number(paidAmount || 0),
          due_date: dueDate || null,
          payment_method: paymentMethod,
        },
      ]);


    if (error) {
      alert(error.message);
      return;
    }


    setItem("");
    setTotalAmount("");
    setPaidAmount("");
    setDueDate("");

    await loadCruise();
  }



  async function deleteItem(id) {

    await supabase
      .from("cruise")
      .delete()
      .eq("id", id);


    await loadCruise();
  }



  return (
    <div className="section">

      <h1>
        🚢 Cruise Tracker
      </h1>


      <div className="card">

        <input
          placeholder="Item (Excursion, Gratuities, Spending Money)"
          value={item}
          onChange={(e) =>
            setItem(e.target.value)
          }
        />


        <input
          type="number"
          placeholder="Total Amount"
          value={totalAmount}
          onChange={(e) =>
            setTotalAmount(e.target.value)
          }
        />


        <input
          type="number"
          placeholder="Amount Paid"
          value={paidAmount}
          onChange={(e) =>
            setPaidAmount(e.target.value)
          }
        />


        <input
          type="date"
          value={dueDate}
          onChange={(e) =>
            setDueDate(e.target.value)
          }
        />


        <select
          value={paymentMethod}
          onChange={(e) =>
            setPaymentMethod(e.target.value)
          }
        >
          <option>Checking</option>
          <option>Klarna</option>
          <option>Affirm</option>
          <option>Credit Card</option>
        </select>


        <button onClick={addItem}>
          Add Cruise Item 🚢
        </button>

      </div>



      <h2>
        Trip Expenses
      </h2>



      {items.map((item) => {

        const progress =
          (item.paid_amount / item.total_amount) * 100;


        return (

          <div className="card" key={item.id}>

            <h2>
              {item.item}
            </h2>


            <p>
              ${item.paid_amount} / ${item.total_amount}
            </p>


            <p>
              {Math.round(progress)}% paid
            </p>


            <p>
              💳 {item.payment_method}
            </p>


            <button
              onClick={() => deleteItem(item.id)}
            >
              🗑️ Delete
            </button>


          </div>

        );

      })}


    </div>
  );
}

export default Cruise;
