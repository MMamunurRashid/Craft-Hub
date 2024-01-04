import { useQuery } from "@tanstack/react-query";
import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../../../Contexts/AuthProvider";
import Loading from "../../../../Shared/Loading/Loading";
import { BsStar, BsStarFill, BsStarHalf } from "react-icons/bs";

const OrderHistory = () => {
  const { user } = useContext(AuthContext);
  const {
    data: orders = [],
    refetch,
    isLoading,
  } = useQuery({
    queryKey: ["orders"],
    queryFn: async () => {
      const res = await fetch(
        `http://localhost:5000/my-order?email=${user?.email}`,
        {
          headers: {
            authorization: `bearer ${localStorage.getItem("accessToken")}`,
          },
        }
      );
      const data = await res.json();
      console.log(data);
      return data;
    },
  });
  if (isLoading) {
    <Loading />;
  }
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
  const [productId, setProductId] = useState(null);
  const [viewproduct, setProduct] = useState(null);
  const handleViewProduct = (id) => {
    setProductId(id);
    if (viewproduct) {
      document.getElementById("views-modal").showModal();
    }
  };
  useEffect(() => {
    if (productId) {
      fetch(`http://localhost:5000/product/${productId}`)
        .then((res) => res.json())
        .then((data) => {
          setProduct(data);
        });
    }
  }, [productId]);

  return (
    <div>
      {orders?.length === 0 ? (
        <p className="text-center text-2xl font-serif font-semibold">
          No Order in your Order History.
        </p>
      ) : (
        <>
          {" "}
          <p className="text-center text-2xl font-serif font-semibold mb-5">
            Order History
          </p>
          {orders &&
            orders?.map((order, idx) => (
              <div key={idx}>
                {
                  order.deliveryStatus==="complete"? <div
                  
                  className="ml-10 p-5 my-5 shadow-sm  hover:border-orange-500 border-[3px] border-stone-100"
                >
                  <p className="text-xl  font-semibold">Order ID: {order._id}</p>
                  <p className="text-lg">Order Date: {order.orderDate}</p>
                  <p className="text-lg">Product Price: {order.price} BDT</p>
                  <p className="text-lg">Tax: {order.tax} BDT</p>
                  <p className="text-lg">Delivery Charge: 50 BDT</p>
                  <p className="text-lg">Grand Total: {order.totalPrice} BDT</p>
                  <p className="text-lg">Delivery Status: {order.deliveryStatus} </p>
                  <p className="text-lg">Payment Status: {order?.paymentStatus===true? "complete":"Not yet"} </p>
                  <p className="text-lg">Your Ordered Product: ⬇️</p>

                  {Array.isArray(order.products) ? (
                    order?.products?.map((product, index) => (
                      <div>
                        <div className="flex items-center justify-between p-3  hover:border-orange-500 border-[2px] border-stone-100">
                          <img
                            className="rounded w-24 h-24"
                            src={product.productImage}
                            alt=""
                          />
                          <p
                            onClick={() => handleViewProduct(product?._id)}
                            key={index}
                            className=" cursor-pointer"
                          >
                            {product.productName}
                          </p>
                          <p>Price: {product.productPrice} BDT</p>
                        </div>
                        <dialog id="views-modal" className="modal">
                          <div className="modal-box w-[97%] max-w-6xl">
                            <h3 className="font-semibold font-serif text-2xl">
                              {viewproduct?.productName}
                            </h3>
                            <div className="flex items-center  gap-3">
                              <p className="flex text-orange-500">
                                {" "}
                                {renderStars(viewproduct?.rating)}{" "}
                              </p>
                              <p>{viewproduct?.rating}</p>
                            </div>
  
                            <div className="divider h-[1px] bg-orange-500"></div>
  
                            <div className="flex gap-10">
                              {/* img  */}
                              <div className="w-[35%]">
                                <img src={viewproduct?.productImage} alt="" />
                              </div>
                              {/* details  */}
                              <div className="w-[40%] mt-10">
                                <h1 className="text-3xl">
                                  {" "}
                                  <span className="text-4xl">৳ </span>{" "}
                                  {viewproduct?.productPrice}
                                  .00
                                </h1>
                                <p
                                  className={`text-xl font-semibold my-3 ${
                                    viewproduct?.availableQuantity === 0
                                      ? "text-red-600"
                                      : "text-green-600"
                                  }`}
                                >
                                  {viewproduct?.availableQuantity === 0
                                    ? "Out of Stock"
                                    : "In Stock"}
                                </p>
  
                                <p className=" my-1">
                                  Category: {viewproduct?.productCategory}
                                </p>
                                <p className=" my-1">
                                  Brand: {viewproduct?.productBand}
                                </p>
                                <p className="">
                                  Lorem ipsum dolor sit amet, consectetur
                                  adipiscing elit. Sed do eiusmod tempor
                                  incididunt ut labore et dolore magna aliqua.
                                  Lorem ipsum dolor sit amet, consectetur
                                  adipiscing elit. Sed do eiusmod tempor
                                  incididunt ut labore et dolore magna aliqua.
                                  Lorem ipsum dolor sit amet, consectetur
                                  adipiscing elit. Sed do eiusmod tempor
                                  incididunt ut labore et dolore magna aliqua.
                                </p>
                              </div>
                            </div>
  
                            <div className="modal-action">
                              <form method="dialog">
                                {/* if there is a button in form, it will close the modal */}
                                <button className="btn  bg-orange-500 px-5 py-2 rounded-[4px] hover:bg-white  border-2 hover:border-orange-500  hover:text-black text-white text-lg m-5 hover:duration-500">
                                  Close
                                </button>
                              </form>
                            </div>
                          </div>
                        </dialog>
                      </div>
                    ))
                  ) : (
                    <div>
                      <div className="flex items-center justify-between p-3  hover:border-orange-500 border-[2px] border-stone-100">
                        <img
                          className="rounded w-24 h-24"
                          src={order.products.productImage}
                          alt=""
                        />
                        <p
                          onClick={() => handleViewProduct(order.products?._id)}
                          className=" cursor-pointer"
                        >
                          {order.products.productName}
                        </p>
                        <p>Price: {order.products.productPrice} BDT</p>
                      </div>
                    </div>
                  )}
                </div>: <></>
                }
              </div>
            ))}
        </>
      )}
    </div>
  );
};

export default OrderHistory;
