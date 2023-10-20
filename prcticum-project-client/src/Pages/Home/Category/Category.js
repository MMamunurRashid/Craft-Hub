import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const Category = () => {
  const [data, setData] = useState();

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch your local data here
        const response = await fetch("data.json");
        const jsonData = await response.json();
        //   console.log(jsonData);
        setData(jsonData);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="my-16">
      <h1 className="text-center text-xl md:text-3xl BerkshireSwash">
        Shop By Category
      </h1>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-10 md:gap-7 max-w-[1440px] my-7 mx-5 md:mx-28 justify-items-center">
        {data ? (
          data.categories.map((category) => (
            <div key={category.id} className="card rounded-lg w-full h-full  shadow-xl hover:border-orange-500 border-3">
              <div className="relative">
                <div className="">
                  <img src={category.image} alt={""} className="w-full h-64 rounded-lg" />
                  <div />
                  {/* image  hover view button */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 bg-opacity-60 hover:opacity-100 transition-opacity duration-700">
                    <Link to="/">
                      <button className="bg-slate-300 text-gray-800 font-bold py-2 px-4 rounded shadow">
                        
                        {category.name}
                      </button>
                    </Link>
                  
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
