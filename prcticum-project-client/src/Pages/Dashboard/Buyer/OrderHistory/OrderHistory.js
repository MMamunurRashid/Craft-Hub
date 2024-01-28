import { useQuery } from "@tanstack/react-query";
import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../../../Contexts/AuthProvider";
import Loading from "../../../../Shared/Loading/Loading";
import { BsStar, BsStarFill, BsStarHalf } from "react-icons/bs";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";
import { RatingInput } from "./RatingInput";
import Swal from "sweetalert2";

const OrderHistory = () => {
  const { user } = useContext(AuthContext);
  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm();
  const {
    data: orders = [],
    refetch,
    isLoading,
  } = useQuery({
    queryKey: ["orders", user?.email],
    queryFn: async () => {
      const res = await fetch(
        `https://craft-hub-mamun.vercel.app/my-order?email=${user?.email}`,
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
      fetch(`https://craft-hub-mamun.vercel.app/product/${productId}`)
        .then((res) => res.json())
        .then((data) => {
          setProduct(data);
        });
    }
  }, [productId]);

  const [reviewRating, setReviewRating] = useState(0);
  const handleReviewSubmit = (event) => {
    event.preventDefault();
    const form = event.target;
    const review = form.review.value;
    const productId = form.productId.value;
    // console.log(productId, review);
    const date = new Date();
    const options = { timeZone: "Asia/Dhaka" }; // Set the time zone to Bangladesh

    const localTime = date.toLocaleString("en-US", options);

    // console.log(localTime);
    const reviewDetails = {
      productId: productId,
      review: review,
      rating: reviewRating,
      userName: user.displayName,
      userEmail: user.email,
      userPhoto: user.photoURL,
      reviewTime: localTime,
    };
    //  console.log(reviewDetails);
    fetch("https://craft-hub-mamun.vercel.app/review", {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify(reviewDetails),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data);

        if (data.acknowledged) {
          document.getElementById("views-modal").close();
          toast.success("Your review submitted");
          Swal.fire({
            title: "Good job!",
            text: "Your Review Submitted!!",
            icon: "success",
          });
        } else {
          Swal.fire({
            title: "Error",
            text: "Something Wrong!!",
            icon: "error",
          });
          toast.error(data);
        }
      });
  };

  // return product handler
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [notes, setNotes] = useState("");
  const handleOpenReturnModal = (id) => {
    document.getElementById("return-modal").showModal();
    setSelectedOrder(id);
  };
  const handleProductReturn = (event) => {
    event.preventDefault();
    console.log(selectedOrder);
    console.log(notes);

    if (
      window.confirm(
        "Are you sure you want to Product return request for this order?"
      )
    ) {
      fetch(`https://craft-hub-mamun.vercel.app/product-return/${selectedOrder}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          returnNotes: notes,
        }),
      })
        .then((res) => res.json())
        .then((data) => {
          // Handle the response
          console.log(data);
          toast.success(
            `Product return request has been submitted for this order`
          );
          refetch();
          // document.getElementById("assign-delivery-man-modal").close()
        })
        .catch((error) => {
          // Handle errors
          console.error("Error:", error);
        });
    } else {
      toast.error("Product return request cancelled by the user");
      console.log(" cancelled by the user");
    }

    document.getElementById("return-modal").close();
  };

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
              <div key={order._id}>
                {order.deliveryStatus === "complete" ? (
                  <div className="ml-10 p-5 my-5 shadow-sm  hover:border-orange-500 border-[3px] border-stone-100">
                    <div className="flex justify-between">
                      <div>
                        <p className="text-xl  font-semibold">
                          Order ID: {order._id}
                        </p>
                        <p className="text-lg">Order Date: {order.orderDate}</p>
                        <p className="text-lg">
                          Product Price: {order.price} BDT
                        </p>
                        <p className="text-lg">Tax: {order?.tax} BDT</p>
                        <p className="text-lg">Delivery Charge: 50 BDT</p>
                        <p className="text-lg">
                          Grand Total: {order.totalPrice} BDT
                        </p>

                        <p className="text-lg">Your Ordered Product: ⬇️</p>
                      </div>
                      <div className="flex flex-col gap-3">
                        <h1 className="text-xl font-semibold bg-green-600 text-white p-3 rounded-md">
                          Delivery Status:{" "}
                          {order.deliveryStatus === ""
                            ? "Not Ship yet"
                            : order.deliveryStatus}
                        </h1>
                        <h1 className="text-xl font-semibold bg-blue-600 text-white p-3 rounded-md">
                          Payment Status:{" "}
                          {order.paymentStatus === true
                            ? "complete"
                            : "Cash On Delivery"}
                        </h1>

                        <div>
                          {
                            order.returnNotes? <h1 className="text-xl font-semibold bg-blue-600 text-white p-3 rounded-md">
                            Return in Progress
                          </h1> : <button
                            onClick={() => handleOpenReturnModal(order._id)}
                            className="btn btn-primary mr-10 w-full"
                          >
                            Return Product
                          </button>
                          }

                          {/* Notes Modal */}
                          <dialog id="return-modal" className="modal">
                            <div className="modal-box">
                              <form method="dialog">
                                {/* if there is a button in form, it will close the modal */}
                                <button
                                  onClick={() =>
                                    document
                                      .getElementById("return-modal")
                                      .close()
                                  }
                                  className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
                                >
                                  ✕
                                </button>
                              </form>
                              <div>
                                <h1 className="text-xl text-center font-bold">
                                  Add product Return Notes with product details-
                                  Name, Quantity, Problem.
                                </h1>
                                <form
                                  onSubmit={handleProductReturn}
                                  className="mt-4"
                                >
                                  <label className="block text-lg font-medium text-gray-700">
                                    Notes:
                                  </label>
                                  <textarea
                                    value={notes}
                                    onChange={(e) => setNotes(e.target.value)}
                                    className="input input-bordered w-full h-24 mt-1"
                                    placeholder="Type here your product problems and No of quantity that have problem."
                                    required
                                  ></textarea>
                                  <button
                                    type="submit"
                                    className="btn btn-accent w-full mt-4"
                                  >
                                    Add Notes
                                  </button>
                                </form>
                              </div>
                            </div>
                          </dialog>
                        </div>
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

                          {/* view modal */}
                          <dialog id="views-modal" className="modal">
                            <div className="modal-box w-[97%] max-w-6xl">
                              <form method="dialog">
                                {/* if there is a button in form, it will close the modal */}
                                <button className="btn  btn-circle btn-ghost absolute right-5 top-5">
                                  ✕
                                </button>
                              </form>
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
                                  <div className="flex justify-center">
                                    <Link
                                      to={`/product-details/${viewproduct?._id}`}
                                      className=" w-[50%] text-center bg-orange-500 px-5 py-2 rounded-[4px] hover:bg-white  border-2 hover:border-orange-500  hover:text-black text-white text-lg m-5 hover:duration-500"
                                    >
                                      Details
                                    </Link>
                                  </div>
                                </div>
                              </div>
                              {/* review comment */}
                              <div className="mx-auto mt-5">
                                <h1>GIVE YOUR RATING AND REVIEW HERE!!</h1>

                                <form
                                  method="dialog"
                                  onSubmit={handleReviewSubmit}
                                >
                                  <input
                                    type="text"
                                    name="productId"
                                    value={viewproduct?._id}
                                    placeholder="Type here Subject"
                                    className="input hidden input-bordered md:w-full w-11/12 mt-4"
                                  />
                                  <RatingInput
                                    onRatingChange={setReviewRating}
                                    initialRating={0}
                                  />
                                  <textarea
                                    name="review"
                                    className="textarea textarea-bordered md:w-full w-11/12 mt-4 h-[100px]"
                                    placeholder="Type here your Message"
                                  ></textarea>
                                  <input
                                    className="btn bg-orange-500 px-5 py-2 rounded-[4px] hover:bg-white  border-2 hover:border-orange-500  hover:text-black text-white text-lg m-5 hover:duration-500 md:px-32 mt-5"
                                    type="submit"
                                    value="Submit"
                                  />
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
                            onClick={() =>
                              handleViewProduct(order.products?._id)
                            }
                            className=" cursor-pointer"
                          >
                            {order.products.productName}
                          </p>
                          <p>Price: {order.products.productPrice} BDT</p>
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <></>
                )}
              </div>
            ))}
        </>
      )}
    </div>
  );
};

export default OrderHistory;
