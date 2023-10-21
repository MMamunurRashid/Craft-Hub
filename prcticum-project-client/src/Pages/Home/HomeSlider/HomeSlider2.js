import React, { useEffect, useState } from "react";
import Carousel from "react-multi-carousel";
import img from "../../../assets/Your paragraph text (5).png";
import img1 from "../../../assets/Your paragraph text (1).png";
import img2 from "../../../assets/Your paragraph text (2).png";
import img3 from "../../../assets/Your paragraph text (3).png";
import img4 from "../../../assets/Your paragraph text (4).png";
import img5 from "../../../assets/Your paragraph text.png";
import { Link } from "react-router-dom";

const HomeSlider2 = () => {
  const images = [
    { img: img },
    { img: img1 },
    { img: img2 },
    { img: img3 },
    { img: img4 },
    { img: img5 },
  ];

  const [data, setData] = useState();

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch your local data here
        const response = await fetch("data.json");
        const jsonData = await response.json();
        console.log(jsonData);
        setData(jsonData);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="flex gap-5  w-full h-[500px] ">
      <div className="hidden md:block rounded-lg shadow-lg w-1/6 h-full pt-14">
      <h1 className="text-center text-xl md:text-xl BerkshireSwash pb-4">
        Shop By Category
      </h1>
        <div className="">
          {data ? (
            data.categories.map((category) => (
              <div key={category.id} className=" my-3">
                <Link className=" font-semibold ml-5 pl-5 py-2 rounded shadow-sm w-full hover:text-orange-500">
                  {category.name}
                </Link>
              </div>
            ))
          ) : (
            <></>
          )}
        </div>
      </div>
      <Carousel
        additionalTransfrom={0}
        arrows
        autoPlay
        autoPlaySpeed={4000}
        centerMode={false}
        className=" w-5/6"
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
