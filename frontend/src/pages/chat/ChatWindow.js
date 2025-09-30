import { useState, useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import messageSelectors from "@store/selectors/chatSelectors";
import { chatActions } from "@store/slices/chatSlices";

import {
  ChatContainer,
  MessagesContainer,
  Message,
  InputContainer,
} from "@styles/chat/Chat.styled";

function decodeTokenUserId() {
  try {
    const token = localStorage.getItem("token");
    if (!token) return null;
    const payload = JSON.parse(atob(token.split(".")[1]));
    return payload.sub || payload.id || null;
  } catch {
    return null;
  }
}

function ChatWindow(props) {
  const { selectedTarget } = props;
  const dispatch = useDispatch();
  const messages = useSelector(messageSelectors.selectAllMessages);
  const loading = useSelector(messageSelectors.selectLoading);
  const error = useSelector(messageSelectors.selectError);
  // use a single selector that returns messages for the current target (handles null target)
  const storeTargetMessages = useSelector((state) =>
    messageSelectors.selectMessagesForTarget(selectedTarget)(state)
  );
  const prevMsgsRef = useRef(new Set());

  const [input, setInput] = useState("");
  const [historyMessages, setHistoryMessages] = useState(null); // null = not loaded yet
  const [loadingHistory, setLoadingHistory] = useState(false);
  const currentUserId = decodeTokenUserId();

  // fetch history when target changes
  useEffect(() => {
    if (!selectedTarget) {
      setHistoryMessages(null);
      return;
    }
    setLoadingHistory(true);
    if (selectedTarget.type === "group") {
      dispatch(chatActions.fetchGroupMessagesRequest(selectedTarget.id));
    } else {
      dispatch(chatActions.fetchUserMessagesRequest(selectedTarget.id));
    }
    setHistoryMessages(null);
    prevMsgsRef.current = new Set();
  }, [selectedTarget, dispatch]);

  // storeTargetMessages (from useSelector above) updates when store or selectedTarget changes

  useEffect(() => {
    if (selectedTarget) {
      setHistoryMessages(
        Array.isArray(storeTargetMessages) ? storeTargetMessages : []
      );
      setLoadingHistory(false);
      prevMsgsRef.current = new Set(
        (Array.isArray(storeTargetMessages) ? storeTargetMessages : []).map(
          (m) => m.id
        )
      );
    }
  }, [storeTargetMessages, selectedTarget]);

  // filter messages relevant to selectedTarget
  const visibleMessages =
    selectedTarget && historyMessages !== null
      ? // if history loaded use it
        historyMessages || []
      : selectedTarget && messages.length
      ? messages.filter((m) => {
          if (selectedTarget.type === "group") {
            return m.groupId === selectedTarget.id;
          }
          return (
            (m.receiverId === selectedTarget.id &&
              m.sender?.id === currentUserId) ||
            (m.receiverId === currentUserId &&
              m.sender?.id === selectedTarget.id) ||
            m.sender === selectedTarget.id
          );
        })
      : [];

  const handleSend = () => {
    if (!selectedTarget) {
      alert("Vui lòng chọn người nhận hoặc nhóm ở sidebar");
      return;
    }
    if (input.trim() === "") return;

    const payload = {
      content: input.trim(),
      groupId: selectedTarget.type === "group" ? selectedTarget.id : null,
      receiverId: selectedTarget.type === "private" ? selectedTarget.id : null,
    };
    dispatch(chatActions.sendMessageRequest(payload));
    setInput("");
    if (historyMessages !== null) {
      const tmp = {
        id: `tmp-${Date.now()}`,
        content: payload.content,
        sender: { id: currentUserId },
        me: true,
        createdAt: new Date().toISOString(),
        groupId: payload.groupId,
        receiverId: payload.receiverId,
      };
      setHistoryMessages((prev) =>
        Array.isArray(prev) ? [...prev, tmp] : [tmp]
      );
    }
  };

  return (
    <ChatContainer>
      <div>
        {selectedTarget ? (
          <div>
            <strong>{selectedTarget.name}</strong>
            <div style={{ fontSize: 12, color: "#666" }}>
              {selectedTarget.type === "group" ? "Group chat" : "Private"}
              {loadingHistory ? " — Đang tải lịch sử..." : ""}
            </div>
          </div>
        ) : (
          <div>
            <strong>Chọn cuộc trò chuyện</strong>
            <div style={{ fontSize: 12, color: "#666" }}>
              Chọn user hoặc group ở sidebar
            </div>
          </div>
        )}
      </div>

      <MessagesContainer>
        {loading && <p>Đang gửi...</p>}
        {error && <p style={{ color: "red" }}>{error}</p>}

        {/* when a target is selected but no messages loaded (empty array) show placeholder */}
        {selectedTarget && !loadingHistory && visibleMessages.length === 0 && (
          <div style={{ padding: 16, color: "#666" }}>
            <p>
              Bạn đã chọn <strong>{selectedTarget.name}</strong>.
            </p>
            <p>Chưa có tin nhắn. Gửi lời chào để bắt đầu cuộc trò chuyện.</p>
          </div>
        )}

        {loadingHistory && (
          <div style={{ padding: 16, color: "#666" }}>Đang tải lịch sử...</div>
        )}

        {visibleMessages.map((m) => (
          <Message key={m.id} me={m.me}>
            <strong>
              {m.sender?.username ?? m.sender ?? ""}{" "}
              {m.nickname ? `(${m.nickname})` : ""}:
            </strong>{" "}
            {m.content ?? m.text}
          </Message>
        ))}
      </MessagesContainer>

      <InputContainer>
        <input
          type="text"
          placeholder={
            selectedTarget
              ? `Gửi tới ${selectedTarget.name}`
              : "Nhập tin nhắn..."
          }
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
          disabled={!selectedTarget}
        />
        <button onClick={handleSend} disabled={!selectedTarget}>
          Gửi
        </button>
      </InputContainer>
    </ChatContainer>
  );
}

export default ChatWindow;
