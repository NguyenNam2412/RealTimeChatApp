import { createAxiosWithToken } from "@api/axiosWithToken";

const chatApi = createAxiosWithToken("http://localhost:5000/messages", {
  "Content-Type": "application/json",
});

export const sendMessApi = (messObj) => {
  return chatApi.post("", messObj);
};

export const getUserMessApi = (userId) => {
  return chatApi.get(`/private/${userId}`);
};

export const getGroupMessApi = (groupId) => {
  return chatApi.get(`/group/${groupId}`);
};
