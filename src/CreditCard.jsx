
import React, { useEffect, useState } from "react";
import { supabase } from "./supabaseClient";

function CreditCard({ user }) {

  const [cards, setCards] = useState([]);
  const [payments, setPayments] = useState([]);

  const [cardName, setCardName] = useState("");
  const [creditLimit, setCreditLimit] = useState("");
  const [balance, setBalance] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [minimumPayment, setMinimumPayment] = useState("");


  useEffect(() => {
    if (user) {
      loadCards();
      loadPayments();
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



  async function loadPayments() {

    const { data, error } = await supabase
      .from("credit_card_payments")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });


    if (error) {
      console.log(error);
      return;
    }


    setPayments(data || []);

  }




  async function addCard() {

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




  async function makePayment(card) {

    const amount = prompt(
      "Payment amount?"
    );


    if (!amount) return;


    const paymentAmount = Number(amount);


    const { error: paymentError } =
      await supabase
      .from("credit_card_payments")
      .insert([
        {
          user_id: user.id,
          card_id: card.id,
          amount: paymentAmount,
          payment_date:
            new Date()
            .toISOString()
            .split("T")[0],
        },
      ]);



    if (paymentError) {
      alert(paymentError.message);
      return;
    }



    const newBalance =
      Number(card.balance) - paymentAmount;



    await supabase
      .from("credit_cards")
      .update({
        balance:
          newBalance < 0 ? 0 : newBalance,
      })
      .eq("id", card.id);



    loadCards();
    loadPayments();

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
          onChange={(e)=>
            setCardName(e.target.value)
          }
        />


        <input
          placeholder="Credit limit"
          type="number"
          value={creditLimit}
          onChange={(e)=>
            setCreditLimit(e.target.value)
          }
        />


        <input
          placeholder="Current balance"
          type="number"
          value={balance}
          onChange={(e)=>
            setBalance(e.target.value)
          }
        />


        <input
          type="date"
          value={dueDate}
          onChange={(e)=>
            setDueDate(e.target.value)
          }
        />


        <input
          placeholder="Minimum payment"
          type="number"
          value={minimumPayment}
          onChange={(e)=>
            setMinimumPayment(e.target.value)
          }
        />


        <button onClick={addCard}>
          Add Card 💳
        </button>

      </div>





      {cards.map((card)=>(

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
            ${(Number(card.credit_limit) -
            Number(card.balance)).toFixed(2)}
          </p>


          <p>
            Due:
            {" "}
            {card.due_date || "Not set"}
          </p>


          <button
            onClick={() =>
              makePayment(card)
            }
          >
            💰 Make Payment
          </button>



          <h3>
            Payment History
          </h3>


          {payments
            .filter(
              (payment)=>
              payment.card_id === card.id
            )
            .map((payment)=>(

              <p key={payment.id}>
                -${Number(payment.amount).toFixed(2)}
                {" "}
                on {payment.payment_date}
              </p>

            ))}



        </div>

      ))}



    </div>

  );

}


export default CreditCard;
