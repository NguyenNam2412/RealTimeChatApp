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
  display: flex;
  flex-direction: column;
  flex: 1;
  height: 100vh;
  box-sizing: border-box;
`;

/* Header / title of chat window */
export const ChatHeader = styled.div`
  padding: 12px;
  border-bottom: 1px solid #eee;
  background: #fff;
`;

/* Messages area: allow shrink on small screens */
export const MessagesContainer = styled.div`
  flex: 1 1 auto;
  padding: 16px;
  overflow: auto;
  display: flex;
  flex-direction: column;
  gap: 8px;
  background: #fff;
`;

/* Message bubble */
export const Message = styled.div`
  max-width: 75%;
  padding: 8px 12px;
  border-radius: 12px;
  background: ${(p) => (p.$me ? "#d1e7ff" : "#f1f1f1")};
  color: #111;
  align-self: ${(p) => (p.$me ? "flex-end" : "flex-start")};
  box-shadow: 0 1px 0 rgba(0, 0, 0, 0.03);
  word-break: break-word;
  white-space: pre-wrap;
  font-size: 14px;

  strong {
    display: block;
    font-weight: 600;
    margin-bottom: 4px;
    font-size: 13px;
    color: #0b57a4;
  }
`;

/* Input area */
export const InputContainer = styled.div`
  flex: 0 0 auto;
  padding: 8px;
  display: flex;
  gap: 8px;
  border-top: 1px solid #eee;
  background: #fafafa;

  input {
    flex: 1 1 auto;
    padding: 10px 12px;
    border-radius: 8px;
    border: 1px solid #ddd;
    font-size: 14px;
    outline: none;
  }

  button {
    padding: 8px 12px;
    border-radius: 8px;
    border: none;
    background: #0b66d1;
    color: #fff;
    cursor: pointer;
    font-weight: 600;
  }

  button:disabled {
    opacity: 0.6;
    cursor: default;
  }
`;

// /* responsive tweaks */
// @media (max-width: 699px) {
//   .${SidebarContainer} {
//     width: 100%;
//   }
// }
