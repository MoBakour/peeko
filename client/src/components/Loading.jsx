import Logo from "../assets/peeko-logo.png";

const Loading = () => {
    return (
        <div className="bg-primary-3 min-h-svh flex justify-center items-center">
            <img src={Logo} alt="Logo" className="loading-logo w-32" />
        </div>
    );
};

export default Loading;
