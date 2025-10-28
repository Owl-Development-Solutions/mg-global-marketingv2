import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import bodyParser from "body-parser";

//routes import
import authRouter from "./routes/users/auth.routes";
import userRouter from "./routes/users/get-user.routes";
import geonologyRouter from "./routes/geonology/geonology.routes";

const app = express();
dotenv.config();

const allowedOrigins = ["http://localhost:4200"];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, origin);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);
app.use(express.json());

//middleware
app.use(bodyParser.json());

//routes for geonology
app.use("/api/geonology", geonologyRouter);

// Base path
app.use("/api/auth", authRouter);

//Base path for getting user/s
app.use("/api/getUser", userRouter);

const port = process.env.PORT;

app.listen(port, () => {
  console.log(`Server is running on PORT ${port}`);
});
