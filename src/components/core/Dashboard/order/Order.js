import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import {
  getSellerOrders,
  updateOrderStatus,
} from "../../../../oprations/orderApi";
import "../../../../App.css";

const ALLOWED_STATUSES = ["Ordered", "Delivered"]; // seller can only switch after Accept
const FILTERS = ["All", "Pending", "Ordered", "Delivered"]; // filter options

const Order = () => {
  const [orders, setOrders] = useState([]);
  const token = JSON.parse(sessionStorage.getItem("token"));
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState("All");

  useEffect(() => {
    const fetchOrders = async () => {
      const data = await getSellerOrders(token)();
      if (data?.success) {
        setOrders(data.orders);
        setLoading(false);
      }
    };
    fetchOrders();
  }, [token]);

  const handleStatusChange = async (orderId, status, currentStatus) => {
    if (currentStatus === "Delivered") {
      toast.error("Delivered orders cannot be updated.");
      return;
    }

    const res = await updateOrderStatus(token, orderId, status)();
    if (res?.success) {
      setOrders((prev) =>
        prev
          .map((o) =>
            o._id === orderId
              ? { ...o, status: res.order?.status || status }
              : o
          )
          // hide cancelled orders from seller side
          .filter((o) => o.status !== "Cancelled")
      );
    }
  };

  const filteredOrders =
    activeFilter === "All"
      ? orders
      : orders.filter((o) => o.status === activeFilter);

  if (loading) {
    return (
      <div
        className="absolute top-0 left-0 grid place-items-center h-full w-full bg-zinc-950"
        style={{ zIndex: 1000 }}
      >
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold mb-4">All Orders</h2>

      {/* Filter Bar */}
      <div className="flex gap-3 mb-6 overflow-auto w-full hide-scrollbar">
        <div className=" w-full flex gap-3 min-w-[450px]">
{FILTERS.map((filter) => (
          <button
            key={filter}
            onClick={() => setActiveFilter(filter)}
            className={`px-4 py-1 rounded-md ${
              activeFilter === filter
                ? "bg-teal-600 text-white"
                : "bg-zinc-700 text-zinc-300 hover:bg-zinc-600"
            }`}
          >
            {filter=="Pending"?"Order Requests":filter}
          </button>
        ))}
        </div>
        
      </div>

      {filteredOrders.length === 0 ? (
        <p>No {activeFilter === "All" ? "" : activeFilter} orders found.</p>
      ) : (
        <div className="space-y-4">
          {filteredOrders.map((order) => {
            const formattedDate = new Date(order.createdAt).toLocaleString(
              "en-US",
              {
                year: "numeric",
                month: "short",
                day: "numeric",
                hour: "numeric",
                minute: "numeric",
                hour12: true,
              }
            );

            return (
              <div
                key={order._id}
                className="p-4 bg-zinc-800 rounded-md flex max-md:flex-col flex-wrap gap-5 items-center"
              >
                <div className="flex max-md:w-full">
                  <img
                    src={order.product?.images[0]?.secure_url || "/no-image.png"}
                    alt={order.product?.name}
                    className="w-16 h-16 object-cover rounded"
                  />
                </div>

                <div className="flex max-md:flex-col max-md:w-full gap-4">
                  <div className="flex flex-col gap-1">
                    <p className="font-medium">{order.product?.name}</p>
                    <p className="text-sm text-zinc-400">
                      Buyer: {order.address?.fullname || "Unknown"}
                    </p>
                    <p className="text-sm text-zinc-400">
                      Price: ₹{order.orderPrice} | Quantity: {order.quantity}
                    </p>
                    <p className="text-sm text-zinc-400">
                      Current Status:{" "}
                      <span className="font-semibold">{order.status}</span>
                    </p>
                    <p className="text-xs text-zinc-500">{formattedDate}</p>
                  </div>
                </div>

                {/* Seller Actions */}
                <div className="flex flex-col max-md:w-full gap-2 md:ml-auto">
                  {order.status === "Pending" ? (
                    <div className="flex gap-2">
                      <button
                        onClick={() =>
                          handleStatusChange(order._id, "Ordered", order.status)
                        }
                        className="px-3 py-1 bg-teal-600 text-white rounded hover:bg-teal-500"
                      >
                        Accept
                      </button>
                      <button
                        onClick={() =>
                          handleStatusChange(order._id, "Cancelled", order.status)
                        }
                        className="px-3 py-1 bg-zinc-600 text-white rounded hover:bg-zinc-500"
                      >
                        Cancel
                      </button>
                    </div>
                  ) : order.status !== "Delivered" ? (
                    <select
                      value={order.status}
                      onChange={(e) =>
                        handleStatusChange(
                          order._id,
                          e.target.value,
                          order.status
                        )
                      }
                      className="bg-zinc-700 outline-none cursor-pointer max-w-[120px] text-white py-1 px-2 rounded"
                    >
                      {ALLOWED_STATUSES.map((s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <span className="text-teal-500 font-semibold">Delivered</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Order;
