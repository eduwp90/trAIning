import { Button, Form, InputNumber, Radio, Select } from 'antd';
import React from 'react';
import { useNavigate } from 'react-router-dom';

function ChallengeSummary() {
  const navigate = useNavigate()
  const challenge = {
    from: "John Smith",
    message: "Have fun with this one!",
    workout: [{exer: "squats", reps: 5, rest: 0}, {exer: "push-ups", reps: 10, rest: 0}]
  }

   function returnHome(): void {
    //clearExistingWorkout();
    navigate("/");
   }

  return (
    <div className='page-Div'>
      <h2>You received with challenge from: </h2>
      <h3>{challenge.from}</h3>
      <h2>And they had this to say about it: </h2>
      <h3>{ challenge.message}</h3>
      <h2>This challenge consists of:</h2>

    <Form labelCol={{ span: 4 }}
        wrapperCol={{ span: 14 }}>
      {challenge.workout.map((set, index) => {
        console.log(set.exer)
        return <div key={index} className="set-Div">
      <div className="set-Div_inputs">
      <Form.Item label="Exercise">
              <Select size="large"  style={{ width: 120 }} disabled={true} defaultValue={set.exer}>
              <Select.Option value={set.exer}>{set.exer}</Select.Option>
              </Select>
            </Form.Item>
            <Form.Item label="Nº of repetitions">
              <InputNumber
                size="large"
                min={1}
                max={30}
                style={{ width: 120 }}
           disabled={true}
           defaultValue={set.reps}
              />
            </Form.Item>

            <Form.Item

              label="Rest time"
              >
              <Radio.Group size="large" disabled={true} defaultValue={set.rest} buttonStyle="solid">
                <Radio.Button value={0}>0 min</Radio.Button>
                <Radio.Button value={1}>1 min</Radio.Button>
                <Radio.Button value={3}>3 min</Radio.Button>
                <Radio.Button value={5}>5 min</Radio.Button>
              </Radio.Group>
          </Form.Item>
          </div>
          </div>
      })}
      </Form>
      <Button onClick={returnHome}>Return to home</Button>
    </div>);
}

export default ChallengeSummary;
