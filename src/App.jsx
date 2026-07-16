import React, { useState, useEffect } from "react";
import Login from "./Login.jsx";
import Expenses from "./Expenses.jsx";
import { supabase } from "./supabaseClient";
import "./index.css";

function App() {
  const [user, setUser] = useState(null);
  const [budget, setBudget] = useState(null);
  const [expenses, setExpenses] = useState([]);
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
      loadExpenses();
    }
  }, [user]);

  async function loadBudget() {
    const { data, error } = await supabase
      .from("budget_data")
      .select("*")
      .eq("user_id", user.id)
      .single();

    if (error) {
      console.log(error);
      return;
    }

    setBudget(data);
  }


  async function loadExpenses() {
    const { data, error } = await supabase
      .from("expenses")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    if (error) {
      console.log(error);
      return;
    }

    setExpenses(data || []);
  }


  async function logout() {
    await supabase.auth.signOut();
    setUser(null);
  }


  if (!user) {
    return (
      <Login
        onLogin={(loggedInUser) => setUser(loggedInUser)}
      />
    );
  }


  if (!budget) {
    return <p>Loading Bloom Meadow 🌸</p>;
  }


  const checkingSpent = expenses
    .filter(
      (expense) =>
        expense.payment_account === "Checking"
    )
    .reduce(
      (total, expense) =>
        total + Number(expense.amount),
      0
    );


  const savingsSpent = expenses
    .filter(
      (expense) =>
        expense.payment_account === "Savings"
    )
    .reduce(
      (total, expense) =>
        total + Number(expense.amount),
      0
    );


  const currentChecking =
    Number(budget.checking) - checkingSpent;


  const currentSavings =
    Number(budget.savings) - savingsSpent;



  if (page === "expenses") {
    return (
      <div className="app">

        <Expenses user={user} />

        <nav className="nav">

          <button onClick={() => setPage("home")}>
            🌱 Home
          </button>

          <button>
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

        <p>
          Welcome back, Tami 🌿
        </p>

        <button onClick={logout}>
          Log Out
        </button>

      </header>



      <section className="cards">


        <div className="card">
          <h2>💙 Checking</h2>
          <p>
            ${currentChecking}
          </p>
        </div>


        <div className="card">
          <h2>🌱 Emergency Savings</h2>
          <p>
            ${currentSavings}
          </p>
        </div>


        <div className="card">
          <h2>🚢 Cruise Fund</h2>
          <p>
            $0 / ${budget.cruise_goal}
          </p>
        </div>


        <div className="card">
          <h2>💳 Credit Card</h2>
          <p>
            ${budget.credit_card_balance}
          </p>
        </div>


      </section>



      <nav className="nav">


        <button>
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

export default App;
