import styled from "styled-components";

export const AppContainer = styled.div`
  display: flex;
  height: 100vh;
  background: #f5f5f5;
  overflow: hidden;
`;

/* Sidebar:
   - default fixed width for small screens
   - on wide screens use 25%
*/
export const SidebarContainer = styled.div`
  width: 280px;
  min-width: 220px;
  background: #e9f3ff;
  border-right: 1px solid #ccc;
  padding: 10px;
  box-sizing: border-box;
  overflow: auto;

  @media (min-width: 900px) {
    width: 25%;
  }
`;

export const TopBar = styled.div`
  position: relative;
  z-index: 20;
`;

/* dropdown under search */
export const SearchDropdown = styled.div`
  position: absolute;
  left: 0;
  right: 0;
  top: calc(100% + 8px);
  background: #fff;
  border: 1px solid #ddd;
  border-radius: 6px;
  box-shadow: 0 6px 18px rgba(0, 0, 0, 0.08);
  max-height: 300px;
  overflow-y: auto;
  padding: 6px;
`;

/* small item inside dropdown */
export const DropdownItem = styled.div`
  padding: 8px;
  display: flex;
  justify-content: space-between;
  gap: 8px;
  align-items: center;
  border-radius: 4px;
  cursor: pointer;
  &:hover {
    background: #f0f8ff;
  }
  .title {
    flex: 1 1 auto;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis; /* truncate long names */
    font-weight: 600;
  }
  small {
    color: #666;
    margin-left: 8px;
    white-space: nowrap;
    flex: 0 0 auto;
  }
`;

export const CreateGroupBox = styled.div`
  margin-top: 12px;
`;

/* list of chats below */
export const ChatList = styled.div`
  margin-top: 20px;
`;

/* Chat item: ensure ellipsis for name text */
export const ChatItem = styled.div`
  padding: 10px;
  border-radius: 5px;
  margin-bottom: 8px;
  cursor: pointer;
  background: #fff;
  display: flex;
  justify-content: space-between;
  align-items: center;
  &:hover {
    background: #d0e6ff;
  }
  .title {
    display: block;
    font-weight: bold;
    max-width: 100%;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  small {
    color: #666;
    margin-left: 8px;
    flex: 0 0 auto;
  }
`;

/* Chat area */
export const ChatContainer = styled.div`
  flex: 1 1 auto;
  display: flex;
  flex-direction: column;
  min-width: 0;
`;

/* Header / title of chat window */
export const ChatHeader = styled.div`
  padding: 12px;
  border-bottom: 1px solid #eee;
  background: #fff;
`;

/* Messages area: allow shrink on small screens */
export const MessagesContainer = styled.div`
  flex: 1;
  padding: 20px;
  overflow-y: auto;
  min-height: 0; /* important for flex children overflow on mobile */
`;

/* Message bubble */
export const Message = styled.div`
  margin: 5px 0;
  padding: 10px;
  border-radius: 8px;
  max-width: 60%;
  background: ${(props) => (props.me ? "#cce5ff" : "#fff")};
  align-self: ${(props) => (props.me ? "flex-end" : "flex-start")};
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);

  /* ensure text wrapping inside bubble */
  white-space: pre-wrap;
  word-break: break-word;
`;

/* Input area */
export const InputContainer = styled.div`
  display: flex;
  padding: 10px;
  border-top: 1px solid #ccc;
  background: #fff;

  input {
    flex: 1;
    padding: 8px;
    border-radius: 5px;
    border: 1px solid #ccc;
    margin-right: 10px;
    min-width: 0;
  }

  button {
    padding: 8px 15px;
    background: #0078ff;
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;
  }
`;

// /* responsive tweaks */
// @media (max-width: 699px) {
//   .${SidebarContainer} {
//     width: 100%;
//   }
// }
