import Sidebar from "./Sidebar";
import ChatWindow from "./ChatWindow";
import { AppContainer } from "@styles/chat/Chat.styled";
import { useState } from "react";
import authSelectors from "@store/selectors/authSelectors";

export default function ChatApp() {
  // target: { type: 'private'|'group', id: string, name?: string }
  const loginSession = authSelectors.selectAuthSession();
  const [selectedTarget, setSelectedTarget] = useState(null);

  return (
    <AppContainer>
      {loginSession && loginSession.status === "pending" ? (
        <div>đang đợi chờ admin duyệt</div>
      ) : (
        <>
          <Sidebar
            selectedTarget={selectedTarget}
            setSelectedTarget={setSelectedTarget}
          />
          <ChatWindow selectedTarget={selectedTarget} />
        </>
      )}
    </AppContainer>
  );
}
