import React, { useContext } from "react";
import { Link } from "react-router-dom";

import "../../Font/Font.css";
import { AuthContext } from "../../Contexts/AuthProvider";
import { useCart } from "../../Contexts/CartContext";

const Navbar = () => {
  const { user, logOut } = useContext(AuthContext);
  const { cart } = useCart();
  const totalPrice = cart.reduce((total, product) => total + product.productPrice, 0);
  const handleLogout = () => {
    logOut()
      .then(() => {})
      .catch((err) => console.error(err));
  };
  return (
    <div className="fixed  shadow-md max-w-[1440px] bg-slate-200 w-full z-50    md:flex md:justify-between md:items-center md:px-20 px-5 ">
      <div className="navbar  bg-slate-200">
        <div className="navbar-start">
         
          <div className="flex items-center">
            <Link
              to="/"
              className="btn btn-ghost normal-case text-5xl BerkshireSwash font-bold"
            >
              Craft <span className="text-orange-500">Hub</span>
            </Link>
          </div>
        </div>
        <div className="navbar-center">
        <div className="form-control">
            <div className="input-group">
              <input
                type="text"
                placeholder="I'm Looking for..."
                className="input input-bordered w-[500px]"
              />
              <button className="btn bg-orange-500 hover:bg-white  hover:border-2 hover:border-orange-500  hover:text-black text-white">
                Search
              </button>
            </div>
          </div>
        </div>
        <div className="navbar-end gap-2">
          
          <div className="dropdown dropdown-end">
            <label tabIndex={0} className="btn btn-ghost btn-circle">
              <div className="indicator">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
                <span className="badge badge-sm indicator-item bg-orange-500 text-white">{cart.length}</span>
              </div>
            </label>
            <div
              tabIndex={0}
              className="mt-3 z-[1] card card-compact dropdown-content w-52 bg-base-100 shadow"
            >
              <div className="card-body">
                <span className="font-bold text-lg">{cart.length} item</span>
                <span className="text-info">Subtotal: ৳ {totalPrice}</span>
                <div className="card-actions">
                  <button className="btn btn-primary btn-block">
                    View cart
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div className="dropdown dropdown-end ">
            <label tabIndex={0} className="btn btn-ghost btn-circle avatar">
              <div className=" rounded-full ">
                {user?.photoURL ? (
                  <>
                    <img src={user?.photoURL} alt="" />
                  </>
                ) : (
                  <img
                    src="https://i.ibb.co/hCChjP9/User-avatar-svg.png"
                    alt=""
                  />
                )}
              </div>
            </label>
            <ul
              tabIndex={0}
              className="mt-3 z-[1] p-2 shadow menu menu-lg dropdown-content bg-base-100 rounded-box w-52"
            >
              <li>
                <Link to="/dashboard/profile" className="justify-between">
                  Dashboard
                </Link>
              </li>

              <li>
                {user?.email ? (
                  <Link onClick={handleLogout}>Logout</Link>
                ) : (
                  <Link to="/login">Login</Link>
                )}
              </li>
              <li>
                <label
                  htmlFor="dashboard-drawer"
                  tabIndex={2}
                  className="btn btn-ghost lg:hidden"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-6 h-6"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M3.75 5.25h16.5m-16.5 4.5h16.5m-16.5 4.5h16.5m-16.5 4.5h16.5"
                    />
                  </svg>
                </label>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
