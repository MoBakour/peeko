// dotenv
import dotenv from "dotenv";
dotenv.config();

// import packages
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import cookieParser from "cookie-parser";

// import routes
import userController from "./controllers/user.controller";
import videoController from "./controllers/video.controller";
import commentController from "./controllers/comment.controller";
import feedbackController from "./controllers/feedback.controller";

// other imports
import { authenticateUser } from "./middleware/authentication";

// config express app
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// cors
app.use(cors());
// app.use(
//     cors({
//         origin: "https://peeko.netlify.app",
//     })
// );

// constants
const SERVER_PORT = parseInt(process.env.port || process.env.PORT || "3000");
const API_VERSION = "1.0.1";

// connect to db
mongoose
    .connect(process.env.MONGODB_CONNECTION_STRING!, {
        dbName: "peeko-database",
    })
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
app.use("/video", videoController);
app.use("/comment", commentController);
app.use("/feedback", feedbackController);

// info route
app.get("/api-info", (req, res) => {
    res.status(200).json({
        api_name: "api-peeko",
        api_version: API_VERSION,
        api_description: "Peeko social media platform backend API",
        developer: "MoBakour",
        developer_contacts: "https://linktr.ee/swordax",
    });
});

// default (404) route
app.use((req, res) => {
    res.status(404).json({
        success: false,
        error: "404 - UNDEFINED ROUTE",
        route: req.path,
    });
});
