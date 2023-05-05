// imports
import { UserObjectType } from "../types";

// validation regexes
const usernameRegex = /^[a-zA-Z0-9_ ]+$/;
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// validate user function
export const validateUser = (userObject: UserObjectType) => {
    let error: string = "";

    // vaildate username
    if (!userObject.username) {
        error = "Username is required";
    } else {
        if (userObject.username.length > 24) {
            error = "Username maximum length is 24 characters";
        }

        if (
            userObject.username.startsWith(" ") ||
            userObject.username.endsWith(" ")
        ) {
            error = "Username cannot start or end with spaces";
        }

        if (!usernameRegex.test(userObject.username)) {
            error =
                "Username can only include letters, numbers, underscores, and spaces";
        }
    }

    // validate email
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

    // validate password
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

// validate comment function
export const validateComment = (comment: string) => {
    let error: string = "";

    if (comment.length > 300) {
        error = "Comment maximum length is 300 characters";
    }

    return error;
};
