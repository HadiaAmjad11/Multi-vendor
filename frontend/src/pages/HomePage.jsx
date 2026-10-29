import React, { useState } from "react";
import { Link } from "react-router-dom";
import { AiOutlineSearch } from "react-icons/ai";
import { productData } from "../static/data";
import styles from "../styles/styles";

const HomePage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchData, setSearchData] = useState(null);

  const handleSearchChange = (e) => {
    const term = e.target.value;
    setSearchTerm(term);

    if (term.trim() === "") {
      setSearchData(null);
      return;
    }

    const filteredProducts = productData.filter((product) =>
      product.name.toLowerCase().includes(term.toLowerCase())
    );
    setSearchData(filteredProducts);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Searching for:", searchTerm);
  };

  return (
    <div className={styles.section}>
      <div className="flex items-center justify-between h-[50px] my-[20px]">
        <Link to="/">
          <img src="/shopo-logo.svg" alt="ShopO" height="40" />
        </Link>

        {/* search box */}
        <form onSubmit={handleSubmit} className="w-[50%] relative">
          <input
            type="text"
            placeholder="Search products..."
            value={searchTerm}
            onChange={handleSearchChange}
            className="h-[40px] w-full px-3 pr-12 border-2 border-[#F5A623] rounded-md outline-none"
          />
          <button
            type="submit"
            className="absolute right-0 top-0 h-[40px] px-3 flex items-center"
          >
            <AiOutlineSearch size={26} className="cursor-pointer" />
          </button>

          {searchData && searchData.length > 0 && (
            <div className="absolute w-full bg-white shadow-md z-10 p-2 rounded-b-md">
              {searchData.map((product) => (
                <Link
                  key={product.id}
                  to={`/product/${product.id}`}
                  onClick={() => {
                    setSearchTerm("");
                    setSearchData(null);
                  }}
                >
                  <p className="py-1 hover:bg-gray-100">{product.name}</p>
                </Link>
              ))}
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default HomePage;