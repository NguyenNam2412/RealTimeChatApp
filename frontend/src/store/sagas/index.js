import { all } from "redux-saga/effects";
import authSagas from "./authSagas";
import userSagas from "./userSagas";

export default function* rootSaga() {
  yield all([authSagas(), userSagas()]);
}
