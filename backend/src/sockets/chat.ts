import { Server, Socket } from "socket.io";

export const chatSocket = (io: Server) => {
  io.on("connection", (socket: Socket) => {
    console.log("user connected");

    socket.on("disconnect", () => {
      console.log("client disconnect");
    });
  });
};
