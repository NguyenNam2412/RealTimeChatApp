const selectCreatingGroup = (state) => state.createGroup?.creating ?? false;

const selectCreateGroupError = (state) =>
  state.createGroup?.createError ?? null;

const selectLastCreatedGroup = (state) =>
  state.createGroup?.lastCreated ?? null;

const groupSelectors = {
  selectCreatingGroup,
  selectCreateGroupError,
  selectLastCreatedGroup,
};

export default groupSelectors;
