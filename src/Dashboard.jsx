import React from "react";
import Header from "./Header.jsx";
import BirthdayBloom from "./BirthdayBloom.jsx";
import {
  calculateMonthlyIncome,
  calculateMonthlyExpenses,
  calculateAvailableMoney,
  calculateCheckingBalance,
  calculateSavingsBalance
} from "./utils/calculations.js";

function Dashboard({
  profile,
  budget,
  income,
  expenses,
  bills,
  money,
  cruiseItems,
  logout,
  setPage
}) {
  
const currentChecking = calculateCheckingBalance(
  budget,
  expenses,
  extraMoney
);


const currentSavings = calculateSavingsBalance(
  budget,
  expenses
);
  
 const extraMoney = money.reduce(
  (total, item) => total + Number(item.amount),
  0
);



const monthlyIncome = calculateMonthlyIncome(income);

const monthlyExpenses = calculateMonthlyExpenses(expenses);

const availableMoney =
  calculateAvailableMoney(
    monthlyIncome,
    monthlyExpenses
  ) + extraMoney;
  
const cruisePaid = cruiseItems.reduce(
  (total, item) =>
    total + Number(item.paid_amount),
  0
);


const cruiseTotal = cruiseItems.reduce(
  (total, item) =>
    total + Number(item.total_amount),
  0
);

  const cruisePercentage =
  cruiseTotal > 0
    ? (cruisePaid / cruiseTotal) * 100
    : 0;
  
  const upcomingBills = bills
  .filter((bill) => !bill.paid)
  .slice(0, 3);
  
    return (
  <div className={`app ${profile?.theme || "sage"}`}>

<Header
  profile={profile}
  logout={logout}
>

  <BirthdayBloom
    profile={profile}
  />

</Header>
  
        <section className="cards">


<div
  className="card clickable"
  onClick={() => setPage("income")}
>
  <h2>💰 Monthly Income</h2>
  <p>
    ${monthlyIncome.toFixed(2)}
  </p>
</div>



<div
  className="card clickable"
  onClick={() => setPage("expenses")}
>
  <h2>🌿 Available After Expenses</h2>
  <p>
    ${availableMoney.toFixed(2)}
  </p>
</div>



<div
  className="card clickable"
  onClick={() => setPage("bills")}
>
  <h2>📅 Upcoming Bills</h2>

  {upcomingBills.length === 0 ? (

    <p>
      No upcoming bills 🌸
    </p>

  ) : (

    upcomingBills.map((bill)=>(

      <div key={bill.id}>

        <p>
          {bill.bill_name}
        </p>

        <small>
          ${Number(bill.amount).toFixed(2)}
          <br/>
          Due: {bill.due_date}
        </small>

      </div>

    ))

  )}

</div>



<div
  className="card clickable"
  onClick={() => setPage("expenses")}
>
  <h2>💙 Checking</h2>

  <p>
    ${currentChecking.toFixed(2)}
  </p>

</div>



<div
  className="card clickable"
  onClick={() => setPage("expenses")}
>
  <h2>🌿 Safe to Spend</h2>

  <p>
    ${currentChecking.toFixed(2)}
  </p>

</div>




<div
  className="card clickable"
  onClick={() => setPage("goals")}
>
  <h2>🌱 Emergency Savings</h2>

  <p>
    ${currentSavings.toFixed(2)}
  </p>

</div>




<div
  className="card clickable"
  onClick={() => setPage("cruise")}
>

  <h2>
    🚢 Cruise Fund
  </h2>

  <p>
    ${cruisePaid.toFixed(2)} / ${cruiseTotal.toFixed(2)}
  </p>

  <div className="progress-bar">

    <div
      className="progress-fill"
      style={{
        width:`${cruisePercentage}%`
      }}
    ></div>

  </div>


  <small>
    {cruisePercentage.toFixed(0)}% complete
  </small>

</div>





<div
  className="card clickable"
  onClick={() => setPage("credit")}
>

<h2>
💳 Credit Card
</h2>

<p>
${Number(budget.credit_card_balance).toFixed(2)}
</p>

</div>





<div
  className="card clickable"
  onClick={() => setPage("goals")}
>

<h2>
🌸 Goals
</h2>

<p>
Track your savings goals
</p>

</div>


</section>
    
    </div>
  );

}

export default Dashboard;
