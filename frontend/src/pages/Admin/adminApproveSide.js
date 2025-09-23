import { useEffect, useMemo } from "react";
import { useDispatch, useSelector, shallowEqual } from "react-redux";

import authSelectors from "@store/selectors/authSelectors";

import StyledTable from "@components/Table";

function AdminSide() {
  const dispatch = useDispatch();

  const { listUserRegRequest } = useSelector(
    (state) => ({
      listUserRegRequest: authSelectors.getListUserRegRequest(state),
    }),
    shallowEqual
  );

  useEffect(() => {
    dispatch({});
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
      render: (value, row, rowIndex) => (
        <div style={{ display: "flex", gap: "8px" }}>
          <button onClick={() => handleApprove(row)}>Approve</button>
          <button onClick={() => handleReject(row)}>Reject</button>
        </div>
      ),
    },
  ];

  return (
    <div style={{ marginTop: "20px", maxWidth: "500px" }}>
      <StyledTable columns={columns} data={listUserRegRequest} />
    </div>
  );
}

export default AdminSide;
