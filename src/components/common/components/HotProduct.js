import React, { useState } from 'react';
import { FaCaretSquareLeft } from 'react-icons/fa';
import { NavLink } from 'react-router-dom';
import { PiShoppingCartSimpleFill } from "react-icons/pi";
import { applicationBaseUrl } from '../../../data/applicationUrls';

const HotProduct = ({ id, name, desc, price, thumbnail }) => {
    return (
        <NavLink
            to={`${applicationBaseUrl}/product/${id}`}
            className='my-2 mx-[6px] 
  w-[calc(95%-12px)]       /* default: below md → 2 items per row (bigger) */
  476:w-[calc(43.33%-12px)]
  md:w-[calc(33.33%-12px)] /* md screens → 3 items per row (normal) */
  lg:w-[calc(25%-12px)]    /* lg screens → 4 items per row */
  xl:w-[calc(20%-12px)]    /* xl screens → 5 items per row */
  2xl:w-[calc(16.66%-12px)]/* 2xl screens → 6 items per row */
  flex flex-col hover:h-full items-center shadow-md overflow-hidden transition-all group'
        >
            <div className=' w-full  pb-3 '>
                <div className={` pb-[120%] group relative w-full h-full  mb-2  overflow-hidden  bg-gradient-to-br from-slate-800 via-slate-950 to-sky-500 rounded-md group hover:after:absolute hover:after:top-0 `}>
                    {/* <img src='https://image01.realme.net/general/20230512/1683873836923.png?width=1440&height=1440&size=544990' alt='img'
              className=' w-full'/> */}
                    <div className=' h-full w-full absolute top-1/2  left-1/2  -translate-x-1/2 -translate-y-1/2 flex flex-col justify-center items-center gap-3'>
                        <h2 className=' group-hover:hidden drop-shadow-sm text-center  text-2xl  font-bold text-white max-md:text-xl w-full'>{name}</h2>
                        <img src={thumbnail} alt='img'
                            className=' w-4/5     object-contain opacity-100 transition-all group-hover:w-full group-hover:h-full group-hover:object-cover' />
                             
                    <p className='flex group-hover:hidden  text-center justify-center w-full items-center text-base text-zinc-100 font-semibold max-md:text-sm'>Starting at <span className=' ml-1 font-bold text-xl max-md:text-lg'>₹{price}</span></p>
                    </div>

                   
                    <div className=" absolute w-full h-full grid place-items-center  bg-black opacity-0 bg-black/50 group-hover:opacity-100">
                        <PiShoppingCartSimpleFill className=' lg:text-3xl md:text-2xl max-md:text-2xl' />
                    </div>

                </div>

            </div>
            {/*  <div className=' w-full py-[4px] px-2 text-sm font-semibold text-center text-zinc-950  bg-sky-500 transition-all'>
            Buy Now
          </div> */}


        </NavLink>
    )
}

export default HotProduct
