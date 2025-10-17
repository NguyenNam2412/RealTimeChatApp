import { createAxiosWithToken } from "@api/axiosWithToken";

const adminApi = createAxiosWithToken("http://localhost:5000/admin", {
  "Content-Type": "application/json",
});

export const approveUserApi = (userId, approve) => {
  return adminApi.patch(`/users/${userId}/approve`, { approve });
};
