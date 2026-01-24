import React from 'react';
import { Users, Folder, FileText } from 'lucide-react';

const ContactStats = ({ pagination, totalContacts }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
    <div className="bg-gradient-to-br from-gray-900 to-gray-800 border border-gray-800 rounded-2xl p-6 hover:border-gray-700 transition-all duration-300 hover:shadow-2xl hover:shadow-gray-900/30 flex justify-between items-center">
      <div>
        <p className="text-sm text-gray-400">Total Contacts</p>
        <p className="text-2xl font-bold text-white mt-1">{totalContacts}</p>
        <span className="text-sm text-green-400">
          All contacts in database
        </span>
      </div>
      <div className="w-16 h-16 rounded-xl bg-gradient-to-r from-blue-500 to-cyan-400 flex items-center justify-center">
        <Users className="w-6 h-6 text-white" />
      </div>
    </div>

    <div className="bg-gradient-to-br from-gray-900 to-gray-800 border border-gray-800 rounded-2xl p-6 hover:border-gray-700 transition-all duration-300 hover:shadow-2xl hover:shadow-gray-900/30 flex justify-between items-center">
      <div>
        <p className="text-sm text-gray-400">Current Page</p>
        <p className="text-2xl font-bold text-white mt-1">{pagination.currentPage + 1}</p>
        <span className="text-sm text-blue-400">
          of {pagination.totalPages} pages
        </span>
      </div>
      <div className="w-16 h-16 rounded-xl bg-gradient-to-r from-purple-500 to-pink-400 flex items-center justify-center">
        <FileText className="w-6 h-6 text-white" />
      </div>
    </div>

    <div className="bg-gradient-to-br from-gray-900 to-gray-800 border border-gray-800 rounded-2xl p-6 hover:border-gray-700 transition-all duration-300 hover:shadow-2xl hover:shadow-gray-900/30 flex justify-between items-center">
      <div>
        <p className="text-sm text-gray-400">Page Size</p>
        <p className="text-2xl font-bold text-white mt-1">{pagination.pageSize}</p>
        <span className="text-sm text-yellow-400">
          contacts per page
        </span>
      </div>
      <div className="w-16 h-16 rounded-xl bg-gradient-to-r from-green-500 to-emerald-400 flex items-center justify-center">
        <Folder className="w-6 h-6 text-white" />
      </div>
    </div>
  </div>
);

export default ContactStats;