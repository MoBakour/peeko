# API Defintion & Usage

## Data Models

#### User Model

```ts
{
    _id: String,
    username: String,
    email: String,
    deviceInfo: {
        fingerprint: String,
        brand: String,
        model: String,
        osVersion: String,
        ipAddress: String,
        abi: {
            abiArc: String,
            supportedAbis: String
        }
    },
    activation: {
        activated: Boolean,
        attemptsLeft: Number,
        blocked: Boolean
    },
    createdAt: Date,
    updatedAt: Date
}
```

#### Video Model

```ts
{
    _id: String,
    uploader: {
        _id: String,
        username: String
    },
    videoKey: String,
    likesCount: Number,
    viewsCount: Number,
    commentsCount: Number,
    createdAt: Date,
    updatedAt: Date
}
```

#### Comment Model

```ts
{
    _id: String,
    commentor: {
        _id: String,
        username: String
    },
    comment: String,
    videoKey: String,
    createdAt: Date,
    updatedAt: Date
}
```

## Endpoints Map

##### User Endpoints

[POST] /user/register<br />[POST] /user/signIn<br />[GET] /user/get/:username<br />[PUT] /user/activate<br />[PUT] /user/updateIpAddress<br />[DELETE] /user/delete

[POST] /video/upload<br />[GET] /video/streamVideo/:key<br />[GET] /video/streamThumbnail/:key<br />[GET] /video/get/:key<br />[GET] /video/getVideos/:count?<br />[DELETE] /video/delete/:key

[POST] /comment/post<br />[GET] /comment/getComments/:key<br />[DELETE] /comment/delete/:id

[PUT] /feedback/toggle/:key<br />[PUT] /feedback/like/:key<br />[PUT] /feedback/unlike/:key

## User Endpoints

#### - [POST] &emsp; /user/register

##### About the token

After successful registration, in the response body there will be provided a `token` value. This token should be stored in the client-side and then provided on every future request to authenticate the user

In future authenticated requests, the token must be provided in the request's `Authorization` header as a string in the following form `Bearer {token}`

##### About the user activation

After successful registration, the user account will not yet be activated. An unactivated user will still not be able to perform user actions such as commenting, liking, or posting videos

Upon successful registration, the user will receive the activation code via his email that he provided during the registration process, using this activation code, user will be able to activate their account through the /user/activate endpoint

More about the activation process found in /user/activation description

##### About the devActivation Option

In the registration request body, an optional field is the `devActivation` field. This field can be used by the developer to speed up testing and development process

To use this feature, a dev password is required in `devActivation.password`

The `devActivation.autoActivate` option can be set to true or false

-   If set to true, then the created account will be automatically activated without the need of a activation code, an activation email will not be sent to the user email address
-   If set to false, then the response object will contain an extra `activationCode` field which will contain the activation code, but an email will still be sent to the user email address

*   Request body

    ```ts
    {
        username: String,
        email: String,
        password: String,
        deviceInfo?: Object,
        devActivation?: {
            password: String,
            autoActivate: Boolean
        }
    }
    ```

*   Response body

    -   Success <code: 200>

        ```ts
        {
            success: true,
            userDocument: UserDocument,
            token: String
        }
        ```

    -   Failure <code: 400>

        ```ts
        {
            success: false,
            error: String
        }
        ```

#### - [POST] &emsp; /user/signIn

In the request body there must be a `credential` field provided, this credential field must represent the username or the email of the user

-   Request body

    ```ts
    {
        credential: String,
        password: String
    }
    ```

-   Response body

    -   Success <code: 200>

        ```ts
        {
            success: true,
            userDocument: UserDocument,
            token: String
        }
        ```

    -   Failure <code: 400>

        ```ts
        {
            success: false,
            error: String
        }
        ```

#### - [GET] &emsp; /user/get/:username

-   Response body

    -   Success <code: 200>

        ```ts
        {
            success: true,
            userDocument: UserDocument,
            videoDocuments: VideoDocument[],
            totalLikes: Number,
            totalViews: Number
        }
        ```

    -   Failure <code: 400>

        ```ts
        {
            success: false,
            error: String
        }
        ```

#### - [PUT] &emsp; /user/activate

##### Activation Rules and Limits

Users are given a limit of 5 activation attempts. If exceeded, the user will not be activated and will be blocked from activating their account and from creating a new account with the same username and/or email address for 24 hours

Users are given 10 minutes to activate their account under the specified attempt limit. If 10 minutes have passed and account was not yet activated, then the account will be deleted from the system database and user will have to repeat registration process

-   Reuqest body

    ```ts
    {
        activationCode: String,
    }
    ```

-   Response body

    -   Success <code: 200>

        ```ts
        {
            success: true;
        }
        ```

    -   Failure <code: 400> (activation error)

        ```ts
        {
            success: false,
            error: String,
            attemptsLeft: Number
        }
        ```

    -   Failure <code: 400> (server error)

        ```ts
        {
            success: false,
            error: String
        }
        ```

#### - [PUT] &emsp; /user/updateIpAddress

-   Response body

    -   Success <code: 200>

        ```ts
        {
            success: true,
            ipAddress: String | null
        }
        ```

    -   Failure <code: 400>

        ```ts
        {
            success: false,
            error: String
        }
        ```

#### - [DELETE] &emsp; /user/delete

-   Response body

    -   Success <code: 200>

        ```ts
        {
            success: true,
            deletedUserDocument: UserDocument
        }
        ```

    -   Failure <code: 400>

        ```ts
        {
            success: false,
            error: String
        }
        ```

## Video Endpoints

#### - [POST] &emsp; /video/upload

-   Request body

    ```ts
    {
        videoFile: File<Video>;
    }
    ```

-   Response body

    -   Success <code: 200>

        ```ts
        {
            success: true,
            videoDocument: VideoDocument
        }
        ```

    -   Failure <code: 400>

        ```ts
        {
            success: false,
            error: String
        }
        ```

#### - [GET] &emsp; /video/streamVideo/:key

-   Response body

    -   Success <code: 200>

        **_video stream_**

    -   Failure <code: 400> (server error)

        ```ts
        {
            success: false,
            error: String
        }
        ```

#### - [GET] &emsp; /video/streamThumbnail/:key

-   Response body

    -   Success <code: 200>

        **_image stream_**

    -   Failure <code: 400> (server error)

        ```ts
        {
            success: false,
            error: String
        }
        ```

#### - [GET] &emsp; /video/get/:key

-   Response body

    -   Success <code: 200>

        ```ts
        {
            success: true,
            videoDocument: VideoDocument,
            isLiked: boolean
        }
        ```

    -   Failure <code: 400>

        ```ts
        {
            success: false,
            error: String
        }
        ```

#### - [GET] &emsp; /video/getVideos/:count?

This endpoints returns a response with a `videoDocuments` object containing a list of videos

The optional `count` parameter in the URL determines the maximum number of fetched video documents. If it was not specified, a maximum of 10 video documents will be returned by default

The priority of choice of videos will be for the unwatched videos by the user. If no unwatched videos were found, then watched videos will be returned

-   Response body

    -   Success <code: 200>

        ```ts
        {
            success: true,
            videoDocuments: VideoDocument[]
        }
        ```

    -   Failure <code: 400>

        ```ts
        {
            success: false,
            error: String
        }
        ```

#### - [DELETE] &emsp; /video/delete/:key

-   Response body

    -   Success <code: 200>

        ```ts
        {
            success: true,
            deletedVideoDocument: VideoDocument
        }
        ```

    -   Failure <code: 400>

        ```ts
        {
            success: false,
            error: String
        }
        ```

## Comment Endpoints

#### - [POST] &emsp; /comment/post

-   Request body

    ```ts
    {
        videoKey: String,
        comment: String
    }
    ```

-   Response body

    -   Success <code: 200>

        ```ts
        {
            success: true,
            commentDocument: CommentDocument,
            newCommentsCount: Number
        }
        ```

    -   Failure <code: 400>

        ```ts
        {
            success: false,
            error: String
        }
        ```

#### - [GET] &emsp; /comment/getComments/:key

-   Response body

    -   Success <code: 200>

        ```ts
        {
            success: true,
            commentDocuments: CommentDocument[]
        }
        ```

    -   Failure <code: 400>

        ```ts
        {
            success: false,
            error: String
        }
        ```

#### - [DELETE] &emsp; /comment/delete/:id

-   Response body

    -   Success <code: 200>

        ```ts
        {
            success: true,
            deletedCommentDocument: CommentDocument,
            newCommentsCount: Number
        }
        ```

    -   Failure <code: 400>

        ```ts
        {
            success: false,
            error: String
        }
        ```

#### - [PUT] &emsp; /feedback/toggle/:key

-   Response body

    -   Success <code: 200>

        ```ts
        {
            success: true,
            newLikesCount: Number,
            operation: "LIKE" | "UNLIKE"
        }
        ```

    -   Failure <code: 400>

        ```ts
        {
            success: false,
            error: String
        }
        ```

#### - [PUT] &emsp; /feedback/like/:key

-   Response body

    -   Success <code: 200>

        ```ts
        {
            success: true,
            newLikesCount: Number,
            operation: "LIKE"
        }
        ```

    -   Failure <code: 400>

        ```ts
        {
            success: false,
            error: String
        }
        ```

#### - [PUT] &emsp; /feedback/unlike/:key

-   Response body

    -   Success <code: 200>

        ```ts
        {
            success: true,
            newLikesCount: Number,
            operation: "UNLIKE"
        }
        ```

    -   Failure <code: 400>

        ```ts
        {
            success: false,
            error: String
        }
        ```
