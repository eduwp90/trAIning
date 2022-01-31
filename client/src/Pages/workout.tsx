import React from 'react';
import './pages.css';
import { Steps, Button, message } from 'antd';
import { ISet } from '../interfaces';
import WebcamAI from '../Components/webcamAI';

const { Step } = Steps;

type WorkoutProps = {
  workout: ISet[];
};

const Workout: React.FC<WorkoutProps> = ({ workout }) => {
  const [current, setCurrent] = React.useState(0);

  const next = () => {
    setCurrent(current + 1);
  };

  const prev = () => {
    setCurrent(current - 1);
  };

  return (
    <div className='workout-Div'>
      <div className='steps-Div'>
        <Steps current={current} responsive={false}>
          {workout.map((item) => (
            <Step key={item.exer} />
          ))}
        </Steps>
      </div>
      <div className='workoutContent-Div'>
        <div className='steps-content'>
          <WebcamAI />
        </div>
        <div className='set-info'>
          <p className='set-info-current'>Current set:</p>
          <p className='set-info-current'>
            {workout[current].reps} reps of {workout[current].exer}s
          </p>
          {workout.length > 1 && current !== workout.length - 1 ? (
            <p>
              {' '}
              Up next: {workout[current + 1].reps} reps of{' '}
              {workout[current + 1].exer}s
            </p>
          ) : null}
        </div>
        <div className='steps-action'>
          {current < workout.length - 1 && (
            <Button type='primary' onClick={() => next()}>
              Next
            </Button>
          )}
          {current === workout.length - 1 && (
            <Button
              type='primary'
              onClick={() => message.success('Processing complete!')}
            >
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

export default Workout;
