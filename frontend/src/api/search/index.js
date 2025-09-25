import { createAxiosWithToken } from "@api/axiosWithToken";

const searchApiWithToken = createAxiosWithToken(
  "http://localhost:5000/search",
  {
    "Content-Type": "application/json",
  }
);

export const searchApi = (searchParams) => {
  return searchApiWithToken.get(searchParams);
};
