import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useEffect, useState } from "react";

import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";

import Dashboard from "./pages/Dashboard";
import Products from "./pages/Products";
import AddProduct from "./pages/AddProduct";
import ProductDetails from "./pages/ProductDetails";

import Auth from "./pages/Auth";

// 🔥 Protected Layout
function ProtectedLayout({ children, dark, toggleDark }) {
  return (
    <>
      <Navbar />

      <div style={{ display: "flex" }}>
        <Sidebar />

        <div
          style={{
            marginLeft: "220px",
            padding: "20px",
            width: "100%",
            minHeight: "100vh",
          }}
        >
          {/* DARK BUTTON */}
          {/* <div style={{ textAlign: "right", marginBottom: "15px" }}>
            <button onClick={toggleDark}>
              Toggle Theme
            </button>
          </div> */}

          {children}
        </div>
      </div>
    </>
  );
}

function App() {
  const [dark, setDark] = useState(false);

  const user = localStorage.getItem("user");

  useEffect(() => {
    const saved = localStorage.getItem("darkMode");
    if (saved === "true") {
      document.body.classList.add("dark");
      setDark(true);
    }
  }, []);

  const toggleDark = () => {
    document.body.classList.toggle("dark");
    const newMode = !dark;
    setDark(newMode);
    localStorage.setItem("darkMode", newMode);
  };

  return (
    <BrowserRouter>
      <Routes>

        {/* 🔐 AUTH PAGE (NO SIDEBAR / NAVBAR) */}
        <Route path="/auth" element={<Auth />} />

        {/* 🔐 PROTECTED PAGES */}
        <Route
          path="/"
          element={
            user ? (
              <ProtectedLayout dark={dark} toggleDark={toggleDark}>
                <Dashboard />
              </ProtectedLayout>
            ) : (
              <Auth />
            )
          }
        />

        <Route
          path="/products"
          element={
            user ? (
              <ProtectedLayout dark={dark} toggleDark={toggleDark}>
                <Products />
              </ProtectedLayout>
            ) : (
              <Auth />
            )
          }
        />

        <Route
          path="/add-product"
          element={
            user ? (
              <ProtectedLayout dark={dark} toggleDark={toggleDark}>
                <AddProduct />
              </ProtectedLayout>
            ) : (
              <Auth />
            )
          }
        />

        <Route
          path="/products/:id"
          element={
            user ? (
              <ProtectedLayout dark={dark} toggleDark={toggleDark}>
                <ProductDetails />
              </ProtectedLayout>
            ) : (
              <Auth />
            )
          }
        />

      </Routes>
    </BrowserRouter>
  );
}

export default App;