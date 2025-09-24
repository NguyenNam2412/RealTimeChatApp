import { combineReducers } from "@reduxjs/toolkit";
import { authReducer } from "./authSlice";
import { listUserReducer } from "./userSlice";

const rootReducer = combineReducers({
  auth: authReducer,
  user: listUserReducer,
});

export default rootReducer;
