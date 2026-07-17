
import React, { useEffect, useState } from "react";
import { supabase } from "./supabaseClient";

function CreditCard({ user }) {

  const [cards, setCards] = useState([]);

  const [cardName, setCardName] = useState("");
  const [creditLimit, setCreditLimit] = useState("");
  const [balance, setBalance] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [minimumPayment, setMinimumPayment] = useState("");


  useEffect(() => {
    if (user) {
      loadCards();
    }
  }, [user]);



  async function loadCards() {

    const { data, error } = await supabase
      .from("credit_cards")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });


    if (error) {
      console.log(error);
      return;
    }


    setCards(data || []);

  }



  async function addCard() {

    if (!cardName || !creditLimit || !balance) {
      alert("Please fill out the card information.");
      return;
    }


    const { error } = await supabase
      .from("credit_cards")
      .insert([
        {
          user_id: user.id,
          card_name: cardName,
          credit_limit: Number(creditLimit),
          balance: Number(balance),
          due_date: dueDate,
          minimum_payment: Number(minimumPayment || 0),
        },
      ]);


    if (error) {
      alert(error.message);
      return;
    }


    setCardName("");
    setCreditLimit("");
    setBalance("");
    setDueDate("");
    setMinimumPayment("");

    loadCards();

  }




  async function deleteCard(id) {

    const { error } = await supabase
      .from("credit_cards")
      .delete()
      .eq("id", id);


    if (error) {
      alert(error.message);
      return;
    }


    loadCards();

  }



  return (

    <div className="section">


      <h1>
        💳 Credit Cards
      </h1>



      <div className="card">


        <input
          placeholder="Card name"
          value={cardName}
          onChange={(e) =>
            setCardName(e.target.value)
          }
        />


        <input
          type="number"
          placeholder="Credit limit"
          value={creditLimit}
          onChange={(e) =>
            setCreditLimit(e.target.value)
          }
        />


        <input
          type="number"
          placeholder="Current balance"
          value={balance}
          onChange={(e) =>
            setBalance(e.target.value)
          }
        />


        <input
          type="date"
          value={dueDate}
          onChange={(e) =>
            setDueDate(e.target.value)
          }
        />


        <input
          type="number"
          placeholder="Minimum payment"
          value={minimumPayment}
          onChange={(e) =>
            setMinimumPayment(e.target.value)
          }
        />


        <button onClick={addCard}>
          Add Credit Card 💳
        </button>


      </div>





      {cards.map((card) => {


        const available =
          Number(card.credit_limit) -
          Number(card.balance);



        const usage =
          (Number(card.balance) /
          Number(card.credit_limit)) * 100;



        return (

          <div className="card" key={card.id}>


            <h2>
              💳 {card.card_name}
            </h2>


            <p>
              Balance:
              {" "}
              ${Number(card.balance).toFixed(2)}
            </p>


            <p>
              Available:
              {" "}
              ${available.toFixed(2)}
            </p>


            <p>
              Limit:
              {" "}
              ${Number(card.credit_limit).toFixed(2)}
            </p>


            <p>
              Due:
              {" "}
              {card.due_date || "No date"}
            </p>


            <p>
              Minimum:
              {" "}
              ${Number(card.minimum_payment).toFixed(2)}
            </p>



            <div className="progress-bar">

              <div
                className="progress-fill"
                style={{
                  width: `${usage}%`,
                }}
              ></div>

            </div>


            <small>
              {usage.toFixed(0)}% used
            </small>


            <br />


            <button
              onClick={() =>
                deleteCard(card.id)
              }
            >
              🗑️ Delete
            </button>


          </div>

        );

      })}



    </div>

  );

}


export default CreditCard;
