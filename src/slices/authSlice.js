import { createSlice } from "@reduxjs/toolkit";
import { act } from "react";
import {signup} from '../oprations/authApi'

const initialState={
    otpToken:null,
    accounttype:"",
    loading:"faraz",
    token:sessionStorage.getItem("token")?JSON.parse(sessionStorage.getItem('token')):null
}

const authSlice=createSlice({
    name:'auth',
    initialState,
    reducers:{
        setToken:(state,action)=>{
            state.token=action.payload
        },
        setLoading:(state,action)=>{
            state.loading=action.payload;
        }
        ,
        setOtpToken:(state,action)=>{
            state.otpToken=action.payload;
        }
    }
});

export const {setOtpToken,setLoading,setToken,setSeller,setAdmin}=authSlice.actions;

export default authSlice.reducer;
