import React, { useEffect, useState } from "react";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";

import ProductCard from "../../Products/ProductCard/ProductCard";
import { useQuery } from "@tanstack/react-query";
import Loading from "../../../Shared/Loading/Loading";
import Product from "../../Products/Product/Product";



const ProductSlider = () => {
  

  const {
    data: products = [],
    refetch,
    isLoading,
  } = useQuery({
    queryKey: ["products"],
    queryFn: async () => {
      const res = await fetch(`http://localhost:5000/products`);
      const data = await res.json();
      // console.log(data);
      return data;
    },
  });


  const [getProduct, setProduct] = useState(null);
  const handleProductInfo =(product)=>{
    setProduct(product)
  
    console.log("Click", product);
  }


  return (
    <div className="my-16 mr-5">
      <h1 className="text-center text-xl md:text-3xl BerkshireSwash mb-8">
        Best Selling Product
      </h1>
   {
    isLoading && <Loading></Loading>
   }
      <Carousel
        additionalTransfrom={0}
        arrows
        autoPlay
        autoPlaySpeed={1500}
        centerMode={false}
        className=""
        containerClass="container-with-dots"
        dotListClass=""
        draggable
        focusOnSelect={false}
        infinite
        itemClass=""
        keyBoardControl
        minimumTouchDrag={80}
        pauseOnHover
        renderArrowsWhenDisabled={false}
        renderButtonGroupOutside={false}
        renderDotsOutside={false}
        responsive={{
          desktop: {
            breakpoint: {
              max: 3000,
              min: 1024,
            },
            items: 5,
            partialVisibilityGutter: 40,
          },
          mobile: {
            breakpoint: {
              max: 464,
              min: 0,
            },
            items: 3,
            partialVisibilityGutter: 30,
          },
          tablet: {
            breakpoint: {
              max: 1024,
              min: 464,
            },
            items: 5,
            partialVisibilityGutter: 30,
          },
        }}
        rewind={false}
        rewindWithAnimation={false}
        rtl={false}
        shouldResetAutoplay
        showDots={false}
        sliderClass=""
        slidesToSlide={1}
        swipeable
      >
        {products ? (
          products?.map((product) => (
            <ProductCard key={product.productId} product={product} handleProductInfo={handleProductInfo} />
          ))
        ) : (
          <></>
        )}
      </Carousel>
      {
        getProduct&&<Product product={getProduct}/>
      }
    </div>
  );
};

export default ProductSlider;
