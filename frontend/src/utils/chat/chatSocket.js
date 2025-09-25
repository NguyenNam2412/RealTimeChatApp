import { io } from "socket.io-client";

// URL = backend WebSocketGateway
const token = localStorage.getItem("token");

const chatSocket = io("http://localhost:3000", {
  transports: ["websocket"], // đảm bảo dùng websocket
  auth: {
    token, // gửi token lên BE
  },
});

export default chatSocket;
