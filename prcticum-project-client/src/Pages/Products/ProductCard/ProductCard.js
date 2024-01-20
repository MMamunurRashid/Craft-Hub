import React, { useState } from "react";
import {
  BsCartPlus,
  BsFillCartCheckFill,
  BsStar,
  BsStarFill,
  BsStarHalf,
} from "react-icons/bs";
import { MdPreview } from "react-icons/md";
import { useCart } from "../../../Contexts/CartContext";
import { Link } from "react-router-dom";

const ProductCard = ({ product, handleProductInfo }) => {
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

  return (
    <div className="ml-5 rounded-[10px]   hover:border-orange-500 border-stone-100 border-[3px]  ">
      <div className=" ">
        <div className="">
          <Link to={`/product-details/${product._id}`}>
          <img
            src={product.productImage}
            alt={""}
            className=" w-full h-[300px] rounded-t-lg"
          />
          </Link>
          <div className=" flex gap-3 items-center justify-center opacity-100 mt-1 bg-opacity-60 hover:opacity-100 transition-opacity duration-300">
            {/* Add to cart  */}

            <button
              onClick={handleClick}
              data-tip={isProductInCart ? "Already in Cart" : "Add To Cart"}
              className={`bg-slate-300 hover:text-white hover:bg-orange-500 tooltip  flex-col justify-center items-center text-gray-800 font-bold py-2 px-4 rounded shadow ${
                isProductInCart ? "cursor-not-allowed" : ""
              }`}
              disabled={isProductInCart} // Disable the button if the product is already in the cart
            >
              {isProductInCart ? (
                <BsFillCartCheckFill className="w-8 h-8 text-green-500" />
              ) : (
                <BsCartPlus className="w-8 h-8 hover:text-white" />
              )}
            </button>

            {/* View*/}

            <label
              data-tip="Quick View"
              htmlFor="my_modal_6"
              onClick={() => {
                handleProductInfo(product);
              }}
              className="hover:cursor-pointer bg-slate-300 hover:text-white hover:bg-orange-500 tooltip  flex-col justify-center items-center text-gray-800 font-bold py-2 px-4 rounded shadow"
            >
              <MdPreview className="w-8 h-8  " />
            </label>
          </div>
          <div className="pl-2 pt-1">
          <h1 className=" text-[18px] font-serif">
            {product.productName}
          </h1>
          <div className="  bg-slate-100 ">
            <p className="text-[22px] text-green-600">৳ {product.productPrice}</p>
            <div className="flex items-center  gap-3 text-[15px]">
              <p className="flex text-orange-500 ">
                {" "}
                {renderStars(product.rating)}{" "}
              </p>
              <p className="">{product.rating}</p>
            </div>
            <p
              className={`text-[15px] font-semibold my-1  ${
                product.availableQuantity === 0
                  ? "text-red-600"
                  : "text-green-600"
              }`}
            >
              {product.availableQuantity === 0 ? "Out of Stock" : "In Stock"}
            </p>
          </div>
          </div>
          
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
