import { Link } from "react-router-dom";
import "./ProductCard.css";

const TOTAL_COUNTRIES = 6;

const ProductCard = ({ product, completion, status }) => {

  // 🔥 STATUS LABEL + CLASS
  const getStatusData = () => {
    if (status === "complete") return { label: "Complete", className: "green" };
    if (status === "partial") return { label: "Partial", className: "yellow" };
    return { label: "Pending", className: "red" };
  };

  const statusData = getStatusData();

  return (
    <Link to={`/products/${product.id}`} className="card-link">
      <div className="product-card">

        {/* 🔥 STATUS BADGE */}
        <span className={`status-badge ${statusData.className}`}>
          {statusData.label}
        </span>

        {/* TITLE */}
        <h3 className="product-title">{product.title}</h3>

        {/* BRAND */}
        <p className="product-brand">{product.brand}</p>

        {/* EAN */}
        <p className="product-ean">EAN: {product.ean || "N/A"}</p>

        {/* 🔥 PROGRESS */}
        <div className="progress-section">
          <div className="progress-bar">
            <div
              className="progress-fill"
              style={{ width: `${completion}%` }}
            ></div>
          </div>

          <span className="progress-text">{completion}% Complete</span>
        </div>

        {/* 🔥 MARKETPLACE COUNT */}
        <div className="asin-info">
          {Math.round((completion / 100) * TOTAL_COUNTRIES)} / {TOTAL_COUNTRIES} marketplaces mapped
        </div>

      </div>
    </Link>
  );
};

export default ProductCard;