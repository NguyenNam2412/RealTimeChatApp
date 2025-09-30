const selectUserMessages = (userId) => (state) =>
  state.chat?.userMessages[userId] || [];

const selectGroupMessages = (groupId) => (state) =>
  state.chat?.groupMessages[groupId] || [];

const selectAllMessages = (state) => state.chat?.allMessages || [];

const selectMessagesForTarget = (target) => (state) => {
  if (!target) return [];
  if (target.type === "group") return selectGroupMessages(target.id)(state);
  return selectUserMessages(target.id)(state);
};

const selectLoading = (state) => {
  return state.chat?.loading;
};
const selectError = (state) => state.chat?.error;

const messageSelectors = {
  selectUserMessages,
  selectGroupMessages,
  selectAllMessages,
  selectMessagesForTarget,
  selectLoading,
  selectError,
};

export default messageSelectors;
