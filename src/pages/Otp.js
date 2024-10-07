import React, { useEffect, useRef, useState } from 'react'
import { useSelector, useDispatch } from "react-redux";
import { adduser } from '../oprations/authApi';
import { useNavigate } from 'react-router-dom';

const Otp = () => {
    const [otparr,setOtpArr]=useState(new Array(6).fill(''));
    const {otpToken}=useSelector((state) => state.auth)
    const [otp,setOtp]=useState('');
    const navigate=useNavigate();
    const dispatch=useDispatch();
    const firstInputRef=useRef();

    useEffect(()=>{
        if(!otpToken){
            navigate('/');
        }
    },[])
    
    const handlechange=(element,index)=>{
        const value=element.value;
        if(!value){
            return;
        }
        let newotp=[...otparr];
        newotp[index]=value;
        setOtpArr(newotp)
        
        if(index<5 && value){
            element.nextSibling.focus();
        }
    }
    const handlebackspace=(element,index)=>{
         const newotp=[...otparr];
         newotp[index]='';
         setOtpArr(newotp)
         if(index>0){
            element.previousSibling.focus();
         }
    }

    const verify=(e)=>{
        e.preventDefault();
        let otp =otparr.join('');
       // alert(otp)
       dispatch(adduser(otp,otpToken,navigate,dispatch))
        setOtpArr(new Array(6).fill(''))
        firstInputRef.current.focus();
    }
  return (
    <div className='flex flex-col gap-2 justify-center items-center'>
        <form className='flex flex-col gap-4 justify-center max-w-96 px-2 mt-20' onSubmit={verify}>
        <h2 className=' mb-1 font-semibold text-lg'>Email Verification</h2>
        <p className='  text-slate-400 font-medium'>we've sent an email to ** <br/> enter otp to verify your email address</p>
        <div className='flex justify-center items-center'>
      {
        otparr.map((data,index)=>{
            return <input key={index} type='text' placeholder='-' className='border bg-slate-300 border-slate-800 placeholder:text-slate-900 placeholder:text-2xl h-12 w-full text-xl text-slate-800 text-center rounded-md mx-1' maxLength={1} value={data}
            ref={index === 0 ? firstInputRef : null}
            onChange={(e)=>{handlechange(e.target,index)}}
            onKeyDown={(e)=>{
                if(e.key=='Backspace'){
                    handlebackspace(e.target,index);
                }
            }}
            />
        })
      }
      </div>
      <button type='submit' className=' bg-sky-600 text-white py-2 px-2 mt-2 hover:bg-sky-700'>verify email</button>
      </form>
    </div>
  )
}

export default Otp
