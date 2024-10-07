import { combineReducers } from "@reduxjs/toolkit";
import authSlice from "../slices/authSlice";
import userSlice from "../slices/userSlice";
import productSlice from "../slices/productSlice";
import cartSlice from "../slices/cartSlice";

const rootReducer=combineReducers({
     auth:authSlice,
     user:userSlice,
     product:productSlice,
     cart:cartSlice
});

export default rootReducer;