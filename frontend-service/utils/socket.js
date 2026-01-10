import { io } from "socket.io-client";
import { BASE_URL } from "./constants";

export const initializeSocket = () => {
  const socket = io(BASE_URL);

//   const socket = io("/", {
//   path: "/api/socket.io"
// });
  return socket;
};

