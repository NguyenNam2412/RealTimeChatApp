import { call, put, takeLatest } from "redux-saga/effects";
import { groupActions } from "@store/slices/groupSlices";
import { createGroupApi } from "@api/groupApi";

function* handleCreateGroup(action) {
  try {
    const dto = action.payload; // { name, description? }
    const data = yield call(createGroupApi, dto);
    yield put(groupActions.createGroupSuccess(data));
  } catch (err) {
    yield put(groupActions.createGroupFailure(err.message || String(err)));
  }
}

export default function* groupSagas() {
  yield takeLatest(groupActions.createGroupRequest, handleCreateGroup);
}
