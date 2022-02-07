import { MinusCircleOutlined, PlusCircleOutlined } from '@ant-design/icons';
import { Avatar, Image } from 'antd';
import React from 'react';

type FriendProfileItemProps = {
  profile: { userId: string, name: string, surname: string, photoURL: string },
  list:string
}

const FriendProfileItem: React.FC<FriendProfileItemProps> = ({profile, list}) => {

  return (<div className='friend-item'>
    <div className="avatar-div">
   <Avatar
                    src={
                      profile.photoURL && (
                        <Image
                          src={profile.photoURL}
                          style={{
                            width: 32
                          }}
                          preview={false}
                        />
                      )
                    }>
                    {!profile.photoURL && `${profile.name.charAt(0).toUpperCase()}`}
        </Avatar>
    </div>
    <div className='name-div'>
      <p style={{margin: '0', fontSize:"medium"}}>{profile.name} {profile.surname}</p>
    </div>
    <div className='friend-btns'>
      {list === "friends"
        ? <MinusCircleOutlined style={{fontSize:"x-large", color: "lightgrey"}}/>
        : <PlusCircleOutlined style={{fontSize:"x-large", color: "lightgrey"}}/>
      }
    </div>

      </div>);
}

export default FriendProfileItem;
