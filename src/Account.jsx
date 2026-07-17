import React, { useState, useEffect } from "react";
import { supabase } from "./supabaseClient";

function Account({ user, onProfileUpdate }) {

  const [name, setName] = useState("");
  const [email, setEmail] = useState(user.email);
  const [loading, setLoading] = useState(false);


useEffect(() => {

  async function loadProfile() {

    const { data, error } = await supabase
      .from("profiles")
      .select("display_name")
      .eq("user_id", user.id)
      .maybeSingle();


    if (error) {
      console.log(error);
      return;
    }


    if (data) {
      setName(data.display_name);
    }

  }


  loadProfile();

}, [user]);

  
  async function updateEmail() {

    setLoading(true);

    const { error } =
      await supabase.auth.updateUser({
        email,
      });


    setLoading(false);


    if (error) {
      alert(error.message);
      return;
    }


    alert(
      "Email update request sent 🌸 Check your email to confirm."
    );

  }


async function updateName() {

  setLoading(true);

  const { error } = await supabase
    .from("profiles")
    .update({
      display_name: name
    })
    .eq("user_id", user.id);


  if (error) {
    alert(error.message);
    setLoading(false);
    return;
  }
 

alert("Name updated 🌸");

if (onProfileUpdate) {
  onProfileUpdate();
}

setLoading(false);
}


  async function changePassword() {

    const password =
      prompt(
        "Enter your new password"
      );


    if (!password) {
      return;
    }



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




  async function logout(){

    await supabase.auth.signOut();

  }





  return (

    <div className="section">


      <h1>
        ⚙️ Account Settings
      </h1>


<div className="card">

<h2>
Name
</h2>

<input
  value={name}
  placeholder="Enter your name"
  onChange={(e)=>
    setName(e.target.value)
  }
/>

<button onClick={updateName}>
  Save Name 🌸
</button>

</div>

      <div className="card">

        <h2>
          🌸 Email
        </h2>


        <p>
          Current email:
        </p>


        <input
          value={email}
          onChange={(e)=>
            setEmail(e.target.value)
          }
        />



        <button
          onClick={updateEmail}
          disabled={loading}
        >

          {loading
          ? "Updating..."
          : "Change Email"}

        </button>


      </div>





      <div className="card">

        <h2>
          🔐 Security
        </h2>


        <button
          onClick={changePassword}
        >
          Change Password
        </button>


      </div>





      <div className="card">

        <h2>
          🌿 Session
        </h2>


        <button
          onClick={logout}
        >
          Log Out
        </button>


      </div>




    </div>

  );

}


export default Account;
