import React, { useContext, useState } from "react";

import { Link, useLocation, useNavigate } from "react-router-dom";

import { useForm } from "react-hook-form";
import Swal from "sweetalert2";
import loginBenner from "../../../assets/login.jpg";
import { AuthContext } from "../../../Contexts/AuthProvider";
import toast from "react-hot-toast";

const Login = () => {
  const navigate = useNavigate();
  const { signIn } = useContext(AuthContext);
  const location = useLocation();

  const from = location.state?.from?.pathname || "/";
  const [loginError, setLoginError] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const handleLogin = (data) => {
    // console.log(data);
    console.log(data.email);
    setLoginError("");
    signIn(data.email, data.password)
      .then((result) => {
        const user = result.user;
        
        toast.success("Login Successful");
        //console.log(user);
      })
      .catch((err) => {
        console.error(err);
        setLoginError(err.message);
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
          <div className="form-control w-full max-w-xs bg-slate-100">
            <label className="label">
              <span className="label-text">Email</span>
            </label>
            <input
              type="email"
              {...register("email", {
                required: "Email Address is required",
              })}
              required
              className="input input-bordered input-xl md:w-[500px]"
            />
            {errors.email && (
              <p className="text-red-600">{errors.email?.message}</p>
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
