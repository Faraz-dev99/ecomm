import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { FaRegClock } from "react-icons/fa";
import { MdOutlinePublic } from "react-icons/md";
import { MdEdit } from "react-icons/md";
import { MdDelete } from "react-icons/md";
import { baseUrl } from '../../../../../oprations/api';
import { NavLink } from 'react-router-dom';
import toast from "react-hot-toast";

const ProductListing = () => {
    const { token } = useSelector((state) => state.auth);
    const [productList, setProductList] = useState([]);
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        const getProductList = async () => {
            try {
                const response = await fetch(`${baseUrl}product/getSellerProducts`, {
                    method: "GET",
                    headers: {
                        Authorization: `berear ${token}`,
                        'Cache-Control': 'no-cache',
                        'Pragma': 'no-cache',
                        'Expires': '0',
                    }
                })
                const products = await response.json();
                if (products.success) {
                    setProductList(products.data);
                    setLoading(false);
                    //console.log(products)
                }
                else {
                    setLoading(false);
                }
            }
            catch (error) {
                console.log("failed to get product list error: ", error)
            }

        }
        getProductList();
    }, []);


    const deleteProductMethod = async (id) => {
        const toastId = toast.loading('Loading...');
        try {
            let response = await fetch(`${baseUrl}product/deleteProduct/${id}`, {
                method: 'post',
                headers: {
                    Authorization: `berear ${token}`
                }
            });
            response = await response.json();
            if (response.success) {
                toast.success("product delete successfully",{
                    id:toastId
                })
                const updatedProductList=productList.filter((product)=>product._id!==id)
                setProductList(updatedProductList);
            }
            else{
                toast.error("failed to delete product",{
                    id:toastId
                })
            }
        }
        catch (err) {
            toast.error("something went wrong",{
                id:toastId
            })
        }
    }


    if (loading) {
        return <div className=' absolute  top-0 left-0 grid place-items-center h-full  w-full bg-gray-950' style={{ zIndex: 1000 }}>
            <div className="spinner"></div>
        </div>
    }

    return (
        <div>
            <div className=' text-lg font-semibold text-slate-300 mb-8'>My Products</div>
            {
                productList.length!==0?productList.map((e, i) => {
                    return <div key={i} className=' flex relative justify-between pb-6 mt-6 border-b border-b-slate-700  items-center'>
                        <div className=' flex items-center'>
                            <div className=' h-16 w-28'><img className=' object-contain w-full h-full' src={e.images[0].secure_url} alt='product' /></div>
                            <div>
                                <div className=' text-sky-500 font-medium text-base mb-1'>{e.name}</div>
                                <div className=' text-slate-500 font-light text-xs'>{e.category.name}</div>
                                <div className='flex flex-col gap-1 text-slate-400 text-xs mt-2'>
                                    <div><span>price: </span><span className=' text-slate-300'>{e.price}</span></div>
                                    <div><span>stock: </span><span className=' text-slate-300'>{e.stock}</span></div>
                                    <div className=' flex items-center gap-1 text-slate-100 justify-center py-2 px-2 rounded-md mt-2' style={{ background: e.status === "Published" ? "rgba(34,197,94,0.7)" : "rgba(220,38,38,0.7)" }}>
                                        <div className=' '>{e.status === "Published" ? <MdOutlinePublic /> : <FaRegClock />}</div>
                                        <div>{e.status === "Published" ? "Published" : "Draft"}</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className=' flex flex-wrap max-md:flex-col items-center text-lg  bg-sky-500 text-slate-900 rounded-md'>
                            <div className=' md:border-r max-md:border-b py-2 px-2 border-slate-900'><MdEdit /> </div>
                            <div className=' py-2 px-2' onClick={() => deleteProductMethod(e._id)}><MdDelete /></div>
                        </div>
                    </div>
                }):<div className=' flex flex-col justify-center items-center gap-4 min-h-40'>
                    <div className=' text-lg text-slate-500 text-center'>You doh't have any Products</div>
                    <NavLink className=" text-sky-500 text-base font-semibold text-center" to={"/dashboard/add-product"}>create new product</NavLink>
                </div>
            }
        </div>
    )
}

export default ProductListing
