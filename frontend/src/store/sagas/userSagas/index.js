import { call, put, takeLatest } from "redux-saga/effects";
import {
  getAllUserApi,
  approveUserApi,
  getUserProfileApi,
  getConversationsApi,
} from "@api/userApi";
import { listUserActions } from "@store/slices/userSlices";

function* getListAllUser() {
  try {
    const response = yield call(getAllUserApi);
    yield put(listUserActions.getAllUserSuccess(response.data));
  } catch (error) {
    yield put(
      listUserActions.getAllUserFailure(
        error.message || "can not get list all user"
      )
    );
  }
}

function* getConversationsSaga() {
  try {
    const res = yield call(getConversationsApi);
    // axios response -> res.data ; other implementations may return plain array
    const payload = res?.data ?? res;
    yield put(listUserActions.getUserConversationsSuccess(payload));
  } catch (err) {
    yield put(
      listUserActions.getUserConversationsFailure(
        err?.message || String(err) || "Fetch conversations failed"
      )
    );
  }
}

function* getUserProfile() {
  try {
    const response = yield call(getUserProfileApi);
    yield put(listUserActions.getUserProfileSuccess(response.data));
  } catch (error) {
    yield put(
      listUserActions.getUserProfileFailure(
        error.message || "can not get user profile"
      )
    );
  }
}

function* getApproveUser(action) {
  try {
    const { id, approve } = action.payload;
    const response = yield call(approveUserApi, id, approve);
    yield put(listUserActions.getAllUserSuccess(response.data));
  } catch (error) {
    yield put(
      listUserActions.getAllUserFailure(
        error.message || "can not get list all user"
      )
    );
  }
}

export default function* userSagas() {
  yield takeLatest(listUserActions.getAllUserRequest.type, getListAllUser);
  yield takeLatest(listUserActions.getUserProfileRequest.type, getUserProfile);
  yield takeLatest(listUserActions.approveUser.type, getApproveUser);
  yield takeLatest(
    listUserActions.getUserConversationsRequest.type,
    getConversationsSaga
  );
}
