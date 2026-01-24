import api from './axios'; // Import from the same directory

export const contactAPI = {
  getContacts: (params) => {
    return api.post('/contact/list', null, { 
      params: {
        page: params?.page || 0,
        size: params?.size || 10,
        keywords: params?.keywords || '',
        sortBy: params?.sortBy || 'firstName',
        sortDir: params?.sortDir || 'asc'
      }
    });
  }
};

// Export as default as well for flexibility
export default contactAPI;