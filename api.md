# API Definition & Usage

## Database Models

#### User Model

```js
UserObject = {
    _id: {
        type: ObjectId,
        unique: true,
        autoAssigned: true,
    },
    username: {
        type: String,
        required: true,
        maxLength: 24,
        trim: true,
        validationRegex: /^[a-zA-Z0-9_ ]+$/,
    },
    fingerprint: {
        type: String,
        required: true,
        trim: true,
    },
    createdAt: {
        type: Date,
        autoAssigned: true,
    },
    updatedAt: {
        type: Date,
        autoAssigned: true,
    },
};
```

#### Video Model

```js
VideoObject = {
    _id: {
        type: ObjectId,
        required: true,
        unique: true,
        autoAssigned: true,
    },
    uploaderId: {
        type: String,
        required: true,
        trim: true
    },
    uploaderUsername: {
        type: String,
        required: true,
        trim: true
    },
    videoKey: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    likes: {
        type: String[],
        default: []
    },
    commentsNumber: {
        type: Number,
        default: 0
    },
    createdAt: {
        type: Date,
        autoAssigned: true
    },
    updatedAt: {
        type: Date,
        autoAssigned: true
    }
};
```

#### Comment Model

```js
CommentObject = {
    _id: {
        type: ObjectId,
        required: true,
        unique: true,
        autoAssigned: true,
    },
    commentorId: {
        type: String,
        required: true,
        trim: true,
    },
    commentorUsername: {
        type: String,
        required: true,
        trim: true,
    },
    comment: {
        type: String,
        required: true,
        maxLength: 300,
        trim: true,
    },
    videoKey: {
        type: String,
        required: true,
        trim: true,
    },
    createdAt: {
        type: Date,
        autoAssigned: true,
    },
    updatedAt: {
        type: Date,
        autoAssigned: true,
    },
};
```

## User Endpoints

#### - [POST] /user/createAccount

This route creates a new user profile/account.

With the request body there must be attached a fingerprint to identify the device that was used to create the account. And a username for the user profile. The username must be unique accross the application and must pass a few validation requirements mentioned below.

About the fingerprint. An account is associated with the device, so if a user creates an account for the first time, it is to be attached and related to the client device for ever, and the fingerprint is a way to detect the relationship. If the app was uninstalled and then re-installed again, the fingerprint is used to detect the account. The only way to cut the relation between the account and the device is by deleting the account.

Note that a single device can hold multiple accounts, but a single account cannot be used on multiple devices.

About the token. When an account is created, a token is sent back from the server. This token must be stored in the client side, and on every action request, it should be attached to the request headers under the `Authorization` header in the following format: `Bearer {{ token }}`. This token will help identify the user and make sure he is authorized for the action.

Expected **_JSON Request Body_**:

-   `fingerprint` (string) a fingerprint
-   `username` (string) a username
    -   username max length of 24 characters
    -   username should only include letters, numbers, underscores, and spaces are allowed
    -   username must be unique

Expected Response JSON Objects:

-   Success:

    ```js
    {
        success: true,
        userDocument: UserObject, // a user object that contains user information
        token: String // a token to be stored in the client side
    }
    ```

-   Failure:
    ```js
    {
        success: false,
        error: String
    }
    ```

#### - [GET] /user/hasAccount<span style="color:darkred">?fingerprint=<span style="color:red">{{ fingerprint key }}</span></span>

This route checks if a user with the given fingerprint exists in the database.

Replace {{ fingerprint key }} with the stored user fingerprint key.

If an account was found associated with the given fingerprint, a response with `hasAccount` set to true will be returned, as well as an `accounts` array with the user account objects that fall under the givern fingerprint, and finally `tokens` array of objects, each object containing `userId` property for the account id, and `token` property with the token of that account. Otherwise, if no account was found under the given fingerprint, `hasAccount` will be set to false in the response object, and `accounts` & `tokens` will be an empty arrays.

Expected **_Query Parameters_**:

-   `fingerprint`: user account fingerprint

Expected Response JSON Objects:

-   Success:

    ```js
    {
        success: true,
        hasAccount: Boolean, // specifies whether the fingerprint has accounts associated with it
        accounts: UserObject[] // an array of accounts associated with the fingerprint
        tokens: TokenObject[] // an array of token objects of the following format: { userId: string, token: string }
    }
    ```

-   Failure:
    ```js
    {
        success: false,
        error: String
    }
    ```

#### - [DELETE] /user/deleteAccount<span style="color:darkred">?userId=<span style="color:red">{{ user id }}</span></span>

This route deletes an existing user profile/account.

A delete operation to the user account will be attempted. If succeeded, the deleted user object will be returned with the response, otherwise, a failure response will be sent.

Expected **_Query Parameters_**:

-   `userId`: user identification number

Expected Response JSON Objects:

-   Success:

    ```js
    {
        success: true,
        deletedUserDocument: UserObject // the deleted user object
    }
    ```

-   Failure:

    ```js
    {
        success: false,
        error: String
    }
    ```

## Video Endpoints

#### - [POST] /video/uploadVideo

This route uploads a video to the server, the response object contains the video object (information about the video) which includes the video key.

Expected **_JSON Request Body_**:

-   `uploaderId` (string) the user id of the uploader account
-   `uploaderUsername` (string) the username of the uploader account
-   `videoFile` (File) the posted video file

Expected Response JSON Objects:

-   Success:

    ```js
    {
        success: true,
        videoDocument: VideoObject // an object with the video information
    }
    ```

-   Failure:
    ```js
    {
        success: false,
        error: String
    }
    ```

#### - [GET] /video/download/videoFile<span style="color:darkred">?videoKey=<span style="color:red">{{ video key }}</span></span>

This route gets a video file from the server. (It gets the video itself only and not the video data).

In this route, no json response is going to be sent from the server, but a video file will be streamed down to the client from the server.

Expected **_Query Parameters_**:

-   `videoKey`: the video key to identify the video targeted for download

Expected **_Response_**:

-   Success:
    In case of a success. The response is a a readable video file stream to be displayed in the frontend.

-   Failure:
    ```js
    {
        success: false,
        error: String
    }
    ```

#### - [GET] /video/download/videoData<span style="color:darkred">?videoKey=<span style="color:red">{{ video key }}</span>&userId=<span style="color:red">{{ user id }}</span></span>

This route gets a video data from the server. (It gets the video data only and not the video itself).

The userId is required to decide whether the user has the video liked or not to decide whether the like button should appear as liked or unliked in the UI.

Expected **_Query Parameters_**:

-   `videoKey`: the video key to identify the video targeted for download
-   `userId`: the id of the user account that has sent the request

Expected Response JSON Objects:

-   Success:

    ```js
    {
        success: true,
        videoData: VideoObject // an object with the video information
        selfLikedVideo: Boolean // specifies whether the current user client has previously liked the video or not
    }
    ```

-   Failure:
    ```js
    {
        success: false,
        error: String
    }
    ```

#### - [POST] /video/getVideos

This route gets an array of video keys. Keys are selected randomly and previously viewed videos are excluded from the selection.

The number of video keys returned is decided by the `count` option passed in the request body, and if not passed, it defaults to 10.

Another option that can be passed in the request body is the `viewed` option, which is an array that contains keys to be excluded in the selection process. Previously watched videos by the client should be included in the viewed array for next requests so that the user does not view the same videos over and over again.

Expected **_JSON Request Body_**:

-   `count` (integer) (optional, default is 10)
-   `viewed` (string[]) an array of strings, each string is the key of a previously viewed video

Expected Response JSON Objects:

-   Success:

    ```js
    {
        success: true,
        videos: String[] // an array of video keys
    }
    ```

-   Failure:
    ```js
    {
        success: false,
        error: String
    }
    ```

#### - [DELETE] /video/deleteVideo<span style="color:darkred">?videoKey=<span style="color:red">{{ video key }}</span></span>

This route deletes a video with the provided key.

A delete operation will be attempted on the video. If the operation succeeds, a video document will be sent with the response, otherwise, a failure response will be sent.

Expected **_Query Parameters_**:

-   `videoKey`: the video key to the video data to target for delete action

Expected Response JSON Objects:

-   Success:

    ```js
    {
        success: true,
        error: VideoDocument // the video that was deleted
    }
    ```

-   Failure:
    ```js
    {
        success: false,
        error: String
    }
    ```

## Comment Endpoints

#### - [GET] /comment/getComments<span style="color:darkred">?videoKey=<span style="color:red">{{ video key }}</span></span>

This route gets all the comments of a specific video post.

If the video was found, all comments associated with it will be sent down to the client. Otherwise, a failure response will be sent.

Expected **_Query Parameters_**:

-   `videoKey`: the video key to get the comments associated with the video post

Expected Response JSON Objects:

-   Success:

    ```js
    {
        success: true,
        comments: CommentObject[] // an array of comment objects
    }
    ```

-   Failure:
    ```js
    {
        success: false,
        error: String
    }
    ```

#### - [POST] /comment/postComment

This route is to post a comment on a video.

If the video was found with the provided video key, a comment will be attached to it.

Expected **_JSON Request Body_**:

-   `commentorId` (string) the user id of the commentor
-   `comment` (string) the comment content
-   `videoKey` (string) the key to the video to attach the comment

Expected Response JSON Objects:

-   Success:

    ```js
    {
        success: true,
        commentDocument: CommentObject, // the posted comment object
        newCommentsNumber: Number // the new up-to-date number of comments after the new comment
    }
    ```

-   Failure:
    ```js
    {
        success: false,
        error: String
    }
    ```

#### - [DELETE] /comment/deleteComment<span style="color:darkred">?commentId=<span style="color:red">{{ comment id }}</span></span>

This route is to delete a comment from a video.

If a valid comment was found on a valid video, it will be deleted, otherwise, a failure response will be sent back.

Expected **_Query Parameters_**:

-   `commentId`: the id of the comment to be deleted

Expected Response JSON Objects:

-   Success:

    ```js
    {
        success: true,
        deletedCommentDocument: CommentObject // the deleted comment object
        newCommentsNumber: Number // the new up-to-date number of comments after the deleted comment
    }
    ```

-   Failure:
    ```js
    {
        success: false,
        error: String
    }
    ```

## Feedback Endpoints

#### - [PUT] /feedback/likeVideo

This route adds a new like to a video post.

If the post was not found, the process will be rejected.
If a like already exists on the post by the same user, the process will be rejected.

Expected **_JSON Request Body_**:

-   `userId` (string) the id of the user attempting the like action on the post
-   `videoKey` (string) the key of the video to add the like on

Expected Response JSON Objects:

-   Success:

    ```js
    {
        success: true,
        likesCount: Number // the new number of likes on the post (after the like action)
    }
    ```

-   Failure (Already Liked Post):

    ```js
    {
        success: false,
        likesCount: Number // the number of likes on the post (update not included since it did not happen)
        error: String<invalidFeedbackOperationErrorMsg_LIKE>
    }
    ```

-   Failure:
    ```js
    {
        success: false,
        error: String
    }
    ```

#### - [PUT] /feedback/unlikeVideo

This route removes a like from a video post.

If the post was not found, the process will be rejected.
If the post was not even liked, the process will be rejected.

Expected **_JSON Request Body_**:

-   `userId` (string) the id of the user attempting the like action on the post
-   `videoKey` (string) the key of the video to add the like on

Expected Response JSON Objects:

-   Success:

    ```js
    {
        success: true,
        likesCount: Number // the new number of likes on the post (after the unlike action)
    }
    ```

-   Failure (Already unliked Post):

    ```js
    {
        success: false,
        likesCount: Number // the number of likes on the post (update not included since it did not happen)
        error: String<invalidFeedbackOperationErrorMsg_UNLIKE>
    }
    ```

-   Failure:
    ```js
    {
        success: false,
        error: String
    }
    ```
