import React from 'react';
import { X } from 'lucide-react';

const GroupFormModal = ({
  isOpen,
  title,
  formData,
  onChange,
  onSubmit,
  onClose
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50">
      <div className="bg-gray-800 rounded-xl w-full max-w-md p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-white">{title}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <input
          type="text"
          placeholder="Group Name"
          value={formData.groupName}
          onChange={(e) => onChange({ ...formData, groupName: e.target.value })}
          className="w-full p-3 mb-3 bg-gray-900 border border-gray-700 rounded-lg text-white"
          required
        />
        
        <textarea
          placeholder="Description (optional)"
          value={formData.description}
          onChange={(e) => onChange({ ...formData, description: e.target.value })}
          rows="3"
          className="w-full p-3 mb-3 bg-gray-900 border border-gray-700 rounded-lg text-white"
        />

        <div className="flex justify-end gap-3 mt-4">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-600 rounded-lg text-gray-300 hover:bg-gray-700"
          >
            Cancel
          </button>
          <button
            onClick={onSubmit}
            disabled={!formData.groupName}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            {title.includes('Create') ? 'Create' : 'Update'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default GroupFormModal;