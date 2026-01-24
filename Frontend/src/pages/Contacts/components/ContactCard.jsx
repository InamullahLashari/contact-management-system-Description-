
// export default ContactCard;
import React from 'react';
import { User, Phone, Mail, Briefcase, Building, MapPin, Eye, Edit, Trash2 } from 'lucide-react';

const ContactCard = ({ contact, onView, onEdit, onDelete }) => {
  // Ensure data is properly formatted
  const displayName = `${contact.firstName || ''} ${contact.lastName || ''}`.trim() || 'No Name';
  const displayTitle = contact.title || 'No Title';
  const displayCompany = contact.company || 'Not specified';
  
  return (
    <div className="group relative bg-gray-800/40 backdrop-blur-sm border border-gray-700 rounded-xl p-4 hover:border-blue-500/50 hover:bg-gray-800/60 transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/10">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center">
            <User className="w-6 h-6 text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-semibold text-white truncate" title={displayName}>
              {displayName}
            </h3>
            <p className="text-sm text-blue-400 truncate" title={displayTitle}>
              {displayTitle}
            </p>
          </div>
        </div>
        <button
          onClick={() => onDelete(contact.id, displayName)}
          className="text-gray-400 hover:text-red-400 p-1.5 hover:bg-red-500/10 rounded-lg transition-colors"
          title="Delete Contact"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>

      {/* Contact Details */}
      <div className="space-y-3">
        {/* Company */}
        {contact.company && (
          <div className="flex items-center gap-2 text-gray-300">
            <Building className="w-4 h-4 text-blue-400 flex-shrink-0" />
            <span className="text-sm truncate" title={contact.company}>{contact.company}</span>
          </div>
        )}

        {/* Phones */}
        {contact.phones && contact.phones.length > 0 && (
          <div className="space-y-1">
            {contact.phones.slice(0, 1).map((phone, idx) => (
              <div key={idx} className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-green-400 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="text-xs text-gray-400">{phone.label}</div>
                  <div className="text-sm text-white truncate">{phone.phoneNumber}</div>
                </div>
              </div>
            ))}
            {contact.phones.length > 1 && (
              <div className="text-xs text-gray-500 ml-6">
                +{contact.phones.length - 1} more phone{contact.phones.length - 1 > 1 ? 's' : ''}
              </div>
            )}
          </div>
        )}

        {/* Emails */}
        {contact.emails && contact.emails.length > 0 && (
          <div className="space-y-1">
            {contact.emails.slice(0, 1).map((email, idx) => (
              <div key={idx} className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-yellow-400 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="text-xs text-gray-400">{email.label}</div>
                  <div className="text-sm text-white truncate" title={email.emailAddress}>
                    {email.emailAddress}
                  </div>
                </div>
              </div>
            ))}
            {contact.emails.length > 1 && (
              <div className="text-xs text-gray-500 ml-6">
                +{contact.emails.length - 1} more email{contact.emails.length - 1 > 1 ? 's' : ''}
              </div>
            )}
          </div>
        )}

        {/* Department */}
        {contact.department && (
          <div className="flex items-center gap-2 text-gray-300">
            <Briefcase className="w-4 h-4 text-purple-400 flex-shrink-0" />
            <span className="text-sm truncate" title={contact.department}>{contact.department}</span>
          </div>
        )}

        {/* Address */}
        {contact.address && (
          <div className="flex items-center gap-2 text-gray-300">
            <MapPin className="w-4 h-4 text-red-400 flex-shrink-0" />
            <span className="text-sm truncate" title={contact.address}>{contact.address}</span>
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex gap-2 mt-4 pt-4 border-t border-gray-700/50">
        <button
          onClick={() => onView(contact)}
          className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-blue-600/20 text-blue-400 rounded-lg hover:bg-blue-600/30 transition-colors text-sm"
        >
          <Eye className="w-3 h-3" />
          View
        </button>
        <button
          onClick={() => onEdit(contact)}
          className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-gray-700/50 text-gray-300 rounded-lg hover:bg-gray-700 transition-colors text-sm"
        >
          <Edit className="w-3 h-3" />
          Edit
        </button>
      </div>
    </div>
  );
};

export default ContactCard;