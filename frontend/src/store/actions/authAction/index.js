import { createAction } from "@reduxjs/toolkit";

import authConstants from "@constants/authConstants";

const loginRequest = createAction(authConstants.LOGIN_REQUEST);
const loginSuccess = createAction(authConstants.LOGIN_SUCCESS);
const loginFailure = createAction(authConstants.LOGIN_FAILURE);

const register = createAction(authConstants.REGISTER);
const logout = createAction(authConstants.LOGOUT);

const authActions = {
  loginRequest,
  loginSuccess,
  loginFailure,
  register,
  logout,
};

export default authActions;
