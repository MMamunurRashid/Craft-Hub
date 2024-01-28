import React, { useContext } from "react";
import { useForm } from "react-hook-form";
import { AuthContext } from "../../../../Contexts/AuthProvider";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const OrderModal = ({
  orderProduct,
  deliveryCharge,
  totalPrice,
  grandTotal,
}) => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  // console.log(orderProduct);

  const handleOrder = (data, event) => {
    event.preventDefault();

    const date = new Date();
    const options = { timeZone: "Asia/Dhaka" }; // Set the time zone to Bangladesh

    const localTime = date.toLocaleString("en-US", options);

    console.log(localTime);
    const address = {
      roadNo: data.road,
      houseNo: data.house,
      area: data.area,
      post: data.post,
      district: data.district,
    };

    const orderDetails = {
      orderDate: localTime,
      products: orderProduct,
      price: totalPrice,
      deliveryCharge: deliveryCharge,
      totalPrice: grandTotal,
      deliveryStatus: "",
      paymentStatus: false,
      userName: user.displayName,
      userEmail: user.email,
      phoneNumber: data.mobileNumber,
      location: address,
    };

    if (event.nativeEvent.submitter.value === "Cash On Delivery") {
      fetch("https://craft-hub-mamun.vercel.app/orders", {
        method: "POST",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify(orderDetails),
      })
        .then((res) => res.json())
        .then((data) => {
          //console.log(data);
          if (data.acknowledged) {
            toast.success("Your Order is confirmed!! Your products is on the way.");

            // Get the cart from localStorage
            let cart = JSON.parse(localStorage.getItem("cart"));

            const orderedProductIds = Array.isArray(orderProduct)
              ? orderProduct.map((product) => product._id)
              : [orderProduct._id];

            cart = cart.filter(
              (product) => !orderedProductIds.includes(product._id)
            );

            localStorage.setItem("cart", JSON.stringify(cart));

            navigate("/dashboard/my-order");
          } else {
            toast.error(data.message);
          }
        });
      console.log("Cash On Delivery clicked");
      // You can handle the action specific to this button here
    } else if (event.nativeEvent.submitter.value === "Submit With Payment") {
      fetch("https://craft-hub-mamun.vercel.app/orders-payment", {
        method: "POST",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify(orderDetails),
      })
        .then((res) => res.json())
        .then((data) => {
          console.log(data);

          if (data) {
            toast.success("Your Order is confirmed!! Your products is on the way.");

            // Get the cart from localStorage
            let cart = JSON.parse(localStorage.getItem("cart"));

            const orderedProductIds = Array.isArray(orderProduct)
              ? orderProduct.map((product) => product._id)
              : [orderProduct._id];

            cart = cart.filter(
              (product) => !orderedProductIds.includes(product._id)
            );

            localStorage.setItem("cart", JSON.stringify(cart));
          } else {
            toast.error(data);
          }
          window.location.replace(data);
        });
      console.log("Submit With Payment clicked");
    }
  };

  return (
    <div className="">
      <dialog id="order-modal" className="modal ">
        <div className="modal-box">
          <form method="dialog">
            {/* if there is a button in form, it will close the modal */}
            <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
              ✕
            </button>
          </form>
          <div className="">
            <form onSubmit={handleSubmit(handleOrder)}>
              <h1 className="text-lg text-center font-semibold font-serif pb-3">
                Enter your details in below:{" "}
              </h1>
              <div className="">
                <label
                  htmlFor="address"
                  className="block text-lg font-medium text-gray-700"
                >
                  Enter your Address bellow:
                </label>

                <label className="label">
                  <span className="label-text">House Number</span>
                </label>
                <input
                  type="text"
                  {...register("house")}
                  placeholder="House No"
                  className="input input-bordered w-full mb-1"
                />

                <label className="label">
                  <span className="label-text">Road Number</span>
                </label>
                <input
                  type="text"
                  {...register("road")}
                  placeholder="Road No"
                  className="input input-bordered w-full mb-1"
                />
                <label className="label">
                  <span className="label-text">
                    Area
                    <small className="text-red-500 text-[20px]">*</small>
                  </span>
                </label>
                <input
                  type="text"
                  {...register("area")}
                  required
                  placeholder="Area"
                  className="input input-bordered w-full mb-1"
                />
                <label className="label">
                  <span className="label-text">Post </span>
                </label>
                <input
                  type="text"
                  {...register("post")}
                  placeholder="Post"
                  className="input input-bordered w-full mb-1"
                />
                <label className="label">
                  <span className="label-text">
                    District
                    <small className="text-red-500 text-[20px]">*</small>
                  </span>
                </label>
                <input
                  type="text"
                  {...register("district")}
                  required
                  placeholder="District"
                  className="input input-bordered w-full mb-1"
                />
              </div>

              <div className=" ">
                <label className="label">
                  <span className="text-[16px] ">
                    Enter your phone number
                    <small className="text-red-500 text-[20px]">*</small>
                  </span>
                </label>
                <input
                  type="tel"
                  placeholder="Mobile number"
                  {...register("mobileNumber", {
                    required: true,
                    minLength: 11,
                    maxLength: 11,
                    pattern: /^\d{11}$/,
                  })}
                  className="input input-bordered w-full  "
                />
                {errors.mobileNumber && (
                  <p className="text-red-500">{errors.mobileNumber.message}</p>
                )}
              </div>

              <div className="text-center">
                <input
                  className="btn btn-accent  w-3/4 mt-7  bg-orange-500 px-5 py-2 rounded-[4px] hover:bg-white  border-2 hover:border-orange-500  hover:text-black text-white text-lg  hover:duration-500"
                  value="Cash On Delivery"
                  type="submit"
                  name="action"
                />
              </div>
              <div className="text-center ">
                <h1 className="text-lg font-serif mt-4">
                  Do you want to complete your payment?
                </h1>
                <input
                  type="submit"
                  value="Submit With Payment"
                  name="action"
                  className="btn btn-primary  w-3/4 mt-2  bg-orange-500 px-5 py-2 rounded-[4px] hover:bg-white  border-2 hover:border-orange-500  hover:text-black text-white text-lg  hover:duration-500"
                />
              </div>
            </form>
          </div>
        </div>
      </dialog>
    </div>
  );
};

export default OrderModal;
