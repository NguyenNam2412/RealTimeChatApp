import { call, put, takeLatest } from "redux-saga/effects";
import { approveUserApi } from "@api/adminApi";
import { listUserActions } from "@store/slices/userSlices";

function* approveUserSaga(action) {
  const { userId, approve } = action.payload;
  yield call(approveUserApi, userId, approve);
  yield put(listUserActions.getAllUserRequest.type);
}

export default function* adminWatcher() {
  yield takeLatest(listUserActions.approveUser.type, approveUserSaga);
}
