import React from 'react'
import Navbar from '../components/common/navbar/Navbar'
const Header = () => {
  return (
    <div className=' sticky top-0 left-0' style={{zIndex:2000}}>
      
      <Navbar />
    </div>
  )
}

export default Header
