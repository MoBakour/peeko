import { useState } from "react";
import useAuthenticate from "../hooks/useAuthenticate";

import InputField from "../components/InputField";
import ActivationSection from "../components/ActivationSection";

// assets
import Blob1 from "../assets/blob-1.svg";
import Blob2 from "../assets/blob-2.svg";
import Blob3 from "../assets/blob-3.svg";
import LogoDesign from "../assets/logo-design.png";
import useAuthStore from "../store/authStore";
import IconLoader2 from "../icons/IconLoader2";

const AuthPage = () => {
    const { authenticate, error, setError, isLoading } = useAuthenticate();
    const { auth, authorized } = useAuthStore();

    const usernameRegex = /^[a-zA-Z0-9_ ]+$/;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    const [authMode, setAuthMode] = useState("Sign in");
    const [passwordMode, setPasswordMode] = useState("password");
    const [visibilityState, setVisibilityState] = useState("visibility");

    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [repassword, setRepassword] = useState("");
    const [errors, setErrors] = useState([
        "username",
        "email",
        "password",
        "repassword",
    ]);

    const handleUsernameStroke = (e) => {
        const newUsername = e.target.value;

        setUsername(newUsername);

        if (
            (newUsername.length > 24 ||
                newUsername.startsWith(" ") ||
                newUsername.endsWith(" ") ||
                !usernameRegex.test(newUsername) ||
                newUsername === "") &&
            authMode === "Register"
        ) {
            setErrors([...errors, "username"]);
        } else {
            setErrors([...errors.filter((err) => err !== "username")]);
        }
    };

    const handleEmailStroke = (e) => {
        const newEmail = e.target.value;

        setEmail(newEmail);

        if (
            newEmail.length > 320 ||
            !emailRegex.test(newEmail) ||
            newEmail === ""
        ) {
            setErrors([...errors, "email"]);
        } else {
            setErrors([...errors.filter((err) => err !== "email")]);
        }
    };

    const handlePasswordStroke = (e) => {
        const newPassword = e.target.value;

        setPassword(newPassword);

        if (
            (newPassword.length < 6 ||
                newPassword.length > 300 ||
                newPassword.startsWith(" ") ||
                newPassword.endsWith(" ") ||
                newPassword === "") &&
            authMode === "Register"
        ) {
            setErrors([...errors, "password"]);
        } else {
            setErrors([...errors.filter((err) => err !== "password")]);
        }
    };

    const handleRepasswordStroke = (e) => {
        const newRepassword = e.target.value;

        setRepassword(newRepassword);

        if (password !== newRepassword) {
            setErrors([...errors, "repassword"]);
        } else {
            setErrors([...errors.filter((err) => err !== "repassword")]);
        }
    };

    const handlePasswordMode = () => {
        setPasswordMode(passwordMode === "password" ? "text" : "password");
        setVisibilityState(
            visibilityState === "visibility" ? "visibility_off" : "visibility"
        );
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const authenticateFunctionMode =
            authMode === "Register" ? "register" : "signIn";
        const authenticateFunctionData = {
            username: authMode === "Register" ? username : null,
            email: authMode === "Register" ? email : null,
            credential: authMode === "Sign in" ? username : null,
            password,
        };

        await authenticate(authenticateFunctionMode, authenticateFunctionData);
    };

    return (
        <div className="min-h-screen bg-gradient-to-tr from-primary-1 to-primary-2 relative overflow-hidden flex justify-center items-center">
            {/* outer blobs */}
            <img
                src={Blob1}
                alt="Blob"
                className="blur-2xl w-6/12 absolute -top-20 bottom-0 -left-48 z-0"
            />
            <img
                src={Blob2}
                alt="Blob"
                className="blur-2xl w-6/12 absolute -top-5 -right-44 -z-10"
            />
            <img
                src={Blob3}
                alt="Blob"
                className="blur-2xl w-6/12 absolute -bottom-56 left-1/2 -translate-x-2/3 translate-y-10 -z-10"
            />

            {/* content */}
            <div className="bg-white flex justify-center items-center w-[80%] lg:w-[90%] h-[calc(100svh-100px)] md:h-auto max-h-[700px] relative rounded-xl overflow-hidden">
                <div className="flex-[1.1] md:hidden xl:flex-[1] h-full bg-gradient-to-br from-authform-1 to-authform-2 overflow-hidden relative flex justify-center items-center">
                    {/* inner blobs & showcase */}
                    <img
                        src={Blob3}
                        alt="Blob"
                        className="absolute blur-[80px] w-8/9 -top-60 -right-60 -z-10 opacity-50"
                    />
                    <img
                        src={Blob1}
                        alt="Blob"
                        className="absolute blur-[80px] w-8/9 -bottom-80 -left-60 -z-10 opacity-50"
                    />
                    <img
                        src={LogoDesign}
                        alt="Logo Design"
                        className="relative w-2/3"
                    />
                </div>

                {/* authentication & activation sections */}
                {auth && !authorized ? (
                    <ActivationSection />
                ) : (
                    <form
                        className="flex-[1] xl:flex-[1.1] h-full py-6 px-8 xl:px-4 sm:px-1"
                        onSubmit={handleSubmit}
                    >
                        <div className="px-6 flex flex-col h-full overflow-y-auto">
                            <h1 className="text-4xl md:text-3xl font-bold pb-8">
                                {authMode}
                            </h1>

                            <div className="flex flex-col gap-5">
                                <InputField
                                    type="text"
                                    placeholder={`Username${
                                        authMode === "Sign in"
                                            ? " or Email Address"
                                            : ""
                                    }`}
                                    error={
                                        errors.includes("username") &&
                                        authMode === "Register"
                                    }
                                    onChangeFunction={handleUsernameStroke}
                                    value={username}
                                />

                                {authMode === "Register" && (
                                    <InputField
                                        type="email"
                                        placeholder="Email Address"
                                        error={errors.includes("email")}
                                        onChangeFunction={handleEmailStroke}
                                        value={email}
                                    />
                                )}

                                <InputField
                                    type={passwordMode}
                                    placeholder="Password"
                                    error={
                                        errors.includes("password") &&
                                        authMode === "Register"
                                    }
                                    onChangeFunction={handlePasswordStroke}
                                    value={password}
                                    passwordField={true}
                                    handlePasswordMode={handlePasswordMode}
                                    visibilityState={visibilityState}
                                />

                                {authMode === "Register" && (
                                    <InputField
                                        type={passwordMode}
                                        placeholder="Confirm Password"
                                        error={errors.includes("repassword")}
                                        onChangeFunction={
                                            handleRepasswordStroke
                                        }
                                        value={repassword}
                                    />
                                )}

                                <p className="text-[crimson] font-medium">
                                    {error}
                                </p>

                                <button
                                    disabled={
                                        (authMode === "Register" &&
                                            errors.length > 0) ||
                                        isLoading
                                    }
                                    className="h-[52px] flex justify-center items-center disabled:pointer-events-none disabled:opacity-60 w-full border-none outline-none bg-gradient-to-r from-primary-1 to-primary-2 text-white font-semibold text-2xl py-2.5 bg-[length:200%] xhover:hover:bg-right transition-all"
                                >
                                    {isLoading ? (
                                        <span className="animate-spin">
                                            <IconLoader2 />
                                        </span>
                                    ) : (
                                        authMode.toUpperCase()
                                    )}
                                </button>

                                <p className="text-center">
                                    {authMode === "Sign in" ? (
                                        <>
                                            Don't have an account?{" "}
                                            <span
                                                className="text-primary-1 text-semibold cursor-pointer text-lg"
                                                onClick={() => {
                                                    setAuthMode("Register");
                                                    setError("");
                                                }}
                                            >
                                                Register!
                                            </span>
                                        </>
                                    ) : (
                                        <>
                                            Already have an account?{" "}
                                            <span
                                                className="text-primary-1 text-semibold cursor-pointer text-lg"
                                                onClick={() => {
                                                    setAuthMode("Sign in");
                                                    setError("");
                                                }}
                                            >
                                                Sign in!
                                            </span>
                                        </>
                                    )}
                                </p>
                            </div>
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
};

export default AuthPage;
