import React, { useState } from "react";
import "./components.less";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination } from "swiper";
import { IWorkout } from "../interfaces";

const WorkoutList = () => {
  // const { userWorkouts } = useState(WorkoutsContext);
  // return (
  //   <div>
  //     <Swiper pagination={true} modules={[Pagination]} className="workout_list">
  //       {userWorkouts.map((workout: IWorkout) => {
  //         return <SwiperSlide key={userWorkouts.indexOf(workout)}>{`${workout.workout[0].exer}`}</SwiperSlide>;
  //       })}
  //     </Swiper>
  //   </div>
  // );
};

export default WorkoutList;
