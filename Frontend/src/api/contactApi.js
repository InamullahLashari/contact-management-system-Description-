import api from "./axios";

const contactAPI = {
  // 🔹 LIST CONTACTS
  getContacts: (params) => {
    return api.get("/contact/list", null, {
      params: {
        page: params?.page || 0,
        size: params?.size || 10,
        keywords: params?.keywords || "",
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
      id, // backend expects ID inside request body
    });
  },
//delete
deleteContact: async (id) => {
    try {
      const response = await api.delete(`/contact/contacts/${id}`);
      console.log(`Contact ${id} deleted successfully:`, response.data);
      return response.data; // { message, status }
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