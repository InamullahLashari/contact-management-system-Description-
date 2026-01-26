// groupAPI.js
import api from "./axios";


const groupAPI = {
  // 🔹 LIST ALL GROUPS
  getGroups: () => {
    return api.get("/group");
  },

  // 🔹 CREATE GROUP
  createGroup: (data) => {
    return api.post("/group", data);
  },

  // 🔹 UPDATE GROUP
  updateGroup: (id, data) => {
    return api.put(`/group/${id}`, data);
  },

  // 🔹 DELETE GROUP
  deleteGroup: (id) => {
    return api.delete(`/group/${id}`);
  },

  // 🔹 GET GROUP BY ID
  getGroupById: (id) => {
    return api.get(`/group/${id}`);
  },

  // 🔹 ADD CONTACTS TO GROUP
  addContactsToGroup: (groupId, contactNames) => {
    return api.put(`/group/${groupId}/contacts`, {
      contactNames: Array.isArray(contactNames) ? contactNames : [contactNames],
    });
  },

  // 🔹 REMOVE CONTACT FROM GROUP
  removeContactFromGroup: (groupId, contactName) => {
    return api.delete(`/group/${groupId}/contacts/${contactName}`);
  },

  // 🔹 GET GROUP CONTACTS
  getGroupContacts: (groupId) => {
    return api.get(`/group/${groupId}/contacts`);
  },
};

export default groupAPI;