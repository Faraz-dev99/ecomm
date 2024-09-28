import React,{ useEffect, useState }  from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { NavLink, useNavigate } from "react-router-dom";
import {login } from '../oprations/authApi';

const Login = () => {
  const [userDetail,setuserDetail]=useState({
    email:'',
    password:''
  });
  const [isinvalid,setIsInvalid]=useState(false);
  const navigate=useNavigate();
  const dispatch=useDispatch();
  
  useEffect(()=>{
    const auth=sessionStorage.getItem('user');
    if(auth)
      navigate('/')
  },[])

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

  const checkUser=(e)=>{
    e.preventDefault();
     
    let logindata={
      email:userDetail.email,
     password:userDetail.password
    }

    if(!userDetail.email || !userDetail.password){
         setIsInvalid(true);
         return;
    }
    else{
      setIsInvalid(false);
      dispatch(login(logindata,navigate,dispatch));
    }
    
    //dispatch(setSignupData(udata));
    
    
   setuserDetail((prev)=>{
    return ({
      email:'',
      password:''
    })
})
  

  }
  return (
    <div className='flex flex-col justify-center mx-6 items-center'>
         <form className='flex flex-col justify-center  my-5  w-full max-w-96  gap-7 py-10 px-10 rounded-lg border border-slate-800' onSubmit={checkUser}>
      <h1 className=' text-2xl font-medium mb-4'>Login</h1>
          <input type='email' placeholder='email' name='email' className=' bg-transparent outline-none border-b border-b-slate-700 pb-3 focus:border-b-sky-500' value={userDetail.email} onChange={userInfo}/>
          {isinvalid && !userDetail.email?<div className=' text-xs font-medium text-red-600 -mt-4'>*please fill out this field</div>:null}
          <input type='password' placeholder='password' name='password' className=' bg-transparent outline-none border-b border-b-slate-700 pb-3 focus:border-b-sky-500' value={userDetail.password} onChange={userInfo}/>
          {isinvalid && !userDetail.password?<div className=' text-xs font-medium text-red-600 -mt-4'>*please fill out this field</div>:null}
          <button type='submit' className='bg-sky-500 mt-4 py-2 rounded-md font-medium'>login</button>
          <div className=' text-sm'>Don't have account? <NavLink to={'/signup'} className=' text-sky-500'>Sign up</NavLink></div>
      </form>
      <NavLink to={'/'}><span className=' text-sky-500 mr-2'>&larr;</span>back</NavLink>
    </div>
  )
}

export default Login
