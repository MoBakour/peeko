import useDataStore from "../store/dataStore";
import IconSend from "../icons/IconSend";

const CommentInput = ({ handleOnComment }) => {
    const { comment, setComment, commentEnabled, setCommentEnabled } =
        useDataStore();

    const handleCommentStroke = (e) => {
        const commentContent = e.target.value;

        if (commentContent.length > 0 && commentContent.length <= 300) {
            setCommentEnabled(true);
        } else {
            setCommentEnabled(false);
        }

        setComment(commentContent);
    };

    const handleCommentKeyDown = (e) => {
        if (e.key === "Enter") {
            handleOnComment(comment);
        }
    };

    return (
        <div className="flex justify-evenly items-center w-11/12 h-12 absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 rounded-lg overflow-hidden">
            <div className="absolute h-full w-full bg-gradient-to-r from-primary-1 to-primary-2 brightness-[10%] -z-10"></div>
            <input
                type="text"
                className="comment-input w-[calc(100%-60px)] bg-transparent outline-none border-none text-white relative z-10"
                placeholder="Type a comment..."
                value={comment}
                onChange={handleCommentStroke}
                onKeyDown={handleCommentKeyDown}
            />

            <button
                type="button"
                disabled={!commentEnabled}
                className="disabled:opacity-70 disabled:pointer-events-none relative z-10 text-3xl xhover:hover:opacity-70 transition-opacity cursor-pointer"
                onClick={(e) => handleOnComment(comment)}
            >
                <IconSend />
            </button>
        </div>
    );
};

export default CommentInput;
