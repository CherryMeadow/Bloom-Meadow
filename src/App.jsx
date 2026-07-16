import Expenses from "./Expenses.jsx";
import React, { useState, useEffect } from "react";
import Login from "./Login.jsx";
import { supabase } from "./supabaseClient";
import "./index.css";

function App() {
  const [user, setUser] = useState(null);
  const [budget, setBudget] = useState(null);
const [page, setPage] = useState("home");
  
  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setUser(data.session?.user || null);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null);
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (user) {
      loadBudget();
    }
  }, [user]);

  async function loadBudget() {
    const { data, error } = await supabase
      .from("budget_data")
      .select("*")
      .eq("user_id", user.id)
      .single();

    if (data) {
      setBudget(data);
    } else {
      const { data: newBudget } = await supabase
        .from("budget_data")
        .insert([
          {
            user_id: user.id,
            checking: 258,
            savings: 2921,
            cruise_goal: 800,
            credit_card_balance: 1517,
          },
        ])
        .select()
        .single();

      setBudget(newBudget);
    }
  }

  if (!user) {
    return <Login onLogin={() => setUser(true)} />;
  }

  if (!budget) {
    return <p>Loading Bloom Meadow 🌸</p>;
  }
if (page === "expenses") {
  return (
    <div className="app">
      <Expenses user={user} />

      <nav className="nav">
        <button onClick={() => setPage("home")}>
          🌱 Home
        </button>

        <button onClick={() => setPage("expenses")}>
          💸 Expenses
        </button>

        <button>
          📅 Bills
        </button>

        <button>
          🌸 Goals
        </button>
      </nav>
    </div>
  );
}
  return (
    <div className="app">
      <header className="header">
        <h1>🌸 Bloom Meadow</h1>
        <p>Welcome back, Tami 🌿</p>
      </header>

      <section className="cards">

        <div className="card">
          <h2>💙 Checking</h2>
          <p>${budget.checking}</p>
        </div>

        <div className="card">
          <h2>🌱 Emergency Savings</h2>
          <p>${budget.savings}</p>
        </div>

        <div className="card">
          <h2>🚢 Cruise Fund</h2>
          <p>
            $0 / ${budget.cruise_goal}
          </p>
        </div>

        <div className="card">
          <h2>💳 Credit Card</h2>
          <p>${budget.credit_card_balance}</p>
        </div>

      </section>

      <nav className="nav">
        <button>🌱 Home</button>
        <button onClick={() => setPage("expenses")}>
  💸 Expenses
</button>
        <button>📅 Bills</button>
        <button>🌸 Goals</button>
      </nav>

    </div>
  );
}

export default App;
