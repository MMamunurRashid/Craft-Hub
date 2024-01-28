import React, { useContext, useState } from "react";
import { AuthContext } from "../../../../Contexts/AuthProvider";
import { useQuery } from "@tanstack/react-query";
import Loading from "../../../../Shared/Loading/Loading";
import toast from "react-hot-toast";

const Order = () => {
  const { user } = useContext(AuthContext);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [notes, setNotes] = useState("");

  const {
    data: orders = [],
    refetch,
    isLoading,
  } = useQuery({
    queryKey: ["orders", user?.email],
    queryFn: async () => {
      const res = await fetch(
        `https://craft-hub-mamun.vercel.app/delivery-man-orders/${user?.email}`
      );
      const data = await res.json();
      return data;
    },
  });

  const handleUpdateStatus = (orderId, order) => {
    // Add your logic to update the status here
    console.log(`Updating status for order ${orderId}`);
    if (order.deliveryStatus === "assign to delivery man") {
      if (
        window.confirm(
          "Are you sure you want to Product Take by Delivery Man and way to deliver for this order?"
        )
      ) {
        fetch(`https://craft-hub-mamun.vercel.app/update-delivery-status/${orderId}`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            deliveryStatus: "Product take by delivery man, Way to deliver",
          }),
        })
          .then((res) => res.json())
          .then((data) => {
            // Handle the response
            console.log(data);
            toast.success(`Product take by delivery man`);
            refetch();
            // document.getElementById("assign-delivery-man-modal").close()
          })
          .catch((error) => {
            // Handle errors
            console.error("Error:", error);
          });
      } else {
        toast.error("Product Take by Delivery Man cancelled by the user");
        console.log(" cancelled by the user");
      }
    } else if (
      order.deliveryStatus === "Product take by delivery man, Way to deliver"
    ) {
      if (
        window.confirm(
          "Are you sure you want to Complete Delivery for this order?"
        )
      ) {
        fetch(`https://craft-hub-mamun.vercel.app/update-delivery-status/${orderId}`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ deliveryStatus: "complete" }),
        })
          .then((res) => res.json())
          .then((data) => {
            // Handle the response
            console.log(data);
            toast.success(`Complete Delivery for this order`);
            refetch();
            // document.getElementById("assign-delivery-man-modal").close()
          })
          .catch((error) => {
            // Handle errors
            console.error("Error:", error);
          });
      } else {
        toast.error("Complete Delivery for this order cancelled by the user");
        console.log(" cancelled by the user");
      }
    }
  };

  const handleOpenNotesModal = (order) => {
    setSelectedOrder(order);
    document.getElementById("notes-modal").showModal();
  };

  const handleAddNotes = (event) => {
    event.preventDefault();

    console.log(`Adding notes for order ${selectedOrder._id}: ${notes}`);

    if (
      window.confirm(
        "Are you sure you want to give a Delivery Note for this order?"
      )
    ) {
      fetch(`https://craft-hub-mamun.vercel.app/delivery-notes/${selectedOrder._id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ deliveryNotes: notes }),
      })
        .then((res) => res.json())
        .then((data) => {
          // Handle the response
          console.log(data);
          toast.success(`Delivery note added for this order`);
          refetch();
          document.getElementById("notes-modal").close();
        })
        .catch((error) => {
          // Handle errors
          console.error("Error:", error);
        });
    } else {
      toast.error("Delivery note for this order cancelled by the user");
      console.log(" cancelled by the user");
    }
  };

  const handleCashReceived = (orderId) => {
    // Add your logic for handling cash received
    console.log(`Cash received for order ${orderId}`);

    if (window.confirm("Are you sure you Received The Cash for this order?")) {
      fetch(`https://craft-hub-mamun.vercel.app/update-payment-status/${orderId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ paymentStatus: true }),
      })
        .then((res) => res.json())
        .then((data) => {
          // Handle the response
          console.log(data);
          toast.success(`Received The Cash for this order`);
          refetch();
          // document.getElementById("assign-delivery-man-modal").close()
        })
        .catch((error) => {
          // Handle errors
          console.error("Error:", error);
        });
    } else {
      toast.error("Received The Cash for this order cancelled by the user");
      console.log(" cancelled by the user");
    }
  };

  if (isLoading) {
    return <Loading />;
  }

  return (
    <div className="p-6 bg-white rounded-md shadow-md">
      <h1 className="text-3xl font-semibold mb-4">Your Orders</h1>
      <table className="min-w-full bg-white border border-gray-300">
        <thead>
          <tr>
            <th className="py-2 px-4 border-b">Order Date</th>
            <th className="py-2 px-4 border-b">Total Price</th>
            <th className="py-2 px-4 border-b">Type</th>
            <th className="py-2 px-4 border-b">Delivery Status</th>
            <th className="py-2 px-4 border-b">Address</th>
            <th className="py-2 px-4 border-b">Phone</th>

            <th className="py-2 px-4 border-b">Products</th>
            <th className="py-2 px-4 border-b">Actions</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <tr key={order._id}>
              <td className="py-2 px-4 border-b">
                {order.orderDate.split(",")[0]}
              </td>
              <td className="py-2 px-4 border-b">৳{order.totalPrice}</td>
              <td className="py-2 px-4 border-b">
                {order?.paymentStatus === true ? "Paid" : "COD"}
              </td>
              {order.deliveryStatus === "complete" ? (
                <td className="py-2 px-4 border-b text-green-600 font-semibold ">
                  {order.deliveryStatus}
                </td>
              ) : (
                <td className="py-2 px-4 border-b">{order.deliveryStatus}</td>
              )}

              <td className="py-2 px-4 border-b">
                {order?.location?.district ? (
                  <div className="py-2 px-4  flex flex-col">
                    <p>House: {order.location.houseNo}</p>
                    <p>Road: {order.location.roadNo}</p>
                    <p>Area: {order.location.area}</p> 
                    <p>District: {order.location.district}</p>
                  </div>
                ) : (
                  <td className="py-2 px-4 border-b">Area: {order.location}</td>
                )}
              </td>
              <td className="py-2 px-4 border-b">{order.phoneNumber}</td>
              <td className="py-2 px-4 border-b">
                {Array.isArray(order.products) ? (
                  <ul>
                    {order.products.map((product) => (
                      <li key={product._id} className="mb-2">
                        {product.productName} - ৳{product.productPrice} - X{" "}
                        {product.quantity}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p>
                    {order.products.productName} - ৳
                    {order.products.productPrice} - X {order.products.quantity}
                  </p>
                )}
              </td>
              <td className="py-2 px-4 border-b ">
                {order?.deliveryStatus === "complete" ? (
                  <button
                    className={`bg-blue-500 text-white px-3 py-1 rounded-md mr-2 mb-2 btn-disabled btn-sm btn`}
                  >
                    Update Status
                  </button>
                ) : (
                  <button
                    onClick={() => handleUpdateStatus(order._id, order)}
                    className={`bg-blue-500 text-white px-3 py-1 rounded-md mr-2 mb-2 `}
                  >
                    Update Status
                  </button>
                )}
                <button
                  onClick={() => handleOpenNotesModal(order)}
                  className="bg-green-500 text-white px-3 py-1 rounded-md mr-2 mb-2"
                >
                  Add Notes
                </button>
                {!order.paymentStatus && (
                  <button
                    onClick={() => handleCashReceived(order._id)}
                    className="bg-yellow-500 text-white px-3 py-1 mt-1 ml-0 rounded-md"
                  >
                    Cash Received
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Notes Modal */}
      <dialog id="notes-modal" className="modal">
        <div className="modal-box">
          <form method="dialog">
            {/* if there is a button in form, it will close the modal */}
            <button
              onClick={() => document.getElementById("notes-modal").close()}
              className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
            >
              ✕
            </button>
          </form>
          <div>
            <h1 className="text-xl text-center font-bold">
              Add Notes for Order #{selectedOrder?.orderDate}
            </h1>
            <form onSubmit={handleAddNotes} className="mt-4">
              <label className="block text-lg font-medium text-gray-700">
                Notes:
              </label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="input input-bordered w-full h-24 mt-1"
                required
              ></textarea>
              <button type="submit" className="btn btn-accent w-full mt-4">
                Add Notes
              </button>
            </form>
          </div>
        </div>
      </dialog>
    </div>
  );
};

export default Order;
