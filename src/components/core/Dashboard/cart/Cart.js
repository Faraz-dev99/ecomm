import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { BsCart2 } from "react-icons/bs";
import { NavLink } from 'react-router-dom';
import { removeItem } from '../../../../slices/cartSlice';


const Cart = () => {
   const {cart}=useSelector((state)=>state.cart);
   const dispatch=useDispatch();
   const removeItemCart=(id)=>{
    dispatch(removeItem(id))
   }
  return (
    <div className=' flex justify-center py-4 px-4 w-full min-h-full absolute top-0 left-0'>
      <div className=' flex flex-col justify-center gap-8 items-center relative  w-full mt-4  max-w-[1000px]'>
      <div className=' min-w-96 text-xl font-medium self-start'>YOUR CART</div>
      {
        cart.length>0?<div className=' flex flex-wrap gap-8 '>
          <div className=' flex flex-col gap-8 py-4 px-2 bg-slate-900 max-lg:w-full'>
            {
              cart.map((item,index)=>{
                  return <div className=' flex gap-3'>
                    <div className=' h-full flex justify-center items-center'>
                    <div className=' h-24 w-32 flex justify-center items-center bg-white'><img className=' w-full h-full object-contain' src={item.images[0].secure_url}/></div>
                    </div>
                   
                    <div className=' flex flex-col gap-2'>
                      <div>{item.name}</div>
                      <div className=' text-slate-400 text-xs'>{item.brand}</div>
                      <div className='flex flex-wrap gap-2 mt-5'>
                        <button className=' py-2 px-2 rounded-md border border-sky-500 text-sky-500 text-xs '>Move to Wishlist</button>
                        <button className=' py-2 px-2 rounded-md border border-sky-500 text-sky-500 text-xs ' onClick={()=>removeItemCart(item._id)}>Remove</button>
                      </div>
                    </div>
                    <div>
                      <div className=' text-xl font-semibold text-sky-500'>₹{item.price}</div>
                    </div>
                  </div>
              })
            }
          </div>
          <div className=' flex flex-col gap-4 py-4 px-2 bg-slate-900 max-lg:w-full max-h-[150px]'>
            <div className=' text-lg font-semibold'>Order Summary ( {cart.length} item )</div>
            <div className='flex justify-between text-sm font-extralight'>
              <div>Total</div><div>₹{cart.reduce((total, item) => total + parseFloat(item.price), 0)}</div>
              </div>
              <button className=' rounded-md bg-sky-500 text-slate-950 w-full py-2 px-2 text-center text-xs mt-2'>checkout</button>
          </div>
        </div>:<div className=' grid place-items-center gap-4'>
          <div><BsCart2 className=' text-9xl text-slate-700'/></div>
          <div className=' font-semibold text-xl'>Your cart is empty</div>
          <NavLink to={"/"} className=" text-sky-500 font-semibold">continue shopping</NavLink>
        </div>
      }
      </div>

     
    </div>
  )
}

export default Cart
