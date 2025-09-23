import { call, put, takeLatest } from "redux-saga/effects";
import { getAllUserApi, approveUserApi } from "@api/authApi";
import userConstants from "@constants/userConstants";

function* getListAllUser() {
  try {
    const response = yield call(getAllUserApi);
    yield put({
      type: userConstants.GET_ALL_USER,
      payload: response.data,
      meta: { status: "success" },
    });
  } catch (error) {
    yield put({
      type: userConstants.GET_ALL_USER,
      payload: error.response?.data?.error || "can not get list all user",
      error: true,
      meta: { status: "failure" },
    });
  }
}

function* approveUser(action) {
  try {
    const { id, approve } = action.payload;
    const response = yield call(approveUserApi, id, approve);
    yield put({
      type: userConstants.APPROVE_USER,
      payload: response.data,
      meta: { status: "success" },
    });
  } catch (error) {
    yield put({
      type: userConstants.APPROVE_USER,
      payload: error.response?.data?.error || "can not approve user req",
      error: true,
      meta: { status: "failure" },
    });
  }
}

export default function* authSagas() {
  yield takeLatest(userConstants.GET_ALL_USER, getListAllUser);
  yield takeLatest(userConstants.APPROVE_USER, approveUser);
}
