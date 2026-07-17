
import React, { useEffect, useState } from "react";
import { supabase } from "./supabaseClient";

function Goals({ user }) {

  const [goals, setGoals] = useState([]);

  const [goalName, setGoalName] = useState("");
  const [targetAmount, setTargetAmount] = useState("");
  const [savedAmount, setSavedAmount] = useState("");
  const [deadline, setDeadline] = useState("");

  const [editingGoal, setEditingGoal] = useState(null);



  useEffect(() => {
    if(user){
      loadGoals();
    }
  }, [user]);



  async function loadGoals(){

    const {data,error} = await supabase
      .from("goals")
      .select("*")
      .eq("user_id",user.id)
      .order("created_at",{ascending:false});


    if(error){
      console.log(error);
      return;
    }


    setGoals(data || []);

  }





  async function saveGoal(){

    if(!goalName || !targetAmount){
      alert("Please enter a goal name and amount.");
      return;
    }



    const goalData = {

      goal_name: goalName,
      target_amount: Number(targetAmount),
      saved_amount: Number(savedAmount || 0),
      deadline,

    };



    if(editingGoal){


      const {error}=await supabase
        .from("goals")
        .update(goalData)
        .eq("id",editingGoal.id);


      if(error){
        alert(error.message);
        return;
      }



    } else {


      const {error}=await supabase
        .from("goals")
        .insert([
          {
            user_id:user.id,
            ...goalData,
          }
        ]);



      if(error){
        alert(error.message);
        return;
      }


    }



    clearForm();
    loadGoals();

  }





  function editGoal(goal){

    setEditingGoal(goal);

    setGoalName(goal.goal_name);
    setTargetAmount(goal.target_amount);
    setSavedAmount(goal.saved_amount);
    setDeadline(goal.deadline);

  }





  function clearForm(){

    setEditingGoal(null);

    setGoalName("");
    setTargetAmount("");
    setSavedAmount("");
    setDeadline("");

  }





  async function deleteGoal(id){

    if(!window.confirm("Delete this goal?")){
      return;
    }


    await supabase
      .from("goals")
      .delete()
      .eq("id",id);


    loadGoals();

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
          onChange={(e)=>
            setGoalName(e.target.value)
          }
        />



        <input
          type="number"
          placeholder="Target amount"
          value={targetAmount}
          onChange={(e)=>
            setTargetAmount(e.target.value)
          }
        />



        <input
          type="number"
          placeholder="Saved amount"
          value={savedAmount}
          onChange={(e)=>
            setSavedAmount(e.target.value)
          }
        />



        <input
          type="date"
          value={deadline}
          onChange={(e)=>
            setDeadline(e.target.value)
          }
        />



        <button onClick={saveGoal}>

          {editingGoal
          ? "Save Changes ✏️"
          : "Add Goal 🌸"}

        </button>


      </div>





      {goals.map((goal)=>{


        const progress =
          goal.target_amount === 0
          ? 0
          :
          (Number(goal.saved_amount) /
          Number(goal.target_amount))
          * 100;



        return (

          <div
            className="card"
            key={goal.id}
          >


            <h2>
              🌸 {goal.goal_name}
            </h2>


            <p>
              Saved:
              ${Number(goal.saved_amount).toFixed(2)}
            </p>


            <p>
              Goal:
              ${Number(goal.target_amount).toFixed(2)}
            </p>


            <p>
              Progress:
              {progress.toFixed(0)}%
            </p>


            <p>
              📅 {goal.deadline || "No deadline"}
            </p>




            <button
              onClick={() =>
                editGoal(goal)
              }
            >
              ✏️ Edit
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
