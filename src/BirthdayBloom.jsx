import React, { useState } from "react";

function BirthdayBloom({ profile }) {
  
console.log("Profile birthday:", profile?.birthday);
  
  const [open, setOpen] = useState(false);

return (

  <div className="birthday-container">

    <button
      className="birthday-button"
      onClick={() => setOpen(true)}
    >
      🌸 Open Your Birthday Gift 🌸
    </button>

  </div>

);


  const today = new Date();

const birthday = new Date(profile.birthday);

if (!profile?.birthday) {
  return null;
}

const today = new Date();
const birthday = new Date(profile.birthday);

const isBirthday =
  today.getMonth() === birthday.getMonth() &&
  today.getDate() === birthday.getDate();

if (!isBirthday) {
  return null;
}

if (!isBirthday) {
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
