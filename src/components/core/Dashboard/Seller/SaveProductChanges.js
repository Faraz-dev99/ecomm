import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { addProduct, createAttributes, productStatusApi } from '../../../../oprations/productApi';
import { resetProductState } from '../../../../slices/productSlice';

const SaveProductChanges = () => {
    const {editProduct,product,productType,attributesRedux}=useSelector((state)=>state.product)
    const [productStatus,setProductStatus]=useState("Published");
    const { token } = useSelector((state) => state.auth)
    const dispatch=useDispatch();
    const saveChanges=()=>{

    }

    const saveProduct=async ()=>{
        console.log("attributeRedux and product id ",attributesRedux," ",product," and also ",product.product._id)
   
     if(productStatus==="Published" || productStatus==="Draft"){
        const productId= product.product._id
      const result=await productStatusApi(productStatus,productId, token);
      console.log("see if it's actually working and saving correctlly : ",result)
     }

    dispatch(resetProductState());
    }
  return (
    <div className='flex items-center justify-center'>
        <div className=' border border-slate-800 rounded-xl py-4 px-4 w-full flex flex-col gap-2'>
            <div className=' text-2xl font-bold mb-4'>Save Product</div>
        <div className=' flex flex-col gap-2'>
            <div className=' text-base font-medium text-slate-300'>publish this product to make available for everyone</div>
            <div className='   flex text-slate-300 text-sm'>
                <select className='outline-none text-slate-600 py-2 px-2 bg-transparent border border-slate-700 focus:border-sky-500 rounded-lg w-full' value={productStatus} onChange={(e)=>setProductStatus(e.target.value)}>
                    <option value={"Published"}>Public</option>
                    <option value={"Draft"}>Draft</option>
                </select>
            </div>
        </div>
        {editProduct?<button className=' py-2 px-6 bg-sky-500 text-slate-950  rounded-lg self-end' onClick={saveChanges}>Save Changes</button>:<button className=' py-2 px-6 bg-sky-500 text-slate-950  rounded-lg self-end' onClick={saveProduct} >Save</button>}
      
        </div>
        
    </div>
  )
}

export default SaveProductChanges
