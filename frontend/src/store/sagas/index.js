import { all } from "redux-saga/effects";
import authSagas from "./authSagas";
import userSagas from "./userSagas";
import messageSaga from "./chatSagas";
import groupSagas from "./groupSagas";
import searchSagas from "./searchSagas";

export default function* rootSaga() {
  yield all([
    authSagas(),
    userSagas(),
    messageSaga(),
    groupSagas(),
    searchSagas(),
  ]);
}
