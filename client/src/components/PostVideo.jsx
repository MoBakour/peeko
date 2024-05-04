import { useRef } from "react";
import { useNavigate } from "react-router-dom";
import useAxios from "../hooks/useAxios";
import { useSwipe } from "../hooks/useSwipe";
import useViewStore from "../store/viewStore";
import useMiscStore from "../store/miscStore";
import RangeInput from "./RangeInput";
import Icon270CancelCircle from "../icons/Icon270CancelCircle";
import IconPlay from "../icons/IconPlay";
import IconPlusCircle from "../icons/IconPlusCircle";
import IconLoader2 from "../icons/IconLoader2";

const PostVideo = ({ video, previewVideo }) => {
    const navigate = useNavigate();
    const axios = useAxios();
    const { insertVideo } = useSwipe();

    const darken = useRef(null);

    const {
        isPlaying,
        previewIsPlaying,
        toggleVideo,
        previewSrc,
        setPreviewSrc,
        videoFile,
        setVideoFile,
        allowSubmit,
        setAllowSubmit,
        previewDuration,
        setPreviewDuration,
        previewCurrentTime,
        setPreviewCurrentTime,
        isPosting,
        setIsPosting,
        closeModal,
    } = useViewStore();
    const { activateAlert, modalState } = useMiscStore();

    const handleOnChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const videoUrl = URL.createObjectURL(file);

        setPreviewSrc(videoUrl);
        setVideoFile(file);
        setAllowSubmit(true);
    };

    const handleTimeUpdate = () => {
        setPreviewCurrentTime(previewVideo.current.currentTime);
    };

    const handleLoadedMetaData = () => {
        setPreviewDuration(previewVideo.current.duration);
    };

    const handleSeekBarChange = (e) => {
        const seekTime = (previewVideo.current.duration / 100) * e.target.value;
        previewVideo.current.currentTime = seekTime;
    };

    const handleVideoClick = (e) => {
        if (e.target.id !== "seekBar" && e.target.id !== "removeVideoButton")
            toggleVideo("preview", previewVideo);
    };

    const handleRemoveVideo = () => {
        setPreviewSrc(null);
        setVideoFile("");
        setAllowSubmit(false);
    };

    const handlePostVideo = () => {
        if (!videoFile) return;

        setIsPosting(true);

        const formData = new FormData();
        formData.append("videoFile", videoFile);

        axios
            .post(`/video/upload`, formData)
            .then(({ data }) => {
                if (data.success) {
                    activateAlert("Video posted", "success");
                    darken.current.click();
                    if (!isPlaying) {
                        toggleVideo("main", video);
                    }
                    insertVideo(data.videoDocument.videoKey);
                    navigate(`/video/${data.videoDocument.videoKey}`);
                }
            })
            .catch((err) => {
                console.error(err);
                activateAlert("Failed to post video", "error");
            })
            .finally(() => setIsPosting(false));
    };

    return (
        <>
            {/* post modal */}
            <div
                className={`${
                    modalState
                        ? "top-1/2 -translate-y-1/2"
                        : "top-0 -translate-y-full"
                } fixed left-1/2 -translate-x-1/2 -translate-y-1/2 aspect-[9/16] h-[calc(100svh-200px)] bg-primary-1 z-30 rounded-xl flex flex-col justify-evenly items-center transition`}
            >
                {previewSrc ? (
                    <div
                        className="aspect-[9/16] w-4/6 rounded-lg rounded-tr-none relative overflow-hidden"
                        onClick={handleVideoClick}
                    >
                        <video
                            ref={previewVideo}
                            src={previewSrc}
                            onLoadedMetadata={handleLoadedMetaData}
                            onTimeUpdate={handleTimeUpdate}
                            autoPlay={previewIsPlaying}
                        >
                            Your browser does not support this video
                        </video>

                        {/* remove video button */}
                        {!isPosting && (
                            <span
                                className="text-lg absolute text-error top-2 right-2 cursor-pointer transition xhover:hover:opacity-70"
                                title="Remove Video"
                                onClick={handleRemoveVideo}
                                id="removeVideoButton"
                            >
                                <Icon270CancelCircle />
                            </span>
                        )}

                        {/* is playing icon */}
                        <span
                            className={`${
                                previewIsPlaying
                                    ? "opacity-0 pointer-events-none"
                                    : ""
                            } absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 select-none text-8xl transition`}
                        >
                            <IconPlay />
                        </span>

                        {/* seek bar */}
                        <RangeInput
                            onChangeFunction={handleSeekBarChange}
                            currentTime={previewCurrentTime}
                            duration={previewDuration}
                        />
                    </div>
                ) : (
                    <label
                        htmlFor="videoInput"
                        className="aspect-[9/16] w-4/6 rounded-lg border-2 border-dashed group flex justify-center items-center cursor-pointer"
                    >
                        <span className="text-6xl font-bold transition group-hover:scale-110">
                            <IconPlusCircle />
                        </span>
                    </label>
                )}

                <input
                    id="videoInput"
                    type="file"
                    accept="video/*"
                    className="hidden"
                    onChange={handleOnChange}
                    onClick={(e) => (e.target.value = "")}
                />

                <button
                    type="button"
                    disabled={!allowSubmit || isPosting}
                    className="bg-primary-2 w-4/6 p-4 text-xl font-bold rounded-lg transition xhover:hover:scale-105 disabled:opacity-50 disabled:pointer-events-none flex justify-center items-center"
                    onClick={handlePostVideo}
                >
                    {isPosting ? (
                        <span className="animate-spin">
                            <IconLoader2 />
                        </span>
                    ) : (
                        <span>POST VIDEO</span>
                    )}
                </button>
            </div>

            {/* post modal dark background */}
            <div
                ref={darken}
                onClick={() => closeModal(previewVideo)}
                className={`${
                    modalState ? "opacity-80" : "opacity-0 pointer-events-none"
                } fixed top-0 left-0 w-screen h-screen bg-black z-20 transition`}
            ></div>
        </>
    );
};

export default PostVideo;
