import { apiConnect } from "./apiConnect";
import toast from "react-hot-toast";

const addProduct = (formData, token, dispatch) => {
    return async () => {
        const toastId = toast.loading('Loading...');
        try {
            const response = await apiConnect(
                'post',
                'product/new',
                formData,
                {
                    "Content-Type": "multipart/form-data",
                    Authorization: `berear ${token}`, // Corrected typo
                }
            );
            toast.success('Product added successfully', {
                id: toastId,
            });
            return response; // Optional: return response if needed
        } catch (err) {
            console.error('Error response:', err.response || err); // Detailed logging
            toast.error(`Error: ${err.response?.data?.message || err.message || 'Something went wrong'}`, {
                id: toastId,
            });
        }
    }
}

export { addProduct }
