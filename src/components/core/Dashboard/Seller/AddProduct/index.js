import React from 'react'
import ProductForm from './ProductInformation/ProductForm'
import PublishSteps from '../PublishSteps'
import { useSelector } from 'react-redux'
import AddAttributes from "../AddAttributes"
import SaveProductChanges from '../SaveProductChanges'

const AddProduct = () => {
  const {step,productType}=useSelector((state)=>state.product)
  return (
    <div className=' flex justify-evenly max-lg:flex-col'>
      <div className='flex flex-col lg:order-2 justify-center  lg:items-center lg:h-[400px] lg:sticky lg:top-[60px]  lg:w-1/2'>
      <div className=' lg:text-3xl md:text-2xl max-md:text-2xl font-bold mb-8'>Add Product</div>
      <div className=" my-2 mb-10"><PublishSteps /></div>
      </div>
      {step===1&&<div className=' lg:w-1/2'><ProductForm/></div>}
      {step===2 && productType==="property-product"?<div className=' lg:w-1/2'><AddAttributes/></div>:null}
      {(step===2 && productType==="simple-product") || step===3?<div className=' lg:w-1/2'><SaveProductChanges/></div>:null}
      
    </div>
  )
}

export default AddProduct
