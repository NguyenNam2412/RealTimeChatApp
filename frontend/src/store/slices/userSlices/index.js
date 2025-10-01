import { createSlice } from "@reduxjs/toolkit";

const listUser = createSlice({
  name: "user",
  initialState: {
    listUser: [],
    conversations: [],
    userProfile: null,
    loading: false,
    error: null,
  },
  reducers: {
    // get all user
    getAllUserRequest: (state) => {
      state.loading = true;
    },
    getAllUserSuccess: (state, action) => {
      state.listUser = action.payload;
      state.loading = false;
      state.error = null;
    },
    getAllUserFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload || "get all user error";
    },
    // get conversations
    getUserConversationsRequest: (state) => {
      state.loading = true;
      state.error = null;
    },
    getUserConversationsSuccess: (state, action) => {
      state.conversations = Array.isArray(action.payload) ? action.payload : [];
      state.loading = false;
      state.error = null;
    },
    getUserConversationsFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload || "get conversations error";
    },
    // get user profile
    getUserProfileRequest: (state) => {
      state.loading = true;
    },
    getUserProfileSuccess: (state, action) => {
      state.userProfile = action.payload;
      state.loading = false;
      state.error = null;
    },
    getUserProfileFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload || "get user profile error";
    },
    // approve user request
    approveUser: (state) => {
      state.loading = true;
    },
  },
});

export const listUserReducer = listUser.reducer;
export const listUserActions = listUser.actions;
