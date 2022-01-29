import React from 'react';
import "./pages.css"
import { Steps, Button, message } from 'antd';
import { ISet } from '../interfaces';

const { Step } = Steps;



type WorkoutProps = {
  workout: ISet[]
}

const Workout: React.FC<WorkoutProps> = ({ workout }) => {
  const [current, setCurrent] = React.useState(0)

  const next = () => {
    setCurrent(current + 1);
  };

  const prev = () => {
    setCurrent(current - 1);
  };

  return (
   <div className="workout-Div">
      <div className= "steps-Div">
      <Steps current={current} >
        {workout.map(item => (
          <Step key={item.exer}  />
        ))}
        </Steps>
      </div>
      <div className='workoutContent-Div'>
        <div className="steps-content">{workout[current].exer}</div>
      <div className="steps-content">I will be the AI comp</div>
      <div className="steps-action">
        {current < workout.length - 1 && (
          <Button type="primary" onClick={() => next()}>
            Next
          </Button>
        )}
        {current === workout.length - 1 && (
          <Button type="primary" onClick={() => message.success('Processing complete!')}>
            Done
          </Button>
        )}
        {current > 0 && (
          <Button style={{ margin: '0 8px' }} onClick={() => prev()}>
            Previous
          </Button>
        )}
        </div>
      </div>
    </div>
  );
};


export default Workout