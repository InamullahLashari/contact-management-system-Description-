import React, { useState, useEffect } from "react";
import contactApi from "../../api/contactApi";
import { 
  RefreshCw, PlusCircle, ChevronLeft, ChevronRight, CheckCircle, XCircle
} from "lucide-react";

// Import components
import LoadingSpinner from "./components/LoadingSpinner";
import ErrorMessage from "./components/ErrorMessage";
import ContactCard from "./components/ContactCard";
import ViewContactModal from "./components/ContactModal/ViewContactModal";
import EditContactModal from "./components/ContactModal/EditContactModal";
import DeleteConfirmationModal from "./components/ContactModal/DeleteConfirmationModal";

const ContactList = () => {
  const [allContacts, setAllContacts] = useState([]);
  const [displayContacts, setDisplayContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState('view');
  const [selectedContact, setSelectedContact] = useState(null);
  const [editForm, setEditForm] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState({
    show: false,
    contactId: null,
    contactName: ""
  });
  const [pagination, setPagination] = useState({
    currentPage: 0,
    totalPages: 1,
    totalElements: 0,
    pageSize: 10
  });
  
  const [notification, setNotification] = useState({
    show: false,
    type: 'success',
    message: '',
    title: ''
  });

  const getSearchFilters = () => {
    try {
      const sessionStored = sessionStorage.getItem('contactSearchFilters');
      if (sessionStored) {
        const data = JSON.parse(sessionStored);
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

  const showNotification = (type, title, message) => {
    setNotification({
      show: true,
      type,
      title,
      message
    });
    setTimeout(() => {
      setNotification(prev => ({ ...prev, show: false }));
    }, 3000);
  };

  const closeNotification = () => {
    setNotification(prev => ({ ...prev, show: false }));
  };

  const applySearchFilter = (contacts, searchText) => {
    if (!searchText?.trim()) return contacts;
    const searchTerm = searchText.trim().toLowerCase();
    return contacts.filter(contact => 
      (contact.firstName || '').toLowerCase().startsWith(searchTerm)
    );
  };

  const extractResponseData = (response) => {
    if (!response) return { contacts: [], totalElements: 0, totalPages: 1 };
    
    const responseData = response.data || response;
    const contacts = responseData.contacts || responseData.content || 
                    (Array.isArray(responseData) ? responseData : []);
    const totalElements = responseData.totalItems || responseData.totalElements || 
                         responseData.total || contacts.length;
    const totalPages = responseData.totalPages || Math.ceil(totalElements / pagination.pageSize);
    
    return { contacts, totalElements, totalPages };
  };

  const fetchContacts = async (page = 0, size = 10) => {
    try {
      setLoading(true);
      const { keywords, sortBy, sortDir } = getSearchFilters();
      
      const response = await contactApi.getContacts({ page, size, sortBy, sortDir });
      const { contacts, totalElements, totalPages } = extractResponseData(response);

      setAllContacts(contacts);
      
      const filteredContacts = applySearchFilter(contacts, keywords);
      const startIndex = page * size;
      const paginatedContacts = filteredContacts.slice(startIndex, startIndex + size);
      
      setDisplayContacts(paginatedContacts);
      setPagination({
        currentPage: page,
        pageSize: size,
        totalElements: filteredContacts.length,
        totalPages: Math.max(1, Math.ceil(filteredContacts.length / size))
      });
      
      setError(null);
    } catch (err) {
      console.error("Error fetching contacts:", err);
      setError(err.response?.data?.message || err.message || "Failed to load contacts. Please try again.");
      setAllContacts([]);
      setDisplayContacts([]);
      setPagination(prev => ({ ...prev, currentPage: 0, totalPages: 1, totalElements: 0 }));
    } finally {
      setLoading(false);
    }
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
    sessionStorage.removeItem('contactSearchFilters');
    window.dispatchEvent(new Event('contactFiltersChanged'));
  };

  const hasActiveFilters = () => {
    return getSearchFilters().keywords.trim() !== '';
  };

  useEffect(() => {
    const handleFiltersChanged = () => {
      fetchContacts(0, pagination.pageSize);
    };

    window.addEventListener('contactFiltersChanged', handleFiltersChanged);
    fetchContacts();

    return () => {
      window.removeEventListener('contactFiltersChanged', handleFiltersChanged);
    };
  }, []);

  const getEmptyContactForm = () => ({
    id: "",
    firstName: "",
    lastName: "",
    title: "",
    phones: [{ label: "Mobile", phoneNumber: "" }],
    emails: [{ label: "Work", emailAddress: "" }]
  });

  const createContactForm = (contact) => {
    if (!contact) return getEmptyContactForm();
    
    return {
      id: contact.id || "",
      firstName: contact.firstName || "",
      lastName: contact.lastName || "",
      title: contact.title || "",
      phones: contact.phones?.length > 0
        ? contact.phones.map(({ label = "Mobile", phoneNumber = "" }) => ({ label, phoneNumber }))
        : [{ label: "Mobile", phoneNumber: "" }],
      emails: contact.emails?.length > 0
        ? contact.emails.map(({ label = "Work", emailAddress = "" }) => ({ label, emailAddress }))
        : [{ label: "Work", emailAddress: "" }]
    };
  };

  const handleViewContact = (contact) => {
    setSelectedContact(contact);
    setModalMode('view');
    setShowModal(true);
  };

  const handleEditContact = (contact) => {
    setEditForm(createContactForm(contact));
    setModalMode('edit');
    setShowModal(true);
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditForm(prev => ({ ...prev, [name]: value }));
  };

  const handleArrayChange = (field, index, key, value) => {
    setEditForm(prev => ({
      ...prev,
      [field]: prev[field].map((item, i) =>
        i === index ? { ...item, [key]: value } : item
      )
    }));
  };

  const addArrayItem = (field, template) => {
    setEditForm(prev => ({
      ...prev,
      [field]: [...prev[field], { ...template }]
    }));
  };

  const removeArrayItem = (field, index) => {
    if (editForm[field].length > 1) {
      setEditForm(prev => ({
        ...prev,
        [field]: prev[field].filter((_, i) => i !== index)
      }));
    }
  };

  const validateContact = () => {
    if (!editForm.firstName.trim() || !editForm.lastName.trim()) {
      showNotification('error', 'Validation Error', 'First name and last name are required');
      return false;
    }

    const invalidPhone = editForm.phones.find(phone =>
      phone.phoneNumber && !/^[\d\s\-+()]+$/.test(phone.phoneNumber)
    );
    if (invalidPhone) {
      showNotification('error', 'Validation Error', 'Please enter valid phone numbers');
      return false;
    }

    const invalidEmail = editForm.emails.find(email =>
      email.emailAddress && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.emailAddress)
    );
    if (invalidEmail) {
      showNotification('error', 'Validation Error', 'Please enter valid email addresses');
      return false;
    }

    return true;
  };

  const prepareContactData = () => ({
    firstName: editForm.firstName.trim(),
    lastName: editForm.lastName.trim(),
    title: editForm.title?.trim() || "",
    phones: editForm.phones
      .filter(phone => phone.phoneNumber.trim())
      .map(phone => ({
        label: phone.label?.toLowerCase() || "mobile",
        phoneNumber: phone.phoneNumber.trim()
      })),
    emails: editForm.emails
      .filter(email => email.emailAddress.trim())
      .map(email => ({
        label: email.label?.toLowerCase() || "work",
        emailAddress: email.emailAddress.trim()
      }))
  });

  const handleSaveContact = async () => {
    try {
      if (!validateContact()) return;

      const contactData = prepareContactData();
      const isUpdate = !!editForm.id;
      
      if (isUpdate) {
        await contactApi.updateContact(editForm.id, contactData);
      } else {
        await contactApi.createContact(contactData);
      }

      showNotification('success', 'Success!', 
        isUpdate ? "Contact updated successfully!" : "Contact created successfully!");
      
      setShowModal(false);
      setModalMode('view');
      setSelectedContact(null);
      
      fetchContacts(pagination.currentPage, pagination.pageSize);
    } catch (err) {
      console.error("Error saving contact:", err);
      showNotification('error', 'Error', 
        err.response?.data?.message || err.message || "Failed to save contact. Please try again.");
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedContact(null);
    setModalMode('view');
    setEditForm(null);
  };

  const handleDeleteContact = (contactId, contactName) => {
    setDeleteConfirm({ show: true, contactId, contactName });
  };

  const confirmDelete = async () => {
    try {
      await contactApi.deleteContact(deleteConfirm.contactId);

      setDeleteConfirm({ show: false, contactId: null, contactName: "" });
      
      if (selectedContact?.id === deleteConfirm.contactId) {
        setShowModal(false);
        setSelectedContact(null);
      }

      showNotification('success', 'Success!', 
        `Contact ${deleteConfirm.contactName} deleted successfully!`);
      
      fetchContacts(pagination.currentPage, pagination.pageSize);
    } catch (err) {
      console.error("Error deleting contact:", err);
      showNotification('error', 'Error', "Failed to delete contact. Please try again.");
      setDeleteConfirm({ show: false, contactId: null, contactName: "" });
    }
  };

  const cancelDelete = () => {
    setDeleteConfirm({ show: false, contactId: null, contactName: "" });
  };

  const getPaginationButtons = () => {
    const { currentPage, totalPages } = pagination;
    if (totalPages <= 5) {
      return Array.from({ length: totalPages }, (_, i) => i);
    }
    
    if (currentPage <= 2) return [0, 1, 2, 3, 4];
    if (currentPage >= totalPages - 3) {
      return [totalPages - 5, totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1];
    }
    return [currentPage - 2, currentPage - 1, currentPage, currentPage + 1, currentPage + 2];
  };

  if (loading && !allContacts.length) {
    return <LoadingSpinner />;
  }

  if (error && !allContacts.length) {
    return <ErrorMessage error={error} onRetry={handleRefresh} />;
  }

  return (
    <div className="h-full flex flex-col bg-gradient-to-br from-gray-900 to-gray-950">
      {/* Fixed Header */}
      <div className="flex-shrink-0 p-4 md:p-6">
        <div className="flex justify-between items-center">
          <div className="text-gray-400 text-sm">
            {hasActiveFilters() ? 'Search results: ' : ''}
            Showing {displayContacts.length} of {pagination.totalElements} contacts • 
            Page {pagination.currentPage + 1} of {pagination.totalPages}
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
        {!loading && displayContacts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {displayContacts.map((contact) => (
              <ContactCard
                key={contact.id}
                contact={contact}
                onView={handleViewContact}
                onEdit={handleEditContact}
                onDelete={handleDeleteContact}
              />
            ))}
          </div>
        ) : (
          !loading && (
            <div className="h-full flex items-center justify-center">
              <div className="bg-gray-800/30 backdrop-blur-sm rounded-xl p-12 text-center max-w-md">
                <div className="w-20 h-20 mx-auto bg-gradient-to-r from-blue-900/30 to-blue-800/30 rounded-full flex items-center justify-center mb-4">
                  <RefreshCw className="w-10 h-10 text-blue-400" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">
                  {hasActiveFilters() ? "No matching contacts found" : "No contacts found"}
                </h3>
                <p className="text-gray-400 mb-6">
                  {hasActiveFilters()
                    ? `No contacts found with first name starting with "${getSearchFilters().keywords}". Try a different letter.`
                    : "Get started by adding your first contact"}
                </p>
                <div className="flex gap-4 justify-center">
                  {hasActiveFilters() && (
                    <button
                      onClick={clearFilters}
                      className="px-6 py-2 bg-gray-700 text-gray-300 rounded-lg hover:bg-gray-600 transition-colors"
                    >
                      Clear Search
                    </button>
                  )}
                  <button
                    onClick={() => handleEditContact(null)}
                    className="px-6 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:opacity-90 transition-opacity"
                  >
                    {hasActiveFilters() ? "Add New Contact" : "Add Your First Contact"}
                  </button>
                </div>
              </div>
            </div>
          )
        )}
        
        {loading && allContacts.length > 0 && (
          <div className="text-center py-8 text-gray-400">
            <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-2" />
            <p>Loading more contacts...</p>
          </div>
        )}
      </div>

      {/* Fixed Pagination at Bottom */}
      {!loading && displayContacts.length > 0 && pagination.totalPages > 1 && (
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
                {getPaginationButtons().map(pageNum => (
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
                ))}
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
              contact={selectedContact}
              onClose={handleCloseModal}
              onEdit={() => handleEditContact(selectedContact)}
              onDelete={handleDeleteContact}
            />
          </div>
        </div>
      )}

      {/* Edit Contact Modal */}
      {showModal && modalMode === 'edit' && editForm && (
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
              onSwitchToView={() => setModalMode('view')}
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

      {/* Success/Error Notification Popup */}
      {notification.show && (
        <div className="fixed top-4 right-4 z-[100] animate-slide-in">
          <div className={`rounded-lg shadow-2xl border-l-4 ${
            notification.type === 'success' 
              ? 'bg-green-50 border-green-500' 
              : 'bg-red-50 border-red-500'
          } p-4 min-w-[300px] max-w-md`}>
            <div className="flex items-start">
              <div className="flex-shrink-0">
                {notification.type === 'success' 
                  ? <CheckCircle className="h-6 w-6 text-green-500" />
                  : <XCircle className="h-6 w-6 text-red-500" />
                }
              </div>
              <div className="ml-3 w-0 flex-1 pt-0.5">
                <p className="text-sm font-medium text-gray-900">{notification.title}</p>
                <p className="mt-1 text-sm text-gray-600">{notification.message}</p>
              </div>
              <div className="ml-4 flex-shrink-0 flex">
                <button
                  onClick={closeNotification}
                  className="inline-flex text-gray-400 hover:text-gray-500 focus:outline-none"
                >
                  <span className="sr-only">Close</span>
                  <XCircle className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ContactList;