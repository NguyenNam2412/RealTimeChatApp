import { call, put, takeLatest } from "redux-saga/effects";
import { searchActions } from "@store/slices/searchSlices";
import { searchApi } from "@api/search";

function* handleSearch(action) {
  try {
    const { keyword, limit = 20, offset = 0 } = action.payload || {};
    if (!keyword || !String(keyword).trim()) {
      yield put(searchActions.searchSuccess({ users: [], groups: [] }));
      return;
    }
    const data = yield call(searchApi, {
      keyword: String(keyword).trim(),
      limit,
      offset,
    });
    yield put(searchActions.searchSuccess(data));
  } catch (err) {
    yield put(searchActions.searchFailure(err.message || "Search error"));
  }
}

export default function* searchSagas() {
  yield takeLatest(searchActions.searchRequest, handleSearch);
}
