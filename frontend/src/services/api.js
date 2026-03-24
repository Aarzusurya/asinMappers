import axios from "axios";

// 🔥 AUTO SWITCH (LOCAL + DEPLOY)
const BASE_URL =
  window.location.hostname === "localhost"
    ? "http://127.0.0.1:8000/api"
    : "https://your-backend-url.onrender.com/api"; // 👈 yeh baad me replace karna

const API = axios.create({
  baseURL: BASE_URL,
});

export default API;