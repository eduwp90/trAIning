import React, {useState} from 'react';
import { Button, Form } from 'antd';
import Set from '../../Components/set/set';

const WorkoutForm: React.FC = () => {
  const [formSets, setFormSets] = useState<JSX.Element[]>([<Set key={0} id={0} removeSet={removeSet}></Set>]);
  const [keyCount, setKeyCount] = useState<number>(1);
  const [workout, setWorkout] = useState < React.FormEvent<HTMLInputElement> | null>(null)

  const addSet = ():void => {
    setFormSets(prev => [...prev, <Set key={keyCount} id={keyCount} removeSet={removeSet}></Set>] )
    setKeyCount(prev => prev+1)
  }
  function removeSet  (id:number):void  {
    setFormSets(prev => prev.filter(set => set.props.id !== id ))
  }

  const onFinish = (e: React.FormEvent<HTMLInputElement>): void => {
    console.log(e)
    setWorkout((prev) => e);
  }
  return (<div>

    <Form id="workoutForm" onFinish={onFinish}>
    {formSets}
      <Button onClick={addSet}>Add new set</Button>
      <Button type="primary" htmlType="submit">Sumbit</Button>
    </Form>

  </div>);
}

export default WorkoutForm;


