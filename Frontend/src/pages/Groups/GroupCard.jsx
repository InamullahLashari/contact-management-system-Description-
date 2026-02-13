// GroupCard.jsx
import React, { useState } from 'react';
import { Users, User, Eye, Edit, Trash2, AlertTriangle } from 'lucide-react';

const GroupCard = ({ group, onView, onEdit, onDelete }) => {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  
  // Get contact count display
  const contactCount = group.contactFirstNames?.length || 0;

  const handleDeleteClick = (e) => {
    e.stopPropagation();
    setShowDeleteConfirm(true);
  };

  const handleConfirmDelete = async () => {
    await onDelete(group.id, group.groupName);
    setShowDeleteConfirm(false);
  };

  const handleCancelDelete = () => {
    setShowDeleteConfirm(false);
  };

  return (
    <>
      <div className="group relative bg-gray-800/40 backdrop-blur-sm border border-gray-700 rounded-xl p-4 hover:border-blue-500/50 hover:bg-gray-800/60 transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/10">
        {/* Header with name and delete button */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-purple-600 rounded-full flex items-center justify-center">
              <Users className="w-6 h-6 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-lg font-semibold text-white truncate" title={group.groupName}>
                {group.groupName || 'Untitled Group'}
              </h3>
              <p className="text-sm text-purple-400 truncate" title="Group ID">
                ID: {group.id}
              </p>
            </div>
          </div>
          <button
            onClick={handleDeleteClick}
            className="text-gray-400 hover:text-red-400 p-1.5 hover:bg-red-500/10 rounded-lg transition-colors"
            title="Delete Group"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>

        {/* Group Details */}
        <div className="space-y-3">
          {/* Description */}
          {group.description && group.description !== "null" ? (
            <div className="flex items-start gap-2">
              <div className="w-4 h-4 mt-0.5 text-gray-500 flex-shrink-0">📝</div>
              <div className="flex-1 min-w-0">
                <div className="text-xs text-gray-400">Description</div>
                <div className="text-sm text-gray-300 line-clamp-2" title={group.description}>
                  {group.description}
                </div>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-2 text-gray-500">
              <div className="w-4 h-4 text-gray-500 flex-shrink-0">📝</div>
              <div className="text-sm">No description</div>
            </div>
          )}

          {/* Contact Count */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <User className="w-4 h-4 text-blue-400 flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <div className="text-xs text-gray-400">Contacts</div>
                <div className="text-sm text-white">
                  {contactCount} {contactCount === 1 ? 'contact' : 'contacts'}
                </div>
              </div>
            </div>

            {/* Contact Avatars Preview */}
            {contactCount > 0 && (
              <div className="ml-6">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs text-gray-500">Recent contacts</span>
                  <span className="text-xs text-gray-500 bg-gray-700/50 px-2 py-0.5 rounded-full">
                    {contactCount} total
                  </span>
                </div>
                <div className="flex -space-x-2 overflow-hidden">
                  {group.contactFirstNames?.slice(0, 5).map((name, idx) => (
                    <div
                      key={`${group.id}-${idx}`}
                      className="inline-block w-7 h-7 rounded-full ring-2 ring-gray-800 bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center"
                      title={name}
                    >
                      <span className="text-xs font-medium text-white">
                        {name?.charAt(0).toUpperCase() || '?'}
                      </span>
                    </div>
                  ))}
                  {contactCount > 5 && (
                    <div className="inline-block w-7 h-7 rounded-full ring-2 ring-gray-800 bg-gray-700 flex items-center justify-center">
                      <span className="text-xs font-medium text-gray-300">
                        +{contactCount - 5}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Action Buttons - Only View and Edit */}
        <div className="flex gap-2 mt-4 pt-4 border-t border-gray-700/50">
          <button
            onClick={() => onView(group)}
            className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-blue-600/20 text-blue-400 rounded-lg hover:bg-blue-600/30 transition-colors text-sm"
          >
            <Eye className="w-3 h-3" />
            View Contacts
          </button>
          <button
            onClick={() => onEdit(group)}
            className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-gray-700/50 text-gray-300 rounded-lg hover:bg-gray-700 transition-colors text-sm"
          >
            <Edit className="w-3 h-3" />
            Edit
          </button>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60">
          <div className="bg-gray-800 rounded-xl w-full max-w-md border border-gray-700">
            {/* Header */}
            <div className="p-5 border-b border-gray-700">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-red-500/20 rounded-full flex items-center justify-center">
                  <AlertTriangle className="w-5 h-5 text-red-500" />
                </div>
                <h3 className="text-lg font-semibold text-white">Delete Group</h3>
              </div>
            </div>

            {/* Content */}
            <div className="p-5">
              <p className="text-gray-300">
                Are you sure you want to delete <span className="font-semibold text-red-400">"{group.groupName}"</span>?
              </p>
            </div>

            {/* Footer */}
            <div className="p-5 border-t border-gray-700 flex justify-end gap-3">
              <button
                onClick={handleCancelDelete}
                className="px-4 py-2 border border-gray-600 rounded-lg text-gray-300 hover:bg-gray-700"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDelete}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 flex items-center gap-2"
              >
                <Trash2 className="w-4 h-4" />
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default GroupCard;