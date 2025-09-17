import toast from "react-hot-toast";
import { apiConnect } from "./apiConnect";

// Create Review
const createReview = async (token, productId, rating, comment) => {
  const toastId = toast.loading("Submitting review...");
  try {
    const res = await apiConnect(
      "post",
      "review/createReview",
      { productId, rating, comment },
      {
          Authorization: `berear ${token}`,
          "Content-Type": "application/json",
      }
    );

    if (res.data.success) {
      toast.success("Review submitted successfully", { id: toastId });
      return res.data;
    }
  } catch (err) {
    console.error("createReview error:", err);
    toast.error(
      `${err.response?.data?.message || err.message || "Something went wrong"}`,
      { id: toastId }
    );
  }
};

// Get Reviews for Product
const getProductReviews = async (productId) => {
  try {
    const res = await apiConnect(
        "get", 
        `review/getProductReviews/${productId}`
    );
    return res.data;
  } catch (err) {
    console.error("getProductReviews error:", err);
    return null;
  }
};

export { createReview, getProductReviews };
