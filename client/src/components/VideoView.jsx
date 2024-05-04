import { useEffect, useCallback } from "react";
import { isMobile } from "react-device-detect";
import { useSwipeable } from "react-swipeable";
import { useSwipe } from "../hooks/useSwipe";

import RangeInput from "./RangeInput";
import PlaceholderVideo from "../assets/placeholder.MOV";

import useViewStore from "../store/viewStore";
import useMiscStore from "../store/miscStore";
import useDataStore from "../store/dataStore";
import UserControls from "./UserControls";
import VideoControls from "./VideoControls";
import VideoStamps from "./VideoStamps";
import IconLoader2 from "../icons/IconLoader2";
import IconPlay from "../icons/IconPlay";

const VideoView = ({ videoKey, video, mobileComments, setMobileComments }) => {
    // hooks
    const {
        swipe,
        swipeDisabled,
        setSwipeDisabled,
        prevSwipeDisabled,
        nextSwipeDisabled,
    } = useSwipe();

    const {
        duration,
        setDuration,
        currentTime,
        setCurrentTime,
        muted,
        toggleVideo,
        isPlaying,
        videoIsLoading,
        setVideoIsLoading,
    } = useViewStore();

    const { setShowComments } = useDataStore();
    const { activateAlert } = useMiscStore();

    const seek = useCallback(
        (direction) => {
            switch (direction) {
                case "right": {
                    video.current.currentTime += 5;
                    break;
                }
                case "left": {
                    video.current.currentTime -= 5;
                    break;
                }
                default:
                    throw Error("Unrecognized direction");
            }
        },
        [video]
    );

    // handlers
    const handleLoadedMetaData = () => {
        setDuration(video.current.duration);
        setShowComments(true);
    };

    const handleLoadedData = () => {
        setSwipeDisabled(false);
        setVideoIsLoading(false);
    };

    const handleTimeUpdate = () => {
        setCurrentTime(video.current.currentTime);
    };

    const handleSeekBarChange = (e) => {
        const seekTime = (video.current.duration / 100) * e.target.value;
        if (isFinite(seekTime)) {
            video.current.currentTime = seekTime;
        }
    };

    const handleVideoError = (e) => {
        console.error(e);
        activateAlert("Failed to load video", "error");
    };

    const handleOnKeyDown = useCallback(
        (e) => {
            switch (e.key) {
                case " ": {
                    if (
                        document.activeElement.classList.contains(
                            "comment-input"
                        )
                    )
                        break;
                    toggleVideo("main", video);
                    break;
                }
                case "ArrowRight": {
                    seek("right");
                    break;
                }
                case "ArrowLeft": {
                    seek("left");
                    break;
                }
                case "ArrowUp": {
                    swipe("prev");
                    break;
                }
                case "ArrowDown": {
                    swipe("next");
                    break;
                }
                default:
            }
        },
        [swipe, seek, toggleVideo, video]
    );

    const setCommentsMode = useCallback(() => {
        const screenWidth = window.innerWidth;
        const videoWidth = video.current.clientWidth;
        setMobileComments(videoWidth + 500 > screenWidth);
    }, [video, setMobileComments]);

    const swipeHandler = useSwipeable({
        onSwipedDown: () => {
            if (swipeDisabled || prevSwipeDisabled) return;
            swipe("prev");
        },
        onSwipedUp: () => {
            if (swipeDisabled || nextSwipeDisabled) return;
            swipe("next");
        },
        onTap: ({ event }) => {
            if (event.target.id !== "seekBar") {
                toggleVideo("main", video);
                event.preventDefault();
            }
        },
        trackTouch: isMobile,
        trackMouse: !isMobile,
        preventScrollOnSwipe: true,
    });

    // set event listeners
    useEffect(() => {
        window.addEventListener("keydown", handleOnKeyDown);
        window.addEventListener("resize", setCommentsMode);
        setCommentsMode();

        return () => {
            window.removeEventListener("keydown", handleOnKeyDown);
            window.removeEventListener("resize", setCommentsMode);
        };
    }, [handleOnKeyDown, setCommentsMode]);

    return (
        <div
            className={`${
                mobileComments ? "w-screen" : "w-[calc(100%-500px)]"
            } h-[100svh] fixed left-0 overflow-hidden`}
        >
            {/* blurry background thumbnail */}
            <img
                src={`${process.env.REACT_APP_API_URL}/video/streamThumbnail/${videoKey}`}
                alt="Thumbnail"
                className="w-full blur-xl absolute top-1/2 -translate-y-1/2 brightness-[40%]"
            />

            <div
                className="aspect-[9/16] h-full absolute left-1/2 -translate-x-1/2"
                {...swipeHandler}
            >
                {/* video element */}
                <video
                    className="h-full w-full"
                    src={
                        videoKey === "undefined"
                            ? PlaceholderVideo
                            : `${process.env.REACT_APP_API_URL}/video/streamVideo/${videoKey}`
                    }
                    ref={video}
                    onLoadedMetadata={handleLoadedMetaData}
                    onTimeUpdate={handleTimeUpdate}
                    onError={handleVideoError}
                    onLoadedData={handleLoadedData}
                    autoPlay={isPlaying}
                    muted={muted}
                    loop
                    playsInline
                >
                    Your browser does not support this video
                </video>

                {videoIsLoading ? (
                    // loading spinnner
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                        <span className="drop-shadow-3xl select-none text-8xl">
                            <IconLoader2 className="animate-spin" />
                        </span>
                    </div>
                ) : (
                    // play button
                    <span
                        className={`${
                            isPlaying ? "opacity-0 pointer-events-none" : ""
                        } drop-shadow-3xl absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 select-none text-8xl transition`}
                    >
                        <IconPlay />
                    </span>
                )}

                {/* shadow for mobile views */}
                {mobileComments && (
                    <>
                        <div className="bg-gradient-to-b from-slate-800 to-transparent w-full h-16 absolute top-0"></div>
                        <div className="bg-gradient-to-t from-slate-800 to-transparent w-full h-16 absolute bottom-0"></div>
                    </>
                )}

                {/* seek bar */}
                <RangeInput
                    onChangeFunction={handleSeekBarChange}
                    currentTime={currentTime}
                    duration={duration}
                />
            </div>

            <VideoControls
                videoKey={videoKey}
                mobileComments={mobileComments}
                swipe={swipe}
                swipeDisabled={swipeDisabled}
                prevSwipeDisabled={prevSwipeDisabled}
                nextSwipeDisabled={nextSwipeDisabled}
            />

            <UserControls video={video} />

            {mobileComments && <VideoStamps viewMode="view-mode" />}
        </div>
    );
};

export default VideoView;
