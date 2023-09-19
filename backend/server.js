import express from "express";
import dotenv from "dotenv";
import cors from "cors";

import connectToDB from "./config/db.js";
import userRoutes from "./routes/userRoutes.js";
import noteRoutes from "./routes/noteRoutes.js";
import { notFound, errorHandler } from "./middlewares/errorMiddleware.js";


dotenv.config();
connectToDB();
const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api", userRoutes);
app.use("/api", noteRoutes);

app.get("/", (req, res, next) => {
  res.send("API is running...");
});

app.use(notFound);
app.use(errorHandler);

const port = process.env.PORT || 8080;
app.listen(port, () => {
  console.log(`Listening to https://localhost:${port}`);
});
