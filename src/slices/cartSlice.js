import { createSlice } from "@reduxjs/toolkit";

const initialState={
    cart:JSON.parse(localStorage.getItem("cart")) || [],
    totalCartItems:JSON.parse(localStorage.getItem("cart"))?.length || 0
}
const cartSlice=createSlice({
    name:'cart',
    initialState,
    reducers:{
        setCart:(state,action)=>{
            state.cart=action.payload;
            state.totalCartItems = action.payload.length;
        },
        settotalCartItems:(state,action)=>{
            state.cart=action.payload
        },
        removeItem:(state,action)=>{
            const itemId = action.payload; // Assuming payload contains the _id of the product to remove
            state.cart = state.cart.filter(item => item.productId !== itemId);
            state.totalCartItems = state.cart.length; // Update totalCartItems after removal
            localStorage.setItem("cart", JSON.stringify(state.cart));
        }
    }
})


export const {setCart,settotalCartItems,removeItem}=cartSlice.actions;
export default cartSlice.reducer;