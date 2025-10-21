import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import bodyParser from "body-parser";

//routes import
import authRouter from "./routes/users/auth.routes";
import userRouter from "./routes/users/get-user.routes";
import { connection } from "./config/mysql.db";

const app = express();
dotenv.config();

app.use(cors());
app.use(express.json());

//middleware
app.use(bodyParser.json());

//routes
// app.use("/api/geonology", getGeonology);

// Base path
app.use("/api/auth", authRouter);

//Base path for getting user/s
app.use("/api/getUser", userRouter);

const port = process.env.PORT;

app.listen(port, () => {
  console.log(`Server is running on PORT ${port}`);
});
