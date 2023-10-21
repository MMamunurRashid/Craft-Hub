import React from "react";

const HowDeliveryServiceWork = () => {
  const services = [
    {
      des: "Create your Seller or Buyer Account",
      img: "https://i.ibb.co/2jr74RY/profile.gif",
    },
    {
      des: "Post your product to sell. Book your desire product.",
      img: "https://i.ibb.co/gzwTrKn/booking.gif",
    },
    {
      des: "Take your payment. Make payment for your desire product.",
      img: "https://i.ibb.co/K0JtFxv/mobile-payment.gif",
    },
    {
      des: "Place your delivery. Be ready to take you product.",
      img: "https://i.ibb.co/HP3TydW/delivery.gif",
    },
  ];
  return (
    <div className="my-16">
      <h1 className="text-center text-xl md:text-3xl BerkshireSwash mb-10">
        How Craft Hub Delivery Service Work For Seller and Buyer
      </h1>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-5  justify-between items-center mx-10 text-center">
        {services.map((service, index) => (
          <div
            key={index}
            className="flex flex-col items-center shadow-lg p-7  h-[300px] hover:border-orange-500 border-stone-100 border-[3px] rounded-[10px]"
          >
            <img className="w-40 " src={service.img} alt="" />
            <p className="font-serif text-xl">{service.des}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HowDeliveryServiceWork;
