import { useEffect, useState, useRef, useMemo } from "react";
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
import { listUserActions } from "@store/slices/userSlices";
import userSelectors from "@store/selectors/userSelectors";
import { selectSearchUsers } from "@store/selectors/searchSelectors";

function getCurrentUserIdFromToken() {
  try {
    const token = localStorage.getItem("token");
    if (!token) return null;
    const payload = JSON.parse(atob(token.split(".")[1]));
    return payload?.sub || payload?.id || null;
  } catch {
    return null;
  }
}

function Sidebar(props) {
  const { selectedTarget, setSelectedTarget } = props;
  const dispatch = useDispatch();
  const results = useSelector(selectSearchUsers);
  const conversations = useSelector(userSelectors.selectUserConversations);
  const [groups, setGroups] = useState([]);
  const [contacts, setContacts] = useState([]); // lưu private chats đã chọn
  const [search, setSearch] = useState("");
  const [creating, setCreating] = useState(false);
  const [groupName, setGroupName] = useState("");
  const [groupDesc, setGroupDesc] = useState("");
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [searchLoading, setSearchLoading] = useState(false);
  const [filteredResults, setFilteredResults] = useState([]);
  const debounceRef = useRef(null);
  const inputRef = useRef(null);

  const currentUserId = getCurrentUserIdFromToken();

  // derive contacts (private) and groups from server conversations
  const { serverContacts, serverGroups } = useMemo(() => {
    const cts = [];
    const grs = [];
    (conversations || []).forEach((c) => {
      const lm = c.lastMessage ?? c.last_message ?? null;
      // group conversation case
      const groupId = c.groupId ?? c.group?.id ?? (lm && lm.group?.id) ?? null;
      if (groupId) {
        const name =
          c.groupName ?? c.group?.name ?? lm?.group?.name ?? `Group ${groupId}`;
        grs.push({ type: "group", id: groupId, name, raw: c });
        return;
      }

      // private conversation: try to read other user from lastMessage or conversation shape
      let peer = null;
      if (lm) {
        // lastMessage has sender and receiver
        if (lm.sender?.id === currentUserId) peer = lm.receiver;
        else peer = lm.sender;
      }
      // fallback fields
      const id =
        peer?.id ??
        c.peerId ??
        c.userId ??
        c.otherUserId ??
        c.participantId ??
        c.id;
      const name =
        peer?.nickname ??
        peer?.username ??
        c.peerName ??
        c.username ??
        `User ${id}`;
      if (id) {
        cts.push({ type: "private", id, name, raw: c });
      }
    });
    return { serverContacts: cts, serverGroups: grs };
  }, [conversations, currentUserId]);

  // combine server contacts first, then local contacts (de-duplicate by id+type)
  const combinedContacts = useMemo(() => {
    const map = new Map();
    serverContacts.forEach((t) => map.set(`${t.type}:${t.id}`, t));
    contacts.forEach((t) => {
      const key = `${t.type}:${t.id}`;
      if (!map.has(key)) map.set(key, t);
    });
    return Array.from(map.values());
  }, [serverContacts, contacts]);

  // debounce search: wait 400ms after user stops typing
  useEffect(() => {
    // clear previous timer
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    const q = (search || "").trim();
    if (!q) {
      // clear results
      dispatch(searchActions.clearSearch?.() ?? searchActions.clearSearch());
      setDropdownVisible(false);
      setSearchLoading(false);
      setFilteredResults([]);
      return;
    }

    setSearchLoading(true);
    // schedule API call after 400ms
    debounceRef.current = setTimeout(() => {
      dispatch(
        searchActions.searchRequest({ keyword: q, limit: 20, offset: 0 })
      );
    }, 400);

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [search, dispatch]);

  // when results update, filter out current user and control dropdown visibility
  useEffect(() => {
    const filtered = (results || []).filter((r) => {
      // ensure r.id exists and is not current user
      if (!r) return false;
      const id = r.id ?? r.userId ?? r._id ?? null;
      if (!id) return false;
      if (id === currentUserId) return false;
      if ("isApproved" in r && r.isApproved !== true) return false;
      return true;
    });
    setFilteredResults(filtered);
    setSearchLoading(false);
    setDropdownVisible(filtered.length > 0);
  }, [results, currentUserId]);

  // load conversations on mount
  useEffect(() => {
    dispatch(listUserActions.getUserConversationsRequest());
  }, [dispatch]);

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
    const id = r.id ?? r.userId ?? r._id;
    const name = r.username || r.name || r.displayName || id;
    const target = { type: "private", id, name };
    setSelectedTarget(target);
    // thêm vào contacts nếu chưa tồn tại (ở trên cùng)
    setContacts((prev) => {
      if (prev.find((c) => c.id === target.id)) return prev;
      return [target, ...prev].slice(0, 50); // tối đa 50 contacts lưu tạm
    });
    setDropdownVisible(false);
    setSearch("");
  };

  const openTarget = (target) => {
    if (!target) return;
    setSelectedTarget(target);
    setContacts((prev) => {
      if (prev.find((x) => x.id === target.id && x.type === target.type))
        return prev;
      return [target, ...prev].slice(0, 50);
    });
    setDropdownVisible(false);
    setSearch("");
  };

  return (
    <SidebarContainer>
      <TopBar ref={inputRef} style={{ position: "relative" }}>
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
              if (search.trim() && filteredResults.length)
                setDropdownVisible(true);
            }}
          />
          <button
            type="button"
            onClick={() => {
              const q = search.trim();
              if (!q) return;
              setSearchLoading(true);
              dispatch(
                searchActions.searchRequest({
                  keyword: q,
                  limit: 20,
                  offset: 0,
                })
              );
            }}
          >
            Tìm
          </button>
        </form>

        {dropdownVisible && (
          <SearchDropdown>
            {searchLoading && <div style={{ padding: 8 }}>Đang tìm...</div>}
            {!searchLoading && filteredResults.length === 0 && (
              <div style={{ padding: 8, color: "#666" }}>Không có kết quả</div>
            )}
            {!searchLoading &&
              filteredResults.map((r) => {
                const id = r.id ?? r.userId ?? r._id;
                const name = r.username || r.name || r.displayName || id;
                return (
                  <DropdownItem
                    key={id}
                    onClick={() => handleSelectResult(r)}
                    title={name}
                  >
                    <div className="title">{name}</div>
                    <small>{r.nickname ?? ""}</small>
                  </DropdownItem>
                );
              })}
          </SearchDropdown>
        )}
      </TopBar>

      {/* Contacts (server + local) */}
      <h3>Contacts</h3>
      <ChatList>
        {combinedContacts.length === 0 && (
          <div style={{ padding: 8, color: "#666" }}>
            Bạn chưa trò chuyện với ai
          </div>
        )}
        {combinedContacts.map((t) => (
          <ChatItem
            key={`contact-${t.id}`}
            onClick={() => openTarget(t)}
            style={{
              background:
                selectedTarget?.type === t.type && selectedTarget?.id === t.id
                  ? "rgba(0,74,153,0.08)"
                  : undefined,
            }}
          >
            <span className="title">{t.name}</span>
            <small>User</small>
          </ChatItem>
        ))}
      </ChatList>

      {/* Groups (server) */}
      <h3>Groups</h3>
      <ChatList>
        {serverGroups.length === 0 && (
          <div style={{ padding: 8, color: "#666" }}>Không có nhóm</div>
        )}
        {serverGroups.map((g) => (
          <ChatItem
            key={`group-${g.id}`}
            onClick={() => openTarget(g)}
            style={{
              background:
                selectedTarget?.type === "group" && selectedTarget?.id === g.id
                  ? "rgba(0,74,153,0.08)"
                  : undefined,
            }}
          >
            <span className="title">{g.name}</span>
            <small>Group</small>
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
