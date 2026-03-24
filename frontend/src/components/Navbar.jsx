import "./Navbar.css";
import { useState } from "react";

const Navbar = () => {
  const [open, setOpen] = useState(false);

  const user = JSON.parse(localStorage.getItem("user"));

  const handleLogout = () => {
    localStorage.removeItem("user");
    window.location.href = "/auth";
  };

  return (
    <div className="navbar">

      {/* LEFT */}
      <div className="left">
        <h2>Dashboard</h2>
      </div>

      {/* RIGHT */}
      <div className="right">

        <input
          type="text"
          placeholder="Search..."
          className="search"
        />

        {/* PROFILE */}
        <div className="profile-box">
          <div
            className="profile"
            onClick={() => setOpen(!open)}
          >
            {user?.name ? user.name[0].toUpperCase() : ""}
          </div>

          {/* DROPDOWN */}
          {open && (
            <div className="dropdown">
              <p className="user-name">
                {user?.name || "User"}
              </p>

              <button onClick={handleLogout}>
                Logout
              </button>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default Navbar;
