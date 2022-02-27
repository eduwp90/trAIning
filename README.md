# trAIning

<p align="center">
  <img src="images/training-logo.png" width="400" />
</p>

Using Tensorflow's Teachable Machine, trAIning uses AI and machine-learning to create a full-experience workout application. It is able to track user activity, count workout reps, display interactive analytics, and host social interaction between users.

## Tech stack

This application is written in Typescript. It uses Firebase for the back-end and FireStore for the database. React, Less, Ant Design, Dayjs, React Webcam, Craco, TensorFlow, and TeachableMachine on the front-end. trAIning was deployed on AWS.

# Team members

- Natasha Vermeulen | [LinkedIn](https://www.linkedin.com/in/natasha-vermeulen/) | [Github](https://github.com/natashajvandam)

- Jaime Diez Rodriguez | [LinkedIn](https://www.linkedin.com/in/jaimemastretta/) | [Github](https://github.com/jaimemastretta)

- Kristen Hickey | [LinkedIn](https://www.linkedin.com/in/kristen-hickey/) | [Github](https://github.com/KristenHickey)

- Edu Minguez | [LinkedIn](www.linkedin.com/in/eduminguez) | [Github](https://github.com/eduwp90)

# Screenshots

<p align="center">
<a href="images/overview.jpeg"><img src="images/overview.jpeg" width="800"  /></a>
</p>

<p align="center">
<a href="images/workout natasha.gif"><img src="images/workout natasha.gif" height="320"/></a>
<a href="images/workout edu.gif"><img src="images/workout edu.gif" height="320"/></a>
<a href="images/workout jaime.gif"><img src="images/workout jaime.gif" height="320"/></a>
</p>

# Main Features

- Workout creation
- Rep and Set counting
- Save workouts
- Add friends and send challenges
- Interactive Analytics

# Instructions

### Set up the backend on Firebase

- Create a [firebase project](https://firebase.google.com/).
- Add Authentication and enable login with email and password.
- Create a database and choose a Cloud Firestore location.
- Start two collections: `profiles`, `workoutsDb`.

### Start the Application

- Clone this repository.
- Navigate to `./client` and run `npm i`.
- To find your custom values on Firestore, go to `Project Settings` on the `Project Overview` dropdown menu.
- Create a `.env` in `./client` with the following structure and add your custom values:

```shell
REACT_APP_APIKEY=
REACT_APP_AUTHDOMAIN=
REACT_APP_PROJECTID=
REACT_APP_STORAGEBUCKET=
REACT_APP_SENDERID=
REACT_APP_APPID=
```

- In `./client` start the website with `npm start`

## Demo video:

[Video](https://www.youtube.com/watch?v=SXzcEs_ITdc)
