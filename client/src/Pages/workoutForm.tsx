import React, { useContext, useState } from "react";
import { Button, Form } from "antd";
import Set from "../Components/set";
import { IWorkoutContext } from "../interfaces";
import Workout from "./workout";
import { WorkoutContext } from "../Context/workoutProvider";

const WorkoutForm: React.FC = () => {
  const [formSets, setFormSets] = useState<JSX.Element[]>([<Set key={0} id={0} removeSet={removeSet}></Set>]);
  const [keyCount, setKeyCount] = useState<number>(1);
  const {workout, storeWorkout} = useContext<IWorkoutContext>(WorkoutContext)

  const addSet = (): void => {
    setFormSets((prev) => [...prev, <Set key={keyCount} id={keyCount} removeSet={removeSet}></Set>]);
    setKeyCount((prev) => prev + 1);
  };

  function removeSet(id: number): void {
    setFormSets((prev) => prev.filter((set) => set.props.id !== id));
  }

  const onFinish = (e: React.FormEvent<HTMLInputElement>): void => {
    console.log(Object.values(e));
    storeWorkout(Object.values(e));
  };

  const validateMessages = {
    required: "${label} is required!"
  };

  return workout.length === 0 ? (
    <div className="pages-Div">
      <Form
        layout="vertical"
        id="workoutForm"
        onFinish={onFinish}
        labelCol={{ span: 4 }}
        wrapperCol={{ span: 14 }}
        validateMessages={validateMessages}>
        {formSets}
        <Button size="large" className="workoutForm_button" onClick={addSet}>
          Add new set
        </Button>
        <Button size="large" className="workoutForm_button" type="primary" htmlType="submit">
          Sumbit
        </Button>
      </Form>
    </div>
  ) : (
      <Workout />
  );
};

export default WorkoutForm;
