import React, {useState} from 'react';
import { Button, Form } from 'antd';
import Set from '../../Components/set/set';

const WorkoutForm: React.FC = () => {
  const [formSets, setFormSets] = useState([<Set key={0} id={0} removeSet={removeSet}></Set>])
  const [keyCount, setKeyCount] = useState(1)

  const addSet = ():void => {
    setFormSets(prev => [...prev, <Set key={keyCount} id={keyCount} removeSet={removeSet}></Set>] )
    setKeyCount(prev => prev+1)
  }
  function removeSet  (id:number):void  {
    setFormSets(prev => prev.filter(set => set.props.id !== id ))
  }

  return (<div>

    <Form id="workoutForm">
    {formSets}
    <Button onClick={addSet}>Add new set</Button>
    </Form>

  </div>);
}

export default WorkoutForm;