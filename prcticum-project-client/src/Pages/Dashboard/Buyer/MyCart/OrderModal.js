import React, { useContext } from "react";
import { useForm } from "react-hook-form";
import { AuthContext } from "../../../../Contexts/AuthProvider";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const OrderModal = ({ orderProduct }) => {
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
    if (event.nativeEvent.submitter.value === "Cash On Delivery") {
      let totalPrice = 0;
      if (Array.isArray(orderProduct)) {
        totalPrice = orderProduct.reduce(
          (total, product) => total + product.productPrice,
          0
        );
      } else if (orderProduct) {
        totalPrice = orderProduct.productPrice || 0;
      }

      const tax = totalPrice * 0.15;
      const subTotal = 50 + totalPrice + tax;
      const grandTotal = Number(subTotal.toFixed(3));
      const date = new Date();
      const options = { timeZone: "Asia/Dhaka" }; // Set the time zone to Bangladesh

      const localTime = date.toLocaleString("en-US", options);

      console.log(localTime);

      const orderDetails = {
        orderDate: localTime,
        products: orderProduct,
        price: totalPrice,
        tax: tax,
        deliveryCharge: 50,
        totalPrice: grandTotal,
        deliveryStatus: "",
        paymentStatus: false,
        userName: user.displayName,
        userEmail: user.email,
        orderEmail: data.email,
        phoneNumber: data.mobileNumber,
        location: data.location,
      };
      fetch("http://localhost:5000/orders", {
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
            toast.success("Your Order is confirmed!! Your food is on its way.");

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
      // Perform action for Submit With Payment button
      console.log("Submit With Payment clicked");
      // You can handle the action specific to this button here
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
                <label className="label">
                  <span className="text-[16px] ">
                    Enter your location{" "}
                    <small className="text-red-500 text-[20px]">*</small>
                  </span>
                </label>
                <textarea
                  type="text"
                  placeholder="Enter your Location in details - Area, Street, House Number"
                  {...register("location", { required: true, maxLength: 80 })}
                  required
                  className="input input-bordered w-full  h-[100px]"
                />
              </div>
              <div className="">
                <label className="label">
                  <span className="text-[16px] ">
                    Enter your Email
                    <small className="text-red-500 text-[20px]">*</small>
                  </span>
                </label>
                <input
                  type="email"
                  placeholder="Enter your Email"
                  defaultValue={user.email}
                  {...register("email", {
                    required: true,
                  })}
                  className="input input-bordered w-full  "
                />
                {errors.email && (
                  <p className="text-red-500">{errors.email.message}</p>
                )}
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
                    minLength: 6,
                    maxLength: 12,
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
