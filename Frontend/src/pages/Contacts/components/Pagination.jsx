import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const Pagination = ({ pagination, onPageChange }) => {
  if (pagination.totalPages <= 1) return null;

  return (
    <div className="mt-6 flex flex-col md:flex-row justify-between items-center bg-gradient-to-br from-gray-900 to-gray-800 border border-gray-800 rounded-xl p-4">
      <div className="text-gray-400 mb-4 md:mb-0">
        Showing {pagination.currentPage * pagination.pageSize + 1} to{" "}
        {Math.min((pagination.currentPage + 1) * pagination.pageSize, pagination.totalElements)} of{" "}
        {pagination.totalElements} contacts
      </div>

      <div className="flex gap-2">
        <button
          onClick={() => onPageChange(pagination.currentPage - 1)}
          disabled={pagination.currentPage === 0}
          className={`px-4 py-2 rounded-lg transition-colors ${
            pagination.currentPage === 0
              ? "bg-gray-800 text-gray-600 cursor-not-allowed"
              : "bg-gray-800 text-gray-300 hover:bg-gray-700"
          }`}
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        {/* Page Numbers */}
        {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
          let pageNum;
          if (pagination.totalPages <= 5) {
            pageNum = i;
          } else if (pagination.currentPage <= 2) {
            pageNum = i;
          } else if (pagination.currentPage >= pagination.totalPages - 3) {
            pageNum = pagination.totalPages - 5 + i;
          } else {
            pageNum = pagination.currentPage - 2 + i;
          }

          return (
            <button
              key={pageNum}
              onClick={() => onPageChange(pageNum)}
              className={`px-4 py-2 rounded-lg transition-colors ${
                pagination.currentPage === pageNum
                  ? "bg-gradient-to-r from-orange-500 to-yellow-500 text-white"
                  : "bg-gray-800 text-gray-300 hover:bg-gray-700"
              }`}
            >
              {pageNum + 1}
            </button>
          );
        })}

        <button
          onClick={() => onPageChange(pagination.currentPage + 1)}
          disabled={pagination.currentPage >= pagination.totalPages - 1}
          className={`px-4 py-2 rounded-lg transition-colors ${
            pagination.currentPage >= pagination.totalPages - 1
              ? "bg-gray-800 text-gray-600 cursor-not-allowed"
              : "bg-gray-800 text-gray-300 hover:bg-gray-700"
          }`}
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

export default Pagination;