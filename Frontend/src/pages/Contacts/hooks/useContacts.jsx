// hooks/useContacts.jsx
import { useState, useCallback } from "react";
import contactApi from "../../../api/contactApi"; // Correct path: go up 3 levels

export const useContacts = () => {
  const [state, setState] = useState({
    contacts: [],
    loading: true,
    error: null,
    pagination: {
      currentPage: 0,
      totalPages: 1, // CHANGED FROM 0 TO 1 - This is critical!
      totalElements: 0,
      pageSize: 12
    }
  });

  const [modals, setModals] = useState({
    showModal: false,
    modalMode: 'view',
    selectedContact: null,
    editForm: {
      id: "",
      firstName: "",
      lastName: "",
      title: "",
      company: "",
      department: "",
      address: "",
      notes: "",
      phones: [{ label: "Mobile", phoneNumber: "" }],
      emails: [{ label: "Work", emailAddress: "" }]
    },
    deleteConfirm: {
      show: false,
      contactId: null,
      contactName: ""
    }
  });

  // Get search filters from localStorage
  const getSearchFilters = useCallback(() => {
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
  }, []);

  // Fetch contacts with better debugging
  const fetchContacts = useCallback(async (page = 0, size = 12) => {
    try {
      console.log("🚀 FETCHING CONTACTS - Page:", page, "Size:", size);
      setState(prev => ({ ...prev, loading: true }));
      const { keywords, sortBy, sortDir } = getSearchFilters();
      
      const response = await contactApi.getContacts({
        page,
        size,
        keywords,
        sortBy,
        sortDir
      });

      console.log("📊 RAW API RESPONSE:", response);

      let contactsData = [];
      let totalElements = 0;
      let totalPages = 1; // Start with 1

      if (response.data) {
        if (response.data.content !== undefined) {
          contactsData = response.data.content || [];
          totalElements = response.data.totalElements || 0;
          totalPages = response.data.totalPages || 1;
        } else if (response.data.contacts !== undefined) {
          contactsData = response.data.contacts || [];
          totalElements = response.data.totalElements || contactsData.length;
          totalPages = response.data.totalPages || 1;
        } else if (Array.isArray(response.data)) {
          contactsData = response.data;
          totalElements = response.data.length;
          totalPages = Math.ceil(response.data.length / size);
        } else if (response.data.data && Array.isArray(response.data.data)) {
          contactsData = response.data.data;
          totalElements = response.data.total || contactsData.length;
          totalPages = response.data.totalPages || 1;
        } else {
          Object.keys(response.data).forEach(key => {
            if (Array.isArray(response.data[key]) && !contactsData.length) {
              contactsData = response.data[key];
            }
          });
          
          if (contactsData.length) {
            totalElements = response.data.totalElements || response.data.total || contactsData.length;
            totalPages = response.data.totalPages || 1;
          }
        }
      }

      // Calculate totalPages if not provided by API
      if (totalElements > 0 && totalPages <= 1) {
        totalPages = Math.ceil(totalElements / size);
      }
      
      // Ensure totalPages is at least 1
      totalPages = Math.max(1, totalPages);

      console.log("✅ FINAL PAGINATION DATA:", { 
        contactsCount: contactsData.length,
        totalElements, 
        totalPages,
        currentPage: page,
        pageSize: size,
        shouldShowPagination: contactsData.length > 0 && totalPages > 1
      });

      setState(prev => ({
        ...prev,
        contacts: contactsData,
        loading: false,
        error: null,
        pagination: {
          ...prev.pagination,
          currentPage: page,
          pageSize: size,
          totalElements,
          totalPages
        }
      }));
    } catch (err) {
      console.error("❌ Error fetching contacts:", err);
      setState(prev => ({
        ...prev,
        loading: false,
        error: err.response?.data?.message || "Failed to load contacts. Please try again.",
        contacts: [],
        pagination: {
          ...prev.pagination,
          currentPage: 0,
          totalElements: 0,
          totalPages: 1
        }
      }));
    }
  }, [getSearchFilters]);

  // Modal handlers
  const handleViewContact = useCallback((contact) => {
    setModals(prev => ({
      ...prev,
      selectedContact: contact,
      modalMode: 'view',
      showModal: true
    }));
  }, []);

  const handleEditContact = useCallback((contact) => {
    if (contact) {
      setModals(prev => ({
        ...prev,
        selectedContact: contact,
        editForm: {
          id: contact.id || "",
          firstName: contact.firstName || "",
          lastName: contact.lastName || "",
          title: contact.title || "",
          company: contact.company || "",
          department: contact.department || "",
          address: contact.address || "",
          notes: contact.notes || "",
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
        }
      }));
    } else {
      setModals(prev => ({
        ...prev,
        selectedContact: null,
        editForm: {
          id: "",
          firstName: "",
          lastName: "",
          title: "",
          company: "",
          department: "",
          address: "",
          notes: "",
          phones: [{ label: "Mobile", phoneNumber: "" }],
          emails: [{ label: "Work", emailAddress: "" }]
        }
      }));
    }
    setModals(prev => ({
      ...prev,
      modalMode: 'edit',
      showModal: true
    }));
  }, []);

  const switchToEditMode = useCallback(() => {
    if (modals.selectedContact) {
      handleEditContact(modals.selectedContact);
    }
  }, [modals.selectedContact, handleEditContact]);

  const switchToViewMode = useCallback(() => {
    setModals(prev => ({ ...prev, modalMode: 'view' }));
  }, []);

  const handleCloseModal = useCallback(() => {
    setModals(prev => ({
      ...prev,
      showModal: false,
      selectedContact: null,
      modalMode: 'view'
    }));
  }, []);

  const handleDeleteContact = useCallback((contactId, contactName) => {
    setModals(prev => ({
      ...prev,
      deleteConfirm: {
        show: true,
        contactId,
        contactName
      }
    }));
  }, []);

  // Update state helpers
  const updateContactInState = useCallback((updatedContact) => {
    setState(prev => ({
      ...prev,
      contacts: prev.contacts.map(contact =>
        contact.id === updatedContact.id ? { ...contact, ...updatedContact } : contact
      )
    }));
    
    setModals(prev => {
      if (prev.selectedContact && prev.selectedContact.id === updatedContact.id) {
        return {
          ...prev,
          selectedContact: { ...prev.selectedContact, ...updatedContact }
        };
      }
      return prev;
    });
  }, []);

  const addContactToState = useCallback((newContact) => {
    setState(prev => ({
      ...prev,
      contacts: [newContact, ...prev.contacts],
      pagination: {
        ...prev.pagination,
        totalElements: prev.pagination.totalElements + 1,
        totalPages: Math.max(1, Math.ceil((prev.pagination.totalElements + 1) / prev.pagination.pageSize))
      }
    }));
  }, []);

  const removeContactFromState = useCallback((contactId) => {
    setState(prev => ({
      ...prev,
      contacts: prev.contacts.filter(contact => contact.id !== contactId),
      pagination: {
        ...prev.pagination,
        totalElements: Math.max(0, prev.pagination.totalElements - 1),
        totalPages: Math.max(1, Math.ceil((prev.pagination.totalElements - 1) / prev.pagination.pageSize))
      }
    }));
  }, []);

  // Clear all filters
  const clearFilters = useCallback(() => {
    localStorage.removeItem('contactSearchFilters');
    fetchContacts(0, state.pagination.pageSize);
  }, [fetchContacts, state.pagination.pageSize]);

  return {
    // State
    ...state,
    ...modals,
    
    // Actions
    fetchContacts,
    handleViewContact,
    handleEditContact,
    handleCloseModal,
    handleDeleteContact,
    switchToEditMode,
    switchToViewMode,
    updateContactInState,
    addContactToState,
    removeContactFromState,
    clearFilters,
    
    // Setters for modals
    setEditForm: (editForm) => setModals(prev => ({ ...prev, editForm })),
    setDeleteConfirm: (deleteConfirm) => setModals(prev => ({ ...prev, deleteConfirm })),
    
    // Helper functions
    getSearchFilters,
    formatContactForDisplay: (contact) => ({
      ...contact,
      phones: contact.phones?.map(phone => ({
        label: phone.label || "Mobile",
        phoneNumber: phone.phoneNumber || "Not provided"
      })) || [],
      emails: contact.emails?.map(email => ({
        label: email.label || "Email",
        emailAddress: email.emailAddress || "Not provided"
      })) || [],
      title: contact.title || "Not specified",
      company: contact.company || "Not specified",
      department: contact.department || "Not specified",
      address: contact.address || "Not specified"
    }),
    hasActiveFilters: () => {
      const { keywords, sortBy, sortDir } = getSearchFilters();
      return keywords.trim() || sortBy !== 'firstName' || sortDir !== 'asc';
    }
  };
};