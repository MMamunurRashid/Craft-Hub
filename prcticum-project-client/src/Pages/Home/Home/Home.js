import React from "react";
import OurPolicy from "../OurPolicy/OurPolicy";
import HomeSlider from "../HomeSlider/HomeSlider";
import ProductSlider from "../ProductSlider/ProductSlider";
import Category from "../Category/Category";
import Welcome from "../Welcome/Welcome";
import HomeSlider2 from "../HomeSlider/HomeSlider2";

const Home = () => {
  return (
    <div className="">
      {/* <HomeSlider/> */}
      <HomeSlider2/>
      <OurPolicy />
      <Welcome/>
      <ProductSlider/>
      <Category/>
    </div>
  );
};

export default Home;
