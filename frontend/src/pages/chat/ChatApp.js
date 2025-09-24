import Sidebar from "./Sidebar";
import ChatWindow from "./ChatWindow";
import { AppContainer } from "@styles/chat/Chat.styled";

export default function ChatApp() {
  return (
    <AppContainer>
      <Sidebar />
      <ChatWindow />
    </AppContainer>
  );
}
