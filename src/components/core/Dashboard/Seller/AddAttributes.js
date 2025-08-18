import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setAttributesRedux, setStep } from '../../../../slices/productSlice';
import { addProduct, createAttributes,updateAttribute } from '../../../../oprations/productApi';
import { RiDeleteBin6Line } from "react-icons/ri";
import { IoCloseOutline } from "react-icons/io5";

const AddAttributes = () => {
  const dispatch = useDispatch();
  const { productType, product, editProduct } = useSelector((state) => state.product);
  const { token } = useSelector((state) => state.auth);
  const [editAttributes, setEditAttributes] = useState("");
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

  useEffect(() => {
    if (editProduct && product.attributes) {
      setEditAttributes(product.attributes);
      setAttributes((prev) => ({
        type: product.attributes.type
      }));
    }
  }, [editProduct, product]);

  const handleAttributeData = (e) => {
    const { name, value } = e.target;

    setAttributeData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const addAttributeValue = () => {
    const { name, value } = attributeData;

    if (value && name) {
      setCurrentAttribute((prev) => ({
        ...prev,
        name: name || prev.name,
        values: [...prev.values, value]
      }));

      setAttributeData((prev) => ({
        ...prev,
        value: ""
      }));
    }
  };

  const createAttribute = () => {
    const { name, values } = currentAttribute;

    if (name && values.length > 0) {
      setAttributes((prev) => ({
        type: [...prev.type, { name, values }]
      }));

      setCurrentAttribute({
        name: "",
        values: []
      });

      setAttributeData({
        name: "",
        value: ""
      });
    }
  };

  // Function to delete an attribute
  const deleteAttribute = (index) => {
    setAttributes((prev) => ({
      type: prev.type.filter((_, i) => i !== index)
    }));
  };

  // Function to delete a specific value within an attribute
  const deleteAttributeValue = (attributeIndex, valueIndex) => {
    setAttributes((prev) => ({
      type: prev.type.map((attribute, i) => {
        if (i === attributeIndex) {
          return {
            ...attribute,
            values: attribute.values.filter((_, vIdx) => vIdx !== valueIndex)
          };
        }
        return attribute;
      })
    }));
  };

  const handleSubmit = async () => {
   
    if (productType === "property-product" && attributes) {
      if(editProduct && product.attributes){
        const attributeId=editAttributes._id;
        const result=await updateAttribute(attributes,attributeId,token);
        if(result) console.log("attribute updated successfully ",result);
        dispatch(setStep(3))
        return;
      }
      const productId = product._id;
      const result = await createAttributes(attributes, productId, token);
      if (result) console.log("Product saved successfully", result);
    }

    dispatch(setStep(3)); // Move to the next step
  };

  return (
    <div className="p-4 border border-zinc-700 rounded-lg shadow-lg">
      <h1 className="text-xl font-semibold mb-4">Add Attributes</h1>
      <div className="flex flex-col gap-4">
        {/* Input for attribute name */}
        <input
          type="text"
          className="placeholder:text-zinc-600 bg-transparent border border-zinc-700 focus:border-teal-800 py-2 px-3 outline-none rounded-lg"
          placeholder="Attribute name"
          name="name"
          value={attributeData.name}
          onChange={handleAttributeData}
        />

        {/* Input for attribute value and button to add the value */}
        <div className="flex gap-2">
          <input
            className="placeholder:text-zinc-600 bg-transparent border border-zinc-700 focus:border-teal-800 py-2 px-3 outline-none rounded-lg"
            placeholder="Attribute value"
            name="value"
            value={attributeData.value}
            onChange={handleAttributeData}
          />
          <button
            className="py-2 px-3 rounded-md bg-teal-800 text-zinc-950"
            onClick={addAttributeValue}
          >
            Add Value
          </button>
        </div>

        {/* Button to create and store the attribute */}
        <button
          className="mt-2 py-2 px-4 rounded-md bg-teal-800 text-white"
          onClick={createAttribute}
        >
          Create Attribute
        </button>

        {/* Display the current attribute being created */}
        <div className="mt-4 border border-zinc-700 rounded-lg p-2">
          <strong>Current Attribute:</strong> {currentAttribute.name}
          <ul className="list-disc pl-5">
            {currentAttribute.values.map((value, index) => (
              <li key={index} className="mb-1">{value}</li>
            ))}
          </ul>
        </div>

        {/* Display all added attributes with delete functionality */}
        <div className="mt-4  rounded-lg p-2">
          <h2 className="font-semibold mb-2">All Attributes:</h2>
          <ul>
            {attributes.type.map((attribute, index) => (
              <li key={index} className="mb-3 border border-zinc-700 rounded-lg  py-4">
                <div className="flex items-center justify-between mb-2 px-3 pb-2 border-b border-b-zinc-700">
                  <strong>{attribute.name}:</strong>
                  <button
                    className=" text-xl"
                    onClick={() => deleteAttribute(index)}
                  >
                    <IoCloseOutline/>
                  </button>
                </div>
                <ul className="list-disc pl-5 pr-5 text-sm">
                  {attribute.values.map((value, valueIndex) => (
                    <li key={valueIndex} className="mb-1 flex justify-between items-center">
                      {value}
                      <button
                        className="text-red-500 ml-2 text-xs"
                        onClick={() => deleteAttributeValue(index, valueIndex)}
                      >
                        <RiDeleteBin6Line/>
                      </button>
                    </li>
                  ))}
                </ul>
              </li>
            ))}
          </ul>
        </div>

        {/* Submit all attributes */}
        <button
          className="mt-4 py-2 px-4 rounded-md bg-teal-800"
          onClick={handleSubmit}
        >
          Submit All Attributes
        </button>
      </div>
    </div>
  );
};

export default AddAttributes;
