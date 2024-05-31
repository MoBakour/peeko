# Peeko Social Media Application

## About

Peeko is a short video reels social media application built with MERN stack (MongoDB, ExpressJS, ReactJS, NodeJS)<br>
By [MoBakour](https://linktr.ee/swordax)<br>

## Features

-   User authentication (register/login)
-   Account email verification
-   Video file uploads
-   Comment/like/share on video posts
-   Infinite scrolling
-   Profile viewing

## Tech Stack

This project is built with React.js and TailwindCSS on the client-side. Node.js with Express.js written in TypeScript on the server side. User and post data were stroed in a MongoDB database using Mongoose ODM. Video files were stored in an AWS S3 bucket.

![JavaScript](https://img.shields.io/badge/javascript-%23323330.svg?style=for-the-badge&logo=javascript&logoColor=%23F7DF1E) ![TypeScript](https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white) ![React](https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB) ![TailwindCSS](https://img.shields.io/badge/tailwindcss-%2338B2AC.svg?style=for-the-badge&logo=tailwind-css&logoColor=white) ![NodeJS](https://img.shields.io/badge/node.js-6DA55F?style=for-the-badge&logo=node.js&logoColor=white) ![Express.js](https://img.shields.io/badge/express.js-%23404d59.svg?style=for-the-badge&logo=express&logoColor=%2361DAFB) ![MongoDB](https://img.shields.io/badge/MongoDB-%234ea94b.svg?style=for-the-badge&logo=mongodb&logoColor=white) ![AWS](https://img.shields.io/badge/AWS-%23FF9900.svg?style=for-the-badge&logo=amazon-aws&logoColor=white)

## Run locally

You will need to have Node.js installed on your system to run the project locally.

```bash
# clone the repository
git clone https://github.com/MoBakour/peeko
```

##### Start client

```bash
# open terminal in /peeko/client

# install required packages for client
npm install

# run command to start react client
npm start
```

##### Start server

```bash
# open terminal in /peeko/server

# install required packages
npm install

# run command to start server
npm run dev
```
