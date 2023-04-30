export const validateUsername = (username: string) => {
    const regex = /^[a-zA-Z0-9_ ]+$/;
    let error: string = "";

    if (username.length > 24) {
        error = "Username max length is 24 characters";
    }

    if (!regex.test(username)) {
        error =
            "Username can only include letters, numbers, underscores, and spaces";
    }

    return error;
};
