// define error messages
const invalidKeyErrorMsg =
    "Invalid Key Error: Video data was not found with the provided key";
const invalidIdErrorMsg =
    "Invalid ID Error: User data was not found with the provided ID";
const invalidCommentOperationErrorMsg_DELETE =
    "Invalid Comment Operation Error: failed to delete comment. reason: comment not found";
const invalidFeedbackOperationErrorMsg_LIKE =
    "Invalid Feedback Operation Error: failed to like video post. reason: video was already liked";
const invalidFeedbackOperationErrorMsg_UNLIKE =
    "Invalid Feedback Operation Error: failed to unlike video post. reason: video post was not liked";
const invalidUsernameErrorMsg = "Username already used, try something else";

// export error messages
export {
    invalidKeyErrorMsg,
    invalidIdErrorMsg,
    invalidCommentOperationErrorMsg_DELETE,
    invalidFeedbackOperationErrorMsg_LIKE,
    invalidFeedbackOperationErrorMsg_UNLIKE,
    invalidUsernameErrorMsg,
};
