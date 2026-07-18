import React from "react";
import Navigation from "./Navigation.jsx";

function Layout({
  children,
  profile,
  setPage
}) {

  return (

    <div className={`app ${profile?.theme || "sage"}`}>

      {children}

      <Navigation setPage={setPage} />

    </div>

  );

}

export default Layout;
