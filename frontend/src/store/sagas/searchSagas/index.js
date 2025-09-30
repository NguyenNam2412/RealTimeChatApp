import { call, put, takeLatest } from "redux-saga/effects";
import { searchActions } from "@store/slices/searchSlices";
import { searchApi } from "@api/searchApi";

function* handleSearch(action) {
  try {
    const raw = action.payload || {};
    // ensure keyword is a string
    const keyword = raw.keyword == null ? "" : String(raw.keyword).trim();
    const limit = Number.isFinite(Number(raw.limit)) ? Number(raw.limit) : 20;
    const offset = Number.isFinite(Number(raw.offset)) ? Number(raw.offset) : 0;

    if (!keyword) {
      yield put(searchActions.searchSuccess({ users: [], groups: [] }));
      return;
    }

    const data = yield call(searchApi, { keyword, limit, offset });
    yield put(searchActions.searchSuccess(data));
  } catch (err) {
    yield put(searchActions.searchFailure(err.message || "Search error"));
  }
}

export default function* searchSagas() {
  yield takeLatest(searchActions.searchRequest.type, handleSearch);
}
