import React, { useState, useEffect } from 'react';
import groupAPI from '../../api/groupAPI';
import GroupCard from './GroupCard';
import CreateGroupModal from './CreateGroupModal';
import GroupFormModal from './GroupFormModal';
import ViewContactsModal from './ViewContactsModal';
import { Users, CheckCircle } from 'lucide-react';

function Groups() {
  // Groups data
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Modal states
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);

  // Success popup states
  const [showCreateSuccess, setShowCreateSuccess] = useState(false);
  const [showDeleteSuccess, setShowDeleteSuccess] = useState(false);
  const [createdGroup, setCreatedGroup] = useState(null);
  const [deletedGroupName, setDeletedGroupName] = useState('');

  // Form / selected contacts
  const [formData, setFormData] = useState({ groupName: '', description: '' });
  const [editingGroup, setEditingGroup] = useState(null);
  const [viewingGroup, setViewingGroup] = useState(null);
  const [groupContacts, setGroupContacts] = useState([]);

  // Fetch groups
  useEffect(() => {
    fetchGroups();
  }, []);

  const fetchGroups = async () => {
    try {
      setLoading(true);
      const response = await groupAPI.getGroups();
      console.log('Groups response:', response.data);
      
      if (response.data?.status === 'success') {
        setGroups(response.data.data?.groups || []);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load groups');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateGroup = async (groupData) => {
    try {
      const response = await groupAPI.createGroup(groupData);
      await fetchGroups();
      setShowCreateModal(false);
      
      // Show success popup
      setCreatedGroup(response.data || groupData);
      setShowCreateSuccess(true);
      
      // Auto hide after 3 seconds
      setTimeout(() => {
        setShowCreateSuccess(false);
        setCreatedGroup(null);
      }, 3000);
      
      return response.data || groupData;
    } catch (err) {
      setError('Failed to create group');
      throw err;
    }
  };

  // Update group - edit only name and description
  const handleUpdateGroup = async () => {
    try {
      await groupAPI.updateGroup(editingGroup.id, {
        groupName: formData.groupName,
        description: formData.description
      });
      await fetchGroups();
      setShowEditModal(false);
      resetForm();
    // eslint-disable-next-line no-unused-vars
    } catch (err) {
      setError('Failed to update group');
    }
  };

  // Delete group
  // In Groups.jsx - Update handleDelete function
const handleDelete = async (id, name) => {
  try {
    await groupAPI.deleteGroup(id);
    setGroups(groups.filter(g => g.id !== id));
    
    // Show delete success popup
    setDeletedGroupName(name);
    setShowDeleteSuccess(true);
    
    // Auto hide after 3 seconds
    setTimeout(() => {
      setShowDeleteSuccess(false);
      setDeletedGroupName('');
    }, 3000);
  // eslint-disable-next-line no-unused-vars
  } catch (err) {
    setError('Failed to delete group');
  }
};

  // View contacts - using contactFirstNames from backend
  const handleViewContacts = (group) => {
    setViewingGroup(group);
    
    // Map contactFirstNames to contacts array
    const contacts = (group.contactFirstNames || []).map((name, index) => ({
      id: index,
      name: name
    }));
    
    setGroupContacts(contacts);
    setShowViewModal(true);
  };

  // Edit group - only name and description
  const handleEditClick = (group) => {
    setEditingGroup(group);
    setFormData({ 
      groupName: group.groupName, 
      description: group.description || '' 
    });
    setShowEditModal(true);
  };

  const resetForm = () => {
    setFormData({ groupName: '', description: '' });
    setEditingGroup(null);
    setError(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent mx-auto"></div>
          <p className="mt-4 text-gray-400">Loading groups...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 py-8 relative">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white">Contact Groups</h1>
            <p className="text-gray-400 mt-1">{groups.length} groups</p>
          </div>
          <button
            onClick={() => setShowCreateModal(true)}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            + New Group
          </button>
        </div>

        {/* Error */}
        {error && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500 rounded-lg text-red-400">
            {error}
          </div>
        )}

        {/* Groups Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {groups.map(group => (
            <GroupCard
              key={group.id}
              group={group}
              onView={handleViewContacts}
              onEdit={handleEditClick}
              onDelete={handleDelete}
            />
          ))}
        </div>

        {/* Empty State */}
        {groups.length === 0 && !loading && (
          <div className="text-center py-16">
            <Users className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <h3 className="text-xl text-white mb-2">No groups yet</h3>
            <button
              onClick={() => setShowCreateModal(true)}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Create First Group
            </button>
          </div>
        )}

        {/* Create Group Modal */}
        <CreateGroupModal
          isOpen={showCreateModal}
          onClose={() => setShowCreateModal(false)}
          onCreate={handleCreateGroup}
        />

        {/* Edit Group Modal */}
        <GroupFormModal
          isOpen={showEditModal}
          title="Edit Group"
          formData={formData}
          onChange={setFormData}
          onSubmit={handleUpdateGroup}
          onClose={() => {
            setShowEditModal(false);
            resetForm();
          }}
        />

        {/* View Contacts Modal */}
        {showViewModal && viewingGroup && (
          <ViewContactsModal
            group={viewingGroup}
            contacts={groupContacts}
            onClose={() => {
              setShowViewModal(false);
              setViewingGroup(null);
              setGroupContacts([]);
            }}
          />
        )}
      </div>

      {/* Create Success Popup */}
      {showCreateSuccess && createdGroup && (
        <div className="fixed top-4 right-4 z-50 animate-slide-in-right">
          <div className="bg-green-500/10 border border-green-500 rounded-lg shadow-lg p-4 backdrop-blur-sm">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-green-500/20 rounded-full flex items-center justify-center">
                <CheckCircle className="w-4 h-4 text-green-500" />
              </div>
              <div>
                <h4 className="text-white font-medium">Group Created Successfully</h4>
                <p className="text-sm text-gray-300">
                  <span className="font-semibold text-green-400">"{createdGroup.groupName}"</span> has been created
                  {createdGroup.contactIds?.length > 0 && (
                    <> with <span className="font-semibold text-blue-400">{createdGroup.contactIds.length} contacts</span></>
                  )}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Success Popup */}
      {showDeleteSuccess && deletedGroupName && (
        <div className="fixed top-4 right-4 z-50 animate-slide-in-right">
          <div className="bg-red-500/10 border border-red-500 rounded-lg shadow-lg p-4 backdrop-blur-sm">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-red-500/20 rounded-full flex items-center justify-center">
                <CheckCircle className="w-4 h-4 text-red-500" />
              </div>
              <div>
                <h4 className="text-white font-medium">Group Deleted Successfully</h4>
                <p className="text-sm text-gray-300">
                  <span className="font-semibold text-red-400">"{deletedGroupName}"</span> has been removed
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Animation Styles */}
      <style jsx>{`
        @keyframes slideInRight {
          from {
            opacity: 0;
            transform: translateX(100%);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        
        .animate-slide-in-right {
          animation: slideInRight 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}

export default Groups;