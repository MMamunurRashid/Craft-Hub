import { useQuery } from "@tanstack/react-query";
import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../../../Contexts/AuthProvider";
import Loading from "../../../../Shared/Loading/Loading";
import { BsStar, BsStarFill, BsStarHalf } from "react-icons/bs";
import { PDFDownloadLink } from "@react-pdf/renderer";
import Invoice from "../MyCart/Invoice/Invoice";

const MyOrder = () => {
  const { user } = useContext(AuthContext);
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

  const [orderForInvoiceId, setOrderForInvoiceId] = useState([]);
  const [orderForInvoice, setOrderForInvoice] = useState([]);
  const handleViewInvoice = (id) => {
    if (id) {
      setOrderForInvoiceId(id);
      document.getElementById("invoice-modal").showModal();
    }
  };
  console.log(orderForInvoiceId);

  useEffect(() => {
    if (orderForInvoiceId) {
      fetch(`https://craft-hub-mamun.vercel.app/order/${orderForInvoiceId}`)
        .then((res) => res.json())
        .then((data) => {
          console.log(data);
          setOrderForInvoice(data);
        });
    }
  }, [orderForInvoiceId]);

  

  const date = new Date();
  const options = { timeZone: "Asia/Dhaka" };

  const localTime = date.toLocaleString("en-US", options);

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
              <div key={order._id}>
                {order.deliveryStatus !== "complete" ? (
                  <div className="ml-10 p-5 my-5 shadow-lg mb-3">
                    <div className="flex justify-between">
                      <div>
                        <p className="text-xl  font-semibold">
                          Order ID: {order._id}
                        </p>
                        <p className="text-lg">Order Date: {order.orderDate.split(",")[0]}</p>
                        <p className="text-lg">
                          Product Price: {order.price} BDT
                        </p>
                        <p className="text-lg">
                          Delivery Charge: {order.deliveryCharge} BDT
                        </p>
                        <p className="text-lg">
                          Grand Total: {order.totalPrice} BDT
                        </p>
                        
                        <p className="text-lg">Your Ordered Product: ⬇️</p>
                      </div>
                      <div className="flex flex-col gap-3 mb-1">
                        {order?.paymentdata && (
                          <div>
                            <button
                              onClick={() => handleViewInvoice(order?._id)}
                              className="btn btn-primary mr-10 w-full"
                            >
                              view invoice
                            </button>

                            {/* invoice modal */}
                            <dialog id="invoice-modal" className="modal">
                              <div className="modal-box w-[97%] max-w-6xl">
                                <div className="font-sans bg-gray-100">
                                  <div className="container mx-auto p-8">
                                    <div className="bg-white rounded-md shadow-md p-8">
                                      <div className="flex justify-between items-center">
                                        <div>
                                          <div className=" mb-6">
                                            <h1 className="text-2xl font-bold">
                                              Invoice
                                            </h1>
                                            <div className="text-gray-600">
                                              Invoice #INV
                                              {orderForInvoice.transactionId}
                                            </div>
                                          </div>

                                          {/* Client Info */}
                                          <div className="mb-6">
                                            <p className="text-sm font-semibold text-gray-600">
                                              Bill To:
                                            </p>
                                            <p className="text-lg font-bold">
                                              {orderForInvoice.userName}
                                            </p>
                                            <p>
                                              {orderForInvoice?.location?.area
                                                ? orderForInvoice?.location
                                                    ?.area
                                                : orderForInvoice.location}{" "}
                                              {orderForInvoice?.location
                                                ?.district
                                                ? orderForInvoice?.location
                                                    ?.district
                                                : orderForInvoice.location}
                                            </p>

                                            <p>
                                              Email: {orderForInvoice.userEmail}
                                            </p>
                                          </div>

                                          {/* Invoice Details */}
                                          <div className="mb-6">
                                            <p className="text-sm font-semibold text-gray-600">
                                              Invoice Details:
                                            </p>
                                            <p>Date: {localTime}</p>
                                            <p>
                                              Payment Date:{" "}
                                              {orderForInvoice.orderDate}
                                            </p>
                                          </div>
                                        </div>
                                        <h1 className="hidden md:block btn btn-ghost normal-case text-2xl md:text-5xl BerkshireSwash font-bold">
                                          Craft{" "}
                                          <span className="text-orange-500">
                                            Hub
                                          </span>
                                        </h1>
                                      </div>
                                      {/* Items Table */}
                                      <table className="w-full border-collapse border border-gray-300">
                                        <thead>
                                          <tr className="bg-gray-100">
                                            <th className="py-2 px-4 border">
                                              Item
                                            </th>
                                            <th className="py-2 px-4 border">
                                              Description
                                            </th>
                                            <th className="py-2 px-4 border">
                                              Quantity
                                            </th>
                                            <th className="py-2 px-4 border">
                                              Unit Price
                                            </th>
                                            <th className="py-2 px-4 border">
                                              Total
                                            </th>
                                          </tr>
                                        </thead>
                                        <tbody>
                                          {orderForInvoice &&
                                            orderForInvoice.products &&
                                            (Array.isArray(
                                              orderForInvoice.products
                                            ) ? (
                                              orderForInvoice.products.map(
                                                (product, index) => (
                                                  <tr key={index}>
                                                    <td className="py-2 px-4 border">
                                                      {index + 1}
                                                    </td>
                                                    <td className="py-2 px-4 border">
                                                      {product.productName}
                                                    </td>
                                                    <td className="py-2 px-4 border">
                                                      {product?.quantity
                                                        ? product.quantity
                                                        : 1}
                                                    </td>
                                                    <td className="py-2 px-4 border">৳ {`${product.productPrice.toFixed(
                                                      2
                                                    )}`}</td>
                                                    <td className="py-2 px-4 border">৳ {`${(
                                                      (product?.quantity
                                                        ? product.quantity
                                                        : 1) * product.productPrice
                                                    ).toFixed(2)}`}</td>
                                                  </tr>
                                                )
                                              )
                                            ) : (
                                              <tr>
                                                <td className="py-2 px-4 border">
                                                  1
                                                </td>
                                                <td className="py-2 px-4 border">
                                                  {
                                                    orderForInvoice.products
                                                      .productName
                                                  }
                                                </td>
                                                <td className="py-2 px-4 border">
                                                  {orderForInvoice.products
                                                    ?.quantity
                                                    ? orderForInvoice.products
                                                        .quantity
                                                    : 1}
                                                </td>
                                                <td className="py-2 px-4 border">৳ {`${orderForInvoice.products.productPrice.toFixed(
                                                  2
                                                )}`}</td>
                                                <td className="py-2 px-4 border">৳ {`${((orderForInvoice
                                                  .products?.quantity
                                                  ? orderForInvoice.products
                                                      .quantity
                                                  : 1 )*
                                                    orderForInvoice.products
                                                      .productPrice
                                                ).toFixed(2)}`}</td>
                                              </tr>
                                            ))}
                                        </tbody>
                                      </table>

                                      {/* Total */}
                                      <div className="mt-6">
                                        <p className="text-right">
                                          <span className="text-xl font-bold">
                                            Total Price:
                                          </span>
                                          <span className="text-xl font-bold text-blue-500">
                                            {`${orderForInvoice.price}`} BDT
                                          </span>
                                        </p>
                                        <p className="text-right">
                                          <span className="text-xl font-bold">
                                            Delivery Charge:
                                          </span>
                                          <span className="text-xl font-bold text-blue-500">
                                            {`${orderForInvoice.deliveryCharge}`}{" "}
                                            BDT
                                          </span>
                                        </p>
                                        <p className="text-right">
                                          <span className="text-xl font-bold">
                                            Grand Total:
                                          </span>
                                          <span className="text-xl font-bold text-blue-500">
                                            {`${orderForInvoice.totalPrice}`}{" "}
                                            BDT
                                          </span>
                                        </p>
                                      </div>

                                      {/* Thank you message */}
                                      <div className="mt-6">
                                        <p className="text-gray-600 text-sm">
                                          Thank you for shooping with Craft Hub
                                        </p>
                                      </div>
                                    </div>
                                  </div>
                                </div>

                                <PDFDownloadLink
                                  document={
                                    <Invoice
                                      orderForInvoice={orderForInvoice}
                                      localTime={localTime}
                                    />
                                  }
                                  filename="Sales_Report.pdf"
                                >
                                  {({ loading }) =>
                                    loading ? (
                                      <button>Loading Document...</button>
                                    ) : (
                                      <button className="btn btn-primary mt-10">
                                        Download as PDF
                                      </button>
                                    )
                                  }
                                </PDFDownloadLink>
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
                        )}

                        <h1 className="text-xl font-semibold bg-green-600 text-white p-3 rounded-md">
                          Delivery Status: {order.deliveryStatus === ''? 'Not Ship yet' : order.deliveryStatus}
                        </h1>
                        <h1 className="text-xl font-semibold bg-blue-600 text-white p-3 rounded-md">
                          Payment Status:{" "}
                          {order.paymentStatus === true
                            ? "Complete"
                            : "Cash On Delivery"}
                        </h1>

                       
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
                              {product.productName} X{product?.quantity ? product.quantity : 1}
                            </p>
                            <p>Unit Price: {product.productPrice} BDT</p>
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

export default MyOrder;
