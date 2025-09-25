import { createAxiosWithToken } from "@api/axiosWithToken";

const chatApi = createAxiosWithToken("http://localhost:5000/messages", {
  "Content-Type": "application/json",
});

export const sendMessApi = (messObj) => {
  return chatApi.post(messObj);
};
