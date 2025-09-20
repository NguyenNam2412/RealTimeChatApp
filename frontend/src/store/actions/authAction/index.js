import { createAction } from "@reduxjs/toolkit";

import authConstants from "@constants/authConstants";

const login = createAction(authConstants.LOGIN);
const register = createAction(authConstants.REGISTER);
const logout = createAction(authConstants.LOGOUT);

const authActions = {
  login,
  register,
  logout,
};

export default authActions;
