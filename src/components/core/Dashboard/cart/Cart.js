import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { BsCart2 } from "react-icons/bs";
import { NavLink, useNavigate } from 'react-router-dom';
import { removeItem } from '../../../../slices/cartSlice';
import { toast } from 'react-hot-toast';

const Cart = () => {
  const { cart } = useSelector((state) => state.cart);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleCheckout = () => {
    if (cart.length === 0) {
        toast.error("Cart is empty");
        return;
    }

    // ✅ transform cart → minimal checkout items
    const checkoutItems = cart.map(item => ({
        productId: item._id,
        name: item.name,
        price:item.price,
        size: item.size,
        color: item.color,
        quantity: item.quantity,
    }));

    sessionStorage.setItem("checkoutProducts", JSON.stringify(checkoutItems));
    navigate("/checkout");
};


  // Remove single item
  const removeItemCart = (id) => {
    try {
      dispatch(removeItem(id));
      toast.success("Item removed from cart!");
    } catch (error) {
      toast.error("Failed to remove item from cart!");
    }
  };

  return (
    <div className="flex justify-center py-4 px-3 w-full min-h-full absolute top-0 left-0">
      <div
        className={`flex flex-col gap-8 items-center relative w-full mt-8 max-w-[1000px]`}
        style={{ display: "flex", justifyContent: cart.length > 0 ? "none" : "center" }}
      >
        <div className="text-xl font-medium absolute top-0 left-0">YOUR CART</div>

        {cart.length > 0 ? (
          <div className="flex flex-wrap gap-8 mt-12">
            {/* Items */}
            <div className="flex flex-col gap-8 py-4 px-[1.5px] max-lg:w-full md:min-w-[600px]">
              {cart.map((item) => (
                <div
                  key={item._id}
                  className="flex pb-10 border-b border-b-teal-800 gap-6 max-476:gap-3 w-full relative"
                >
                  <div className="h-full flex justify-center items-center">
                    <div className="h-24 w-32 max-476:h-16 max-476:w-20 flex justify-center items-center bg-white">
                      <img
                        className="w-full h-full object-contain"
                        src={item.images[0].secure_url}
                        alt={item.name}
                      />
                    </div>
                  </div>

                  <div className="flex flex-col gap-1 max-md:gap-[1.5px]">
                    <div>{item.name}</div>
                    <div className="text-xs text-zinc-400">{item.brand}</div>
                    <div className="text-sm text-zinc-500">Color: {item.color}</div>
                    {item.size && <div className="text-sm text-zinc-500">Size: {item.size}</div>}
                    <div className="text-sm text-zinc-500">Quantity: {item.quantity}</div>

                    {/* Remove button */}
                    <button
                      onClick={() => removeItemCart(item._id)}
                      className="mt-2 px-3 py-[2px] rounded-md border border-teal-800 text-teal-800 text-xs font-extralight max-476:text-[9px]"
                    >
                      Remove
                    </button>
                  </div>

                  <div className="max-476:hidden absolute right-0">
                    <div className="text-xl font-semibold text-teal-800">₹{item.price}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* Summary */}
            <div className="flex flex-col gap-5 py-6 px-5 bg-zinc-900 max-lg:w-full max-h-[170px]">
              <div className="text-lg font-semibold">Order Summary ( {cart.length} item )</div>
              <div className="flex justify-between text-sm font-extralight">
                <div>Total</div>
                <div>
                  ₹{cart.reduce((total, item) => total + item.price * item.quantity, 0)}
                </div>
              </div>
              <button
                onClick={handleCheckout}
                className="rounded-md bg-teal-800 text-zinc-950 w-full py-2 px-2 text-center text-xs mt-2"
              >
                Checkout
              </button>
            </div>
          </div>
        ) : (
          <div className="grid place-items-center gap-4">
            <div>
              <BsCart2 className="text-9xl text-zinc-700" />
            </div>
            <div className="font-semibold text-xl">Your cart is empty</div>
            <NavLink to={"/"} className="text-teal-800 font-semibold">
              continue shopping
            </NavLink>
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;
