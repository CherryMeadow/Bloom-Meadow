import React, { useState } from "react";
import { supabase } from "./supabaseClient";

function Account({ user }) {

  const [email, setEmail] = useState(
    user.email
  );

  async function updateEmail() {

    const { error } =
      await supabase.auth.updateUser({
        email,
      });


    if (error) {
      alert(error.message);
      return;
    }


    alert(
      "Email update request sent 🌸"
    );

  }



  async function changePassword() {

    const password =
      prompt(
        "Enter your new password"
      );


    if (!password) return;


    const { error } =
      await supabase.auth.updateUser({
        password,
      });


    if (error) {
      alert(error.message);
      return;
    }


    alert(
      "Password updated 🌿"
    );

  }



  return (

    <div className="section">

      <h1>
        ⚙️ Account
      </h1>


      <div className="card">

        <h2>
          Email
        </h2>


        <input
          value={email}
          onChange={(e)=>
            setEmail(e.target.value)
          }
        />


        <button onClick={updateEmail}>
          Change Email
        </button>


      </div>



      <div className="card">

        <button
          onClick={changePassword}
        >
          Change Password 🔐
        </button>

      </div>


    </div>

  );

}

export default Account;
