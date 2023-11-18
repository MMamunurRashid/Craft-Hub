import React, { useState } from "react";
import { CgProfile } from "react-icons/cg";
import { MdAdminPanelSettings, MdSell } from "react-icons/md";
import { FaUsersGear } from "react-icons/fa6";
import { TbMessageReport } from "react-icons/tb";
import { Link } from "react-router-dom";

const SideNavbar = () => {
  return (
    <div className="">
      <div className="drawer lg:drawer-open mt-16">
        <input id="sidebar" type="checkbox" className="drawer-toggle" />

        <div className="drawer-side mt-28 md:mt-0">
          <label
            htmlFor="sidebar"
            aria-label="close sidebar"
            className="drawer-overlay"
          ></label>
          <ul className="menu p-2 md:p-4 w-60 min-h-full bg-base-200 md:bg-slate-300 text-base-content font-serif">
            {/* Sidebar content here */}
            <li>
              <Link to='/dashboard/profile'>
              <CgProfile className="w-5 h-5 md:w-8 md:h-8"/> <span className="text-xl">Profile</span>
              </Link>
            </li>
            <li>
            <Link to='/dashboard/all-admin'>
              <MdAdminPanelSettings className="w-5 h-5 md:w-8 md:h-8"/> <span className="text-xl">All Admin</span>
              </Link>
            </li>
            <li>
            <Link  to='/dashboard/all-seller'>
              <MdSell className="w-5 h-5 md:w-8 md:h-8"/> <span className="text-xl">All Sellers</span>
              </Link>
            </li>
            <li>
            <Link  to='/dashboard/all-buyer'>
              <FaUsersGear className="w-5 h-5 md:w-8 md:h-8"/> <span className="text-xl">All Buyers</span>
              </Link>
            </li>
            <li>
            <Link  to='/dashboard/reported-product'>
              <TbMessageReport className="w-5 h-5 md:w-8 md:h-8"/> <span className="text-xl">Reported Products</span>
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default SideNavbar;
