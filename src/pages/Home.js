import React, { useEffect, useState } from 'react'
import {Slider,Product} from '../filespath'
import '../App.css';
import { useDispatch, useSelector } from 'react-redux';
import { apiConnect } from '../oprations/apiConnect';
import { setProduct } from '../slices/productSlice';
import Pagination from '../components/common/pagination/Pagination';

const Home = () => {
  const [loading,setLoading]=useState(true);
  const [products,setProducts]=useState([]);
  const [randomProducts, setRandomProducts] = useState([]);
  const dispatch=useDispatch();
  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5; 

  // Calculate the products to show on the current page
 const indexOfLastProduct = currentPage * itemsPerPage;
 const indexOfFirstProduct = indexOfLastProduct - itemsPerPage;
 const currentProducts = products?.slice(indexOfFirstProduct, indexOfLastProduct);

  useEffect(()=>{
    const getProducts=async ()=>{
      try{
        const response=await apiConnect(
          "get",
          "product/getProducts"
        )
        if(response.data.success){
          let productVar=response?.data?.products;
          setProducts(productVar)
          setLoading(false);
          setProduct(productVar)
        }
        console.log(response)
      }
      catch(err){
        console.log(err)
      }
    }
    getProducts();
  },[])
  
  // Select 5 random products
  useEffect(() => {
    if (products.length > 0) {
      const shuffled = [...products].sort(() => 0.5 - Math.random());
      const selected = shuffled.slice(0, 5);
      setRandomProducts(selected);
      console.log("Randomly selected products:", selected);
    }
  }, [products]);

  if(loading){
    return <div className=' absolute  top-0 left-0 grid place-items-center h-screen  w-full bg-gray-950' style={{zIndex:1000}}>
      <div className="spinner"></div>
    </div>
  }
  
  return (
    <div>
     { /* <div onClick={notify}>toast</div>*/ }
      <Slider data={randomProducts}/>
      <div className='flex flex-col justify-center my-10 px-4'>
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
      </div>
      
    </div>
  )
}

export default Home
