import { useParams } from "react-router-dom";
import { useState, useRef, useEffect } from "react";

import PostVideo from "../components/PostVideo";
import VideoView from "../components/VideoView";
import VideoData from "../components/VideoData";
import useMiscStore from "../store/miscStore";
import useDataStore from "../store/dataStore";
import NotFound from "./NotFound";
import useViewStore from "../store/viewStore";
import IconErrorWarningFill from "../icons/IconErrorWarningFill";
import IconCheck2Circle from "../icons/IconCheck2Circle";

const Video = () => {
    const { username, videoKey } = useParams();

    const {
        confirmationActive,
        confirmationText,
        alertActive,
        alertTheme,
        alertText,
        deny,
        confirm,
    } = useMiscStore();

    const { dataIsLoading, uploaderId } = useDataStore();
    const { setSwipeMode } = useViewStore();

    const [mobileComments, setMobileComments] = useState(true);

    const video = useRef(null);
    const previewVideo = useRef(null);

    useEffect(() => {
        setSwipeMode(username ? "profile" : "explore");
    }, [setSwipeMode, username]);

    if (!dataIsLoading && !uploaderId && videoKey !== "undefined") {
        return <NotFound />;
    }

    return (
        <div className="bg-primary-3 h-[100svh] flex justify-center items-center text-white relative overflow-hidden">
            {/* alert box */}
            <div
                className={`${
                    alertActive
                        ? "top-3 translate-y-0"
                        : "top-0 -translate-y-full"
                } ${
                    alertTheme === "error" ? "bg-error" : "bg-success"
                } transition-transform absolute left-1/2 -translate-x-1/2 p-3 rounded-full text-white flex gap-1 z-40 select-none`}
            >
                <p className="font-semibold">{alertText}</p>
                <span className="text-2xl">
                    {alertTheme === "error" ? (
                        <IconErrorWarningFill />
                    ) : (
                        <IconCheck2Circle />
                    )}
                </span>
            </div>

            {/* confirmation box */}
            <div
                className={`${
                    confirmationActive
                        ? "top-3 translate-y-0"
                        : "top-0 -translate-y-full"
                } bg-gradient-to-br from-primary-1 to-primary-2 transition-transform absolute left-1/2 -translate-x-1/2 p-3 rounded-lg text-white z-40 select-none`}
            >
                <p>{confirmationText}</p>
                <div className="w-full flex justify-end gap-3 font-bold">
                    <button
                        type="button"
                        className="xhover:hover:opacity-75 transition"
                        onClick={deny}
                    >
                        Cancel
                    </button>
                    <button
                        type="button"
                        className="xhover:hover:opacity-75 transition"
                        onClick={confirm}
                    >
                        Confirm
                    </button>
                </div>
            </div>

            {/* main page content */}
            <PostVideo video={video} previewVideo={previewVideo} />
            <VideoView
                videoKey={videoKey}
                video={video}
                mobileComments={mobileComments}
                setMobileComments={setMobileComments}
            />
            <VideoData videoKey={videoKey} mobileComments={mobileComments} />
        </div>
    );
};

export default Video;
