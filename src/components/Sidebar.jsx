import "./Sidebar.css";
import { NavLink } from "react-router-dom";
import logo from "../assets/logo.png";

const Sidebar = () => {
  return (
    <div className="sidebar">

      {/* 🔥 LOGO SECTION (FIXED) */}
      <div className="sidebar-header">
        <img src={logo} alt="logo" className="sidebar-logo-img" />
      </div>

      {/* 🔥 NAV SECTION (SCROLLABLE) */}
      <nav className="sidebar-nav">
        <NavLink to="/" end className="link">
          Dashboard
        </NavLink>

        <NavLink to="/products" className="link">
          Products
        </NavLink>

        <NavLink to="/add-product" className="link">
          Add Product
        </NavLink>
      </nav>

    </div>
  );
};

export default Sidebar;