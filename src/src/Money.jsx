import React, { useEffect, useState } from "react";
import { supabase } from "./supabaseClient";

function Money({ user }) {

  const [money, setMoney] = useState([]);

  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("Other");


  useEffect(() => {
    loadMoney();
  }, []);


  async function loadMoney() {

    const { data, error } = await supabase
      .from("money")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });


    if (error) {
      console.log(error);
      return;
    }


    setMoney(data || []);

  }



  async function addMoney() {

    if (!amount) return;


    const { error } = await supabase
      .from("money")
      .insert([
        {
          user_id: user.id,
          description,
          amount: Number(amount),
          category
        }
      ]);


    if (error) {
      console.log(error);
      return;
    }


    setDescription("");
    setAmount("");
    setCategory("Other");


    loadMoney();

  }



  async function deleteMoney(id) {

    await supabase
      .from("money")
      .delete()
      .eq("id", id);


    loadMoney();

  }



  return (

    <div className="section">

      <h1>
        🌱 Extra Money
      </h1>


      <div className="card">

        <input
          placeholder="Description"
          value={description}
          onChange={(e)=>setDescription(e.target.value)}
        />


        <input
          placeholder="Amount"
          type="number"
          value={amount}
          onChange={(e)=>setAmount(e.target.value)}
        />


        <select
          value={category}
          onChange={(e)=>setCategory(e.target.value)}
        >

          <option>
            Refund
          </option>

          <option>
            Gift
          </option>

          <option>
            Bonus
          </option>

          <option>
            Other
          </option>

        </select>


        <button onClick={addMoney}>
          Add Money 🌸
        </button>


      </div>



      <div className="card">

        <h2>
          Money Added
        </h2>


        {money.map((item)=>(

          <div key={item.id}>

            <p>
              {item.description}
            </p>

            <small>
              +${Number(item.amount).toFixed(2)}
              {" "}({item.category})
            </small>


            <button
              onClick={() => deleteMoney(item.id)}
            >
              Delete
            </button>


          </div>

        ))}


      </div>


    </div>

  );

}


export default Money;
