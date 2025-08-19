import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import { baseUrl } from '../oprations/api';
import DotLoader from '../components/common/DotLoader';
import { Product } from '../filespath';
import Filtermenu from '../components/core/Dashboard/filter/Filtermenu';
import Pagination from '../components/common/pagination/Pagination';


const Search = () => {
  const { key } = useParams();
  const [searchedProducts, setSearchedProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loader, setLoader] = useState(true);



  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20; 

  useEffect(() => {
    const getSearchedProduct = async () => {
      try {
        const response = await fetch(`${baseUrl}product/searchProduct/${key}`);
        if (!response.ok) {
          if (response.status === 404) {
            setSearchedProducts([]);
            setFilteredProducts([]);
            setLoader(false);
          }
          return;
        }
        const items = await response.json();
        if (items.success) {
          setSearchedProducts(items.products);
          setFilteredProducts(items.products);
          setLoader(false);
        }
      } catch (err) {
        console.log("Error fetching searched products", err);
      }
    };
    getSearchedProduct();
  }, [key]);

  const handleFilterChange = (newFilters) => {
    const { categories, minPrice, maxPrice, sortBy } = newFilters;

    const filtered = searchedProducts.filter(product => {
      const categoryMatch = categories.length === 0 || categories.includes(product.category);
      const priceMatch = 
        (minPrice === '' || product.price >= minPrice) &&
        (maxPrice === '' || product.price <= maxPrice);
      return categoryMatch && priceMatch && product.status === "Published";
    });

    if (sortBy === 'lowToHigh') {
      filtered.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'highToLow') {
      filtered.sort((a, b) => b.price - a.price);
    } else if (sortBy === 'newest') {
      filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }

    setFilteredProducts(filtered);
    setCurrentPage(1); // Reset to first page after filtering
  };

  const clearFilters = () => {
    setFilteredProducts(searchedProducts);
    setCurrentPage(1);
  };

  // Calculate the products to show on the current page
  const indexOfLastProduct = currentPage * itemsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - itemsPerPage;
  const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct);

  if (loader) {
    return (
      <div className='max-md:min-h-[calc(100vh-101.6px)] md:min-h-[calc(100vh-117.6px)] grid place-items-center'>
        <DotLoader />
      </div>
    );
  }

  if (!loader && filteredProducts.length === 0) {
    return (
      <div className='flex flex-col justify-center relative px-4'>
        <Filtermenu onFilterChange={handleFilterChange} onClearFilters={clearFilters} />
        <div className='max-md:min-h-[calc(100vh-101.6px)] md:min-h-[calc(100vh-117.6px)] grid place-items-center text-slate-400 text-lg font-semibold'>
          No result found!
        </div>
      </div>
    );
  }

  return (
    <div className='flex flex-col justify-center relative my-10 px-4 '>
      <Filtermenu onFilterChange={handleFilterChange} onClearFilters={clearFilters} />
      <h1 className='text-sky-500 font-bold md:text-2xl max-md:text-xl mb-6'>
        search results for: {key}
      </h1>
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
  );
};

export default Search;
