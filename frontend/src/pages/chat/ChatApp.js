import Sidebar from "./Sidebar";
import ChatWindow from "./ChatWindow";
import { AppContainer } from "@styles/chat/Chat.styled";
import { useState } from "react";

export default function ChatApp() {
  // target: { type: 'private'|'group', id: string, name?: string }
  const [selectedTarget, setSelectedTarget] = useState(null);

  return (
    <AppContainer>
      <Sidebar
        selectedTarget={selectedTarget}
        setSelectedTarget={setSelectedTarget}
      />
      <ChatWindow selectedTarget={selectedTarget} />
    </AppContainer>
  );
}
