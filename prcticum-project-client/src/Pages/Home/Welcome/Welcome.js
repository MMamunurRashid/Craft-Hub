import React from "react";
import offerBg from "../../../assets/newsletter-parallax.png";
import Bg from "../../../assets/Faina_dezeen_2364_col_0.jpg";
import PrimaryButton from "../../../Component/PrimaryButton";
import { Link } from "react-router-dom";

const Welcome = () => {
  return (
    <div className="my-16 mx-28" >
      <div className="mb-10">
        <h1 className="text-center text-xl md:text-3xl BerkshireSwash">
          Welcome to Craft <span className="text-orange-500">Hub</span> - Art
          and Craft Shopping Online
        </h1>
        <p className="text-center text-lg font-serif my-2">
          Deshi design and hand made product
        </p>
      </div>
      {/*  */}
      <div className="flex h-[350px] gap-8">
      {/* Left Side Div (70% width) */}
      <div className="w-4/6  relative">
        <div
          className="h-[350px] bg-cover bg-center"
          style={{
            backgroundImage: `url(${offerBg})`, // Replace with your left image
          }}
        />
        <div className="absolute inset-0 flex items-center  bg-gradient-to-l from-transparent via-gray-300 to-gray-300">
          <div className=" pl-16">
            <h1 className="text-3xl font-bold mb-2 font-serif text-orange-500">Winter <br/> Welcome Offer</h1>
            <p className="text-lg ">Sale up To</p>
            <h1 className="text-3xl font-bold font-serif text-green-700">30% off</h1>
            <Link to='/products'><PrimaryButton>Shop Now</PrimaryButton></Link>
          </div>
        </div>
      </div>

      {/* Right Side Div (30% width) */}
      <div className="w-4/12  relative">
        <div
          className="h-[350px] bg-cover bg-center"
          style={{
            backgroundImage: `url(${Bg})`,
            opacity: 0.4, 
          }}
        />
        <div className="absolute inset-0 flex flex-col justify-center items-center text-white">
        <h1 className="text-3xl font-bold mb-2 font-serif ">Welcome</h1>
        <h1 className="text-3xl font-bold font-serif ">Free Delivery</h1>
          <p className="text-base text-center">Starting at ৳ 999</p>
          <Link to='/products'><PrimaryButton>Shop Now</PrimaryButton></Link>
        </div>
      </div>
    </div>
    </div>
  );
};

export default Welcome;
