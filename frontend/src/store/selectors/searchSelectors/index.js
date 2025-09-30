export const selectSearchResults = (state) =>
  state.search?.results ?? { users: [], groups: [] };
export const selectSearchUsers = (state) =>
  selectSearchResults(state).users || [];
export const selectSearchGroups = (state) =>
  selectSearchResults(state).groups || [];
export const selectSearchLoading = (state) => state.search?.loading ?? false;
export const selectSearchError = (state) => state.search?.error ?? null;
export const selectSearchLastQuery = (state) => state.search?.lastQuery ?? null;

const searchSelectors = {
  selectSearchResults,
  selectSearchUsers,
  selectSearchGroups,
  selectSearchLoading,
  selectSearchError,
  selectSearchLastQuery,
};

export default searchSelectors;
