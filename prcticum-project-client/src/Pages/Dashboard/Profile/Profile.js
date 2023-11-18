import React from "react";
import { useContext } from "react";
import { AuthContext } from "../../../Contexts/AuthProvider";
import "../../../Font/Font.css";
import { BounceLoader } from "react-spinners";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";


const Profile = () => {
  const { user, loading, updateUserProfile } = useContext(AuthContext);
  // console.log(user);
  const navigate = useNavigate();
  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm();

  // if loading
  if (loading) {
    return (
      <BounceLoader
        color="#d63636"
        cssOverride={{}}
        loading
        size={150}
        speedMultiplier={1}
      />
    );
  }

  // Upload Image
  const imgbbKey = "035fa433d4769de53906a7872698cbac";
  const handleAddProfilePhoto = (data) => {
    const productPhoto = data.productPhoto[0];
    // console.log(productPhoto);
    const formData = new FormData();
    formData.append("image", productPhoto);
    const url = `https://api.imgbb.com/1/upload?key=${imgbbKey}`;
    fetch(url, {
      method: "POST",
      body: formData,
    })
      .then((res) => res.json())
      .then((imgData) => {
        console.log(imgData);
        if (imgData.success) {
          console.log(imgData.data.url);
          const profilePhoto = {
            photoURL: imgData.data.url,
          };
          updateUserProfile(profilePhoto)
            .then(() => { })
            .catch((error) => {
              console.error(error);
            });
          toast.success("Your profile picture changed successfully.");
          navigate("/dashboard/profile");
        }
      });
  };
  return (
    <div className="mx-10 mt-20">
      <h1 className="text-3xl NotoSerif">My Profile</h1>

      <div className="flex-col sm:flex sm:flex-row place-items-start ">
        <div>
          {user?.photoURL ? (
            <>
              <div className="avatar">
                <div className="w-40 rounded-full ml-10">
                  <img src={user?.photoURL} alt="" />
                </div>
              </div>

              <Link
                to="/dashboard/updatePhoto"
                className="text-red-500 flex justify-center items-center btn btn-outline"
              >
                Upload Photo
              </Link>
            </>
          ) : (
            <>
              {/*  User input photo */}
              <form onSubmit={handleSubmit(handleAddProfilePhoto)}>
                <input
                  type="file"
                  {...register("productPhoto", {
                    required: "Product Photo is Required",
                  })}
                  className="input input-bordered w-full"
                  required
                />
                <input
                  className="btn btn-accent w-full"
                  value="Submit"
                  type="submit"
                />
              </form>
            </>
          )}
        </div>
        <div className=" shadow-xl px-5 py-10 ml-5 sm:ml-40">
          <p className="md:text-2xl text-xl  JosefinSans">
            Name: {user?.displayName}
          </p>
          <p className="md:text-xl text-lg  JosefinSans">
            Email: {user?.email}
          </p>
          <p className="md:text-xl text-lg  JosefinSans">
            {user?.emailVerified ? "Email Verified" : "Email Not Verified"}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Profile;