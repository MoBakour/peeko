// dotenv
import dotenv from "dotenv";
dotenv.config();

// import packages
import express from "express";
import mongoose from "mongoose";

// local imports
import userRoutes from "./controllers/userController";
import videoController from "./controllers/videoController";

// config express app
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// env variables
const MONGODB_CONNECTION_STRING = process.env.MONGODB_CONNECTION_STRING!;
const SERVER_PORT_STRING = process.env.port || process.env.PORT || "3000";
const SERVER_PORT = parseInt(SERVER_PORT_STRING);

// connect to db
mongoose
    .connect(MONGODB_CONNECTION_STRING)
    .then(() => {
        app.listen(SERVER_PORT, () => {
            console.log(`Server running on port: ${SERVER_PORT}`);
        });
    })
    .catch((err) => {
        console.error(err);
    });

// use routes
app.use("/user", userRoutes);
app.use("/video", videoController);
