import React, { useEffect,useState } from 'react'
import { useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router';
import Filtermenu from '../components/core/Dashboard/filter/Filtermenu';
import { Product } from '../filespath';
import { apiConnect } from '../oprations/apiConnect';
import DotLoader from '../components/common/DotLoader';
import { fetchCategory } from '../oprations/productApi';

const Catalog = () => {
    const { key } = useParams();
  const [catalogProducts, setCatalogProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loader, setLoader] = useState(true);
  const navigate=useNavigate();

  useEffect(()=>{
    const getCatalogProducts=async ()=>{
        try{
            const categories = await fetchCategory();
            if(categories.length<1){
                navigate('/')
            }
            
            let catalog=categories.filter((e)=>e.name===key)
            catalog=catalog[0]._id
            console.log("ye hai",catalog)
            if(catalog){
                 const response=await apiConnect(
              "get",
              "product/getProducts"
            )
            if(response.data.success){
              let products=response?.data?.products;
              products=products.filter((e)=>e.category===catalog)
              
              setLoader(false);
              setCatalogProducts(products)
              setFilteredProducts(products)
              console.log("catalog products ",products)
            }
            }
           
            
          }
          catch(err){
            console.log(err)
          }
    }
    getCatalogProducts();
  },[key])

   // Handle filter changes
   const handleFilterChange = (newFilters) => {
    const { categories, minPrice, maxPrice,sortBy } = newFilters;

    const filtered = catalogProducts.filter(product => {
      // Filter by category
      const categoryMatch = categories.length === 0 || categories.includes(product.category);
      
      // Filter by price range
      const priceMatch = 
        (minPrice === '' || product.price >= minPrice) &&
        (maxPrice === '' || product.price <= maxPrice);

      return categoryMatch && priceMatch && product.status === "Published";
    });
   // console.log("filter is ",filtered)
    // Apply sorting based on the selected filter
    if (sortBy === 'lowToHigh') {
      filtered.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'highToLow') {
      filtered.sort((a, b) => b.price - a.price);
    } else if (sortBy === 'newest') {
      filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)); // Assuming `createdAt` field is present
    }
    setFilteredProducts(filtered);
  };

  // Clear all filters
  const clearFilters = () => {
     // Reset to original searched products
     setFilteredProducts(catalogProducts);
  };

  if (loader) {
    return (
      <div className=' max-md:min-h-[calc(100vh-101.6px)] md:min-h-[calc(100vh-117.6px)] grid place-items-center'>
        <DotLoader />
      </div>
    );
  }

  if (!loader && filteredProducts.length === 0) {
    return (
      <div className='flex flex-col justify-center relative px-4'>
        <Filtermenu onFilterChange={handleFilterChange}  onClearFilters={clearFilters}/>
        <div className=' max-md:min-h-[calc(100vh-101.6px)] md:min-h-[calc(100vh-117.6px)] grid place-items-center text-slate-400 text-lg font-semibold'>
        No result found!
        </div>
        
      </div>
    );
  }

  return (
    <div className='flex flex-col justify-center relative my-10 px-4'>
      <Filtermenu onFilterChange={handleFilterChange} onClearFilters={clearFilters}/>
      <h1 className='text-sky-500 font-bold md:text-2xl max-md:text-xl mb-6'>
        Catalog: {key}
      </h1>
      <div className='flex flex-wrap w-full'>
        {filteredProducts.map((product, i) => (
          <Product
            key={i}
            id={product._id}
            name={product.name}
            desc={product.description}
            price={product.price}
            thumbnail={product.images[0]?.secure_url}
          />
        ))}
      </div>
    </div>
  )
}

export default Catalog
