import { createAxiosWithToken } from "@api/axiosWithToken";

const groupApi = createAxiosWithToken("http://localhost:5000/groups", {
  "Content-Type": "application/json",
});

export const createGroupApi = (groupData) => {
  return groupApi.post(groupData);
};
