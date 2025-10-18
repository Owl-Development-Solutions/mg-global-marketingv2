import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import bodyParser from "body-parser";

//routes import
import { getGeonology, loginUserController } from "./controller";
import { registerUserController } from "./controller";

const app = express();
dotenv.config();

app.use(cors());

//middleware
app.use(bodyParser.json());

//routes
app.use("/api/geonology", getGeonology);

//router for user
app.use("/api/registerUser", registerUserController);
app.use("/api/loginUser", loginUserController);

const port = process.env.PORT;

app.listen(port, () => {
  console.log(`Server is running on PORT ${port}`);
});
