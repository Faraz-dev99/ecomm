import React, { useEffect, useState } from 'react'
import { FaCloudUploadAlt } from "react-icons/fa";
import { IoMdClose } from "react-icons/io";
import { useDispatch, useSelector } from 'react-redux';
import { addProduct } from '../../../../oprations/productApi'
import ProductDetails from '../../../../pages/ProductDetails';
import { apiConnect } from '../../../../oprations/apiConnect';
import axios from 'axios';
const AddProduct = () => {
  const [categories,setCategories]=useState([]);
  const [productInformation, setProductInformation] = useState({
    name: "",
    description: "",
    brand: "",
    price: "",
    color: ["red"],
    image1: [],
    image2: [],
    image3: [],
    image4: [],
    category: "",
    stock: "",
  })
  const [selectedColor, setSelectedColor] = useState('red');

  const { token } = useSelector((state) => state.auth)

  const [isrequired, setIsrequired] = useState(false);

  const dispatch = useDispatch()

  useEffect(()=>{
    const fetchCategory=async()=>{
      try{

       /*  let posting = await fetch('http://localhost:5000/api/product/createCategory', {
          method: 'POST',
          body: JSON.stringify({ // Ensure the body is stringified
            name: "laptop"
          }),
          headers: {
            'Content-Type': 'application/json',
            Authorization: `berear ${token}`, // Fixed the spelling from 'berear' to 'Bearer'
            'Cache-Control': 'no-cache',
          },
          
          cache: 'no-store',
        }); */
  
        let response=await fetch('http://localhost:5000/api/product/getCategories',{
          headers:{
            'Content-Type':'application/json',
            Authorization:`berear ${token}`,
            'Cache-Control': 'no-cache',
          },
          cache: 'no-store', 
        });
        response=await response.json();
        if(!response.success){
          console.log("failed")
          return
        }
        
        let categoryId=response.categories.map((e)=>{
          return e._id
        })
        console.log(categoryId)
        setCategories(response.categories)
        setProductInformation((prev)=>{
          return {
            ...prev,
            category:response.categories[0]._id
          }
        })
        console.log("checking ",productInformation.category)
       
      }
      catch(err){
        console.log("err",err.response)
      }
    }
    fetchCategory();
  },[])

  const handleSelectColor = (e) => {
    setSelectedColor(e.target.value);
  };

  const handleFormData = (e) => {
    let name = e.name;
    let value = e.value;
    console.log("value is ",value)
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
    if (name === "color") {
      let flag=true;
      productInformation.color.forEach((e)=>{
        if(selectedColor===e){
          flag=false;
         return
        }
   })
      if(flag){
        setProductInformation((prev) => {
          return {
            ...prev,
            color: [...prev.color, selectedColor]
          }
        });
      }
      
      return;
    }
    setProductInformation((prev) => {
      return {
        ...prev,
        [name]: value
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

  const dispatchProduct = (e) => {
    e.preventDefault();

    if (!productInformation.name || !productInformation.description || !productInformation.brand || !productInformation.price || !productInformation.color || !productInformation.image1 || !productInformation.image2 || !productInformation.image3 || !productInformation.image4 || !productInformation.category || !productInformation.stock) {
      setIsrequired(true);
      return;
    }
    const formData = new FormData();

    // Append text data
    formData.append('name', productInformation.name);
    formData.append('description', productInformation.description);
    formData.append('brand', productInformation.brand);
    formData.append('price', productInformation.price);
    formData.append('color',productInformation.color.join(','));
    console.log(productInformation.color.join(','))

    if (productInformation.image1[0]) formData.append('images', productInformation.image1[0]);
    if (productInformation.image2[0]) formData.append('images', productInformation.image2[0]);
    if (productInformation.image3[0]) formData.append('images', productInformation.image3[0]);
    if (productInformation.image4[0]) formData.append('images', productInformation.image4[0]);

    formData.append('category', productInformation.category);
    formData.append('stock', productInformation.stock);




    dispatch(addProduct(formData, token, dispatch))

  }
  return (
    <div>
      <div>
        <h2 className=' text-slate-300 font-semibold mb-6'>Product Information</h2>
        <form className=' flex flex-col gap-3 my-2 text-sm' style={{ maxWidth: '548px' }}>
          <div className=' flex flex-col'>
            <input placeholder='Product Name' className=' placeholder:text-slate-600 bg-transparent border-b border-b-slate-700 focus:border-b-sky-500  py-3 px-2 outline-none' name='name' value={productInformation.name} onChange={(e) => handleFormData(e.target)} />
            {isrequired && !productInformation.name ? <div className=' mt-1 text-red-600 text-xs'>*product name is required</div> : null}
          </div>
          <div className=' flex flex-col gap-1'>
            <textarea placeholder='Product Description' rows='4' className=' placeholder:text-slate-600 resize-none bg-transparent border-b border-b-slate-700 focus:border-b-sky-500 overflow-hidden border-slate-400 py-3 px-2 outline-none' name='description' value={productInformation.description} onChange={(e) => handleFormData(e.target)} />
            {isrequired && !productInformation.description ? <div className=' mt-1 text-red-600 text-xs'>*product description is required</div> : null}
          </div>
          <div className=' flex max-476:flex-col  gap-3'>
            <div className=' grid max-476:grid-cols-2 max-476:grid-rows-2 gap-3 w-full'>
              <div>
                <input placeholder='Brand' className=' placeholder:text-slate-600 bg-transparent border-b border-b-slate-700 focus:border-b-sky-500 py-3 px-2 w-full  outline-none' name='brand' value={productInformation.brand} onChange={(e) => handleFormData(e.target)} />
                {isrequired && !productInformation.brand ? <div className=' mt-1 text-red-600 text-xs'>*product brand is required</div> : null}
              </div>

              <div>
                <input type='number' placeholder='Price' className=' placeholder:text-slate-600 bg-transparent border-b border-b-slate-700 focus:border-b-sky-500 py-3 px-2 w-full  outline-none' name='price' value={productInformation.price} onChange={(e) => handleFormData(e.target)} />
                {isrequired && !productInformation.price ? <div className=' mt-1 text-red-600 text-xs'>*product price is required</div> : null}
              </div>

              <div>
                <input type='number' placeholder='Stock' className=' placeholder:text-slate-600 bg-transparent border-b border-b-slate-700 focus:border-b-sky-500 max-476:col-span-2 py-3 px-2 w-full  outline-none' name='stock' value={productInformation.stock} onChange={(e) => handleFormData(e.target)} />
                {isrequired && !productInformation.stock ? <div className=' mt-1 text-red-600 text-xs'>*product stock is required</div> : null}
              </div>

            </div>
            <div className=' flex flex-col text-slate-600 gap-3 w-full'>

              <select className=' outline-none py-2 px-2 bg-transparent border border-slate-700 focus:border-sky-500 rounded-lg w-full' name='category' value={productInformation.category} onChange={(e) => handleFormData(e.target)}>
                <option disabled>select category</option>
                {categories.map((e,i)=>{
                   return <option key={i} value={e._id}>{e.name}</option>
                })}
               
              </select>

              <div className=' flex flex-col gap-2'>
                <div className=' flex gap-2'>
                  <select className=' outline-none py-2 px-2 bg-transparent border border-slate-700 focus:border-sky-500 rounded-lg w-full' value={selectedColor} onChange={handleSelectColor}>
                    <option disabled>select Color</option>
                    <option>red</option>
                    <option >yellow</option>
                    <option>purple

                    </option>
                  </select>
                  <input type='button' className=' py-2 px-2 bg-sky-500 text-slate-950 rounded-md max-w-16 text-center' name="color" value="add" onClick={(e) => handleFormData(e.target)} />
                </div>

                <div className=' flex gap-2 px-2'>
                  {productInformation.color.map((e,i)=>{
                      return <div key={i} className={`  h-5 w-5 rounded-full`} style={{background:e}}></div>
                  })}
                </div>
              </div>



            </div>
          </div>
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
          <button className=' py-2 px-2 bg-sky-500 mt-4 text-white' onClick={dispatchProduct}>Add</button>
        </form>
      </div>
    </div>
  )
}

export default AddProduct
