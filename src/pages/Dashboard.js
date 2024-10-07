import React, { useState } from 'react'
import MenuOpenIcon from '@mui/icons-material/MenuOpen';
import { HiMiniBars3BottomLeft } from "react-icons/hi2";
import Button from '@mui/material/Button';
import Sidebar from '../components/core/Dashboard/Sidebar';
import { Outlet } from 'react-router-dom';
import "../App.css"

const Dashboard = () => {
  const [sidebarToggle,setSidebarToggle]=useState(true);
  const [user,setUser]=useState(sessionStorage.getItem('user'));
  return (
    <div className=' flex'>
      <div className={` transition-all max-lg:absolute  ${sidebarToggle?'max-lg:-left-full lg:ml-0':'lg:-ml-72 max-lg:-left-0'} `}>
      <Sidebar />
      </div>
      

      <div className=' relative w-full  max-sm:h-[calc(100vh-93.6px)]  max-md:h-[calc(100vh-53.6px)] md:h-[calc(100vh-109.2px)] overflow-auto hide-scrollbar'>

        <div className={` sticky ${sidebarToggle?'max-lg:left-0':'max-md:left-40 max-lg:left-60'}  lg:left-0 top-0 inline-flex`} style={{zIndex:'20'}}
         onClick={()=>sidebarToggle?setSidebarToggle(false):setSidebarToggle(true)}>
          <Button  sx={{borderRadius:'50%',height:'40px',minWidth:'40px'}}>{sidebarToggle?<MenuOpenIcon className=' text-white'/>:<HiMiniBars3BottomLeft className=' text-white' style={{fontSize:'20px',fontWeight:'bolder'}}/>}</Button>
        </div>

        <div className=' md:py-4 px-4   '>
          <Outlet />
        </div>

      </div>
      
    </div>
  )
}

export default Dashboard
