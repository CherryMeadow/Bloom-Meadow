import React, { useEffect, useState } from "react";
import { supabase } from "./supabaseClient";

function Bills({ user, profile }) {
  
  const [bills, setBills] = useState([]);
  const [billName, setBillName] = useState("");
  const [amount, setAmount] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [recurring, setRecurring] = useState(false);
  const [endDate, setEndDate] = useState("");
  const [totalAmount, setTotalAmount] = useState("");
  const [paidAmount, setPaidAmount] = useState("");
  const [editingBill, setEditingBill] = useState(null);



  useEffect(() => {
    if(user){
      loadBills();
    }
  },[user]);



  async function loadBills(){

    const {data,error} = await supabase
      .from("bills")
      .select("*")
      .eq("user_id",user.id)
      .order("due_date",{ascending:true});


    if(error){
      console.log(error);
      return;
    }


    setBills(data || []);

  }





  async function saveBill(){

    if(!billName || !amount || !dueDate){
      alert("Please fill out all fields.");
      return;
    }


  const billData = {

  bill_name: billName,
  amount: Number(amount),
  due_date: dueDate,
  recurring,
  end_date: endDate || null,
  total_amount: Number(totalAmount) || Number(amount),
  paid_amount: Number(paidAmount) || 0,

};


    if(editingBill){

      const {error} = await supabase
        .from("bills")
        .update(billData)
        .eq("id",editingBill.id);


      if(error){
        alert(error.message);
        return;
      }


    }else{


      const {error} = await supabase
        .from("bills")
        .insert([
          {
            user_id:user.id,
            ...billData,
            paid:false,
          }
        ]);


      if(error){
        alert(error.message);
        return;
      }

    }



    clearForm();
    loadBills();

  }





  function editBill(bill){

  setEditingBill(bill);

  setBillName(bill.bill_name);
  setAmount(bill.amount);
  setDueDate(bill.due_date);
  setRecurring(bill.recurring);

  setEndDate(bill.end_date || "");
  setTotalAmount(bill.total_amount || "");
  setPaidAmount(bill.paid_amount || "");

}





 function clearForm(){

  setEditingBill(null);
  setBillName("");
  setAmount("");
  setDueDate("");
  setRecurring(false);

  setEndDate("");
  setTotalAmount("");
  setPaidAmount("");

}

function getDaysUntilDue(date) {

  const today = new Date();

  const due = new Date(date);

  const difference =
    due - today;

  return Math.ceil(
    difference / (1000 * 60 * 60 * 24)
  );

}


  async function deleteBill(id){

    const confirmDelete =
      window.confirm(
        "Delete this bill?"
      );


    if(!confirmDelete){
      return;
    }


    await supabase
      .from("bills")
      .delete()
      .eq("id",id);


    loadBills();

  }





  async function togglePaid(bill){

    await supabase
      .from("bills")
      .update({
        paid: !bill.paid
      })
      .eq("id",bill.id);


    loadBills();

  }


const unpaidTotal = bills
  .filter((bill) => !bill.paid)
  .reduce(
    (total, bill) => total + Number(bill.amount),
    0
  );

return (
 <div className="section">

      <h1>
        📅 Bills
      </h1>

<div className="card">

  <h2>
    Upcoming Bills
  </h2>

  <p>
    ${unpaidTotal.toFixed(2)}
  </p>

</div>

      <div className="card">


        <input
          placeholder="Bill name"
          value={billName}
          onChange={(e)=>
            setBillName(e.target.value)
          }
        />



        <input
          type="number"
          placeholder="Amount"
          value={amount}
          onChange={(e)=>
            setAmount(e.target.value)
          }
        />
<label>
  Total Amount (for payment plans)
</label>

<input
  type="number"
  placeholder="Total owed"
  value={totalAmount}
  onChange={(e)=>
    setTotalAmount(e.target.value)
  }
/>


<label>
  Amount Already Paid
</label>

<input
  type="number"
  placeholder="Paid so far"
  value={paidAmount}
  onChange={(e)=>
    setPaidAmount(e.target.value)
  }
/>


        <input
          type="date"
          value={dueDate}
          onChange={(e)=>
            setDueDate(e.target.value)
          }
        />

{recurring && (
  <>
    <label>
      Repeat Until (optional)
    </label>

    <input
      type="date"
      value={endDate}
      onChange={(e)=>
        setEndDate(e.target.value)
      }
    />
  </>
)}

        <label>

          <input
            type="checkbox"
            checked={recurring}
            onChange={(e)=>
              setRecurring(e.target.checked)
            }
          />

          Recurring

        </label>



        <button onClick={saveBill}>
          {editingBill
            ? "Save Changes ✏️"
            : "Add Bill 📅"}
        </button>


      </div>




      {bills.map((bill)=>(


        <div
          className="card"
          key={bill.id}
        >


          <h2>
            {bill.bill_name}
          </h2>


          <p>
            ${Number(bill.amount).toFixed(2)}
          </p>


          <p>
  Due:
  {" "}
 {new Date(
  bill.due_date + "T00:00:00"
).toLocaleDateString()}
</p>


<p>
  {bill.paid
    ? "✅ Paid"
    : `⏳ Due in ${getDaysUntilDue(bill.due_date)} days`}
</p>


          <p>
            {bill.recurring
              ? "🔁 Recurring"
              : "One Time"}
          </p>



          <button
            onClick={()=>
              togglePaid(bill)
            }
          >
            {bill.paid
              ? "Mark Unpaid"
              : "Mark Paid"}
          </button>



          <button
            onClick={()=>
              editBill(bill)
            }
          >
            ✏️ Edit
          </button>



          <button
            onClick={()=>
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
