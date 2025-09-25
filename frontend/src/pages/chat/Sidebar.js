import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";

import {
  SidebarContainer,
  ChatList,
  ChatItem,
  TopBar,
  CreateGroupBox,
} from "@styles/chat/Chat.styled";

import { searchActions } from "@store/slices/searchSlices";
import { groupActions } from "@store/slices/groupSlices";
import { selectSearchUsers } from "@store/selectors/searchSelectors";

export default function Sidebar(props) {
  const { selectedTarget, setSelectedTarget } = props;
  const dispatch = useDispatch();
  const results = useSelector(selectSearchUsers);
  const [groups, setGroups] = useState([
    // initial sample groups; real data can be loaded from API
  ]);
  const [search, setSearch] = useState("");
  const [creating, setCreating] = useState(false);
  const [groupName, setGroupName] = useState("");
  const [groupDesc, setGroupDesc] = useState("");

  useEffect(() => {
    // optionally load user's groups from API on mount
    const token = localStorage.getItem("token");
    if (!token) return;
    fetch("http://localhost:3000/groups", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data)) setGroups(data);
      })
      .catch(() => {});
  }, []);

  const handleSearch = async (e) => {
    e.preventDefault();
    const q = search.trim();
    if (!q) {
      dispatch(search.clearSearch());
      return;
    }
    // dispatch redux action, saga will call API and populate selector
    dispatch(searchActions.searchRequest({ keyword: q, limit: 20, offset: 0 }));
  };

  const handleCreateGroup = async (e) => {
    e.preventDefault();
    if (!groupName.trim()) return;
    dispatch(
      groupActions.createGroupRequest({
        name: groupName,
        description: groupDesc,
      })
    );
    setGroups((prev) => [
      ...prev,
      { id: Date.now(), name: groupName, description: groupDesc, members: 1 },
    ]);
    setGroupName("");
    setGroupDesc("");
    setCreating(false);
  };

  return (
    <SidebarContainer>
      <TopBar>
        <form
          onSubmit={handleSearch}
          style={{ display: "flex", width: "100%" }}
        >
          <input
            placeholder="Tìm user theo username hoặc nickname..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ flex: 1 }}
          />
          <button type="submit">Tìm</button>
        </form>
      </TopBar>

      <h3>Search results</h3>
      <ChatList>
        {(!results || results.length === 0) && (
          <div style={{ padding: 8, color: "#666" }}>Không có kết quả</div>
        )}
        {results &&
          results.map((r) => (
            <ChatItem
              key={`${r.type}-${r.id}`}
              onClick={() =>
                setSelectedTarget({ type: r.type, id: r.id, name: r.name })
              }
              style={{
                background:
                  selectedTarget?.id === r.id
                    ? "rgba(0,74,153,0.08)"
                    : undefined,
              }}
            >
              <span>
                {r.name} {r.nickname ? `(${r.nickname})` : ""}
              </span>
              <small>{r.type === "private" ? "User" : "Group"}</small>
            </ChatItem>
          ))}
      </ChatList>

      <h3>Groups</h3>
      <ChatList>
        {groups.length === 0 && (
          <div style={{ padding: 8, color: "#666" }}>Bạn chưa có nhóm</div>
        )}
        {groups.map((g) => (
          <ChatItem
            key={g.id}
            onClick={() =>
              setSelectedTarget({ type: "group", id: g.id, name: g.name })
            }
            style={{
              background:
                selectedTarget?.type === "group" && selectedTarget?.id === g.id
                  ? "rgba(0,74,153,0.08)"
                  : undefined,
            }}
          >
            <span>{g.name}</span>
            <small>{g.members ?? ""} members</small>
          </ChatItem>
        ))}
      </ChatList>

      <CreateGroupBox>
        {!creating ? (
          <button onClick={() => setCreating(true)}>Tạo nhóm mới</button>
        ) : (
          <form onSubmit={handleCreateGroup}>
            <input
              placeholder="Tên nhóm"
              value={groupName}
              onChange={(e) => setGroupName(e.target.value)}
            />
            <input
              placeholder="Mô tả (tuỳ chọn)"
              value={groupDesc}
              onChange={(e) => setGroupDesc(e.target.value)}
            />
            <div style={{ display: "flex", gap: 8 }}>
              <button type="submit">Tạo</button>
              <button type="button" onClick={() => setCreating(false)}>
                Huỷ
              </button>
            </div>
          </form>
        )}
      </CreateGroupBox>
    </SidebarContainer>
  );
}
