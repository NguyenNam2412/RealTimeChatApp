import { useEffect, useState, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";

import {
  SidebarContainer,
  ChatList,
  ChatItem,
  TopBar,
  CreateGroupBox,
  SearchDropdown,
  DropdownItem,
} from "@styles/chat/Chat.styled";

import { searchActions } from "@store/slices/searchSlices";
import { groupActions } from "@store/slices/groupSlices";
import { selectSearchUsers } from "@store/selectors/searchSelectors";

function Sidebar(props) {
  const { selectedTarget, setSelectedTarget } = props;
  const dispatch = useDispatch();
  const results = useSelector(selectSearchUsers);
  const [groups, setGroups] = useState([]);
  const [contacts, setContacts] = useState([]); // lưu private chats đã chọn
  const [search, setSearch] = useState("");
  const [creating, setCreating] = useState(false);
  const [groupName, setGroupName] = useState("");
  const [groupDesc, setGroupDesc] = useState("");
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const inputRef = useRef(null);

  // load groups once
  useEffect(() => {
    const token =
      localStorage.getItem("access_token") || localStorage.getItem("token");
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

  // debounce search: wait 400ms after user stops typing
  useEffect(() => {
    const q = search.trim();
    if (!q) {
      dispatch(searchActions.clearSearch?.() ?? searchActions.searchClear?.());
      setDropdownVisible(false);
      return;
    }
    setDropdownVisible(true);
    const id = setTimeout(() => {
      dispatch(
        searchActions.searchRequest({ keyword: q, limit: 20, offset: 0 })
      );
    }, 400);
    return () => clearTimeout(id);
  }, [search, dispatch]);

  // click outside to close dropdown
  useEffect(() => {
    function onDoc(e) {
      if (!inputRef.current) return;
      if (!inputRef.current.contains(e.target)) {
        setDropdownVisible(false);
      }
    }
    document.addEventListener("click", onDoc);
    return () => document.removeEventListener("click", onDoc);
  }, []);

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
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

  const handleSelectResult = (r) => {
    const target = { type: "private", id: r.id, name: r.username || r.name };
    setSelectedTarget(target);
    // thêm vào contacts nếu chưa tồn tại (ở trên cùng)
    setContacts((prev) => {
      if (prev.find((c) => c.id === target.id)) return prev;
      return [target, ...prev].slice(0, 50); // tối đa 50 contacts lưu tạm
    });
    setDropdownVisible(false);
    setSearch("");
  };

  return (
    <SidebarContainer>
      <TopBar ref={inputRef}>
        <form
          onSubmit={(e) => e.preventDefault()}
          style={{ display: "flex", width: "100%" }}
        >
          <input
            placeholder="Tìm user theo username hoặc nickname..."
            value={search}
            onChange={handleSearchChange}
            style={{ flex: 1 }}
            aria-label="search"
            onFocus={() => {
              if (search.trim()) setDropdownVisible(true);
            }}
          />
          <button
            type="button"
            onClick={() => {
              if (search.trim())
                dispatch(
                  searchActions.searchRequest({
                    keyword: search.trim(),
                    limit: 20,
                    offset: 0,
                  })
                );
            }}
          >
            Tìm
          </button>
        </form>

        {dropdownVisible && results && results.length > 0 && (
          <SearchDropdown>
            {results.map((r) => (
              <DropdownItem
                key={`${r.id}`}
                onClick={() =>
                  handleSelectResult({
                    ...r,
                    type: "private",
                    name: r.username || r.name,
                  })
                }
              >
                <div className="title">{r.username || r.name}</div>
                <small>{r.nickname ?? ""}</small>
              </DropdownItem>
            ))}
          </SearchDropdown>
        )}
      </TopBar>

      {/* Contacts (private chats) - hiển thị top, không trùng với dropdown */}
      <h3>Contacts</h3>
      <ChatList>
        {contacts.length === 0 && (
          <div style={{ padding: 8, color: "#666" }}>
            Bạn chưa trò chuyện với ai
          </div>
        )}
        {contacts.map((c) => (
          <ChatItem
            key={`contact-${c.id}`}
            onClick={() => setSelectedTarget(c)}
            style={{
              background:
                selectedTarget?.type === "private" &&
                selectedTarget?.id === c.id
                  ? "rgba(0,74,153,0.08)"
                  : undefined,
            }}
          >
            <span className="title">{c.name}</span>
            <small>User</small>
          </ChatItem>
        ))}
      </ChatList>

      {/* Groups */}
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
            <span className="title">{g.name}</span>
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

export default Sidebar;
