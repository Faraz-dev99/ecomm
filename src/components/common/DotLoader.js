import React from 'react';

const DotLoader = () => {
  return (
    <div className="flex items-center justify-center space-x-2">
      <div className="dot delay-0 w-3 h-3 bg-teal-600 rounded-full"></div>
      <div className="dot delay-100 w-3 h-3 bg-teal-600 rounded-full"></div>
      <div className="dot delay-200 w-3 h-3 bg-teal-600 rounded-full"></div>
    </div>
  );
};

export default DotLoader;
