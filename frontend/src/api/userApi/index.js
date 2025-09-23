import { createAxiosWithToken } from "@api/axiosWithToken";

const authApi = createAxiosWithToken("http://localhost:5000", {
  "Content-Type": "application/json",
});

export const getAllUserApi = () => {
  return authApi.post("user");
};

export const approveUserApi = (id, approve) => {
  return authApi.post("users/:id/approve", id, approve);
};
