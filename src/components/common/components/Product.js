import React, { useState } from 'react';
import { FaCaretSquareLeft } from 'react-icons/fa';
import { NavLink } from 'react-router-dom';
import { PiShoppingCartSimpleFill } from "react-icons/pi";

const Product = ({id,name,desc,price,thumbnail}) => {
 
  return (
    <NavLink to={`product/${id}`} className='my-2 mx-[6px] w-[calc(16.66%-12px)] max-476:w-[calc(50%-12px)] max-md:w-[calc(33.33%-12px)] max-xl:w-[calc(20%-12px)] max-2xl:w-[calc(13.66%-12px)]   flex flex-col hover:h-full items-center shadow-md overflow-hidden   transition-all group' >
      <div className=' w-full  pb-3 '>
      <div className={` pb-[120%] group relative w-full  mb-2  overflow-hidden bg-white rounded-md hover:after:absolute hover:after:top-0 `}>
        {/* <img src='https://image01.realme.net/general/20230512/1683873836923.png?width=1440&height=1440&size=544990' alt='img'
          className=' w-full'/> */}
          
          <img src={thumbnail} alt='img'
          className=' w-4/5  h-4/5 absolute top-1/2  left-1/2  -translate-x-1/2 -translate-y-1/2 object-contain opacity-100 transition-all group-hover:w-full group-hover:h-full group-hover:object-cover'/>
          <div className=" absolute w-full h-full grid place-items-center  bg-black opacity-0 bg-black/50 group-hover:opacity-100">
          <PiShoppingCartSimpleFill className=' lg:text-3xl md:text-2xl max-md:text-2xl'/>
          </div>
          
      </div>
      <div className='flex justify-center gap-1  flex-col '>
        
        <p className='flex items-center text-lg text-slate-100 font-medium max-md:text-base'>₹{price}</p>
        <h2 className=' text-sm font-normal text-slate-400 max-md:text-xs'>{name}</h2>
       
      </div>
      </div>
     {/*  <div className=' w-full py-[4px] px-2 text-sm font-semibold text-center text-slate-950  bg-sky-500 transition-all'>
        Buy Now
      </div> */}
      
      
    </NavLink>
  );
}

export default Product;
