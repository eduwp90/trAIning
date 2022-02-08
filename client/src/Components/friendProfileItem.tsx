import { MinusCircleOutlined, PlusCircleOutlined } from '@ant-design/icons';
import { Avatar, Image } from 'antd';
import React, { Dispatch, SetStateAction } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { IUserProfile } from '../interfaces';
import AuthService from '../Services/authService';
import { addFriend, removeFriend } from '../Services/friendsService';

type FriendProfileItemProps = {
  profile: IUserProfile,
  list: string,
  setExistingFriendsArray: Dispatch<SetStateAction<string[] | null>>
}

const FriendProfileItem: React.FC<FriendProfileItemProps> = ({profile, list, setExistingFriendsArray}) => {
  const [user] = useAuthState(AuthService.auth);

  const addToFriendList = (id: string): void => {
    if (user){
      addFriend(user.uid, id)
        .then(res => {
          setExistingFriendsArray(prev => {
            if (prev) {
              return [...prev, id]
            } else {
              return [id]
            }
          })
      })
    }
  }

  const removeFromFriendList = (id: string): void => {
    if (user){
      removeFriend(user.uid, id)
        .then(res => {
          setExistingFriendsArray(prev => {
            if (prev) {
              return prev.filter(userId => userId !== id)
            } else {
              return []
            }
          })
      })
    }
  }
  return (
    <div className='friend-item'>
    <div className="avatar-div">
      <Avatar
        src={profile.photoURL !== "" && (<Image src={profile.photoURL} style={{ width: 32 }} preview={false} />)}
      >
        {!profile.photoURL && `${profile.name.charAt(0).toUpperCase()}`}
        </Avatar>
    </div>
    <div className='name-div'>
      <p style={{margin: '0', fontSize:"medium"}}>{profile.name} {profile.surname}</p>
    </div>
    <div className='friend-btns'>
      {list === "friends"
        ? <MinusCircleOutlined style={{fontSize:"x-large", color: "#2A9D8F"}} onClick={()=> {removeFromFriendList(profile.userId)}}/>
        : <PlusCircleOutlined style={{fontSize:"x-large", color: "#2A9D8F"}} onClick={()=> {addToFriendList(profile.userId)}}/>
      }
    </div>

      </div>);
}

export default FriendProfileItem;
