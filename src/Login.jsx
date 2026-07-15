import React, { useState } from "react";
import { supabase } from "./supabaseClient";

function Login({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [signup, setSignup] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();

    let result;

    if (signup) {
      result = await supabase.auth.signUp({
        email,
        password,
      });
    } else {
      result = await supabase.auth.signInWithPassword({
        email,
        password,
      });
    }

    if (result.error) {
      alert(result.error.message);
    } else {
      onLogin();
    }
  }

  return (
    <div className="login">
      <h1>🌸 Bloom Meadow</h1>
      <p>Grow your finances one step at a time 🌿</p>

      <form onSubmit={handleSubmit}>
        <input
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          placeholder="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button>
          {signup ? "Create Account" : "Login"}
        </button>
      </form>

      <button onClick={() => setSignup(!signup)}>
        {signup
          ? "Already have an account? Login"
          : "Create a new account"}
      </button>
    </div>
  );
}

export default Login;
