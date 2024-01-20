import React, { useContext, useState } from "react";
import { useForm } from "react-hook-form";
import { AuthContext } from "../../../../Contexts/AuthProvider";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const BuyNow = ({ orderProduct }) => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  //   console.log(orderProduct);

  const product = orderProduct;

  const [quantityMap, setQuantityMap] = useState(1);

  const handleQuantityChange = (newQuantity) => {
    // Ensure the new quantity is within the available range (1 to availableQuantity)
    const updatedQuantity = Math.min(
      Math.max(newQuantity, 1),
      product.availableQuantity
    );
    setQuantityMap(updatedQuantity);
  };
  const orderProductWithQuantity = {
    ...orderProduct,
    quantity: quantityMap,
  };

  const calculateDeliveryCharge = () => {
    const productTotalPrice = product?.productPrice * quantityMap;

    // Check if the total price is more than 3000
    if (productTotalPrice > 3000) {
      return 0; // Free delivery charge
    } else {
      // Check if the quantity is more than 5
      const deliveryChargePerProduct = quantityMap > 5 ? 80 : 50;
      return deliveryChargePerProduct;
    }
  };

  const deliveryCharge = calculateDeliveryCharge();

  const price = product?.productPrice * quantityMap;
  const subTotal = (deliveryCharge + price).toFixed(2);
  const grandTotal = parseFloat(subTotal);

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
      products: orderProductWithQuantity,
      price: price,
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
            toast.success("Your Order is confirmed!! Your products is on its way.");
            document.getElementById("buy-now-modal").close();

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
      fetch("http://localhost:5000/orders-payment", {
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
            toast.success("Your Order is confirmed!! Your products is on its way.");
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
    <dialog id="buy-now-modal" className="modal ">
      <div className="modal-box max-w-[700px]">
        <form method="dialog">
          {/* if there is a button in form, it will close the modal */}
          <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
            ✕
          </button>
        </form>
        <div className="mt-5">
          <div>
            <table className="table px-2 py-1 text-[16px] table-pin-rows table-pin-cols ">
              <thead>
                <tr>
                  <th>Product Name</th>
                  <th>Product Price</th>
                  <th>Quantity</th>
                  <th>Available Quantity</th>
                </tr>
              </thead>
              <tbody>
                <tr className="hover:border-orange-500 border-stone-100 border-[2px] rounded-[10px]">
                  <td className=" cursor-pointer">{product?.productName}</td>
                  <td>{product?.productPrice}</td>
                  <td>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleQuantityChange(quantityMap - 1)}
                        disabled={quantityMap <= 1}
                        className="btn btn-quantity"
                      >
                        -
                      </button>
                      <span>{quantityMap}</span>
                      <button
                        onClick={() => handleQuantityChange(quantityMap + 1)}
                        disabled={quantityMap >= product?.availableQuantity}
                        className="btn btn-quantity"
                      >
                        +
                      </button>
                    </div>
                  </td>
                  <td>
                    <p className="text-center">{product?.availableQuantity}</p>
                  </td>
                </tr>
              </tbody>
            </table>

            <div className="text-lg font-serif m-5">
              <p>Product Price: {price} BDT</p>
              
              <p>Delivery Charge: {deliveryCharge} BDT</p>
              <p>Grand Total: {grandTotal} BDT</p>
            </div>
          </div>
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
              {errors.mobileNumber && (
                <p className="text-red-500">
                  Please enter a valid 11-digit mobile number.
                </p>
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
  );
};

export default BuyNow;
