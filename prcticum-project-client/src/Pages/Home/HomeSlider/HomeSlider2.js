import React from "react";
import Carousel from "react-multi-carousel";
import img from "../../../assets/Your paragraph text (5).png";
import img1 from "../../../assets/Your paragraph text (1).png";
import img2 from "../../../assets/Your paragraph text (2).png";
import img3 from "../../../assets/Your paragraph text (3).png";
import img4 from "../../../assets/Your paragraph text (4).png";
import img5 from "../../../assets/Your paragraph text.png";

const HomeSlider2 = () => {
  const images = [
    { img: img },
    { img: img1 },
    { img: img2 },
    { img: img3 },
    { img: img4 },
    { img: img5 },
  ];

  return (
    <div className="w-full h-[500px]">
      <Carousel
        additionalTransfrom={0}
        arrows
        autoPlay
        autoPlaySpeed={4000}
        centerMode={false}
        className=""
        containerClass="container"
        dotListClass=""
        draggable
        focusOnSelect={false}
        infinite
        itemClass=""
        keyBoardControl
        minimumTouchDrag={80}
        pauseOnHover
        renderArrowsWhenDisabled={false}
        renderButtonGroupOutside={false}
        renderDotsOutside={false}
        responsive={{
          desktop: {
            breakpoint: {
              max: 3000,
              min: 1024,
            },
            items: 1,
          },
          mobile: {
            breakpoint: {
              max: 464,
              min: 0,
            },
            items: 1,
          },
          tablet: {
            breakpoint: {
              max: 1024,
              min: 464,
            },
            items: 1,
          },
        }}
        rewind={false}
        rewindWithAnimation={false}
        rtl={false}
        shouldResetAutoplay
        showDots
        sliderClass=""
        slidesToSlide={1}
        swipeable
      >
        {images.map((img, index) => (
          <div key={index}>
            <img
              alt=""
              src={img.img}
              style={{
                display: "block",
                height: "500px",
                margin: "auto",
                width: "100%",
              }}
            />
          </div>
        ))}
      </Carousel>
    </div>
  );
};

export default HomeSlider2;
