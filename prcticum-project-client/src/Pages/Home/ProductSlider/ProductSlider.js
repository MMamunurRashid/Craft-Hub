import React, { useEffect, useState } from "react";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import { BsStar, BsStarFill, BsStarHalf , BsCartPlus} from "react-icons/bs";
import { MdPreview} from "react-icons/md";
import { Link } from "react-router-dom";

const ProductSlider = () => {
  const [data, setData] = useState();

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch your local data here
        const response = await fetch("products.json");
        const jsonData = await response.json();
        console.log(jsonData);
        setData(jsonData);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  // Function to generate star icons based on the rating
  const renderStars = (rating) => {
    const starIcons = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 1; i <= fullStars; i++) {
      starIcons.push(<BsStarFill key={i} />);
    }

    if (hasHalfStar) {
      starIcons.push(<BsStarHalf key={fullStars + 1} />);
    }

    while (starIcons.length < 5) {
      starIcons.push(<BsStar key={starIcons.length + 1} />);
    }

    return starIcons;
  };
  return (
    <div className="my-16 mr-5">
      <h1 className="text-center text-xl md:text-3xl BerkshireSwash mb-8">
        Best Selling Product
      </h1>

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
        {data ? (
          data.map((product) => (
            <div
              key={product.productId}
              className="ml-5 rounded-[10px] text-center  hover:border-orange-500 border-stone-100 border-[3px]  "
            >
              <div className=" ">
                {/* image  hover view button */}
                <div className="absolute inset-0 flex gap-3 items-center justify-center opacity-0 bg-opacity-60 hover:opacity-100 transition-opacity duration-300">
                  
                  {/* Add to cart  */}
                  <Link to="/add-to-cart">
                    <button data-tip='Add To Cart' className="bg-slate-300 hover:text-white hover:bg-orange-500 tooltip  flex-col justify-center items-center text-gray-800 font-bold py-2 px-4 rounded shadow">
                      
                    <BsCartPlus className="w-8 h-8 hover:text-white " />
                    </button>
                  </Link>
                  {/* View*/}
                  <Link to="/view">
                    <button data-tip='Quick View' className="bg-slate-300 hover:text-white hover:bg-orange-500 tooltip  flex-col justify-center items-center text-gray-800 font-bold py-2 px-4 rounded shadow">
                      
                    <MdPreview className="w-8 h-8  " />
                    </button>
                  </Link>
                </div>
                <div className="">
                  <img
                    src={product.productImage}
                    alt={""}
                    className=" w-full h-[300px] rounded-t-lg"
                  />
                  <div className="flex items-center justify-center gap-3">
                    <p className="flex text-orange-500">
                      {" "}
                      {renderStars(product.rating)}{" "}
                    </p>
                    <p>{product.rating}</p>
                  </div>
                  <p className="text-green-600 text-lg font-semibold">
                    {product.status === "In Stock"
                      ? "In Stock"
                      : "Out of Stock"}
                  </p>
                  <h1 className="text-center text-xl font-serif">
                    {product.productName}
                  </h1>
                </div>
                <div className="absolute top-6 text-2xl bg-slate-100 p-3">
                  <p>৳ {product.productPrice}</p>
                </div>
              </div>
            </div>
          ))
        ) : (
          <></>
        )}
      </Carousel>
    </div>
  );
};

export default ProductSlider;
