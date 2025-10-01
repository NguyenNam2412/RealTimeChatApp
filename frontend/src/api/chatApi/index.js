import { createAxiosWithToken } from "@api/axiosWithToken";

const chatApi = createAxiosWithToken("http://localhost:5000/messages", {
  "Content-Type": "application/json",
});

export const sendMessApi = (messObj) => {
  return chatApi.post("", messObj);
};

export const getUserMessApi = (userId, params = {}) => {
  return chatApi.get(`/private/${userId}`, { params });
};

export const getGroupMessApi = (groupId, params) => {
  return chatApi.get(`/group/${groupId}`, { params });
};
