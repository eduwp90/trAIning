import React, { useContext } from "react";
import "./components.less";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination } from "swiper";
import WorkoutsContext from "../workoutContext";

function WorkoutList() {
  const { userWorkouts } = useContext(WorkoutsContext);

  const res = userWorkouts.map((workout: any) => {
    console.log(workout);
    return <SwiperSlide>{workout.workout[0].exer}</SwiperSlide>;
  });

  return (
    <div>
      <Swiper pagination={true} modules={[Pagination]} className="workout_list">
        {[...res]}
      </Swiper>
    </div>
  );
}

export default WorkoutList;
