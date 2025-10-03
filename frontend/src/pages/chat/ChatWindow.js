import { useState, useEffect, useRef } from "react";
import { useSelector, useDispatch, shallowEqual } from "react-redux";
import messageSelectors from "@store/selectors/chatSelectors";
import { chatActions } from "@store/slices/chatSlices";
import chatSocket from "@utils/chat/chatSocket";

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

  // messages for current target from store (stable)
  const storeTargetMessages = useSelector((state) => {
    if (!selectedTarget) return [];
    return selectedTarget.type === "group"
      ? state.chat?.groupMessages?.[selectedTarget.id] ?? []
      : state.chat?.userMessages?.[selectedTarget.id] ?? [];
  }, shallowEqual);

  const listRef = useRef(null);
  const prevLenRef = useRef(0);
  const [input, setInput] = useState("");
  const [historyMessages, setHistoryMessages] = useState(null); // null = not loaded yet
  const [loadingHistory, setLoadingHistory] = useState(false);
  const currentUserId = decodeTokenUserId();

  useEffect(() => {
    chatSocket.on("new_private_message", (message) => {
      console.log("new_private_message:", message);
    });

    chatSocket.on("new_group_message", (message) => {
      console.log("new_group_message:", message);
    });

    return () => {
      chatSocket.off("new_private_message");
      chatSocket.off("new_group_message");
    };
  }, []);

  // fetch history when target changes (load most recent 20)
  useEffect(() => {
    if (!selectedTarget) {
      setHistoryMessages(null);
      return;
    }
    setLoadingHistory(true);
    if (selectedTarget.type === "group") {
      dispatch(
        chatActions.fetchGroupMessagesRequest({
          id: selectedTarget.id,
          limit: 20,
          offset: 0,
        })
      );
    } else {
      dispatch(
        chatActions.fetchUserMessagesRequest({
          id: selectedTarget.id,
          limit: 20,
          offset: 0,
        })
      );
    }
    setHistoryMessages(null);
  }, [selectedTarget, dispatch]);

  // update local history from store (only when ids changed)
  useEffect(() => {
    if (!selectedTarget) return;
    const newMessages = Array.isArray(storeTargetMessages)
      ? storeTargetMessages
      : [];
    const prev = Array.isArray(historyMessages) ? historyMessages : [];

    const idsEqual = (() => {
      if (prev.length !== newMessages.length) return false;
      for (let i = 0; i < prev.length; i++) {
        if (prev[i]?.id !== newMessages[i]?.id) return false;
      }
      return true;
    })();

    if (!idsEqual) {
      setHistoryMessages(newMessages);
    }
    setLoadingHistory(false);
    prevLenRef.current = (newMessages || []).length;
  }, [storeTargetMessages, selectedTarget]);

  // scroll to bottom when messages change (new message appended)
  useEffect(() => {
    const el = listRef.current;
    if (!el) return;
    // if historyMessages exist -> use it; else use visibleMessages (store)
    const length =
      historyMessages !== null
        ? (historyMessages || []).length
        : (messages || []).length;
    // if increased or initial load, scroll to bottom
    if (length > (prevLenRef.current || 0) || prevLenRef.current === 0) {
      // defer to next tick to allow DOM render
      requestAnimationFrame(() => {
        el.scrollTop = el.scrollHeight;
      });
    }
    prevLenRef.current = length;
  }, [historyMessages, messages]);

  // load more when user scrolls to top
  const handleScroll = (e) => {
    const el = e.currentTarget;
    if (el.scrollTop === 0 && !loadingHistory && selectedTarget) {
      // load older messages: offset = currently loaded length
      const currentCount = Array.isArray(historyMessages)
        ? historyMessages.length
        : 0;
      if (selectedTarget.type === "group") {
        dispatch(
          chatActions.fetchGroupMessagesRequest({
            id: selectedTarget.id,
            limit: 20,
            offset: currentCount,
          })
        );
      } else {
        dispatch(
          chatActions.fetchUserMessagesRequest({
            id: selectedTarget.id,
            limit: 20,
            offset: currentCount,
          })
        );
      }
    }
  };

  const visibleMessages =
    selectedTarget && historyMessages !== null
      ? historyMessages || []
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

    if (selectedTarget.type === "group") {
      chatSocket.emit("group_message", {
        groupId: payload.groupId,
        content: payload.content,
      });
    } else {
      chatSocket.emit("private_message", {
        to: payload.receiverId,
        content: payload.content,
      });
    }
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

      <MessagesContainer ref={listRef} onScroll={handleScroll}>
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

        {/*
          ensure we don't render objects as React children.
          compute senderName safely and sort messages oldest->newest before render
        */}
        {(() => {
          const sorted = Array.isArray(visibleMessages)
            ? [...visibleMessages].sort(
                (a, b) =>
                  new Date(a.createdAt).getTime() -
                  new Date(b.createdAt).getTime()
              )
            : [];

          return sorted.map((m) => {
            const senderObj = m.senderObj ?? m.sender ?? {};
            // sender may be string id or object
            const senderName =
              typeof senderObj === "string"
                ? senderObj
                : senderObj?.username ??
                  senderObj?.nickname ??
                  senderObj?.id ??
                  "";
            const nickname = m.nickname ?? senderObj?.nickname ?? "";
            const senderId =
              (typeof senderObj === "string" ? senderObj : senderObj?.id) ??
              m.senderId ??
              m.sender?.id;
            const isMe = !!(
              senderId &&
              currentUserId &&
              senderId === currentUserId
            );
            const text =
              typeof m.content === "string"
                ? m.content
                : String(m.content ?? m.text ?? "");

            return (
              <Message key={m.id} $me={isMe}>
                <strong>
                  {senderName}
                  {nickname ? ` (${nickname})` : ""}:
                </strong>{" "}
                {text}
              </Message>
            );
          });
        })()}
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
          onKeyDown={(e) => {
            // Enter = send, Shift+Enter = newline
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              handleSend();
            }
          }}
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
