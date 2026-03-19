import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import API from "../services/api";
import ASINTable from "../components/ASINTable";
import SuggestionModal from "../components/SuggestionModal";
import toast from "react-hot-toast";
import "./ProductDetails.css";

const countries = ["US", "UK", "DE", "FR", "IT", "ES"];

const ProductDetails = () => {
  const { id } = useParams();

  const [product, setProduct] = useState(null);
  const [showModal, setShowModal] = useState(false);

  // 🔥 FETCH PRODUCT
  useEffect(() => {
    API.get(`/products/${id}`)
      .then((res) => {
        // ensure asins always exists
        const data = { ...res.data, asins: res.data.asins || {} };
        setProduct(data);
      })
      .catch(() => toast.error("Failed to load product"));
  }, [id]);

  // 🔥 UPDATE SINGLE ASIN
  const handleASINChange = (country, value) => {
    const updated = {
      ...(product.asins || {}),
      [country]: value,
    };

    // UI update
    setProduct({ ...product, asins: updated });

    // Backend save
    API.put(`/products/${id}`, { asins: updated })
      .then(() => toast.success("ASIN updated"))
      .catch(() => toast.error("Update failed"));
  };

  if (!product) return <p className="loading">Loading...</p>;

  // 🔥 PROGRESS
  const asinCount = Object.keys(product.asins || {}).filter(
    (k) => product.asins[k]
  ).length;

  const progress = (asinCount / countries.length) * 100;

  return (
    <div className="details">

      {/* HEADER */}
      <div className="details-header">

        <div>
          <h2>{product.title}</h2>
          <p><b>Brand:</b> {product.brand}</p>
          <p className="ean">EAN: {product.ean || "N/A"}</p>
        </div>

        <div className="header-right">

          <div className="summary">
            {asinCount}/{countries.length} marketplaces mapped
          </div>

          {/* PROGRESS */}
          <div className="progress-bar">
            <div
              className="progress-fill"
              style={{ width: `${progress}%` }}
            ></div>
          </div>

          <button
            className="suggest-btn"
            onClick={() => setShowModal(true)}
          >
            Find ASIN Suggestions
          </button>

        </div>
      </div>

      {/* COUNTRY BADGES */}
      <div className="country-badges">
        {countries.map((c) => (
          <span
            key={c}
            className={`badge ${
              product.asins?.[c] ? "ok" : "missing"
            }`}
          >
            {c}
          </span>
        ))}
      </div>

      {/* ASIN TABLE */}
      <div className="asin-card">
        <h3>ASIN Mapping</h3>

        <ASINTable
          asins={product.asins}
          onChange={handleASINChange}
        />
      </div>

      {/* 🔥 MODAL */}
      {showModal && (
        <SuggestionModal
          product={product}
          onClose={() => setShowModal(false)}
          onSelect={(asinData) => {

            // UI update
            setProduct({ ...product, asins: asinData });

            // Backend save
            API.put(`/products/${id}`, { asins: asinData })
              .then(() => {
                toast.success("ASINs saved successfully");
                setShowModal(false); // 🔥 auto close modal
              })
              .catch(() => toast.error("Failed to save ASINs"));
          }}
        />
      )}

    </div>
  );
};

export default ProductDetails;