import { createSlice } from "@reduxjs/toolkit";
import userConstants from "@constants/userConstants";

const listUser = createSlice({
  name: "user",
  initialState: {
    listUser: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(userConstants.GET_ALL_USER, (state, action) => {
      if (action.meta?.status === "success") {
        state.loading = false;
        state.listUser = action.payload;
        state.error = null;
      } else if (action.meta?.status === "failure") {
        state.loading = false;
        state.error = action.payload || "login error";
      } else {
        state.loading = true;
        state.error = null;
      }
    });
    builder.addCase(userConstants.APPROVE_USER, (state, action) => {
      if (action.meta?.status === "success") {
        state.loading = false;
        state.listUser = action.payload;
        state.error = null;
      } else if (action.meta?.status === "failure") {
        state.loading = false;
        state.error = action.payload || "login error";
      } else {
        state.loading = true;
        state.error = null;
      }
    });
  },
});

export const listUserReducer = listUser.reducer;
