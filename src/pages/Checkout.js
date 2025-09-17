import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { createOrder } from '../oprations/orderApi';
import toast from "react-hot-toast";

const Checkout = () => {
    const [checkoutProducts, setCheckoutProducts] = useState([]);
    const [address, setAddress] = useState({
        fullname: "",
        address: "",
        country: "",
        state: "",
        city: "",
        pincode: "",
        phone: ""
    });
    const [errors, setErrors] = useState({});
    const dispatch = useDispatch();
    const navigate = useNavigate();

    useEffect(() => {
        const stored = sessionStorage.getItem("checkoutProducts");
        if (stored) {
            setCheckoutProducts(JSON.parse(stored));
        }
    }, []);

    const validateForm = () => {
        let newErrors = {};
        Object.keys(address).forEach(key => {
            if (!address[key]) {
                newErrors[key] = key + " is required";
            }
        });

        if (address.phone && !/^\d{10}$/.test(address.phone)) {
            newErrors.phone = "Phone must be 10 digits";
        }

        if (address.pincode && !/^\d{5,6}$/.test(address.pincode)) {
            newErrors.pincode = "Invalid pincode";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const placeOrder = async () => {
        let token = JSON.parse(sessionStorage.getItem("token"));
        if (!validateForm()) return; // stop if invalid

        if (token) {
            const sanitizedProducts = checkoutProducts.map(p => ({
                productId: p.productId,
                size: p.size,
                color: p.color,
                quantity: p.quantity,
            }));
            dispatch(createOrder(token, sanitizedProducts, address));
            //navigate("/dashboard/orders"); // redirect after success if needed
        }
    };

    return (
        <div className="p-6">
            <h2 className="text-xl font-semibold my-10  py-5 px-5 bg-teal-500 text-white">Checkout Details</h2>


            <div className=' flex max-md:flex-col w-full gap-5'>
                
                    {/* Address form */}
                    <div className="flex flex-col w-full gap-3 mb-6">
                        {Object.keys(address).map((field) => (
                            <div key={field} className="flex max-md:flex-col justify-between md:items-center gap-2 ">
                                <label className="text-sm font-medium mb-1 w-[20%]">
                                    {field.charAt(0).toUpperCase() + field.slice(1)}<span className=' text-red-500 text-xs ml-2'>*</span>
                                </label>
                                <div className=' w-full'>
                                    <input
                                    placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
                                    value={address[field]}
                                    onChange={(e) =>
                                        setAddress({ ...address, [field]: e.target.value })
                                    }
                                    className={`border w-full bg-transparent p-2 rounded outline-none border-gray-700
                                        }`}
                                />
                                {errors[field] && (
                                    <span className="text-red-500 text-xs">{errors[field]}</span>
                                )}
                                </div>
                                
                            </div>
                        ))}
                    
                </div>

                <div className=' flex flex-col gap-4 w-full md:w-[60%] border-[1px] border-zinc-700  py-5'>
                    <h2 className=' mb-4 font-semibold text-lg text-center w-full my-2'>Your Order</h2>
                    <div className="flex items-center justify-between py-4 gap-2 w-full border-b border-b-zinc-800  px-5 ">
                        <h3 className="font-medium mb-2 w-[80%]">Products:</h3>
                        <div className=' flex flex-col w-full max-h-[200px] overflow-auto pr-2 '>
                            {checkoutProducts.map((p, i) => (
                                <div key={i} className=" text-zinc-400  py-2  w-full">
                                    <p> {p.name}</p>
                                </div>
                            ))}
                        </div>

                    </div>
                    <div className=' flex items-center justify-between py-4 gap-2 border-b border-b-zinc-800  px-5'>
                        <p className=' w-[80%]'>Total Products:</p>
                        <p className=' text-zinc-400 w-full'>{checkoutProducts.length}</p>
                    </div>
                    <div className=' flex items-center justify-between py-4 gap-2 border-b border-b-zinc-800   px-5'>
                        <p className=' w-[80%]'>Subtotal:</p>
                        <p className=' text-zinc-400 w-full'>₹{checkoutProducts.reduce((total, p) => total + (p.price || 0) * (p.quantity || 1), 0)}</p>
                    </div>
                    <div className=' flex items-center justify-between py-4 gap-2 border-b border-b-zinc-800   px-5'>
                        <p className=' w-[80%]'>Delivery Charge:</p>
                        <p className=' text-zinc-400 w-full'>₹50</p>
                    </div>
                    <div className=' flex items-center justify-between py-5 gap-2 mt-5  px-5'>
                        <p className=' w-[80%] text-xl font-semibold'>Order Ammount:</p>
                        <p className='  w-full text-lg text-teal-500 font-medium'>₹{checkoutProducts.reduce((total, p) => total + (p.price || 0) * (p.quantity || 1), 0) + 50}</p>
                    </div>
                </div>



            </div>

            <div className=' w-full flex justify-center items-center my-10 mt-20'>
                <button
                        onClick={placeOrder}
                        className="w-full max-w-[500px] bg-teal-600 text-white px-4 py-2 rounded-xl hover:bg-teal-700"
                    >
                        Place Order
                    </button>
            </div>
        </div>
    );
};

export default Checkout;
