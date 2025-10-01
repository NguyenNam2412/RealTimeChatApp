import { io } from "socket.io-client";

// URL = backend WebSocketGateway
const token = localStorage.getItem("token");

const chatSocket = io("http://localhost:5000", {
  transports: ["websocket"], // đảm bảo dùng websocket
  auth: (cb) => {
    cb({ token }); // gửi token lên BE
  },
});

export default chatSocket;
