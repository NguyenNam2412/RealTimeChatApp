export const selectSearchResults = (state) => state.search.results;
export const selectSearchUsers = (state) =>
  (state.search.results && state.search.results.users) || [];
export const selectSearchGroups = (state) =>
  (state.search.results && state.search.results.groups) || [];
export const selectSearchLoading = (state) => state.search.loading;
export const selectSearchError = (state) => state.search.error;
export const selectSearchLastQuery = (state) => state.search.lastQuery;

const searchSelectors = {
  selectSearchResults,
  selectSearchUsers,
  selectSearchGroups,
  selectSearchLoading,
  selectSearchError,
  selectSearchLastQuery,
};

export default searchSelectors;
