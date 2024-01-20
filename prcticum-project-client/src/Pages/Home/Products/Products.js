import { useQuery } from "@tanstack/react-query";
import React, { useEffect, useState } from "react";
import Loading from "../../../Shared/Loading/Loading";
import { Link } from "react-router-dom";
import ProductCard from "../../Products/ProductCard/ProductCard";
import Product from "../../Products/Product/Product";


const Products = () => {
  
  const [products, setProducts] = useState([]);
  const [loading, setIsLoading] = useState(true);
  useEffect(() => {
    setIsLoading(true); // Set loading state to true
    fetch(`http://localhost:5000/products-home`)
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        setProducts(data);
        setIsLoading(false); // Set loading state to false when data is loaded
      });
  }, []);

  const [getProduct, setProduct] = useState(null);
  const handleProductInfo = (product) => {
    setProduct(product);
    // console.log("Click", product);
  };
  return (
    <div >
      

      <div className=" mt-10 mx-auto">
      <h1 className="text-center text-xl md:text-3xl BerkshireSwash mb-8">
        Products
      </h1>
        {loading ? ( // Show a loader component while data is loading
          <Loading></Loading>
        ) : products?.length ? (
          <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-10 md:gap-7 max-w-[1440px] my-7 mx-5 md:mx-28 justify-items-center">
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

        <div className="flex justify-center">
            <Link to='/products' className="btn btn-primary">See More</Link>
        </div>
      </div>
    </div>
  );
};

export default Products;
