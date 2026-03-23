import axios from "axios";

// 🔥 AUTO SWITCH (LOCAL + LIVE)
const BASE_URL =
  window.location.hostname === "localhost"
    ? "http://127.0.0.1:8000/api"
    : "https://asin-mappers.onrender.com/api"; // ✅ FIXED

const API = axios.create({
  baseURL: BASE_URL,
});

export default API;