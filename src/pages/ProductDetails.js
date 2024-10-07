import React, { useEffect, useState } from 'react';
import { json, useParams } from 'react-router-dom';
import { apiConnect } from '../oprations/apiConnect';
import toast from "react-hot-toast";
import "../App.css"
import ImageSlider from '../components/common/components/ImageSlider';
import { useDispatch, useSelector } from 'react-redux';
import { setCart,settotalCartItems } from '../slices/cartSlice';

const ProductDetails = () => {
    const { id } = useParams();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [mainImage, setMainImage] = useState("");
    const [isDesktop, setIsDesktop] = useState(window.innerWidth >= 1080);
    const [imageslides, setImageslides] = useState([])
    const {cart,totalCartItems}=useSelector((state)=>state.cart)
    const {userDetails}=useSelector((state=>state.user))
    const userloggedin=sessionStorage.getItem("user") || null;
    const dispatch=useDispatch();




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
            
                }
            } catch (err) {
                console.log(err);
            }
        };
        fetchProduct();
    }, [id]);

    const addToCart=()=>{
        if(userDetails.role!=="Admin" && userloggedin){
            const cartProductExist=cart.some(e=>e._id===product._id)
            if(cartProductExist){
             toast.error('Product already in the cart!');
             return;
            }
            const updatecart=[...cart,product];
            dispatch(setCart(updatecart))
            localStorage.setItem("cart",JSON.stringify(updatecart))
            toast.success("Product addedd successfully")
        }
        else if(!userloggedin){
            toast.error("you're not logged in");
             return;
        }
        else{
            toast.error("you're adming you can't add to cart");
             return;
        }

    }
    if (loading) {
        return (
            <div className='flex items-center justify-center absolute  top-0 left-0 h-screen w-full bg-slate-950' style={{ zIndex: 1000 }}>
                <div className="spinner"></div>
            </div>
        );
    }

    if (!product) {
        return <div className='text-center text-lg font-semibold'>Product not found</div>;
    }

    return (
        <div className=' lg:px-6  lg:py-6 flex flex-col gap-6 text-base'>
            <div className='flex max-lg:flex-col justify-center   gap-10 text-slate-200 '>

                <div className="flex justify-center gap-2 relative lg:h-96  h-full  max-lg:bg-slate-100">

                    {isDesktop ? <>
                        <div className="flex justify-center w-full lg:w-72 py-3 ">
                            <img src={mainImage} alt={product.name} className=" w-full max-w-96 h-72 lg:rounded-lg shadow-lg" />
                        </div>
                        <div className="flex flex-col gap-2 h-56 px-2 py-2 overflow-auto hide-scrollbar">
                            {product.images.map((image, index) => (
                                <div key={image.secure_url} className={`w-12 min-h-12  cursor-pointer border  rounded-full transition-transform duration-300 ease-in-out ${image.secure_url === mainImage ? 'border-blue-500 transform scale-110' : 'border-gray-300 hover:border-blue-500 hover:scale-105'}`}><img
                                    src={image.secure_url}
                                    alt={`${product.name} ${index}`}
                                    className={`w-full h-full rounded-full`}
                                    onClick={() => setMainImage(image.secure_url)}
                                /></div>

                            ))}
                        </div>
                        <div className='flex w-full gap-4 absolute max-lg:sticky  bottom-0 left-0 '>
                            <button className=' py-2 px-3 bg-slate-700' onClick={addToCart}>Add to Cart</button>
                            <button className=' py-2 px-3 bg-sky-500 lg:ml-8'>Buy Now</button>
                        </div>
                    </> : <ImageSlider slides={imageslides} /> /* <div className="flex  justify-center w-full h-full max-w-[300px] max-h-[300px] ">
                        <img src={mainImage} alt={product.name} className=" w-full h-full max-w-[300px] max-h-[300px]  " />
                    </div> */}
                </div>

                <div className=' max-lg:px-4 md:min-w-96'>
                    <div className=' flex flex-col gap-2'>
                        <div className=' mt-2 '>
                            <h1 className=" text-slate-400 text-lg font-semibold mb-2 ">{product.name}</h1>
                            <p className="text-2xl font-bold mb-2 text-sky-500">₹{product.price}</p>
                        </div>

                        <div className=" flex flex-col gap-4 py-4 w-full max-w-[600px]">

                            <div className='flex items-center gap-2'>
                                <h3 className=' text-slate-500'>Brand:</h3>
                                <p className=' text-sm'>{product.brand}</p>
                            </div>
                            <div className='flex items-center gap-2'>
                                <h3 className=' text-slate-500'>Colour:</h3>
                                <div className='flex gap-2'>
                                    {product.color.map((e, i) => {
                                        return <div key={e.name+i} className={` rounded-full h-5 w-5`} style={{ background: e.name }}></div>
                                    })}
                                </div>

                            </div>
                            <div className='flex items-center gap-2'>
                                <h3 className=' text-slate-500'>Stock:</h3>
                                <p className=' text-sm'>{product.stock}</p>
                            </div>

                            <div>
                                <h3 className=' text-slate-500 mb-4'>Description:</h3>
                                <p className=' py-3 px-3 text-sm text-slate-200 bg-slate-800'>{product.description}</p>
                            </div>

                        </div>

                        {product.attributes?.type ? <div  className=' flex-col gap-4 mt-8 mb-4 '>
                            <div className=' text-2xl font-semibold'> Additional Details</div>
                            <div className=' flex flex-col gap-6 mt-4 border border-slate-800 py-6 px-3 max-w-[600px] text-slate-300 '>{product.attributes.type.map((e, id) => {
                                return <div key={id} className='flex items-center gap-4 text-sm'>
                                    <div className=' text-slate-400'>{e.name}:</div>
                                    <div className=' flex flex-wrap gap-2'>{e.values.map((value, i) => {
                                        return <div key={i} className=' py-2 px-2 bg-slate-800 border border-slate-800'>{value}</div>
                                    })}</div>
                                </div>

                            })}</div>
                        </div> : null}
                    </div>

                </div>


            </div>
            <div className='flex lg:hidden sticky bottom-0 w-full justify-center items-center  '>
                <button className=' py-2 px-3 bg-slate-700 w-full' onClick={addToCart}>Add to Cart</button>
                <button className=' py-2 px-3 bg-sky-500 lg:ml-8 w-full'>Buy Now</button>
            </div>

        </div>
    );
};

export default ProductDetails;
