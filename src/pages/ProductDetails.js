import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { apiConnect } from '../oprations/apiConnect';
import "../App.css"
import ImageSlider from '../components/common/components/ImageSlider';

const ProductDetails = () => {
    const { id } = useParams();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [mainImage, setMainImage] = useState("");
    const [isDesktop, setIsDesktop] = useState(window.innerWidth >= 1080);
    const [imageslides,setImageslides]=useState([])





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
                    let slides=response.data.product.images;
                    slides=slides.map((e,i)=>{
                        return <div key={i} className="flex  justify-center min-w-full min-h-full max-w-[300px] max-h-[300px] ">
                        <img src={e.secure_url} alt={response.data.product.name} className=" w-full object-contain max-w-[300px] max-h-[300px]  " />
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
    

    if (loading) {
        return (
            <div className='flex items-center justify-center absolute  top-0 left-0 h-screen w-full bg-slate-950' style={{zIndex:1000}}>
                <div className="spinner"></div>
            </div>
        );
    }

    if (!product) {
        return <div className='text-center text-lg font-semibold'>Product not found</div>;
    }

    return (
        <div className=' lg:px-6  lg:py-6 flex flex-col gap-6 w-screen'>
            <div className='flex max-lg:flex-col  gap-6 text-slate-200'>

                <div className="flex max-lg:justify-center gap-2 relative lg:h-96 w-full h-full max-lg:bg-slate-100">

                    {isDesktop ? <>
                        <div className="flex justify-center w-full lg:w-72 py-3 ">
                            <img src={mainImage} alt={product.name} className=" w-full max-w-96 h-72 lg:rounded-lg shadow-lg" />
                        </div>
                        <div className="flex flex-col gap-2 h-56 px-2 py-2 overflow-auto hide-scrollbar">
                            {product.images.map((image, index) => (
                                <div  key={index} className={`w-12 min-h-12  cursor-pointer border  rounded-full transition-transform duration-300 ease-in-out ${image.secure_url === mainImage ? 'border-blue-500 transform scale-110' : 'border-gray-300 hover:border-blue-500 hover:scale-105'}`}><img
                                    src={image.secure_url}
                                    alt={`${product.name} ${index}`}
                                    className={`w-full h-full rounded-full`}
                                    onClick={() => setMainImage(image.secure_url)}
                                /></div>

                            ))}
                        </div>
                        <div className='flex gap-4 max-lg:px-4 absolute bottom-0 left-0'>
                            <button className=' py-2 px-3 bg-slate-700'>Add to Cart</button>
                            <button className=' py-2 px-3 bg-sky-500 lg:ml-8'>Buy Now</button>
                        </div>
                    </> :<ImageSlider slides={imageslides}/> /* <div className="flex  justify-center w-full h-full max-w-[300px] max-h-[300px] ">
                        <img src={mainImage} alt={product.name} className=" w-full h-full max-w-[300px] max-h-[300px]  " />
                    </div> */}
                </div>

                <div className=' w-full max-lg:px-4'>
                    <div className=' flex flex-col gap-2'>
                        <div>
                            <h1 className=" text-slate-400 text-lg font-semibold mb-2 ">{product.name}</h1>
                            <p className="text-2xl font-bold mb-2 text-sky-500">₹{product.price}</p>
                        </div>

                        <div className="text-base flex flex-col gap-4 py-4 px-4 border border-slate-700 rounded-lg w-full max-w-[600px]">
                            <div><h3 className=' text-slate-500'>Description:</h3>
                                <p className=' py-3 px-3 text-sm text-slate-400'>{product.description}</p></div>
                            <div className='flex items-center gap-2'>
                                <h3 className=' text-slate-500'>Brand:</h3>
                                <p className=' text-sm'>{product.brand}</p>
                            </div>
                            <div className='flex items-center gap-2'>
                                <h3 className=' text-slate-500'>Colour:</h3>
                                <div className='flex gap-2'>
                                    {product.color.map((e, i) => {
                                        return <div key={i} className={` rounded-full h-5 w-5`} style={{ background: e.name }}></div>
                                    })}
                                </div>

                            </div>
                            <div className='flex items-center gap-2'>
                                <h3 className=' text-slate-500'>Stock:</h3>
                                <p className=' text-sm'>{product.stock}</p>
                            </div>

                        </div>
                    </div>

                </div>


            </div>
            <div className='flex lg:hidden sticky bottom-0 w-full justify-center items-center  '>
                <button className=' py-2 px-3 bg-slate-700 w-full'>Add to Cart</button>
                <button className=' py-2 px-3 bg-sky-500 lg:ml-8 w-full'>Buy Now</button>
            </div>

        </div>
    );
};

export default ProductDetails;
