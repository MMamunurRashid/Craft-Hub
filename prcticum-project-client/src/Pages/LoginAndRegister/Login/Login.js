import React from "react";

import { Link, useNavigate } from "react-router-dom";

import { useForm } from "react-hook-form";
import Swal from "sweetalert2";
import loginBenner from "../../../assets/login.jpg";

const Login = () => {
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const handleLogin = (data) => {
    const userInfo = {
      mobileNumber: data.mobileNumber,
      password: data.password,
    };

    fetch("http://localhost:5000/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userInfo),
      credentials: "include", // Include credentials in the request
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.message === "Login successful") {
          Swal.fire({
            position: "center",
            icon: "success",
            title: "Your login was successful",
            showConfirmButton: false,
            timer: 1000,
          });
          navigate("/");
        } else {
          Swal.fire({
            position: "center",
            icon: "error",
            title: "Invalid mobile number or password",
            showConfirmButton: false,
            timer: 1000,
          });
        }
      });
  };

  return (
    <div className="py-10 min-h-screen">
      <div className="flex">
        <div className="hidden md:block">
          <img className="h-screen pl-10" src={loginBenner} alt="" />
        </div>
        <div className="flex justify-center items-center">
        <div className="p-7 mr-20">
          <h2 className="text-xl sm:text-5xl text-center">Login</h2>
          <form onSubmit={handleSubmit(handleLogin)}>
            <div className="form-control md:w-[500px] ">
              <label className="label">
                <span className="label-text">Mobile Number</span>
              </label>
              <input
                type="tel"
                placeholder="Enter your mobile here"
                {...register("mobileNumber", {
                  required: true,
                })}
                required
                className="input input-bordered input-xl md:w-[500px]"
              />
              {errors.mobileNumber && (
                <p className="text-red-600">{errors.mobileNumber?.message}</p>
              )}
            </div>
            <div className="form-control md:w-[500px]">
              <label className="label">
                {" "}
                <span className="label-text">Password</span>
              </label>
              <input
                placeholder="Enter your password here"
                type="password"
                {...register("password", {
                  required: "Password is required",
                  minLength: {
                    value: 6,
                    message: "Password must be 6 characters or longer",
                  },
                })}
                className="input input-bordered input-xl md:w-[500px] "
              />{" "}
              {errors.password && (
                <p className="text-red-600">{errors.password?.message}</p>
              )}
            </div>
            <div className="mt-5 w-1/2 m-auto">
              <input
                className="btn btn-primary w-full"
                value="Submit"
                type="submit"
              />
            </div>
            <div>
              {/* {loginError && <p className="text-red-600">{loginError}</p>} */}
            </div>
          </form>
          <p>
            New? You don't have any account?
            <Link className="text-secondary hover:text-accent" to="/register">
              Create new Account
            </Link>
          </p>
        </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
