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
  const [asins, setAsins] = useState({});
  const [showModal, setShowModal] = useState(false);

  // 🔥 FETCH PRODUCT
  useEffect(() => {
    API.get(`/products/${id}`)
      .then((res) => {
        const data = { ...res.data, asins: res.data.asins || {} };
        setProduct(data);
        setAsins(data.asins); // 🔥 separate state
      })
      .catch(() => toast.error("Failed to load product"));
  }, [id]);

  // 🔥 UPDATE LOCAL ONLY
  const handleASINChange = (country, value) => {
    setAsins((prev) => ({
      ...prev,
      [country]: value,
    }));
  };

  // 🔥 SAVE ALL CHANGES (IMPORTANT)
  const handleSave = () => {
    API.put(`/products/${id}`, { asins })
      .then(() => {
        toast.success("ASINs updated successfully");
        setProduct({ ...product, asins });
      })
      .catch(() => toast.error("Update failed"));
  };

  if (!product) return <p className="loading">Loading...</p>;

  // 🔥 PROGRESS
  const asinCount = Object.keys(asins || {}).filter(
    (k) => asins[k]
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

          {/* 🔥 SAVE BUTTON */}
          <button className="save-btn" onClick={handleSave}>
            Save Changes
          </button>

        </div>
      </div>

      {/* COUNTRY BADGES */}
      <div className="country-badges">
        {countries.map((c) => (
          <span
            key={c}
            className={`badge ${asins?.[c] ? "ok" : "missing"}`}
          >
            {c}
          </span>
        ))}
      </div>

      {/* ASIN TABLE */}
      <div className="asin-card">
        <h3>ASIN Mapping</h3>

        <ASINTable
          asins={asins}
          onChange={handleASINChange}
        />
      </div>

      {/* 🔥 MODAL */}
      {showModal && (
        <SuggestionModal
          product={product}
          onClose={() => setShowModal(false)}
          onSelect={(asinData) => {
            setAsins(asinData);

            API.put(`/products/${id}`, { asins: asinData })
              .then(() => {
                toast.success("ASINs saved successfully");
                setProduct({ ...product, asins: asinData });
                setShowModal(false);
              })
              .catch(() => toast.error("Failed to save ASINs"));
          }}
        />
      )}

    </div>
  );
};

export default ProductDetails;