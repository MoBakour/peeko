// imports
import express from "express";
import mongoose from "mongoose";
import requestIp from "request-ip";
import bcrypt from "bcrypt";
import User from "../models/user";
import { UserObjectType, UserType } from "../types";
import { validateUser_web } from "../middleware/validation";
import { createToken, requireLogin } from "../middleware/authentication";

// create router
const router = express.Router();

// token cookie options
const tokenCookieOptions = (maxAge: number = 60 * 60 * 24 * 14) => {
    return {
        maxAge,
        httpOnly: true,
    };
};

/**
 * @post
 *      POST request to attempt signup (web-client)
 */
router.post("/signup", async (req, res) => {
    // destructure
    const { username, email, password } = req.body;

    try {
        // get user ip address
        const ipAddress = requestIp.getClientIp(req) || undefined;

        // build user object structure
        const userObject: UserObjectType = {
            username,
            email,
            password,
            deviceInfo: {
                ipAddress,
            },
        };

        // validate user object
        const error = validateUser_web(userObject);
        if (error) {
            return res.status(400).json({
                success: false,
                error,
            });
        }

        // hash password
        const salt = await bcrypt.genSalt();
        const hashedPassword = await bcrypt.hash(password, salt);
        userObject.password = hashedPassword;

        // insert to db
        const userDocument: UserType = await User.create(userObject);

        // create & set jwt token
        const token = await createToken(userDocument._id.toString());
        res.cookie("token", token, tokenCookieOptions());

        res.status(200).json({
            success: true,
            userDocument,
        });
    } catch (err: any) {
        // if not mongoose validation error, log to server console
        if (
            err.code !== 11000 &&
            !(err instanceof mongoose.Error.ValidationError)
        ) {
            console.error(err);
        }

        // modify error message if duplicate username error
        if (
            err.code === 11000 &&
            Object.keys(err.keyValue).includes("username")
        ) {
            err.message = `Username ${username} is already used. Try another username`;
        }

        res.status(400).json({
            success: false,
            error: err.message,
        });
    }
});

/**
 * @post
 *      POST request to login (web-client)
 */
router.post("/login", async (req, res) => {
    // destructure
    const { credential, password } = req.body;

    try {
        // try to find user
        const user = await User.findOne({
            $or: [{ username: credential }, { email: credential }],
        });

        // if not found
        if (!user) {
            return res.status(400).json({
                success: false,
                error: "Username or email is incorrect",
            });
        }

        // if no email/password (which means user account is mobile client)
        if (!user.email || !user.password) {
            return res.status(400).json({
                success: false,
                error: "This is a mobile account, cannot be accessed on web",
            });
        }

        // compare passwords
        const matching = await bcrypt.compare(password, user.password);
        if (!matching) {
            return res.status(400).json({
                success: false,
                error: "Password is incorrect",
            });
        }

        // create and set token
        const token = await createToken(user._id.toString());
        res.cookie("token", token, tokenCookieOptions());

        // return response
        res.status(200).json({ success: true });
    } catch (err: any) {
        console.error(err);
        res.status(400).json({
            success: false,
            error: err.message,
        });
    }
});

/**
 * @post
 *      POST request to logout (web-client)
 */
router.post("/logout", requireLogin, (req, res) => {
    res.cookie("token", "", tokenCookieOptions(1));
    res.status(200).json({ success: true });
});

// export router
export default router;
