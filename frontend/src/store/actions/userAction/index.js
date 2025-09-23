import { createAction } from "@reduxjs/toolkit";

import userConstants from "@constants/userConstants";

const getAllUser = createAction(userConstants.GET_ALL_USER);
const approveUser = createAction(userConstants.APPROVE_USER);

const userActions = {
  getAllUser,
  approveUser,
};

export default userActions;
