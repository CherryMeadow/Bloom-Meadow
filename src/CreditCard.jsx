import React, { useState } from "react";

function CreditCard({ budget }) {

  const [balance, setBalance] = useState(
    budget.credit_card_balance || 0
  );

  return (
    <div className="section">

      <h1>💳 Credit Card</h1>

      <div className="card">

        <h2>
          Current Balance
        </h2>

        <h1>
          ${Number(balance).toFixed(2)}
        </h1>


        <input
          type="number"
          value={balance}
          onChange={(e) =>
            setBalance(e.target.value)
          }
        />


        <button>
          Save Balance 🌱
        </button>

      </div>


      <div className="card">

        <h2>
          Payment History
        </h2>

        <p>
          Add payments here next 💙
        </p>

      </div>


    </div>
  );
}

export default CreditCard;
