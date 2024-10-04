import React, { useEffect, useState } from 'react'
import {Slider,Product} from '../filespath'
import '../App.css';
import { useSelector } from 'react-redux';
import { apiConnect } from '../oprations/apiConnect';

const Home = () => {
  const [loading,setLoading]=useState(true);
  const [products,setProducts]=useState([]);
  useEffect(()=>{
    const getProducts=async ()=>{
      try{
        const response=await apiConnect(
          "get",
          "product/getProducts"
        )
        if(response.data.success){
          setProducts(response?.data?.products)
          setLoading(false);
        }
        console.log(response)
      }
      catch(err){
        console.log(err)
      }
    }
    getProducts();
  },[])

  if(loading){
    return <div className=' absolute  top-0 left-0 grid place-items-center h-screen  w-full bg-gray-950' style={{zIndex:1000}}>
      <div className="spinner"></div>
    </div>
  }
  
  return (
    <div>
     { /* <div onClick={notify}>toast</div>*/ }
      <Slider />
      <div className='flex flex-col justify-center my-10 px-4'>
        <h1 className='  text-slate-200 font-bold md:text-2xl lg:text-3xl max-md:text-xl  mb-6'>All Products</h1>
        <div className=' flex flex-wrap w-full'>
          {
            products?.map((e,i)=>{
              return e.status==="Published" && <Product key={i} id={e._id} name={e.name} desc={e.description} price={e.price} thumbnail={e.images[0].secure_url } />
            })
          }
        </div>
      </div>
      
    </div>
  )
}

export default Home
