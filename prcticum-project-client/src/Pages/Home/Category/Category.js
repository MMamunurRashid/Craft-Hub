import { useQuery } from "@tanstack/react-query";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Loading from "../../../Shared/Loading/Loading";

const Category = () => {
  const {
    data: categories = [],
    refetch,
    isLoading,
  } = useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const res = await fetch(`http://localhost:5000/categories`);
      const data = await res.json();
      // console.log(data);
      return data;
    },
  });


  return (
    <div className="my-16">
      <h1 className="text-center text-xl md:text-3xl BerkshireSwash">
        Shop By Category
      </h1>
      {
        isLoading && <Loading/>
      }

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-10 md:gap-7 max-w-[1440px] my-7 mx-5 md:mx-28 justify-items-center">
        {categories ? (
          categories.map((category) => (
            <div key={category.id} className=" hover:border-orange-500 border-stone-100 border-[3px] rounded-[10px]">
              <div
                
                className="card shadow-lg rounded-lg w-full h-full  "
              >
                <div className="relative">
                  <div className="">
                    <img
                      src={category.image}
                      alt={""}
                      className="w-full h-64 rounded-lg "
                    />

                    {/* image  hover view button */}
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 bg-opacity-60 hover:opacity-100 transition-opacity duration-700">
                      <Link to="/">
                        <button className="bg-slate-300 hover:bg-orange-500 hover:text-slate-200 text-gray-800 font-bold py-2 px-4 rounded shadow">
                          {category.name}
                        </button>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <></>
        )}
      </div>
    </div>
  );
};

export default Category;
