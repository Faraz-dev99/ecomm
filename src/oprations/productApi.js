import { json } from "react-router";
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

//edit product 
export const updateProduct = async (formData, token) => {
  //
  const toastId = toast.loading('Loading...');
  try {
    let response = await fetch(`${baseUrl}product/updateProduct`,
      {
        method: "post",
        headers: {
          Authorization: `berear ${token}`
        }, 
        body:formData
      }
    );
    response=await response.json();
    if(response.success){
      console.log("response ",response.updatedProduct)
    toast.success('Product updated successfully', {
      id: toastId,
    });
    return response.updatedProduct; 
  }
  else{
    console.log("error ",response)
       toast.error('failed to update product',{
        id:toastId
       })
  }
    // Optional: return response if needed
  } catch (err) {
    console.error('Error response:', err.response || err); // Detailed logging
    toast.error(`Error: ${err.response?.data?.message || err.message || 'Something went wrong'}`, {
      id: toastId,
    });
    return null;
  }
}


//update attributes
const updateAttribute=async (attributeData,attributeId,token)=>{
  const toastId=toast.loading("updating attributes...");
  const update={
    attributeId,
    type:attributeData.type
  }
  try{
    const response=await fetch(`${baseUrl}product/editAttributes`,{
      method:"POST",
      headers:{
        'Content-Type':'application/json',
        Authorization:`berear ${token}`
      },
      body:JSON.stringify(update)
    })
    const result=await response.json();
    if(result.success){
      toast.success("Attribute updated successfully",{id:toastId});
      return result
    } else {
      toast.error('Failed to update attributes', { id: toastId });
      console.error('Failed to add attributes:', result.message);
      return null;
    }
  }
  catch(err){
    console.log("error is : ",err)
    toast.error(`Error4: ${err.message}`, { id: toastId });
    return null;
  }
}


const createAttributes = async (attributeData, productId, token) => {
  const toastId = toast.loading('Adding attributes...');
  const data = {
    productId,
    type: attributeData.type
  }
  console.log("attributes data ", data)
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

const productStatusApi = async (status, productId, token) => {
  const toastId = toast.loading('Loading..');
  const data = {
    productId,
    status: status
  }
  try {
    console.log("testing the status here : ", status)
    const response = await fetch(`${baseUrl}product/productStatus`, { // Adjust URL as needed
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `berear ${token}`, // Ensure Authorization is correctly set
      },
      body: JSON.stringify(data),
    });

    const result = await response.json();
    if (result.success) {
      status === "Published" ? toast.success('product published successfully', { id: toastId }) : toast.success('added to draft successfully', { id: toastId })

      return result.updateStatus;
    }
    else {
      toast.error('Failed to change status', { id: toastId });
    }
  }
  catch (err) {
    toast.error(`Error: ${err.message}`, { id: toastId });
    return null;
  }
}


//fetch categories
const fetchCategory = async () => {
      
  try {

    let response = await fetch(`${baseUrl}product/getCategories`, {
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache',
      },
      cache: 'no-store',
    });
    response = await response.json();
    if (!response.success) {
      console.log("failed")
      return
    }

    return response.categories;
  }
  catch (err) {
    console.log("err", err.response)
  }
}



export { addProduct, createAttributes,updateAttribute, productStatusApi,fetchCategory }
