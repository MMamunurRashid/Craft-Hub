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
            .then(() => {})
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
              <div className="flex flex-col items-center justify-center gap-5">
              <div className="avatar">
                <div className="w-40 rounded ">
                  <img src={user?.photoURL} alt="" />
                </div>
              </div>

              <button
                className="btn"
                onClick={() =>
                  document.getElementById("my_modal_2").showModal()
                }
              >
                Upload Photo
              </button>
              </div>
            </>
          ) : (
            <>
              <button
                className="btn"
                onClick={() =>
                  document.getElementById("my_modal_2").showModal()
                }
              >
                Upload Photo
              </button>
              
            </>
          )}
          <dialog id="my_modal_2" className="modal">
                <div className="modal-box">
                  <h1 className="text-xl mb-10">Upload your new profile picture here</h1>
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
                      className="btn btn-accent w-full mt-5"
                      value="Submit"
                      type="submit"
                    />
                  </form>
                </div>
                <form method="dialog" className="modal-backdrop">
                  <button>close</button>
                </form>
              </dialog>
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
