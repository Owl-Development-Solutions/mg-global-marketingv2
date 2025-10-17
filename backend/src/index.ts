import express from "express";
import dotenv from "dotenv";

//routes import
import geonology from "./routes/geonology";
import bodyParser from "body-parser";

const app = express();
dotenv.config();

//middleware
app.use(bodyParser.json());

//routes
app.use("/api/geonology", geonology);

const port = process.env.PORT;

app.listen(port, () => {
  console.log(`Server is running on PORT ${port}`);
});
