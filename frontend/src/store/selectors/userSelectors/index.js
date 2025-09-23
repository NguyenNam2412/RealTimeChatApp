import { createSelector } from "reselect";

const selectListAllUser = (state) => {
  return state.listUser;
};

const selectListUser = createSelector([selectListAllUser], (listAllUser) => {
  const listApproved = listAllUser.filter((user) => !user?.isApprove);
  return listApproved?.length ? listApproved : [];
});

const selectListUserWaitingApprove = createSelector(
  [selectListAllUser],
  (listAllUser) => {
    const waitingList = listAllUser.filter((user) => !!user?.isApprove);
    return waitingList?.length ? waitingList : [];
  }
);

const userSelectors = {
  selectListAllUser,
  selectListUser,
  selectListUserWaitingApprove,
};

export default userSelectors;
