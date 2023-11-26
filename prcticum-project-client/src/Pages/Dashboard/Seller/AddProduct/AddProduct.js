import { useQuery } from "@tanstack/react-query";
import React, { useContext } from "react";
import { useForm } from "react-hook-form";
import { AuthContext } from "../../../../Contexts/AuthProvider";
import toast from "react-hot-toast";
import {  useNavigate } from "react-router-dom";

const AddProduct = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm();

  const {
    data: categories = [],
    refetch,
    isLoading,
  } = useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const res = await fetch("http://localhost:5000/categories");
      const data = await res.json();
      console.log(data);
      return data;
    },
  });

  const imgbbKey = "035fa433d4769de53906a7872698cbac";
  const handleAddProduct = (data) => {
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
        // console.log(imgData);
        if (imgData.success) {
          // console.log(imgData.data.url);
          const product = {
            postDate: new Date(),
            name: user.displayName,
            sellerEmail: user.email,
            productImage: imgData.data.url,
            productName: data.productName,
            productPrice:  parseInt(data.price),
            productCategory: data.category,
            availableQuantity:data.quantity,
            ProductBrand: data.brand
          };
          console.log(product);
          // save  information to the database
          fetch("http://localhost:5000/product", {
            method: "POST",
            headers: {
              "content-type": "application/json",
            },
            body: JSON.stringify(product),
          })
            .then((res) => res.json())
            .then((data) => {
              // console.log(data);
              toast.success(`Product added successfully !!!`);
              navigate("/dashboard/my-product");
            });
        }
      });
  };
  return (
    <div>
      <div>
        <h1 className="text-center text-2xl font-serif font-semibold">
          Add your new product
        </h1>
      </div>
      <form onSubmit={handleSubmit(handleAddProduct)} className=" mt-10 mx-3">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div>
            <label className="label">
              <span className="label-text">Select a Category of Product <small className='text-red-500 text-[20px]'>*</small></span>
            </label>
            <select
              {...register("category", {required: "Product Name is Required",})}
              className="select select-bordered w-full"
            >
              {categories.map((cat) => (
                <option selected value={cat.categories_id} key={cat._id}>
                  {cat.name}
                </option>
              ))}
            </select>
            {errors.category && (
              <p className="text-red-500">{errors.category.message}</p>
            )}
          </div>

          <div>
            <label className="label">
              <span className="label-text">Product Name <small className='text-red-500 text-[20px]'>*</small></span>
            </label>
            <input
              required
              {...register("productName", {
                required: "Product Name is Required",
              })}
              type="text"
              placeholder="Product Name"
              className="input w-full input-bordered"
            />
            {errors.productName && (
              <p className="text-red-500">{errors.productName.message}</p>
            )}
          </div>
          <div>
            <label className="label">
              <span className="label-text">Product Brand</span>
            </label>
            <input
              required
              {...register("brand", {
                
              })}
              type="text"
              placeholder="Product Brand"
              className="input w-full input-bordered"
            />
            {errors.brand && (
              <p className="text-red-500">{errors.brand.message}</p>
            )}
          </div>

          <div>
            <label className="label">
              <span className="label-text">Product Price <small className='text-red-500 text-[20px]'>*</small></span>
            </label>
            <input
              required
              {...register("price", {
                required: "Price is Required",
              })}
              type="number"
              placeholder="Product Price"
              className="input w-full input-bordered"
            />
            {errors.price && (
              <p className="text-red-500">{errors.price.message}</p>
            )}
          </div>

          <div>
            <label className="label">
              <span className="label-text">Product Quantity <small className='text-red-500 text-[20px]'>*</small></span>
            </label>
            <input
              required
              {...register("quantity", {
                required: "Quantity is Required",
              })}
              type="number"
              placeholder="Product Quantity"
              className="input w-full input-bordered"
            />
            {errors.quantity && (
              <p className="text-red-500">{errors.quantity.message}</p>
            )}
          </div>


         
          <div>
            <label className="label">
              <span className="label-text">Your Name</span>
            </label>
            <input
              required
              type="text"
              placeholder="Your Name"
              defaultValue={user?.displayName}
              
              className="input w-full input-bordered"
            />
            {errors.name && (
              <p className="text-red-500">{errors.name.message}</p>
            )}
          </div>
          <div>
            <label className="label">
              <span className="label-text">Your Email <small className='text-red-500 text-[20px]'>*</small></span>
            </label>
            <input
              required
              // {...register("email", {
              //   required: "Email is Required",
              // })}
              type="email"
              placeholder="Email Address"
              defaultValue={user?.email}
              
              className="input w-full input-bordered"
            />
            {errors.email && (
              <p className="text-red-500">{errors.email.message}</p>
            )}
          </div>
         
          <div className="">
            <label className="label">
              <span className="label-text">Upload your product photo <small className='text-red-500 text-[20px]'>*</small></span>
            </label>
            <input
              type="file"
              {...register("productPhoto", {
                required: "Product Photo is Required",
              })}
              className="file-input file-input-bordered file-input-primary w-full"
              required
            />
            {errors.productPhoto && (
              <p className="text-red-500">{errors.productPhoto.message}</p>
            )}
          </div>
        </div>
        <br />
        <div className="w-1/2 m-auto">
          <input
            required
            className="btn btn-accent w-full"
            type="submit"
            value="Submit"
          />
        </div>
      </form>
    </div>
  )
};

export default AddProduct;
