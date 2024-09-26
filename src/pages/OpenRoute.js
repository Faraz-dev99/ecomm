import React from 'react'
import { Navigate,Outlet } from 'react-router-dom';

const OpenRoute = () => {
    const auth=sessionStorage.getItem('user');
  return <>{auth?<Navigate to='/'/>:<Outlet />}</>
}

export default OpenRoute
