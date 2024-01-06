import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { BsStar, BsStarFill, BsStarHalf } from "react-icons/bs";
import { MdDeleteForever } from "react-icons/md";
import { TbShoppingBagCheck } from "react-icons/tb";
import OrderModal from "./OrderModal";

const MyCart = () => {
  const [cartProducts, setCartProducts] = useState(() => {
    const storedCart = JSON.parse(localStorage.getItem("cart")) || [];
    return storedCart;
  });
  const totalPrice = cartProducts?.reduce(
    (total, product) => total + product.productPrice,
    0
  );
  const tax = totalPrice * 0.15;
  const subTotal = 50 + totalPrice + tax
  const grandTotal=Number(subTotal.toFixed(3))

//   console.log(cartProducts);

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
  const [product, setProduct] = useState(null);
  const handleViewProduct = (id) => {
    setProductId(id);
    if (product) {
      document.getElementById("my_modal_1").showModal();
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

  const handleRemoveProduct = (productId) => {
    if (
      window.confirm(
        "Are you sure you want to Remove this product from you Cart?"
      )
    ) {
      const updatedCart = cartProducts.filter(
        (product) => product._id !== productId
      );

      localStorage.setItem("cart", JSON.stringify(updatedCart));

      setCartProducts(updatedCart);
      toast.success("Product removed from you Cart!!!");
    } else {
      toast.error("Product remove cancelled");
    }
  };

  const [orderProduct, setOrderProduct] = useState(null)
//   console.log(orderProduct);
  // single product order
  const handleOrderProduct = (id) => {
   const product= cartProducts.find((product) => product._id === id);
//    console.log(product);
    document.getElementById('order-modal').showModal()
    setOrderProduct(product)
  };

  const handleOrderModal = () => {
    document.getElementById('order-modal').showModal()
    if(cartProducts){
        setOrderProduct(cartProducts);
      }
  };
  return (
    <div>
       {cartProducts.length === 0 ? (
        <p className="text-center text-2xl font-serif font-semibold">No products in your cart.</p>
      ) : (
        <>
        <div className="flex">
      <div className="w-2/3">
        <table className="table px-2 py-1 text-[16px] table-pin-rows table-pin-cols ">
          <thead>
            <tr>
              <th></th>
              <th>Photo</th>
              <th>Product Name</th>
              <th>Product Price</th>
              <th>Order</th>
              <th>Remove</th>
            </tr>
          </thead>
          <tbody>
            {cartProducts?.map((product, idx) => (
              <tr key={product._id} className="hover:border-orange-500 border-stone-100 border-[2px] rounded-[10px]">
                <th>{idx + 1}</th>
                <td>
                  <div className="avatar">
                    <div className="rounded w-24 h-24">
                      <img src={product.productImage} alt="" />
                    </div>
                  </div>
                </td>
                <td
                  onClick={() => handleViewProduct(product?._id)}
                  className=" cursor-pointer"
                >
                  {product.productName}
                </td>
                <td>{product.productPrice}</td>
                <td>
                  <label
                    onClick={() => handleOrderProduct(product?._id)}
                    className="tooltip"
                    data-tip="Order Only This Product"
                  >
                    <TbShoppingBagCheck className="w-9 h-9 text-yellow-500" />
                  </label>
                </td>

                <td>
                  <button
                    onClick={() => handleRemoveProduct(product?._id)}
                    className="tooltip cursor-pointer"
                    data-tip="Remove from Cart"
                  >
                    <MdDeleteForever className="w-10 h-10 text-red-600" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* product view  modal  */}
        <dialog id="my_modal_1" className="modal">
          <div className="modal-box w-[97%] max-w-6xl">
            <h3 className="font-semibold font-serif text-2xl">
              {product?.productName}
            </h3>
            <div className="flex items-center  gap-3">
              <p className="flex text-orange-500">
                {" "}
                {renderStars(product?.rating)}{" "}
              </p>
              <p>{product?.rating}</p>
            </div>

            <div className="divider h-[1px] bg-orange-500"></div>

            <div className="flex gap-10">
              {/* img  */}
              <div className="w-[35%]">
                <img src={product?.productImage} alt="" />
              </div>
              {/* details  */}
              <div className="w-[40%] mt-10">
                <h1 className="text-3xl">
                  {" "}
                  <span className="text-4xl">৳ </span> {product?.productPrice}
                  .00
                </h1>
                <p
                  className={`text-xl font-semibold my-3 ${
                    product?.availableQuantity === 0
                      ? "text-red-600"
                      : "text-green-600"
                  }`}
                >
                  {product?.availableQuantity === 0
                    ? "Out of Stock"
                    : "In Stock"}
                </p>
                <p>Available Quantity: {product?.availableQuantity}</p>
                <p>
                  Sale Quantity:{" "}
                  {product?.saleQuantity ? product.saleQuantity : "0"}
                </p>

                <p className=" my-1">Category: {product?.productCategory}</p>
                <p className=" my-1">Brand: {product?.productBand}</p>
                <p className="">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed
                  do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed
                  do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed
                  do eiusmod tempor incididunt ut labore et dolore magna aliqua.
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

      {/* cart summery  */}
      <div className=" h-screen w-1/3 bg-slate-300 ">
        <h1 className="  text-center text-2xl font-serif font-semibold mt-5">
          Cart Summery
        </h1>
        { cartProducts.length?
           <>
            <div className="text-lg font-serif m-5">
            <p>Total Product: {cartProducts?.length}</p>
            <p>Total Product Price: {totalPrice} BDT</p>
            <p>Total Tax: {tax} BDT</p>
            <p>Delivery Charge: 50 BDT</p>
            <p>Grand Total: {grandTotal}</p>
          </div>
          <div className="flex justify-center">
            <button
              onClick={() => handleOrderModal()}
              className="btn  bg-orange-500 px-5 py-2 rounded-[4px] hover:bg-white  border-2 hover:border-orange-500  hover:text-black text-white text-lg m-5 hover:duration-500"
            >
              Proceed To Order
            </button>
          
       
          <OrderModal orderProduct={orderProduct} grandTotal={grandTotal} totalPrice={totalPrice} tax={tax}/>
       
          </div>
          </>:<></>
        }
      </div>
    </div>
        </>
      )}
    </div>
  );
};

export default MyCart;
