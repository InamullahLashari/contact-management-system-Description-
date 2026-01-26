import React from 'react';
import { User, Phone, Mail, Briefcase, X, Save, Plus, Minus, ArrowLeft } from 'lucide-react';

const EditContactModal = ({ 
  editForm, 
  onClose, 
  onSave, 
  onChange, 
  onArrayChange, 
  onAddArrayItem, 
  onRemoveArrayItem, 
  onSwitchToView 
}) => (
  <>
    {/* Modal Header - Edit Mode */}
    <div className="bg-gradient-to-r from-orange-500 to-yellow-500 p-6 text-white">
      <div className="flex justify-between items-start">
        <div className="flex items-center gap-4">
          <button
            onClick={onSwitchToView}
            className="text-white/80 hover:text-white p-2 rounded-full hover:bg-white/20 transition-colors"
            title="Back to View"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
              <User className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-2xl font-bold">
                {editForm.id ? `Edit ${editForm.firstName} ${editForm.lastName}` : "Create New Contact"}
              </h2>
              <p className="text-white/90">Fill in the contact details below</p>
            </div>
          </div>
        </div>
        <button
          onClick={onClose}
          className="text-white/80 hover:text-white p-2 rounded-full hover:bg-white/20 transition-colors"
        >
          <X className="w-6 h-6" />
        </button>
      </div>
    </div>

    {/* Modal Body - Edit Mode */}
    <div className="p-6 overflow-y-auto max-h-[60vh]">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Basic Info */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-800">Basic Information</h3>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              First Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="firstName"
              value={editForm.firstName}
              onChange={onChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
              placeholder="John"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Last Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="lastName"
              value={editForm.lastName}
              onChange={onChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
              placeholder="Doe"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Title/Position</label>
            <input
              type="text"
              name="title"
              value={editForm.title}
              onChange={onChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
              placeholder="Software Engineer"
            />
          </div>
        </div>

        {/* Spacer column - you could add other fields here in the future */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-800">&nbsp;</h3>
          {/* This empty column maintains the grid layout */}
        </div>

        {/* Phone Numbers */}
        <div className="md:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
              <Phone className="text-orange-500" />
              Phone Numbers
            </h3>
            <button
              type="button"
              onClick={() => onAddArrayItem('phones', { label: "Mobile", phoneNumber: "" })}
              className="flex items-center gap-2 px-3 py-1 text-sm bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors"
            >
              <Plus className="w-3 h-3" />
              Add Phone
            </button>
          </div>

          <div className="space-y-3">
            {editForm.phones.map((phone, index) => (
              <div key={index} className="flex gap-3 items-start">
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Label</label>
                  <select
                    value={phone.label}
                    onChange={(e) => onArrayChange('phones', index, 'label', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
                  >
                    <option value="Mobile">Mobile</option>
                    <option value="Work">Work</option>
                    <option value="Home">Home</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                  <input
                    type="tel"
                    value={phone.phoneNumber}
                    onChange={(e) => onArrayChange('phones', index, 'phoneNumber', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
                    placeholder="+1 (555) 123-4567"
                  />
                </div>
                <div className="pt-6">
                  {editForm.phones.length > 1 && (
                    <button
                      type="button"
                      onClick={() => onRemoveArrayItem('phones', index)}
                      className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                      title="Remove phone"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Email Addresses */}
        <div className="md:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
              <Mail className="text-orange-500" />
              Email Addresses
            </h3>
            <button
              type="button"
              onClick={() => onAddArrayItem('emails', { label: "Work", emailAddress: "" })}
              className="flex items-center gap-2 px-3 py-1 text-sm bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors"
            >
              <Plus className="w-3 h-3" />
              Add Email
            </button>
          </div>

          <div className="space-y-3">
            {editForm.emails.map((email, index) => (
              <div key={index} className="flex gap-3 items-start">
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Label</label>
                  <select
                    value={email.label}
                    onChange={(e) => onArrayChange('emails', index, 'label', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
                  >
                    <option value="Work">Work</option>
                    <option value="Personal">Personal</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                  <input
                    type="email"
                    value={email.emailAddress}
                    onChange={(e) => onArrayChange('emails', index, 'emailAddress', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
                    placeholder="john.doe@example.com"
                  />
                </div>
                <div className="pt-6">
                  {editForm.emails.length > 1 && (
                    <button
                      type="button"
                      onClick={() => onRemoveArrayItem('emails', index)}
                      className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                      title="Remove email"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>

    {/* Modal Footer - Edit Mode */}
    <div className="bg-gray-50 px-6 py-4 flex justify-between items-center">
      <div>
        <p className="text-sm text-gray-500">
          <span className="text-red-500">*</span> Required fields
        </p>
      </div>
      <div className="flex gap-3">
        <button
          onClick={onClose}
          className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
        >
          Cancel
        </button>
        <button
          onClick={onSave}
          className="px-6 py-2 bg-gradient-to-r from-orange-500 to-yellow-500 text-white rounded-lg hover:opacity-90 transition-opacity flex items-center gap-2"
        >
          <Save className="w-4 h-4" />
          {editForm.id ? "Update Contact" : "Create Contact"}
        </button>
      </div>
    </div>
  </>
);

export default EditContactModal;