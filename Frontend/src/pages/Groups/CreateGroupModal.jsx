// CreateGroupModal.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { X, Search, Check, Loader2, User, CheckCircle } from 'lucide-react';
import contactAPI from '../../api/contactApi';
import Pagination from '../Contacts/components/Pagination';

const CreateGroupModal = ({ isOpen, onClose, onCreate }) => {
  const [formData, setFormData] = useState({ groupName: '', description: '' });
  const [contacts, setContacts] = useState([]);
  const [selectedContactIds, setSelectedContactIds] = useState(new Set());
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [createdGroup, setCreatedGroup] = useState(null);
  const [pagination, setPagination] = useState({
    currentPage: 0,
    totalPages: 0,
    totalElements: 0,
    pageSize: 12
  });

  // Fetch contacts with pagination
  const fetchContacts = useCallback(async (page = 0, search = '') => {
    try {
      setLoading(true);
      const response = await contactAPI.getContacts({
        page,
        size: pagination.pageSize,
        keywords: search
      });

      if (response.data) {
        let contactsList = [];
        let totalElements = 0;
        let totalPages = 0;

        if (response.data.contacts && Array.isArray(response.data.contacts)) {
          contactsList = response.data.contacts;
          totalElements = response.data.totalElements || contactsList.length;
          totalPages = response.data.totalPages || Math.ceil(totalElements / pagination.pageSize);
        } else if (Array.isArray(response.data)) {
          contactsList = response.data;
          totalElements = contactsList.length;
          totalPages = Math.ceil(totalElements / pagination.pageSize);
        } else if (response.data.content && Array.isArray(response.data.content)) {
          contactsList = response.data.content;
          totalElements = response.data.totalElements || contactsList.length;
          totalPages = response.data.totalPages || Math.ceil(totalElements / pagination.pageSize);
        }

        setContacts(contactsList);
        setPagination(prev => ({
          ...prev,
          currentPage: page,
          totalElements,
          totalPages
        }));
      }
    } catch (err) {
      console.error('Error fetching contacts:', err);
      setContacts([]);
    } finally {
      setLoading(false);
    }
  }, [pagination.pageSize]);

  // Debounced search
  useEffect(() => {
    if (isOpen) {
      const timeoutId = setTimeout(() => {
        fetchContacts(0, searchTerm);
      }, 300);
      return () => clearTimeout(timeoutId);
    }
  }, [searchTerm, isOpen, fetchContacts]);

  // Reset when modal opens
  useEffect(() => {
    if (isOpen) {
      setFormData({ groupName: '', description: '' });
      setSelectedContactIds(new Set());
      setSearchTerm('');
      setShowSuccessPopup(false);
      setCreatedGroup(null);
      fetchContacts(0, '');
    }
  }, [isOpen, fetchContacts]);

  const toggleContactSelection = (id) => {
    setSelectedContactIds(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) newSet.delete(id);
      else newSet.add(id);
      return newSet;
    });
  };

  const handleSelectAll = () => {
    if (selectedContactIds.size === contacts.length) {
      setSelectedContactIds(new Set());
    } else {
      setSelectedContactIds(new Set(contacts.map(c => c.id)));
    }
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 0 && newPage < pagination.totalPages) {
      fetchContacts(newPage, searchTerm);
    }
  };

  const handleSubmit = async () => {
    if (!formData.groupName) return;
    
    try {
      setSubmitting(true);
      const groupData = {
        ...formData,
        contactIds: Array.from(selectedContactIds)
      };
      
      const response = await onCreate(groupData);
      setCreatedGroup(response || groupData);
      setShowSuccessPopup(true);
      
      // Close the create modal after a short delay
      setTimeout(() => {
        onClose();
      }, 2000);
      
    } catch (err) {
      console.error('Error creating group:', err);
    } finally {
      setSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Main Create Group Modal */}
      <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
        <div className="bg-gray-800 rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col border border-gray-700">
          {/* Header - Group Info */}
          <div className="p-6 border-b border-gray-700">
            <div className="flex justify-between items-start mb-4">
              <h2 className="text-xl font-bold text-white">Create New Group</h2>
              <button 
                onClick={onClose} 
                className="text-gray-400 hover:text-gray-300 p-2 hover:bg-gray-700 rounded-lg"
                disabled={submitting}
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            {/* Group Name & Description */}
            <div className="space-y-3">
              <input
                type="text"
                placeholder="Group Name *"
                value={formData.groupName}
                onChange={(e) => setFormData({ ...formData, groupName: e.target.value })}
                className="w-full p-3 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
                disabled={submitting}
              />
              <textarea
                placeholder="Description (optional)"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows="2"
                className="w-full p-3 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={submitting}
              />
            </div>

            {/* Search Bar */}
            <div className="mt-4 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-gray-900 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Search contacts to add..."
                disabled={submitting}
              />
            </div>
          </div>

          {/* Contacts Grid with Selection */}
          <div className="flex-1 overflow-y-auto p-6">
            {/* Selected Count & Select All */}
            <div className="flex justify-between items-center mb-4">
              <div className="text-gray-300">
                <span className="font-semibold text-white">{selectedContactIds.size}</span> contacts selected
              </div>
              {contacts.length > 0 && (
                <button
                  onClick={handleSelectAll}
                  className="text-sm text-blue-400 hover:text-blue-300"
                  disabled={submitting}
                >
                  {selectedContactIds.size === contacts.length ? 'Deselect All' : 'Select All'}
                </button>
              )}
            </div>

            {/* Loading / Contacts Grid */}
            {loading ? (
              <div className="text-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-blue-500 mx-auto" />
                <p className="mt-3 text-gray-400">Loading contacts...</p>
              </div>
            ) : contacts.length === 0 ? (
              <div className="text-center py-16">
                <User className="w-12 h-12 text-gray-600 mx-auto mb-3" />
                <p className="text-gray-400">
                  {searchTerm ? `No contacts matching "${searchTerm}"` : 'No contacts available'}
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {contacts.map(contact => (
                  <div
                    key={contact.id}
                    onClick={() => !submitting && toggleContactSelection(contact.id)}
                    className={`
                      flex items-center justify-between p-4 rounded-xl cursor-pointer
                      transition-all duration-200 border
                      ${selectedContactIds.has(contact.id)
                        ? 'bg-blue-600/20 border-blue-500'
                        : 'bg-gray-900/50 border-gray-700 hover:bg-gray-900'
                      }
                      ${submitting ? 'opacity-50 cursor-not-allowed' : ''}
                    `}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`
                        w-10 h-10 rounded-full flex items-center justify-center
                        ${selectedContactIds.has(contact.id)
                          ? 'bg-blue-500 text-white'
                          : 'bg-gray-700 text-gray-300'
                        }
                      `}>
                        <span className="text-sm font-medium">
                          {contact.firstName?.charAt(0).toUpperCase() || 'C'}
                          {contact.lastName?.charAt(0).toUpperCase() || ''}
                        </span>
                      </div>
                      <div>
                        <h4 className="font-medium text-white">
                          {contact.firstName} {contact.lastName}
                        </h4>
                        {contact.email && (
                          <p className="text-sm text-gray-400">{contact.email}</p>
                        )}
                      </div>
                    </div>
                    <div className={`
                      w-5 h-5 rounded border flex items-center justify-center
                      ${selectedContactIds.has(contact.id)
                        ? 'bg-blue-500 border-blue-500'
                        : 'border-gray-600 bg-gray-800'
                      }
                    `}>
                      {selectedContactIds.has(contact.id) && <Check className="w-3 h-3 text-white" />}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer with Pagination and Create Button */}
          <div className="p-6 border-t border-gray-700 space-y-4">
            {/* Pagination */}
            {pagination.totalPages > 1 && (
              <Pagination
                pagination={pagination}
                onPageChange={handlePageChange}
                label="contacts"
              />
            )}

            {/* Action Buttons */}
            <div className="flex justify-end gap-3">
              <button
                onClick={onClose}
                className="px-5 py-2.5 border border-gray-600 rounded-xl text-gray-300 hover:bg-gray-700"
                disabled={submitting}
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                disabled={!formData.groupName || submitting}
                className={`
                  px-5 py-2.5 rounded-xl font-medium flex items-center gap-2
                  ${!formData.groupName || submitting
                    ? 'bg-blue-600/50 text-white/50 cursor-not-allowed'
                    : 'bg-blue-600 text-white hover:bg-blue-700'
                  }
                `}
              >
                {submitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Creating...
                  </>
                ) : (
                  <>
                    Create Group {selectedContactIds.size > 0 && `(${selectedContactIds.size})`}
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Success Popup */}
      {showSuccessPopup && (
        <div className="fixed inset-0 flex items-center justify-center z-[60] pointer-events-none">
          <div className="bg-gray-800 border border-green-500 rounded-2xl shadow-2xl p-8 max-w-md mx-4 animate-slide-up pointer-events-auto">
            <div className="text-center">
              <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-10 h-10 text-green-500" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">
                Group Created Successfully!
              </h3>
              <p className="text-gray-300 mb-4">
                <span className="font-semibold text-green-400">{createdGroup?.groupName}</span> has been created
                {selectedContactIds.size > 0 && (
                  <> with <span className="font-semibold text-blue-400">{selectedContactIds.size} contacts</span></>
                )}
              </p>
              <div className="flex justify-center">
                <div className="bg-gray-900/50 rounded-lg p-3 w-full">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-400">Group Name:</span>
                    <span className="text-white font-medium">{createdGroup?.groupName}</span>
                  </div>
                  {createdGroup?.description && (
                    <div className="flex items-center justify-between text-sm mt-2">
                      <span className="text-gray-400">Description:</span>
                      <span className="text-white">{createdGroup.description}</span>
                    </div>
                  )}
                  <div className="flex items-center justify-between text-sm mt-2">
                    <span className="text-gray-400">Contacts:</span>
                    <span className="text-white font-medium">{selectedContactIds.size}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add animation styles */}
      <style jsx>{`
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-slide-up {
          animation: slideUp 0.3s ease-out;
        }
      `}</style>
    </>
  );
};

export default CreateGroupModal;