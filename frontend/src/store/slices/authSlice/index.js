import { createSlice } from "@reduxjs/toolkit";
import authConstants from "@constants/authConstants";

const authSlice = createSlice({
  name: "auth",
  initialState: {
    session: null,
    loading: false,
    error: null,
  },
  reducers: {
    // loginRequest: (state) => {
    //   state.loading = true;
    // },
    // loginSuccess: (state, action) => {
    //   state.session = action.payload;
    //   state.loading = false;
    //   state.error = null;
    // },
    // loginFailure: (state, action) => {
    //   state.loading = false;
    //   state.error = action.payload || "login error";
    // },
    // logout: (state) => {
    //   state.session = null;
    //   state.error = null;
    // },
  },
  extraReducers: (builder) => {
    builder.addCase(authConstants.LOGIN, (state, action) => {
      if (action.meta?.status === "success") {
        state.session = action.payload;
        state.loading = false;
        state.error = null;
      } else if (action.meta?.status === "failure") {
        state.error = action.payload || "login error";
        state.loading = false;
      } else {
        // khi mới dispatch login
        state.loading = true;
        state.error = null;
      }
    });
    builder.addCase(authConstants.LOGOUT, (state) => {
      state.session = null;
      state.loading = false;
      state.error = null;
    });
  },
});

export const authReducer = authSlice.reducer;
