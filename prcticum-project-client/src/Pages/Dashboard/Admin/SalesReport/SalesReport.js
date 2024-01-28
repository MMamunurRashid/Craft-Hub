import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../../../Contexts/AuthProvider";
import { useQuery } from "@tanstack/react-query";
import { BounceLoader } from "react-spinners";
import { useForm } from "react-hook-form";
import { PDFDownloadLink } from "@react-pdf/renderer";
import PDF from "./PDF.js";
import DatePicker from "react-datepicker";
import { format } from "date-fns";
import "react-datepicker/dist/react-datepicker.css";
import { Chart, registerables } from "chart.js";
import { Bar } from "react-chartjs-2";

// Register necessary modules
Chart.register(...registerables);

const SalesReport = () => {
  const { user } = useContext(AuthContext);
  const [selectedValue, setSelectedValue] = useState("Today");
  const [fromDate, setFromDate] = useState(null);
  const [toDate, setToDate] = useState(null);

  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm();

  const handleFromDateChange = (date) => {
    setFromDate(date);
    // Ensure toDate is not before fromDate
    setToDate((prevToDate) => (prevToDate < date ? date : prevToDate));
  };

  const handleToDateChange = (date) => {
    // Ensure toDate is not before fromDate
    setToDate(date < fromDate ? fromDate : date);
  };

  // Format date in the custom format
  const formatDate = (date) => format(date, "MM/dd/yyyy");
  const date1 = fromDate ? formatDate(fromDate) : "";
  const date2 = toDate ? formatDate(toDate) : "";

  const {
    data: sales = [],
    refetch,
    isLoading,
  } = useQuery({
    queryKey: ["sales", user?.email, date1, date2],
    queryFn: async () => {
      const res = await fetch(
        `https://craft-hub-mamun.vercel.app/sales-report-admin?email=${user?.email}&fromDate=${date1}&toDate=${date2}`,
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

  const productMap = new Map();
  const productList = [];
  productMap.forEach((count, product) => {
    productList.push({ product, count });
  });

  const chunkSize = 20; // Adjust the number of items per page
  const productChunks = [];
  for (let i = 0; i < productList.length; i += chunkSize) {
    productChunks.push(productList.slice(i, i + chunkSize));
  }

  const [chartData, setChartData] = useState(null);

  const prepareChartData = () => {
    const dailySales = {};
    const dailyProductCount = {};

    sales.forEach((data) => {
      const date = format(new Date(data.orderDate), "MM/dd/yyyy");

      // Daily Sales
      if (!dailySales[date]) {
        dailySales[date] = 0;
      }
      dailySales[date] += data.totalPrice;

      // Daily Product Count
      if (!dailyProductCount[date]) {
        dailyProductCount[date] = 0;
      }
      if (Array.isArray(data.products)) {
        dailyProductCount[date] += data.products.length;
      } else if (data.products && typeof data.products === "object") {
        dailyProductCount[date] += 1;
      }
    });

    const labels = Object.keys(dailySales);
    const salesDataValues = Object.values(dailySales);
    const productCountDataValues = Object.values(dailyProductCount);

    setChartData({
      labels,
      datasets: [
        {
          label: "Daily Sales",
          data: salesDataValues,
          backgroundColor: "#3490dc",
          borderColor: "#3490dc",
          borderWidth: 1,
        }
      ],
    });
  };

  useEffect(() => {
    prepareChartData();
  }, [sales]);

  const options = {
    scales: {
      y: {
        type: "linear",
        position: "left",
      },
      x: {
        type: "category",
        position: "bottom",
      },
    },
  };

  const [productSalesChartData, setProductSalesChartData] = useState(null);

  const prepareProductSalesChartData = () => {
    const productSalesCount = {};

    sales.forEach((data) => {
      if (Array.isArray(data.products)) {
        data.products.forEach((product) => {
          const productName = product.productName;

          if (!productSalesCount[productName]) {
            productSalesCount[productName] = 0;
          }

          productSalesCount[productName] += product.quantity || 1;
        });
      } else if (data.products && typeof data.products === "object") {
        const productName = data.products.productName;

        if (!productSalesCount[productName]) {
          productSalesCount[productName] = 0;
        }

        productSalesCount[productName] += data.products.quantity || 1;
      }
    });

    const sortedProductSalesCount = Object.entries(productSalesCount)
      .sort(([, a], [, b]) => b - a)
      .reduce((r, [k, v]) => ({ ...r, [k]: v }), {});

    const labels = Object.keys(sortedProductSalesCount);
    const productCountDataValues = Object.values(sortedProductSalesCount);

    setProductSalesChartData({
      labels,
      datasets: [
        {
          label: "Product Sales Count",
          data: productCountDataValues,
          backgroundColor: "#4caf50",
          borderColor: "#4caf50",
          borderWidth: 1,
        },
      ],
    });
  };

  useEffect(() => {
    prepareProductSalesChartData();
  }, [sales]);

  const productSalesChartOptions = {
    scales: {
      y: {
        type: "linear",
        position: "left",
      },
      x: {
        type: "category",
        position: "bottom",
      },
    },
  };

  // table total price
  const totalPrice = sales.reduce((total, data) => total + data.totalPrice, 0);
  return (
    <div className="mx-10">
      <h1 className="text-center text-xl md:text-3xl BerkshireSwash mb-5">
        Sales Report For Admin
      </h1>
      <p>Please Select Date that and To Date that's sales report you want.</p>

      <form onSubmit={handleSubmit(refetch)} className="space-y-4">
        <div className="flex space-x-4">
          <div className="w-1/2">
            <label
              htmlFor="fromDate"
              className="block text-sm font-medium text-gray-700"
            >
              From Date
            </label>
            <DatePicker
              selected={fromDate}
              onChange={handleFromDateChange}
              maxDate={new Date()}
              className="mt-1 p-2 border rounded-md w-full"
            />
            {errors.fromDate && (
              <p className="text-red-500 text-sm">{errors.fromDate.message}</p>
            )}
          </div>
          <div className="w-1/2">
            <label
              htmlFor="toDate"
              className="block text-sm font-medium text-gray-700"
            >
              To Date
            </label>
            <DatePicker
              selected={toDate}
              onChange={handleToDateChange}
              maxDate={new Date()}
              className="mt-1 p-2 border rounded-md w-full"
            />
            {errors.toDate && (
              <p className="text-red-500 text-sm">{errors.toDate.message}</p>
            )}
          </div>
        </div>

        <div>
          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded-md"
          >
            Submit
          </button>
        </div>
      </form>

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
          {sales?.length ? (
            <div className="mt-5">
              <p className="text-xl">
                You Requested for {date1} to {date2} sales report
              </p>
              <div className="mt-8">
                <h2 className="text-xl font-bold mb-4">Sales Data</h2>
                <table className="min-w-full bg-white border border-gray-300">
                  <thead>
                    <tr>
                      <th className="py-2 px-4 border-b">Order ID</th>
                      <th className="py-2 px-4 border-b">Customer Name</th>
                      <th className="py-2 px-4 border-b">Total Price</th>
                      <th className="py-2 px-4 border-b">Products</th>
                      <th className="py-2 px-4 border-b">Order Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sales.map((data) => (
                      <tr key={data.orderId}>
                        <td className="py-2 px-4 border-b">{data._id}</td>
                        <td className="py-2 px-4 border-b">{data.userName}</td>
                        <td className="py-2 px-4 border-b">
                          {data.totalPrice.toFixed(2)}৳
                        </td>
                        <td className="py-2 px-4 border-b">
                          {Array.isArray(data.products) ? (
                            data.products.map((product) => {
                              const quantity = product.quantity || 1;
                              return (
                                <div key={product.productName}>
                                  {`${product.productName} X${quantity}`}
                                </div>
                              );
                            })
                          ) : data.products ? (
                            // Assuming that quantity is a property of data.products
                            <div key={data.products.productName}>
                              {`${data.products.productName} X${
                                data.products.quantity || 1
                              }`}
                            </div>
                          ) : (
                            "N/A"
                          )}
                        </td>
                        <td className="py-2 px-4 border-b">
                          {formatDate(data.orderDate)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  {/* Add a row for total price at the bottom */}
                  <tfoot>
                    <tr>
                      <td className="py-2 px-4 border-t font-bold" colSpan="2">
                        Total Sales
                      </td>
                      <td className="py-2 px-4 border-t font-bold">
                        {totalPrice.toFixed(2)}৳
                      </td>
                      <td
                        className="py-2 px-4 border-t font-bold"
                        colSpan="2"
                      ></td>
                    </tr>
                    <tr>
                      <td className="py-2 px-4 border-t font-bold" colSpan="2">
                        Total Orders
                      </td>
                      <td className="py-2 px-4 border-t font-bold">
                        {sales?.length}
                      </td>
                      <td
                        className="py-2 px-4 border-t font-bold"
                        colSpan="2"
                      ></td>
                    </tr>
                    <tr>
                      <td className="py-2 px-4 border-t font-bold" colSpan="2">
                        Total Sales Products
                      </td>
                      <td className="py-2 px-4 border-t font-bold">
                        {totalProducts}
                      </td>
                      <td
                        className="py-2 px-4 border-t font-bold"
                        colSpan="2"
                      ></td>
                    </tr>
                  </tfoot>
                </table>
                <PDFDownloadLink
                  document={
                    <PDF fromDate={date1} toDate={date2} salesData={sales} />
                  }
                  filename="Sales_Report.pdf"
                >
                  {({ loading }) =>
                    loading ? (
                      <button>Loading Document...</button>
                    ) : (
                      <button className="btn btn-primary my-10">
                        Download as PDF
                      </button>
                    )
                  }
                </PDFDownloadLink>
              </div>

              {chartData && (
        <div className="mt-8">
          <h2 className="text-xl font-bold mb-4">Daily Sales and Product Count Chart</h2>
          {/* Instantiate Chart class with 'new' keyword */}
          <Bar
            data={chartData}
            options={options}
            type="bar"
          />
        </div>
      )}
      
      {productSalesChartData && (
        <div className="mt-8">
          <h2 className="text-xl font-bold mb-4">Product Sales Count Chart</h2>
          <Bar
            data={productSalesChartData}
            options={productSalesChartOptions}
          />
        </div>
      )}

            </div>
          ) : (
            <>
              <p className="text-center text-xl font-semibold">
                No result found Please try again
              </p>
            </>
          )}
        </>
      )}
    </div>
  );
};

export default SalesReport;
