import React, { useState,useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { setSignupData } from '../slices/authSlice';
import { signup } from '../oprations/authApi';
import { NavLink,useNavigate } from "react-router-dom";

const Signup = () => {
  const [userDetail,setuserDetail]=useState({
    username:'',
    email:'',
    password:''
  });
  
  const [seller,setSeller]=useState(false);
  const [isinvalid,setIsInvalid]=useState(false);
  const navigate=useNavigate();
  
  const dispatch=useDispatch();

  useEffect(()=>{
    const auth=sessionStorage.getItem('user');
    if(auth)
      navigate('/')
  },[])
  
//do something else

  const userInfo=(e)=>{
    let name=e.target.name;
    let value=e.target.value;
    setuserDetail((prev)=>{
         return ({
          ...prev,
          [name]:value
         })
    })
  }
  const addUser=(e)=>{
    e.preventDefault();
     
    let udata={
      username:userDetail.username,
      email:userDetail.email,
     password:userDetail.password,
     role:seller?'Seller':'Visitor'
    
    }

    if(!userDetail.email || !userDetail.username || !userDetail.password){
      setIsInvalid(true);
      return;
 }
 else{
  setIsInvalid(false);
    //dispatch(setSignupData(udata));
    dispatch(signup(udata,navigate,dispatch));
 }
    
   setuserDetail((prev)=>{
    return ({
      username:'',
      email:'',
      password:''
    })
})
  setSeller(false);

  }

  
  return (
    <div className='flex flex-col mx-6 justify-center items-center'>
      
      <form className='flex flex-col justify-center   my-3 w-full max-w-96  gap-6 py-8 px-10 rounded-lg border border-slate-800' onSubmit={addUser}>
      <h1 className=' text-2xl font-medium mb-4'>Signup</h1>
          <input type='text' placeholder='username' name='username' className=' bg-transparent outline-none border-b border-b-slate-700 pb-3 focus:border-b-sky-500' value={userDetail.username} onChange={userInfo}/>
          {isinvalid && !userDetail.username?<div className=' text-xs font-medium text-red-600 -mt-4'>*please fill out this field</div>:null}
          <input type='email' placeholder='email' name='email' className=' bg-transparent outline-none border-b border-b-slate-700 pb-3 focus:border-b-sky-500' value={userDetail.email} onChange={userInfo}/>
          {isinvalid && !userDetail.email?<div className=' text-xs font-medium text-red-600 -mt-4'>*please fill out this field</div>:null}
          <input type='password' placeholder='password' name='password' className=' bg-transparent outline-none border-b border-b-slate-700 pb-3 focus:border-b-sky-500' value={userDetail.password} onChange={userInfo}/>
          {isinvalid && !userDetail.password?<div className=' text-xs font-medium text-red-600 -mt-4'>*please fill out this field</div>:null}
          <div className=' flex gap-2 text-zinc-300 text-sm font-normal'><span>want to sell products?</span><input type='checkbox' checked={seller} onChange={(e)=>setSeller(e.target.checked)}/></div>
          <button type='submit' className=' bg-sky-500 py-2 mt-4 rounded-md  font-medium'>signup</button>
          <div className=' flex gap-2 text-[13px]'>Already have an account? <NavLink to={'/login'} className=' text-sky-500'>Login</NavLink></div>
      </form>
      <NavLink to={'/'} className=' mb-6 -mt-1'><span className=' text-sky-500 mr-2'>&larr;</span>back</NavLink>
    </div>
  )
}

export default Signup
