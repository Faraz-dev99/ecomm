import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { apiConnect } from '../oprations/apiConnect';
import toast from "react-hot-toast";
import "../App.css";
import ImageSlider from '../components/common/components/ImageSlider';
import { useDispatch, useSelector } from 'react-redux';
import { setCart } from '../slices/cartSlice';
import { createReview, getProductReviews } from '../oprations/reviewApi';

const ProductDetails = () => {
    const { id } = useParams();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [mainImage, setMainImage] = useState("");
    const [isDesktop, setIsDesktop] = useState(window.innerWidth >= 1080);
    const [imageslides, setImageslides] = useState([]);
    const { cart } = useSelector((state) => state.cart);
    const { userDetails } = useSelector((state => state.user));
    const userloggedin = sessionStorage.getItem("user") || null;
    const dispatch = useDispatch();
    const [selectedSize,setSelectedSize]=useState(null);
    const [selectedQuantity,setSelectedQuantity]=useState(1);
    const [selectedColor,setSelectedColor]=useState(null);

    const [reviews, setReviews] = useState([]);
    const [rating, setRating] = useState(0);
    const [hoverRating, setHoverRating] = useState(0);
    const [comment, setComment] = useState("");
    const [averageRating, setAverageRating] = useState(0);
const [distribution, setDistribution] = useState([0,0,0,0,0]);

    const token = JSON.parse(sessionStorage.getItem("token"));
    const navigate=useNavigate();

    // Handle window resize
    useEffect(() => {
        const handleResize = () => setIsDesktop(window.innerWidth >= 1080);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // Fetch product
    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const response = await apiConnect("get", `product/details/${id}`);
                if (response) {
                    setProduct(response?.data?.product);
                    setMainImage(response?.data?.product.images[0]?.secure_url);
                    let slides = response.data.product.images.map((e, i) => (
                        <div key={i} className="flex justify-center min-w-full min-h-full max-w-[350px] max-h-[350px]">
                            <img src={e.secure_url} alt={response.data.product.name} className="w-full object-contain max-w-[350px] max-h-[350px]" />
                        </div>
                    ));
                    setImageslides(slides);
                    setLoading(false);
                }
            } catch (err) {
                console.log(err);
            }
        };
        fetchProduct();
    }, [id]);

    // Fetch reviews
    useEffect(() => {
        const fetchReviews = async () => {
            if (!product) return;
            const data = await getProductReviews(product._id);
            if (data?.success) {
  setReviews(data.reviews);
  setAverageRating(data.averageRating);
  setDistribution(data.distribution);
}
            console.log(data)
        };
        fetchReviews();
    }, [product]);

    // Add to cart
   const addToCart = () => {
    if (userDetails.role !== "Admin" && userloggedin) {
        if (product.sizes.length > 0 && !selectedSize) {
            toast.error("Please select a size");
            return;
        }
        if (!selectedColor) {
            toast.error("Please select a color");
            return;
        }

        const cartProductExist = cart.some(
            (e) => e.productId === product._id
        );
        if (cartProductExist) {
            toast.error("This variation is already in the cart!");
            return;
        }
        console.log("product is this is what ",product._id)

        // Only save the minimal fields
        const productWithOptions = {
            productId: product._id,
            name: product.name,
            brand: product.brand,
            price: product.price,
            images: product.images, 
            size: selectedSize?.size || null,
            color: selectedColor,
            quantity: Number(selectedQuantity),
        };

        const updatedCart = [...cart, productWithOptions];
        dispatch(setCart(updatedCart));
        localStorage.setItem("cart", JSON.stringify(updatedCart));
        toast.success("Product added successfully");
    } else if (!userloggedin) {
        toast.error("You're not logged in");
    } else {
        toast.error("Admins cannot add to cart");
    }
};


    // Handle Buy Now
    const handleOrder = () => {
        if(userDetails.role==="Admin") { toast.error("Admin cannot buy product"); return; }
        if(!userloggedin) { toast.error("please login to buy product"); return; }
        if(product.stock<1){ toast.error("this product is sold out"); return; }
        if(product.sizes.length>0 && !selectedSize){ toast.error("please select a size"); return; }
        if(!selectedColor){ toast.error("please select a color"); return; }
        const orderProduct={
            productId:product._id,
            name: product.name, 
            price:product.price,
            size:selectedSize?.size || null,
            quantity:Number(selectedQuantity),
            color:selectedColor
        };
        sessionStorage.setItem("checkoutProducts", JSON.stringify([orderProduct]));
        navigate('/checkout');
    };

    // Handle Review Submit
    const handleReviewSubmit = async () => {
        if (!token) { toast.error("Please login to leave a review"); return; }
        if (!rating || !comment) { toast.error("Please add both rating and comment"); return; }
        const res = await createReview(token, product._id, rating, comment);
        if (res?.success) {
            setReviews([...reviews, res.review]);
            setRating(0);
            setComment("");
        }
    };

    if (loading) return (
        <div className='flex items-center justify-center absolute top-0 left-0 h-screen w-full bg-zinc-950' style={{ zIndex: 1000 }}>
            <div className="spinner"></div>
        </div>
    );

    if (!product) return <div className='text-center text-lg font-semibold'>Product not found</div>;

    return (
        <div className='lg:px-6 lg:py-6 flex flex-col gap-6 text-base max-sm:min-h-[calc(100vh-93.6px)] h-full max-md:min-h-[calc(100vh-53.6px)] md:min-h-[calc(100vh-117.6px)]'>
            <div className='flex max-lg:flex-col justify-center gap-10 text-zinc-200'>
                <div className="flex justify-center gap-2 relative lg:h-96 h-full max-lg:bg-zinc-100-100">
                    {isDesktop ? (
                        <>
                            <div className="flex justify-center w-full lg:w-72 py-3">
                                <img src={mainImage} alt={product.name} className="w-full max-w-96 h-72 lg:rounded-lg shadow-lg" />
                            </div>
                            <div className="flex flex-col gap-2 h-56 px-2 py-2 overflow-auto hide-scrollbar">
                                {product.images.map((image, index) => (
                                    <div key={image.secure_url} className={`w-12 min-h-12 cursor-pointer border rounded-full transition-transform duration-300 ease-in-out ${image.secure_url === mainImage ? 'border-teal-500 transform scale-110' : 'border-zinc-300 hover:border-teal-500 hover:scale-105'}`}>
                                        <img src={image.secure_url} alt={`${product.name} ${index}`} className="w-full h-full rounded-full" onClick={() => setMainImage(image.secure_url)} />
                                    </div>
                                ))}
                            </div>
                            <div className='flex w-full gap-4 absolute max-lg:fixed bottom-0 left-0'>
                                <button className='py-2 px-3 bg-zinc-900' onClick={addToCart}>Add to Cart</button>
                                <button className='py-2 px-3 bg-teal-600 lg:ml-8' onClick={handleOrder}>Buy Now</button>
                            </div>
                        </>
                    ) : <ImageSlider slides={imageslides} />}
                </div>

                <div className='max-lg:px-4 md:min-w-96 max-w-[600px] '>
                    <div className='flex flex-col gap-2'>
                        <div className='mt-2'>
                            <h1 className="text-zinc-400 text-lg font-semibold mb-2">{product.name}</h1>
                            <p className="text-2xl font-bold mb-2 text-teal-600">₹{product.price}</p>
                        </div>

                        <div className="flex flex-col gap-5 py-4 w-full max-w-[600px]">
                            {/* Brand */}
                            <div className='flex items-center gap-2'>
                                <h3 className='text-zinc-500'>Brand:</h3>
                                <p className='text-sm'>{product.brand}</p>
                            </div>

                            {/* Colors */}
                            <div className='flex items-center gap-2'>
                                <h3 className='text-zinc-500'>Colour:</h3>
                                <div className='flex gap-2'>
                                    {product.color.map((e, i) => (
                                        <div key={e.name + i} className={`rounded-full cursor-pointer h-5 w-5 ${selectedColor===e.name?"border border-teal-500":""}`} onClick={()=>setSelectedColor(e.name)} style={{ background: e.name }}></div>
                                    ))}
                                </div>
                            </div>

                            {/* Seller */}
                            <div className='flex items-center gap-4'>
                                <h3 className='text-zinc-500'>Seller:</h3>
                                <div className='flex gap-2 items-center'>
                                    {product.seller.profilePicture ? (
                                        <div className='cursor-pointer flex justify-center items-center overflow-hidden text-white bg-zinc-600 rounded-full h-7 w-7 text-xl'>
                                            <img src={product.seller.profilePicture?.secure_url} alt="pfp" className='w-full h-full object-cover object-center' />
                                        </div>
                                    ) : (
                                        <div className='cursor-pointer flex justify-center items-center text-white bg-red-600 rounded-full h-7 w-7 text-xl'>{product.seller.username.slice(0,1).toUpperCase()}</div>
                                    )}
                                    <p className='text-sm font-medium text-zinc-300'>{product.seller?.username}</p>
                                </div>
                            </div>

                            {/* Sizes & Quantity */}
                            {product.sizes?.length > 0 ? (
                                <div className="flex flex-col gap-2">
                                    <div className="text-zinc-500">Sizes:</div>
                                    <div className="flex gap-2">
                                        {product.sizes.map((variant, i) => (
                                            <button key={i} onClick={() => setSelectedSize(variant)} className={`border px-3 py-2 rounded-md text-sm ${selectedSize?.size === variant.size ? 'border-teal-500 bg-teal-600/20' : 'border-zinc-600'}`}>{variant.size}</button>
                                        ))}
                                    </div>
                                    {selectedSize && (
                                        <div className="flex items-center gap-2 mt-2">
                                            <h3 className="text-zinc-500">Stock:</h3>
                                            <p className="text-sm">{selectedSize.stock}</p>
                                        </div>
                                    )}
                                    {selectedSize && (
                                        <div className="flex items-center gap-2 mt-2">
                                            <h3 className="text-zinc-500">Quantity:</h3>
                                            <input type="number" min="1" max={selectedSize.stock} value={selectedQuantity} onChange={(e)=>setSelectedQuantity(e.target.value)} className="py-2 px-2 rounded-md border border-zinc-700 bg-transparent" />
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <div className="flex items-center gap-2">
                                    <h3 className="text-zinc-500">Quantity:</h3>
                                    <input type="number" min="1" max={product.stock} value={selectedQuantity} onChange={(e)=>setSelectedQuantity(e.target.value)} className="py-2 px-2 rounded-md border border-zinc-700 bg-transparent" />
                                    <span className="ml-2 text-sm text-zinc-500">In Stock: {product.stock}</span>
                                </div>
                            )}

                            {/* Description */}
                            <div className='mt-5 border-t border-t-zinc-700 py-7'>
                                <h3 className='font-medium text-xl mb-2'>Description</h3>
                                <p className='py-3 text-sm md:text-base font-light tracking-wider leading-relaxed text-zinc-300' style={{ wordSpacing: "2px" }}>{product.description}</p>
                            </div>

                        </div>

                        {/* Specifications */}
                        {product.attributes?.type.length > 0 && (
                            <div className='flex-col gap-4 mt-8 mb-4'>
                                <div className='text-2xl font-semibold'>Specifications</div>
                                <div className='flex flex-col gap-6 mt-4 border border-zinc-800 py-6 px-3 max-w-[600px] text-zinc-300'>
                                    {product.attributes.type.map((e, id) => (
                                        <div key={id} className={`flex justify-between ${e.values.length > 1 ? "flex-col" : ""} gap-4 text-sm`}>
                                            <div className='text-zinc-400 self-start'>{e.name}:</div>
                                            <div className={`flex flex-col gap-2 ${e.values.length == 1 ? "w-[50%]" : ""}`}>
                                                {e.values.map((value, i, arr) => (
                                                    <div key={i} className='flex items-center gap-2 px-2 bg-zinc-800-800'>{arr.length>1 && <span className='text-lg'>•</span>}{value}</div>
                                                ))}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Reviews Section */}
{/* Reviews Section */}
<div className="my-16 border-t border-zinc-800 py-10">
  <h2 className="text-xl font-semibold mb-4">Customer Reviews</h2>

  {/* Overall Rating */}
  {reviews.length > 0 && (
    <div className="mb-10 ">
      <div className="flex items-center gap-3">
        <span className="text-4xl font-bold text-teal-500">
          {averageRating.toFixed(1)}
        </span>
        <div className="flex flex-col">
          <div className="flex">
            {[1, 2, 3, 4, 5].map((s) => (
              <span key={s} className={`text-2xl ${s <= Math.round(
                reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length
              ) ? "text-yellow-400" : "text-zinc-500"}`}>
                ★
              </span>
            ))}
          </div>
          <span className="text-sm text-zinc-400">
            {reviews.length} total
          </span>
        </div>
      </div>

      {/* Star Breakdown */}
      <div className="mt-4 space-y-1">
        {[5, 4, 3, 2, 1].map((star) => {
  const count = distribution[star - 1];
  const percent = reviews.length > 0 ? (count / reviews.length) * 100 : 0;
          return (
            <div key={star} className="flex items-center gap-2">
              <span className="text-sm w-6">{star}★</span>
              <div className="flex-1 h-3 bg-zinc-700 rounded">
                <div
                  className="h-3 bg-yellow-400 rounded"
                  style={{ width: `${percent}%` }}
                ></div>
              </div>
              <span className="text-xs text-zinc-400 w-8 text-right">
                {count}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  )}


  {/* Review Form */}
  {userloggedin && (
    <div className=" my-20">
      <h3 className="text-lg font-medium mb-2">Leave a Review</h3>
      <div className="flex flex-col gap-3">
        {/* ⭐ Star Selection */}
        <div className="flex gap-1">
          {[1, 2, 3, 4, 5].map((s) => (
            <span
              key={s}
              className={`cursor-pointer text-2xl transition-colors duration-200 ${
                s <= (hoverRating || rating) ? "text-yellow-400" : "text-zinc-500"
              }`}
              onClick={() => setRating(s)}
              onMouseEnter={() => setHoverRating(s)}
          onMouseLeave={() => setHoverRating(0)}
            >
              ★
            </span>
          ))}
        </div>

        {/* Comment */}
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Write your review..."
          className="bg-zinc-800 border outline-none border-zinc-600 p-2 rounded"
        />

        {/* Submit */}
        <button
          onClick={handleReviewSubmit}
          className="bg-teal-600 px-4 py-2 rounded text-white hover:bg-teal-500"
        >
          Submit Review
        </button>
      </div>
    </div>
  )}

  <div className='  pr-4 hide-scrollbar border-t border-zinc-700'>
    {/* Individual Reviews */}
  {reviews.length > 0 ? (
    reviews.map((rev, i) => (
      <div key={i} className=" my-10">
        <div className="flex justify-between items-center">
            <div className=' flex gap-2 items-center'>
                {rev.user?.profilePicture?.secure_url?<div  className=' cursor-pointer flex justify-center items-center overflow-hidden text-white bg-zinc-600 rounded-full h-7 w-7 text-xl'
          ><img src={rev.user?.profilePicture?.secure_url} alt="user" className=' w-full h-full object-cover object-center ' /></div>:<div  className=' cursor-pointer flex justify-center items-center text-white bg-red-600 rounded-full h-7 w-7 text-xl'
          >{rev.name.slice(0, 1).toUpperCase()}</div>}
          <p className="font-medium">{rev.name}</p>
            </div>
            
          <div className="flex">
            {[1, 2, 3, 4, 5].map((s) => (
              <span
                key={s}
                className={`text-sm ${s <= rev.rating ? "text-yellow-400" : "text-zinc-600"}`}
              >
                ★
              </span>
            ))}
          </div>
        </div>
        <p className="text-sm text-zinc-400 mt-1 ml-9">{rev.comment}</p>
      </div>
    ))
  ) : (
    <p className="text-sm text-zinc-500">No reviews yet</p>
  )}
  </div>

  

  
</div>
                    </div>
                </div>
            </div>

            {/* Mobile Fixed Buttons */}
            <div className='flex lg:hidden fixed bottom-0 w-full justify-center items-center'>
                <button className='py-2 px-3 bg-zinc-900/80 w-full' onClick={addToCart}>Add to Cart</button>
                <button className='py-2 px-3 bg-teal-600/80 lg:ml-8 w-full' onClick={handleOrder}>Buy Now</button>
            </div>
        </div>
    );
};

export default ProductDetails;
