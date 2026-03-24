import { useEffect, useState } from "react";
import API from "../services/api";
import toast from "react-hot-toast";
import "./SuggestionModal.css";

const SuggestionModal = ({ product, onClose, onSelect }) => {
  const [loading, setLoading] = useState(false);
  const [suggestions, setSuggestions] = useState({});

  useEffect(() => {
    fetchSuggestions();
  }, []);

  const fetchSuggestions = async () => {
    setLoading(true);
    try {
      const res = await API.post("/suggest-asins", {
        title: product.title,
        brand: product.brand,
      });

      setSuggestions(res.data || {});
    } catch (err) {
      toast.error("Failed to fetch suggestions");
    } finally {
      setLoading(false);
    }
  };

  // 🔥 SELECT ASIN
  const handleSelect = (country, asin) => {
    const updated = {
      ...product.asins,
      [country]: asin,
    };

    onSelect(updated);
    toast.success(`${country} ASIN selected`);
    onClose();
  };

  return (
    <div className="modal-overlay">

      <div className="modal-box">

        {/* HEADER */}
        <div className="modal-header">
          <h3>AI ASIN Suggestions</h3>
          <button className="close-btn" onClick={onClose}></button>
        </div>

        {/* BODY */}
        <div className="modal-body">

          {loading ? (
            <p className="loading"> Finding best matches...</p>
          ) : Object.keys(suggestions).length === 0 ? (
            <p>No suggestions found</p>
          ) : (
            Object.entries(suggestions).map(([country, list]) => (
              <div key={country} className="country-section">

                <h4 className="country-title">{country}</h4>

                {list.length === 0 && (
                  <p className="no-data">No matches</p>
                )}

                {list.map((item, i) => (
                  <div
                    key={item.asin}
                    className={`suggestion-card ${i === 0 ? "best" : ""}`}
                  >

                    {/* LEFT INFO */}
                    <div className="info">
                      <h4 className="title">{item.title}</h4>
                      <p className="asin">ASIN: {item.asin}</p>
                      <span className="score">
                        Match: {item.score || 0}%
                      </span>
                    </div>

                    {/* RIGHT ACTION */}
                    <div className="action">
                      {i === 0 && (
                        <span className="best-tag">Best Match</span>
                      )}

                      <button
                        className="select-btn"
                        onClick={() => handleSelect(country, item.asin)}
                      >
                        Select
                      </button>
                    </div>

                  </div>
                ))}

              </div>
            ))
          )}

        </div>

      </div>
    </div>
  );
};

export default SuggestionModal;