
import React, { useState, useEffect } from "react";
import Login from "./Login.jsx";
import Expenses from "./Expenses.jsx";
import Income from "./Income.jsx";
import Cruise from "./Cruise.jsx";
import Bills from "./Bills.jsx";
import { supabase } from "./supabaseClient";
import "./index.css";

function App() {
  const [user, setUser] = useState(null);
  const [budget, setBudget] = useState(null);
  const [expenses, setExpenses] = useState([]);
  const [page, setPage] = useState("home");
  const [income, setIncome] = useState([]);
  const [bills, setBills] = useState([]);
  
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

  loadIncome().then((data) => {
    setIncome(data);
  });

  loadBills().then((data) => {
    setBills(data);
  });
}
  }, [user]);

async function loadIncome() {
  const { data, error } = await supabase
    .from("income")
    .select("*")
    .eq("user_id", user.id);

  if (error) {
    console.log(error);
    return;
  }

  return data || [];
}

  async function loadBills() {
  const { data, error } = await supabase
    .from("bills")
    .select("*")
    .eq("user_id", user.id)
    .order("due_date", { ascending: true });

  if (error) {
    console.log(error);
    return;
  }

  return data || [];
}
  
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

const weeklyIncome = income.reduce(
  (total, job) =>
    total +
    Number(job.hourly_rate) *
    Number(job.hours_per_week),
  0
);

const monthlyIncome = weeklyIncome * 4.33;

const monthlyExpenses = expenses.reduce(
  (total, expense) =>
    total + Number(expense.amount),
  0
);

const availableMoney =
  monthlyIncome - monthlyExpenses;

  const upcomingBills = bills
  .filter((bill) => !bill.paid)
  .slice(0, 3);
  
if (page === "bills") {
  return (
    <div className="app">

      <Bills user={user} />

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

        <button onClick={() => setPage("cruise")}>
          🚢 Cruise
        </button>

        <button onClick={() => setPage("bills")}>
          📅 Bills
        </button>

      </nav>

    </div>
  );
}

  
if (page === "cruise") {
  return (
    <div className="app">

      <Cruise user={user} />

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

        <button onClick={() => setPage("cruise")}>
          🚢 Cruise
        </button>

      </nav>

    </div>
  );
}

  
if (page === "income") {
  return (
    <div className="app">

      <Income user={user} />

      <nav className="nav">

        <button onClick={() => setPage("home")}>
          🌱 Home
        </button>

        <button onClick={() => setPage("expenses")}>
          💸 Expenses
        </button>

        <button onClick={() => setPage("bills")}>
         📅 Bills
       </button>
        
<button onClick={() => setPage("income")}>
  💰 Income
</button>
        
   <button onClick={() => setPage("cruise")}>
  🚢 Cruise
</button>     
        
        <button>
          🌸 Goals
        </button>

      </nav>

    </div>
  );
}
  
  if (page === "expenses") {

    return (
      <div className="app">

        <Expenses 
  user={user} 
  onExpenseAdded={loadExpenses}
/>
        <nav className="nav">

          <button onClick={() => setPage("home")}>
            🌱 Home
          </button>

          <button>
            💸 Expenses
          </button>

         <button onClick={() => setPage("bills")}>
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

        <h1>
          🌸 Bloom Meadow
        </h1>

        <p>
          Welcome back, Tami 🌿
        </p>


        <button onClick={logout}>
          Log Out
        </button>

      </header>



      <section className="cards">

     <div className="card">
        <h2>💰 Monthly Income</h2>
       <p>
          ${monthlyIncome.toFixed(2)}
       </p>
     </div>


      <div className="card">
        <h2>🌿 Available After Expenses</h2>
        <p>
          ${availableMoney.toFixed(2)}
        </p>
     </div>

        <div className="card">
  <h2>📅 Upcoming Bills</h2>

  {upcomingBills.length === 0 ? (

    <p>
      No upcoming bills 🌸
    </p>

  ) : (

    upcomingBills.map((bill) => (

      <div key={bill.id}>

        <p>
          {bill.bill_name}
        </p>

        <small>
          ${Number(bill.amount).toFixed(2)}
          <br />
          Due: {bill.due_date}
        </small>

      </div>

    ))

  )}

</div>
        
        <div className="card">
          <h2>💙 Checking</h2>
          <p>
            ${currentChecking.toFixed(2)}
          </p>
        </div>



        <div className="card">
          <h2>🌿 Safe to Spend</h2>
          <p>
            ${currentChecking.toFixed(2)}
          </p>
        </div>



        <div className="card">
          <h2>🌱 Emergency Savings</h2>
          <p>
            ${currentSavings.toFixed(2)}
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
            ${Number(budget.credit_card_balance).toFixed(2)}
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

        <button onClick={() => setPage("income")}>
          💰 Income
        </button>
        
        <button onClick={() => setPage("cruise")}>
         🚢 Cruise
       </button>
        
        <button onClick={() => setPage("bills")}>
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
