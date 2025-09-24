import { call, put, takeLatest } from "redux-saga/effects";
import { getAllUserApi, approveUserApi, getUserProfileApi } from "@api/userApi";
import { listUserActions } from "@store/slices/userSlice";

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
  yield takeLatest(listUserActions.getAllUserRequest, getListAllUser);
  yield takeLatest(listUserActions.getUserProfileRequest, getUserProfile);
  yield takeLatest(listUserActions.approveUser, getApproveUser);
}
