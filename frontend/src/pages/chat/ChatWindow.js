import React, { useState } from "react";
import {
  ChatContainer,
  MessagesContainer,
  Message,
  InputContainer,
} from "@styles/chat/Chat.styled";

export default function ChatWindow() {
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: "Alice",
      nickname: "alice01",
      text: "Xin chào!",
      me: false,
    },
    { id: 2, sender: "Me", nickname: "nam", text: "Chào bạn!", me: true },
  ]);
  const [input, setInput] = useState("");

  const handleSend = () => {
    if (input.trim() === "") return;
    setMessages([
      ...messages,
      { id: Date.now(), sender: "Me", nickname: "nam", text: input, me: true },
    ]);
    setInput("");
  };

  return (
    <ChatContainer>
      <MessagesContainer>
        {messages.map((m) => (
          <Message key={m.id} me={m.me}>
            <strong>
              {m.sender} ({m.nickname}):
            </strong>{" "}
            {m.text}
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
