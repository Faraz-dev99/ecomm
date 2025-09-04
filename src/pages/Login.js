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
    <div className='flex flex-col  mx-6 items-center max-sm:min-h-[calc(100vh-93.6px)] h-full  max-md:min-h-[calc(100vh-53.6px)] md:min-h-[calc(100vh-117.6px)]'>
      <div className=' flex items-center justify-center gap-2 mt-20'>
        <img src='logo192.png' alt='logo' className=' w-[40px]'/>
        <h1 className=' text-xl font-bold '>Login to <span className=' '>Light <span className=' text-teal-600'>Store</span></span></h1>
      </div>
       
         <form className='flex flex-col justify-center items-center  my-5  w-full max-w-96  gap-7 py-10 px-10 rounded-lg border border-zinc-800 bg-zinc-900' onSubmit={checkUser}>

          <input type='email' placeholder='email' name='email' className=' w-full bg-transparent outline-none border-b border-b-zinc-700 pb-3 focus:border-b-teal-600' value={userDetail.email} onChange={userInfo}/>
          {isinvalid && !userDetail.email?<div className=' w-full text-xs font-medium text-red-600 -mt-4'>*please fill out this field</div>:null}
          <input type='password' placeholder='password' name='password' className=' w-full bg-transparent outline-none border-b border-b-zinc-700 pb-3 focus:border-b-teal-600' value={userDetail.password} onChange={userInfo}/>
          {isinvalid && !userDetail.password?<div className=' w-full text-xs font-medium text-red-600 -mt-4'>*please fill out this field</div>:null}
          <button type='submit' className='bg-teal-600 mt-4 py-2 w-full rounded-md font-medium'>login</button>
          <button type='button' className=' font-bold text-sm hover:text-zinc-200 text-zinc-400'>Forgot Password?</button>
          <div className=' flex gap-2 text-[13px]'>Don't have account? <NavLink to={'/signup'} className=' text-teal-600 font-bold'>Register</NavLink></div>
      </form>
      <NavLink to={'/'}><span className=' text-teal-600 mr-2'>&larr;</span>back</NavLink>
    </div>
  )
}

export default Login
