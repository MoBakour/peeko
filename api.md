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
        maxLength: 320,
        validationRegex: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    },
    password: {
        type: String,
        trim: true,
        required: false,
        minLength: 6,
        maxLength: 300,
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

## User Endpoints

#### - [POST] /user/register

This route requests creating a new user account.

A response with the userDocument and the token will be returned, the token should be stored on the client side. If the client was a web app, store the token in the cookies. If the client was a mobile app, store the token in the appropriate method and location, away, secured, and hidden from the user or any other third-party accessors.

After the account is created it needs to be activated with an activation code sent to the user email that was used for registration. No feature or route will be accessible by any unactivated account. Activation details will be discussed in /user/activateAccount endopint documentation section.

With the request body, a special field (`devActivation`) can be passed with two sub-fields, `password` and `autoActivate`. This field can be used by developers only for development and testing purposes. A password is supplied to verify that the option is being used by a developer. The `autoActivation` field takes a boolean which specifies if an activation is required for this account or not. If the field was set to true, then no activation code will be required nor sent to the user email. But if the field was set to false, then the activation code will be required and sent to the user email, and also returned with the registration request under `activationCode` field for the developer.

Expected **_JSON Request Body_**:

-   `username` (string) a new username of the account, will be visible by other users.
    -   Must be unique across the app
    -   Maximum length is 24 characters
    -   Must not start or end with a space character
    -   Must only include letters, numbers, underscores, and spaces
-   `email` (string) the email address of the user
    -   Must be unique across the app
    -   Maximum length is 320 characters
-   `password` (string) a new user account password
    -   Minimum length is 6 characters
    -   Maximum length is 300 characters
    -   Must not start or end with a space character
-   `client` (string) the client that the user is using
    -   Must be one of two: "web" or "mobile"
    -   Case insensitive
-   `deviceInfo` (object) an optional object that contains device information, all fields are optional and can be omitted. It follows the following schema:
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
-   `devActivation` (object) an optional object (only for developers) It follows the following schema:
    ```js
    {
        password: String,
        autoActivate: Boolean
    }
    ```

Expected Response JSON Objects:

-   Success:

    ```js
    {
        success: true,
        userDocument: UserDocument, // an object with the user information
    }
    ```

-   Success (mobile):

    ```js
    {
        success: true,
        userDocument: UserDocument, // an object with the user information
        token: string // (only for mobile) an authorization token to be stored at the mobile client
    }
    ```

-   Success (dev autoActivate: false):

    ```js
    {
        success: true,
        userDocument: UserDocument, // an object with the user information
        activationCode: String
    }
    ```

-   Failure:
    ```js
    {
        success: false,
        error: String
    }
    ```

#### - [POST] /user/signIn

This route requests a new token to be returned for mobile clients to store it, or stored in cookies for web clients.
The token can be used to send authenticated requests to the API.

Expected **_JSON Request Body_**:

-   `credential` (string) the username or email of the user account
-   `password` (string) the password of the user account
-   `client` (string) the client that the user is using
    -   Must be one of two: "web" or "mobile"
    -   Case insensitive

Expected Response JSON Objects:

-   Success:

    ```js
    {
        success: true,
        userDocument: UserDocument, // an object with the user information
    }
    ```

-   Success (mobile):

    ```js
    {
        success: true,
        userDocument: UserDocument, // an object with the user information
        token: string // (only for mobile) an authorization token to be stored at the mobile client
    }
    ```

-   Failure:
    ```js
    {
        success: false,
        error: String
    }
    ```

#### - [POST] /user/signOut

A route requests signing out of the user account. This route is only for web clients, where the server handles removing the token from the user cookies. Mobile clients should handle sign out operations on the client-side, where they delete the token from storage.

Expected **_JSON Request Body_**:

-   `client` (string) the client that the user is using
    -   Must be one of two: "web" or "mobile"
    -   Case insensitive

Expected Response JSON Objects:

-   Success:

    ```js
    {
        success: true;
    }
    ```

-   Failure:
    ```js
    {
        success: false,
        error: String
    }
    ```

#### - [PUT] /user/activateAccount

This route requests the activation of a new unactivated account.

When a new account is created with /user/register. It is set to be unactivated. Activation code will be sent ot the user email. Activation should be done within 10 minutes after registering. If the user fails to activate the account in 10 minutes, it will be deleted. The user is given a maximum of 5 activation attempts. If all attempts were used unsuccessfully, then the account will be blocked from activation for 24 hours, and the username and email address of the account will be blocked from registering for 24 hours as well.

Expected **_JSON Request Body_**:

-   `activationCode` (string) the account activation code, sent to user's email

Expected Response JSON Objects:

-   Success:

    ```js
    {
        success: true,
    }
    ```

-   Failure (Invalid Code):

    ```js
    {
        success: false,
        error: String,
        attemptsLeft: Number
    }
    ```

-   Failure:

    ```js
    {
        success: false,
        error: String
    }
    ```

#### - [DELETE] /user/deleteAccount

This route deletes an existing user profile/account.

A delete operation to the user account will be attempted. If succeeded, the deleted user object will be returned with the response, otherwise, a failure response will be sent.

Expected Response JSON Objects:

-   Success:

    ```js
    {
        success: true,
        deletedUserDocument: UserDocument // the deleted user document
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
Being registered into the app with a user account and having the authorization token attached to the request headers (mobile client) or the cookies (web client) is sufficient.

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
    -   File must be of video mimetype
    -   Max video file size is 100 megabytes
    -   Max video duration is 5 minutes

Expected Response JSON Objects:

-   Success:

    ```js
    {
        success: true,
        videoDocument: VideoDocument // an object with the video information
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
        videoDocument: VideoDocument // an object with the video information
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
-   `viewed` (string[]) (optional, default is []) an array of strings, each string is the key of a previously viewed video

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
        deletedVideoDocument: VideoDocument // the video document that was deleted
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
