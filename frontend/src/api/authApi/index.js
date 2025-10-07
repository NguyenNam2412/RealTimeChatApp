import { createAxiosWithToken } from "@api/axiosWithToken";

const authApi = createAxiosWithToken("http://localhost:5000/auth", {
  "Content-Type": "application/json",
});

export const loginApi = (side, credentials) => {
  return authApi.post(`${side}`, credentials);
};

export const registerApi = (credentials) => {
  return authApi.post("register", credentials);
};
