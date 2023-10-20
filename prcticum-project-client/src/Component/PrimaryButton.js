import React from "react";

const PrimaryButton = ({ children }) => {
  return (
    <button className=" bg-orange-400 px-5 py-2 rounded-[4px] hover:bg-white  border-2 hover:border-orange-500  hover:text-black text-white text-lg m-5 hover:duration-500">
      {children}
    </button>
  );
};

export default PrimaryButton;