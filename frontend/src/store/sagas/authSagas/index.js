import { call, put, takeLatest } from "redux-saga/effects";
import { loginRequest as loginApi } from "@api/authApi";
import authConstants from "@constants/authConstants";

function* handleLogin(action) {
  try {
    const side = action.payload.side || "login";
    const credentials = {
      username: action.payload.username,
      password: action.payload.password,
    };
    const response = yield call(loginApi, side, credentials);
    yield put({ type: authConstants.LOGIN_SUCCESS, payload: response.data });
  } catch (error) {
    yield put({
      type: authConstants.LOGIN_FAILURE,
      payload: error.response?.data?.error || "Login failed",
    });
  }
}

export default function* authSaga() {
  yield takeLatest(authConstants.LOGIN_REQUEST, handleLogin);
}
