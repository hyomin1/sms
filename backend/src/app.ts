import "dotenv/config";
import express, { Express, Request, Response } from "express";
import { connectDB } from "./config/db";
import cors from "cors";
import userRoutes from "./routes/users";

const app: Express = express();
const port = process.env.PORT;

app.use(cors());
app.use(express.json());

connectDB();

app.use("/user", userRoutes);
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
