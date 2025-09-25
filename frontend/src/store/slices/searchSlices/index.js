import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  results: { users: [], groups: [] },
  loading: false,
  error: null,
  lastQuery: null,
};

const slice = createSlice({
  name: "search",
  initialState,
  reducers: {
    searchRequest: (state, action) => {
      state.loading = true;
      state.error = null;
      state.lastQuery = action.payload;
    },
    searchSuccess: (state, action) => {
      state.loading = false;
      state.results = action.payload;
    },
    searchFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    clearSearch: (state) => {
      state.results = { users: [], groups: [] };
      state.error = null;
      state.lastQuery = null;
      state.loading = false;
    },
  },
});

export const searchActions = slice.actions;
export const searchReducer = slice.reducer;
