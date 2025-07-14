import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import configViewEngine from "./config/viewEngine";
import connectDB from "./config/connectDB";

import initWebRoutes from "./routes/web";
require("dotenv").config();

let app = express();

app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(cors({ origin: "http://localhost:5173", credentials: true }));

configViewEngine(app);
initWebRoutes(app);

connectDB();

let port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log("Server is running on port 3000");
});
