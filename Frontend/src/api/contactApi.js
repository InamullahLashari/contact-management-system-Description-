
import api from "./axios";

const contactAPI = {
  // 🔹 LIST CONTACTS - FIXED parameter name to match backend
  getContacts: (params) => {
    return api.get("/contact/list", {
      params: {
        page: params?.page || 0,
        size: params?.size || 10,
        keyword: params?.keyword || params?.keywords || "", // Use 'keyword' to match backend
        sortBy: params?.sortBy || "firstName",
        sortDir: params?.sortDir || "asc",
      },
    });
  },

  // 🔹 CREATE CONTACT
  createContact: (data) => {
    return api.post("/contact", data);
  },

  // 🔹 UPDATE CONTACT
  updateContact: (id, data) => {
    return api.put("/contact/update", {
      ...data,
      id,
    });
  },

  // 🔹 DELETE CONTACT
  deleteContact: async (id) => {
    try {
      const response = await api.delete(`/contact/contacts/${id}`);
      console.log(`Contact ${id} deleted successfully:`, response.data);
      return response.data;
    } catch (error) {
      console.error(`Error deleting contact ${id}:`, error.response?.data || error.message);
      throw {
        message:
          error.response?.data?.message ||
          "Cannot delete contact; it may be used in groups",
        status: error.response?.status || 500,
      };
    }
  },
};

export default contactAPI;

