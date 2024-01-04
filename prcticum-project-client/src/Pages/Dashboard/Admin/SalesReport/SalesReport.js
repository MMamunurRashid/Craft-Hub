import React, { useContext, useState } from "react";
import { AuthContext } from "../../../../Contexts/AuthProvider";
import { useQuery } from "@tanstack/react-query";
import { useNavigation } from "react-router-dom";
import { BounceLoader } from "react-spinners";
import { useForm } from "react-hook-form";

const SalesReport = () => {
    const { user } = useContext(AuthContext);
    const [selectedValue, setSelectedValue] = useState("Today");
  
    const {
      register,
      formState: { errors },
      handleSubmit,
    } = useForm();
    const {
      data: sales = [],
      refetch,
      isLoading,
    } = useQuery({
      queryKey: ["sales", user?.email, selectedValue],
      queryFn: async () => {
        const res = await fetch(
          `http://localhost:5000/sales-report-admin?email=${user?.email}&option=${selectedValue}`,
          {
            headers: {
              authorization: `bearer ${localStorage.getItem("accessToken")}`,
            },
          }
        );
        const data = await res.json();
        console.log(data);
        return data;
      },
    });
  
    const handleSelectChange = (event) => {
      const selectedOption = event.target.value;
      console.log(selectedOption);
      setSelectedValue(selectedOption);
      refetch();
    };
  
    //options
    const options = ["Today", "Yesterday", "This Month", "Last Month"];
  
    return (
      <div>
        <h1>Total Sales</h1>
        <div onChange={handleSelectChange}>
          <label className="label">
            <span className="label-text ">Select For Total Sales</span>
          </label>
          <select
            {...register("option", {})}
            className="select select-bordered w-full"
            value={selectedValue}
          >
            {options.map((p, idx) => (
              <option value={p} key={idx}>
                {p}
              </option>
            ))}
          </select>
          {errors.option && (
            <p className="text-red-500">{errors.option.message}</p>
          )}
        </div>
  
        {isLoading ? (
          <div className="flex justify-center items-center w-full h-screen">
            <BounceLoader
              color="#d63636"
              cssOverride={{}}
              loading
              size={150}
              speedMultiplier={1}
            />
          </div>
        ) : (
          <>
            <div className="mt-5">
              <p className="text-xl">You searched for {selectedValue} Total No. of paid orders: {sales?.length}</p>
            </div>
            <div className="mt-5">
              <p className="text-xl">Total Sales: ৳</p>
            </div>
          </>
        )}
      </div>
    );
  };
  
  export default SalesReport;
  