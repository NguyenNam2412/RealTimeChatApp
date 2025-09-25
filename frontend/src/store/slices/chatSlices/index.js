import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  messages: [],
  loading: false,
  error: null,
};

const messageSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    sendMessageRequest: (state, action) => {
      state.loading = true;
    },
    sendMessageSuccess: (state, action) => {
      state.loading = false;
      state.messages.push(action.payload);
    },
    sendMessageFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    receiveMessage: (state, action) => {
      state.messages.push(action.payload);
    },
    loadMessages: (state, action) => {
      state.messages = action.payload;
    },
  },
});

export const chatActions = messageSlice.actions;
export const chatReducer = messageSlice.reducer;
