# TODO List

## April 17, 2023

-   [x] Create project root directory and file tree structure

-   [x] Install necessary packages

-   [x] Create necessary models, controllers, and middleware

-   [x] Set database and s3 bucket connection and configuration

## April 18, 2023

-   [x] Create [userController](./src/controllers/userController.ts)

-   [x] Build createUser, deleteUser, and checkUserExists user routes

-   [x] Create [videoController](./src/controllers/videoController.ts)

-   [x] Build uploadVideo, getVideoFile, getVideoData, and getVideos video routes

-   [x] Create [commentController](./src/controllers/commentController.ts)

## April 19, 2023

-   [x] Build getComments, postComment, and deleteComment comment routes

-   [x] Create [feedbackController](./src/controllers/feedbackController.ts)

-   [x] Build like and unlike routes

-   [x] Separate error messages for easier maintenance

-   [x] Implement checkResourceExists middlewares

## April 20, 2023

-   [x] Enhance models and database operations

-   [x] Fix bugs in Controllers

-   [x] Make username a unique field

-   [x] Write API docs

## For Later..

-   [ ] Implement authentication to make sure the requests are coming from a trusted origin (mobile client / web client)

-   [ ] Authenticate requests to make sure the uploader/deleter/liker/commentor is the same person who calimed to be

-   [ ] Deploy backend app on heroku
