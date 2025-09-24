import { useEffect } from "react";
import { useDispatch, useSelector, shallowEqual } from "react-redux";

import { listUserActions } from "@store/slices/userSlice";
import userSelectors from "@store/selectors/userSelectors";

import StyledTable from "@components/Table";

function ListUserManage() {
  const dispatch = useDispatch();

  const { listUserRegRequest, listUser } = useSelector(
    (state) => ({
      listUserRegRequest: userSelectors.selectListUserWaitingApprove(state),
      listUser: userSelectors.selectListUser(state),
    }),
    shallowEqual
  );

  useEffect(() => {
    dispatch(listUserActions.getAllUserRequest());
  }, [dispatch]);

  const handleApprove = (row) => {
    dispatch({ type: "USER_APPROVE", payload: row });
  };

  const handleReject = (row) => {
    dispatch({ type: "USER_REJECT", payload: row });
  };

  const columns = [
    {
      key: "index",
      dataIndex: "index",
      title: "STT",
      sticky: "col",
      align: "center",
    },
    { key: "username", dataIndex: "username", title: "Username" },
    { key: "nickname", dataIndex: "nickname", title: "Nickname" },
    {
      key: "isApproved",
      dataIndex: "isApproved",
      title: "Chờ duyệt",
      render: (value, row, rowIndex) => {
        if (row.isApproved !== null) return;
        return (
          <div style={{ display: "flex", gap: "8px" }}>
            <button onClick={() => handleApprove(row)}>Approve</button>
            <button onClick={() => handleReject(row)}>Reject</button>
          </div>
        );
      },
    },
  ];

  return (
    <div style={{ marginTop: "20px", maxWidth: "500px" }}>
      <StyledTable
        columns={columns}
        data={[...listUserRegRequest, ...listUser]}
      />
    </div>
  );
}

export default ListUserManage;
