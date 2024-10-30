import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router'
import { baseUrl } from '../oprations/api';
import DotLoader from '../components/common/DotLoader';
import { Product } from '../filespath';

const Search = () => {
  const { key } = useParams();
  const [searchedProducts, setSearchedProducts] = useState([]);
  const [loader, setLoader] = useState(true);
  useEffect(() => {
    const getSearchedProduct = async () => {
      try {
        const response = await fetch(`${baseUrl}product/searchProduct/${key}`)
        if (!response.ok) {
          if (response.status === 404) {
            setSearchedProducts([]);
            setLoader(false); // Clear results if no products are found
          }
          return;
        }
        const items = await response.json();
        if (items.success) {
          setSearchedProducts(items.products);
          setLoader(false);
        }

      }
      catch (err) {
        console.log("h")
      }
    }
    getSearchedProduct();
  }, [key])
  if (loader) {
    return <div className=' max-md:min-h-[calc(100vh-101.6px)] md:min-h-[calc(100vh-117.6px)] grid place-items-center'>
      <DotLoader />
    </div>
  }
  if (!loader && searchedProducts.length === 0) {
    return (
      <div className=' max-md:min-h-[calc(100vh-101.6px)] md:min-h-[calc(100vh-117.6px)] grid place-items-center text-slate-400 text-lg font-semibold'>
        No result found!
      </div>
    )
  }
  if (!loader && searchedProducts.length > 0) {
    return <div className='flex flex-col justify-center my-10 px-4'>
      <h1 className='  text-sky-500 font-bold md:text-2xl lg:text-3xl max-md:text-xl  mb-6'>search results for: {key}</h1>
    <div className='flex flex-wrap w-full'>
      {
        searchedProducts.map((e, i) => {
          return  e.status === "Published" && <Product key={i} id={e._id} name={e.name} desc={e.description} price={e.price} thumbnail={e.images[0].secure_url} /> 
        })
      }
    </div>
    </div>

  }

}

export default Search
