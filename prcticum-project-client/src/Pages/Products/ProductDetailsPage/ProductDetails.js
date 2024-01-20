import React, { useState } from "react";
import {
  BsStar,
  BsStarFill,
  BsStarHalf,
} from "react-icons/bs";
import PrimaryButton from "../../../Component/PrimaryButton";
import { HiOutlineRocketLaunch } from "react-icons/hi2";
import { TbTruckReturn } from "react-icons/tb";
import { MdOutlinePayment } from "react-icons/md";
import { PiWechatLogoFill } from "react-icons/pi";
import { Link, useLoaderData } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { useCart } from "../../../Contexts/CartContext";
import BuyNow from "./BuyNow/BuyNow";
import { Rating } from "../../Dashboard/Buyer/MyReview/Rating";

const ProductDetails = () => {
  const product = useLoaderData();
  const {
    productName,
    // productId,
    rating,
    productImage,
    productPrice,
    productCategory,
    productBand,
    // sellerEmail,
    // _id,
  } = product;
  // console.log(product);

  const { cart, addToCart } = useCart();
  const isProductInCart = cart.some((item) => item._id === product._id);

  const handleClick = () => {
    if (!isProductInCart) {
      addToCart(product);
    }
  };

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

  const {
    data: reviews = [],
    refetch,
    isLoading,
  } = useQuery({
    queryKey: ["reviews", product?._id],
    queryFn: async () => {
      const res = await fetch(`http://localhost:5000/review/${product?._id}`);
      const data = await res.json();
      console.log(data);
      return data;
    },
  });



  const [orderProduct, setOrderProduct] = useState(null)
  const handleOrderModal = (product) => {
    if (product) {
      document.getElementById("buy-now-modal").showModal();
      setOrderProduct(product);
    }
  };


  return (
    <>
      <div className="mx-auto">
        <div className=" mx-auto mt-5 max-w-6xl">
          <h3 className="font-semibold font-serif text-2xl">{productName}</h3>
          <div className="flex items-center  gap-3">
            <p className="flex text-orange-500"> {renderStars(rating)} </p>
            <p>{rating}</p>
          </div>

          <div className="divider h-[1px] bg-orange-500"></div>

          <div className="flex gap-10 mb-2">
            {/* img  */}
            <div className="w-[35%]">
              <img src={productImage} alt="" />
            </div>
            {/* details  */}
            <div className="w-[40%] mt-10">
              <h1 className="text-3xl">
                {" "}
                <span className="text-4xl">৳ </span> {productPrice}.00
              </h1>
              <p
                className={`text-xl font-semibold my-3 ${
                  product.availableQuantity === 0
                    ? "text-red-600"
                    : "text-green-600"
                }`}
              >
                {product.availableQuantity === 0 ? "Out of Stock" : "In Stock"}
              </p>

              <p className=" my-1">Category: {productCategory}</p>
              <p className=" my-1">Brand: {productBand}</p>
              <p className="">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do
                eiusmod tempor incididunt ut labore et dolore magna aliqua.
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do
                eiusmod tempor incididunt ut labore et dolore magna aliqua.
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do
                eiusmod tempor incididunt ut labore et dolore magna aliqua.
              </p>
              <div className="flex justify-center">
                
                
               <div>
                <button 
                className=" bg-orange-500 px-5 py-2 rounded-[4px] hover:bg-white  border-2 hover:border-orange-500  hover:text-black text-white text-lg m-5 hover:duration-500"
                onClick={() => handleOrderModal(product)}
                >Buy Now</button>
                <BuyNow
                      orderProduct={orderProduct}
                   
                    />
               </div>

                <button
                  onClick={handleClick}
                  data-tip={isProductInCart ? "Already in Cart" : "Add To Cart"}
                  className={`tooltip flex-col justify-center items-center  ${
                    isProductInCart ? "cursor-not-allowed" : ""
                  }`}
                  disabled={isProductInCart}
                >
                  {isProductInCart ? (
                    <button className='cursor-not-allowed bg-green-600  px-5 py-2 rounded-[4px]  border-2    text-white text-lg m-5 hover:duration-500'>Product Added</button>
                  ) : (
                    <PrimaryButton>Add To Cart</PrimaryButton>
                  )}
                </button>
              </div>
            </div>
            {/* offer */}
            <div className="w-[25%] flex justify-between items-center">
              <div className="flex-wrap   justify-between ">
                <div className="flex items-center my-7">
                  <div>
                    <HiOutlineRocketLaunch className="w-12 h-12 text-orange-500" />
                  </div>
                  <div className="ml-5">
                    <h1 className="text-xl font-semibold">Free Delivery</h1>
                    <p>
                      For all orders over <span className="text-xl">৳ </span>3000
                    </p>
                  </div>
                </div>

                <div className="flex items-center my-7">
                  <div>
                    <TbTruckReturn className="w-12 h-12 text-orange-500" />
                  </div>
                  <div className="ml-5">
                    <h1 className="text-xl font-semibold">21 Days Return</h1>
                    <p>If goods have problems</p>
                  </div>
                </div>

                <div className="flex items-center my-7">
                  <div>
                    <MdOutlinePayment className="w-12 h-12 text-orange-500" />
                  </div>
                  <div className="ml-5">
                    <h1 className="text-xl font-semibold">Online Payment</h1>
                    <p>Cash on delivery available</p>
                  </div>
                </div>

                <div className="flex items-center my-7">
                  <div>
                    <PiWechatLogoFill className="w-12 h-12 text-orange-500" />
                  </div>
                  <div className="ml-5">
                    <h1 className="text-xl font-semibold">24/7 Support</h1>
                    <p>Dedicated support</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* product review */}

          <div className="relative grid grid-cols-1 gap-4 p-4 mb-8 border rounded-lg bg-white shadow-lg">
            <h1 className="text-xl">See Review about this product.</h1>
            {reviews.length===0? <>
              <h1 className="mt-3">No one Review this product.</h1>
            </> :

            reviews?.map((review) => (
              <div key={review._id} className="pb-1 border-b">
                <div className="relative flex gap-4 mt-8 ">
                  <img
                    src={review.userPhoto}
                    className="relative rounded-lg -top-8 -mb-4 bg-white border h-20 w-20"
                    alt=""
                    loading="lazy"
                  />
                  <div className="flex flex-col w-full">
                    <Rating rating={review.rating} />
                    <div className="flex flex-row justify-between">
                      <p className="relative text-xl whitespace-nowrap truncate overflow-hidden">
                        {review.userName}
                      </p>
                      <a className="text-gray-500 text-xl" href="/">
                        <i className="fa-solid fa-trash"></i>
                      </a>
                    </div>
                    <p className="text-gray-400 text-sm">{review.reviewTime}</p>
                  </div>
                </div>
                <p className="mt-1 text-gray-500">{review.review}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default ProductDetails;
