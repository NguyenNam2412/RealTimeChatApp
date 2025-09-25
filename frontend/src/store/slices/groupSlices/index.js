import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  listMyGroup: [],
  creating: false,
  createError: null,
  lastCreated: null, // store created group object
};

const slice = createSlice({
  name: "group",
  initialState,
  reducers: {
    createGroupRequest: (state, action) => {
      state.creating = true;
      state.createError = null;
    },
    createGroupSuccess: (state, action) => {
      state.creating = false;
      state.lastCreated = action.payload;
    },
    createGroupFailure: (state, action) => {
      state.creating = false;
      state.createError = action.payload;
    },
    clearCreatedGroup: (state) => {
      state.lastCreated = null;
      state.createError = null;
    },
  },
});

export const groupActions = slice.actions;
export const groupReducer = slice.reducer;
