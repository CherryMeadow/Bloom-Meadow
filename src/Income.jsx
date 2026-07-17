import React, { useEffect, useState } from "react";
import { supabase } from "./supabaseClient";

function Income({ user }) {
  const [income, setIncome] = useState([]);
  const [jobName, setJobName] = useState("");
  const [hourlyRate, setHourlyRate] = useState("");
  const [hoursPerWeek, setHoursPerWeek] = useState("");


  useEffect(() => {
    if (user) {
      loadIncome();
    }
  }, [user]);


  async function loadIncome() {
    const { data, error } = await supabase
      .from("income")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });


    if (error) {
      console.log(error);
      return;
    }

    setIncome(data || []);
  }



  async function addIncome() {

    if (!jobName || !hourlyRate || !hoursPerWeek) {
      alert("Please fill in all fields.");
      return;
    }


    const { error } = await supabase
      .from("income")
      .insert([
        {
          user_id: user.id,
          job_name: jobName,
          hourly_rate: Number(hourlyRate),
          hours_per_week: Number(hoursPerWeek),
        },
      ]);


    if (error) {
      alert(error.message);
      console.log(error);
      return;
    }


    setJobName("");
    setHourlyRate("");
    setHoursPerWeek("");

    await loadIncome();
  }




  async function deleteIncome(id) {

    const { error } = await supabase
      .from("income")
      .delete()
      .eq("id", id);


    if (error) {
      console.log(error);
      return;
    }


    await loadIncome();
  }



  const weeklyIncome = income.reduce(
    (total, job) =>
      total +
      Number(job.hourly_rate) *
      Number(job.hours_per_week),
    0
  );


  const monthlyIncome = weeklyIncome * 4.33;


  const yearlyIncome = weeklyIncome * 52;



  return (
    <div className="section">

      <h1>
        💰 Income
      </h1>



      <div className="card">

        <h2>
          Weekly
        </h2>

        <p>
          ${weeklyIncome.toFixed(2)}
        </p>


        <h2>
          Monthly
        </h2>

        <p>
          ${monthlyIncome.toFixed(2)}
        </p>


        <h2>
          Yearly
        </h2>

        <p>
          ${yearlyIncome.toFixed(2)}
        </p>

      </div>




      <div className="card">

        <input
          placeholder="Job name"
          value={jobName}
          onChange={(e) =>
            setJobName(e.target.value)
          }
        />


        <input
          placeholder="Hourly rate"
          type="number"
          value={hourlyRate}
          onChange={(e) =>
            setHourlyRate(e.target.value)
          }
        />


        <input
          placeholder="Hours per week"
          type="number"
          value={hoursPerWeek}
          onChange={(e) =>
            setHoursPerWeek(e.target.value)
          }
        />


        <button onClick={addIncome}>
          Add Income 🌱
        </button>

      </div>




      <h2>
        Jobs
      </h2>



      {income.map((job) => (

        <div className="card" key={job.id}>

          <h3>
            {job.job_name}
          </h3>


          <p>
            ${job.hourly_rate}/hr
          </p>


          <p>
            {job.hours_per_week} hrs/week
          </p>


          <button
            onClick={() => deleteIncome(job.id)}
          >
            🗑️ Delete
          </button>


        </div>

      ))}


    </div>
  );
}


export default Income;
