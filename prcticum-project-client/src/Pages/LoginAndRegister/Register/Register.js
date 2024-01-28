import React, { useContext, useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useLocation, useNavigate } from "react-router-dom";
import signUpBenner from "../../../assets/signUp.jpg";
import { AuthContext } from "../../../Contexts/AuthProvider";
import toast from "react-hot-toast";
import useToken from "../../../hooks/useToken";

const Register = () => {
  const { createUser, updateUser } = useContext(AuthContext);

  const [signupError, setSignupError] = useState("");
  const [createdUserEmail, setCreatedUserEmail] = useState("");
  const [token] = useToken(createdUserEmail);

  const location = useLocation();
  const navigate = useNavigate();
  const from = location.state?.from?.pathname || "/";
  if (token) {
    navigate(from, { replace: true });
  }

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm();

  //add new user
  const imgbbKey = "18a8d0f77a7a7c4643e1e64714b6915a";
  const handleSignup = (data) => {
    // const name = data.name;
    const email = data.email;

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
              password: data.password,
              role: data.option,
            };
            console.log(userDetails);
            setSignupError("");
            createUser(email, password)
              .then((result) => {
                const user = result.user;
                console.log(user);

                const userInfo = {
                  displayName: data.name,
                  photoURL: imgData.data.url,
                  phoneNumber: data.mobileNumber,
                };
                updateUser(userInfo)
                  .then(() => {
                    saveUserInDb(userDetails);
                    setCreatedUserEmail(email);
                    toast.success("Your Registration Successful!!");
                  })
                  .catch((err) => console.error(err));
              })
              .catch((err) => {
                //console.log(err);
                setSignupError(err.message);
                toast.error(`${err.message}`);
              });
          }
        });
    }
  };
  // save user to DB
  const saveUserInDb = (userDetails) => {
    fetch(`https://craft-hub-mamun.vercel.app/users`, {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify(userDetails),
    })
      .then((res) => res.json())
      .then((data) => {
        toast.success("User information saved in database");
      });
  };

  // show password
  const [showPassword, setShowPassword] = useState(false);
  const [showRetypePassword, setShowRetypePassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleRetypePasswordVisibility = () => {
    setShowRetypePassword(!showRetypePassword);
  };
  return (
    <div className="py-10 min-h-screen">
      <div className="flex">
        <div className="hidden md:block">
          <img className="h-screen pl-10" src={signUpBenner} alt="" />
        </div>
        <div className=" p-7 mr-20">
          <h2 className="text-xl sm:text-5xl text-center">Sign Up</h2>
          <form onSubmit={handleSubmit(handleSignup)}>
            <div>
              <div className="form-control md:w-[500px] ">
                <label className="label">
                  <span className="label-text">Select your User Option</span>
                </label>
                <select
                  {...register("option", {
                    required: true,
                  })}
                  className="select select-bordered md:w-[500px] "
                >
                  <option selected>Buyer</option>
                  <option>Seller</option>
                  <option>Delivery Man</option>
                </select>
                {errors.option && (
                  <span className="text-red-500">{errors.option.message}</span>
                )}
              </div>
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
                  accept="image/*"
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
              <div className="form-control md:w-[500px] relative">
                <label className="label">
                  <span className="label-text">Password</span>
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter a password 6 characters or longer"
                    {...register("password", {
                      required: "Password is required",
                      minLength: {
                        value: 6,
                        message: "Password must be 6 characters or longer",
                      },
                      pattern: {
                        value: /(?=.*[!@#$&*])(?=.*[0-9])/,
                        message:
                          "Password must have numbers and special characters",
                      },
                    })}
                    required
                    className="input input-bordered md:w-[500px]"
                  />
                  <button
                    type="button"
                    onClick={togglePasswordVisibility}
                    className="absolute top-1/2 right-2 transform -translate-y-1/2 text-blue-500"
                  >
                    {showPassword ? "Hide" : "Show"}
                  </button>
                </div>
              </div>
              <div className="form-control md:w-[500px] relative">
                <label className="label">
                  <span className="label-text">Retype your Password</span>
                </label>
                <div className="relative">
                  <input
                    type={showRetypePassword ? "text" : "password"}
                    placeholder="Retype your password"
                    {...register("retypePassword", {
                      required: "Retype Password is required",
                    })}
                    required
                    className="input input-bordered md:w-[500px]"
                  />
                  <button
                    type="button"
                    onClick={toggleRetypePasswordVisibility}
                    className="absolute top-1/2 right-2 transform -translate-y-1/2 text-blue-500"
                  >
                    {showRetypePassword ? "Hide" : "Show"}
                  </button>
                </div>
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
            {signupError && <p className="text-red-600">{signupError}</p>}
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
