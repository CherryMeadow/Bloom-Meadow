import React from "react";
import "./index.css";
function App() {
  return (
    <div className="app">
      <header className="header">
        <h1>🌸 Bloom Meadow</h1>
        <p>Welcome back, Tami 🌿</p>
      </header>

      <section className="cards">
        <div className="card">
          <h2>💙 Safe to Spend</h2>
          <p>$0.00</p>
        </div>

        <div className="card">
          <h2>🏦 Checking</h2>
          <p>$258</p>
        </div>

        <div className="card">
          <h2>🌱 Emergency Savings</h2>
          <p>$2,921</p>
        </div>

        <div className="card">
          <h2>🚢 Cruise Fund</h2>
          <p>$0 / $800</p>
        </div>
      </section>

      <section className="section">
        <h2>📅 Upcoming Bills</h2>
        <ul>
          <li>Klarna - Marriott Bonvoy: $17.83 (July 29)</li>
          <li>National Grid: $38.96 (July 31)</li>
          <li>Credit Card: $50 (Aug 7-9)</li>
          <li>Paramount+: $13.99 (Aug 12)</li>
        </ul>
      </section>

      <section className="section">
        <h2>🌸 Goals</h2>
        <p>🚢 Cruise Goal: $800</p>
        <p>🌿 Savings Goal: $100/month</p>
        <p>💳 Credit Card: $1,517 / $1,500 limit</p>
      </section>

      <nav className="nav">
        <button>🌱 Home</button>
        <button>💸 Expenses</button>
        <button>📅 Bills</button>
        <button>🌸 Goals</button>
      </nav>
    </div>
  );
}

export default App;
