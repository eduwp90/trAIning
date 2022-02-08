import { Button, Form, Input, Select } from 'antd';
import React, { useEffect, useState } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { IUserProfile, IWorkout } from '../interfaces';
import AuthService from '../Services/authService';
import { saveChallenge } from '../Services/challengesService';
import { getUserWorkouts } from '../Services/dbService';
import { getFriendsProfilesByIds, getUserFriends } from '../Services/friendsService';


const { Option } = Select;

const SendChallenge: React.FC = () => {
  const [user] = useAuthState(AuthService.auth);
  const [friendsList, setfriendsList] = useState<IUserProfile[]>([]);
  const [userWorkouts, setUserWorkouts] = useState<IWorkout[]>([]);

  const onFinish = ({ challengee, workout, message }: {challengee:string; workout:string; message:string;}) => {
    const workoutSets = userWorkouts.filter((set) => set.id === workout)

    saveChallenge(challengee, message, , workoutSets[0].workout)
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
      getUserProfile()
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
              {friendsList.map((friend) => {
                return <Option key={friend.id} value={`${friend.name} ${friend.surname}`}>{friend.name+' '+friend.surname}</Option>
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
        <Button type='primary' htmlType='submit' style={{marginBottom:"1em"}}>Send Challenge</Button>
        </div>
    </Form>
    </div>
  </div>);
}

export default SendChallenge;
