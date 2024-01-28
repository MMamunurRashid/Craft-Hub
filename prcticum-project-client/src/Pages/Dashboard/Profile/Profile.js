import React from "react";
import { useContext } from "react";
import { AuthContext } from "../../../Contexts/AuthProvider";
import "../../../Font/Font.css";
import { BounceLoader } from "react-spinners";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { useQuery } from "@tanstack/react-query";
import { MdEditLocationAlt } from "react-icons/md";

const Profile = () => {
  const { user, loading, updateUserProfile } = useContext(AuthContext);
  // console.log(user);
  const navigate = useNavigate();
  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm();

  const {
    data: users = [],
    refetch,
    isLoading,
  } = useQuery({
    queryKey: ["users", user.email],
    queryFn: async () => {
      const res = await fetch(
        `https://craft-hub-mamun.vercel.app/user-profile?email=${user.email}`
      );
      const data = await res.json();
      // console.log(data);
      return data;
    },
  });
  // console.log(users);

  // if loading
  if (loading) {
    return (
      <div className="flex justify-center items-center w-full h-screen">
        <BounceLoader
          color="#d63636"
          cssOverride={{}}
          loading
          size={150}
          speedMultiplier={1}
        />
      </div>
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

  const handleUpdateAddress = (event) => {
    event.preventDefault();
    const form = event.target;
    const roadNo = form.road.value;
    const houseNo = form.house.value;
    const area = form.area.value;
    const post = form.post.value;
    const district = form.district.value;

    const address = {
      roadNo: roadNo,
      houseNo: houseNo,
      area: area,
      post: post,
      district: district,
    };
    fetch(`https://craft-hub-mamun.vercel.app/users/${users._id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ address: address }),
    })
      .then((res) => res.json())
      .then((data) => {
        // Handle the response
        console.log(data);
        toast.success(`Your address stored successfull!`);
        refetch();
        document.getElementById("address-modal").close();
      })
      .catch((error) => {
        // Handle errors
        console.error("Error:", error);
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
              <h1 className="text-xl mb-10">
                Upload your new profile picture here
              </h1>
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
        <div className="shadow-xl px-5 py-10 ml-5 sm:ml-40 w-2/3">
          <table className="w-full">
            <tbody>
              <tr>
                <td className="md:text-2xl text-xl JosefinSans">Name:</td>
                <td className="md:text-2xl text-xl JosefinSans">
                  {user?.displayName}
                </td>
              </tr>
              <tr>
                <td className="md:text-xl text-lg JosefinSans">Email:</td>
                <td className="md:text-xl text-lg JosefinSans">
                  {user?.email}
                </td>
              </tr>
              <tr>
                <td className="md:text-xl text-lg JosefinSans">Role:</td>
                <td className="md:text-xl text-lg JosefinSans">
                  {users?.role}
                </td>
              </tr>
              <tr>
                <td className="md:text-xl text-lg JosefinSans">
                  Phone Number:
                </td>
                <td className="md:text-xl text-lg JosefinSans">
                  {users?.mobileNumber}
                </td>
              </tr>
              <tr>
                <td className="md:text-xl text-lg JosefinSans">Address:</td>
                <td className="md:text-xl text-lg JosefinSans">
                  {users?.address ? (
                    <div className="flex justify-between items-center">
                      <div>
                      <p>House No: {users.address.houseNo}</p>
                      <p>Road No: {users.address.roadNo}</p>
                      <p>Area: {users.address.area}</p>
                      <p>Post: {users.address.post}</p>
                      <p>District: {users.address.district}</p>
                      </div>
                      <div>
                        <MdEditLocationAlt
                          className="w-8 h-8 cursor-pointer"
                          onClick={() =>
                            document.getElementById("address-modal").showModal()
                          }
                        />
                      </div>
                    </div>
                  ) : (
                    <div className="flex justify-between">
                     <p className="text-xl"> No Address</p>
                    <div>
                        <MdEditLocationAlt
                          className="w-8 h-8 cursor-pointer"
                          onClick={() =>
                            document.getElementById("address-modal").showModal()
                          }
                        />
                      </div>
                    </div>
                  )}
                </td>
              </tr>
            </tbody>
          </table>

          <dialog id="address-modal" className="modal">
            <div className="modal-box ">
              <form method="dialog">
                {/* if there is a button in form, it will close the modal */}
                <button className="btn btn-md btn-circle btn-ghost absolute right-2 top-2">
                  ✕
                </button>
              </form>
              <div>
                <form onSubmit={handleUpdateAddress}>
                  <label
                    htmlFor="address"
                    className="block text-lg font-medium text-gray-700"
                  >
                    Enter your Address bellow:
                  </label>

                  <label className="label">
                    <span className="label-text">House Number</span>
                  </label>
                  <input
                    type="text"
                    name="house"
                    placeholder="House No"
                    className="input input-bordered w-full mb-1"
                  />

                  <label className="label">
                    <span className="label-text">Road Number</span>
                  </label>
                  <input
                    type="text"
                    name="road"
                    placeholder="Road No"
                    className="input input-bordered w-full mb-1"
                  />
                  <label className="label">
                    <span className="label-text">
                      Area
                      <small className="text-red-500 text-[20px]">*</small>
                    </span>
                  </label>
                  <input
                    type="text"
                    name="area"
                    required
                    placeholder="Area"
                    className="input input-bordered w-full mb-1"
                  />
                  <label className="label">
                    <span className="label-text">Post </span>
                  </label>
                  <input
                    type="text"
                    name="post"
                    placeholder="Post"
                    className="input input-bordered w-full mb-1"
                  />
                  <label className="label">
                    <span className="label-text">
                      District
                      <small className="text-red-500 text-[20px]">*</small>
                    </span>
                  </label>
                  <input
                    type="text"
                    name="district"
                    required
                    placeholder="District"
                    className="input input-bordered w-full mb-1"
                  />

                  <button className="btn btn-accent w-full mt-5" type="submit">
                    Update Address
                  </button>
                </form>
              </div>
            </div>
          </dialog>
        </div>
      </div>
    </div>
  );
};

export default Profile;
