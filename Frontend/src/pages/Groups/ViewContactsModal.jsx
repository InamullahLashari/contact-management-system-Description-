import React from 'react';
import { X, User } from 'lucide-react';

const ViewContactsModal = ({ group, contacts, onClose }) => {
  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50">
      <div className="bg-gray-800 rounded-xl w-full max-w-2xl p-6">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h2 className="text-xl font-bold text-white">{group.groupName}</h2>
            {group.description && group.description !== "null" && (
              <p className="text-gray-400 text-sm mt-1">{group.description}</p>
            )}
            <p className="text-gray-400 text-sm mt-2">
              {contacts.length} {contacts.length === 1 ? 'contact' : 'contacts'}
            </p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-2 max-h-96 overflow-y-auto">
          {contacts.length > 0 ? (
            contacts.map((contact, index) => (
              <div 
                key={index} 
                className="flex items-center gap-3 p-3 bg-gray-900/50 rounded-lg"
              >
                <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center">
                  <span className="text-sm font-medium text-white">
                    {contact.name?.charAt(0).toUpperCase() || 'C'}
                  </span>
                </div>
                <span className="text-white">{contact.name}</span>
              </div>
            ))
          ) : (
            <div className="text-center py-8">
              <div className="mx-auto w-16 h-16 bg-gray-900 rounded-full flex items-center justify-center mb-3 border border-gray-700">
                <User className="w-8 h-8 text-gray-600" />
              </div>
              <p className="text-gray-400">No contacts in this group</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ViewContactsModal;