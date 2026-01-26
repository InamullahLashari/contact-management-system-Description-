import React, { useState, useEffect, useCallback } from 'react';
import groupAPI from '../../api/groupAPI';
import contactAPI from "../../api/contactApi";
import {
  Users,
  User,
  Plus,
  Edit,
  Trash2,
  RefreshCw,
  Search,
  ChevronLeft,
  ChevronRight,
  Check,
  X,
  ShieldAlert,
  Loader2,
  Info,
  UserPlus
} from 'lucide-react';

function Groups() {
  // State
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [formData, setFormData] = useState({
    groupName: '',
    description: '',
    contactIds: []
  });
  
  const [showModal, setShowModal] = useState(false);
  const [editingGroup, setEditingGroup] = useState(null);

  const [showContactModal, setShowContactModal] = useState(false);
  const [selectedGroupForContacts, setSelectedGroupForContacts] = useState(null);
  const [contacts, setContacts] = useState([]);
  const [selectedContactIds, setSelectedContactIds] = useState(new Set());
  const [contactSearch, setContactSearch] = useState('');
  const [contactLoading, setContactLoading] = useState(false);
  const [contactPagination, setContactPagination] = useState({
    currentPage: 0,
    totalPages: 0,
    totalElements: 0,
    pageSize: 10
  });

  // Fetch groups
  const fetchGroups = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await groupAPI.getGroups();
      
      let groupsData = [];
      if (response.data?.data && Array.isArray(response.data.data)) {
        groupsData = response.data.data;
      } else if (Array.isArray(response.data)) {
        groupsData = response.data;
      }
      
      setGroups(groupsData);
    } catch (err) {
      console.error('Error fetching groups:', err);
      if (err.response?.status === 401) {
        setError('Authentication failed. Please login again.');
      } else if (err.response?.status === 403) {
        setError('You do not have permission to access groups.');
      } else {
        setError(err.response?.data?.message || 'Failed to load groups');
      }
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch contacts for selection with pagination
  const fetchContacts = useCallback(async (page = 0, search = '') => {
    try {
      setContactLoading(true);
      
      const response = await contactAPI.getContacts({
        page,
        size: contactPagination.pageSize,
        keywords: search,
      });
      
      if (response.data) {
        // Handle different API response structures
        let contactsList = [];
        let totalElements = 0;
        let totalPages = 0;
        
        if (response.data.contacts && Array.isArray(response.data.contacts)) {
          contactsList = response.data.contacts;
          totalElements = response.data.totalElements || contactsList.length;
          totalPages = response.data.totalPages || Math.ceil(totalElements / contactPagination.pageSize);
        } else if (Array.isArray(response.data)) {
          contactsList = response.data;
          totalElements = contactsList.length;
          totalPages = Math.ceil(totalElements / contactPagination.pageSize);
        } else if (response.data.content && Array.isArray(response.data.content)) {
          // Spring Boot Pageable response
          contactsList = response.data.content;
          totalElements = response.data.totalElements || contactsList.length;
          totalPages = response.data.totalPages || Math.ceil(totalElements / contactPagination.pageSize);
        }
        
        setContacts(contactsList);
        setContactPagination(prev => ({
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
      setContactLoading(false);
    }
  }, [contactPagination.pageSize]);

  // Fetch groups on component mount
  useEffect(() => {
    fetchGroups();
  }, [fetchGroups]);

  // Handlers
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Handle create/update group submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const payload = {
        groupName: formData.groupName,
        description: formData.description,
        contactIds: Array.from(formData.contactIds)
      };
      
      if (editingGroup) {
        await groupAPI.updateGroup(editingGroup.id, payload);
      } else {
        await groupAPI.createGroup(payload);
      }
      
      fetchGroups();
      setShowModal(false);
      setFormData({ groupName: '', description: '', contactIds: [] });
      setEditingGroup(null);
      
      alert(`Group ${editingGroup ? 'updated' : 'created'} successfully!`);
    } catch (err) {
      console.error('Error saving group:', err);
      alert(err.response?.data?.message || 'Failed to save group');
    }
  };

  const handleDelete = async (groupId) => {
    if (!window.confirm('Are you sure you want to delete this group?')) return;
    
    try {
      await groupAPI.deleteGroup(groupId);
      setGroups(prev => prev.filter(group => group.id !== groupId));
      alert('Group deleted successfully!');
    } catch (err) {
      console.error('Error deleting group:', err);
      alert(err.response?.data?.message || 'Failed to delete group');
    }
  };

  // Handle edit group - populate form with existing data
  const handleEdit = (group) => {
    setEditingGroup(group);
    setFormData({
      groupName: group.groupName,
      description: group.description || '',
      contactIds: group.contactIds || []
    });
    setShowModal(true);
  };

  // Open modal to add contacts to existing group
  const handleOpenContactModal = async (group) => {
    setSelectedGroupForContacts(group);
    // Initialize with existing contact IDs from the group
    setSelectedContactIds(new Set(group.contactIds || []));
    setContactSearch('');
    setShowContactModal(true);
    await fetchContacts(0, '');
  };

  // Toggle contact selection by ID
  const toggleContactSelection = (contactId) => {
    setSelectedContactIds(prev => {
      const newSet = new Set(prev);
      if (newSet.has(contactId)) {
        newSet.delete(contactId);
      } else {
        newSet.add(contactId);
      }
      return newSet;
    });
  };

  // Save selected contacts to existing group
  const handleSaveContactsToGroup = async () => {
    if (!selectedGroupForContacts) return;
    
    try {
      // Prepare payload with contact IDs
      const payload = {
        groupName: selectedGroupForContacts.groupName,
        description: selectedGroupForContacts.description || '',
        contactIds: Array.from(selectedContactIds)
      };
      
      await groupAPI.updateGroup(selectedGroupForContacts.id, payload);
      
      fetchGroups();
      setShowContactModal(false);
      alert('Contacts added to group successfully!');
    } catch (err) {
      console.error('Error saving contacts to group:', err);
      alert('Failed to add contacts to group');
    }
  };

  // Remove contact from group
  const handleRemoveContactFromGroup = async (group, contactId) => {
    if (!window.confirm('Remove this contact from group?')) return;
    
    try {
      // Get current contact IDs, remove the one to delete
      const currentContactIds = group.contactIds || [];
      const updatedContactIds = currentContactIds.filter(id => id !== contactId);
      
      const payload = {
        groupName: group.groupName,
        description: group.description || '',
        contactIds: updatedContactIds
      };
      
      await groupAPI.updateGroup(group.id, payload);
      fetchGroups();
      alert('Contact removed successfully!');
    } catch (err) {
      console.error('Error removing contact:', err);
      alert('Failed to remove contact');
    }
  };

  // Handle contact search with debounce
  const handleContactSearch = (e) => {
    const value = e.target.value;
    setContactSearch(value);
    
    // Debounce search
    const timeoutId = setTimeout(() => {
      fetchContacts(0, value);
    }, 300);
    
    return () => clearTimeout(timeoutId);
  };

  // Handle contact pagination
  const handleContactPageChange = (newPage) => {
    if (newPage >= 0 && newPage < contactPagination.totalPages) {
      fetchContacts(newPage, contactSearch);
    }
  };

  // Utility functions
  const getContactCount = (group) => {
    return group.contactIds?.length || 0;
  };

  // Get contact names from IDs (for display)
  const getContactNames = (group) => {
    // This would ideally come from the API
    // For now, we'll use a placeholder
    return group.contactFirstNames || ['Contact 1', 'Contact 2'];
  };

  const isAuthenticated = () => {
    return sessionStorage.getItem('token') || localStorage.getItem('token');
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-blue-600 mx-auto" />
          <p className="mt-4 text-gray-600">Loading your groups...</p>
        </div>
      </div>
    );
  }

  // Auth check
  if (!isAuthenticated()) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="text-center max-w-md">
          <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <ShieldAlert className="w-10 h-10 text-red-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Authentication Required</h2>
          <p className="text-gray-600 mb-8">
            You need to be logged in to view and manage groups.
          </p>
          <button
            onClick={() => window.location.href = '/login'}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium"
          >
            Go to Login Page
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 md:p-6">
      {/* Header - Clean */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Contact Groups</h1>
        <div className="flex gap-3">
          <button
            onClick={fetchGroups}
            className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg font-medium flex items-center gap-2"
          >
            <RefreshCw className="w-5 h-5" />
            Refresh
          </button>
          <button
            onClick={() => {
              setEditingGroup(null);
              setFormData({ groupName: '', description: '', contactIds: [] });
              setShowModal(true);
            }}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2"
          >
            <Plus className="w-5 h-5" />
            New Group
          </button>
        </div>
      </div>

      {/* Total Groups - Simple text */}
      <div className="mb-6">
        <p className="text-gray-600">
          Total Groups: <span className="font-semibold">{groups.length}</span>
        </p>
      </div>

      {/* Error */}
      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
          <div className="flex">
            <div className="flex-shrink-0">
              <ShieldAlert className="h-6 w-6 text-red-500" />
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">Error Loading Groups</h3>
              <p className="text-sm text-red-700 mt-1">{error}</p>
              <button
                onClick={fetchGroups}
                className="text-sm bg-red-100 hover:bg-red-200 text-red-800 px-3 py-1 rounded-md font-medium mt-2"
              >
                Try Again
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Groups Grid - Fixed height for contact list */}
      {groups.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {groups.map((group) => (
            <div key={group.id} className="bg-white rounded-xl shadow-md border border-gray-200 p-6 flex flex-col">
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3">
                  <div className="bg-blue-100 p-2 rounded-lg">
                    <Users className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800">{group.groupName}</h3>
                    <p className="text-xs text-gray-500">ID: {group.id}</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(group)}
                    className="text-blue-600 hover:text-blue-800 p-1 hover:bg-blue-50 rounded"
                    title="Edit group"
                  >
                    <Edit className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => handleDelete(group.id)}
                    className="text-red-600 hover:text-red-800 p-1 hover:bg-red-50 rounded"
                    title="Delete group"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
              
              {group.description && (
                <p className="text-gray-600 text-sm mb-4">{group.description}</p>
              )}
              
              <div className="text-sm text-gray-500 mb-4 flex items-center">
                <User className="w-4 h-4 mr-1" />
                {getContactCount(group)} contacts
              </div>

              {/* Contacts List with fixed height and proper scrolling */}
              <div className="border-t pt-4 flex-1 min-h-0">
                {getContactCount(group) > 0 ? (
                  <>
                    <div className="flex justify-between items-center mb-2">
                      <h4 className="font-medium text-gray-700">Contacts</h4>
                      <span className="text-xs bg-gray-100 px-2 py-1 rounded">
                        {getContactCount(group)} total
                      </span>
                    </div>
                    <div className="space-y-2 h-40 overflow-y-auto pr-2">
                      {/* Display contact names if available, otherwise show IDs */}
                      {getContactNames(group).slice(0, 10).map((contactName, index) => {
                        const contactId = group.contactIds?.[index];
                        return (
                          <div key={contactId || index} className="flex justify-between items-center p-2 hover:bg-gray-50 rounded">
                            <div className="flex items-center gap-2 flex-1">
                              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                                <span className="text-xs font-medium text-blue-600">
                                  {contactName?.charAt(0).toUpperCase() || 'C'}
                                </span>
                              </div>
                              <div className="min-w-0">
                                <span className="text-sm font-medium block truncate">{contactName || `Contact ${contactId}`}</span>
                                <span className="text-xs text-gray-500">ID: {contactId}</span>
                              </div>
                            </div>
                            <button
                              onClick={() => contactId && handleRemoveContactFromGroup(group, contactId)}
                              className="text-red-500 hover:text-red-700 p-1 hover:bg-red-50 rounded flex-shrink-0"
                              title="Remove from group"
                              disabled={!contactId}
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  </>
                ) : (
                  <p className="text-sm text-gray-500 text-center py-8">No contacts yet</p>
                )}
              </div>

              {/* Actions */}
              <div className="border-t pt-4 mt-4 flex gap-3">
                <button
                  onClick={() => handleOpenContactModal(group)}
                  className="flex-1 bg-blue-50 hover:bg-blue-100 text-blue-600 py-2 px-3 rounded-lg text-sm font-medium flex items-center justify-center gap-2"
                >
                  <UserPlus className="w-4 h-4" />
                  {getContactCount(group) > 0 ? 'Manage Contacts' : 'Add Contacts'}
                </button>
                <button
                  onClick={() => alert(`Group: ${group.groupName}\nContacts: ${getContactCount(group)}\nDescription: ${group.description || 'None'}`)}
                  className="flex-1 bg-gray-50 hover:bg-gray-100 text-gray-600 py-2 px-3 rounded-lg text-sm font-medium flex items-center justify-center gap-2"
                >
                  <Info className="w-4 h-4" />
                  Details
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : !error && (
        <div className="text-center py-16">
          <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Users className="w-12 h-12 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No groups found</h3>
          <p className="text-gray-500 mb-6">Create your first group to organize contacts.</p>
          <button
            onClick={() => {
              setEditingGroup(null);
              setFormData({ groupName: '', description: '', contactIds: [] });
              setShowModal(true);
            }}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium"
          >
            Create Your First Group
          </button>
        </div>
      )}

      {/* Create/Edit Group Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-gray-800">
                  {editingGroup ? 'Edit Group' : 'New Group'}
                </h2>
                <button
                  onClick={() => setShowModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
              
              <form onSubmit={handleSubmit}>
                <div className="space-y-4 mb-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Group Name *
                    </label>
                    <input
                      type="text"
                      name="groupName"
                      value={formData.groupName}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter group name"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Description
                    </label>
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      rows="3"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Optional description"
                    />
                  </div>
                </div>

                {/* Contact Selection in Create/Edit Modal */}
                <div className="mb-6">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="font-medium text-gray-700">Select Contacts</h3>
                    <span className="text-sm text-gray-500">
                      {formData.contactIds.length} selected
                    </span>
                  </div>
                  
                  {/* Search and Select Contacts */}
                  <div className="space-y-4">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="text"
                        value={contactSearch}
                        onChange={handleContactSearch}
                        className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Search contacts to add..."
                      />
                    </div>
                    
                    {contactLoading ? (
                      <div className="text-center py-8">
                        <Loader2 className="h-8 w-8 animate-spin text-blue-600 mx-auto" />
                        <p className="mt-2 text-gray-600">Loading contacts...</p>
                      </div>
                    ) : (
                      <div className="border rounded-lg max-h-60 overflow-y-auto">
                        {contacts.length > 0 ? (
                          <div className="divide-y">
                            {contacts.map((contact) => (
                              <div
                                key={contact.id}
                                className={`p-3 flex items-center justify-between hover:bg-gray-50 cursor-pointer ${
                                  formData.contactIds.includes(contact.id) ? 'bg-blue-50' : ''
                                }`}
                                onClick={() => {
                                  setFormData(prev => {
                                    const contactIds = new Set(prev.contactIds);
                                    if (contactIds.has(contact.id)) {
                                      contactIds.delete(contact.id);
                                    } else {
                                      contactIds.add(contact.id);
                                    }
                                    return { ...prev, contactIds: Array.from(contactIds) };
                                  });
                                }}
                              >
                                <div className="flex items-center gap-3">
                                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                                    <span className="text-sm font-medium text-blue-600">
                                      {contact.firstName?.charAt(0).toUpperCase() || 'C'}
                                    </span>
                                  </div>
                                  <div>
                                    <p className="font-medium">
                                      {contact.firstName} {contact.lastName}
                                    </p>
                                    <p className="text-xs text-gray-500">ID: {contact.id}</p>
                                  </div>
                                </div>
                                <div className={`w-5 h-5 rounded border flex items-center justify-center ${
                                  formData.contactIds.includes(contact.id)
                                    ? 'bg-blue-500 border-blue-500'
                                    : 'border-gray-300'
                                }`}>
                                  {formData.contactIds.includes(contact.id) && (
                                    <Check className="w-3 h-3 text-white" />
                                  )}
                                </div>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="text-center py-8">
                            <User className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                            <p className="text-gray-500">No contacts found</p>
                          </div>
                        )}
                      </div>
                    )}
                    
                    {/* Pagination Controls */}
                    {contactPagination.totalPages > 1 && (
                      <div className="flex justify-center items-center gap-4">
                        <button
                          type="button"
                          onClick={() => handleContactPageChange(contactPagination.currentPage - 1)}
                          disabled={contactPagination.currentPage === 0}
                          className={`p-2 rounded ${contactPagination.currentPage === 0 ? 'text-gray-400' : 'text-gray-700 hover:bg-gray-100'}`}
                        >
                          <ChevronLeft className="w-5 h-5" />
                        </button>
                        <span className="text-sm text-gray-600">
                          Page {contactPagination.currentPage + 1} of {contactPagination.totalPages}
                        </span>
                        <button
                          type="button"
                          onClick={() => handleContactPageChange(contactPagination.currentPage + 1)}
                          disabled={contactPagination.currentPage >= contactPagination.totalPages - 1}
                          className={`p-2 rounded ${contactPagination.currentPage >= contactPagination.totalPages - 1 ? 'text-gray-400' : 'text-gray-700 hover:bg-gray-100'}`}
                        >
                          <ChevronRight className="w-5 h-5" />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="px-5 py-2.5 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    {editingGroup ? 'Update Group' : 'Create Group'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Contact Selection Modal for Existing Group */}
      {showContactModal && selectedGroupForContacts && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col">
            <div className="p-6 border-b">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-xl font-bold text-gray-800">Manage Contacts</h2>
                  <p className="text-gray-600 mt-1">
                    Select contacts for <span className="font-semibold">{selectedGroupForContacts.groupName}</span>
                  </p>
                </div>
                <button
                  onClick={() => setShowContactModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
              
              <div className="mt-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    value={contactSearch}
                    onChange={handleContactSearch}
                    className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Search contacts..."
                  />
                </div>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-6">
              {contactLoading ? (
                <div className="text-center py-12">
                  <Loader2 className="h-8 w-8 animate-spin text-blue-600 mx-auto" />
                  <p className="mt-2 text-gray-600">Loading contacts...</p>
                </div>
              ) : contacts.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {contacts.map((contact) => (
                    <div
                      key={contact.id}
                      className={`p-4 border rounded-lg cursor-pointer transition-all ${
                        selectedContactIds.has(contact.id) 
                          ? 'border-blue-500 bg-blue-50' 
                          : 'border-gray-200 hover:bg-gray-50'
                      }`}
                      onClick={() => toggleContactSelection(contact.id)}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                          selectedContactIds.has(contact.id) 
                            ? 'bg-blue-100 text-blue-600' 
                            : 'bg-gray-100 text-gray-600'
                        }`}>
                          <span className="font-medium">
                            {contact.firstName?.charAt(0).toUpperCase() || 'C'}
                          </span>
                        </div>
                        <div className="flex-1">
                          <h4 className="font-medium">
                            {contact.firstName} {contact.lastName}
                          </h4>
                          <p className="text-sm text-gray-500">ID: {contact.id}</p>
                          <p className="text-sm text-gray-500 truncate">
                            {contact.email || 'No email'}
                          </p>
                        </div>
                        <div className={`w-5 h-5 rounded border flex items-center justify-center ${
                          selectedContactIds.has(contact.id)
                            ? 'bg-blue-500 border-blue-500'
                            : 'border-gray-300'
                        }`}>
                          {selectedContactIds.has(contact.id) && (
                            <Check className="w-3 h-3 text-white" />
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <User className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium mb-2">No contacts found</h3>
                  <p className="text-gray-500">
                    {contactSearch ? 'Try a different search' : 'No contacts available'}
                  </p>
                </div>
              )}

              {/* Pagination */}
              {contactPagination.totalPages > 1 && (
                <div className="mt-6 flex justify-center items-center gap-4">
                  <button
                    onClick={() => handleContactPageChange(contactPagination.currentPage - 1)}
                    disabled={contactPagination.currentPage === 0}
                    className={`p-2 rounded ${contactPagination.currentPage === 0 ? 'text-gray-400' : 'text-gray-700 hover:bg-gray-100'}`}
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <span className="text-sm text-gray-600">
                    Page {contactPagination.currentPage + 1} of {contactPagination.totalPages}
                  </span>
                  <button
                    onClick={() => handleContactPageChange(contactPagination.currentPage + 1)}
                    disabled={contactPagination.currentPage >= contactPagination.totalPages - 1}
                    className={`p-2 rounded ${contactPagination.currentPage >= contactPagination.totalPages - 1 ? 'text-gray-400' : 'text-gray-700 hover:bg-gray-100'}`}
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
              )}
            </div>

            <div className="p-6 border-t">
              <div className="flex justify-between items-center">
                <div className="text-gray-600">
                  {selectedContactIds.size} contacts selected
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={() => setShowContactModal(false)}
                    className="px-5 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSaveContactsToGroup}
                    disabled={selectedContactIds.size === 0}
                    className={`px-5 py-2.5 rounded-lg ${
                      selectedContactIds.size === 0
                        ? 'bg-blue-300 cursor-not-allowed'
                        : 'bg-blue-600 hover:bg-blue-700'
                    } text-white`}
                  >
                    Save Changes
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Groups;