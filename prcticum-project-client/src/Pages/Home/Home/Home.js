import React from "react";
import OurPolicy from "../OurPolicy/OurPolicy";
import HomeSlider from "../HomeSlider/HomeSlider";
import ProductSlider from "../ProductSlider/ProductSlider";
import Category from "../Category/Category";
import Welcome from "../Welcome/Welcome";
import HomeSlider2 from "../HomeSlider/HomeSlider2";
import HowDeliveryServiceWork from "../HowDeliveryServiceWork/HowDeliveryServiceWork";

const Home = () => {
  return (
    <div className="">
      {/* <HomeSlider/> */}
      
      <HomeSlider2/>
      <OurPolicy />
      <Welcome/>
      <ProductSlider/>
      <Category/>
      <HowDeliveryServiceWork/>
    </div>
  );
};

export default Home;
