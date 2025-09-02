import React, { useState } from 'react';
import { FaCaretSquareLeft } from 'react-icons/fa';
import { NavLink } from 'react-router-dom';
import { PiShoppingCartSimpleFill } from "react-icons/pi";
import { applicationBaseUrl } from '../../../data/applicationUrls';

const LatestProductCard = ({ id, name, desc, price, thumbnail }) => {
  return (
    <NavLink to={`${applicationBaseUrl}/product/${id}`} className='   overflow-hidden group flex flex-col gap-2'>
        <div className=' w-full h-[170px] max-md:h-[150px] transition-all duration-700 bg-white group-hover:bg-black flex justify-center items-center rounded-md'><img src={thumbnail} alt='image' className=' w-full h-full transition-all duration-700 group-hover:grayscale  object-contain'/></div>
        <div className=' flex justify-between px-3 py-1 text-lg font-semibold'>
            <p className=''>{name}</p>
            <p>₹{price}</p>
        </div>
    </NavLink>
  )
}

export default LatestProductCard
