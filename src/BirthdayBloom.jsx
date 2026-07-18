import React, { useState } from "react";

function BirthdayBloom({ profile }) {

  const [open, setOpen] = useState(false);


  if (!profile?.birthday) {
    return null;
  }


  const today = new Date().toISOString().slice(0, 10);


  if (profile.birthday !== today) {
    return null;
  }


  return (

    <div className="birthday-container">


      {!open ? (

        <button
          className="birthday-button"
          onClick={() => setOpen(true)}
        >
          🌸 Open Your Birthday Gift 🌸
        </button>

      ) : (

        <div className="birthday-card">

          <h2>
            🌸 Your Birthday Bloom 🌸
          </h2>


          <p>
            Happy Birthday! 🎂
          </p>


          <p>
            A new year of your garden begins.
          </p>


          <p>
            🌱 New growth
            <br/>
            🌷 Beautiful memories
            <br/>
            ✨ Exciting adventures
          </p>


          <p>
            Enjoy your special day 💕
          </p>


        </div>

      )}


    </div>

  );

}


export default BirthdayBloom;
