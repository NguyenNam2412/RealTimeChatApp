import { createSelector } from "reselect";

const selectListAllUser = (state) => {
  return state.user?.listUser || [];
};

const selectListUser = createSelector([selectListAllUser], (listAllUser) => {
  const listApproved = listAllUser.filter((user) => user?.isApproved !== null);
  return listApproved?.length ? listApproved : [];
});

const selectListUserWaitingApprove = createSelector(
  [selectListAllUser],
  (listAllUser) => {
    const waitingList = listAllUser.filter((user) => user?.isApproved === null);
    return waitingList?.length ? waitingList : [];
  }
);

const selectUserProfile = (state) => {
  return state?.user?.userProfile || null;
};

const selectUserConversations = (state) => {
  return state.user?.conversations ?? [];
};

const userSelectors = {
  selectListAllUser,
  selectListUser,
  selectListUserWaitingApprove,
  selectUserProfile,
  selectUserConversations,
};

export default userSelectors;
