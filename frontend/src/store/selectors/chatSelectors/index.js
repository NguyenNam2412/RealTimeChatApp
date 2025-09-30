const selectUserMessages = (userId) => (state) =>
  state.messages.userMessages[userId] || [];

const selectGroupMessages = (groupId) => (state) =>
  state.messages.groupMessages[groupId] || [];

const selectAllMessages = (state) => state.chat?.allMessages || [];

const selectMessagesForTarget = (target) => (state) => {
  if (!target) return [];
  if (target.type === "group") return selectGroupMessages(target.id)(state);
  return selectUserMessages(target.id)(state);
};

const selectLoading = (state) => state.messages.loading;
const selectError = (state) => state.messages.error;

const messageSelectors = {
  selectUserMessages,
  selectGroupMessages,
  selectAllMessages,
  selectMessagesForTarget,
  selectLoading,
  selectError,
};

export default messageSelectors;
