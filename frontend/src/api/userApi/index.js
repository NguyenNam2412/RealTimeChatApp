import { createAxiosWithToken } from "@api/axiosWithToken";

const axiosAdminApiWithToken = createAxiosWithToken(
  "http://localhost:5000/admin",
  {
    "Content-Type": "application/json",
  }
);

const axiosUserApiWithToken = createAxiosWithToken(
  "http://localhost:5000/user",
  {
    "Content-Type": "application/json",
  }
);

export const getAllUserApi = () => {
  return axiosAdminApiWithToken.get("users");
};

export const approveUserApi = (id, approve) => {
  return axiosAdminApiWithToken.patch("users/:id/approve", id, approve);
};

export const getUserProfileApi = () => {
  return axiosUserApiWithToken.get("me");
};
