import { useState } from "react";
import "./Auth.css";
import toast from "react-hot-toast";
import logo from "../assets/logo.png";

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [showPass, setShowPass] = useState(false);

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  const handleSubmit = () => {
    if (!form.email || !form.password) {
      return toast.error("Email & Password required");
    }

    if (!isLogin && !form.name) {
      return toast.error("Name required");
    }

    localStorage.setItem("user", JSON.stringify(form));

    toast.success(isLogin ? "Login successful " : "Account created ");

    window.location.href = "/";
  };

  return (
    <div className="auth-wrapper">

      {/* LEFT SIDE */}
      <div className="auth-left">
        <div className="brand">
          <img src={logo} alt="logo" className="logo" />
        </div>
      </div>

      {/* RIGHT SIDE */}
      <div className="auth-right">

        <div className="auth-card">
          <h2>{isLogin ? "Welcome Back" : "Create Account"}</h2>

          {!isLogin && (
            <input
              type="text"
              placeholder="Full Name"
              onChange={(e) =>
                setForm({ ...form, name: e.target.value })
              }
            />
          )}

          <input
            type="email"
            placeholder="Email address"
            onChange={(e) =>
              setForm({ ...form, email: e.target.value })
            }
          />

          <div className="password-box">
            <input
              type={showPass ? "text" : "password"}
              placeholder="Password"
              onChange={(e) =>
                setForm({ ...form, password: e.target.value })
              }
            />
            <span onClick={() => setShowPass(!showPass)}></span>
          </div>

          <button onClick={handleSubmit}>
            {isLogin ? "Login" : "Sign Up"}
          </button>

          <p className="toggle">
            {isLogin
              ? "Don't have an account?"
              : "Already have an account?"}

            <span onClick={() => setIsLogin(!isLogin)}>
              {isLogin ? " Signup" : " Login"}
            </span>
          </p>
        </div>

      </div>
    </div>
  );
};

export default Auth;