import { combineReducers } from "@reduxjs/toolkit";
import { authReducer } from "./authSlice";
import { listUserReducer } from "./userSlices";
import { chatReducer } from "./chatSlices";
import { groupReducer } from "./groupSlices";
import { searchReducer } from "./searchSlices";

const rootReducer = combineReducers({
  auth: authReducer,
  user: listUserReducer,
  chat: chatReducer,
  search: searchReducer,
  group: groupReducer,
});

export default rootReducer;
