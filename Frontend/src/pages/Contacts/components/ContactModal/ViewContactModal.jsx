import React from 'react';
import { User, Phone, Mail, Briefcase, Building, MapPin, StickyNote, X, Edit, Trash2 } from 'lucide-react';

const ViewContactModal = ({ contact, onClose, onEdit, onDelete }) => (
  <>
    {/* Modal Header - View Mode */}
    <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-6 text-white">
      <div className="flex justify-between items-start">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
            <User className="w-8 h-8" />
          </div>
          <div>
            <h2 className="text-2xl font-bold">{contact.firstName} {contact.lastName}</h2>
            <p className="text-white/90">{contact.title || "No title"}</p>
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

    {/* Modal Body - View Mode */}
    <div className="p-6 overflow-y-auto max-h-[60vh]">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Contact Info */}
        <div className="space-y-4">
          <div className="flex items-start gap-3">
            <User className="text-blue-500 mt-1 flex-shrink-0" />
            <div>
              <p className="text-sm text-gray-600">Full Name</p>
              <p className="font-medium">{contact.firstName} {contact.lastName}</p>
            </div>
          </div>

          {contact.company && (
            <div className="flex items-start gap-3">
              <Building className="text-blue-500 mt-1 flex-shrink-0" />
              <div>
                <p className="text-sm text-gray-600">Company</p>
                <p className="font-medium">{contact.company}</p>
              </div>
            </div>
          )}

          {contact.department && (
            <div className="flex items-start gap-3">
              <Briefcase className="text-blue-500 mt-1 flex-shrink-0" />
              <div>
                <p className="text-sm text-gray-600">Department</p>
                <p className="font-medium">{contact.department}</p>
              </div>
            </div>
          )}

          {contact.address && (
            <div className="flex items-start gap-3">
              <MapPin className="text-blue-500 mt-1 flex-shrink-0" />
              <div>
                <p className="text-sm text-gray-600">Address</p>
                <p className="font-medium">{contact.address}</p>
              </div>
            </div>
          )}
        </div>

        {/* Contact Details */}
        <div className="space-y-4">
          {/* Phone Numbers */}
          {contact.phones && contact.phones.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2 flex items-center gap-2">
                <Phone className="text-blue-500" />
                Phone Numbers
              </h3>
              <div className="space-y-2">
                {contact.phones.map((phone, idx) => (
                  <div key={idx} className="bg-gray-50 p-3 rounded-lg">
                    <p className="text-sm text-gray-600">{phone.label}</p>
                    <p className="font-medium text-lg">{phone.phoneNumber}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Email Addresses */}
          {contact.emails && contact.emails.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2 flex items-center gap-2">
                <Mail className="text-blue-500" />
                Email Addresses
              </h3>
              <div className="space-y-2">
                {contact.emails.map((email, idx) => (
                  <div key={idx} className="bg-gray-50 p-3 rounded-lg">
                    <p className="text-sm text-gray-600">{email.label}</p>
                    <p className="font-medium text-lg truncate">{email.emailAddress}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Notes */}
        {contact.notes && (
          <div className="md:col-span-2">
            <h3 className="text-lg font-semibold text-gray-800 mb-2 flex items-center gap-2">
              <StickyNote className="text-blue-500" />
              Notes
            </h3>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-gray-700 whitespace-pre-wrap">{contact.notes}</p>
            </div>
          </div>
        )}
      </div>
    </div>

    {/* Modal Footer - View Mode */}
    <div className="bg-gray-50 px-6 py-4 flex justify-between">
      <button
        onClick={() => onDelete(contact.id, `${contact.firstName} ${contact.lastName}`)}
        className="px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors flex items-center gap-2"
      >
        <Trash2 className="w-4 h-4" />
        Delete
      </button>
      <div className="flex gap-3">
        <button
          onClick={onClose}
          className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
        >
          Close
        </button>
        <button
          onClick={onEdit}
          className="px-6 py-2 bg-gradient-to-r from-orange-500 to-yellow-500 text-white rounded-lg hover:opacity-90 transition-opacity flex items-center gap-2"
        >
          <Edit className="w-4 h-4" />
          Edit Contact
        </button>
      </div>
    </div>
  </>
);

export default ViewContactModal;