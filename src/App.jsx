
import React, { useState, useEffect } from "react";
import Login from "./Login.jsx";
import Expenses from "./Expenses.jsx";
import Income from "./Income.jsx";
import Cruise from "./Cruise.jsx";
import Bills from "./Bills.jsx";
import Goals from "./Goals.jsx";
import CreditCard from "./CreditCard.jsx";
import Account from "./Account.jsx";
import Dashboard from "./Dashboard.jsx";
import Navigation from "./Navigation.jsx";
import Layout from "./Layout.jsx";
import Money from "./Money.jsx";
import "./index.css";
import { supabase } from "./supabaseClient";

function App() {
  const [user, setUser] = useState(null);
  const [budget, setBudget] = useState(null);
  const [expenses, setExpenses] = useState([]);
  const [page, setPage] = useState("home");
  const [income, setIncome] = useState([]);
  const [bills, setBills] = useState([]);
  const [cruiseItems, setCruiseItems] = useState([]);
  const [profile, setProfile] = useState(null);
  const [money, setMoney] = useState([]);
 
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
    loadProfile();
    loadMoney();
    
    loadIncome().then((data) => {
      setIncome(data);
    });

    loadBills().then((data) => {
      setBills(data);
    });

    loadCruiseItems().then((data) => {
      setCruiseItems(data);
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
 async function loadCruiseItems() {
  const { data, error } = await supabase
    .from("cruise")
    .select("*")
    .eq("user_id", user.id);

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
    .maybeSingle();


  if (error) {
    console.log(error);
    return;
  }


  if (!data) {

    const { data: newBudget, error: insertError } =
      await supabase
        .from("budget_data")
        .insert([
          {
            user_id: user.id,
            checking: 0,
            savings: 0,
            credit_card_balance: 0,
          },
        ])
        .select()
        .single();


    if (insertError) {
      console.log(insertError);
      return;
    }


    setBudget(newBudget);


  } else {

    setBudget(data);

  }

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

  async function loadMoney() {

  const { data, error } = await supabase
    .from("money")
    .select("*")
    .eq("user_id", user.id);

  if (error) {
    console.log(error);
    return;
  }

  setMoney(data || []);
}
  
async function loadProfile() {

  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("user_id", user.id)
    .maybeSingle();


  if (error) {
    console.log(error);
    return;
  }


  if (!data) {

    const { data: newProfile, error: insertError } =
      await supabase
        .from("profiles")
        .insert([
          {
            user_id: user.id,
            display_name: "New User",
            theme: "sage",
            accent_color: "#8fbfae"
          }
        ])
        .select()
        .single();


    if (insertError) {
      console.log(insertError);
      return;
    }


    setProfile(newProfile);

  } else {

    setProfile(data);

  }

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
  return (
    <div className="loading-screen">

      <div className="loading-card">

        <h1>
          🌸 Bloom Meadow
        </h1>

        <p>
          Growing your budget 🌿
        </p>

      </div>

    </div>
  );
}

  
if (page === "bills") {
 return (
  <Layout
    profile={profile}
    setPage={setPage}
  >

    <Bills
      user={user}
      profile={profile}
    />

  </Layout>
);
}

  
if (page === "goals") {
return (
  <Layout
    profile={profile}
    setPage={setPage}
  >

    <Goals
      user={user}
    />

  </Layout>
);
}
  
if (page === "cruise") {
  return (
    <Layout
      profile={profile}
      setPage={setPage}
    >

      <Cruise
        user={user}
      />

    </Layout>
  );
}

  
if (page === "income") {
  return (
  <Layout
    profile={profile}
    setPage={setPage}
  >

    <Income
      user={user}
    />

  </Layout>
);
}
  
if (page === "money") {
  return (
  <Layout
    profile={profile}
    setPage={setPage}
  >

    <Money
      user={user}
    />

  </Layout>
);
}  

  
  if (page === "expenses") {

    return (
  <Layout
    profile={profile}
    setPage={setPage}
  >

    <Expenses
      user={user}
      onExpenseAdded={loadExpenses}
    />

  </Layout>
);
  }


if (page === "credit") {
  return (
  <Layout
    profile={profile}
    setPage={setPage}
  >

    <CreditCard
      user={user}
    />

  </Layout>
);
}


if (page === "account") {
  return (
    <Layout
      profile={profile}
      setPage={setPage}
    >

      <Account
        user={user}
        onProfileUpdate={loadProfile}
      />

    </Layout>
  );
}

return (

  <Layout
    profile={profile}
    setPage={setPage}
  >

    <Dashboard
      profile={profile}
      budget={budget}
      income={income}
      expenses={expenses}
      bills={bills}
      money={money}
      cruiseItems={cruiseItems}
      logout={logout}
      setPage={setPage}
    />

  </Layout>

);
}

export default App;
