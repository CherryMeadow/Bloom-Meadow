import React from "react";

function Header({
  profile,
  logout
}) {

  return (
    <header className="header">

      <h1>
        🌸 Bloom Meadow
      </h1>

      <p>
        Welcome back, {profile?.display_name || "there"} 🌿
      </p>

      <button onClick={logout}>
        Log Out
      </button>

    </header>
  );

}

export default Header;
