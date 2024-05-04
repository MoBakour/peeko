import { create } from "zustand";
import useMiscStore from "./miscStore";

const useDataStore = create((set, get) => ({
    dataIsLoading: true,
    setDataIsLoading: (newDataIsLoading) => {
        set({ dataIsLoading: newDataIsLoading });
    },

    uploaderId: "",
    setUploaderId: (newUploaderId) => {
        set({ uploaderId: newUploaderId });
    },

    uploaderUsername: "",
    setUploaderUsername: (newUploaderUsername) => {
        set({ uploaderUsername: newUploaderUsername });
    },

    timestamp: new Date(),
    setTimestamp: (newTimestamp) => {
        set({ timestamp: newTimestamp });
    },

    likesCount: 0,
    setLikesCount: (newLikesCount) => {
        set({ likesCount: newLikesCount });
    },

    liked: false,
    setLiked: (newLiked) => {
        set({ liked: newLiked });
    },

    feedbackDisabled: false,
    setFeedbackDisabled: (newFeedbackDisabled) => {
        set({ feedbackDisabled: newFeedbackDisabled });
    },
    feedback: (videoKey, axios) => {
        if (get().feedbackDisabled) return;
        get().setFeedbackDisabled(true);

        // instantaneously update the like state
        set((state) => ({
            liked: !state.liked,
            likesCount: state.likesCount + (state.liked ? -1 : 1),
        }));

        axios
            .put(`/feedback/toggle/${videoKey}`)
            .catch((err) => {
                console.error(err);

                // if failed to perform feedback operation, undo like state change
                set((state) => ({
                    liked: !state.liked,
                    likesCount: state.likesCount + (state.liked ? -1 : 1),
                }));

                // alert user of failure
                useMiscStore
                    .getState()
                    .activateAlert(
                        `Failed to ${get().liked ? "unlike" : "like"} video`,
                        "error"
                    );
            })
            .finally(() => {
                get().setFeedbackDisabled(false);
            });
    },

    share: (videoKey) => {
        navigator.clipboard
            .writeText(`${window.location.host}/video/${videoKey}`)
            .then(() => {
                useMiscStore.getState().activateAlert("Copied Link", "success");
            })
            .catch((err) => {
                console.error(err);
            });
    },

    commentsCount: 0,
    setCommentsCount: (newCommentsCount) => {
        set({ commentsCount: newCommentsCount });
    },

    comments: [],
    setComments: (newComments) => {
        set({ comments: newComments });
    },
    pushComment: (newComment) => {
        set((state) => ({ comments: [newComment, ...state.comments] }));
    },

    comment: "",
    setComment: (newComment) => {
        set({ comment: newComment });
    },

    showComments: true,
    setShowComments: (newShowComments) => {
        set({ showComments: newShowComments });
    },

    commentEnabled: false,
    setCommentEnabled: (newCommentEnabled) => {
        set({ commentEnabled: newCommentEnabled });
    },

    /**
     * for some reaso this is causing `Maximum update depth exceeded` error
     * current safe alternative is with useState on Video.jsx then passed through props
     */
    // mobileComments: true,
    // setMobileComments: (newMobileComments) => {
    //     set({ mobileComments: newMobileComments });
    // },

    activeMobileComments: false,
    setActiveMobileComments: (newActiveMobileComments) => {
        set({ activeMobileComments: newActiveMobileComments });
    },

    currentActiveDelete: "",
    setCurrentActiveDelete: (newCurrentActiveDelete) => {
        set({ currentActiveDelete: newCurrentActiveDelete });
    },
}));

export default useDataStore;
