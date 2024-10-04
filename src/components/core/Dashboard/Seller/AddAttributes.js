import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setAttributesRedux, setStep } from '../../../../slices/productSlice';
import { addProduct, createAttributes } from '../../../../oprations/productApi';

const AddAttributes = () => {
  const dispatch = useDispatch();
  const {productType,product}=useSelector((state)=>state.product)
  const { token } = useSelector((state) => state.auth)
  const [attributes, setAttributes] = useState({
    type: [] // Start with an empty array for attributes
  });

  const [attributeData, setAttributeData] = useState({
    name: "", // Holds the name of the current attribute being added
    value: "" // Holds the value being added to the current attribute
  });

  const [currentAttribute, setCurrentAttribute] = useState({
    name: "", // Name of the attribute being created
    values: [] // Array to hold values for the current attribute
  });

  const handleAttributeData = (e) => {
    const { name, value } = e.target;

    setAttributeData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const addAttributeValue = () => {
    const { name, value } = attributeData;

    // Ensure both attribute name and value are set
    if (value && name) {
      setCurrentAttribute((prev) => ({
        ...prev,
        name: name || prev.name, // Set or keep the attribute name
        values: [...prev.values, value] // Add the new value
      }));

      // Reset only the value field
      setAttributeData((prev) => ({
        ...prev,
        value: ""
      }));
    }
  };

  const createAttribute = () => {
    const { name, values } = currentAttribute;

    // Ensure an attribute with a name and values exists before adding
    if (name && values.length > 0) {
      setAttributes((prev) => ({
        type: [...prev.type, { name, values }] // Add the current attribute
      }));

      // Reset current attribute after adding
      setCurrentAttribute({
        name: "",
        values: []
      });

      // Clear the attribute input fields
      setAttributeData({
        name: "",
        value: ""
      });
    }
  };

  const handleSubmit = async () => {
    console.log("Submitted Attributes:", attributes);
    if (productType === "property-product" && attributes) {
      // Prepare attributes for the backend in the correct format
      

      const productId= product.product._id
      // Send all attributes at once via createAttributes
      const result=await createAttributes(attributes,productId, token);
      if(result)
      console.log("product saved sucessfully",result)
    }
   // dispatch(setAttributesRedux(attributes)); // Dispatch the attributes to Redux
    dispatch(setStep(3)); // Move to the next step
  };

  return (
    <div className="p-4 border border-slate-700 rounded-lg shadow-lg">
      <h1 className='text-xl font-semibold mb-4'>Add Attributes</h1>
      <div className='flex flex-col gap-4'>
        {/* Input for attribute name */}
        <input 
          type='text' 
          className='placeholder:text-slate-600 bg-transparent border border-slate-700 focus:border-sky-500 py-2 px-3 outline-none rounded-lg' 
          placeholder='Attribute name' 
          name='name' 
          value={attributeData.name} 
          onChange={handleAttributeData}
        />
        
        {/* Input for attribute value and button to add the value */}
        <div className='flex gap-2'>
          <input 
            className='placeholder:text-slate-600 bg-transparent border border-slate-700 focus:border-sky-500 py-2 px-3 outline-none rounded-lg' 
            placeholder='Attribute value' 
            name='value' 
            value={attributeData.value} 
            onChange={handleAttributeData}
          />
          <button 
            className='py-2 px-3 rounded-md bg-sky-500 text-slate-950' 
            onClick={addAttributeValue}
          >
            Add Value
          </button>
        </div>

        {/* Button to create and store the attribute */}
        <button 
          className='mt-2 py-2 px-4 rounded-md bg-sky-500 text-white' 
          onClick={createAttribute}
        >
          Create Attribute
        </button>

        {/* Display the current attribute being created */}
        <div className='mt-4 border border-slate-700 rounded-lg p-2'>
          <strong>Current Attribute:</strong> {currentAttribute.name}
          <ul className='list-disc pl-5'>
            {currentAttribute.values.map((value, index) => (
              <li key={index} className='mb-1'>{value}</li>
            ))}
          </ul>
        </div>

        {/* Display all added attributes */}
        <div className='mt-4 border border-slate-700 rounded-lg p-2'>
          <h2 className='font-semibold mb-2'>All Attributes:</h2>
          <ul>
            {attributes.type.map((attribute, index) => (
              <li key={index} className='mb-2'>
                <div className='flex items-center justify-between'>
                  <strong>{attribute.name}:</strong>
                  <span className='text-sm text-gray-600'>{attribute.values.length} values</span>
                </div>
                <ul className='list-disc pl-5'>
                  {attribute.values.map((value, idx) => (
                    <li key={idx} className='mb-1'>{value}</li>
                  ))}
                </ul>
              </li>
            ))}
          </ul>
        </div>

        {/* Submit all attributes */}
        <button 
          className='mt-4 py-2 px-4 rounded-md bg-sky-500' 
          onClick={handleSubmit}
        >
          Submit All Attributes
        </button>
      </div>
    </div>
  );
}

export default AddAttributes;
