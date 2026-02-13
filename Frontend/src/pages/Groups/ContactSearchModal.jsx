import React, { useState, useEffect, useCallback } from "react";
import contactAPI from "../../api/contactApi";
import {
  Search,
  Check,
  X,
  Loader2,
  User,
  Users
} from "lucide-react";
import Pagination from "../Contacts/components/Pagination";




const ContactSearchModal = ({
  isOpen,
  onClose,
  onSave,
  group,
  initialSelectedIds = []
}) => {
  // State
  const [contacts, setContacts] = useState([]);
  const [selectedContactIds, setSelectedContactIds] = useState(new Set(initialSelectedIds));
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({
    currentPage: 0,
    totalPages: 0,
    totalElements: 0,
    pageSize: 12
  });

  // Fetch contacts
  const fetchContacts = useCallback(async (page = 0, search = "") => {
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

        // Handle different API response structures
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
      console.error("Error fetching contacts:", err);
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
      setSelectedContactIds(new Set(initialSelectedIds));
      setSearchTerm("");
      fetchContacts(0, "");
    }
  }, [isOpen, initialSelectedIds, fetchContacts]);

  // Handlers
  const toggleContactSelection = id => {
    setSelectedContactIds(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) newSet.delete(id);
      else newSet.add(id);
      return newSet;
    });
  };

  const handleSearchChange = e => setSearchTerm(e.target.value);

  const handlePageChange = newPage => {
    if (newPage >= 0 && newPage < pagination.totalPages) {
      fetchContacts(newPage, searchTerm);
    }
  };

  const handleSave = () => onSave(Array.from(selectedContactIds));

  const handleSelectAll = () => {
    if (selectedContactIds.size === contacts.length) setSelectedContactIds(new Set());
    else setSelectedContactIds(new Set(contacts.map(c => c.id)));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-gray-800 rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col border border-gray-700">
        {/* Header */}
        <div className="p-6 border-b border-gray-700">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <Users className="w-5 h-5 text-blue-400" />
                {group
                  ? <>Manage Contacts - <span className="text-blue-400">{group.groupName}</span></>
                  : "Select Contacts"
                }
              </h2>
              <p className="text-gray-400 text-sm mt-1">
                Search and select contacts to add to this group
              </p>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-300 transition-colors p-2 hover:bg-gray-700 rounded-lg"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Search Bar */}
          <div className="mt-4 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={handleSearchChange}
              className="w-full pl-10 pr-4 py-3 bg-gray-900 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              placeholder="Search contacts by name, email, or phone..."
              autoFocus
            />
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {/* Select All / Count */}
          <div className="flex justify-between items-center mb-4">
            <div className="text-gray-300">
              <span className="font-semibold text-white">{selectedContactIds.size}</span> contacts selected
            </div>
            {contacts.length > 0 && (
              <button
                onClick={handleSelectAll}
                className="text-sm text-blue-400 hover:text-blue-300 transition-colors"
              >
                {selectedContactIds.size === contacts.length ? "Deselect All" : "Select All"}
              </button>
            )}
          </div>

          {/* Loading / Empty / Grid */}
          {loading ? (
            <div className="text-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-blue-500 mx-auto" />
              <p className="mt-3 text-gray-400">Loading contacts...</p>
            </div>
          ) : contacts.length === 0 ? (
            <div className="text-center py-16">
              <div className="w-20 h-20 bg-gray-900 rounded-full flex items-center justify-center mx-auto mb-4 border border-gray-700">
                <User className="w-10 h-10 text-gray-600" />
              </div>
              <h3 className="text-lg font-medium text-white mb-2">No contacts found</h3>
              <p className="text-gray-400">
                {searchTerm ? `No contacts matching "${searchTerm}"` : "No contacts available. Create contacts first."}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {contacts.map(contact => (
                <div
                  key={contact.id}
                  onClick={() => toggleContactSelection(contact.id)}
                  className={`
                    flex items-center justify-between p-4 rounded-xl cursor-pointer
                    transition-all duration-200 border
                    ${selectedContactIds.has(contact.id)
                      ? "bg-blue-600/20 border-blue-500 hover:bg-blue-600/30"
                      : "bg-gray-900/50 border-gray-700 hover:bg-gray-900 hover:border-gray-600"
                    }
                  `}
                >
                  <div className="flex items-center gap-3">
                    <div className={`
                      w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0
                      ${selectedContactIds.has(contact.id)
                        ? "bg-blue-500 text-white"
                        : "bg-gray-700 text-gray-300"
                      }
                    `}>
                      <span className="text-sm font-medium">
                        {contact.firstName?.charAt(0).toUpperCase() || "C"}
                        {contact.lastName?.charAt(0).toUpperCase() || ""}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-white truncate">
                        {contact.firstName} {contact.lastName}
                      </h4>
                      {contact.email && (
                        <p className="text-sm text-gray-400 truncate">{contact.email}</p>
                      )}
                      <p className="text-xs text-gray-500">ID: {contact.id}</p>
                    </div>
                  </div>
                  <div className={`
                    w-5 h-5 rounded border flex items-center justify-center flex-shrink-0
                    ${selectedContactIds.has(contact.id)
                      ? "bg-blue-500 border-blue-500"
                      : "border-gray-600 bg-gray-800"
                    }
                  `}>
                    {selectedContactIds.has(contact.id) && <Check className="w-3 h-3 text-white" />}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-700">
          {/* Pagination */}
          {pagination.totalPages > 1 && (
            <Pagination
              pagination={pagination}
              onPageChange={handlePageChange}
              label="contacts"
            />
          )}

          {/* Action Buttons */}
          <div className="flex justify-end gap-3 mt-4">
            <button
              onClick={onClose}
              className="px-5 py-2.5 border border-gray-600 rounded-xl text-gray-300 hover:bg-gray-700 transition-colors font-medium"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={selectedContactIds.size === 0}
              className={`
                px-5 py-2.5 rounded-xl font-medium transition-all
                ${selectedContactIds.size === 0
                  ? "bg-blue-600/50 text-white/50 cursor-not-allowed"
                  : "bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:from-blue-700 hover:to-blue-800 shadow-lg hover:shadow-blue-500/20"
                }
              `}
            >
              Add {selectedContactIds.size > 0 && `(${selectedContactIds.size})`} Contacts
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactSearchModal;
