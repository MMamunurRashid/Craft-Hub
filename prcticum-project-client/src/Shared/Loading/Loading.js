import React from "react";

import { ClipLoader } from "react-spinners";

const Loading = () => {
  return (
    <div className="flex items-center justify-center">
       
        <ClipLoader
          color="#F97316"
          cssOverride={{}}
          loading
          size={100}
          speedMultiplier={1}
        />
      </div>
  
 
  );
};

export default Loading;