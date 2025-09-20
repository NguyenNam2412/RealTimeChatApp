import { createAxiosWithToken } from "@api/axiosWithToken";

const authApi = createAxiosWithToken("http://localhost:5000", {
  "Content-Type": "application/json",
});

export const loginRequest = (side, credentials) => {
  return authApi.post(`${side}`, credentials);
};

export const register = (credentials) => {
  return authApi.post("register", credentials);
};
