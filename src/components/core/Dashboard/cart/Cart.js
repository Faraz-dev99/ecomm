import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { BsCart2 } from "react-icons/bs";
import { NavLink } from 'react-router-dom';
import { removeItem } from '../../../../slices/cartSlice';
import { toast } from 'react-hot-toast';

const Cart = () => {
  const { cart } = useSelector((state) => state.cart);
  const dispatch = useDispatch();
  const removeItemCart = (id) => {
    try {
      dispatch(removeItem(id)); // Dispatch the remove action
      toast.success("Item removed from cart!"); // Show success toast
    } catch (error) {
      // If error occurs, show an error toast
      toast.error("Failed to remove item from cart!");
    }
  }
  return (
    <div className=' flex  justify-center py-4 px-2 w-full min-h-full absolute top-0 left-0'>
      <div className={` flex flex-col gap-8 items-center relative  w-full mt-8  max-w-[1000px]`} style={{display:"flex",justifyContent:cart.length>0?"none":"center"}}>
        <div className='  text-xl font-medium absolute top-0 left-0'>YOUR CART</div>
        {
          cart.length > 0 ? <div className=' flex flex-wrap gap-8 mt-12'>
            <div className=' flex flex-col gap-8 py-4 px-4  max-lg:w-full md:min-w-[600px]'>
              {
                cart.map((item, index, arr) => {
                  return <div className=' flex  pb-10 border-b border-b-sky-500 gap-6 max-476:gap-3 w-full relative'>
                    <div className=' h-full flex justify-center items-center'>
                      <div className=' h-24 w-32 max-476:h-16 max-476:w-20 flex justify-center items-center bg-white'><img className=' w-full h-full object-contain' src={item.images[0].secure_url} /></div>
                    </div>

                    <div className=' flex flex-col gap-1 max-md:gap-0'>
                      <div className=' max-476:text-xs'>{item.name}</div>
                      <div className=' text-slate-400 text-xs max-476:text-[8px]'>{item.brand}</div>
                      <div className=' text-lg max-476:text-xs sm:hidden font-semibold text-sky-500'>₹{item.price}</div>

                      <div className='flex  gap-2 mt-5 max-476:mt-2'>
                       
                          <select className=' bg-transparent py-2 max-476:py-1 px-2  rounded-md border border-sky-500 text-sky-500 text-xs max-476:text-[8px] '>
                            {
                              // Generate options based on the stock
                              Array.from({ length: item.stock }, (_, i) => (
                                <option key={i + 1} value={i + 1}>
                                  {i + 1}
                                </option>
                              ))
                            }

                          </select>
                     
                        <button className=' px-2 rounded-md border border-sky-500 text-sky-500 text-xs text-[8px] ' onClick={() => removeItemCart(item._id)}>Remove</button>
                      </div>
                    </div>
                    <div className=' max-sm:hidden absolute right-0'>
                      <div className=' text-xl font-semibold text-sky-500'>₹{item.price}</div>
                    </div>
                  </div>
                })
              }
            </div>
            <div className=' flex flex-col gap-5 py-6 px-5 bg-slate-900 max-lg:w-full max-h-[170px]'>
              <div className=' text-lg font-semibold'>Order Summary ( {cart.length} item )</div>
              <div className='flex justify-between text-sm font-extralight'>
                <div>Total</div><div>₹{cart.reduce((total, item) => total + parseFloat(item.price), 0)}</div>
              </div>
              <button className=' rounded-md bg-sky-500 text-slate-950 w-full py-2 px-2 text-center text-xs mt-2'>checkout</button>
            </div>
          </div> : <div className=' grid place-items-center gap-4'>
            <div><BsCart2 className=' text-9xl text-slate-700' /></div>
            <div className=' font-semibold text-xl'>Your cart is empty</div>
            <NavLink to={"/"} className=" text-sky-500 font-semibold">continue shopping</NavLink>
          </div>
        }
      </div>


    </div>
  )
}

export default Cart
