import "dotenv/config";
import express, { Express, Request, Response } from "express";
import { connectDB } from "./config/db";
import cors from "cors";
import cookieParser from "cookie-parser";
import userRoutes from "./routes/users";
import studyGroupRoutes from "./routes/studygroups";
import { authenticateJWT } from "./middleware/authenticateJWT";
import http from "http";
import { Server } from "socket.io";
import { chatSocket } from "./sockets/chat";

const app: Express = express();
const port = process.env.PORT;

const httpServer = http.createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
    credentials: true,
  },
});

app.use(
  cors({
    origin: "http://localhost:3000",
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());

connectDB();

app.use("/auth", userRoutes);
app.use("/studyGroup", authenticateJWT, studyGroupRoutes);
app.get("/protected", authenticateJWT, (req, res) => {
  res.json({ message: "access_token 인증 완료" });
});

chatSocket(io);
httpServer.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
