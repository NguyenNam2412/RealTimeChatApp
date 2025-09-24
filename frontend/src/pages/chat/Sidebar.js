import React from "react";
import { SidebarContainer, ChatList, ChatItem } from "@styles/chat/Chat.styled";

export default function Sidebar() {
  const groups = [
    { id: 1, name: "Frontend Team", members: 5 },
    { id: 2, name: "Backend Team", members: 3 },
    { id: 3, name: "Zalo Clone", members: 10 },
  ];

  return (
    <SidebarContainer>
      <h2>Chats</h2>
      <ChatList>
        {groups.map((g) => (
          <ChatItem key={g.id}>
            <span>{g.name}</span>
            <small>{g.members} members</small>
          </ChatItem>
        ))}
      </ChatList>
    </SidebarContainer>
  );
}
