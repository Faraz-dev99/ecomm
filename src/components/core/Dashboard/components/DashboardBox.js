import React from 'react'

const DashboardBox = (prop) => {
  console.log(prop.color.color1)
  return (
    <div className={` rounded-lg font-bold w-64 h-36 max-md:h-32 max-md:w-56 lg:w-auto min-w-0 bg-gradient-to-r ${prop.color.color1} ${prop.color.color2} text-white p-4 flex flex-col justify-between flex-shrink-0 mr-2 md:mr-2`}>
    <h2 className=' text-base'>Total Users</h2>
    <p className=' text-3xl'>277</p>
    <p className=' font-medium  mt-2'>Last Month</p>
  </div>
  )
}

export default DashboardBox
