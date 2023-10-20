import React from "react";
import OurPolicy from "../OurPolicy/OurPolicy";
import HomeSlider from "../HomeSlider/HomeSlider";
import ProductSlider from "../ProductSlider/ProductSlider";
import Category from "../Category/Category";
import Welcome from "../Welcome/Welcome";

const Home = () => {
  return (
    <div className="">
      <HomeSlider/>
      <OurPolicy />
      <Welcome/>
      <ProductSlider/>
      <Category/>
    </div>
  );
};

export default Home;
