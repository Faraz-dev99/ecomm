import toast from "react-hot-toast";
import { apiConnect } from "./apiConnect";


const createOrder = (token, checkoutProducts, address) => {
    return async () => {
        const toastId = toast.loading('ordering...');
        try {
            console.log("checkouts:", checkoutProducts)
            const res = await apiConnect(
                "post",
                "order/createOrder",
                {
                    orderProducts: checkoutProducts,
                    address
                },
                {
                    Authorization: `berear ${token}`,
                    'Content-Type': 'application/json'
                }
            );
            if (res.data.success) {
                sessionStorage.removeItem("checkoutProducts");
                /*  navigate("/orders"); */
                toast.success('order placed successfully', {
                    id: toastId,
                });
                return res.data
            }

        } catch (err) {
            console.error(err);
             toast.error(`${err.response?.data?.message || err.message || 'Something went wrong'}`, {
                        id: toastId,
                    });
        }
    }
}

const getMyOrders = (token) => {
  return async () => {
    try {
      const res = await apiConnect(
        "get", "order/getMyOrders",
         null, {
        Authorization: `berear ${token}`,
      });
      return res.data;
    } catch (err) {
      console.error("getMyOrders error:", err);
    }
  };
};


const getSellerOrders = (token) => {
  return async () => {
    try {
      const res = await apiConnect(
        "get", 
        "order/getSellerOrders", 
        null, 
        {
        Authorization: `berear ${token}`,
      });
      return res.data;
    } catch (err) {
      console.error("getSellerOrders error:", err);
    }
  };
};

//  Update Order Status (Admin / Seller)
const updateOrderStatus = (token, orderId, status) => {
  return async () => {
    const toastId = toast.loading("updating status...");
    try {
      const res = await apiConnect(
        "post",
        `order/updateOrderStatus`,
        { status,orderId },
        {
          Authorization: `berear ${token}`,
          "Content-Type": "application/json",
        }
      );

      if (res.data.success) {
        toast.success("status updated", { id: toastId });
        return res.data;
      }
    } catch (err) {
      console.error("updateOrderStatus error:", err);
      toast.error(
        `${err.response?.data?.message || err.message || "Something went wrong"}`,
        { id: toastId }
      );
    }
  };
};

//  Cancel Order (Customer)
const cancelOrder = (token, orderId) => {
  return async () => {
    const toastId = toast.loading("cancelling...");
    try {
      const res = await apiConnect(
        "post",
        "order/cancelOrder",
        { orderId },
        {
          Authorization: `berear ${token}`,
          "Content-Type": "application/json",
        }
      );

      if (res.data.success) {
        toast.success("order cancelled", { id: toastId });
        return res.data;
      }
    } catch (err) {
      console.error("cancelOrder error:", err);
      toast.error(
        `${err.response?.data?.message || err.message || "Something went wrong"}`,
        { id: toastId }
      );
    }
  };
};
export { createOrder,getMyOrders,cancelOrder,getSellerOrders,updateOrderStatus };