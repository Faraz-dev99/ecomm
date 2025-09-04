import React, { useEffect, useState } from 'react';
import { json, useParams } from 'react-router-dom';
import { apiConnect } from '../oprations/apiConnect';
import toast from "react-hot-toast";
import "../App.css"
import ImageSlider from '../components/common/components/ImageSlider';
import { useDispatch, useSelector } from 'react-redux';
import { setCart, settotalCartItems } from '../slices/cartSlice';

const ProductDetails = () => {
    const { id } = useParams();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [mainImage, setMainImage] = useState("");
    const [isDesktop, setIsDesktop] = useState(window.innerWidth >= 1080);
    const [imageslides, setImageslides] = useState([])
    const { cart, totalCartItems } = useSelector((state) => state.cart)
    const { userDetails } = useSelector((state => state.user))
    const userloggedin = sessionStorage.getItem("user") || null;
    const dispatch = useDispatch();




    useEffect(() => {
        const handleResize = () => {
            setIsDesktop(window.innerWidth >= 1080);
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const response = await apiConnect("get", `product/details/${id}`);
                if (response) {
                    setProduct(response?.data?.product);
                    setMainImage(response?.data?.product.images[0].secure_url);
                    let slides = response.data.product.images;
                    slides = slides.map((e, i) => {
                        return <div key={i} className="flex  justify-center min-w-full min-h-full max-w-[350px] max-h-[350px] ">
                            <img src={e.secure_url} alt={response.data.product.name} className=" w-full object-contain max-w-[350px] max-h-[350px]  " />
                        </div>
                    })
                    setImageslides(slides)
                    setLoading(false);
                    console.log("product",response?.data?.product)

                }
            } catch (err) {
                console.log(err);
            }
        };
        fetchProduct();
    }, [id]);

    const addToCart = () => {
        if (userDetails.role !== "Admin" && userloggedin) {
            const cartProductExist = cart.some(e => e._id === product._id)
            if (cartProductExist) {
                toast.error('Product already in the cart!');
                return;
            }
            const updatecart = [...cart, product];
            dispatch(setCart(updatecart))
            localStorage.setItem("cart", JSON.stringify(updatecart))
            toast.success("Product addedd successfully")
        }
        else if (!userloggedin) {
            toast.error("you're not logged in");
            return;
        }
        else {
            toast.error("you're adming you can't add to cart");
            return;
        }

    }
    if (loading) {
        return (
            <div className='flex items-center justify-center absolute   top-0 left-0 h-screen w-full bg-zinc-950' style={{ zIndex: 1000 }}>
                <div className="spinner"></div>
            </div>
        );
    }

    if (!product) {
        return <div className='text-center text-lg font-semibold'>Product not found</div>;
    }

    return (
        <div className=' lg:px-6  lg:py-6 flex flex-col gap-6 text-base max-sm:min-h-[calc(100vh-93.6px)] h-full  max-md:min-h-[calc(100vh-53.6px)] md:min-h-[calc(100vh-117.6px)]'>
            <div className='flex max-lg:flex-col justify-center   gap-10 text-zinc-200 '>

                <div className="flex justify-center gap-2 relative lg:h-96  h-full  max-lg:bg-zinc-100-100">

                    {isDesktop ? <>
                        <div className="flex justify-center w-full lg:w-72 py-3">
                            <img src={mainImage} alt={product.name} className=" w-full max-w-96 h-72 lg:rounded-lg shadow-lg" />
                        </div>
                        <div className="flex flex-col gap-2 h-56 px-2 py-2 overflow-auto hide-scrollbar">
                            {product.images.map((image, index) => (
                                <div key={image.secure_url} className={`w-12 min-h-12  cursor-pointer border  rounded-full transition-transform duration-300 ease-in-out ${image.secure_url === mainImage ? 'border-teal-500 transform scale-110' : 'border-zinc-300 hover:border-teal-500 hover:scale-105'}`}><img
                                    src={image.secure_url}
                                    alt={`${product.name} ${index}`}
                                    className={`w-full h-full rounded-full`}
                                    onClick={() => setMainImage(image.secure_url)}
                                /></div>

                            ))}
                        </div>
                        <div className='flex w-full gap-4 absolute max-lg:fixed  bottom-0 left-0 '>
                            <button className=' py-2 px-3 bg-zinc-900' onClick={addToCart}>Add to Cart</button>
                            <button className=' py-2 px-3 bg-teal-600 lg:ml-8'>Buy Now</button>
                        </div>
                    </> : <ImageSlider slides={imageslides} /> /* <div className="flex  justify-center w-full h-full max-w-[300px] max-h-[300px] ">
                        <img src={mainImage} alt={product.name} className=" w-full h-full max-w-[300px] max-h-[300px]  " />
                    </div> */}
                </div>

                <div className=' max-lg:px-4 md:min-w-96'>
                    <div className=' flex flex-col gap-2'>
                        <div className=' mt-2 '>
                            <h1 className=" text-zinc-400 text-lg font-semibold mb-2 ">{product.name}</h1>
                            <p className="text-2xl font-bold mb-2 text-teal-600">₹{product.price}</p>
                        </div>

                        <div className=" flex flex-col gap-5 py-4 w-full max-w-[600px]">

                            <div className='flex items-center gap-2'>
                                <h3 className=' text-zinc-500'>Brand:</h3>
                                <p className=' text-sm'>{product.brand}</p>
                            </div>
                            <div className='flex items-center gap-2'>
                                <h3 className=' text-zinc-500'>Colour:</h3>
                                <div className='flex gap-2'>
                                    {product.color.map((e, i) => {
                                        return <div key={e.name + i} className={` rounded-full h-5 w-5`} style={{ background: e.name }}></div>
                                    })}
                                </div>

                            </div>
                            <div className='flex items-center gap-4'>
                                <h3 className=' text-zinc-500'>Seller:</h3>
                                <div className=' flex gap-2 items-center'>
                                    {
                                        product.seller.profilePicture?<div  className=' cursor-pointer flex justify-center items-center overflow-hidden text-white bg-zinc-600 rounded-full h-7 w-7 text-xl'
          ><img src={product.seller.profilePicture?.secure_url} alt="pfp" className=' w-full h-full object-cover object-center' /></div>:<div  className=' cursor-pointer flex justify-center items-center text-white bg-red-600 rounded-full h-7 w-7 text-xl'
          >{product.seller.username.slice(0, 1).toUpperCase()}</div>
                                    }
                                    <p className=' text-sm font-medium text-zinc-300'>{product.seller?.username}</p>
                                </div>
                            </div>
                            
                            {
                                product.sizes.length > 0 ? <div className=' flex items-center gap-2 '>
                                    <div  className=' text-zinc-500'>sizes:</div>
                                    <div className='flex gap-2'>
                                        {product.sizes.map((e, i) => {
                                            return <div key={i} className=' border border-zinc-600 min-w-8 text-center rounded-md py-2 px-2 text-xs text-zinc-400'>{e.size}</div>
                                        })}
                                    </div>
                                </div> : <div className='flex items-center gap-2'>
                                    <h3 className=' text-zinc-500'>Stock:</h3>
                                    <p className=' text-sm'>{product.stock}</p>
                                </div>
                            }


                            <div>
                                <h3 className=' text-zinc-500 mb-2'>Description:</h3>
                                <p className=' py-3  text-sm md:text-base font-light tracking-wider leading-relaxed text-zinc-200-200 ' style={{wordSpacing:"2px"}}>{product.description}</p>
                            </div>

                        </div>

                        {product.attributes?.type.length>0 ? <div className=' flex-col gap-4 mt-8 mb-4 '>
                            <div className=' text-2xl font-semibold'> Specifications</div>
                            <div className=' flex flex-col gap-6 mt-4 border border-zinc-800 py-6 px-3 max-w-[600px] text-zinc-300 '>{product.attributes.type.map((e, id) => {
                                return <div key={id} className={`flex   justify-between ${e.values.length>1?"flex-col":""} gap-4 text-sm`}>
                                    <div className=' text-zinc-400 self-start '>{e.name}:</div>
                                    <div className={` flex flex-col gap-2  ${e.values.length==1?"w-[50%]":""}`}>{e.values.map((value, i,arr) => {
                                        return <div key={i} className=' flex items-center gap-2  px-2 bg-zinc-800-800 '>{arr.length>1&&<span className=' text-lg '>• </span>}{value}</div>
                                    })}</div>
                                </div>

                            })}</div>
                        </div> : null}
                    </div>

                </div>


            </div>
            <div className='flex lg:hidden fixed bottom-0 w-full justify-center items-center  '>
                <button className=' py-2 px-3 bg-zinc-900/80 w-full' onClick={addToCart}>Add to Cart</button>
                <button className=' py-2 px-3 bg-teal-600/80 lg:ml-8 w-full'>Buy Now</button>
            </div>

        </div>
    );
};

export default ProductDetails;
