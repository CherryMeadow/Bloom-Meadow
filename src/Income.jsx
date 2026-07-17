import React, { useEffect, useState } from "react";
import { supabase } from "./supabaseClient";

function Income({ user, onIncomeUpdated }) {

  const [income, setIncome] = useState([]);

  const [jobName, setJobName] = useState("");
  const [hourlyRate, setHourlyRate] = useState("");
  const [hoursPerWeek, setHoursPerWeek] = useState("");
  const [paySchedule, setPaySchedule] = useState("Weekly");

  const [editingIncome, setEditingIncome] = useState(null);



  useEffect(() => {
    if(user){
      loadIncome();
    }
  },[user]);



  async function loadIncome(){

    const {data,error} = await supabase
      .from("income")
      .select("*")
      .eq("user_id",user.id)
      .order("created_at",{ascending:false});


    if(error){
      console.log(error);
      return;
    }


    setIncome(data || []);

  }





  async function saveIncome(){

    if(!jobName || !hourlyRate || !hoursPerWeek){
      alert("Please fill out all fields.");
      return;
    }



    const incomeData = {

      job_name: jobName,
      hourly_rate:Number(hourlyRate),
      hours_per_week:Number(hoursPerWeek),
      pay_schedule:paySchedule,

    };



    if(editingIncome){


      const {error}=await supabase
        .from("income")
        .update(incomeData)
        .eq("id",editingIncome.id);



      if(error){
        alert(error.message);
        return;
      }



    }else{


      const {error}=await supabase
        .from("income")
        .insert([
          {
            user_id:user.id,
            ...incomeData,
          }
        ]);



      if(error){
        alert(error.message);
        return;
      }


    }



    clearForm();
    loadIncome();

    if(onIncomeUpdated){
      onIncomeUpdated();
    }

  }





  function editJob(job){

    setEditingIncome(job);

    setJobName(job.job_name);
    setHourlyRate(job.hourly_rate);
    setHoursPerWeek(job.hours_per_week);
    setPaySchedule(job.pay_schedule);

  }





  function clearForm(){

    setEditingIncome(null);

    setJobName("");
    setHourlyRate("");
    setHoursPerWeek("");
    setPaySchedule("Weekly");

  }





  async function deleteJob(id){

    if(!window.confirm("Delete this job?")){
      return;
    }


    await supabase
      .from("income")
      .delete()
      .eq("id",id);


    loadIncome();


    if(onIncomeUpdated){
      onIncomeUpdated();
    }

  }





  return (

    <div className="section">


      <h1>
        💰 Income
      </h1>



      <div className="card">


        <input
          placeholder="Job name"
          value={jobName}
          onChange={(e)=>
            setJobName(e.target.value)
          }
        />



        <input
          type="number"
          placeholder="Hourly rate"
          value={hourlyRate}
          onChange={(e)=>
            setHourlyRate(e.target.value)
          }
        />



        <input
          type="number"
          placeholder="Hours per week"
          value={hoursPerWeek}
          onChange={(e)=>
            setHoursPerWeek(e.target.value)
          }
        />



        <select
          value={paySchedule}
          onChange={(e)=>
            setPaySchedule(e.target.value)
          }
        >

          <option>Weekly</option>
          <option>Biweekly</option>
          <option>Monthly</option>

        </select>




        <button onClick={saveIncome}>

          {editingIncome
            ? "Save Changes ✏️"
            : "Add Job 💰"}

        </button>


      </div>





      {income.map((job)=>(

        <div
          className="card"
          key={job.id}
        >


          <h2>
            💼 {job.job_name}
          </h2>


          <p>
            ${Number(job.hourly_rate).toFixed(2)}
            /hr
          </p>


          <p>
            {job.hours_per_week}
            {" "}
            hours/week
          </p>


          <p>
            📅 {job.pay_schedule}
          </p>



          <p>
            Weekly:
            {" "}
            $
            {(Number(job.hourly_rate) *
            Number(job.hours_per_week))
            .toFixed(2)}
          </p>



          <button
            onClick={()=>
              editJob(job)
            }
          >
            ✏️ Edit
          </button>



          <button
            onClick={()=>
              deleteJob(job.id)
            }
          >
            🗑️ Delete
          </button>


        </div>

      ))}



    </div>

  );

}


export default Income;
