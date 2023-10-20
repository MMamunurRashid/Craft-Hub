import React from "react";
import OurPolicy from "../OurPolicy/OurPolicy";
import HomeSlider from "../HomeSlider/HomeSlider";
import Carousel from "react-multi-carousel";
import ProductSlider from "../ProductSlider/ProductSlider";

const Home = () => {
  return (
    <div className="">
      <HomeSlider/>
      <OurPolicy />
      <ProductSlider/>
    </div>
  );
};

export default Home;
