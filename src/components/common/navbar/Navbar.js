import React, { useEffect, useRef, useState } from 'react'
import { json, NavLink, useNavigate } from 'react-router-dom'
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import PersonIcon from '@mui/icons-material/Person';
import LogoutIcon from '@mui/icons-material/Logout';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import DashboardIcon from '@mui/icons-material/Dashboard';
import SearchIcon from '@mui/icons-material/Search';
import { FaShoppingCart } from "react-icons/fa";
import '../../../App.css';
import toast from 'react-hot-toast';
import { useSelector } from 'react-redux';
import { baseUrl } from '../../../oprations/api';
import DotLoader from '../DotLoader';
import { FaAngleRight } from "react-icons/fa";
import { applicationBaseUrl } from '../../../data/applicationUrls';
import { fetchCategory } from '../../../oprations/productApi';

const Navbar = () => {
  const [navDropDown, setNavDropDown] = useState(false)
  const [menuToggle,SetMenuToggle]=useState(true);
  const [usermenuToggle,setUsermenuToggle]=useState(false);
  const [searchValue,setSearchValue]=useState('');
  const [userpfpdefault,setUserPfpDefault]=useState('p');
  const userloggedin=JSON.parse(sessionStorage.getItem('user'));
  const [userProfilePicture,setUserProfilePicture]=useState();
  const {userDetails}=useSelector((state)=>state.user);
  const {cart,totalCartItems}=useSelector((state)=>state.cart)
  const [searchedList,setSearchedList]=useState([]);
  const [loadingSearch,setLoadingSearch]=useState(false);
  const abortControllerRef = useRef(null);
  const {token}=useSelector((state)=>state.auth)
  const [categories,setCategories]=useState([])

  const [userInfo,setUserInfo]=useState({
    userPfp:"",
    username:"",
    email:""
})

  
 
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

  useEffect(() => {
    
    const fetchCategoryFunc=async ()=>{
      const categories=await fetchCategory();
      if(categories?.length>0){
        setCategories(categories)
      }
      else{
        setCategories([])
      }
     // console.log("categories : ",categories)
    }
    fetchCategoryFunc();
  
  }, []);



  useEffect(()=>{
  
    

    if(userloggedin){
     
      
        let pfptext=userDetails?.username?.slice(0, 1).toUpperCase();
        setUserPfpDefault(pfptext);
       setUserInfo((prev)=>{
        if (
        prev.userPfp !== userDetails?.profilePicture?.secure_url ||
        prev.username !== userDetails?.username ||
        prev.email !== userDetails?.email
      ) {
        return {
          userPfp: userDetails?.profilePicture?.secure_url,
          username: userDetails?.username,
          email: userDetails?.email
        };
      }
      return prev;
       })
    }
    
    

  },[userloggedin,userDetails])
  
  const dropdown = () => {
    navDropDown ? setNavDropDown(false) : setNavDropDown(true);
  }


  const searchItem = async (key) => {
    // Abort the previous request if it exists
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    // Create a new AbortController instance
    abortControllerRef.current = new AbortController();
    const { signal } = abortControllerRef.current;

    // Clear results if input is empty
    if (key.trim() === '') {
      setSearchedList([]);
      setLoadingSearch(false);
      return;
    }

    setLoadingSearch(true);

    try {
      const response = await fetch(`${baseUrl}product/searchProduct/${key}`, { signal });
      if (!response.ok) {
        if (response.status === 404) {
          setSearchedList([]); // Clear results if no products are found
        }
        return;
      }

      const items = await response.json();
      if (items.success) {
        setSearchedList(items.products);
      }
    } catch (err) {
      if (err.name === "AbortError") {
        console.log("Fetch aborted");
      }
    } finally {
      setLoadingSearch(false);
    }
  };
  // Handle input change and call searchItem with the new value
  const handleInputChange = (e) => {
    const newValue = e.target.value;
    setSearchValue(newValue);
    searchItem(newValue); // Call searchItem directly
  };

  const handleSearchSubmit=(e)=>{
    e.preventDefault();
    if(searchValue!==""){
      
    setSearchedList([])
    setSearchValue("");
    navigate(`search/${searchValue}`)
    }
    
  }

  const searchNavigate=(id)=>{
    setSearchedList([]);
    setSearchValue("");
    navigate(`/product/${id}`)
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
    <>{/* bg-gradient-to-r from-blue-700 to-teal-600 */}
    <div className=' select-none   relative z-50 bg-zinc-900 text-white flex flex-wrap  justify-between py-2 px-2 pt-4 text-lg font-semibold max-sm:flex-col gap-3' style={{zIndex:'500'}}>
      <div className=' flex gap-2'>
      <div className=' md:hidden flex items-center' onClick={()=>SetMenuToggle(!menuToggle)}>{menuToggle?<MenuIcon />:<CloseIcon />}</div>
      <NavLink to={'/'} className='  '><span className=' '>Light</span><span className=' text-teal-600'>Store</span></NavLink>
      </div>
    
        <form className={` flex flex-wrap relative justify-center items-center gap-2 ${userloggedin?'md:min-w-[500px]':null}   max-md:w-full`} onSubmit={handleSearchSubmit}>
         <div className=' flex justify-center w-full items-center px-2 py-2 border max-md:w-full rounded-md  border-teal-100 bg-teal-100' >
         <button type='submit' className='flex justify-center items-center mr-2'><SearchIcon className=' text-zinc-800 font-thin text-xs' style={{fontSize:'18px'}}/></button>
         <input className=' outline-none w-full bg-teal-100 border-none text-black font-normal text-sm placeholder:text-xs placeholder:text-zinc-800'
         type='search'
          placeholder='search product..'
          value={searchValue}
          onChange={handleInputChange}
          required
         />
         
         </div>
         {loadingSearch && <div className=' absolute w-full top-[45.6px] right-0  py-10 rounded-md border border-zinc-800 bg-zinc-950 md:min-w-80'><DotLoader/></div>}
         {(searchValue!=="" && !loadingSearch && searchedList.length===0)&&<div className=' absolute w-full border border-zinc-800 top-[45.6px] right-0 py-4 text-base px-4 rounded-md bg-zinc-950 text-zinc-400 font-normal'>No result found!</div>}
         {
           searchedList.length>0 && !loadingSearch?<div className=' absolute w-full border border-zinc-800 flex flex-col md:min-w-80 top-[45.6px] right-0 bg-zinc-950 text-sm'>
            {searchedList.map((e,i)=>{
                 if(i<4 && e.status==="Published")
                return <div to={`product/${e._id}`} onClick={()=>searchNavigate(e._id)} key={i} className={`flex border-dashed border-b border-b-zinc-900 items-center px-3 py-3 cursor-pointer gap-4 group hover:bg-zinc-900`}>
                   <div>
                       <img src={`${e.images[0].secure_url}`} alt='product' className=' h-12 w-10'/>
                   </div>
                   <div className=' flex flex-col gap-1 text-xs'>
                   <div className=' text-sm font-semibold group-hover:text-teal-600'>{e.name}</div>
                   <div className="truncate w-32 text-zinc-400">{e.description}</div>
                   <div className=' text-zinc-400'>₹{e.price}</div>
                   </div>
                   
                </div>
            })}
            <button  className=' flex gap-1 justify-center items-center py-3 px-2 bg-teal-600 text-zinc-900 text-base font-normal text-center'><span>view all results</span> <FaAngleRight/></button>
           </div>:null
         }
        
      </form>
      {
        (userDetails.role==="Seller" || userDetails.role==="Visitor") && userloggedin?<NavLink to={"/dashboard/cart"} className='rounded-full  absolute right-14 top-6 max-md:right-12 max-md:top-5'>
          <div className=' relative'>
          <div ><FaShoppingCart className=' text-xl'/></div>
          {totalCartItems>0&&<div className=' grid place-items-center absolute -top-2 -right-2 bg-red-600 h-4 w-4 rounded-full text-xs'>{totalCartItems}</div>}
          
          </div>
        </NavLink>:null
      }
      {
        userloggedin?<div ref={usermenuRef} className=' flex justify-center text-sm items-center relative max-md:absolute max-md:top-4 max-md:right-2' style={{zIndex:'1'}}>
        <div   className='flex cursor-pointer' onClick={()=>{setUsermenuToggle(!usermenuToggle)}}>
          {userDetails?.profilePicture?.secure_url?<div  className=' cursor-pointer flex justify-center items-center overflow-hidden text-white bg-zinc-600 rounded-full h-7 w-7 text-xl'
          ><img src={userInfo.userPfp} alt="pfp" className=' w-full h-full ' /></div>:<div  className=' cursor-pointer flex justify-center items-center text-white bg-red-600 rounded-full h-7 w-7 text-xl'
          >{userpfpdefault}</div>}
        {/* <ArrowDropDownIcon className=' -ml-1' style={{ fontSize: "30px", fontWeight: 'bold' }} /> */}
        </div>
          
          {
            usermenuToggle?<div  className=' absolute border min-w-[250px] border-zinc-700 top-10 right-0 flex flex-col  gap-2 font-normal bg-zinc-900/95 text-white px-3 py-2 rounded-md'>
              <div className=' flex flex-col gap-2 mb-2'>
                <div className=' text-teal-600'>{userInfo?.username}</div>
                <div className=' w-full overflow-hidden text-ellipsis whitespace-nowrap'>{userDetails?.email}</div>
              </div>
            <NavLink to='dashboard/profile' className='flex items-center gap-2 cursor-pointer py-2 px-4 bg-zinc-700 bg-opacity-60 rounded-2xl'  onClick={() => { SetMenuToggle(true); setUsermenuToggle(false);}}><DashboardIcon style={{fontSize:"16px"}}/>Dashboard</NavLink>
            <div className='flex ml-40 my-2 items-center gap-1 cursor-pointer' onClick={logout}><LogoutIcon style={{fontSize:"16px"}}/>Logout</div>
         </div>:null
          }
        </div>:null
      }
      </div>
    <nav className=' px-4 flex justify-between bg-zinc-800   relative ' style={{zIndex:'400'}}>
      
      <ul className='flex z-40 gap-4 mr-4  max-md:shadow-lg max-md:text-sm max-md:font-normal max-md:gap-4 py-4 max-md:shadow-stone-5
                00   w-full
       max-md:flex-col text-zinc-400 max-md:bg-zinc-900/80 backdrop-blur-md  max-md:items-center max-md:absolute max-md:top-0 max-md:left-0 transition-all duration-300' style={{top:menuToggle?'-300px':'0px'}}>
        <li><NavLink to='/' style={({ isActive }) => {
          return isActive ? { color: "#00897b" } : {};
        }} onClick={() => SetMenuToggle(true)}>Home</NavLink></li>
        <li className=' relative' onMouseOver={() => setNavDropDown(true)} onMouseOut={() => setNavDropDown(false)}>

          <div className=' flex'>
            <div   className=' cursor-pointer select-none'>Category</div><ArrowDropDownIcon className=' -ml-1 text-lg  max-md:text-xs max-md:-mt-[3px]' />
          </div>
          {navDropDown ? <div><div className=' absolute top-5  h-4 w-4  border-l-transparent  border-r-transparent  border-b-teal-600 md:border-b-zinc-300' style={{zIndex:'80', borderRightWidth: '35px', borderLeftWidth: "35px", borderBottomWidth: "30px", right: '-20px' }}></div>
          <ul
            className='flex flex-col gap-1 py-4  w-40 rounded-lg 
                absolute top-8 -left-4   bg-teal-600
                text-white opacity-0 md:bg-zinc-200 md:text-zinc-800' style={{zIndex:'80',transition:'all 2s ease',opacity:navDropDown?1:0}}>
            {categories.map((e,i)=>{
              return <NavLink key={i}  to={`/catalog/${e.name}`} className=' hover:bg-blue-200 py-2 px-4' onClick={() => {SetMenuToggle(true); setNavDropDown(false)}}><li>{e.name}</li></NavLink>
            })}
          </ul></div> : null}

        </li>
        <li><NavLink to='/about' style={({ isActive }) => {
          return isActive ? { color: "#00897b" } : {};
        }} onClick={() => SetMenuToggle(true)}>About Us</NavLink></li>
        <li><NavLink to='/contact' style={({ isActive }) => {
          return isActive ? { color: "#00897b" } : {};
        }} onClick={() => SetMenuToggle(true)}>Contact Us</NavLink></li>
        <li className='flex gap-3 md:absolute md:right-5 navbarAuth max-md:items-center max-md:flex-col'>
          {
            userloggedin?null:<><NavLink to='/login' style={({ isActive }) => {
          return isActive ? { color: "#00897b" } : {};
        }} onClick={() => SetMenuToggle(true)}>Login</NavLink>
        <NavLink to='/signup' style={({ isActive }) => {
          return isActive ? { color: "#00897b" } : {};
        }} onClick={() => SetMenuToggle(true)}>Signup</NavLink></>
          }
        
        
      </li>
      
      </ul>
      
      
    </nav>
    
    </>
  )
}

export default Navbar
