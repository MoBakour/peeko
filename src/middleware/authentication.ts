// imports
import jwt, { JwtPayload } from "jsonwebtoken";
import { Response, NextFunction } from "express";
import { PeekoRequest } from "../types";

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
        jwt.verify(token, TOKEN_SECRET_KEY, (err, decoded) => {
            if (!err && decoded) {
                req.currentUser = (decoded as JwtPayload).userId;
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
 * This function requires that the authenticated user is the same user that is attempting the action
 * possible sources of user id:
 *      - req.body.userId (post/put requests)
 *      - req.query.userId (get/delete requests)
 *      - req.body.commentorId (comment request)
 */
export const requireSelf = (
    req: PeekoRequest,
    res: Response,
    next: NextFunction
) => {
    // destructure
    const { currentUser } = req;
    const affectedUserId = (req.query.userId ||
        req.body.userId ||
        req.body.commentorId ||
        req.body.uploaderId) as string;

    if (!currentUser || currentUser !== affectedUserId) {
        return res.status(400).json({
            success: false,
            error: "Unauthorized Action",
        });
    }

    next();
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
        res.status(400).json({
            success: false,
            error: "Unauthorized Action",
        });
    }
};
