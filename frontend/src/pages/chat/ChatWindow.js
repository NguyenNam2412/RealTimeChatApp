import { useState } from "react";
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

  const [input, setInput] = useState("");
  const currentUserId = decodeTokenUserId();

  // filter messages relevant to selectedTarget
  const visibleMessages =
    selectedTarget && messages.length
      ? messages.filter((m) => {
          if (selectedTarget.type === "group") {
            return m.groupId === selectedTarget.id;
          }
          // private chat: show messages between current user and selectedTarget.id
          return (
            (m.receiverId === selectedTarget.id &&
              m.sender?.id === currentUserId) ||
            (m.receiverId === currentUserId &&
              m.sender?.id === selectedTarget.id) ||
            m.sender === selectedTarget.id // support normalized sender as id/username
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
  };

  return (
    <ChatContainer>
      <div>
        {selectedTarget ? (
          <div>
            <strong>{selectedTarget.name}</strong>
            <div style={{ fontSize: 12, color: "#666" }}>
              {selectedTarget.type === "group" ? "Group chat" : "Private"}
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
          placeholder="Nhập tin nhắn..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
        />
        <button onClick={handleSend}>Gửi</button>
      </InputContainer>
    </ChatContainer>
  );
}

export default ChatWindow;
