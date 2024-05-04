import { formatDistanceToNow } from "date-fns";
import { useEffect } from "react";
import { Link } from "react-router-dom";
import useAxios from "../hooks/useAxios";
import useDataStore from "../store/dataStore";
import useMiscStore from "../store/miscStore";
import useAuthStore from "../store/authStore";

import IconAccountCircleOutline from "../icons/IconAccountCircleOutline";

const Comment = ({ commentDocument }) => {
    const axios = useAxios();
    const { auth } = useAuthStore();

    const {
        comments,
        setComments,
        setCommentsCount,
        currentActiveDelete,
        setCurrentActiveDelete,
    } = useDataStore();

    const { confirmation, activateAlert } = useMiscStore();

    const handleContextMenu = (e) => {
        e.preventDefault();
        setCurrentActiveDelete(commentDocument._id);
    };

    const handleDeleteComment = async () => {
        setCurrentActiveDelete("");

        const approval = await confirmation(
            "Are you sure you want to delete your comment?"
        );
        if (!approval) return;

        axios
            .delete(`/comment/delete/${commentDocument._id}`)
            .then(({ data }) => {
                if (data.success) {
                    setComments(
                        comments.filter(
                            (comment) => comment._id !== commentDocument._id
                        )
                    );
                    setCommentsCount(data.newCommentsCount);
                    activateAlert("Comment deleted", "success");
                }
            })
            .catch((err) => {
                console.error(err);
                activateAlert("Failed to delete comment", "error");
            });
    };

    useEffect(() => {
        const clickHandler = (e) => {
            if (e.target.closest("#deleteCommentButton")) return;
            setCurrentActiveDelete("");
        };

        window.addEventListener("click", clickHandler);

        return () => {
            window.removeEventListener("click", clickHandler);
        };
    }, [setCurrentActiveDelete]);

    return (
        <div
            className="flex flex-col py-3 relative"
            onContextMenu={handleContextMenu}
            onDoubleClick={handleContextMenu}
        >
            <div className="top flex justify-center items-center w-fit gap-1">
                <Link
                    to={`/profile/${commentDocument.commentor.username}`}
                    className="flex justify-center items-center gap-1"
                >
                    <span className="text-2xl">
                        <IconAccountCircleOutline />
                    </span>
                    <p className="text-md font-semibold">
                        {commentDocument.commentor.username}
                    </p>
                </Link>
                <p className="text-sm text-fadingWhite pl-3">
                    {formatDistanceToNow(new Date(commentDocument.createdAt), {
                        addSuffix: true,
                    })}
                </p>
            </div>

            <p className="pl-3 pt-1">{commentDocument.comment}</p>

            <div
                id="deleteCommentButton"
                onClick={handleDeleteComment}
                className={`${
                    currentActiveDelete === commentDocument._id &&
                    auth?.userDocument._id === commentDocument.commentor._id
                        ? ""
                        : "opacity-0 pointer-events-none"
                } w-full h-full absolute flex justify-center items-center rounded-lg bg-[rgba(220,20,60,0.8)] select-none cursor-pointer`}
            >
                <p className="font-bold text-2xl">Delete Comment</p>
            </div>
        </div>
    );
};

export default Comment;
