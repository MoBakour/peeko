// imports
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
        let token: string | undefined = undefined;

        /**
         * if token in cookies, take it
         * otherwise if token in headers, take it
         */
        if (req.cookies && req.cookies.token) {
            token = req.cookies.token;
        } else {
            const authHeader = req.headers["authorization"];
            if (authHeader) {
                const [bearer, headerToken] = authHeader.split(" ");
                if (bearer.toLowerCase() === "bearer" && headerToken) {
                    token = headerToken;
                }
            }
        }

        /**
         * if token
         *      verify token
         *          if verified
         *              find user document and attach it to the request object
         */
        if (token) {
            jwt.verify(token, TOKEN_SECRET_KEY, async (err, decoded) => {
                if (!err && decoded) {
                    const userId = (decoded as JwtPayload).userId;
                    const user = await User.findById(userId);

                    req.currentUser = user;
                }
                next();
            });
        } else next();
    } catch (err: any) {
        console.error(err);
        res.status(400).json({
            success: false,
            error: err.message,
        });
    }
};

/**
 * This function only allows access for those who are authenticated with activated accounts
 */
export const requireAuth = (
    req: PeekoRequest,
    res: Response,
    next: NextFunction
) => {
    let errorMessage: string = "";

    if (req.currentUser && req.currentUser.activation!.activated) {
        return next();
    } else if (req.currentUser) {
        errorMessage = "Account Activation Required";
    } else {
        errorMessage = "Sign in is required for this action";
    }

    res.status(400).json({
        success: false,
        error: errorMessage,
    });
};
