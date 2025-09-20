import { call, put, takeLatest } from "redux-saga/effects";
import { loginRequest as loginApi } from "@api/authApi";
import authConstants from "@constants/authConstants";

function* handleLogin(action) {
  try {
    const side = window.location.pathname;
    const credentials = {
      username: action.payload.username,
      password: action.payload.password,
    };

    const response = yield call(loginApi, side, credentials);
    yield put({
      type: authConstants.LOGIN,
      payload: response.data,
      meta: { status: "success" },
    });
  } catch (error) {
    yield put({
      type: authConstants.LOGIN,
      payload: error.response?.data?.error || "Login failed",
      error: true,
      meta: { status: "failure" },
    });
  }
}

export default function* authSagas() {
  yield takeLatest(authConstants.LOGIN, handleLogin);
}
