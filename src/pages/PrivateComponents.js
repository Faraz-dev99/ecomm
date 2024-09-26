import React from 'react'
import { Navigate, Outlet, useNavigate } from 'react-router-dom'

const PrivateComponents = () => {
  const auth=sessionStorage.getItem('user');
  const navigate=useNavigate();
  return <>{auth?<Outlet />:<Navigate to='/login'/>}</>
}

export default PrivateComponents
