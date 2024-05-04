import React from "react";
import { Link, useNavigate } from "react-router-dom";

const NotFound = () => {
    const navigate = useNavigate();

    return (
        <div className="h-[100svh] bg-primary-3 text-fadingWhite flex flex-col justify-center items-center text-center gap-3 p-5">
            <h1 className="text-7xl text-white font-bold">404</h1>
            <p className="text-xl text-white font-bold">Not Found</p>
            <p>The page you were looking for does not seem to exist anymore</p>
            <Link className="underline" onClick={() => navigate(-1)}>
                Back
            </Link>
        </div>
    );
};

export default NotFound;
