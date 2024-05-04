import { create } from "zustand";
import useMiscStore from "./miscStore";
import useDataStore from "./dataStore";

const useViewStore = create((set, get) => ({
    // swipe mode
    swipeMode: "explore",
    setSwipeMode: (newSwipeMode) => {
        set({ swipeMode: newSwipeMode });
    },

    // main
    isPlaying: true,
    setIsPlaying: (newIsPlaying) => {
        set({ isPlaying: newIsPlaying });
    },

    videoIsLoading: true,
    setVideoIsLoading: (newVideoIsLoading) => {
        set({ videoIsLoading: newVideoIsLoading });
    },

    muted: true,
    toggleMuted: () => {
        set((state) => ({ muted: !state.muted }));
    },

    duration: 0,
    setDuration: (newDuration) => {
        set({ duration: newDuration });
    },

    currentTime: 0,
    setCurrentTime: (newCurrentTime) => {
        set({ currentTime: newCurrentTime });
    },

    deleteVideoEnabled: true,
    setDeleteVideoEnabled: (newDeleteVideoEnabled) => {
        set({ deleteVideoEnabled: newDeleteVideoEnabled });
    },

    // preview
    previewIsPlaying: false,
    setPreviewIsPlaying: (newPreviewIsPlaying) => {
        set({ previewIsPlaying: newPreviewIsPlaying });
    },

    previewSrc: "",
    setPreviewSrc: (newPreviewSrc) => {
        set({ previewSrc: newPreviewSrc });
    },

    videoFile: null,
    setVideoFile: (newVideoFile) => {
        set({ videoFile: newVideoFile });
    },

    allowSubmit: false,
    setAllowSubmit: (newAllowSubmit) => {
        set({ allowSubmit: newAllowSubmit });
    },

    isPosting: false,
    setIsPosting: (newIsPosting) => {
        set({ isPosting: newIsPosting });
    },

    previewDuration: 0,
    setPreviewDuration: (newPreviewDuration) => {
        set({ previewDuration: newPreviewDuration });
    },

    previewCurrentTime: 0,
    setPreviewCurrentTime: (newPreviewCurrentTime) => {
        set({ previewCurrentTime: newPreviewCurrentTime });
    },

    // common
    toggleVideo: (targetName, targetRef) => {
        const currentState = get();
        let targetSetFunction;

        if (targetName === "main") {
            targetSetFunction = currentState.setIsPlaying;
        } else if (targetName === "preview") {
            targetSetFunction = currentState.setPreviewIsPlaying;
        } else {
            throw Error("Target must be main or preview");
        }

        if (!targetRef.current.paused) {
            targetRef.current.pause();
            targetSetFunction(false);
        } else {
            targetRef.current.play();
            targetSetFunction(true);
        }
    },

    // modal functions
    openModal: (videoRef) => {
        const { isPlaying, toggleVideo } = get();
        const { setActiveMobileComments } = useDataStore.getState();
        const { setModalState } = useMiscStore.getState();

        setModalState(true);
        setActiveMobileComments(false);

        if (isPlaying) {
            toggleVideo("main", videoRef);
        }
    },
    closeModal: (videoRef) => {
        const { previewIsPlaying, toggleVideo } = get();
        const { setModalState } = useMiscStore.getState();

        setModalState(false);

        set({
            previewSrc: null,
            videoFile: null,
            allowSubmit: false,
            previewDuration: 0,
            previewCurrentTime: 0,
        });

        if (previewIsPlaying) {
            toggleVideo("preview", videoRef);
        }
    },
}));

export default useViewStore;
