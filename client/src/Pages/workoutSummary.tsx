import { CloseOutlined } from '@ant-design/icons';
import { Button, Form, Input, InputNumber, Radio, Select  } from 'antd';
import React, { useContext, useEffect, useState } from 'react';
import { ISet, IWorkoutContext } from '../interfaces';
import "./pages.less"
import "../Components/components.less"
import { addWorkout } from '../Services/dbService';
import { useAuthState } from 'react-firebase-hooks/auth';
import AuthService from '../Services/authService';
import { WorkoutContext } from '../Context/workoutProvider';
import { useNavigate } from 'react-router-dom';
const { Option } = Select;



const WorkoutSummary: React.FC = () => {
  const [user] = useAuthState(AuthService.auth);
  const [setsDisabled, setSetsDisabled] = useState<boolean>(true);
  const [sets, setSets] = useState<JSX.Element[]>([]);
  const {workout, clearWorkout} = useContext<IWorkoutContext>(WorkoutContext)
  const navigate = useNavigate()

  const onFinish = (e: React.FormEvent<HTMLInputElement>): void => {
    const workoutArray = Object.values(e)
    const name: string = workoutArray.pop()
    const sets: ISet[] = workoutArray
    if (user) {
      addWorkout(user.uid, sets, name)
        .then(() => { clearWorkout() })
        .then(() => { navigate('/') })
        .catch((e)=>{console.log(e)})
    }
   };

  const setsArray: JSX.Element[] = workout.map(set => {
    const id: number = workout.indexOf(set)
    return (<div key={id} id={`${id}`} className="set-Div">
      <div className="set-Div_inputs">
        <Form.Item
          name={[id, "exer"]}
          label="Select Exercise"
          rules={[
            {
              required: true
            }
          ]}
        initialValue={set.exer}>
          <Select size="large" placeholder="exercise" style={{ width: 120 }} disabled={setsDisabled}>
            <Option value="push-ups">push ups</Option>
            <Option value="squats">squats</Option>
            <Option value="lunges">lunges</Option>
            <Option value="jumping-jacks">jumping jacks</Option>
            <Option value="side-squats">side squats</Option>
          </Select>
        </Form.Item>
        <Form.Item
          name={[id,  "reps"]}
          label="Nº of repetitions"
          rules={[
            {
              required: true
            }
          ]}
        initialValue={set.reps}>
          <InputNumber size="large" placeholder="Reps" min={1} max={30} style={{ width: 120 }} disabled={setsDisabled} />
        </Form.Item>

        <Form.Item
          name={[id, "rest"]}
          label="Rest time"
          rules={[
            {
              required: true
            }
          ]}
        initialValue={set.rest}>
          <Radio.Group size="large" disabled={setsDisabled} buttonStyle="solid">
            <Radio.Button value={0}>0 min</Radio.Button>
            <Radio.Button value={1}>1 min</Radio.Button>
            <Radio.Button value={3}>3 min</Radio.Button>
            <Radio.Button value={5}>5 min</Radio.Button>
          </Radio.Group>
          </Form.Item>
      </div>
      <Button className="round_button" onClick={() => removeSet(id) }>
        <CloseOutlined />
      </Button>
    </div>)
  })

  function removeSet(id: number): void {
    setSets((prev) => prev.filter((set) => parseInt(set.props.id) !== id));
  }
  function handleEdit():void {
    setSetsDisabled(false)
  }

  useEffect(() => {
    setSets(setsArray)
  },[setsDisabled])

useEffect(() => {
    setSets(setsArray)
}, [])

  return (
    <div className="pages-Div">
      <h2>Workout Summary</h2>

      <Form id="summaryForm" onFinish={onFinish}>
        <Form.Item name="workout_name" label="Give your workout a name" rules={[
            {
              required: true
            }
          ]}>
        <Input placeholder='e.g. Workout 1' />
        </Form.Item>
        <p>Would you like to edit your sets? <Button onClick={()=>handleEdit()}>Edit</Button></p>
        {sets}
        <Button type="primary" htmlType="submit" >Save workout</Button>
        </Form>;

    </div>)
}

export default WorkoutSummary;
