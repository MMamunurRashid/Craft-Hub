import React, { useState } from 'react';
import { useLoaderData } from 'react-router-dom';
import ProductCard from '../Products/ProductCard/ProductCard';
import Product from '../Products/Product/Product';

const ShopByCategory = () => {
    const products = useLoaderData();
    console.log(products);
    const [getProduct, setProduct] = useState(null);
    const handleProductInfo = (product) => {
      setProduct(product);
      console.log("Click", product);
     
    }
    return (
        <div>
            <h1 className="text-2xl text font-serif font-semibold text-center">
        This Category Have  {" "}
        {products?.length !== 0 ? products.length + " Products" : "No Product"}
      </h1>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-10 md:gap-7 max-w-[1440px] my-7 mx-5 md:mx-28 justify-items-center">
                {
                    products?.map(product=>(
                        <ProductCard key={product.productId} product={product}  handleProductInfo={handleProductInfo}/>
                    ))
                }
                {getProduct && <Product product={getProduct} />}
            </div>
        </div>
    );
};

export default ShopByCategory;