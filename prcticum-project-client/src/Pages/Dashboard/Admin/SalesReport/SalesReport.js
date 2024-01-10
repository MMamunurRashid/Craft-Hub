import React, { useContext, useState } from "react";
import { AuthContext } from "../../../../Contexts/AuthProvider";
import { useQuery } from "@tanstack/react-query";
import { useNavigation } from "react-router-dom";
import { BounceLoader } from "react-spinners";
import { useForm } from "react-hook-form";
import { PDFDownloadLink } from "@react-pdf/renderer";
import PDF from "./PDF.js";

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
  let totalAmount = 0;
  let totalProducts = 0;
  sales.forEach((data) => {
    totalAmount += data.totalPrice;

    if (Array.isArray(data.products)) {
      totalProducts += data.products.length;
    } else if (data.products && typeof data.products === "object") {
      totalProducts += 1;
    }
  });
  const roundedTotalAmount = totalAmount.toFixed(2);

  const handleSelectChange = (event) => {
    const selectedOption = event.target.value;
    console.log(selectedOption);
    setSelectedValue(selectedOption);
    refetch();
  };

  //options
  const options = ["Today", "Yesterday", "This Month", "Last Month"];

  return (
    <div className="mx-10">
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
            <p className="text-xl">
              You searched for {selectedValue} Total No. of paid orders:{" "}
              {sales?.length}
            </p>
          </div>
          <div className="mt-5">
            <p className="text-xl">Total Sales: {roundedTotalAmount}৳</p>
          </div>
          <div className="mt-5">
            <p className="text-xl">
              Total No. of Sell Product: {totalProducts}
            </p>
          </div>
        </>
      )}

      <PDFDownloadLink
        document={<PDF option={selectedValue} salesData={sales} />}
        filename="Sales_Report.pdf"
      >
        {({ loading }) =>
          loading ? (
            <button>Loading Document...</button>
          ) : (
            <button className="btn btn-primary mt-10">Download as PDF</button>
          )
        }
      </PDFDownloadLink>
    </div>
  );
};

export default SalesReport;
