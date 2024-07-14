import "dotenv/config";
import express, { Express, Request, Response } from "express";
import { connectDB } from "./config/db";
import cors from "cors";
import userRoutes from "./routes/users";
import { authenticateJWT } from "./middleware/authenticateJWT";

const app: Express = express();
const port = process.env.PORT;

app.use(
  cors({
    origin: "http://localhost:3000",
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    credentials: true,
  })
);
app.use(express.json());

connectDB();

app.use("/user", userRoutes);
app.get("/protected", authenticateJWT, (req, res) => {
  res.json({ message: "access_token 인증 완료" });
});
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
