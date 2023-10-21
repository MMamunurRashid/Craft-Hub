import React from "react";
import { Outlet } from "react-router-dom";
import Navbar from "../Shared/Navbar/Navbar";
import Footer from "../Shared/Footer/Footer";
import { FaHome } from "react-icons/fa";
import { HiShoppingBag } from "react-icons/hi";
import { BsCartCheckFill } from "react-icons/bs";

const Main = () => {
  return (
    <div className="">
      <Navbar />
      <div className="pt-28 max-w-[1440px] mx-auto  ">
        <div className="fixed z-50 right-20 top-20 h-screen max-w-[1440px] mx-auto overflow-visible ">
          <ul className="menu rounded-box bg-slate-500 ">
            <li data-tip="Home" className="tooltip tooltip-right">
              <FaHome className="h-14 w-14 text-slate-100 hover:text-orange-500" />
            </li>
            <li data-tip="Shop Now" className="tooltip tooltip-right">
              <HiShoppingBag className="h-14 w-14 text-slate-100 hover:text-orange-500" />
            </li>
            <li data-tip="Cart" className="tooltip tooltip-right ">
            <label tabIndex={0} className="text-slate-100 hover:text-orange-500">
              <div className="indicator">
               <BsCartCheckFill className="h-6 w-6 "/>
                <span className="badge badge-sm indicator-item">0</span>
              </div>
            </label>
            
            </li>
          </ul>
        </div>
        <Outlet></Outlet>
      </div>
      <Footer />
    </div>
  );
};

export default Main;
