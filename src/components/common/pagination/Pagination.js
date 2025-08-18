import React from 'react';

const Pagination = ({ totalItems, itemsPerPage, currentPage, onPageChange }) => {
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  // If only one page exists, do not show pagination controls
  if (totalPages <= 1) return null;

  // Helper function to render pagination buttons
  const renderPageNumbers = () => {
    const pageButtons = [];

    // Always show the first two pages before ellipsis
    let startPage = Math.max(1, currentPage - 1);
    if (currentPage > 2) startPage = currentPage - 1; // Dynamic start based on current page
    const endPage = Math.min(totalPages - 1, startPage + 1); // Limit to show only two pages before ellipsis

    // Add pages in range (two pages before ellipsis)
    for (let page = startPage; page <= endPage; page++) {
      pageButtons.push(
        <button
          key={page}
          onClick={() => onPageChange(page)}
          className={`px-3 py-1 rounded ${currentPage === page ? 'bg-teal-800 text-white' : 'text-zinc-100'}`}
        >
          {page}
        </button>
      );
    }

    // Display ellipsis if there are pages after the range
    if (endPage < totalPages - 1) {
      pageButtons.push(
        <span key="ellipsis" className="px-3 py-1 text-zinc-100">
          ...
        </span>
      );
    }

    // Show the last page number
    if (totalPages > 1) {
      pageButtons.push(
        <button
          key={totalPages}
          onClick={() => onPageChange(totalPages)}
          className={`px-3 py-1 rounded ${currentPage === totalPages ? 'bg-teal-800 text-white' : 'text-zinc-100'}`}
        >
          {totalPages}
        </button>
      );
    }

    return pageButtons;
  };

  return (
    <div className="flex justify-center text-sm space-x-2 mt-4 text-zinc-100">
      {/* Previous Button */}
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className={`px-3 py-1 ${currentPage === 1 ? 'text-gray-400' : 'text-zinc-100'}`}
      >
        Previous
      </button>

      {/* Render Page Numbers */}
      {renderPageNumbers()}

      {/* Next Button */}
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className={`px-3 py-1 ${currentPage === totalPages ? 'text-gray-400' : 'text-zinc-100'}`}
      >
        Next
      </button>
    </div>
  );
};

export default Pagination;
