# trAIning

## Codeworks - Final project

<p align="center">
  <img src="images/training-logo.png" width="400" />
</p>

This website was created during Codeworks bootcamp, in two weeks in order to practice and test coding skills. Using Tensorflow's Teachable Machine, trAIning uses AI and machine-learning to create a full-experience workout application. It is able to track user activity, count workout reps, display interactive analytics, and host social interaction between users.

## Tech stack

This application is in Typescript. It uses Firebase for the back-end. React, Less, Ant Design, Dayjs, React Webcam, Craco, TensorFlow, and TeachableMachine on the front-end. trAIning was deployed using AWS.

# Team members

[Jaime Rodriguez](https://github.com/jaimemastretta), [Natasha Vermeulen](https://github.com/natashajvandam), [Edu Minguez](https://github.com/eduwp90), and [Kristen Hickey](https://github.com/KristenHickey).

# Screenshots

<p align="center">
<a href="images/overview.jpeg"><img src="images/overview.jpeg" width="800"  /></a>
</p>

<p align="center">
<a href="images/workout edu.gif"><img src="images/workout edu.gif" height="400"/></a>
<a href="images/workout natasha.gif"><img src="images/workout natasha.gif" height="400"/></a>
<a href="images/workout jaime.gif"><img src="images/workout jaime.gif" height="400"/></a>
</p>

# Main Features

- Workout creation
- Rep and Set counting
- Save workouts
- Add friends and send challenges
- Interactive Analytics

# Instructions

- Clone this repository
- Navigate to `./client` and run `npm i`
- Navigate to `./server` and run `npm i`
- Create a `.env` in `./client` with the following structure and add your custom values:

```shell
REACT_APP_APIKEY=
REACT_APP_AUTHDOMAIN=
REACT_APP_PROJECTID=
REACT_APP_STORAGEBUCKET=
REACT_APP_SENDERID=
REACT_APP_APPID=
```

- Create a copy of the `.env` in `./client` and move it to `./server`
- In `./server` start the backend with `node index.js`
- In `./client` start the website with `npm start`

## Demo video:

[Video](https://www.youtube.com/watch?v=SXzcEs_ITdc)
