import React, { useRef, useState } from "react";
import toast from "react-hot-toast";
import emailjs from "@emailjs/browser";

const ContactUs = () => {
  const form = useRef();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleContact = (event) => {
    event.preventDefault();

    emailjs
      .sendForm(
        "service_y445phm",
        "template_f5e51aq",
        form.current,
        "ZDFdANjbsH2vZdXMf"
      )
      .then(
        (result) => {
          console.log(result.text);
          toast.success("Thanks for your message! We'll get back to you soon.");

          // Reset the form inputs
          setFormData({
            name: "",
            email: "",
            subject: "",
            message: "",
          });
        },
        (error) => {
          console.log(error.text);
          toast.error("Oops! Something went wrong. Please try again later.");
        }
      );
  };

  return (
    <div className="text-center font-serif opacity-90 my-5">
      <div>
          <h3 className="text-xl ">Contact Us</h3>
          <h1 className="text-center text-xl md:text-3xl BerkshireSwash">
            Stay Connected with us
          </h1>
          <p className="text-xl">
            If you have any message, suggestion, or complaint, you can give us
            your message below.
          </p>
        </div>
      <div className="md:w-2/4 mx-auto mt-5 text-black">
        <form ref={form} onSubmit={handleContact}>
          <input
            name="name"
            type="text"
            placeholder="Type here your Name"
            className="input input-bordered md:w-full w-11/12"
            value={formData.name}
            onChange={handleInputChange}
          />
          <input
            name="email"
            type="email"
            placeholder="Type here your Email"
            className="input input-bordered md:w-full w-11/12 mt-4"
            value={formData.email}
            onChange={handleInputChange}
          />
          <input
            type="text"
            name="subject"
            placeholder="Type here Subject"
            className="input input-bordered md:w-full w-11/12 mt-4"
            value={formData.subject}
            onChange={handleInputChange}
          />
          <textarea
            name="message"
            className="textarea textarea-bordered md:w-full w-11/12 mt-4 h-40"
            placeholder="Type here your Message"
            value={formData.message}
            onChange={handleInputChange}
          ></textarea>
          <input
            className="btn bg-orange-500 px-5 py-2 rounded-[4px] hover:bg-white  border-2 hover:border-orange-500  hover:text-black text-white text-lg m-5 hover:duration-500 md:px-32 mt-5"
            type="submit"
            value="Submit"
          />
        </form>
      </div>
    </div>
  );
};

export default ContactUs;
