import React, { useEffect, useState } from 'react'
import { IoIosArrowBack } from "react-icons/io";
import { FaArrowRight } from "react-icons/fa";
import { fetchCategory } from '../../../../oprations/productApi';





const Filtermenu = ({ onFilterChange, onClearFilters }) => {
    const [toggleMenu, setToggleMenu] = useState(false);
    const [filterData, setFilterData] = useState({
        categories: [],  // Store category data
        minPrice: '',     // Store minimum price
        maxPrice: '',     // Store maximum price
        sortBy: ''        // New state for sorting
    });
    const [filterValues, setFilterValues] = useState({
        categories: [], // Store selected category IDs
        minPrice: '',    // Store selected min price
        maxPrice: '',    // Store selected max price
        sortBy: ''       // New field for selected sort order
    });
    useEffect(() => {
        const fetchCategoryFunc = async () => {
            const categories = await fetchCategory();
            if (categories.length > 0) {
                setFilterData((prev) => {
                    return {
                        ...prev,
                        categories: categories
                    }
                })
            }
            else {
                setFilterData((prev) => {
                    return {
                        ...prev,
                        categories: []
                    }
                })
            }
            console.log("categories : ", categories)
        }
        fetchCategoryFunc();
    }, [])


    // General handler for any filter
    const handleFilterChange = (field, value) => {
        setFilterValues((prev) => ({
            ...prev,
            [field]: value
        }));
    };


    // Toggle category selection
    const toggleCategorySelection = (categoryId) => {
        setFilterValues((prev) => ({
            ...prev,
            categories: prev.categories.includes(categoryId)
                ? prev.categories.filter((id) => id !== categoryId)
                : [...prev.categories, categoryId]
        }));
    };


    // Apply the filters immediately whenever filter values change
    useEffect(() => {
        const applyFilters = () => {
            // Here you would trigger an API call to fetch filtered products based on `filterValues`
            console.log("Applying Filters:", filterValues);
            onFilterChange(filterValues)

        };

        applyFilters(); // Apply filters when `filterValues` change
    }, [filterValues]);

    const handleClearFilters = () => {

        if (onClearFilters) {
            setFilterValues({
                categories: [],
                minPrice: '',
                maxPrice: '',
                sortBy: ''
            });
            onClearFilters();  // Make sure this function is being called properly
        }
    }

    return (
        <div>
            <div className=' fixed top-36 right-4 h-10 z-30 w-10 grid place-items-center rounded-full bg-slate-800 cursor-pointer' onClick={() => setToggleMenu(!toggleMenu)} >
                <IoIosArrowBack className=' text-2xl' />
            </div>
            <div className={`fixed w-0 top-0 right-0 bg-none transition-opacity duration-300 overflow-hidden ${toggleMenu ? 'grid place-items-end w-screen h-screen bg-slate-950/90 opacity-1' : 'opacity-0'}`} style={{zIndex:'1000'}}>

                <div className={` relative px-5 py-5 h-screen font-semibold bg-slate-900  overflow-auto transition-all duration-150  ${toggleMenu ? 'right-[0px]' : '-right-[300px]'} text-slate-400 w-[300px]`} >
                    <div className=' flex justify-between items-center gap-4 mb-5'>
                        <div className=' text-lg '>Filtering</div>
                        <div onClick={() => setToggleMenu(!toggleMenu)}><FaArrowRight className=' text-lg cursor-pointer' /></div>
                    </div>
                    <div className=' text-sm'>

                        <div>
                            <div className=' mb-3'>Categories</div>
                            <div className=' flex flex-wrap gap-1 text-xs'>
                                {
                                    filterData.categories.map((e, i) => {
                                        return <div key={i} onClick={() => toggleCategorySelection(e._id)} className={` rounded-xl border border-slate-600 py-1 px-2 cursor-pointer  ${filterValues.categories.includes(e._id) ? 'bg-sky-500' : 'bg-slate-800/95'}`}>{e.name}</div>
                                    })
                                }
                            </div>
                        </div>
                        {/* Price Range Section */}
                        <div className='mt-5'>
                            <div className='mb-3'>Price Range</div>
                            <div className='flex gap-2 text-xs'>
                                <input
                                    type='number'
                                    placeholder='Min'
                                    value={filterValues.minPrice}
                                    onChange={(e) => {
                                        const minPrice = e.target.value === "" ? "" : Number(e.target.value);
                                        setFilterValues((prev) => ({
                                            ...prev,
                                            minPrice: minPrice === "" || minPrice <= prev.maxPrice ? minPrice : prev.maxPrice
                                        }));
                                    }}
                                    className='w-1/2 px-2 py-1 outline-none bg-slate-800 border border-slate-600 text-white rounded'
                                />
                                <input
                                    type='number'
                                    placeholder='Max'
                                    max={'30000'}
                                    value={filterValues.maxPrice}
                                    onChange={(e) => {
                                        const maxPrice = e.target.value === "" ? "" : Number(e.target.value);
                                        setFilterValues((prev) => ({
                                            ...prev,
                                            maxPrice: maxPrice === "" || maxPrice >= prev.minPrice ? maxPrice : prev.minPrice
                                        }));
                                    }}
                                    className='w-1/2 px-2 py-1 outline-none bg-slate-800 border border-slate-600 text-white rounded'
                                />

                            </div>
                        </div>

                        {/* sortby section */}
                        <div className="mt-5">
                            <div className='mb-3'>Sort by</div>
                            <div className="flex gap-2 text-xs">

                                <button
                                    onClick={() => handleFilterChange('sortBy', 'lowToHigh')}
                                    className={`px-3 py-1 rounded-lg ${filterValues.sortBy === 'lowToHigh' ? 'bg-sky-500' : 'bg-slate-800/95'} `}
                                >
                                    Ascending
                                </button>
                                <button
                                    onClick={() => handleFilterChange('sortBy', 'highToLow')}
                                    className={`px-3 py-1 rounded-lg ${filterValues.sortBy === 'highToLow' ? 'bg-sky-500' : 'bg-slate-800/95'} `}
                                >
                                    Descending
                                </button>
                                <button
                                    onClick={() => handleFilterChange('sortBy', 'newest')}
                                    className={`px-3 py-1 rounded-lg ${filterValues.sortBy === 'newest' ? 'bg-sky-500' : 'bg-slate-800/95'} `}
                                >
                                    Newest
                                </button>
                            </div>
                        </div>

                        <div className=' mt-10'>

                            <button onClick={handleClearFilters} className=" text-xs text-slate-200 py-1 px-2 rounded-lg bg-slate-500">
                                Clear Filters
                            </button>
                        </div>

                    </div>

                </div>

            </div>

        </div>
    )
}

export default Filtermenu
