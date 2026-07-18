import React from "react";

function Navigation({ setPage }) {

  return (

    <nav className="nav">

      <button onClick={() => setPage("home")}>
        🌱 Home
      </button>


      <button onClick={() => setPage("expenses")}>
        💸 Expenses
      </button>


      <button onClick={() => setPage("income")}>
        💰 Income
      </button>


      <button onClick={() => setPage("money")}>
        🌱 Money
      </button>


      <button onClick={() => setPage("bills")}>
        📅 Bills
      </button>


      <button onClick={() => setPage("goals")}>
        🌸 Goals
      </button>


      <button onClick={() => setPage("account")}>
        ⚙️ Account
      </button>

    </nav>

  );

}

export default Navigation;
