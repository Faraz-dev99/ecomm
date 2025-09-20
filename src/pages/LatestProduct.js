import React, { useEffect, useState } from 'react';
import { baseUrl } from '../oprations/api';
import DotLoader from '../components/common/DotLoader';
import { Product } from '../filespath';
import Filtermenu from '../components/core/Dashboard/filter/Filtermenu';
import Pagination from '../components/common/pagination/Pagination';
import { apiConnect } from '../oprations/apiConnect';

const LatestProduct = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loader, setLoader] = useState(true);

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 40;

  useEffect(() => {
    const getProducts = async () => {
      try {
        const response = await apiConnect("get", "product/getProducts");

        if (response.data.success) {
          // Sort by createdAt (latest first)
          const sorted = [...response.data.products].sort(
            (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
          );

          setProducts(sorted);
          setFilteredProducts(sorted);
          setLoader(false);
        }
      } catch (err) {
        console.log("Error fetching latest products", err);
      }
    };

    getProducts();
  }, []);

  const handleFilterChange = (newFilters) => {
    const { categories, minPrice, maxPrice, sortBy } = newFilters;

    const filtered = products.filter((product) => {
      const categoryMatch =
        categories.length === 0 || categories.includes(product.category);
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
    } else if (sortBy === 'rating') {
      filtered.sort((a, b) => (b.averageRating || 0) - (a.averageRating || 0));
    }

    setFilteredProducts(filtered);
    setCurrentPage(1);
  };

  const clearFilters = () => {
    setFilteredProducts(products);
    setCurrentPage(1);
  };

  // Pagination
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
          No latest products found!
        </div>
      </div>
    );
  }

  return (
    <div className='flex flex-col justify-center relative my-10 px-4 '>
      <Filtermenu onFilterChange={handleFilterChange} onClearFilters={clearFilters} />
      <h1 className='text-teal-600 font-bold md:text-2xl max-md:text-xl mb-6'>
        Latest Products
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
            averageRating={product.averageRating}
            totalReviews={product.totalReviews}
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

export default LatestProduct;
