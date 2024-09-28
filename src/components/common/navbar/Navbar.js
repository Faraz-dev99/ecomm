import React, { useEffect, useRef, useState } from 'react'
import { json, NavLink, useNavigate } from 'react-router-dom'
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import PersonIcon from '@mui/icons-material/Person';
import LogoutIcon from '@mui/icons-material/Logout';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import DashboardIcon from '@mui/icons-material/Dashboard';
import SearchIcon from '@mui/icons-material/Search';

import '../../../App.css';
import toast from 'react-hot-toast';
import { useSelector } from 'react-redux';

const Navbar = () => {
  const [navDropDown, setNavDropDown] = useState(false)
  const [menuToggle,SetMenuToggle]=useState(true);
  const [usermenuToggle,setUsermenuToggle]=useState(false);
  const [searchValue,setSearchValue]=useState('');
  const [userpfpdefault,setUserPfpDefault]=useState('p');
  const userloggedin=JSON.parse(sessionStorage.getItem('user'))


  
 
  const navigate=useNavigate();
  const usermenuRef=useRef();

  //click outside usermenu
  useEffect(()=>{
    function handler(e){
      if(!usermenuRef?.current?.contains(e.target)){
          setUsermenuToggle(false);
          
      }
    }
    document.addEventListener('mousedown',handler);
    return ()=>{
         document.removeEventListener('mousedown',handler);
    }
  })



  useEffect(()=>{

    if(userloggedin){
     
        let pfptext=userloggedin.username.slice(0, 1).toUpperCase();
        setUserPfpDefault(pfptext);
       
       
       console.log(userloggedin)
    }
    setNavDropDown(false)

  },[userloggedin])
  
  const dropdown = () => {
    navDropDown ? setNavDropDown(false) : setNavDropDown(true);
  }
  
  const logout=()=>{
    const toastId = toast.loading('Loading...');
    sessionStorage.clear();
    SetMenuToggle(true)
    toast.success('logged out successfully', {
      id: toastId,
    });
    navigate('/login')
  }
  return (
    <>{/* bg-gradient-to-r from-blue-700 to-sky-500 */}
    <div className=' select-none   relative z-50 bg-slate-950 text-white flex flex-wrap  justify-between py-2 px-2 pt-4 text-lg font-semibold max-sm:flex-col gap-3'>
      <div className=' flex gap-2'>
      <div className=' md:hidden flex items-center' onClick={()=>SetMenuToggle(!menuToggle)}>{menuToggle?<MenuIcon />:<CloseIcon />}</div>
      <NavLink to={'/'} className='  '><span className=' '>Bazaar</span><span className=' text-sky-500'>Seva</span></NavLink>
      </div>
    
        <div className={` flex flex-wrap justify-center items-center gap-2 ${userloggedin?'md:min-w-[500px]':null}   max-md:w-full`}>
         <form className=' flex justify-center w-full items-center px-2 py-2 border max-md:w-full rounded-md  border-sky-100 bg-sky-100'>
         <button type='submit' className='flex justify-center items-center mr-2'><SearchIcon className=' text-slate-800 font-thin text-xs' style={{fontSize:'18px'}}/></button>
         <input className=' outline-none w-full bg-sky-100 border-none text-black font-normal text-sm placeholder:text-xs placeholder:text-slate-800'
          placeholder='search product..'
          value={searchValue}
          onChange={(e)=>setSearchValue(e.target.value)}
         />
         
         </form>
        
      </div>
      {
        userloggedin?<div ref={usermenuRef} className=' flex justify-center text-sm items-center relative max-md:absolute max-md:top-4 max-md:right-2' style={{zIndex:'1'}}>
        <div   className='flex cursor-pointer' onClick={()=>{setUsermenuToggle(!usermenuToggle)}}>
        <div  className=' cursor-pointer flex justify-center items-center text-white bg-red-600 rounded-full h-7 w-7 text-xl'
          >{userpfpdefault}</div>{/* <ArrowDropDownIcon className=' -ml-1' style={{ fontSize: "30px", fontWeight: 'bold' }} /> */}
        </div>
          
          {
            usermenuToggle?<div  className=' absolute border min-w-[250px] border-slate-700 top-10 right-0 flex flex-col  gap-2 font-normal bg-slate-900/95 text-white px-3 py-2 rounded-md'>
              <div className=' flex flex-col gap-2 mb-2'>
                <div className=' text-sky-500'>{userloggedin.username}</div>
                <div className=' w-full overflow-hidden text-ellipsis whitespace-nowrap'>{userloggedin.email}</div>
              </div>
            <NavLink to='dashboard/profile' className='flex items-center gap-2 cursor-pointer py-2 px-4 bg-slate-700 bg-opacity-60 rounded-2xl'  onClick={() => { SetMenuToggle(true); setUsermenuToggle(false);}}><DashboardIcon style={{fontSize:"16px"}}/>Dashboard</NavLink>
            <div className='flex ml-40 my-2 items-center gap-1 cursor-pointer' onClick={logout}><LogoutIcon style={{fontSize:"16px"}}/>Logout</div>
         </div>:null
          }
        </div>:null
      }
      </div>
    <nav className=' px-4 flex justify-between bg-slate-900   relative '>
      
      <ul className='flex z-40 gap-4 mr-4  max-md:shadow-lg max-md:text-sm max-md:font-normal max-md:gap-4 py-4 max-md:shadow-stone-5
                00   w-full
       max-md:flex-col text-slate-400 max-md:bg-slate-950/90  max-md:items-center max-md:absolute max-md:top-0 max-md:left-0 transition-all duration-300' style={{top:menuToggle?'-300px':'0px'}}>
        <li><NavLink to='/' style={({ isActive }) => {
          return isActive ? { color: "#45bdf8" } : {};
        }} onClick={() => SetMenuToggle(true)}>Home</NavLink></li>
        <li className=' relative' onMouseOver={() => setNavDropDown(true)} onMouseOut={() => setNavDropDown(false)}>

          <div className=' flex'>
            <div onMouseOver={() => setNavDropDown(true)} onMouseOut={() => setNavDropDown(false)} className=' cursor-pointer select-none'>Category</div><ArrowDropDownIcon className=' -ml-1 text-lg  max-md:text-xs max-md:-mt-[3px]' />
          </div>
          {navDropDown ? <div><div className=' absolute top-5  h-4 w-4  border-l-transparent  border-r-transparent  border-b-sky-600 md:border-b-slate-300' style={{zIndex:'80', borderRightWidth: '35px', borderLeftWidth: "35px", borderBottomWidth: "30px", right: '-20px' }}></div>
          <ul
            className='flex flex-col gap-1 py-4  w-40 rounded-lg 
                absolute top-8 -left-4   bg-sky-600
                text-white opacity-0 md:bg-slate-200 md:text-slate-800' style={{zIndex:'80',transition:'all 2s ease',opacity:navDropDown?1:0}}>
            <NavLink  to='' className=' hover:bg-blue-200 py-2 px-4' onClick={() => SetMenuToggle(true)}><li>mobile</li></NavLink>
            <NavLink  to='' className=' hover:bg-blue-200 py-2 px-4' onClick={() => SetMenuToggle(true)}><li>cloths</li></NavLink>
            <NavLink  to='' className=' hover:bg-blue-200 py-2 px-4' onClick={() => SetMenuToggle(true)}><li>devices</li></NavLink>
            <NavLink  to='' className=' hover:bg-blue-200 py-2 px-4' onClick={() => SetMenuToggle(true)}><li>furniture</li></NavLink>
          </ul></div> : null}

        </li>
        <li><NavLink to='/about' style={({ isActive }) => {
          return isActive ? { color: "#45bdf8" } : {};
        }} onClick={() => SetMenuToggle(true)}>About Us</NavLink></li>
        <li><NavLink to='/contact' style={({ isActive }) => {
          return isActive ? { color: "#45bdf8" } : {};
        }} onClick={() => SetMenuToggle(true)}>Contact Us</NavLink></li>
        <li className='flex gap-3 md:absolute md:right-5 navbarAuth max-md:items-center max-md:flex-col'>
          {
            userloggedin?null:<><NavLink to='/login' style={({ isActive }) => {
          return isActive ? { color: "#45bdf8" } : {};
        }} onClick={() => SetMenuToggle(true)}>Login</NavLink>
        <NavLink to='/signup' style={({ isActive }) => {
          return isActive ? { color: "#45bdf8" } : {};
        }} onClick={() => SetMenuToggle(true)}>Signup</NavLink></>
          }
        
        
      </li>
      </ul>
      
      
    </nav>
    
    </>
  )
}

export default Navbar
