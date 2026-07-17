import React, { useEffect, useState } from "react";
import { supabase } from "./supabaseClient";

function Bills({ user }) {
  const [bills, setBills] = useState([]);

  const [billName, setBillName] = useState("");
  const [amount, setAmount] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [recurring, setRecurring] = useState(false);


  useEffect(() => {
    if (user) {
      loadBills();
    }
  }, [user]);


  async function loadBills() {
    const { data, error } = await supabase
      .from("bills")
      .select("*")
      .eq("user_id", user.id)
      .order("due_date", { ascending: true });


    if (error) {
      console.log(error);
      return;
    }

    setBills(data || []);
  }



  async function addBill() {

    if (!billName || !amount || !dueDate) {
      alert("Please fill out all fields.");
      return;
    }


    const { error } = await supabase
      .from("bills")
      .insert([
        {
          user_id: user.id,
          bill_name: billName,
          amount: Number(amount),
          due_date: dueDate,
          recurring,
          paid: false,
        },
      ]);


    if (error) {
      alert(error.message);
      return;
    }


    setBillName("");
    setAmount("");
    setDueDate("");
    setRecurring(false);

    await loadBills();
  }



  async function togglePaid(id, currentStatus) {

    await supabase
      .from("bills")
      .update({
        paid: !currentStatus,
      })
      .eq("id", id);


    await loadBills();
  }



  async function deleteBill(id) {

    await supabase
      .from("bills")
      .delete()
      .eq("id", id);


    await loadBills();
  }



  return (
    <div className="section">

      <h1>
        📅 Bills
      </h1>


      <div className="card">

        <input
          placeholder="Bill name"
          value={billName}
          onChange={(e) =>
            setBillName(e.target.value)
          }
        />


        <input
          type="number"
          placeholder="Amount"
          value={amount}
          onChange={(e) =>
            setAmount(e.target.value)
          }
        />


        <input
          type="date"
          value={dueDate}
          onChange={(e) =>
            setDueDate(e.target.value)
          }
        />


        <label>

          <input
            type="checkbox"
            checked={recurring}
            onChange={(e) =>
              setRecurring(e.target.checked)
            }
          />

          Recurring bill

        </label>



        <button onClick={addBill}>
          Add Bill 🌱
        </button>


      </div>



      <h2>
        Upcoming Bills
      </h2>



      {bills.map((bill) => (

        <div className="card" key={bill.id}>

          <h2>
            {bill.bill_name}
          </h2>


          <p>
            ${Number(bill.amount).toFixed(2)}
          </p>


          <p>
            📅 Due: {bill.due_date}
          </p>


          <p>
            {bill.paid ? "✅ Paid" : "⏳ Not Paid"}
          </p>


          <button
            onClick={() =>
              togglePaid(
                bill.id,
                bill.paid
              )
            }
          >
            Mark Paid
          </button>


          <button
            onClick={() =>
              deleteBill(bill.id)
            }
          >
            🗑️ Delete
          </button>


        </div>

      ))}


    </div>
  );
}

export default Bills;
