import "./ASINTable.css";

const countries = ["US", "UK", "DE", "FR", "IT", "ES"];

const ASINTable = ({ asins, onChange }) => {

  // 🔥 CHECK STATUS
  const getStatus = (value) => {
    if (!value || value.trim() === "") return "missing";
    return "filled";
  };

  return (
    <div className="asin-box">
      <h3> Marketplace ASIN Mapping</h3>

      <div className="asin-grid">
        {countries.map((country) => {
          const value = asins?.[country] || "";
          const status = getStatus(value);

          return (
            <div className={`asin-item ${status}`} key={country}>
              
              <label>{country}</label>

              <input
                className="asin-input"
                placeholder={`Enter ${country} ASIN`}
                value={value}
                onChange={(e) =>
                  onChange(country, e.target.value.toUpperCase())
                }
              />

              {/* 🔥 CLEAR BUTTON */}
              {value && (
                <button
                  className="clear-btn"
                  onClick={() => onChange(country, "")}
                >
                  Clear
                </button>
              )}

              {/* 🔥 STATUS TEXT */}
              <span className="asin-status">
                {status === "filled" ? " Linked" : "Missing"}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ASINTable;