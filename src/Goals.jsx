import React, { useEffect, useState } from "react";
import { supabase } from "./supabaseClient";

function Goals({ user }) {

  const [goals, setGoals] = useState([]);

  const [goalName, setGoalName] = useState("");
  const [targetAmount, setTargetAmount] = useState("");
  const [savedAmount, setSavedAmount] = useState("");


  useEffect(() => {
    if (user) {
      loadGoals();
    }
  }, [user]);



  async function loadGoals() {

    const { data, error } = await supabase
      .from("goals")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });


    if (error) {
      console.log(error);
      return;
    }


    setGoals(data || []);

  }



  async function addGoal() {

    if (!goalName || !targetAmount) {
      alert("Please enter a goal name and amount.");
      return;
    }


    const { error } = await supabase
      .from("goals")
      .insert([
        {
          user_id: user.id,
          goal_name: goalName,
          target_amount: Number(targetAmount),
          saved_amount: Number(savedAmount || 0),
        },
      ]);


    if (error) {
      alert(error.message);
      return;
    }


    setGoalName("");
    setTargetAmount("");
    setSavedAmount("");

    await loadGoals();

  }



  async function addMoney(goal) {

    const amount = prompt(
      "How much did you save?"
    );


    if (!amount) return;


    const newAmount =
      Number(goal.saved_amount) + Number(amount);



    const { error } = await supabase
      .from("goals")
      .update({
        saved_amount: newAmount,
      })
      .eq("id", goal.id);



    if (error) {
      alert(error.message);
      return;
    }


    await loadGoals();

  }



  async function deleteGoal(id) {

    await supabase
      .from("goals")
      .delete()
      .eq("id", id);


    await loadGoals();

  }



  return (

    <div className="section">

      <h1>
        🌸 Goals
      </h1>


      <div className="card">


        <input
          placeholder="Goal name"
          value={goalName}
          onChange={(e) =>
            setGoalName(e.target.value)
          }
        />


        <input
          type="number"
          placeholder="Target amount"
          value={targetAmount}
          onChange={(e) =>
            setTargetAmount(e.target.value)
          }
        />


        <input
          type="number"
          placeholder="Already saved"
          value={savedAmount}
          onChange={(e) =>
            setSavedAmount(e.target.value)
          }
        />


        <button onClick={addGoal}>
          Add Goal 🌱
        </button>


      </div>



      {goals.map((goal) => {


        const percentage =
          goal.target_amount > 0
            ? (goal.saved_amount /
                goal.target_amount) * 100
            : 0;



        return (

          <div className="card" key={goal.id}>


            <h2>
              {goal.goal_name}
            </h2>


            <p>
              ${Number(goal.saved_amount).toFixed(2)}
              {" / "}
              ${Number(goal.target_amount).toFixed(2)}
            </p>



            <div className="progress-bar">

              <div
                className="progress-fill"
                style={{
                  width: `${percentage}%`,
                }}
              ></div>

            </div>


            <small>
              {percentage.toFixed(0)}% complete
            </small>



            <br />


            <button
              onClick={() =>
                addMoney(goal)
              }
            >
              💰 Add Money
            </button>



            <button
              onClick={() =>
                deleteGoal(goal.id)
              }
            >
              🗑️ Delete
            </button>



          </div>

        );

      })}


    </div>

  );

}


export default Goals;
