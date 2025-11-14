import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import bodyParser from "body-parser";

//routes import
import authRouter from "./routes/users/auth.routes";
import userRouter from "./routes/users/get-user.routes";
import geonologyRouter from "./routes/geonology/geonology.routes";
import activationCodeRouter from "./routes/activation-code/activation-code.routes";

const app = express();

const allowedOrigins = [
  "http://localhost:4200",
  "https://mg-global-marketingv2.vercel.app",
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, origin);
      } else {
        console.error("CORS blocked origin:", origin);
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);

app.use(express.json());
app.use(bodyParser.json());

// Base paths
app.use("/geonology", geonologyRouter);
app.use("/auth", authRouter);
app.use("/getUser", userRouter);
app.use("/activationCode", activationCodeRouter);

//test if the deploy works!
app.get("/info", (req, res) => {
  res.json({ message: "It works!" });
});

export default app;
