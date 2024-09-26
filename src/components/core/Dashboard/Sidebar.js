import React, { useState } from 'react'
import DashboardIcon from '@mui/icons-material/Dashboard';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import { FaAngleRight } from "react-icons/fa";
import { json, NavLink } from 'react-router-dom';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import StorefrontIcon from '@mui/icons-material/Storefront';
import Button from '@mui/material/Button';
import { useSelector } from 'react-redux';
import '../../../App.css';
import AdminPanelSettings from '@mui/icons-material/AdminPanelSettings';
const Sidebar = () => {
  const { userDetails } = useSelector((state) => state.user);

  const [toggleSubmenu,setToggleSubmenu]=useState(null);

  const isToggleSubmenu=(index)=>{
    toggleSubmenu===index?setToggleSubmenu(null):setToggleSubmenu(index);
  }

  return (
    <div className=' flex flex-col gap-3  bg-slate-900 max-sm:min-h-[calc(100vh-93.6px)]  max-md:min-h-[calc(100vh-53.6px)] md:min-h-[calc(100vh-109.2px)]  text-slate-400 px-3 pr-5 py-4 max-md:min-w-52 md:min-w-72 overflow-auto max-lg:relative' style={{ zIndex: '20' }}>
      {/* <div className=' text-lg font-semibold'>E-bazar</div> */}
      <div className=' flex flex-col gap-3'>
        <h3 className=' font-semibold text-xs text-slate-700'>MENU</h3>
        <ul className=' flex flex-col gap-1'>
          <li>
            <NavLink to='/dashboard/profile' style={({ isActive }) => {
              return isActive ? { background: 'rgb(51 65 85)' } : {};
            }} className='flex items-center justify-between text-sm px-2 py-2 hover:text-sky-500 hover:bg-slate-800 cursor-pointer'><span><AccountCircleIcon className=' mr-2' style={{ fontSize: '17px' }} />Profile</span></NavLink>
          </li>

          {userDetails.role === 'Admin' ?   <li>
            <button className='flex w-full items-center justify-between text-sm px-2 py-2 hover:text-sky-500 hover:bg-sky-100 cursor-pointer'style={{background:'rgba(0,0,0,.1)'}} onClick={()=>isToggleSubmenu(1)}>
              <span><AdminPanelSettings className=' mr-2' style={{ fontSize: '17px' }} />Admin</span><FaAngleRight className={` transition-all ${toggleSubmenu===1?'rotate-90':null}`} />
            </button>
            <div className={`overflow-hidden`}
            style={{transition:'all .2s ease-out',height:toggleSubmenu===1?'75px':'0px'}}>
            <ul className={` py-3 border-slate-800 border-l list-none mx-4 flex flex-col justify-center gap-3  font-medium`} style={{ fontSize: '13px' }}>
              <li className=' cursor-pointer px-4 hover:text-sky-500 hover:border-l hover:border-l-cyan-500'>
                <NavLink to='/dashboard/admin' style={({ isActive }) => {
                  return isActive ? { color:'rgb(14 165 233)' } : {};
                }}>Dashboard</NavLink>
              </li>
              <li className=' cursor-pointer px-4 hover:text-sky-500 hover:border-l hover:border-l-cyan-500'>box2</li>
            </ul>
            </div>
            
          </li>: null}

          {userDetails.role==="Admin"||userDetails.role==="Seller"?
          <li>
            <button className='flex w-full items-center justify-between text-sm px-2 py-2 hover:text-sky-500 hover:bg-sky-100 cursor-pointer'style={{background:'rgba(0,0,0,.1)'}} onClick={()=>isToggleSubmenu(2)}>
              <span><StorefrontIcon className=' mr-2' style={{ fontSize: '17px' }} />Seller</span><FaAngleRight className={` transition-all ${toggleSubmenu===2?'rotate-90':null}`} />
            </button>
            <div className={`overflow-hidden`}
            style={{transition:'all .2s ease-out',height:toggleSubmenu===2?'75px':'0px'}}>
            <ul className={` py-3 border-slate-800 border-l list-none mx-4 flex flex-col justify-center gap-3  font-medium`} style={{ fontSize: '13px' }}>
              <li className=' cursor-pointer px-4 hover:text-sky-500 hover:border-l hover:border-l-cyan-500'>
                <NavLink to='/dashboard/add-product' style={({ isActive }) => {
                  return isActive ? { color:'rgb(14 165 233)' } : {};
                }}>Add Product</NavLink>
              </li>
              <li className=' cursor-pointer px-4 hover:text-sky-500 hover:border-l hover:border-l-cyan-500'>box2</li>
            </ul>
            </div>
            
          </li>:null}

          {userDetails.role==="Seller" || userDetails.role==="Visitor"?<li>
            <button className='flex w-full items-center justify-between text-sm px-2 py-2 hover:text-sky-500 hover:bg-sky-100 cursor-pointer'style={{background:'rgba(0,0,0,.1)'}} onClick={()=>isToggleSubmenu(3)}>
              <span><ShoppingCartIcon className=' mr-2' style={{ fontSize: '17px' }} />Cart</span><FaAngleRight className={` transition-all ${toggleSubmenu===3?'rotate-90':null}`} />
            </button>
            <div className={`overflow-hidden`}
            style={{transition:'all .2s ease-out',height:toggleSubmenu===3?'75px':'0px'}}>
            <ul className={` py-3 border-slate-800 border-l list-none mx-4 flex flex-col justify-center gap-3  font-medium`} style={{ fontSize: '13px' }}>
              <li className=' cursor-pointer px-4 hover:text-sky-500 hover:border-l hover:border-l-cyan-500'>
                <NavLink to='/dashboard/cart' style={({ isActive }) => {
                  return isActive ? { color:'rgb(14 165 233)' } : {};
                }}>Product List</NavLink>
              </li>
              <li className=' cursor-pointer px-4 hover:text-sky-500 hover:border-l hover:border-l-cyan-500'>box2</li>
            </ul>
            </div>
            
          </li>:null}
          

          



        </ul>
      </div>

    </div>
  )
}

export default Sidebar
