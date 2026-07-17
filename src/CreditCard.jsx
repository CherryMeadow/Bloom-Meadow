
import React, { useEffect, useState } from "react";
import { supabase } from "./supabaseClient";

function CreditCard({ user }) {

  const [cards, setCards] = useState([]);
  const [payments, setPayments] = useState([]);

  const [editingCard, setEditingCard] = useState(null);

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
    const { data } = await supabase
      .from("credit_cards")
      .select("*")
      .eq("user_id", user.id);

    setCards(data || []);
  }



  async function loadPayments() {
    const { data } = await supabase
      .from("credit_card_payments")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    setPayments(data || []);
  }




  async function saveCard() {

    if (!cardName || !creditLimit || !balance) {
      alert("Fill out all card information.");
      return;
    }


    if (editingCard) {

      await supabase
        .from("credit_cards")
        .update({
          card_name: cardName,
          credit_limit: Number(creditLimit),
          balance: Number(balance),
          due_date: dueDate,
          minimum_payment:
            Number(minimumPayment || 0),
        })
        .eq("id", editingCard.id);


    } else {

      await supabase
        .from("credit_cards")
        .insert([
          {
            user_id: user.id,
            card_name: cardName,
            credit_limit: Number(creditLimit),
            balance: Number(balance),
            due_date: dueDate,
            minimum_payment:
              Number(minimumPayment || 0),
          },
        ]);

    }


    clearForm();
    loadCards();

  }




  function clearForm() {
    setEditingCard(null);
    setCardName("");
    setCreditLimit("");
    setBalance("");
    setDueDate("");
    setMinimumPayment("");
  }





  function editCard(card) {

    setEditingCard(card);
    setCardName(card.card_name);
    setCreditLimit(card.credit_limit);
    setBalance(card.balance);
    setDueDate(card.due_date);
    setMinimumPayment(card.minimum_payment);

  }





  async function deleteCard(card) {

    await supabase
      .from("credit_card_payments")
      .delete()
      .eq("card_id", card.id);


    await supabase
      .from("credit_cards")
      .delete()
      .eq("id", card.id);


    loadCards();
    loadPayments();

  }





  async function addPayment(card) {

    const amount = prompt(
      "Payment amount?"
    );


    if (!amount) return;


    await supabase
      .from("credit_card_payments")
      .insert([
        {
          user_id: user.id,
          card_id: card.id,
          amount: Number(amount),
          payment_date:
            new Date()
            .toISOString()
            .split("T")[0],
        },
      ]);


    await supabase
      .from("credit_cards")
      .update({
        balance:
          Math.max(
            0,
            Number(card.balance) -
            Number(amount)
          ),
      })
      .eq("id", card.id);


    loadCards();
    loadPayments();

  }





  async function editPayment(payment, card) {

    const newAmount = prompt(
      "New payment amount:",
      payment.amount
    );


    if (!newAmount) return;


    const difference =
      Number(newAmount) -
      Number(payment.amount);


    await supabase
      .from("credit_card_payments")
      .update({
        amount: Number(newAmount),
      })
      .eq("id", payment.id);



    await supabase
      .from("credit_cards")
      .update({
        balance:
          Number(card.balance) +
          difference,
      })
      .eq("id", card.id);



    loadCards();
    loadPayments();

  }





  async function deletePayment(payment, card) {

    await supabase
      .from("credit_card_payments")
      .delete()
      .eq("id", payment.id);



    await supabase
      .from("credit_cards")
      .update({
        balance:
          Number(card.balance) +
          Number(payment.amount),
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
          onChange={(e)=>setCardName(e.target.value)}
        />

        <input
          placeholder="Credit limit"
          type="number"
          value={creditLimit}
          onChange={(e)=>setCreditLimit(e.target.value)}
        />

        <input
          placeholder="Balance"
          type="number"
          value={balance}
          onChange={(e)=>setBalance(e.target.value)}
        />

        <input
          type="date"
          value={dueDate}
          onChange={(e)=>setDueDate(e.target.value)}
        />

        <input
          placeholder="Minimum payment"
          type="number"
          value={minimumPayment}
          onChange={(e)=>setMinimumPayment(e.target.value)}
        />

        <button onClick={saveCard}>
          {editingCard ? "Save Changes ✏️" : "Add Card 💳"}
        </button>

      </div>



      {cards.map((card)=>(

        <div className="card" key={card.id}>

          <h2>
            💳 {card.card_name}
          </h2>

          <p>
            Balance: ${Number(card.balance).toFixed(2)}
          </p>

          <p>
            Available:
            $
            {(Number(card.credit_limit) -
            Number(card.balance)).toFixed(2)}
          </p>


          <button onClick={() => editCard(card)}>
            ✏️ Edit
          </button>


          <button onClick={() => deleteCard(card)}>
            🗑️ Delete
          </button>


          <button onClick={() => addPayment(card)}>
            💰 Make Payment
          </button>



          <h3>
            Payments
          </h3>


          {payments
            .filter(
              (p)=>p.card_id === card.id
            )
            .map((payment)=>(

              <div key={payment.id}>

                <p>
                  -${Number(payment.amount).toFixed(2)}
                  {" "}
                  {payment.payment_date}
                </p>


                <button
                  onClick={() =>
                    editPayment(payment, card)
                  }
                >
                  ✏️
                </button>


                <button
                  onClick={() =>
                    deletePayment(payment, card)
                  }
                >
                  🗑️
                </button>


              </div>

            ))}


        </div>

      ))}


    </div>

  );

}

export default CreditCard;
