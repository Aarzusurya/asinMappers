import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";
import toast from "react-hot-toast";
import "./AddProduct.css";

const countries = ["US", "UK", "DE", "FR", "IT", "ES"];

const AddProduct = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    title: "",
    brand: "",
    ean: "",
  });

  const [loading, setLoading] = useState(false);

  // 🔥 NEW STATES
  const [suggestions, setSuggestions] = useState(null);
  const [loadingSuggest, setLoadingSuggest] = useState(false);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  // 🔥 ADD PRODUCT
  const handleSubmit = (e) => {
    e.preventDefault();

    if (!form.title || !form.brand) {
      return toast.error("Title & Brand required");
    }

    setLoading(true);

    API.post("/products", form)
      .then((res) => {
        toast.success("Product added successfully ");

        const id = res.data.id;

        // redirect to mapping page
        navigate(`/products/${id}`);
      })
      .catch(() => {
        toast.error("Failed to add product");
      })
      .finally(() => setLoading(false));
  };

  // 🔥 FIND SUGGESTIONS
  const handleSuggest = () => {
    if (!form.title || !form.brand) {
      return toast.error("Enter title & brand first");
    }

    setLoadingSuggest(true);

    API.post("/suggest-asins", form)
      .then((res) => {
        setSuggestions(res.data);
        toast.success("Suggestions loaded ");
      })
      .catch(() => {
        toast.error("Failed to fetch suggestions");
      })
      .finally(() => setLoadingSuggest(false));
  };

  return (
    <div className="add-product">
      <h1>Add New Product</h1>

      <div className="add-layout">

        {/* LEFT SIDE - FORM */}
        <form className="form-card" onSubmit={handleSubmit}>

          {/* TITLE */}
          <div className="form-group">
            <label>Product Title</label>
            <input
              type="text"
              name="title"
              value={form.title}
              onChange={handleChange}
              placeholder="e.g. iPhone 14 Pro Max"
            />
            <small>Use exact product name for better matching</small>
          </div>

          {/* BRAND */}
          <div className="form-group">
            <label>Brand</label>
            <input
              type="text"
              name="brand"
              value={form.brand}
              onChange={handleChange}
              placeholder="e.g. Apple"
            />
          </div>

          {/* EAN */}
          <div className="form-group">
            <label>EAN (Barcode)</label>
            <input
              type="text"
              name="ean"
              value={form.ean}
              onChange={handleChange}
              placeholder="Optional"
            />
            <small>Optional but improves accuracy</small>
          </div>

          {/* 🔥 SUGGEST BUTTON */}
          <button
            type="button"
            className="suggest-btn"
            onClick={handleSuggest}
          >
            {loadingSuggest ? "Finding..." : " Find Amazon Matches"}
          </button>

          {/* 🔥 SUBMIT */}
          <button className="submit-btn" disabled={loading}>
            {loading ? "Adding..." : "Add & Map Product"}
          </button>

        </form>

        {/* RIGHT SIDE - PREVIEW */}
        <div className="preview-card">

          <h3>Live Preview</h3>

          <div className="preview-box">
            <h4>{form.title || "Product Title"}</h4>
            <p>{form.brand || "Brand Name"}</p>
            <p className="ean">
              EAN: {form.ean || "N/A"}
            </p>
          </div>

          {/* MARKETPLACE STATUS */}
          <div className="market-status">
            <h4>Marketplace Status</h4>

            <div className="badges">
              {countries.map((c) => (
                <span key={c} className="badge missing">
                  {c}
                </span>
              ))}
            </div>

            <p className="hint">
              ASINs will be mapped after adding product
            </p>
          </div>

          {/* 🔥 SUGGESTIONS UI */}
          {suggestions && (
            <div className="suggestions-box">
              <h4>AI Suggestions</h4>

              {Object.entries(suggestions).map(([country, list]) => (
                <div key={country} className="country-block">

                  <b>{country}</b>

                  {list.length === 0 ? (
                    <p>No matches</p>
                  ) : (
                    list.map((item, i) => (
                      <div key={i} className="suggest-item">
                        <p>{item.title}</p>
                        <span>ASIN: {item.asin}</span>
                        <span>Score: {item.score}</span>
                      </div>
                    ))
                  )}

                </div>
              ))}
            </div>
          )}

        </div>

      </div>
    </div>
  );
};

export default AddProduct;