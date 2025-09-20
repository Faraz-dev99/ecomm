import React, { useState } from 'react';
import { FaCaretSquareLeft } from 'react-icons/fa';
import { NavLink } from 'react-router-dom';
import { PiShoppingCartSimpleFill } from "react-icons/pi";
import { applicationBaseUrl } from '../../../data/applicationUrls';

const Product = ({id,name,desc,price,thumbnail,averageRating,totalReviews}) => {
   const stars = Array(5).fill(0);
 
  return (
    <NavLink to={`${applicationBaseUrl}/product/${id}`} className='my-2 mx-[18px] max-476:mx-[12px] w-[calc(16.66%-36px)] max-476:w-[calc(50%-24px)] max-md:w-[calc(33.33%-36px)] max-xl:w-[calc(20%-36px)] max-2xl:w-[calc(16.66%-36px)]   flex flex-col hover:h-full items-center shadow-md overflow-hidden   transition-all group' >
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
      <div className='flex justify-center  flex-col '>
        
        <p className='flex items-center text-lg text-zinc-100 font-medium max-md:text-base'>₹{price}</p>
        <div className=' flex gap-1 text-base mb-1'>
        {stars.map((_, i) => (
          <span
            key={i}
            className={
              i < Math.round(averageRating) ? "text-teal-500" : "text-zinc-400"
            }
          >
            ★
          </span>
        ))}
      </div>
        <h2 className=' text-sm font-normal text-zinc-400 max-md:text-xs line-clamp-2'>{name}</h2>
       
      </div>
      
      </div>
     {/*  <div className=' w-full py-[4px] px-2 text-sm font-semibold text-center text-zinc-950  bg-sky-500 transition-all'>
        Buy Now
      </div> */}
      
      
    </NavLink>
  );
}

export default Product;
