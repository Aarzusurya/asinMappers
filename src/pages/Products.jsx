import { useEffect, useState } from "react";
import API from "../services/api";
import ProductCard from "../components/ProductCard";
import "./Products.css";

const COUNTRIES = 6;

const Products = () => {
  const [products, setProducts] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [loading, setLoading] = useState(true);

  // 🔥 FETCH PRODUCTS
  useEffect(() => {
    API.get("/products")
      .then((res) => {
        const data = res.data.map((p) => ({
          ...p,
          asins: p.asins || {},
        }));

        setProducts(data);
        setFiltered(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);

        const dummy = [
          { _id: "1", title: "iPhone 14", brand: "Apple", asins: { US: "B001" } },
          { _id: "2", title: "Galaxy S22", brand: "Samsung", asins: {} },
        ];

        setProducts(dummy);
        setFiltered(dummy);
        setLoading(false);
      });
  }, []);

  // 🔥 COMPLETION %
  const getCompletion = (asins) => {
    const filled = Object.values(asins || {}).filter(v => v && v !== "").length;
    return Math.round((filled / COUNTRIES) * 100);
  };

  // 🔥 STATUS
  const getStatus = (asins) => {
    const filled = Object.values(asins || {}).filter(v => v && v !== "").length;

    if (filled === COUNTRIES) return "complete";
    if (filled === 0) return "pending";
    return "partial";
  };

  // 🔍 SEARCH + FILTER
  useEffect(() => {
    let temp = [...products];

    // SEARCH
    if (search.trim()) {
      temp = temp.filter((p) =>
        p.title.toLowerCase().includes(search.toLowerCase())
      );
    }

    // FILTER
    if (filter === "complete") {
      temp = temp.filter(p => getStatus(p.asins) === "complete");
    }

    if (filter === "partial") {
      temp = temp.filter(p => getStatus(p.asins) === "partial");
    }

    if (filter === "pending") {
      temp = temp.filter(p => getStatus(p.asins) === "pending");
    }

    setFiltered(temp);
  }, [search, filter, products]);

  return (
    <div className="products">
      <h1 className="title">Product Catalog</h1>

      {/* 🔍 SEARCH + FILTER */}
      <div className="top-bar">
        <input
          type="text"
          placeholder="Search products..."
          className="search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <select
          className="filter"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        >
          <option value="all">All Products</option>
          <option value="complete">Complete </option>
          <option value="partial">Partial </option>
          <option value="pending">Pending </option>
        </select>
      </div>

      {/* ⏳ LOADING */}
      {loading ? (
        <div className="loader">Loading products...</div>
      ) : filtered.length === 0 ? (
        <p className="empty">No products found</p>
      ) : (
        <div className="grid">
          {filtered.map((product) => (
            <ProductCard
              key={product._id || product.id}
              product={product}
              completion={getCompletion(product.asins)}   // 🔥 NEW
              status={getStatus(product.asins)}           // 🔥 NEW
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Products;