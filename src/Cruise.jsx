import React, { useEffect, useState } from "react";
import { supabase } from "./supabaseClient";

function Cruise({ user }) {

  const [items, setItems] = useState([]);

  const [item, setItem] = useState("");
  const [totalAmount, setTotalAmount] = useState("");
  const [paidAmount, setPaidAmount] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("Card");

  const [editingItem, setEditingItem] = useState(null);



  useEffect(() => {
    if(user){
      loadCruise();
    }
  }, [user]);



  async function loadCruise(){

    const {data,error} = await supabase
      .from("cruise")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at",{ascending:false});


    if(error){
      console.log(error);
      return;
    }


    setItems(data || []);

  }





  async function saveItem(){

    if(!item || !totalAmount){
      alert("Please fill out the required fields.");
      return;
    }



    const cruiseData = {

      item,
      total_amount:Number(totalAmount),
      paid_amount:Number(paidAmount || 0),
      due_date:dueDate,
      payment_method:paymentMethod,

    };



    if(editingItem){


      const {error}=await supabase
        .from("cruise")
        .update(cruiseData)
        .eq("id",editingItem.id);



      if(error){
        alert(error.message);
        return;
      }



    } else {


      const {error}=await supabase
        .from("cruise")
        .insert([
          {
            user_id:user.id,
            ...cruiseData,
          }
        ]);



      if(error){
        alert(error.message);
        return;
      }

    }



    clearForm();
    loadCruise();

  }





  function editCruise(cruiseItem){

    setEditingItem(cruiseItem);

    setItem(cruiseItem.item);
    setTotalAmount(cruiseItem.total_amount);
    setPaidAmount(cruiseItem.paid_amount);
    setDueDate(cruiseItem.due_date);
    setPaymentMethod(cruiseItem.payment_method);

  }





  function clearForm(){

    setEditingItem(null);

    setItem("");
    setTotalAmount("");
    setPaidAmount("");
    setDueDate("");
    setPaymentMethod("Card");

  }





  async function deleteItem(id){

    if(!window.confirm("Delete this cruise item?")){
      return;
    }


    await supabase
      .from("cruise")
      .delete()
      .eq("id",id);


    loadCruise();

  }





  const total =
    items.reduce(
      (sum,i)=>
      sum + Number(i.total_amount),
      0
    );


  const paid =
    items.reduce(
      (sum,i)=>
      sum + Number(i.paid_amount),
      0
    );


  const remaining =
    total - paid;


  const progress =
    total === 0
    ? 0
    : (paid / total) * 100;




  return (

    <div className="section">


      <h1>
        🚢 Cruise Fund
      </h1>



      <div className="card">

        <input
          placeholder="Item"
          value={item}
          onChange={(e)=>
            setItem(e.target.value)
          }
        />


        <input
          type="number"
          placeholder="Total amount"
          value={totalAmount}
          onChange={(e)=>
            setTotalAmount(e.target.value)
          }
        />


        <input
          type="number"
          placeholder="Amount paid"
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


        <select
          value={paymentMethod}
          onChange={(e)=>
            setPaymentMethod(e.target.value)
          }
        >
          <option>Card</option>
          <option>Cash</option>
          <option>Klarna</option>
          <option>Affirm</option>
        </select>



        <button onClick={saveItem}>

          {editingItem
          ? "Save Changes ✏️"
          : "Add Cruise Item 🚢"}

        </button>


      </div>




      <div className="card">

        <h2>
          🚢 Cruise Summary
        </h2>


        <p>
          Total:
          ${total.toFixed(2)}
        </p>


        <p>
          Paid:
          ${paid.toFixed(2)}
        </p>


        <p>
          Remaining:
          ${remaining.toFixed(2)}
        </p>


        <p>
          Progress:
          {progress.toFixed(0)}%
        </p>


      </div>





      {items.map((cruiseItem)=>(

        <div
          className="card"
          key={cruiseItem.id}
        >

          <h2>
            🚢 {cruiseItem.item}
          </h2>


          <p>
            ${Number(cruiseItem.paid_amount).toFixed(2)}
            /
            ${Number(cruiseItem.total_amount).toFixed(2)}
          </p>


          <p>
            💳 {cruiseItem.payment_method}
          </p>


          <p>
            📅 {cruiseItem.due_date || "No due date"}
          </p>



          <button
            onClick={()=>
              editCruise(cruiseItem)
            }
          >
            ✏️ Edit
          </button>



          <button
            onClick={()=>
              deleteItem(cruiseItem.id)
            }
          >
            🗑️ Delete
          </button>


        </div>

      ))}



    </div>

  );

}


export default Cruise;
