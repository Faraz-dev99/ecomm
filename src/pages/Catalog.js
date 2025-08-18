import React, { useEffect,useState } from 'react'
import { useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router';
import Filtermenu from '../components/core/Dashboard/filter/Filtermenu';
import { Product } from '../filespath';
import { apiConnect } from '../oprations/apiConnect';
import DotLoader from '../components/common/DotLoader';
import { fetchCategory } from '../oprations/productApi';
import { IoIosArrowForward } from "react-icons/io";
import Pagination from '../components/common/pagination/Pagination';

const Catalog = () => {
    const { key } = useParams();
  const [catalogProducts, setCatalogProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loader, setLoader] = useState(true);
  const navigate=useNavigate();

   // Pagination states
   const [currentPage, setCurrentPage] = useState(1);
   const itemsPerPage = 10; 

   // Calculate the products to show on the current page
  const indexOfLastProduct = currentPage * itemsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - itemsPerPage;
  const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct);

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
        <div className=' max-md:min-h-[calc(100vh-101.6px)] md:min-h-[calc(100vh-117.6px)] grid place-items-center text-zinc-400 text-lg font-semibold'>
        No result found!
        </div>
        
      </div>
    );
  }

  return (
    <div className='flex flex-col justify-center relative my-10 px-4'>
      <Filtermenu onFilterChange={handleFilterChange} onClearFilters={clearFilters}/>
      <div className=' mb-5'>
      <div className=' text-zinc-300 text-xs flex items-center gap-1 '>
        <div>LightStore</div>
        <IoIosArrowForward className=' text-zinc-500 text-lg'/>
        <div>Catalog</div>
        <IoIosArrowForward className=' text-zinc-500 text-lg'/>
        <div>{key}</div>
      </div>
      <div className=' text-xl font-semibold mt-5'>{key}</div>
      </div>
      
      <div className='flex flex-wrap w-full'>
        {currentProducts.map((product, i) => (
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
      <Pagination
        totalItems={filteredProducts.length}
        itemsPerPage={itemsPerPage}
        currentPage={currentPage}
        onPageChange={setCurrentPage}
      />
    </div>
  )
}

export default Catalog
