import { Button, Form, Input, Select } from 'antd';
import React, { useContext, useEffect, useState } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { WorkoutContext } from '../Context/workoutProvider';
import { IUserProfile, IWorkout, IWorkoutContext } from '../interfaces';
import AuthService from '../Services/authService';
import { saveChallenge } from '../Services/challengesService';
import {  getUserWorkouts } from '../Services/dbService';
import { getFriendsProfilesByIds, getUserFriends } from '../Services/friendsService';

type onFinishProps = { challengee: string; workout: string; message: string; }

type SendChallengeProps = {
  onCancel: () => void;
}

const { Option } = Select;

const SendChallenge: React.FC<SendChallengeProps> = ({onCancel}) => {
  const [user] = useAuthState(AuthService.auth);
  const { userProfile } = useContext<IWorkoutContext>(WorkoutContext);
  const [friendsList, setfriendsList] = useState<IUserProfile[]>([]);
  const [userWorkouts, setUserWorkouts] = useState<IWorkout[]>([]);

  const onFinish = ({ challengee, workout, message }: onFinishProps ) => {
    const workoutSets = userWorkouts.filter((set) => set.id === workout)
    if (userProfile) {
      const name: string = userProfile && userProfile.name + ' ' + userProfile.surname
      const profilePhoto: string = userProfile && userProfile.photoURL
        saveChallenge(challengee, message, name, workoutSets[0].workout, profilePhoto)
    }
    onCancel()
}

  useEffect(() => {
    if (user) {
       getUserFriends(user.uid)
        .then(res => {
          getFriendsProfilesByIds(res)
            .then(res => {
              if (res) {
                setfriendsList(prev => [...prev, ...res])
              }
            })
      })
      getUserWorkouts(user.uid)
        .then(response => {
          if (response) {
            setUserWorkouts(response)
          }

        })
    }

  }, [user])


  return (

    <div className="sendChallenge-container">
    <Form onFinish={onFinish}>
      <div className='sendChallenge_inputs'>
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
              {friendsList.map((friend) => {
                return <Option key={friend.id} value={friend.userId}>{friend.name+' '+friend.surname}</Option>
              })}
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
          {userWorkouts.map((workout, index) => {
            return <Option key={workout.id} value={workout.id}>{workout.name}</Option>
          })}
  </Select>
      </Form.Item >
      <Form.Item label="Want send a short message with your challenge?" name="message">
        <Input placeholder='message...' maxLength={50}>
        </Input>
      </Form.Item>
        </div>
    <Button type='primary' htmlType='submit' style={{ width:"100%", marginBottom: "1em" }}>Send Challenge</Button>
    </Form>
  </div>);
}

export default SendChallenge;
