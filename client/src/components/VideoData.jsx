import { useEffect } from "react";
import useAxios from "../hooks/useAxios";

import Comment from "./Comment";
import CommentInput from "./CommentInput";
import useDataStore from "../store/dataStore";
import VideoStamps from "./VideoStamps";
import VideoActions from "./VideoActions";
import useAuthStore from "../store/authStore";
import useMiscStore from "../store/miscStore";
import { useSwipeable } from "react-swipeable";
import IconBxCommentError from "../icons/IconBxCommentError";

const VideoData = ({ videoKey, mobileComments }) => {
    const axios = useAxios();
    const { auth, authorized } = useAuthStore();
    const { activateAlert } = useMiscStore();
    const {
        setDataIsLoading,
        showComments,
        setUploaderId,
        setUploaderUsername,
        setTimestamp,
        setLikesCount,
        setCommentsCount,
        setLiked,
        comments,
        setComments,
        pushComment,
        commentEnabled,
        setCommentEnabled,
        setComment,
        activeMobileComments,
        setActiveMobileComments,
    } = useDataStore();

    // onComment state change
    const handleOnComment = (comment) => {
        if (!commentEnabled) return;
        setCommentEnabled(false);

        axios
            .post(`/comment/post`, { videoKey, comment })
            .then(({ data }) => {
                if (data.success) {
                    pushComment(data.commentDocument);
                    setCommentsCount(data.newCommentsCount);
                    setComment("");
                    setCommentEnabled(false);
                }
            })
            .catch((err) => {
                console.error(err);
                activateAlert("Failed to post comment", "error");
            });
    };

    // swipe handler
    const swipeHandler = useSwipeable({
        onSwipedRight: () => {
            if (!mobileComments) return;
            setActiveMobileComments(false);
        },
        preventScrollOnSwipe: true,
        trackMouse: true,
        trackTouch: true,
    });

    // fetch video data
    useEffect(() => {
        const requests = [
            axios.get(`/video/get/${videoKey}`),
            axios.get(`/comment/getComments/${videoKey}`),
        ];

        Promise.all(requests)
            .then((responses) => {
                const { data: videoData } = responses[0];
                const { data: commentsData } = responses[1];

                if (videoData.success) {
                    setUploaderId(videoData.videoDocument.uploader._id);
                    setUploaderUsername(
                        videoData.videoDocument.uploader.username
                    );
                    setTimestamp(videoData.videoDocument.createdAt);
                    setLikesCount(videoData.videoDocument.likesCount);
                    setCommentsCount(videoData.videoDocument.commentsCount);
                    setLiked(videoData.isLiked);
                }

                if (commentsData.success) {
                    setComments(commentsData.commentDocuments);
                }
            })
            .catch((err) => {
                console.error(err);
            })
            .finally(() => {
                setDataIsLoading(false);
            });
    }, [
        auth,
        axios,
        videoKey,
        setUploaderId,
        setUploaderUsername,
        setTimestamp,
        setLikesCount,
        setCommentsCount,
        setLiked,
        setComments,
        setDataIsLoading,
    ]);

    return (
        <div
            className={`max-w-[500px] w-[100%] h-[100svh] fixed right-0 transition-transform ${
                mobileComments && !activeMobileComments
                    ? "translate-x-full"
                    : ""
            }`}
        >
            <div className="w-full h-full bg-gradient-to-br from-primary-1 to-primary-2 absolute brightness-50 -z-10"></div>

            <div className="w-full h-full p-3 flex flex-col justify-start relative z-10">
                {!mobileComments && (
                    <div className="flex justify-between items-center h-[100px] overflow-x-auto comments-top">
                        <VideoStamps viewMode="data-mode" />

                        <VideoActions
                            videoKey={videoKey}
                            viewMode="horizontal"
                        />
                    </div>
                )}

                <div
                    className={`bg-[rgba(13,13,13,0.4)] ${
                        mobileComments
                            ? "h-[calc(100%-24px)]"
                            : "h-[calc(100%-124px)]"
                    } rounded-xl p-2 relative`}
                >
                    <div
                        className="overflow-auto h-full pr-1 pb-8"
                        {...swipeHandler}
                    >
                        {comments.length > 0 && showComments ? (
                            comments.map((commentDocument) => (
                                <Comment
                                    key={commentDocument._id}
                                    commentDocument={commentDocument}
                                />
                            ))
                        ) : (
                            <div className="flex flex-col items-center relative top-1/2 -translate-y-1/2 opacity-50 select-none">
                                <span className="text-6xl">
                                    <IconBxCommentError />
                                </span>
                                <p className="text-2xl">
                                    Be the first to comment
                                </p>
                            </div>
                        )}
                    </div>

                    {authorized && (
                        <CommentInput handleOnComment={handleOnComment} />
                    )}
                </div>
            </div>
        </div>
    );
};

export default VideoData;
