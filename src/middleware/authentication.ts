// imports
import fs from "fs";
import jwt, { JwtPayload } from "jsonwebtoken";
import { Response, NextFunction } from "express";
import { PeekoRequest } from "../types";
import User from "../models/user";

// token secret key
const TOKEN_SECRET_KEY = process.env.TOKEN_SECRET_KEY as string;

/**
 * This function creates a JWT token with a userId in the payload
 */
export const createToken = (userId: string) => {
    return new Promise((resolve, reject) => {
        jwt.sign(
            { userId },
            TOKEN_SECRET_KEY,
            (err: Error | null, token: string | undefined) => {
                if (!err) {
                    resolve(token);
                } else {
                    reject(err);
                }
            }
        );
    });
};

/**
 * If user is authenticated, currentUser property will be attached to request object.
 * currentUser property (if assigned) will contain the user id of the current authenticated user.
 */
export const authenticateUser = async (
    req: PeekoRequest,
    res: Response,
    next: NextFunction
) => {
    try {
        // check if authorization header exists and has a valid syntax
        const authHeader = req.headers["authorization"];
        if (!authHeader) return next();
        const [bearer, token] = authHeader.split(" ");
        if (bearer.toLowerCase() !== "bearer" || !token) return next();

        // verify the token and attach the decoded user id to the request object
        jwt.verify(token, TOKEN_SECRET_KEY, async (err, decoded) => {
            if (!err && decoded) {
                const userId = (decoded as JwtPayload).userId;
                const user = await User.findById(userId);

                req.currentUser = user;
            }
            next();
        });
    } catch (err: any) {
        console.error(err);
        res.status(400).json({
            success: false,
            error: err.message,
        });
    }
};

/**
 * This function only allows access for those who are logged in the app
 */
export const requireLogin = (
    req: PeekoRequest,
    res: Response,
    next: NextFunction
) => {
    if (req.currentUser) next();
    else {
        if (req.path === "/video/uploadVideo") {
            fs.unlink(req.file!.path, (err) => {
                if (err) {
                    console.error(err);
                }
            });
        }

        res.status(400).json({
            success: false,
            error: "Unauthorized Action",
        });
    }
};
