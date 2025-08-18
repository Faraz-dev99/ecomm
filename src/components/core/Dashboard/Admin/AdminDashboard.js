import React, { useRef } from 'react';
import DashboardBox from '../components/DashboardBox';

const AdminDashboard = () => {
  const firstContainerRef = useRef(null);

  const DashboardBoxColors=[
    {color1:'from-green-600',color2:'to-green-400'},
    {color1:'from-pink-600',color2:'to-pink-400'},
    {color1:'from-blue-600',color2:'to-blue-400'},
    {color1:'from-yellow-600',color2:'to-yellow-400'}
  ];

  return (
    <div className="container mx-auto p-4 max-w-screen-xl sm:max-w-full sm:min-w-[480px]">
      <div className="flex flex-col lg:flex-row gap-4">
        {/* Container for the boxes */}
        <div
          ref={firstContainerRef}
          className="flex lg:grid lg:grid-cols-2 lg:grid-rows-2 gap-4 max-md:gap-0 flex-1 overflow-x-auto hide-horizontal-scrollbar lg:overflow-hidden"
          style={{ scrollSnapType: 'x mandatory', overflowX: 'auto' }}
        >
          {/* Adjusted width and margin for sliding boxes */}
          <DashboardBox color={DashboardBoxColors[0]}/>
          <DashboardBox color={DashboardBoxColors[1]}/>
          <DashboardBox color={DashboardBoxColors[2]}/>
          <DashboardBox color={DashboardBoxColors[3]}/>
         
        </div>

        {/* Best Selling Products Section */}
        <div
          className=" bg-gradient-to-r from-teal-700 to-teal-500 text-white p-4 w-full lg:w-1/4 font-bold flex flex-col gap-3 max-lg:min-h-60"
          style={{ height: 'auto' }}
        >
          <h2 className=' text-base font-semibold'>Total Sales</h2>
          <p className=' text-3xl'>$3,333</p>
        </div>
      </div>
      <div>
        
      </div>
      
    </div>
  );
};

export default AdminDashboard;
