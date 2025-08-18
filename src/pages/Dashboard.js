import React, { useState } from 'react'
import { MdMenuOpen } from "react-icons/md";
import { CiMenuFries } from "react-icons/ci";
import { HiMiniBars3BottomLeft } from "react-icons/hi2";
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import { IoMdClose } from "react-icons/io";
import Button from '@mui/material/Button';
import Sidebar from '../components/core/Dashboard/Sidebar';
import { Outlet } from 'react-router-dom';
import "../App.css"

const Dashboard = () => {
  const [sidebarToggle, setSidebarToggle] = useState(false);
  const [user, setUser] = useState(sessionStorage.getItem('user'));
  /* ${sidebarToggle
          ? ' max-md:translate-x-0 md:translate-x-[calc(-100%+36px)] '
          : 'max-md:translate-x-[calc(-100%+36px)] md:translate-x-0 '
        }`} */
  return (
    <div className=' flex'>
      <div className={`transition-all  flex items-center max-md:fixed sticky md:top-[117.6px]
  ${sidebarToggle
          ? ' max-md:ml-0 md:-ml-80 '
          : 'max-md:-ml-56 md:ml-0 '
        }`}
        style={{ zIndex: 1000 }}>
        <Sidebar />
        <div className={`   relative mt-2 ml-[6px]   inline-flex transition-all self-start rounded-md overflow-hidden`} style={{ zIndex: 1000 }}
          onClick={() => setSidebarToggle(!sidebarToggle)}>
          <Button sx={{
            minWidth: "unset",
            minHeight: "unset",
            padding: 0,
            lineHeight: 1,
            background: "transparent",
            borderRadius: "inherit", // inherit radius from child
          }}>
            {
              sidebarToggle ? <KeyboardArrowRightIcon className='  text-teal-800 bg-zinc-800/80 ' style={{ fontSize: '30px', fontWeight: 'bolder' }} /> :
                <KeyboardArrowLeftIcon className='  max-lg:hidden text-teal-800 bg-zinc-800/80 ' style={{ fontSize: '30px', fontWeight: 'bolder' }} />
            }
          </Button>


        </div>
      </div>


      <div
  className="
    relative w-full h-screen
    max-sm:max-h-[calc(100vh-101.6px)]
    max-md:max-h-[calc(100vh-101.6px)]
    md:max-h-[calc(100vh-118.6px)]
    overflow-auto  py-6 px-4 
  "
>
  <div className="py-6 px-4 mt-6">
    <Outlet />
  </div>
</div>


    </div>
  )
}

export default Dashboard
