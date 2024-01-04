import React from "react";
import { BsStar, BsStarFill, BsStarHalf } from "react-icons/bs";
import PrimaryButton from "../../../Component/PrimaryButton";
import { HiOutlineRocketLaunch } from "react-icons/hi2";
import { TbTruckReturn } from "react-icons/tb";
import { MdOutlinePayment } from "react-icons/md";
import { PiWechatLogoFill } from "react-icons/pi";

const Product = ({ product }) => {
  const {
    productName,
    productId,
    rating,
    productImage,
    productPrice,
    productCategory,
    productBand,
    sellerEmail,
  } = product;

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
    <>
      <input type="checkbox" id="my_modal_6" className="modal-toggle" />
      <div className="modal">
        <div className="modal-box w-[97%] max-w-6xl">
          <h3 className="font-semibold font-serif text-2xl">{productName}</h3>
          <div className="flex items-center  gap-3">
            <p className="flex text-orange-500"> {renderStars(rating)} </p>
            <p>{rating}</p>
          </div>

          <div className="divider h-[1px] bg-orange-500"></div>

          <div className="flex gap-10">
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
                <button className=" w-[60%] bg-orange-500 px-5 py-2 rounded-[4px] hover:bg-white  border-2 hover:border-orange-500  hover:text-black text-white text-lg m-5 hover:duration-500">
                  Add To Cart
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
                      For all orders over <span className="text-xl">৳ </span>999
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

          <div className="modal-action">
            <label
              htmlFor="my_modal_6"
              className="btn  bg-orange-500 px-5 py-2 rounded-[4px] hover:bg-white  border-2 hover:border-orange-500  hover:text-black text-white text-lg m-5 hover:duration-500"
            >
              Close
            </label>
          </div>
        </div>
      </div>
    </>
  );
};

export default Product;
