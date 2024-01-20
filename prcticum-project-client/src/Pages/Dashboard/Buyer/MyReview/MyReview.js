import React, { useContext } from "react";
import { AuthContext } from "../../../../Contexts/AuthProvider";
import { useQuery } from "@tanstack/react-query";
import Loading from "../../../../Shared/Loading/Loading";
import { Link } from "react-router-dom";
import { Rating } from "./Rating";

const MyReview = () => {
  const { user } = useContext(AuthContext);
  const {
    data: reviews = [],
    refetch,
    isLoading,
  } = useQuery({
    queryKey: ["reviews", user?.email],
    queryFn: async () => {
      const res = await fetch(
        `http://localhost:5000/my-reviews?email=${user?.email}`,
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
  return (
    <div>
      {reviews?.length === 0 ? (
        <p className="text-center text-2xl font-serif font-semibold">
          No products in your order.
        </p>
      ) : (
        <>
          <div className="relative grid grid-cols-1 gap-4 p-4 mb-8 border rounded-lg bg-white shadow-lg">
            {reviews?.map((data) => (
              <div key={data.review._id} className="pb-1 border-b">
                <div>
                  <div className="flex items-center justify-between p-3 ">
                    <img
                      className="rounded w-24 h-24"
                      src={data.productInfo.productImage}
                      alt=""
                    />
                    <Link to={`/product-details/${data.productInfo._id}`} className="text-orange-500">
                      {data.productInfo.productName}
                    </Link>
                    <p>Price: {data.productInfo.productPrice} BDT</p>
                  </div>
                <p className="text-center">Your review on this product ⬇️</p>
                </div>
                <div className="relative flex gap-4 mt-8 ">
                  <img
                    src={data.review.userPhoto}
                    className="relative rounded-lg -top-8 -mb-4 bg-white border h-20 w-20"
                    alt=""
                    loading="lazy"
                  />
                  <div className="flex flex-col w-full">
                    <Rating rating={data.review.rating} />
                    <div className="flex flex-row justify-between">
                      <p className="relative text-xl whitespace-nowrap truncate overflow-hidden">
                        {data.review.userName}
                      </p>
                      <a className="text-gray-500 text-xl" href="/">
                        <i className="fa-solid fa-trash"></i>
                      </a>
                    </div>
                    <p className="text-gray-400 text-sm">
                      {data.review.reviewTime}
                    </p>
                  </div>
                </div>
                <p className="mt-1 text-gray-500">{data.review.review}</p>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default MyReview;
