import { useQuery } from "@tanstack/react-query";
import React, { useContext } from "react";
import { AuthContext } from "../../../../Contexts/AuthProvider";
import { Link } from "react-router-dom";
import { MdDeleteForever, MdOutlinePreview } from "react-icons/md";

const MyProduct = () => {
  const { user } = useContext(AuthContext);
  const {
    data: products = [],
    refetch,
    isLoading,
  } = useQuery({
    queryKey: ["products"],
    queryFn: async () => {
      const res = await fetch(
        `http://localhost:5000/my-product?email=${user?.email}`,
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
  return (
    <div>
      <div>
        <h1 className="text-center text-2xl font-serif font-semibold">
          My Product
        </h1>
      </div>
      <table className="table px-2 py-1 text-[16px] table-pin-rows table-pin-cols ">
          <thead>
            <tr>
              <th></th>
              <th>Photo</th>
              <th>Product Name</th>
              <th>Product Price</th>
              <th>Available Quantity</th>
              <th>Sold</th>
              <th>View Product</th>
              <th>Delete Product</th>
            </tr>
          </thead>
          <tbody >
            {products?.map((product, idx) => (
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
                <td>{product?.saleQuantity? product.saleQuantity : '0'}</td>
                <td>
                  <Link className='tooltip' data-tip="Quick View" >
                    <MdOutlinePreview  className="w-9 h-9 text-yellow-500"/>
                  </Link>
                </td>

                <td>
                  <button className='tooltip' data-tip="Delete Product" >
                    <MdDeleteForever 
                      className="w-10 h-10 text-red-600"
                    />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
    </div>
  );
};

export default MyProduct;
