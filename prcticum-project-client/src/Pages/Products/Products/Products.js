import React, { useEffect, useState } from "react";
import { useSearchContext } from "../../../Contexts/SearchContext";
import ProductCard from "../ProductCard/ProductCard";
import Product from "../Product/Product";
import Loading from "../../../Shared/Loading/Loading";
import { useNavigate } from "react-router-dom";

const Products = () => {
  const { searchInput } = useSearchContext();
  console.log(searchInput);
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true); // Add loading state

  useEffect(() => {
    setIsLoading(true); // Set loading state to true

    fetch(`http://localhost:5000/search-products?search=${searchInput}`)
      .then((res) => res.json())
      .then((data) => {
        setProducts(data);
        setIsLoading(false); // Set loading state to false when data is loaded
      });
  }, [searchInput]);

  
  const [getProduct, setProduct] = useState(null);
  const handleProductInfo = (product) => {
    setProduct(product);
    console.log("Click", product);
   
  }

  return (
    <div>
      <h1 className="text-center font-semibold">Your Search is "{searchInput}" and the result is below:</h1>
      {isLoading ? ( // Show a loader component while data is loading
         <Loading></Loading>
         
      ) : (
        products?.length? <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-10 md:gap-7 max-w-[1440px] my-7 mx-5 md:mx-28 justify-items-center">
        {products?.map((product) => (
          <ProductCard key={product.productId} product={product} handleProductInfo={handleProductInfo} />
        ))}
      </div>:<h1 className="text-center font-semibold text-xl">No product Found</h1>
      )}
      {getProduct && <Product product={getProduct} />}
    </div>
  );
};

export default Products;
