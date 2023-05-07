# Change Log

All changes applied on this project code base will be documented in this file.

## [Unreleased] - 2023-04-17

### Added

    - Created project root directory
    - Installed initial necessary packages
    - Created database models
    - Created initial contorllers and middleware
    - Set MongoDB database and AWS S3 bucket connection and configuration

## [Unreleased] - 2023-04-18

### Added

    - Created userController routes (createUser, deleteUser, checkUserExists)
    - Created videoController routes (uploadVideo, getVideoFile, getVideoData, getVideos)
    - Added commentController file in controllers directory

## [Unreleased] - 2023-04-19

### Added

    - Created commentController routes (getComments, postComment, deleteComment)
    - Added feedbackController file in controllers directory
    - Created feedbackController routes (like, unlike)

### Changed

    - Moved error messages into a dedicated file
    - Moved checkVideoExists to a dedicated checkResourceExists file

## [Unreleased] - 2023-04-20

### Added

    - Created API documentation file

### Changed

    - Improved models and database operations
    - Fixed bugs in controllers
    - Made username a unique field

## [Unreleased] - 2023-04-21

### Added

    - JWT authentication

### Changed

    - Unified routes path naming convention
    - Fixed errors and typos in API documentation file

### Removed

    - Reduced and eliminated unnecessary code and functions

## [0.1.0-test.1] - 2023-04-24

## [0.1.0-test.2] - 2023-04-26

### Changed

    - Added more fields to user model
    - Fixed bugs in authentication and authorization

## [Unreleased] - 2023-04-28

### Remoed

    - Removed requirement of authentication for streaming video

## [0.1.0-test.3] - 2023-04-29

### Added

    - New route /feedback/toggleLike
    - Store user ip address when user creates a new account
    - New route /user/updateIpAddress

### Changed

    - Change the naming convention of routes in video controller

### Removed

    - Removed an unnecessary route from video controller, (the /video/download/videoData route)

## [0.1.0-test.4] - 2023-04-30

### Added

    - Added CORS

### Changed

    - Made deviceInfo optional when creating user account

    - Switched to custom validation instead of mongoose validation

## [Unreleased] - 2023-05-01

### Added

    - Returned /video/getVideo route
    - New user model fields (email and password for web clients only)
    - New user validation rules

### Changed

    - Switched from URL query to URL params in GET/DELETE requests

## [0.1.0-test.5] - 2023-05-02

### Added

    - Added support for cookie token storage for web client authentication
    - Added /user/register & /user/login & /user/logout for web clients

### Changed

    - Separated web user routes from mobile user routes from general routes
    - Renamed response object fields to follow unified conventions

## [0.1.0-test.6] - 2023-05-03

### Added

    - Validation middleware to validate video file type, size, and duration

### Changed

    - Fixed minor bugs

## [Unreleased] - 2023-05-04

### Added

    - Account verification system

### Changed

    - Improved file validation
    - Made video file uploading more secure on the server
    - Merged webUserController and userController files into one file
    - Now, mobile and web clients use the same routes for authentication

### Removed

    - Removed mobileUserController

## [0.1.0-test.7] - 2023-05-05

### Changed

    - Changed video max size from 300 MB to 100 MB
    - Added a default value (empty array) for the viewed option in /video/getVideos to make the viewed option optional
    - Merged some util files under one file in ./utils/utils.ts
    - Small patches around the code base

## [0.1.1-test.7] - 2023-05-06

### Changed

    - Changed env variables names
    - Fixed activation subdocument in user model having an _id field

## [0.1.0-test.8] - 2023-05-07

### Added

    New devActivation option on registration for development and test purposes

### Changed

    Changed auth routes names, signup => register, login => signIn, logout => signOut
    Changed requireLogin to requireAuth
    Changed activation: account not found error message
    Fixed mistakes in the API docs

## [0.1.1-test.8] - 2023-05-07

### Added

    Conditional check whether the user is already activated before attempting an activation process

## TODOS

    - [ ] Build web client-side with React.js and Next.js
    - [ ] Major testing (test all routes)
    - [ ] Keep CORS in mind
