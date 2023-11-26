import React, { useState } from "react";
import { BsCartPlus, BsStar, BsStarFill, BsStarHalf } from "react-icons/bs";
import { MdPreview } from "react-icons/md";
import { useCart } from "../../../Contexts/CartContext";
import Product from "../Product/Product";

const ProductCard = ({ product, handleProductInfo }) => {
  const { addToCart } = useCart();

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
    <div className="ml-5 rounded-[10px] text-center  hover:border-orange-500 border-stone-100 border-[3px]  ">
      <div className=" relative">
        {/* image  hover view button */}
        <div className="absolute inset-0 flex gap-3 items-center justify-center opacity-0 bg-opacity-60 hover:opacity-100 transition-opacity duration-300">
          {/* Add to cart  */}

          <button
            onClick={() => addToCart(product)}
            data-tip="Add To Cart"
            className="bg-slate-300 hover:text-white hover:bg-orange-500 tooltip  flex-col justify-center items-center text-gray-800 font-bold py-2 px-4 rounded shadow"
          >
            <BsCartPlus className="w-8 h-8 hover:text-white " />
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
          <p
            className={`text-xl font-semibold my-3 ${
              product.availableQuantity === 0
                ? "text-red-600"
                : "text-green-600"
            }`}
          >
            {product.availableQuantity === 0 ? "Out of Stock" : "In Stock"}
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
  );
};

export default ProductCard;