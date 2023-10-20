import React from "react";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";

import img1 from '../../../assets/newsletter-parallax.png';
import img2 from '../../../assets/art-of-colors-e1614735388680.jpg';
import img3 from '../../../assets/markus-spiske-QRrZzqLTWig-unsplash-1024x683.jpg';

const ProductSlider = () => {
    const responsive = {
        superLargeDesktop: {
          // the naming can be any, depends on you.
          breakpoint: { max: 4000, min: 3000 },
          items: 5
        },
        desktop: {
          breakpoint: { max: 3000, min: 1024 },
          items: 3
        },
        tablet: {
          breakpoint: { max: 1024, min: 464 },
          items: 2
        },
        mobile: {
          breakpoint: { max: 464, min: 0 },
          items: 1
        }
      };
  return (
    <Carousel responsive={responsive}   swipeable={true}
    draggable={true}
    showDots={true}
   
    ssr={true} // means to render carousel on server-side.
    infinite={true}
    autoPlaySpeed={1000}
    keyBoardControl={true}
    customTransition="all .5"
    transitionDuration={500}
    containerClass="carousel-container"
    removeArrowOnDeviceType={["tablet", "mobile"]}
    dotListClass="custom-dot-list-style"
    itemClass="carousel-item-padding-40-px">
    <div>
        <img src={img1} alt=""/>
        <h1>Hello</h1>
    </div>
 
    <div>
        <img src={img2}alt=""/>
        <h1>Hello</h1>
    </div>
 
    <div>
        <img src={img3} alt=""/>
        <h1>Hello</h1>
    </div>
    <div>
        <img src={img1} alt=""/>
        <h1>Hello</h1>
    </div>
 
    <div>
        <img src={img2}alt=""/>
        <h1>Hello</h1>
    </div>
 
    <div>
        <img src={img3} alt=""/>
        <h1>Hello</h1>
    </div>
    <div>
        <img src={img1} alt=""/>
        <h1>Hello</h1>
    </div>
 
    <div>
        <img src={img2}alt=""/>
        <h1>Hello</h1>
    </div>
 
    <div>
        <img src={img3} alt=""/>
        <h1>Hello</h1>
    </div>
 
    
 
  </Carousel>
  );
};

export default ProductSlider;


