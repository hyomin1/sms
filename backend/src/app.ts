import "dotenv/config";
import express, { Express, Request, Response } from "express";
import { connectDB } from "./config/db";
import cors from "cors";

const app: Express = express();
const port = process.env.PORT;

app.use(cors());

app.get("/", (req: Request, res: Response) => {
  res.send("Hello, TypeScript with Express!");
});

connectDB();
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
