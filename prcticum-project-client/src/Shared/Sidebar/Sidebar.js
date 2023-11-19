import React, { useContext, useState } from "react";
import { CgProfile } from "react-icons/cg";
import {
  MdAdminPanelSettings,
  MdSell,
  MdWorkHistory,
  MdReviews,
} from "react-icons/md";
import { FaUsersGear } from "react-icons/fa6";
import { TbMessageReport, TbShoppingBagCheck } from "react-icons/tb";
import { BsBagCheckFill, BsBagPlusFill } from "react-icons/bs";
import { FaCartArrowDown } from "react-icons/fa";
import { Link } from "react-router-dom";
import { AuthContext } from "../../Contexts/AuthProvider";
import useAdmin from "../../hooks/useAdmin";
import useSeller from "../../hooks/useSeller";

const SideNavbar = () => {
  const { user } = useContext(AuthContext);
  const [isAdmin] = useAdmin(user.email);
  const [isSeller] = useSeller(user.email);
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
              <Link to="/dashboard/profile">
                <CgProfile className="w-5 h-5 md:w-8 md:h-8" />{" "}
                <span className="text-xl">Profile</span>
              </Link>
            </li>
            {isAdmin && (
              <>
                <li>
                  <Link to="/dashboard/all-admin">
                    <MdAdminPanelSettings className="w-5 h-5 md:w-8 md:h-8" />{" "}
                    <span className="text-xl">All Admin</span>
                  </Link>
                </li>
                <li>
                  <Link to="/dashboard/all-seller">
                    <MdSell className="w-5 h-5 md:w-8 md:h-8" />{" "}
                    <span className="text-xl">All Sellers</span>
                  </Link>
                </li>
                <li>
                  <Link to="/dashboard/all-buyer">
                    <FaUsersGear className="w-5 h-5 md:w-8 md:h-8" />{" "}
                    <span className="text-xl">All Buyers</span>
                  </Link>
                </li>
                <li>
                  <Link to="/dashboard/reported-product">
                    <TbMessageReport className="w-5 h-5 md:w-8 md:h-8" />{" "}
                    <span className="text-xl">Reported Products</span>
                  </Link>
                </li>
              </>
            )}
            {isSeller && (
              <>
                <li>
                  <Link to="/dashboard/my-product">
                    <MdSell className="w-5 h-5 md:w-8 md:h-8" />{" "}
                    <span className="text-xl">My Product</span>
                  </Link>
                </li>
                <li>
                  <Link to="/dashboard/ordered-product">
                    <BsBagCheckFill className="w-5 h-5 md:w-8 md:h-8" />{" "}
                    <span className="text-xl">Ordered Product</span>
                  </Link>
                </li>
                <li>
                  <Link to="/dashboard/add-product">
                    <BsBagPlusFill className="w-5 h-5 md:w-8 md:h-8" />{" "}
                    <span className="text-xl">Add Product</span>
                  </Link>
                </li>
                <li>
                  <Link to="/dashboard/sell-report">
                    <MdWorkHistory className="w-5 h-5 md:w-8 md:h-8" />{" "}
                    <span className="text-xl">Sell Report</span>
                  </Link>
                </li>
              </>
            )}
            {!isAdmin && !isSeller && (
              <>
                <li>
                  <Link to="/dashboard/my-cart">
                    <FaCartArrowDown className="w-5 h-5 md:w-8 md:h-8" />{" "}
                    <span className="text-xl">My Cart</span>
                  </Link>
                </li>
                <li>
                  <Link to="/dashboard/my-order">
                    <TbShoppingBagCheck className="w-5 h-5 md:w-8 md:h-8" />{" "}
                    <span className="text-xl">My Order</span>
                  </Link>
                </li>

                <li>
                  <Link to="/dashboard/order-history">
                    <MdWorkHistory className="w-5 h-5 md:w-8 md:h-8" />{" "}
                    <span className="text-xl">Order History</span>
                  </Link>
                </li>
                <li>
                  <Link to="/dashboard/my-review">
                    <MdReviews className="w-5 h-5 md:w-8 md:h-8" />{" "}
                    <span className="text-xl">My Review</span>
                  </Link>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default SideNavbar;
