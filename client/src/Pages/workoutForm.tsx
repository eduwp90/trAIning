import React, {useState} from 'react';
import { Button, Form } from 'antd';
import Set from '../Components/set';
import { ISet } from '../interfaces';
import Workout from './workout';

const WorkoutForm: React.FC = () => {
  const [formSets, setFormSets] = useState<JSX.Element[]>([<Set key={0} id={0} removeSet={removeSet}></Set>]);
  const [keyCount, setKeyCount] = useState<number>(1);
  const [workout, setWorkout] = useState <ISet[] | null>(null)

  const addSet = ():void => {
    setFormSets(prev => [...prev, <Set key={keyCount} id={keyCount} removeSet={removeSet}></Set>] )
    setKeyCount(prev => prev+1)
  }
  function removeSet  (id:number):void  {
    setFormSets(prev => prev.filter(set => set.props.id !== id ))
  }

  const onFinish = (e: React.FormEvent<HTMLInputElement>): void => {
    console.log(Object.values(e));
    setWorkout(Object.values(e));
  }
  return (
    !workout
    ? <div>
    <Form id="workoutForm" onFinish={onFinish}>
    {formSets}
      <Button onClick={addSet}>Add new set</Button>
      <Button type="primary" htmlType="submit">Sumbit</Button>
    </Form>
      </div>
      : <Workout workout={workout}/>);
}

export default WorkoutForm;


