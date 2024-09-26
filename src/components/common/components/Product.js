import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';

const Product = ({id,name,desc,price,thumbnail}) => {
 
  return (
    <NavLink to={`product/${id}`} className='my-2 border max-md:w-36 border-slate-800  flex flex-col w-44  hover:h-full items-center shadow-md overflow-hidden   transition-all group' >
      <div className=' w-full  pb-3 '>
      <div className=' h-48 max-md:h-44  mb-2  overflow-hidden'>
        {/* <img src='https://image01.realme.net/general/20230512/1683873836923.png?width=1440&height=1440&size=544990' alt='img'
          className=' w-full'/> */}
          <img src={thumbnail} alt='img'
          className=' w-full h-full opacity-75 transition-all hover:opacity-50 hover:scale-110 '/>
      </div>
      <div className='flex justify-center gap-1  flex-col px-2'>
        <h2 className=' text-sm font-normal text-slate-400 max-md:text-xs'>{name}</h2>
        <p className='flex items-center text-lg text-slate-100 font-medium max-md:text-base'>₹{price}</p>
      
       
      </div>
      </div>
     {/*  <div className=' w-full py-[4px] px-2 text-sm font-semibold text-center text-slate-950  bg-sky-500 transition-all'>
        Buy Now
      </div> */}
      
      
    </NavLink>
  );
}

export default Product;
