import { useState, useEffect, useCallback } from "react";
import useAuthenticate from "../hooks/useAuthenticate";
import useAxios from "../hooks/useAxios";
import useAuthStore from "../store/authStore";

const ActivationSection = () => {
    const { auth, setAuth } = useAuthStore();

    const { signout } = useAuthenticate();
    const axios = useAxios();

    const [currentDigit, setCurrentDigit] = useState(0);
    const [digits, setDigits] = useState(["", "", "", "", "", ""]);
    const [digitsBlocked, setDigitsBlocked] = useState(false);
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const validKeydowns = "0123456789".split("");
    validKeydowns.push("Backspace");

    const activate = useCallback(
        (activationCode) => {
            if (!auth || isLoading) return;
            setIsLoading(true);
            setError("");

            axios
                .put(`/user/activate`, { activationCode })
                .then(({ data }) => {
                    if (data.success) {
                        const newAuthState = JSON.parse(JSON.stringify(auth));
                        newAuthState.userDocument.activation.activated = true;
                        localStorage.setItem(
                            "auth",
                            JSON.stringify(newAuthState)
                        );
                        setAuth(newAuthState);

                        window.location.href = "/";
                    }
                })
                .catch((err) => {
                    if (err.response) {
                        setError(err.response.data.error);
                        setCurrentDigit(0);
                        setDigits(["", "", "", "", "", ""]);
                        setDigitsBlocked(false);
                    } else {
                        console.error(err);
                    }
                })
                .finally(() => {
                    setIsLoading(false);
                });
        },
        [axios, auth, setAuth, isLoading]
    );

    const handleCodeKeydown = useCallback(
        (e) => {
            if (
                currentDigit !== null &&
                validKeydowns.includes(e.key) &&
                !digitsBlocked
            ) {
                const newDigits = [...digits];

                if (e.key === "Backspace") {
                    newDigits[currentDigit - 1] = "1";
                    if (currentDigit !== 0) {
                        setCurrentDigit((prev) => prev - 1);
                    }
                } else {
                    newDigits[currentDigit] = e.key;
                    setCurrentDigit((prev) => prev + 1);
                }

                setDigits(newDigits);

                if (currentDigit === 5 && e.key !== "Backspace") {
                    setDigitsBlocked(true);
                    const activationCode = newDigits.join("");
                    activate(activationCode);
                }
            }
        },
        [currentDigit, digits, digitsBlocked, validKeydowns, activate]
    );

    const handleReturnToRegistration = () => {
        signout();
        setError("");
    };

    useEffect(() => {
        window.addEventListener("keydown", handleCodeKeydown);

        return () => {
            window.removeEventListener("keydown", handleCodeKeydown);
        };
    }, [handleCodeKeydown]);

    return (
        <div className="flex-[1] xl:flex-[1.1] h-full py-6 px-8 xl:px-4 sm:px-3 overflow-y-auto relative">
            <h1 className="text-4xl md:text-3xl font-bold pb-8">
                Activate your account
            </h1>

            <p>
                Welcome to Peeko,{" "}
                <span className="text-primary-1 font-semibold">
                    {auth?.userDocument.username}
                </span>
                <br />
                <br />
                To continue, you need to activate your account. An activation
                code has been sent to your email address{" "}
                <span className="text-primary-1 font-semibold">
                    {auth?.userDocument.email}
                </span>
                <br />
                <br />
                Please note that you have 10 minutes and 5 attemps to activate
                your account.
            </p>

            <div className="flex gap-4 justify-center items-center mt-10">
                {digits.map((digit, index) => (
                    <input
                        type="text"
                        className={`activation-digit ${
                            currentDigit === index
                                ? "activation-digit-current"
                                : ""
                        } ${digitsBlocked ? "opacity-40" : ""}`}
                        key={index}
                        value={digit}
                        onChange={() => {}}
                    />
                ))}
            </div>

            <p className="text-error bg-[rgba(220,20,60,0.1)] m-auto p-3.5 w-fit rounded-lg my-5 font-medium empty:p-0">
                {error}
            </p>

            <p
                role="button"
                className="text-center underline text-primary-1 font-semibold"
                onClick={handleReturnToRegistration}
            >
                Return to registration
            </p>
        </div>
    );
};

export default ActivationSection;
