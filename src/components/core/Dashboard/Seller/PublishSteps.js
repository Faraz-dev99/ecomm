import React from 'react'
import { useSelector } from 'react-redux'

const PublishSteps = () => {
    const {productType,step}=useSelector((state)=>state.product)
  return (
    <div className=' flex flex-col relative text-sm text-slate-200 pl-5 ml-2'>

        <div className=' flex flex-col gap-6'>
        <div>Add Product Details</div>
        {productType==="property-product" && <div>Set Product Attributes</div>} 
        <div>Publish Product</div>
        </div>
       
        <div className=' absolute top-1/2 -translate-y-1/2 left-0 h-[95%] text-xs'>
            <div className=' h-full relative text-slate-100' style={{border:'0.1px solid rgb(14 165 233)'}}>

            <div className={` h-4 w-4 text-center rounded-full absolute -top-[1px] left-1/2 -translate-x-1/2 bg-sky-500 ${step===1&&" bg-white text-black"}`}>1</div>
            {productType==="property-product" && <div className={`  h-4 w-4 text-center rounded-full absolute top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2 bg-sky-500 ${step===2 && productType==="property-product"?"bg-white text-black":null}`}>2</div>}
            <div className={` h-4 w-4 text-center rounded-full absolute -bottom-[1px] left-1/2 -translate-x-1/2 bg-sky-500 ${(step===2 && productType==="simple-product") || step===3?"bg-white text-black":null}`}>{productType==="property-product"?3:2}</div>

            </div> 
        </div>
    </div>
  )
}

export default PublishSteps
