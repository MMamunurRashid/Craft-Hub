import { useQuery } from "@tanstack/react-query";
import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../../../Contexts/AuthProvider";
import { Link } from "react-router-dom";
import { AiFillEyeInvisible } from "react-icons/ai";
import { TbEyeCheck } from "react-icons/tb";
import { MdOutlinePreview } from "react-icons/md";
import { BsStar, BsStarFill, BsStarHalf } from "react-icons/bs";
import { BiEditAlt } from "react-icons/bi";
import toast from "react-hot-toast";
import { useForm } from "react-hook-form";

const MyProduct = () => {
  const { user } = useContext(AuthContext);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const {
    data: products = [],
    refetch,
    isLoading,
  } = useQuery({
    queryKey: ["products", user?.email],
    queryFn: async () => {
      const res = await fetch(
        `https://craft-hub-mamun.vercel.app/my-product?email=${user?.email}`,
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
      fetch(`https://craft-hub-mamun.vercel.app/product/${productId}`)
        .then((res) => res.json())
        .then((data) => {
          setProduct(data);
        });
    }
  }, [productId]);

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

  const handleInvisibleProduct = (id) => {
    console.log("click", id);
    if (
      window.confirm(
        "Are you sure you want to INVISIBLE this product? If you Invisible this product then this product can't be show any where"
      )
    ) {
      fetch(`https://craft-hub-mamun.vercel.app/updateProduct/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ invisible: "invisible" }),
      })
        .then((res) => res.json())
        .then((data) => {
          // Handle the response
          // console.log(data);
          toast.success(`Product set as Invisible!`);
          refetch();
        })
        .catch((error) => {
          // Handle errors
          console.error("Error:", error);
        });
    } else {
      toast.error("Invisible cancelled by the user");
      console.log("Invisible cancelled by the user");
    }
  };

  const handleMakeVisible = (id) => {
    console.log("click", id);
    if (
      window.confirm(
        "Are you sure you want to Visible this product? If you Visible this product then this product  be show  everywhere"
      )
    ) {
      fetch(`https://craft-hub-mamun.vercel.app/updateProduct/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ invisible: "visible" }),
      })
        .then((res) => res.json())
        .then((data) => {
          // Handle the response
          // console.log(data);
          toast.success(`Product is now Visible everywhere!`);
          refetch();
        })
        .catch((error) => {
          // Handle errors
          console.error("Error:", error);
        });
    } else {
      toast.error("Visible cancelled by the user");
      console.log("Visible cancelled by the user");
    }
  };

  const [updateQuantityProductId, setUpdateQuantityProductId] = useState(null);
  const [quantity, setQuantity] = useState(1);

  const handleQuantityModal = (id) => {
    console.log(id);
    setUpdateQuantityProductId(id);
    setQuantity(1);
    document.getElementById("update-quantity-modal").showModal();
  };

  const handleUpdateQuantity = (event) => {
    event.preventDefault();
    console.log("Quantity:", quantity);

    if (
      window.confirm(
        "Are you sure you want to INVISIBLE this product? If you Invisible this product then this product can't be show any where"
      )
    ) {
      fetch(`https://craft-hub-mamun.vercel.app/quantity-update-product/${updateQuantityProductId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ quantity: quantity}),
      })
        .then((res) => res.json())
        .then((data) => {
          // Handle the response
          // console.log(data);
          toast.success(`Quantity is added for this Product`);
          refetch();
        })
        .catch((error) => {
          // Handle errors
          console.error("Error:", error);
        });
    } else {
      toast.error("Cancelled by the user");
      console.log("Cancelled by the user");
    }
  };
  return (
    <div>
      {products?.length === 0 ? (
        <p className="text-center text-2xl font-serif font-semibold">
          No products in My Product. <br /> Please post your new product{" "}
          <Link to="/dashboard/add-product">Add Product</Link>{" "}
        </p>
      ) : (
        <>
          {" "}
          <p className="text-center text-2xl font-serif font-semibold mb-5">
            My Products
          </p>
          <table className="table px-2 py-1 text-[16px] table-pin-rows table-pin-cols ">
            <thead>
              <tr>
                <th></th>
                <th>Photo</th>
                <th>Product Name</th>
                <th>Product Price</th>
                <th>Available Quantity</th>
                <th>Sold</th>
                <th>Update</th>
                <th>View Product</th>
                <th>Invisible Product</th>
              </tr>
            </thead>
            <tbody>
              {products &&
                products?.map((product, idx) => (
                  <tr key={product._id}>
                    <th>{idx + 1}</th>
                    <td>
                      <div className="avatar">
                        <div className="rounded w-24 h-24">
                          <img src={product.productImage} alt="" />
                        </div>
                      </div>
                    </td>
                    <td>{product.productName}</td>
                    <td>{product.productPrice}</td>
                    <td>{product.availableQuantity}</td>
                    <td>
                      {product?.saleQuantity ? product.saleQuantity : "0"}
                    </td>
                    <td>
                      <label
                        onClick={() => handleQuantityModal(product?._id)}
                        className="tooltip"
                        data-tip="Update Quantity"
                      >
                        <BiEditAlt className="w-9 h-9 text-green-500" />
                      </label>

                      <dialog id="update-quantity-modal" className="modal">
                        <div className="modal-box">
                          <form method="dialog">
                            <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
                              ✕
                            </button>
                          </form>
                          <form onSubmit={handleUpdateQuantity}>
                            <h1 className="text-lg text-center font-semibold font-serif pb-3">
                              Enter Quantity that you add in below in below:
                            </h1>
                            <div className="">
                              <label className="label">
                                <span className="text-[16px] ">
                                  Enter Quantity{" "}
                                  <small className="text-red-500 text-[20px]">
                                    *
                                  </small>
                                </span>
                              </label>
                              <input
                                type="number"
                                name="quantity"
                                placeholder="Enter quantity in digit"
                                value={quantity}
                                onChange={(e) => setQuantity(e.target.value)}
                                required
                                className="input input-bordered w-full"
                              />
                            </div>

                            <div className="text-center">
                              <input
                                className="btn btn-accent w-3/4 mt-7  bg-orange-500 px-5 py-2 rounded-[4px] hover:bg-white  border-2 hover:border-orange-500  hover:text-black text-white text-lg  hover:duration-500"
                                value="Submit"
                                type="submit"
                              />
                            </div>
                          </form>
                        </div>
                      </dialog>
                    </td>
                    <td>
                      <label
                        htmlFor="my_modal_6"
                        onClick={() => handleViewProduct(product?._id)}
                        className="tooltip"
                        data-tip="Quick View"
                      >
                        <MdOutlinePreview className="w-9 h-9 text-yellow-500" />
                      </label>
                    </td>

                    <td>
                      {!product.invisible ||
                      product.invisible !== "invisible" ? (
                        <button
                          onClick={() => handleInvisibleProduct(product?._id)}
                          className="tooltip"
                          data-tip="Invisible Product"
                        >
                          <AiFillEyeInvisible className="w-10 h-10 text-red-600" />
                        </button>
                      ) : (
                        <button
                          onClick={() => handleMakeVisible(product?._id)}
                          className="tooltip"
                          data-tip="Make Visible"
                        >
                          <TbEyeCheck className="w-10 h-10 text-blue-600" />
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
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
                    do eiusmod tempor incididunt ut labore et dolore magna
                    aliqua. Lorem ipsum dolor sit amet, consectetur adipiscing
                    elit. Sed do eiusmod tempor incididunt ut labore et dolore
                    magna aliqua. Lorem ipsum dolor sit amet, consectetur
                    adipiscing elit. Sed do eiusmod tempor incididunt ut labore
                    et dolore magna aliqua.
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
        </>
      )}
    </div>
  );
};

export default MyProduct;
