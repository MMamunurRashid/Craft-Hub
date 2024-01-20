import React, { useEffect, useState } from "react";
import { useSearchContext } from "../../../Contexts/SearchContext";
import ProductCard from "../ProductCard/ProductCard";
import Product from "../Product/Product";
import Loading from "../../../Shared/Loading/Loading";
import { useNavigate } from "react-router-dom";
import Layout from "./Layout";
import { useQuery } from "@tanstack/react-query";
import useSearchValue from "../../../hooks/useSearchValue";

const Products = () => {
  const { searchInput } = useSearchContext();
  const [searchValue, handleSearchInputChange] = useSearchValue();
  const [search, setSearch] = useState("");
  const [displayLimit, setDisplayLimit] = useState(6);
  
  if (searchValue) {
    setSearch(searchValue);
  }
  console.log(searchValue);
  // if (searchInput) {
  //     setSearch(searchInput);
  // }
  //   console.log(searchInput);

  const [products, setProducts] = useState([]);
  const [loading, setIsLoading] = useState(true); 

  const {
    data: categories = [],
    refetch,
    isLoading,
  } = useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const res = await fetch(`http://localhost:5000/categories`);
      const data = await res.json();
      // console.log(data);
      return data;
    },
  });

  useEffect(() => {
    setIsLoading(true); // Set loading state to true
    fetch(`http://localhost:5000/products-page?limit=${displayLimit}`)
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        setProducts(data);
        setIsLoading(false); // Set loading state to false when data is loaded
      });
  }, [displayLimit]);

  const handleCategoryProduct = (id) => {
    setSearch(id);
  };

  const [getProduct, setProduct] = useState(null);
  const handleProductInfo = (product) => {
    setProduct(product);
    // console.log("Click", product);
  };
  const handleSeeMore = () => {
    // Increase the display limit when "Show More" is clicked
    setDisplayLimit(displayLimit + 6); 
  };
  
  
  const navigate = useNavigate();

  return (
    <div className="flex">
      <div className="w-1/6 bg-slate-300">
        <div className="drawer lg:drawer-open mt-16">
          <input id="sidebar" type="checkbox" className="drawer-toggle" />

          <div className="drawer-side mt-28 md:mt-0">
            <label
              htmlFor="sidebar"
              aria-label="close sidebar"
              className="drawer-overlay"
            ></label>
            <ul className="menu  p-2 md:p-4 w-60 min-h-full bg-base-200 md:bg-slate-300 text-base-content font-serif">
              {/* Sidebar content here */}
              {isLoading ? ( // Show a loader component while data is loading
                <Loading></Loading>
              ) : (
                <></>
              )}
              {categories ? (
                categories?.map((category) => (
                  <li key={category._id}>
                    <span
                      onClick={() => handleCategoryProduct(category.name)}
                      className="text-xl"
                    >
                      {category.name}
                    </span>
                  </li>
                ))
              ) : (
                <></>
              )}
            </ul>
          </div>
        </div>
      </div>

      <div className="w-5/6 mt-10">
        <h1 className="text-center font-semibold">
          Your Search is "{search}" and the result is below:
        </h1>
        {loading ? ( // Show a loader component while data is loading
          <Loading></Loading>
        ) : products?.length ? (
          <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-10 md:gap-7 max-w-[1440px] my-7 mx-5 md:mx-28 justify-items-center">
            {products?.map((product) => (
              <ProductCard
                key={product._id}
                product={product}
                handleProductInfo={handleProductInfo}
              />
            ))}
          </div>
        ) : (
          <h1 className="text-center font-semibold text-xl">
            No product Found
          </h1>
        )}
        {getProduct && <Product product={getProduct} />}

        <div className="flex justify-center mb-5">
          
           
            <button onClick={() => handleSeeMore()} className="btn btn-primary">See More</button>
          
      
        </div>
      </div>
    </div>
  );
};

export default Products;
