import { io } from "socket.io-client";
import { BASE_URL } from "../api/api";
import React from "react";

export const socket = io(BASE_URL, {
  autoConnect: false,
});
export const SocketContext = React.createContext(socket);
