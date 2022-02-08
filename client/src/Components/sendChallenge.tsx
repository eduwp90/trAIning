import { Button, Form, Input, Select } from 'antd';
import React, { useEffect, useState } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { IWorkout } from '../interfaces';
import AuthService from '../Services/authService';
import { getUserWorkouts } from '../Services/dbService';


const { Option } = Select;

const SendChallenge: React.FC = () => {
  const [user] = useAuthState(AuthService.auth);
  const [friendsList, setfriendsList] = useState([]);
  const [userWorkouts, setUserWorkouts] = useState<IWorkout[]>([]);

  const onFinish = ({ challengee, workout, message }) => {
    const workoutSets = userWorkouts.filter((set) => set.id === workout)
    const challenge = {
      receiving_userid: challengee,
      message: message,
      workout: workoutSets[0].workout
    }
    console.log(challenge)
}

  useEffect(() => {
    if (user) {
      // getUserFriends(user.uid)
      //   .then(res => {

      // })
      getUserWorkouts(user.uid)
        .then(response => {
          if (response) {
            setUserWorkouts(response)
          }

      })
    }

  }, [user])


  return (<div className="challenge-Div">
    <div className='set-Div'>
    <Form onFinish={onFinish}>
      <div className='set-Div_inputs'>
      <Form.Item label="I want to challenge:" name="challengee">
        <Select

    showSearch
    style={{ width: 200 }}
    placeholder="Search to Select"
    optionFilterProp="children"
          filterOption={(input, option) => {
            const child = option?.children ? option?.children.toString() : "";
     return child.toLowerCase().indexOf(input.toLowerCase()) >= 0}
    }
          filterSort={(optionA, optionB) => {
            const childA = optionA.children ? optionA.children.toString() : "";
            const childB = optionB.children ? optionB.children.toString() : "";
     return childA.toLowerCase().localeCompare(childB.toLowerCase())}
    }
  >
    <Option value="1">Not Identified</Option>
    <Option value="2">Closed</Option>
    <Option value="3">Communicated</Option>
    <Option value="4">Identified</Option>
    <Option value="5">Resolved</Option>
    <Option value="6">Cancelled</Option>
  </Select>
      </Form.Item>
      <Form.Item label="To complete my workout:" name="workout">
        <Select
    showSearch
    style={{ width: 200 }}
    placeholder="Search to Select"
    optionFilterProp="children"
          filterOption={(input, option) => {
            const child = option?.children ? option?.children.toString() : "";
     return child.toLowerCase().indexOf(input.toLowerCase()) >= 0}
    }
          filterSort={(optionA, optionB) => {
            const childA = optionA.children ? optionA.children.toString() : "";
            const childB = optionB.children ? optionB.children.toString() : "";
     return childA.toLowerCase().localeCompare(childB.toLowerCase())}
    }
  >
          {userWorkouts.map((workout) => {
            return <Option key={workout.id} value={workout.id}>{workout.name}</Option>
          })}
  </Select>
      </Form.Item >
      <Form.Item label="Want send a short message with your challenge?" name="message">
        <Input placeholder='message...' maxLength={50}>
        </Input>
      </Form.Item>
        <Button type='primary' htmlType='submit' style={{marginBottom:"1em"}}>Send Challenge</Button>
        </div>
    </Form>
    </div>
  </div>);
}

export default SendChallenge;
