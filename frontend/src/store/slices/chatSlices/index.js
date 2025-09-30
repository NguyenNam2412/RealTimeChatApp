import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  userMessages: {},
  groupMessages: {},
  allMessages: [],
  loading: false,
  error: null,
};

const addMessageToState = (state, msg) => {
  if (!msg || !msg.id) return;
  // avoid duplicate by id
  const exists = state.allMessages.find((m) => m.id === msg.id);
  if (exists) return;

  state.allMessages.push(msg);

  // assign to group or user map
  if (msg.groupId) {
    state.groupMessages[msg.groupId] = state.groupMessages[msg.groupId] || [];
    state.groupMessages[msg.groupId].push(msg);
  } else {
    // determine peer id for private conversation (prefer receiverId or senderObj.id or sender)
    const peerId = msg.receiverId ?? msg.senderObj?.id ?? msg.sender ?? null;
    if (peerId) {
      state.userMessages[peerId] = state.userMessages[peerId] || [];
      state.userMessages[peerId].push(msg);
    }
  }
};

const messageSlice = createSlice({
  name: "messages",
  initialState,
  reducers: {
    sendMessageRequest: (state, action) => {
      state.loading = true;
    },
    sendMessageSuccess: (state, action) => {
      state.loading = false;
      addMessageToState(state, action.payload);
    },
    sendMessageFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },

    fetchUserMessagesRequest: (state, action) => {
      state.loading = true;
      state.error = null;
    },
    fetchUserMessagesSuccess: (state, action) => {
      const { userId, messages } = action.payload;
      state.userMessages[userId] = Array.isArray(messages) ? messages : [];
      // also merge into allMessages (dedupe)
      (state.userMessages[userId] || []).forEach((m) =>
        addMessageToState(state, m)
      );
      state.loading = false;
    },
    fetchUserMessagesFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },

    fetchGroupMessagesRequest: (state, action) => {
      state.loading = true;
      state.error = null;
    },
    fetchGroupMessagesSuccess: (state, action) => {
      const { groupId, messages } = action.payload;
      state.groupMessages[groupId] = Array.isArray(messages) ? messages : [];
      (state.groupMessages[groupId] || []).forEach((m) =>
        addMessageToState(state, m)
      );
      state.loading = false;
    },
    fetchGroupMessagesFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },

    receiveMessage: (state, action) => {
      addMessageToState(state, action.payload);
    },
    loadMessages: (state, action) => {
      // replace allMessages and rebuild maps
      const arr = Array.isArray(action.payload) ? action.payload : [];
      state.allMessages = [];
      state.userMessages = {};
      state.groupMessages = {};
      arr.forEach((m) => addMessageToState(state, m));
    },
  },
});

export const chatActions = messageSlice.actions;
export const chatReducer = messageSlice.reducer;
