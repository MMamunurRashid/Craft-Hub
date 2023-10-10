import React from "react";
import { useForm } from "react-hook-form";
import Swal from "sweetalert2";
import { Link, useNavigate } from "react-router-dom";
import signUpBenner from '../../../assets/signUp.jpg'

const Register = () => {
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm();

  //add new user
  const imgbbKey = "18a8d0f77a7a7c4643e1e64714b6915a";
  const handleSignup = (data) => {
    const skills = JSON.stringify(data.skills);

    console.log(data.skills);
    console.log("skills: ", skills);
    const { password, retypePassword } = data;

    if (password !== retypePassword) {
      setError("retypePassword", {
        type: "manual",
        message: "Passwords do not match",
      });
    } else {
      // Passwords match, proceed with form submission
      const img = data.userPhoto[0];
      // console.log(productPhoto);
      const formData = new FormData();
      formData.append("image", img);
      const url = `https://api.imgbb.com/1/upload?key=${imgbbKey}`;
      fetch(url, {
        method: "POST",
        body: formData,
      })
        .then((res) => res.json())
        .then((imgData) => {
          // console.log(imgData);
          if (imgData.success) {
            console.log(imgData.data.url);
            const userDetails = {
              creationDate: new Date(),
              userPhoto: imgData.data.url,
              email: data.email,
              name: data.name,
              mobileNumber: data.mobileNumber,
              dateOfBirth: data.dateOfBirth,
              presentAddress: data.presentAddress,
              parmanentAddress: data.parmanentAddress,
              password: data.password,
              skills: skills,
            };
            console.log(userDetails);
            // save  information to the database
            fetch("http://localhost:5000/users", {
              method: "POST",
              headers: {
                "content-type": "application/json",
              },
              body: JSON.stringify(userDetails),
            })
              .then((res) => res.json())
              .then((data) => {
                if (data.error) {
                  Swal.fire({
                    position: "center",
                    icon: "error",
                    title:
                      "This Mobile Number is already registered. Please try to login",
                    showConfirmButton: false,
                    timer: 1000,
                  });
                }
                if (data.message) {
                  Swal.fire({
                    position: "center",
                    icon: "success",
                    title: "Your registration successfull",
                    showConfirmButton: false,
                    timer: 1000,
                  });
                  navigate("/login");
                }

                if (!data.message && !data.error) {
                  Swal.fire({
                    position: "center",
                    icon: "error",
                    title: `something is wrong`,
                    showConfirmButton: false,
                    timer: 1000,
                  });
                }
              });
          }
        });
    }
  };

  return (
      <div className="py-10 min-h-screen">
        <div className="flex">
            <div className="hidden md:block">
                <img className="h-screen pl-10" src={signUpBenner} alt=""/>
            </div>
            <div className=" p-7 mr-20">
          <h2 className="text-xl sm:text-5xl text-center">Sign Up</h2>
          <form onSubmit={handleSubmit(handleSignup)}>
               <div>
               <div className="form-control  md:w-[500px] ">
                  <label className="label">
                    <span className="label-text">User Photo</span>
                  </label>
                  <input
                    type="file"
                    {...register("userPhoto", {
                      required: "User Photo is Required",
                    })}
                    className="file-input file-input-bordered md:w-[500px]"
                    required
                  />
                </div>
                <div className="form-control md:w-[500px] ">
                  <label className="label">
                    <span className="label-text">Full Name</span>
                  </label>
                  <input
                    type="text"
                    placeholder="Enter your full name here"
                    {...register("name", {
                      required: true,
                    })}
                    required
                    className="input input-bordered md:w-[500px] "
                  />
                </div>
                <div className="form-control md:w-[500px] ">
                  <label className="label">
                    <span className="label-text">Mobile Number</span>
                  </label>
                  <input
                    type="tel"
                    placeholder="Enter your mobile number here"
                    {...register("mobileNumber", {
                      required: true,
                    })}
                    required
                    className="input input-bordered md:w-[500px] "
                  />
                </div>
                <div className="form-control md:w-[500px] ">
                  <label className="label">
                    <span className="label-text">Email</span>
                  </label>
                  <input
                    type="email"
                    placeholder="Enter your email here"
                    required
                    {...register("email", {
                      required: true,
                    })}
                    className="input input-bordered md:w-[500px] "
                  />
                </div>
                <div className="form-control md:w-[500px] ">
                  <label className="label">
                    <span className="label-text">Password</span>
                  </label>
                  <input
                    type="password"
                    placeholder="Enter a password 6 character have number and special characters "
                    {...register("password", {
                      required: "Password is required",
                      minLength: {
                        value: 6,
                        message: "Password must be 6 characters or longer",
                      },
                      pattern: {
                        value: /(?=.*[!@#$&*])(?=.*[0-9])/,
                        message:
                          "Password must have number and special characters",
                      },
                    })}
                    required
                    className="input input-bordered md:w-[500px] "
                  />
                </div>
                <div className="form-control md:w-[500px] ">
                  <label className="label">
                    <span className="label-text">Retype your Password</span>
                  </label>
                  <input
                    type="password"
                    placeholder="Retype your password"
                    {...register("retypePassword", {
                      required: true,
                    })}
                    required
                    className="input input-bordered md:w-[500px] "
                  />
                  {errors.retypePassword && (
                    <span className="text-red-500">
                      {errors.retypePassword.message}
                    </span>
                  )}
                </div>
               </div>
             
         
            <div className="mt-5 w-1/2 m-auto">
              <input
                className="btn btn-primary w-full"
                value="Submit"
                type="submit"
              />
            </div>
          </form>
          <p className="text-center mt-5">
            Already have an account?
            <Link className="text-red-600 hover:text-accent" to="/login">
              Please Login.
            </Link>
          </p>
        </div>
        </div>
      </div>
   
  );
};

export default Register;
