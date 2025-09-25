const selectAllMessages = (state) => state.chat.messages;
const selectLoading = (state) => state.chat.loading;
const selectError = (state) => state.chat.error;

const selectMyMessages = (state) => state.chat.messages.filter((msg) => msg.me);

const selectMessagesBySender = (sender) => (state) =>
  state.chat.messages.filter((msg) => msg.sender === sender);

const messageSelectors = {
  selectAllMessages,
  selectLoading,
  selectError,
  selectMyMessages,
  selectMessagesBySender,
};

export default messageSelectors;
