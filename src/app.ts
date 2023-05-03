// dotenv
import dotenv from "dotenv";
dotenv.config();

// import packages
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import cookieParser from "cookie-parser";

// import routes
import userController from "./controllers/mobileUserController";
import mobileUserController from "./controllers/mobileUserController";
import webUserController from "./controllers/webUserController";
import videoController from "./controllers/videoController";
import commentController from "./controllers/commentController";
import feedbackController from "./controllers/feedbackController";

// other imports
import { authenticateUser } from "./middleware/authentication";

// config express app
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(cookieParser());

// env variables
const MONGODB_CONNECTION_STRING = process.env.MONGODB_CONNECTION_STRING!;
const SERVER_PORT_STRING = process.env.port || process.env.PORT || "3000";
const SERVER_PORT = parseInt(SERVER_PORT_STRING);

const API_VERSION = "v0.1.0-test.6";

// connect to db
mongoose
    .connect(MONGODB_CONNECTION_STRING)
    .then(() => {
        app.listen(SERVER_PORT, () => {
            console.log(`Server running on port: ${SERVER_PORT}`);
            console.log(`Peeko API version: ${API_VERSION}`);
        });
    })
    .catch((err) => {
        console.error(err);
    });

// use authenticateUser
app.use(authenticateUser);

// use routes
app.use("/user", userController);
app.use("/mobile/user", mobileUserController);
app.use("/web/user", webUserController);
app.use("/video", videoController);
app.use("/comment", commentController);
app.use("/feedback", feedbackController);

// info route
app.get("/api-info", (req, res) => {
    res.status(200).json({
        api_name: "api-peeko",
        api_version: API_VERSION,
        api_description: "Peeko social media platform backend API",
        developer: "Swordax",
        developer_contacts: "https://linktr.ee/swordax",
    });
});

// default (404) route
app.use((req, res) => {
    res.status(404).json({ success: false, error: "404 - UNDEFINED ROUTE" });
});
