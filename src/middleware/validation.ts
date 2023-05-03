import { UserObjectType } from "../types";

const usernameRegex = /^[a-zA-Z0-9_ ]+$/;
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const validateUsername = (username: string) => {
    let error: string = "";

    if (!username) {
        error = "Username is required";
    } else {
        if (username.length > 24) {
            error = "Username maximum length is 24 characters";
        }

        if (username.startsWith(" ") || username.endsWith(" ")) {
            error = "Username cannot start or end with spaces";
        }

        if (!usernameRegex.test(username)) {
            error =
                "Username can only include letters, numbers, underscores, and spaces";
        }
    }

    return error;
};

export const validateUser_app = (userObject: UserObjectType) => {
    let error: string = "";

    error = validateUsername(userObject.username);

    if (!userObject.deviceId) {
        error = "deviceId is required for mobile app registration";
    }

    return error;
};

export const validateUser_web = (userObject: UserObjectType) => {
    let error: string = "";

    error = validateUsername(userObject.username);

    if (!userObject.email) {
        error = "Please enter your email";
    } else {
        if (!emailRegex.test(userObject.email)) {
            error = "Please enter a valid email address";
        }

        if (userObject.email.length > 320) {
            error = "Email address maximum length is 320 characters";
        }
    }

    if (!userObject.password) {
        error = "Please enter a password";
    } else {
        if (userObject.password.length < 6) {
            error = "Password minimum length is 6 characters";
        }

        if (userObject.password.length > 300) {
            error = "Password maximum length is 300 characters";
        }

        if (
            userObject.password.startsWith(" ") ||
            userObject.password.endsWith(" ")
        ) {
            error = "Password cannot start with or end with a space";
        }
    }

    return error;
};

export const validateComment = (comment: string) => {
    let error: string = "";

    if (comment.length > 300) {
        error = "Comment maximum length is 300 characters";
    }

    return error;
};
