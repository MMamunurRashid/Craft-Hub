import React from "react";
import { HiOutlineRocketLaunch } from "react-icons/hi2";
import { TbTruckReturn } from "react-icons/tb";
import { MdOutlinePayment } from "react-icons/md";
import { PiWechatLogoFill } from "react-icons/pi";

const OurPolicy = () => {
  return (
    <div className="my-16">
      <h1 className="text-center text-xl md:text-3xl BerkshireSwash">
        Why Choice Us?
      </h1>
      <div className="pt-5 mx-28 ">
        <div className="flex-wrap md:flex  justify-between">
          <div className="flex items-center">
            <div>
              <HiOutlineRocketLaunch className="w-12 h-12 text-orange-500" />
            </div>
            <div className="ml-5">
              <h1 className="text-xl font-semibold">Free Delivery</h1>
              <p>For all orders over  <span className="text-xl">৳ </span>3000</p>
            </div>
          </div>
          <div className="divider divider-horizontal"></div> 
          <div className="flex items-center">
            <div>
              <TbTruckReturn className="w-12 h-12 text-orange-500" />
            </div>
            <div className="ml-5">
              <h1 className="text-xl font-semibold">21 Days Return</h1>
              <p>If goods have problems</p>
            </div>
          </div>
          <div className="divider divider-horizontal"></div> 
          <div className="flex items-center">
            <div>
              <MdOutlinePayment className="w-12 h-12 text-orange-500" />
            </div>
            <div className="ml-5">
              <h1 className="text-xl font-semibold">Online Payment</h1>
              <p>Cash on delivery available</p>
            </div>
          </div>
          <div className="divider divider-horizontal"></div> 
          <div className="flex items-center">
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
  );
};

export default OurPolicy;
