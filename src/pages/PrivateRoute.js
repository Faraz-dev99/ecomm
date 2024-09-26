import React from 'react'
import { Navigate } from 'react-router-dom';

const PrivateRoute = ({children}) => {
  const auth=sessionStorage.getItem('user');
  if(auth){
    return children;
  }
  else{
    return <Navigate to='/login' />
  }
}

export default PrivateRoute
