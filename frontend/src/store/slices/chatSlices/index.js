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

  // push to global flattened array
  state.allMessages.push(msg);

  // determine groupId (support group object or groupId field)
  const groupId = msg.groupId ?? msg.group?.id ?? null;
  if (groupId) {
    state.groupMessages[groupId] = state.groupMessages[groupId] || [];
    state.groupMessages[groupId].push(msg);
    return;
  }

  // normalize sender / receiver ids (support object or id fields)
  const senderId =
    (typeof msg.sender === "string" ? msg.sender : msg.sender?.id) ??
    msg.senderObj?.id ??
    msg.senderId ??
    null;
  const receiverId =
    (typeof msg.receiver === "string" ? msg.receiver : msg.receiver?.id) ??
    msg.receiverId ??
    null;

  // If we have both sides, store message under both user keys so selecting either user returns the conversation.
  if (senderId && receiverId) {
    state.userMessages[senderId] = state.userMessages[senderId] || [];
    state.userMessages[receiverId] = state.userMessages[receiverId] || [];

    // avoid duplicate insertion per list (based on id)
    if (!state.userMessages[senderId].some((m) => m.id === msg.id)) {
      state.userMessages[senderId].push(msg);
    }
    if (!state.userMessages[receiverId].some((m) => m.id === msg.id)) {
      state.userMessages[receiverId].push(msg);
    }
    return;
  }

  // fallback: if only one side known, store under that id
  const peerId = receiverId ?? senderId ?? null;
  if (peerId) {
    state.userMessages[peerId] = state.userMessages[peerId] || [];
    if (!state.userMessages[peerId].some((m) => m.id === msg.id)) {
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

    updateMessageId: (state, action) => {
      const { tempId, saved } = action.payload || {};
      if (!tempId || !saved?.id) return;
      // remove temp from allMessages and maps
      const removeById = (id) => {
        state.allMessages = state.allMessages.filter((m) => m.id !== id);
        Object.keys(state.userMessages).forEach((k) => {
          state.userMessages[k] = state.userMessages[k].filter(
            (m) => m.id !== id
          );
          if (state.userMessages[k].length === 0) delete state.userMessages[k];
        });
        Object.keys(state.groupMessages).forEach((k) => {
          state.groupMessages[k] = state.groupMessages[k].filter(
            (m) => m.id !== id
          );
          if (state.groupMessages[k].length === 0)
            delete state.groupMessages[k];
        });
      };
      removeById(tempId);
      addMessageToState(state, saved);
    },

    fetchUserMessagesRequest: (state, action) => {
      state.loading = true;
      state.error = null;
    },
    fetchUserMessagesSuccess: (state, action) => {
      const { userId, messages, offset = 0 } = action.payload;
      const arr = Array.isArray(messages) ? messages : [];
      if (!state.userMessages[userId] || offset === 0) {
        state.userMessages[userId] = arr;
      } else {
        // prepend older messages when offset > 0
        state.userMessages[userId] = [
          ...arr,
          ...(state.userMessages[userId] || []),
        ];
      }
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
      const { groupId, messages, offset = 0 } = action.payload;
      const arr = Array.isArray(messages) ? messages : [];
      if (!state.groupMessages[groupId] || offset === 0) {
        state.groupMessages[groupId] = arr;
      } else {
        state.groupMessages[groupId] = [
          ...arr,
          ...(state.groupMessages[groupId] || []),
        ];
      }
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
