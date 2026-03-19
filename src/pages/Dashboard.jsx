import { useEffect, useState } from "react";
import "./Dashboard.css";
import { Bar } from "react-chartjs-2";
import API from "../services/api";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const Dashboard = () => {

  const [stats, setStats] = useState({
    total: 0,
    mapped: 0,
    pending: 0,
    countries: 6,
    countryData: {}
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    API.get("/products/stats")
      .then((res) => {
        if (res.data) {
          setStats(res.data);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error("Stats error:", err);

        setStats({
          total: 0,
          mapped: 0,
          pending: 0,
          countries: 6,
          countryData: {}
        });

        setLoading(false);
      });
  }, []);

  const countryData = stats.countryData || {};

  const chartData = {
    labels: Object.keys(countryData),
    datasets: [
      {
        label: "ASIN Count",
        data: Object.values(countryData),
        borderRadius: 8,
        backgroundColor: "#2563eb"
      },
    ],
  };

  // 🔥 REAL PROGRESS CALCULATION
  const totalExpected = stats.total * stats.countries;

  const progress =
    totalExpected > 0
      ? Math.round((stats.mapped / totalExpected) * 100)
      : 0;

  // 🔥 SMART STATUS
  const getStatus = () => {
    if (progress === 100) return "Fully Synced ";
    if (progress > 50) return "Almost Done ";
    return "In Progress ";
  };

  const cards = [
    { title: "Total Products", value: stats.total },
    { title: "Mapped ASINs", value: stats.mapped },
    { title: "Pending Matches", value: stats.pending },
    { title: "Countries", value: stats.countries },
  ];

  return (
    <div className="dashboard">
      <h1 className="title">Dashboard Overview</h1>

      {/* 🔥 CARDS */}
      <div className="cards">
        {cards.map((item) => (
          <div className="card gradient-card" key={item.title}>
            <h3>{item.title}</h3>
            <p>{loading ? "..." : item.value}</p>
          </div>
        ))}
      </div>

      {/* 🔥 CHART */}
      <div className="chart-box">
        <h2>Marketplace Analytics</h2>

        {loading ? (
          <p className="loading">Loading...</p>
        ) : (
          <Bar data={chartData} />
        )}
      </div>

      {/* 🔥 INSIGHTS PANEL */}
      <div className="insight-box">
        <h2>Insights & Performance</h2>

        {/* PROGRESS */}
        <div className="progress-section">
          <p>Mapping Progress</p>

          <div className="progress-bar">
            <div
              className="progress-fill"
              style={{ width: `${progress}%` }}
            ></div>
          </div>

          <span className="progress-text">
            {progress}% Completed
          </span>
        </div>

        {/* STATUS */}
        <div className="insight-item">
          <span>System Status</span>
          <span className="status green">
            {getStatus()}
          </span>
        </div>

        <div className="insight-item">
          <span>Pending Matches</span>
          <span className="status red">{stats.pending}</span>
        </div>

        <div className="insight-item">
          <span>Total ASIN Linked</span>
          <span className="status blue">{stats.mapped}</span>
        </div>

        {/* MESSAGE */}
        <div className="insight-message">
          {stats.pending > 0
            ? ` ${stats.pending} products need ASIN mapping. Go to Products section to resolve.`
            : " All products are fully mapped across all marketplaces!"}
        </div>
      </div>

    </div>
  );
};

export default Dashboard;