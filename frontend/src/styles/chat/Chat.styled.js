import styled from "styled-components";

export const AppContainer = styled.div`
  display: flex;
  height: 100vh;
  background: #f5f5f5;
`;

export const SidebarContainer = styled.div`
  width: 25%;
  background: #e9f3ff;
  border-right: 1px solid #ccc;
  padding: 10px;
`;

export const ChatList = styled.div`
  margin-top: 20px;
`;

export const ChatItem = styled.div`
  padding: 10px;
  border-radius: 5px;
  margin-bottom: 8px;
  cursor: pointer;
  background: #fff;
  &:hover {
    background: #d0e6ff;
  }
  span {
    display: block;
    font-weight: bold;
  }
  small {
    color: #666;
  }
`;

export const ChatContainer = styled.div`
  width: 75%;
  display: flex;
  flex-direction: column;
`;

export const MessagesContainer = styled.div`
  flex: 1;
  padding: 20px;
  overflow-y: auto;
`;

export const Message = styled.div`
  margin: 5px 0;
  padding: 10px;
  border-radius: 8px;
  max-width: 60%;
  background: ${(props) => (props.me ? "#cce5ff" : "#fff")};
  align-self: ${(props) => (props.me ? "flex-end" : "flex-start")};
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
`;

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
