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
dotenv.config();

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

//middleware
app.use(bodyParser.json());

//Base path for geonology
app.use("/api/geonology", geonologyRouter);

// Base path for auth
app.use("/api/auth", authRouter);

//Base path for getting user/s
app.use("/api/getUser", userRouter);

//Base path for activation-codes
app.use("/api/activationCode", activationCodeRouter);

const port = process.env.PORT;

app.get("/", (req, res) => {
  res.json({ message: "Hello from Express on Vercel!" });
});

app.listen(port, () => {
  console.log(`Server is running on PORT ${port}`);
});

export default app;
