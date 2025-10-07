import { call, put, takeLatest } from "redux-saga/effects";
import { loginApi, registerApi } from "@api/authApi";
import { authActions } from "@store/slices/authSlice";

function* handleLogin(action) {
  try {
    const side = action.payload.side || "login";
    const credentials = {
      username: action.payload.username,
      password: action.payload.password,
    };
    const response = yield call(loginApi, side, credentials);
    yield put(authActions.loginSuccess(response.data));
  } catch (error) {
    yield put(authActions.loginFailure(error.message || "Login failed"));
  }
}

function* handleRegister(action) {
  try {
    const credentials = {
      username: action.payload.username,
      nickname: action.payload.nickname,
      password: action.payload.password,
    };
    const response = yield call(registerApi, credentials);
    yield put(authActions.registerSuccess(response.data));
  } catch (error) {
    yield put(authActions.registerFailure(error.message || "register failed"));
  }
}

export default function* authSaga() {
  yield takeLatest(authActions.loginRequest.type, handleLogin);
  yield takeLatest(authActions.registerRequest.type, handleRegister);
}
