import { createSlice } from "@reduxjs/toolkit";
import { act } from "react";
import { signup } from '../oprations/authApi'

const initialState = {
    product: "",
    categories: "",
    productType: "",
    attributesRedux:"",
    editProduct: false,
    step: 1
}

const productSlice = createSlice({
    name: 'product',
    initialState,
    reducers: {
        setProduct: (state, action) => {
            state.product = action.payload
        },
        setCategories: (state, action) => {
            state.categories = action.payload
        },
        setProductTypeRedux: (state, action) => {
            state.productType = action.payload
        },
        setEditProduct: (state, action) => {
            state.editProduct = action.payload
        },
        setStep:(state,action)=>{
            state.step=action.payload
        },
        setAttributesRedux:(state,action)=>{
            state.attributesRedux=action.payload
        },
        resetProductState:(state)=>{
            state.step = 1;
            state.product = null;
            state.productType=""
            state.editProduct = false;
            state.attributes=""
            state.categories=""
        }
    }
});

export const { setProduct, setCategories, setProductTypeRedux, setEditProduct,setStep,setAttributesRedux,resetProductState } = productSlice.actions;

export default productSlice.reducer;
