import React, { useEffect, useState } from 'react'
import { Slider, Product } from '../filespath'
import '../App.css';
import { useDispatch, useSelector } from 'react-redux';
import { apiConnect } from '../oprations/apiConnect';
import { setProduct } from '../slices/productSlice';
import Pagination from '../components/common/pagination/Pagination';
import { FaAngleRight } from 'react-icons/fa';
import HotProduct from '../components/common/components/HotProduct';
import { NavLink } from 'react-router-dom';
import LatestProductCard from '../components/common/components/LatestProductCard';
import { FaShopify } from "react-icons/fa";
import { FaSackDollar } from "react-icons/fa6";
import { MdDeliveryDining } from "react-icons/md";

const Home = () => {
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState([]);
  const [randomProducts, setRandomProducts] = useState([]);
  const dispatch = useDispatch();
  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Calculate the products to show on the current page
  const indexOfLastProduct = currentPage * itemsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - itemsPerPage;
  const currentProducts = products?.slice(indexOfFirstProduct, indexOfLastProduct);

  useEffect(() => {
    const getProducts = async () => {
      try {
        const response = await apiConnect(
          "get",
          "product/getProducts"
        )
        if (response.data.success) {
          let productVar = response?.data?.products;
          setProducts(productVar)
          setLoading(false);
          setProduct(productVar)
        }
        console.log(response)
      }
      catch (err) {
        console.log(err)
      }
    }
    getProducts();
  }, [])

  // Select 5 random products
  useEffect(() => {
    if (products.length > 0) {
      const shuffled = [...products].sort(() => 0.5 - Math.random());
      const selected = shuffled.slice(0, 5);
      setRandomProducts(selected);
      console.log("Randomly selected products:", selected);
    }
  }, [products]);

  if (loading) {
    return <div className=' absolute  top-0 left-0 grid place-items-center h-screen  w-full bg-zinc-950' style={{ zIndex: 1000 }}>
      <div className="spinner"></div>
    </div>
  }

  return (
    <div className=''>
      { /* <div onClick={notify}>toast</div>*/}
      <Slider data={randomProducts} />
      {/* <div className='flex flex-col justify-center my-10 px-4'>
        <h1 className='  text-slate-200 font-bold md:text-2xl lg:text-3xl max-md:text-xl  mb-6'>All Products</h1>
        <div className=' flex flex-wrap w-full'>
          {
            currentProducts?.map((e,i)=>{
              return e.status==="Published" && <Product key={i} id={e._id} name={e.name} desc={e.description} price={e.price} thumbnail={e.images[0].secure_url } />
            })
          }
        </div>
        <Pagination
        totalItems={products?.length}
        itemsPerPage={itemsPerPage}
        currentPage={currentPage}
        onPageChange={setCurrentPage}
        />
      </div> */}

      <div className=' md:px-6 max-w-[1300px] mx-auto'>

        <section className='flex flex-col justify-center my-10 mt-20 px-4'>
          <div className=' flex justify-between items-center mb-6'>
            <h1 className='  text-slate-200 font-bold md:text-2xl lg:text-3xl max-md:text-xl'>Latest Products</h1>
            <NavLink to={'/catalog/mobile'} className=' cursor-pointer py-0 hover:border-b-[2px] hover:border-b-teal-600 text-teal-600 flex items-center gap-2'>View All <FaAngleRight /></NavLink>
          </div>


          <div className="overflow-x-auto hide-scrollbar">
            <div className="flex gap-10">
              {products
                ?.filter(e => e.status === "Published")
                .reverse()
                .slice(0, 6)
                .map((e, i) => (
                  <div
                    key={i}
                    className="flex-shrink-0 w-full max-w-[200px]  md:max-w-[300px]" 
                  >
                    <LatestProductCard
                      id={e._id}
                      name={e.name}
                      desc={e.description}
                      price={e.price}
                      thumbnail={e.images[0].secure_url}
                    />
                  </div>
                ))}
            </div>
          </div>



        </section>

        <section className='flex flex-col justify-center items-center  my-28'>

          <h1 className='  text-slate-200 font-semibold md:text-3xl mb-10 lg:text-4xl max-md:text-2xl'>What's Hot</h1>


          <div className=' flex justify-center md:gap-5 max-lg:flex-wrap w-full '>
            {
              products?.map((e, i) => {
                return (e.status === "Published" && i < 4) && <HotProduct key={i} id={e._id} name={e.name} desc={e.description} price={e.price} thumbnail={e.images[0].secure_url} />
              })
            }
          </div>

        </section>



        <section className='flex flex-col justify-center my-10 mt-20 px-4'>
          <div className=' flex justify-between items-center mb-6'>
            <h1 className='  text-slate-200 font-bold md:text-2xl lg:text-3xl max-md:text-xl'>All Products</h1>
            <NavLink to={'/catalog/mobile'} className=' cursor-pointer py-0 hover:border-b-[2px] hover:border-b-teal-600 text-teal-600 flex items-center gap-2'>View All <FaAngleRight /></NavLink>
          </div>

          <div className=' flex flex-wrap w-full'>
            {
              products?.map((e, i) => {
                return (e.status === "Published" && i < 12) && <Product key={i} id={e._id} name={e.name} desc={e.description} price={e.price} thumbnail={e.images[0].secure_url} />
              })
            }
          </div>

        </section>

        <section className=' my-10 mt-40 px-4'>

          <div className=' flex flex-col items-center justify-center gap-5 mb-6'>
            <h1 className='  text-slate-200 font-bold md:text-4xl lg:text-3xl max-md:text-2xl'>Why Light Store?</h1>
            <p className=' max-md:text-base text-lg text-zinc-400 text-center'>Your one-stop shop for quality products, great prices, and a seamless shopping experience.</p>
          </div>


          <div className=' flex max-md:flex-col justify-center items-center gap-10 mt-20'>
            <div className=' flex flex-col py-6 px-5 max-md:max-w-[300px] rounded-lg justify-center items-center bg-gradient-to-br from-slate-800 via-teal-600 via-sla to-indigo-600'>
              <FaShopify className=' text-[50px]'/>
              <h2 className=' font-bold text-xl mt-5 mb-2 text-center'>All-in-One Shopping</h2>
              <p className=' text-zinc-300  text-center'>Fashion, electronics, home essentials & more — all in one place.</p>
            </div>
            
            <div className=' flex flex-col py-6 px-5 max-md:max-w-[300px] rounded-lg justify-center items-center bg-gradient-to-br from-slate-800 via-teal-600 via-sla to-indigo-600'>
              <FaSackDollar className=' text-[50px]'/>
              <h2 className=' font-bold text-xl mt-5 mb-2 text-center'>Best Prices & Deals</h2>
              <p className=' text-zinc-300  text-center'>Affordable rates with exclusive offers and discounts.</p>
            </div>

            <div className=' flex flex-col py-6 px-5 max-md:max-w-[300px] rounded-lg justify-center items-center bg-gradient-to-br from-slate-800 via-teal-600 via-sla to-indigo-600'>
              <MdDeliveryDining className=' text-[50px]'/>
              <h2 className=' font-bold text-xl mt-5 mb-2 text-center'>Fast & Secure Delivery</h2>
              <p className=' text-zinc-300  text-center'>Quick shipping with safe and reliable payment options.</p>
            </div>
            
          </div>

        </section>

        
      </div>
<section className=' mt-20   px-4 bg-teal-600 flex flex-col gap-5 justify-center items-center py-20'>
          <h2 className=' font-bold text-4xl max-md:text-3xl mt-5 mb-2 text-center'>Ready to Start Shopping?</h2>
              <p className=' text-zinc-300 text-xl max-md:text-lg max-w-[600px]  text-center'>Join thousands of happy customers who trust Light Store for quality products and unbeatable deals.</p>
              <NavLink className=' bg-teal-100 hover:bg-white text-teal-600 py-2 px-3 rounded-md'>Get Started Now →</NavLink>
        </section>


    </div>
  )
}

export default Home
