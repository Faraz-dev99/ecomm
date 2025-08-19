import React, { useEffect, useState } from 'react'
import { FaCloudUploadAlt } from "react-icons/fa";
import { IoMdClose } from "react-icons/io";
import { useDispatch, useSelector } from 'react-redux';
import { addProduct, updateProduct } from '../../../../../../oprations/productApi'
import { FaAngleDown } from "react-icons/fa";
import ProductDetails from '../../../../../../pages/ProductDetails';
import { apiConnect } from '../../../../../../oprations/apiConnect';

import axios from 'axios';
import { setProduct, setProductTypeRedux, setStep } from '../../../../../../slices/productSlice';
import PublishSteps from '../../PublishSteps';
import { clothingSizes } from '../../../../../../data/productFormData';
import { baseUrl } from '../../../../../../oprations/api';
import { useParams } from 'react-router';
const ProductForm = () => {
  const [categories, setCategories] = useState([]);
  const [sizeDropDown,setSizeDropDown]=useState(false);
  const [selectedSizes, setSelectedSizes] = useState([]);
  const [selectedSizeIds, setSelectedSizeIds] = useState([]);
  const [appliedSizes, setAppliedSizes] = useState([]);
  const {userDetails}=useSelector((state)=>state.user)
  const [selectedCategory, setSelectedCategory] = useState("");
  const {editProduct,product}=useSelector((state)=>state.product);
  const params=useParams();
  const [productInformation, setProductInformation] = useState({
    name: "",
    description: "",
    brand: "",
    price: "",
    color: [{
      name:"red"
    }],
    image1: [],
    image2: [],
    image3: [],
    image4: [],
    category: "",
    stock: "",
  })
 
  const [productType, setProductType] = useState("simple-product");
  const [selectedColor, setSelectedColor] = useState({
    name:'red'
  });

  const { token } = useSelector((state) => state.auth)

  const [isrequired, setIsrequired] = useState(false);

  const dispatch = useDispatch()

  useEffect(() => {
    if(editProduct){
      console.log("edit product",product)
      if(product.attributes)
        setProductType('property-product')
       setProductInformation({
        name: product.name,
        description: product.description,
        brand: product.brand,
        price: product.price,
        color: product.color,
        image1: [null,product.images[0].secure_url],
        image2: [null,product.images[1].secure_url],
        image3: [null,product.images[2].secure_url],
        image4: [null,product.images[3].secure_url],
        stock: product.stock,
      })
    }
    const fetchCategory = async () => {
      
      try {

        let response = await fetch(`${baseUrl}product/getCategories`, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `berear ${token}`,
            'Cache-Control': 'no-cache',
          },
          cache: 'no-store',
        });
        response = await response.json();
        if (!response.success) {
          console.log("failed")
          return
        }

        let categoryId = response.categories.map((e) => {
          return e._id
        })
        // console.log(categoryId)
        setCategories(response.categories)
        setProductInformation((prev) => {
          return {
            ...prev,
            category: response.categories[0]._id
          }
        })
        console.log("checking ", productInformation.category)

      }
      catch (err) {
        console.log("err", err.response)
      }
    }
    fetchCategory();
  }, [])

  const handleSelectColor = (e) => {
    const sc={
      name:e.target.value
    }
    setSelectedColor(sc);
  };

 // Handle selecting/unselecting sizes via checkboxes
 const handleSizeSelect = (sizeId) => {
  if (selectedSizeIds.includes(sizeId)) {
    setSelectedSizeIds(selectedSizeIds.filter(id => id !== sizeId));
  } else {
    setSelectedSizeIds([...selectedSizeIds, sizeId]);
  }
};

// Apply changes to add the selected sizes to the appliedSizes state with initial stock
const applySizeChanges = () => {
  const sizesToApply = clothingSizes
    .filter(size => selectedSizeIds.includes(size.id))
    .map(size => ({ size: size.size, stock: 0 }));

  setAppliedSizes(sizesToApply);
};

// Clear the selected sizes and reset the form
const clearFilter = () => {
  setSelectedSizeIds([]);
  setAppliedSizes([]);
};

const handleStockChange = (index, value) => {
  // Convert the value to a number to remove leading zeros
  const stockValue = value === "" ? "" : Math.max(0, parseInt(value));
  
  const updatedSizes = appliedSizes.map((s, i) => {
    if (i === index) {
      return { ...s, stock: stockValue };
    }
    return s;
  });
  
  setAppliedSizes(updatedSizes);
  console.log("applied sizes: ",appliedSizes)
};



  

  const handleFormData = (e) => {
    let name = e.name;
    let value = e.value;

    const file = e.files ? e.files[0] : null;
    if (file) {
      let preview = URL.createObjectURL(file);
      setProductInformation((prev) => {
        return {
          ...prev,
          [name]: [file, preview]
        }
      })
      console.log(preview)
      return;
    }
    /* if (name === "color") {
      let flag = true;
      productInformation.color.forEach((e) => {
        if (selectedColor === e) {
          flag = false;
          return
        }
      })
      if (flag) {
        setProductInformation((prev) => {
          return {
            ...prev,
            color: [...prev.color, selectedColor]
          }
        });
      }

      return;
    } */
    setProductInformation((prev) => {
      return {
        ...prev,
        [name]: value
      }
    })

  }

  //push selected color
  const pushSelectedColor=(color)=>{
    const colorExist=productInformation.color.some((cl)=>cl.name===color)
    if(colorExist){
      return false;
    }
    setProductInformation((prev)=>{
      return {
        ...prev,
        color:[
          ...prev.color,
          {
            name:color
          }
        ]
      }
    })
  }
  const closeImage = (e) => {

    setProductInformation((prev) => {
      return {
        ...prev,
        [e]: []
      }
    })
  }

  const handleSelectedCategory = (value, categories) => {
    const slc = categories.find((e) => e._id === value)
    console.log("value is of slc", slc.name)
    setSelectedCategory(slc?.name)
  }

  const dispatchProduct = async (e) => {
    e.preventDefault();

    if (!productInformation.name || !productInformation.description || !productInformation.brand || !productInformation.price || !productInformation.color || !productInformation.image1 || !productInformation.image2 || !productInformation.image3 || !productInformation.image4 || !productInformation.category || (!productInformation.stock && selectedCategory!=="Clothing") || (appliedSizes.length === 0 && selectedCategory==="Clothing")) {
      setIsrequired(true);
      return;
    }

    
    const formData = new FormData();

    // Append text data
    formData.append('name', productInformation.name);
    formData.append('description', productInformation.description);
    if(selectedCategory==="Clothing"){
      const sizes=JSON.stringify(appliedSizes);
      formData.append('sizes',sizes);
    }
    else{
      formData.append('stock', productInformation.stock);
    }
    formData.append('brand', productInformation.brand);
    formData.append('price', productInformation.price);
    formData.append('color', JSON.stringify(productInformation.color));
    console.log(productInformation.color)


    if (productInformation.image1[0]) formData.append('images', productInformation.image1[0]);
    if (productInformation.image2[0]) formData.append('images', productInformation.image2[0]);
    if (productInformation.image3[0]) formData.append('images', productInformation.image3[0]);
    if (productInformation.image4[0]) formData.append('images', productInformation.image4[0]);
    if(userDetails?.role==="Seller" || userDetails?.role==="Admin") formData.append('seller',userDetails._id)
    

    formData.append('category', productInformation.category);

    
    
    
console.log("doing the work")

if(editProduct){
  const id=params.id;
  formData.append("productId",id)
      const updateResult=await updateProduct(formData,token);
      if(updateResult){
        console.log("update result is : ",updateResult)
        dispatch(setProduct(updateResult));
        dispatch(setProductTypeRedux(productType));
        dispatch(setStep(2));
      }
      return;
}

    const result = await addProduct(formData, token)
    if(result){
      console.log("product result is ::: ",result)
      dispatch(setProduct(result.product))
      dispatch(setProductTypeRedux(productType))
      dispatch(setStep(2));
    }
    
  }

  const handleProductType = (e) => {
    const value = e.target.value;
    setProductType(value);

  }

  useEffect(() => {
    dispatch(setProductTypeRedux(productType));
  }, [productType])

  return (
    <div>
      <div>

        <h2 className=' text-slate-300 text-lg font-semibold mb-6'>Product Information</h2>

        <div className='flex flex-wrap gap-2 items-center'>
          <div>product type:</div>
          <select className='outline-none py-2 px-2 text-slate-600 bg-transparent  border border-slate-700 focus:border-teal-600 rounded-lg' value={productType} onChange={handleProductType}>
            <option value={"simple-product"}>simple product</option>
            <option value={"property-product"}>property product</option>
          </select>
        </div>
        <form className=' flex flex-col gap-3 my-2 text-sm' style={{ maxWidth: '548px' }}>
          <div className=' flex flex-col'>
            <input placeholder='Product Name' className=' placeholder:text-slate-600 bg-transparent border-b border-b-slate-700 focus:border-b-teal-600  py-3 px-2 outline-none' name='name' value={productInformation.name} onChange={(e) => handleFormData(e.target)} />
            {isrequired && !productInformation.name ? <div className=' mt-1 text-red-600 text-xs'>*product name is required</div> : null}
          </div>
          <div className=' flex flex-col gap-1'>
            <textarea placeholder='Product Description' rows='4' className=' placeholder:text-slate-600 resize-none bg-transparent border-b border-b-slate-700 focus:border-b-teal-600 overflow-hidden border-slate-400 py-3 px-2 outline-none' name='description' value={productInformation.description} onChange={(e) => handleFormData(e.target)} />
            {isrequired && !productInformation.description ? <div className=' mt-1 text-red-600 text-xs'>*product description is required</div> : null}
          </div>
          <div className=' flex max-476:flex-col  gap-3'>
            <div className=' flex flex-col text-slate-600 gap-3 w-full'>

              <select className=' outline-none py-2 px-2 bg-transparent border border-slate-700 focus:border-teal-600 rounded-lg w-full' name='category' value={productInformation.category} onChange={(e) => { handleFormData(e.target); handleSelectedCategory(e.target.value, categories) }}>
                <option disabled>select category</option>
                {categories.map((e, i) => {
                  return <option key={i} value={e._id}>{e.name}</option>
                })}

              </select>



              <div className=' flex flex-col gap-2'>
                <div className=' flex gap-2'>
                  <select className=' outline-none py-2 px-2 bg-transparent border border-slate-700 focus:border-teal-600 rounded-lg w-full' value={selectedColor.name} onChange={handleSelectColor}>
                    <option disabled>select Color</option>
                    <option>red</option>
                    <option >yellow</option>
                    <option>purple

                    </option>
                  </select>
                  <input type='button' className=' py-2 px-2 bg-teal-600 text-slate-950 rounded-md max-w-16 text-center' name="color" value="add" onClick={(e) => pushSelectedColor(selectedColor.name)} />
                </div>

                <div className=' flex gap-2 px-2'>
                  {productInformation.color.map((e, i) => {
                    return <div key={i} className={`  h-5 w-5 rounded-full`} style={{ background: e.name }}></div>
                  })}
                </div>
              </div>



            </div>
            <div className=' flex gap-2 w-full'>
              <div>
                <input placeholder='Brand' className=' placeholder:text-slate-600 bg-transparent border-b border-b-slate-700 focus:border-b-teal-600 py-3 px-2 w-full  outline-none' name='brand' value={productInformation.brand} onChange={(e) => handleFormData(e.target)} />
                {isrequired && !productInformation.brand ? <div className=' mt-1 text-red-600 text-xs'>*product brand is required</div> : null}
              </div>

              <div>
                <input type='number' placeholder='Price' className=' placeholder:text-slate-600 bg-transparent border-b border-b-slate-700 focus:border-b-teal-600 py-3 px-2 w-full  outline-none' name='price' value={productInformation.price} onChange={(e) => handleFormData(e.target)} />
                {isrequired && !productInformation.price ? <div className=' mt-1 text-red-600 text-xs'>*product price is required</div> : null}
              </div>



            </div>
            {
              (selectedCategory !== "Clothing") && <div>
                <input type='number' placeholder='Stock' className=' placeholder:text-slate-600 bg-transparent border-b border-b-slate-700 focus:border-b-teal-600 max-476:col-span-2 py-3 px-2 w-full  outline-none' name='stock' value={productInformation.stock} onChange={(e) => { handleFormData(e.target) }} />
                {isrequired && !productInformation.stock ? <div className=' mt-1 text-red-600 text-xs'>*product stock is required</div> : null}
              </div>
            }


          </div>
         
          {
  selectedCategory === "Clothing" && (
    <div className="flex flex-col text-slate-600">
      
      {/* Size dropdown with Apply and Clear buttons */}
      <div className="flex justify-between items-center gap-2 border border-slate-600 py-2 px-2 rounded-md cursor-pointer">
        <div onClick={() => setSizeDropDown(!sizeDropDown)} className="flex-grow flex justify-between items-center">
          <span>Select Size</span>
          <span><FaAngleDown/></span>
        </div>
        
      </div>

      {/* Size selection checkboxes */}
      {sizeDropDown && (
        <div className=' bg-slate-800 py-2 px-2'>
           <div className="grid grid-cols-2 gap-2 py-2 px-2  text-slate-300 max-w-56 mt-2">
          {clothingSizes.map((e) => (
            <div key={e.id} className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={selectedSizeIds.includes(e.id)}
                onChange={() => handleSizeSelect(e.id)}
              />
              <span>{e.size}</span>
            </div>
          ))}
        </div>
          <div className="flex gap-2 mt-4">
          <div 
            className=" cursor-pointer text-sm text-teal-600 px-2 py-2 rounded-md"
            onClick={applySizeChanges}
          >
            Apply Changes
          </div>
          <div 
            className=" cursor-pointer bg-red-600 text-white px-2 py-2 rounded-md"
            onClick={clearFilter}
          >
            Clear Filter
          </div>
        </div>
        </div>
       
      )}
      

      {/* Display applied sizes with stock fields */}
      {appliedSizes.length > 0 && (
        <div className="mt-4">
          
          <div className="font-bold text-slate-300">
          <div className='flex justify-between gap-2 items-center mb-4'>
                  <span>size</span>
                  <span>stock</span>
                </div>
            {appliedSizes.map((s, i) => (
                
                <div key={i} className="flex justify-between gap-2 items-center mb-2">
                <span>{s.size}</span>
                <input
                  type="number"
                  className="border border-slate-400 rounded-md px-2 py-1 text-slate-800 w-16"
                  placeholder="Stock"
                  value={s.stock}
                  onChange={(e) => handleStockChange(i, e.target.value)}
                />
              </div>
            ))}
          </div>
        </div>
      )}
      {isrequired && appliedSizes.length===0 ? <div className=' mt-1 text-red-600 text-xs'>*select atleast one size</div> : null}
    </div>
  )
}




          <div className=' flex flex-col gap-2'>
            <div className='grid grid-cols-2 max-sm:grid-cols-1  gap-3 place-items-center'>

              <div className=' w-full max-w-64'>
                <div className=' mb-2'>thunmbnail</div>
                <div className=' relative rounded-md overflow-hidden'>
                  <label htmlFor={!productInformation.image1[1] ? 'image1' : null} className='flex justify-center items-center bg-slate-700 h-60 w-full rounded-md'>
                    <div><FaCloudUploadAlt className=' text-slate-200 text-4xl' style={{ fontSize: '30px' }} /></div>

                    {productInformation.image1[1] && (
                      <><img className='w-full h-full absolute top-0 left-0' src={productInformation.image1[1]} alt="Preview" />
                      </>
                    )}
                  </label>
                  {productInformation.image1[1] && <div className=' absolute top-0 right-0 z-50 cursor-pointer' onClick={() => closeImage('image1')}><IoMdClose className=' text-white text-3xl' /></div>}
                  <input type='file' id='image1' name='image1' onChange={(e) => !productInformation.image1[1] ? handleFormData(e.target) : null} className=' hidden' />
                  {isrequired && !productInformation.image1[0] ? <div className=' mt-1 text-red-600 text-xs'>*product thumbnail is required</div> : null}
                </div>
              </div>


              <div className=' w-full max-w-64'>
                <div className=' mb-2'>back image</div>
                <div className=' relative rounded-md overflow-hidden'>
                  <label htmlFor={!productInformation.image2[1] ? 'image2' : null} className='flex justify-center items-center bg-slate-700 h-60 w-full rounded-md'>
                    <div><FaCloudUploadAlt className=' text-slate-200 text-4xl' style={{ fontSize: '30px' }} /></div>

                    {productInformation.image2[1] && (
                      <><img className='w-full h-full absolute top-0 left-0' src={productInformation.image2[1]} alt="Preview" />
                      </>
                    )}
                  </label>
                  {productInformation.image2[1] && (<div className=' absolute top-0 right-0 z-50 cursor-pointer' onClick={() => closeImage('image2')}><IoMdClose className=' text-white text-3xl' /></div>)}
                  <input type='file' id='image2' name='image2' onChange={(e) => !productInformation.image2[1] ? handleFormData(e.target) : null} className=' hidden' />
                  {isrequired && !productInformation.image2[0] ? <div className=' mt-1 text-red-600 text-xs'>*product back image is required</div> : null}
                </div>
              </div>


              <div className=' w-full max-w-64'>
                <div className=' mb-2'>side1</div>
                <div className=' relative rounded-md overflow-hidden'>
                  <label htmlFor={!productInformation.image3[1] ? 'image3' : null} className='flex justify-center items-center bg-slate-700 h-60 w-full rounded-md'>
                    <div><FaCloudUploadAlt className=' text-slate-200 text-4xl' style={{ fontSize: '30px' }} /></div>

                    {productInformation.image3[1] && (
                      <><img className='w-full h-full absolute top-0 left-0' src={productInformation.image3[1]} alt="Preview" />
                      </>
                    )}
                  </label>
                  {productInformation.image3[1] && <div className=' absolute top-0 right-0 z-50 cursor-pointer' onClick={() => closeImage('image3')}><IoMdClose className=' text-white text-3xl' /></div>}
                  <input type='file' id='image3' name='image3' onChange={(e) => !productInformation.image3[1] ? handleFormData(e.target) : null} className=' hidden' />
                  {isrequired && !productInformation.image3[0] ? <div className=' mt-1 text-red-600 text-xs'>*product side1 is required</div> : null}
                </div>
              </div>

              <div className=' w-full max-w-64'>
                <div className=' mb-2'>side2</div>
                <div className=' relative rounded-md overflow-hidden'>
                  <label htmlFor={!productInformation.image4[1] ? 'image4' : null} className='flex justify-center items-center bg-slate-700 h-60 w-full rounded-md'>
                    <div><FaCloudUploadAlt className=' text-slate-200 text-4xl' style={{ fontSize: '30px' }} /></div>

                    {productInformation.image4[1] && (
                      <><img className='w-full h-full absolute top-0 left-0' src={productInformation.image4[1]} alt="Preview" />
                      </>
                    )}
                  </label>
                  {productInformation.image4[1] && <div className=' absolute top-0 right-0 z-50 cursor-pointer' onClick={() => closeImage('image4')}><IoMdClose className=' text-white text-3xl' /></div>}
                  <input type='file' id='image4' name='image4' onChange={(e) => !productInformation.image4[1] ? handleFormData(e.target) : null} className=' hidden' />
                  {isrequired && !productInformation.image4[0] ? <div className=' mt-1 text-red-600 text-xs'>*product side2 is required</div> : null}
                </div>
              </div>



            </div>


          </div>
          <div className=' flex justify-end w-full my-4'>
            <button className=' py-2 px-6 bg-teal-600 text-slate-950  rounded-lg' onClick={dispatchProduct}>Next</button>

          </div>

        </form>
      </div>
    </div>
  )
}

export default ProductForm
