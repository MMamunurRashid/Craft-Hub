import { useQuery } from "@tanstack/react-query";
import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../../../Contexts/AuthProvider";
import Loading from "../../../../Shared/Loading/Loading";
import { BsStar, BsStarFill, BsStarHalf } from "react-icons/bs";
import toast from "react-hot-toast";

const OrderedProduct = () => {
  const { user } = useContext(AuthContext);
  const {
    data: orders = [],
    refetch,
    isLoading,
  } = useQuery({
    queryKey: ["orders"],
    queryFn: async () => {
      const res = await fetch(
        `http://localhost:5000/product-order?email=${user?.email}`,
        {
          headers: {
            authorization: `bearer ${localStorage.getItem("accessToken")}`,
          },
        }
      );
      const data = await res.json();
      // console.log(data);
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


  const handleDeliveryShipped = (id) => {
    console.log("click", id);
    if (
      window.confirm(
        "Are you sure you want to Delivery Shipped this order?"
      )
    ) {
      fetch(`http://localhost:5000/orders/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ deliveryStatus: "shipped" }),
      })
        .then((res) => res.json())
        .then((data) => {
          // Handle the response
          console.log(data);
          toast.success(`Order Delivery Shipped!`);
          refetch();
        })
        .catch((error) => {
          // Handle errors
          console.error("Error:", error);
        });
    } else {
      toast.error("Delivery Shipped cancelled by the user");
      console.log(" cancelled by the user");
    }
  };

  const handleDeliveryComplete = (id) => {
    console.log("click", id);
    if (
      window.confirm(
        "Are you sure you want to Delivery Shipped this order?"
      )
    ) {
      fetch(`http://localhost:5000/orders/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ deliveryStatus: "complete" }),
      })
        .then((res) => res.json())
        .then((data) => {
          // Handle the response
          console.log(data);
          toast.success(`Order Delivery Complete!`);
          refetch();
        })
        .catch((error) => {
          // Handle errors
          console.error("Error:", error);
        });
    } else {
      toast.error("Delivery Complete cancelled by the user");
      console.log(" cancelled by the user");
    }
  };

  const handlePayment =(id)=>{
    
      console.log("click", id);
      if (
        window.confirm(
          "Are you sure you want to Complete Payment for this order?"
        )
      ) {
        fetch(`http://localhost:5000/order-payment/${id}`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ paymentStatus: true }),
        })
          .then((res) => res.json())
          .then((data) => {
            // Handle the response
            // console.log(data);
            toast.success(`Payment Complete for this product!`);
            refetch();
          })
          .catch((error) => {
            // Handle errors
            console.error("Error:", error);
          });
      } else {
        toast.error("Payment cancelled by the user");
        console.log("Payment cancelled by the user");
      }
    
  }

  return (
    <div>
      {orders?.length === 0 ? (
        <p className="text-center text-2xl font-serif font-semibold">
          No products in your order.
        </p>
      ) : (
        <>
          {" "}
          <p className="text-center text-2xl font-serif font-semibold mb-5">
            My Orders
          </p>
          {orders &&
            orders?.map((order, idx) => (
              <div
                key={idx}
                className="ml-10 p-5 my-5 shadow-sm  hover:border-orange-500 border-[1px] border-stone-100"
              >
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-xl  font-semibold">
                      Order ID: {order._id}
                    </p>
                    <p className="text-lg">Order Date: {order.orderDate}</p>
                    <p className="text-lg">Product Price: {order.price} BDT</p>
                    <p className="text-lg">Tax: {order.tax} BDT</p>
                    <p className="text-lg">Delivery Charge: 50 BDT</p>
                    <p className="text-lg">
                      Grand Total: {order.totalPrice} BDT
                    </p>
                    <p className="text-lg">Your Ordered Product: ⬇️</p>
                  </div>
                  <div>
                    {/* Button action of order */}
                    {/* <button className="btn btn-primary">Delivery Preparing</button> */}
                    {order?.deliveryStatus === "" ? (
                      <button onClick={() => handleDeliveryShipped(order?._id)} className="btn btn-primary ">
                       Make Delivery Shipping
                      </button>
                    ) : order?.deliveryStatus === "shipped" ? (
                      <button onClick={() => handleDeliveryComplete(order?._id)} className="btn btn-primary">
                      Make Delivery Complete
                      </button>
                    ) : order?.deliveryStatus === "complete" ? (
                      <button  className="btn btn-primary btn-disabled">
                        Delivery Complete
                      </button>
                    ) : (
                      <></> // Handle any other status or condition here if needed
                    )}

                    {
                      order?.paymentStatus === false? <button onClick={() => handlePayment(order?._id)} className="btn btn-secondary ml-3">
                      Make Payment 
                    </button> : <button className="btn btn-secondary ml-3 btn-disabled">
                      Payment Complete
                    </button>
                    }
                    
                  </div>
                </div>
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
              </div>
            ))}
        </>
      )}
    </div>
  );
};

export default OrderedProduct;
