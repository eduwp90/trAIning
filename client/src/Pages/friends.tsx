import { Avatar } from 'antd';
import Search from 'antd/lib/input/Search';
import React, { useEffect, useState } from 'react';
import FriendProfileItem from '../Components/friendProfileItem';

type user = {userId:string, name:string, surname:string, photoURL:string}

const Friends: React.FC = () => {
  const [existingFriends, setExistingFriends] = useState<string[]>([]);
  const [allProfiles, setAllProfiles] = useState<user[]>([]);

 async function setStates   ()  {
    //const allProfilesArray = await getAllProfiles();
    const allProfilesArray = [{userId:"oR1IfyhdKuZ5MMEiyF5vVmQ1PHs1", name:"julie", surname:"smith", photoURL:""}, {userId:"oR1IfyhdKuZ5MMEiyF5vVmQ1PHs2", name:"Mark", surname:"Smith", photoURL:""}]
    setAllProfiles(allProfilesArray)

    //const friendsArray = await getFriends();
    const friendsArray = ["oR1IfyhdKuZ5MMEiyF5vVmQ1PHs1"]
    setExistingFriends(friendsArray)
 }

useEffect(() => {
    setStates()
  }, [])

  const existingFriendsList = () => {
    const friends = allProfiles.filter((profile) => {
     return existingFriends.includes(profile.userId)
    }).map((profile) => {
      return <FriendProfileItem profile={profile} list="friends" />
    })
    return friends
  }

  const addFriendsList = () => {
    const users = allProfiles.filter((profile) => {
     return !existingFriends.includes(profile.userId)
    }).map((profile) => {
      return <FriendProfileItem profile={profile} list="add" />
    })
    return users
  }




  return (
    <div className='pages-Div'>
      <div className="list_title">
        <h2>Your friends</h2>
      </div>
      {existingFriendsList()}
      <div className="list_title">
        <h2>Add new friends</h2>

      </div>
      <div>
        <Search placeholder="input search text" allowClear /*onSearch={onSearch}*/ style={{ width: 200 }} />
      {addFriendsList()}
      </div>
    </div>

  )
}

export default Friends;
