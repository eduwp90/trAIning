# trAIning

<p align="center">
  <img src="images/training-logo.png" width="400" />
</p>

## Codeworks - Final project

Using Tensorflow's Teachable Machine, trAIning uses AI and machine-learning to create a full-experience workout application. It is able to track user activity, count workout reps, display interactive analytics, and host social interaction between users.

## Tech stack

This application is in Typescript. It uses Firebase for the back-end and FireStore for the database. React, Less, Ant Design, Dayjs, React Webcam, Craco, TensorFlow, and TeachableMachine on the front-end. trAIning was deployed using AWS.

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

### Set up the backend on Firebase

- Create a [firebase project](https://firebase.google.com/)
- Add Authentication and enable login with email and password.
- Create a database and choose a Cloud Firestore location. 
- Start two collections: `profiles`, `workoutsDb`. 

### Start the Application

- Clone this repository
- Navigate to `./client` and run `npm i`
- Create a `.env` in `./client` with the following structure and add your custom values:

```shell
REACT_APP_APIKEY=
REACT_APP_AUTHDOMAIN=
REACT_APP_PROJECTID=
REACT_APP_STORAGEBUCKET=
REACT_APP_SENDERID=
REACT_APP_APPID=
```
(to find your custom values on Firestore, go to `Project Settings` on the `Project Overview` dropdown menu.

- In `./client` start the website with `npm start`

## Demo video:

[Video](https://www.youtube.com/watch?v=SXzcEs_ITdc)
