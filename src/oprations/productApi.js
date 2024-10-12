import { baseUrl } from "./api";
import { apiConnect } from "./apiConnect";
import toast from "react-hot-toast";

const addProduct = async (formData, token) => {
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
            return response.data; // Optional: return response if needed
        } catch (err) {
            console.error('Error response:', err.response || err); // Detailed logging
            toast.error(`Error: ${err.response?.data?.message || err.message || 'Something went wrong'}`, {
                id: toastId,
            });
            return null;
        }
    }


    const createAttributes = async (attributeData,productId, token) => {
        const toastId = toast.loading('Adding attributes...');
        const data={
            productId,
            type:attributeData.type
        }
        console.log("attributes data ",data)
        try {
            const response = await fetch(`${baseUrl}product/createAttributes`, { // Adjust URL as needed
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                  Authorization: `berear ${token}`, // Ensure Authorization is correctly set
                },
                body: JSON.stringify(data),
              });
          
              const result = await response.json();
      
          if (result.success) {
            toast.success('Attributes added successfully', { id: toastId })
            ;
            console.log('Attributes added:', result.productDetails);
            return result.productDetails;
          } else {
            toast.error('Failed to add attributes', { id: toastId });
            console.error('Failed to add attributes:', result.message);
            return null;
          }
        } catch (error) {
          console.error('Error adding attributes:', error);
          toast.error(`Error: ${error.message}`, { id: toastId });
          return null;
        }
      };

      const productStatusApi=async (status,productId,token)=>{
        const toastId = toast.loading('Loading..');
        const data={
            productId,
            status:status
        }
        try{
            console.log("testing the status here : ",status)
            const response=await fetch(`${baseUrl}product/productStatus`,{ // Adjust URL as needed
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                  Authorization: `berear ${token}`, // Ensure Authorization is correctly set
                },
                body: JSON.stringify(data),
              });
          
              const result = await response.json();
              if(result.success){
                status==="Published"?toast.success('product published successfully', { id: toastId }):toast.success('added to draft successfully', { id: toastId })
                
                return result.updateStatus;
              }
              else{
                toast.error('Failed to change status', { id: toastId });
              }
        }
        catch(err){
            toast.error(`Error: ${err.message}`, { id: toastId });
          return null;
        }
      }
      


export { addProduct ,createAttributes,productStatusApi}
