import React from "react";
import OurPolicy from "../OurPolicy/OurPolicy";
// import HomeSlider from "../HomeSlider/HomeSlider";
import ProductSlider from "../ProductSlider/ProductSlider";
import Category from "../Category/Category";
import Welcome from "../Welcome/Welcome";
import HomeSlider2 from "../HomeSlider/HomeSlider2";
import HowDeliveryServiceWork from "../HowDeliveryServiceWork/HowDeliveryServiceWork";
import ContactUs from "../ContactUs/ContactUs";
import Products from '../Products/Products';

const Home = () => {
  return (
    <div className="">
      {/* <HomeSlider/> */}
      <HomeSlider2/>
      <ProductSlider/>
      <Products/>
      <Welcome/>
      <Category/>
      <OurPolicy />
      <HowDeliveryServiceWork/>
      <ContactUs/>
    </div>
  );
};

export default Home;
