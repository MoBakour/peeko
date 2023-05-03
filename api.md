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
        unique: true,
        required: true,
        maxLength: 24,
        trim: true,
        validationRegex: /^[a-zA-Z0-9_ ]+$/,
    },
    email: {
        type: String,
        trim: true,
        required: false,
    },
    password: {
        type: String,
        trim: true,
        required: false,
    },
    deviceId: {
        type: String,
        required: true,
        trim: true,
    },
    deviceInfo: {
        fingerprint: String,
        brand: String,
        model: String,
        osVersion: String,
        ipAddress: String,
        abi: {
            abiArc: String,
            supportedAbis: String,
        },
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
    commentsCount: {
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

## Mobile User Endpoints

#### - [POST] /mobile/user/signup

This route creates a new user profile/account on mobile client only.

With the request body there must be attached a deviceId to identify the device that was used to create the account. And a username for the user profile. The username must be unique accross the application and must pass a few validation requirements mentioned below.

About the deviceId. An account is associated with the device, so if a user creates an account for the first time, it is to be attached and related to the client device for ever, and the deviceId is a way to detect the relationship. If the app was uninstalled and then re-installed again, the deviceId is used to detect the account. The only way to cut the relation between the account and the device is by deleting the account.

Note that a single device can hold multiple accounts, but a single account cannot be used on multiple devices.

About the token. When an account is created, a token is sent back from the server. This token must be stored in the client side, and on every action request, it should be attached to the request headers under the `Authorization` header in the following format: `Bearer {{ token }}`. This token will help identify the user and make sure he is authorized for the action.

Expected **_JSON Request Body_**:

-   `deviceId` (string) the client device identification string
-   `username` (string) a username
    -   username max length of 24 characters
    -   username should only include letters, numbers, underscores, and spaces are allowed
    -   username must be unique
-   `deviceInfo` (object) has the following schema (not required, not all `deviceInfo` fields required):
    ```js
    {
        fingerprint: String,
        brand: String,
        model: String,
        osVersion: String,
        abi: {
            abiArc: String,
            supportedAbis: String,
        },
    }
    ```

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

#### - [GET] /mobile/user/hasAccount/<span style="color:red">{{ deviceId }}</span>

This route checks if a user with the given deviceId exists in the database.

Replace {{ deviceId }} with the stored user deviceId key.

If an account was found associated with the given deviceId, a response with `hasAccount` set to true will be returned, as well as an `accounts` array with the user account objects that fall under the given deviceId, and finally `tokens` array of objects, each object containing `userId` property for the account id, and `token` property with the token of that account. Otherwise, if no account was found under the given deviceId, `hasAccount` will be set to false in the response object, and `accounts` & `tokens` will be an empty arrays.

Expected **_URL Parameters_**

-   `deviceId`: user account deviceId

Expected Response JSON Objects:

-   Success:

    ```js
    {
        success: true,
        hasAccount: Boolean, // specifies whether the deviceId has accounts associated with it
        accounts: UserObject[], // an array of accounts associated with the deviceId
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

## Web User Endpoints

#### - [POST] /web/user/signup

    (no details)

#### - [POST] /web/user/login

    (no details)

#### - [POST] /web/user/logout

    (no details)

## User Endpoints

#### - [DELETE] /user/deleteAccount

This route deletes an existing user profile/account.

A delete operation to the user account will be attempted. If succeeded, the deleted user object will be returned with the response, otherwise, a failure response will be sent.

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

#### - [PUT] /user/updateIpAddress

This route pings the server to update the IP address of the current user.
No params or request body is expected for this request, as it just pings the server. The server handles getting the IP address and updating it in the database.
Being signed into the app with a user account and having the authorization token attached to the request headers (mobile client) or the cookies (web client) is sufficient.

Expected Response JSON Objects:

-   Success:

    ```js
    {
        success: true,
        ipAddress: String
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

-   `videoFile` (File) the posted video file
    -   Max video file size is 300 megabytes
    -   Max video duration is 5 minutes

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

#### - [GET] /video/streamVideo/<span style="color:red">{{ videoKey }}</span>

This route gets a video file from the server. (It gets the video itself only and not the video data).

In this route, no json response is going to be sent from the server, but a video file will be streamed down to the client from the server.

Expected **_URL Parameters_**

-   `videoKey`: the video key to identify the video targeted for streaming

Expected **_Response_**:

-   Success:
    In case of a success. The response is a a readable video file stream to be displayed in the client-side.

-   Failure:
    ```js
    {
        success: false,
        error: String
    }
    ```

#### - [GET] /getVideo/<span style="color:red">{{ videoKey }}</span>

This route gets a single video information. Video key should be supplied in the request URL parameters to identify the video to get.

Expected **_URL Parameters_**

-   `videoKey`: the video key to identify the video targeted for getting

Expected Response JSON Objects:

-   Success:

    ```js
    {
        success: true,
        videoDocument: VideoDocument
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

This route gets an array of video documents. Video documents are selected randomly and previously viewed videos are excluded from the selection.

The number of video documents returned is decided by the `count` option passed in the request body, and if not passed, it defaults to 10.

Another option that can be passed in the request body is the `viewed` option, which is an array that contains keys to be excluded in the selection process. Previously watched videos by the client should be included in the viewed array for next requests so that the user does not get the same videos over and over again.

Expected **_JSON Request Body_**:

-   `count` (integer) (optional, default is 10)
-   `viewed` (string[]) an array of strings, each string is the key of a previously viewed video

Expected Response JSON Objects:

-   Success:

    ```js
    {
        success: true,
        videoDocuments: VideoDocument[] // an array of video documents
    }
    ```

-   Failure:
    ```js
    {
        success: false,
        error: String
    }
    ```

#### - [DELETE] /video/deleteVideo/<span style="color:red">{{ videoKey }}</span>

This route deletes a video with the provided key.

A delete operation will be attempted on the video. If the operation succeeds, a video document will be sent with the response, otherwise, a failure response will be sent.

Expected **_URL Parameters_**

-   `videoKey`: the video key of the video targeted for delete operation

Expected Response JSON Objects:

-   Success:

    ```js
    {
        success: true,
        deletedVideoDocument: VideoDocument // the video that was deleted
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

#### - [GET] /comment/getComments/<span style="color:red">{{ videoKey }}</span>

This route gets all the comments of a specific video post.

If the video was found, all comments associated with it will be sent down to the client. Otherwise, a failure response will be sent.

Expected **_Query Parameters_**:

-   `videoKey`: the video key to get the comments associated with the video post

Expected Response JSON Objects:

-   Success:

    ```js
    {
        success: true,
        commentDocuments: CommentDocument[] // an array of comment documents
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

-   `videoKey` (string) the key to the video to attach the comment
-   `comment` (string) the comment content
    -   comment max length of 300 characters

Expected Response JSON Objects:

-   Success:

    ```js
    {
        success: true,
        commentDocument: CommentDocument, // the posted comment object
        newCommentsCount: Number // the new up-to-date number of comments after the new comment
    }
    ```

-   Failure:
    ```js
    {
        success: false,
        error: String
    }
    ```

#### - [DELETE] /comment/deleteComment/<span style="color:red">{{ commentId }}</span>

This route is to delete a comment from a video.

If a valid comment was found on a valid video, it will be deleted, otherwise, a failure response will be sent back.

Expected **_Query Parameters_**:

-   `commentId`: the id of the comment to be deleted

Expected Response JSON Objects:

-   Success:

    ```js
    {
        success: true,
        deletedCommentDocument: CommentDocument, // the deleted comment object
        newCommentsCount: Number // the new up-to-date number of comments after the deleted comment
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

#### - [PUT] /feedback/toggleLike

This route toggles like on a video post.

If a post was not found the process will be rejected.
If the post was already liked by the user, the post will be unliked.
If the post was not liked by the user, the post will be liked.

Expected **_JSON Request Body_**:

-   `videoKey` (string) the key of the video to toggle the like on

Expected Response JSON Objects:

-   Success:

    ```js
    {
        success: true,
        likesCount: Number, // the new number of likes on the post (after the toggle action)
        operation: String // either "LIKE" or "UNLIKE"
    }
    ```

-   Failure:

    ```js
    {
        success: false,
        error: String
    }
    ```

#### - [PUT] /feedback/likeVideo

This route adds a new like to a video post.

If the post was not found, the process will be rejected.
If a like already exists on the post by the same user, the process will be rejected.

Expected **_JSON Request Body_**:

-   `videoKey` (string) the key of the video to add the like on

Expected Response JSON Objects:

-   Success:

    ```js
    {
        success: true,
        likesCount: Number, // the new number of likes on the post (after the like action)
        operation: "LIKE"
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

-   `videoKey` (string) the key of the video to add the like on

Expected Response JSON Objects:

-   Success:

    ```js
    {
        success: true,
        likesCount: Number, // the new number of likes on the post (after the unlike action)
        operation: "UNLIKE"
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
