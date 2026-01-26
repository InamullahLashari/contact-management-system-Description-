import React, { useState, useEffect } from "react";
import contactApi from "../../api/contactApi";
import { 
  RefreshCw, PlusCircle, ChevronLeft, ChevronRight 
} from "lucide-react";

// Import components
import LoadingSpinner from "./components/LoadingSpinner";
import ErrorMessage from "./components/ErrorMessage";
import ContactCard from "./components/ContactCard";
import ViewContactModal from "./components/ContactModal/ViewContactModal";
import EditContactModal from "./components/ContactModal/EditContactModal";
import DeleteConfirmationModal from "./components/ContactModal/DeleteConfirmationModal";

const ContactList = () => {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState('view');
  const [selectedContact, setSelectedContact] = useState(null);
  const [editForm, setEditForm] = useState({
    id: "",
    firstName: "",
    lastName: "",
    title: "",
    phones: [{ label: "Mobile", phoneNumber: "" }],
    emails: [{ label: "Work", emailAddress: "" }]
  });
  const [deleteConfirm, setDeleteConfirm] = useState({
    show: false,
    contactId: null,
    contactName: ""
  });
  const [pagination, setPagination] = useState({
    currentPage: 0,
    totalPages: 0,
    totalElements: 0,
    pageSize: 12
  });

  // Get search and filters from localStorage
  const getSearchFilters = () => {
    try {
      const stored = localStorage.getItem('contactSearchFilters');
      if (stored) {
        const data = JSON.parse(stored);
        return {
          keywords: data.query || '',
          sortBy: data.filters?.sortBy || 'firstName',
          sortDir: data.filters?.sortDir || 'asc'
        };
      }
    } catch (err) {
      console.error('Error parsing search filters:', err);
    }
    return {
      keywords: '',
      sortBy: 'firstName',
      sortDir: 'asc'
    };
  };

  const fetchContacts = async (page = 0, size = 12) => {
    try {
      setLoading(true);
      const { keywords, sortBy, sortDir } = getSearchFilters();
      
      console.log("Fetching contacts with filters:", { page, size, keywords, sortBy, sortDir });
      
      const response = await contactApi.getContacts({
        page,
        size,
        keywords,
        sortBy,
        sortDir
      });

      console.log("API Response:", response);

      let contactsData = [];
      let totalElements = 0;
      let totalPages = 0;

      if (response.data) {
        if (response.data.content) {
          contactsData = response.data.content;
          totalElements = response.data.totalElements || 0;
          totalPages = response.data.totalPages || 0;
        } else if (response.data.contacts) {
          contactsData = response.data.contacts;
          totalElements = response.data.totalElements || response.data.contacts.length;
          totalPages = response.data.totalPages || Math.ceil(response.data.contacts.length / size);
        } else if (Array.isArray(response.data)) {
          contactsData = response.data;
          totalElements = response.data.length;
          totalPages = Math.ceil(response.data.length / size);
        } else if (response.data.data && Array.isArray(response.data.data)) {
          contactsData = response.data.data;
          totalElements = response.data.total || response.data.data.length;
          totalPages = response.data.totalPages || Math.ceil(response.data.data.length / size);
        } else {
          Object.keys(response.data).forEach(key => {
            if (Array.isArray(response.data[key]) && !contactsData.length) {
              contactsData = response.data[key];
            }
          });
          
          if (contactsData.length) {
            totalElements = response.data.totalElements || response.data.total || contactsData.length;
            totalPages = response.data.totalPages || Math.ceil(contactsData.length / size);
          }
        }
      }

      console.log("Processed Data:", { contactsData, totalElements, totalPages });

      setContacts(contactsData);
      setPagination({
        currentPage: page,
        pageSize: size,
        totalElements: totalElements,
        totalPages: totalPages || 1
      });
      
      setError(null);
    } catch (err) {
      console.error("Error fetching contacts:", err);
      setError(err.response?.data?.message || "Failed to load contacts. Please try again.");
      setContacts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContacts();

    const handleStorageChange = (e) => {
      if (e.key === 'contactSearchFilters') {
        fetchContacts(0, pagination.pageSize);
      }
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('contactFiltersChanged', () => {
      fetchContacts(0, pagination.pageSize);
    });

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('contactFiltersChanged', () => {
        fetchContacts(0, pagination.pageSize);
      });
    };
  }, []);

  // Handle modal open for viewing
  const handleViewContact = (contact) => {
    setSelectedContact(contact);
    setModalMode('view');
    setShowModal(true);
  };

  // Handle modal open for editing
  const handleEditContact = (contact) => {
    if (contact) {
      setEditForm({
        id: contact.id || "",
        firstName: contact.firstName || "",
        lastName: contact.lastName || "",
        title: contact.title || "",
        phones: contact.phones?.length > 0
          ? contact.phones.map(phone => ({
            label: phone.label || "Mobile",
            phoneNumber: phone.phoneNumber || ""
          }))
          : [{ label: "Mobile", phoneNumber: "" }],
        emails: contact.emails?.length > 0
          ? contact.emails.map(email => ({
            label: email.label || "Work",
            emailAddress: email.emailAddress || ""
          }))
          : [{ label: "Work", emailAddress: "" }]
      });
    } else {
      // For new contact
      setEditForm({
        id: "",
        firstName: "",
        lastName: "",
        title: "",
        phones: [{ label: "Mobile", phoneNumber: "" }],
        emails: [{ label: "Work", emailAddress: "" }]
      });
    }
    setModalMode('edit');
    setShowModal(true);
  };

  // Switch from view to edit mode
  const switchToEditMode = () => {
    if (selectedContact) {
      handleEditContact(selectedContact);
    }
  };

  // Switch from edit to view mode
  const switchToViewMode = () => {
    setModalMode('view');
  };

  // Handle edit form changes
  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle phone/email array changes
  const handleArrayChange = (field, index, key, value) => {
    setEditForm(prev => ({
      ...prev,
      [field]: prev[field].map((item, i) =>
        i === index ? { ...item, [key]: value } : item
      )
    }));
  };

  // Add new phone/email field
  const addArrayItem = (field, template) => {
    setEditForm(prev => ({
      ...prev,
      [field]: [...prev[field], { ...template }]
    }));
  };

  // Remove phone/email field
  const removeArrayItem = (field, index) => {
    if (editForm[field].length > 1) {
      setEditForm(prev => ({
        ...prev,
        [field]: prev[field].filter((_, i) => i !== index)
      }));
    }
  };

  // THE FIX: Save contact (update or create)
  const handleSaveContact = async () => {
    try {
      // Validation
      if (!editForm.firstName.trim() || !editForm.lastName.trim()) {
        alert("First name and last name are required");
        return;
      }

      const invalidPhone = editForm.phones.find(phone =>
        phone.phoneNumber && !/^[\d\s\-\+\(\)]+$/.test(phone.phoneNumber)
      );
      if (invalidPhone) {
        alert("Please enter valid phone numbers");
        return;
      }

      const invalidEmail = editForm.emails.find(email =>
        email.emailAddress && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.emailAddress)
      );
      if (invalidEmail) {
        alert("Please enter valid email addresses");
        return;
      }

      // Prepare contact data
      const contactData = {
        ...editForm,
        phones: editForm.phones.filter(phone => phone.phoneNumber.trim() !== ""),
        emails: editForm.emails.filter(email => email.emailAddress.trim() !== "")
      };

      console.log("Saving contact data:", contactData);

      if (editForm.id) {
        // Update existing contact
        const response = await contactApi.updateContact(editForm.id, contactData);
        console.log("Update response:", response);
        
        // Get the updated contact data from backend response
        let updatedContact;
        if (response.data) {
          updatedContact = response.data;
        } else if (response) {
          updatedContact = response;
        } else {
          // Fallback: use what we sent
          updatedContact = contactData;
        }

        // Update local state with backend response
        setContacts(prevContacts => 
          prevContacts.map(contact =>
            contact.id === editForm.id ? { ...contact, ...updatedContact } : contact
          )
        );

        // Update selected contact
        setSelectedContact(prev => prev ? { ...prev, ...updatedContact } : updatedContact);

        alert("Contact updated successfully!");
      } else {
        // Create new contact - THE FIX IS HERE
        console.log("Creating new contact:", contactData);
        
        // OPTIMISTIC UPDATE: Add contact immediately with temporary data
        const tempContact = {
          ...contactData,
          id: `temp-${Date.now()}`, // Temporary ID
          // Use the actual form data (which has user input) instead of empty strings
          firstName: contactData.firstName,
          lastName: contactData.lastName,
          title: contactData.title || "",
          phones: contactData.phones || [],
          emails: contactData.emails || []
        };
        
        console.log("Temporary contact for optimistic update:", tempContact);
        
        // Add to state immediately (optimistic update)
        setContacts(prevContacts => [tempContact, ...prevContacts]);
        
        // Send to backend
        const response = await contactApi.createContact(contactData);
        console.log("Create response from backend:", response);
        
        // Get the actual saved contact from backend
        let savedContact;
        if (response.data) {
          savedContact = response.data;
        } else if (response.contact) {
          savedContact = response.contact;
        } else if (response) {
          savedContact = response;
        }
        
        if (savedContact && savedContact.id) {
          console.log("Backend returned saved contact:", savedContact);
          
          // Replace the temporary contact with the real one from backend
          setContacts(prevContacts => 
            prevContacts.map(contact => 
              contact.id === tempContact.id ? savedContact : contact
            )
          );
          
          setSelectedContact(savedContact);
          
          // Update pagination
          setPagination(prev => ({
            ...prev,
            totalElements: prev.totalElements + 1
          }));
          
          alert("Contact created successfully!");
        } else {
          console.warn("Backend didn't return complete contact data:", response);
          // If backend doesn't return full data, keep the optimistic update
          // The next refresh will fetch the correct data
          alert("Contact created! Refreshing list...");
          // Refresh the list to get correct data from backend
          setTimeout(() => {
            fetchContacts(0, pagination.pageSize);
          }, 500);
        }
      }

      // Switch back to view mode
      setModalMode('view');
      
      // Close modal after success
      setTimeout(() => {
        setShowModal(false);
      }, 1500);

    } catch (err) {
      console.error("Error saving contact:", err);
      alert(err.response?.data?.message || "Failed to save contact. Please try again.");
      
      // If create failed, remove the optimistic update
      if (!editForm.id) {
        setContacts(prevContacts => 
          prevContacts.filter(contact => !contact.id.startsWith('temp-'))
        );
      }
    }
  };

  // Close modal
  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedContact(null);
    setModalMode('view');
  };

  // Handle delete contact
  const handleDeleteContact = (contactId, contactName) => {
    setDeleteConfirm({
      show: true,
      contactId,
      contactName
    });
  };

  // Confirm delete
  const confirmDelete = async () => {
    try {
      await contactApi.deleteContact(deleteConfirm.contactId);

      setContacts(prevContacts => 
        prevContacts.filter(contact => contact.id !== deleteConfirm.contactId)
      );
      setPagination(prev => ({
        ...prev,
        totalElements: prev.totalElements - 1
      }));

      // Close modal if the deleted contact is currently being viewed/edited
      if (selectedContact && selectedContact.id === deleteConfirm.contactId) {
        handleCloseModal();
      }

      alert(`Contact ${deleteConfirm.contactName} deleted successfully!`);

    } catch (err) {
      console.error("Error deleting contact:", err);
      alert("Failed to delete contact. Please try again.");
    } finally {
      setDeleteConfirm({ show: false, contactId: null, contactName: "" });
    }
  };

  const cancelDelete = () => {
    setDeleteConfirm({ show: false, contactId: null, contactName: "" });
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 0 && newPage < pagination.totalPages) {
      fetchContacts(newPage, pagination.pageSize);
    }
  };

  const handleRefresh = () => {
    fetchContacts(pagination.currentPage, pagination.pageSize);
  };

  const clearFilters = () => {
    localStorage.removeItem('contactSearchFilters');
    window.dispatchEvent(new Event('contactFiltersChanged'));
  };

  const hasActiveFilters = () => {
    const { keywords, sortBy, sortDir } = getSearchFilters();
    return keywords.trim() || sortBy !== 'firstName' || sortDir !== 'asc';
  };

  // Format contact data for display
  const formatContactForDisplay = (contact) => {
    const formattedContact = {
      ...contact,
      id: contact.id || "",
      firstName: contact.firstName || "",
      lastName: contact.lastName || "",
      title: contact.title || "",
      phones: contact.phones?.map(phone => ({
        label: phone.label || "Mobile",
        phoneNumber: phone.phoneNumber || ""
      })) || [],
      emails: contact.emails?.map(email => ({
        label: email.label || "Email",
        emailAddress: email.emailAddress || ""
      })) || []
    };
    
    return formattedContact;
  };

  // Render loading state
  if (loading) {
    return <LoadingSpinner />;
  }

  // Render error state
  if (error) {
    return <ErrorMessage error={error} onRetry={handleRefresh} />;
  }

  return (
    <div className="h-full flex flex-col bg-gradient-to-br from-gray-900 to-gray-950">
      {/* Fixed Header - Clean and minimal */}
      <div className="flex-shrink-0 p-4 md:p-6">
        <div className="flex justify-between items-center">
          <div className="text-gray-400 text-sm">
            {pagination.totalElements} contacts • Page {pagination.currentPage + 1} of {pagination.totalPages}
          </div>
          
          <div className="flex gap-3">
            <button
              onClick={handleRefresh}
              className="flex items-center gap-2 px-4 py-2 bg-gray-800 text-gray-300 rounded-lg hover:bg-gray-700 transition-colors"
              title="Refresh"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
            <button
              onClick={() => handleEditContact(null)}
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:opacity-90 transition-opacity"
            >
              <PlusCircle className="w-4 h-4" />
              Add Contact
            </button>
          </div>
        </div>
      </div>

      {/* Scrollable Contacts Area */}
      <div className="flex-1 overflow-y-auto px-4 md:px-6 pb-4">
        {contacts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {contacts.map((contact) => {
              const formattedContact = formatContactForDisplay(contact);
              return (
                <ContactCard
                  key={contact.id}
                  contact={formattedContact}
                  onView={handleViewContact}
                  onEdit={handleEditContact}
                  onDelete={handleDeleteContact}
                />
              );
            })}
          </div>
        ) : (
          <div className="h-full flex items-center justify-center">
            <div className="bg-gray-800/30 backdrop-blur-sm rounded-xl p-12 text-center max-w-md">
              <div className="w-20 h-20 mx-auto bg-gradient-to-r from-blue-900/30 to-blue-800/30 rounded-full flex items-center justify-center mb-4">
                <RefreshCw className="w-10 h-10 text-blue-400" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">No contacts found</h3>
              <p className="text-gray-400 mb-6">
                {hasActiveFilters()
                  ? "No contacts match your search criteria. Try different filters."
                  : "Get started by adding your first contact"}
              </p>
              <div className="flex gap-4 justify-center">
                {hasActiveFilters() && (
                  <button
                    onClick={clearFilters}
                    className="px-6 py-2 bg-gray-700 text-gray-300 rounded-lg hover:bg-gray-600 transition-colors"
                  >
                    Clear Filters
                  </button>
                )}
                <button
                  onClick={() => handleEditContact(null)}
                  className="px-6 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:opacity-90 transition-opacity"
                >
                  Add Your First Contact
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Fixed Pagination at Bottom */}
      {contacts.length > 0 && pagination.totalElements > 0 && pagination.totalPages > 1 && (
        <div className="flex-shrink-0 border-t border-gray-800 bg-gray-900/50 backdrop-blur-sm p-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="text-gray-400 text-sm">
              Showing {Math.min((pagination.currentPage + 1) * pagination.pageSize, pagination.totalElements)} of {pagination.totalElements} contacts
            </div>
            
            <div className="flex items-center gap-2">
              <button
                onClick={() => handlePageChange(pagination.currentPage - 1)}
                disabled={pagination.currentPage === 0}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                  pagination.currentPage === 0
                    ? "bg-gray-800 text-gray-600 cursor-not-allowed"
                    : "bg-gray-800 text-gray-300 hover:bg-gray-700"
                }`}
              >
                <ChevronLeft className="w-4 h-4" />
                Previous
              </button>
              
              <div className="flex gap-1">
                {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
                  let pageNum;
                  if (pagination.totalPages <= 5) {
                    pageNum = i;
                  } else if (pagination.currentPage <= 2) {
                    pageNum = i;
                  } else if (pagination.currentPage >= pagination.totalPages - 3) {
                    pageNum = pagination.totalPages - 5 + i;
                  } else {
                    pageNum = pagination.currentPage - 2 + i;
                  }
                  
                  return (
                    <button
                      key={pageNum}
                      onClick={() => handlePageChange(pageNum)}
                      className={`w-10 h-10 rounded-lg transition-colors ${
                        pagination.currentPage === pageNum
                          ? "bg-blue-600 text-white"
                          : "bg-gray-800 text-gray-300 hover:bg-gray-700"
                      }`}
                    >
                      {pageNum + 1}
                    </button>
                  );
                })}
              </div>
              
              <button
                onClick={() => handlePageChange(pagination.currentPage + 1)}
                disabled={pagination.currentPage >= pagination.totalPages - 1}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                  pagination.currentPage >= pagination.totalPages - 1
                    ? "bg-gray-800 text-gray-600 cursor-not-allowed"
                    : "bg-gray-800 text-gray-300 hover:bg-gray-700"
                }`}
              >
                Next
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* View Contact Modal */}
      {showModal && selectedContact && modalMode === 'view' && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-hidden">
            <ViewContactModal
              contact={formatContactForDisplay(selectedContact)}
              onClose={handleCloseModal}
              onEdit={switchToEditMode}
              onDelete={handleDeleteContact}
            />
          </div>
        </div>
      )}

      {/* Edit Contact Modal */}
      {showModal && modalMode === 'edit' && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-hidden">
            <EditContactModal
              editForm={editForm}
              onClose={handleCloseModal}
              onSave={handleSaveContact}
              onChange={handleEditChange}
              onArrayChange={handleArrayChange}
              onAddArrayItem={addArrayItem}
              onRemoveArrayItem={removeArrayItem}
              onSwitchToView={switchToViewMode}
            />
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirm.show && (
        <DeleteConfirmationModal
          deleteConfirm={deleteConfirm}
          onCancel={cancelDelete}
          onConfirm={confirmDelete}
        />
      )}
    </div>
  );
};

export default ContactList;