import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { cancelOrder, getMyOrders } from "../../../../oprations/orderApi";
import "../../../../App.css";
import { useNavigate } from "react-router";

const FILTERS = ["All", "Pending", "Ordered", "Delivered", "Cancelled"];

const MyOrder = () => {
  const [orders, setOrders] = useState([]);
  const token = JSON.parse(sessionStorage.getItem("token"));
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState("All");
  const navigate=useNavigate();

  useEffect(() => {
    const fetchOrders = async () => {
      const data = await getMyOrders(token)();
      if (data?.success) {
        setOrders(data.orders);
      }
      setLoading(false);
    };
    fetchOrders();
  }, [token]);

  const handleCancel = async (orderId, productId) => {
    const res = await cancelOrder(token, orderId, productId)();
    if (res?.success) {
      setOrders((prev) =>
        prev.map((o) =>
          o._id === orderId ? { ...o, status: "Cancelled" } : o
        )
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
      <h2 className="text-xl font-semibold mb-4">My Orders</h2>

      {/* Filter Bar */}
      <div className="flex gap-3 mb-6 overflow-auto hide-scrollbar">
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
            {filter}
          </button>
        ))}
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
                    src={
                      order.product?.images?.[0]?.secure_url || "/no-image.png"
                    }
                    alt={order.product?.name}
                    className="w-16 h-16 object-cover rounded"
                  />
                </div>

                <div className="flex max-md:flex-col max-md:w-full gap-4">
                  <div className="flex flex-col gap-1">
                    <p className="font-medium">{order.product?.name}</p>
                    <p className="text-sm text-zinc-400">
                      Price: ₹{order.orderPrice} | Quantity: {order.quantity}
                    </p>
                    <p className="text-sm text-zinc-400">
                      Status:{" "}
                      <span className="font-semibold">{order.status}</span>
                    </p>
                    <p className="text-xs text-zinc-500">{formattedDate}</p>
                  </div>
                </div>

                {/* Cancel button for customer */}
                {(order.status === "Pending" || order.status === "Ordered")?
                  <div className="flex flex-col max-md:w-full gap-2 md:ml-auto">
                    <button
                      onClick={() =>
                        handleCancel(order._id, order.product?._id)
                      }
                      className="px-3 py-1 bg-zinc-700 text-white rounded hover:bg-zinc-600"
                    >
                      Cancel
                    </button>
                  </div>:<div className="flex flex-col max-md:w-full gap-2 md:ml-auto">
                    <button
                      onClick={() =>
                        navigate(`/product/${order?.product?._id}`)
                      }
                      className="px-3 py-1 bg-teal-500 text-zinc-950 rounded hover:bg-teal-600"
                    >
                      Add Review
                    </button>
                  </div>
                }
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default MyOrder;
