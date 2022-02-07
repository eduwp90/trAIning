import Search from 'antd/lib/input/Search';
import React, { useEffect, useState } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import FriendProfileItem from '../Components/friendProfileItem';
import { IUserProfile } from '../interfaces';
import AuthService from '../Services/authService';
import { getAllProfiles, getUserFriends } from '../Services/friendsService';



const Friends: React.FC = () => {
  const [user] = useAuthState(AuthService.auth);
  const [existingFriends, setExistingFriends] = useState<IUserProfile[]>([]);
  const [existingFriendsArray, setExistingFriendsArray] = useState<string[]>([]);
  const [allProfiles, setAllProfiles] = useState<IUserProfile[]>([]);
  const [addFriendsList, setAddFriendsList] = useState< JSX.Element[]>([]);

  async function setStates() {
  const allProfilesArray = await getAllProfiles();
   if (allProfilesArray) {
     setAllProfiles(allProfilesArray)
   }
   if (user) {
     const friendsIDArray = await getUserFriends(user.uid);
     if (friendsIDArray) {
       setExistingFriendsArray(friendsIDArray)
     }
   }
  }

  useEffect(() => {
if (existingFriendsArray.length > 0) {
          const friendsArray = allProfiles.filter((profile) => {
     return existingFriendsArray.includes(profile.userId)
          })
         console.log(friendsArray)
    setExistingFriends(friendsArray)
       }
  }, [existingFriendsArray])


  useEffect(() => {
    let mounted = true;
    if (user && mounted) {
      setStates()
    }
    return () => {
      mounted = false;
    }
  }, [user])

    useEffect(() => {
      let mounted = true;
      if (user && mounted) {
        const nonFriendsArray = nonFriends()
        setAddFriendsList(nonFriendsArray)
    }
       return () => {
      mounted = false;
    }
    },[allProfiles, existingFriendsArray, existingFriends])

  const nonFriends =  () => {
    if (user) {
      if (existingFriendsArray && existingFriendsArray.length > 0) {
        const profiles = allProfiles.filter((profile) => {
     return !existingFriendsArray.includes(profile.userId) && profile.userId !== user.uid
    }).map((profile) => {
      return <FriendProfileItem key={allProfiles.indexOf(profile)} profile={profile} list="add" setExistingFriendsArray={ setExistingFriendsArray}/>
    })
    return profiles
      } else {
        const profiles = allProfiles.map((profile) => {
      return <FriendProfileItem key={allProfiles.indexOf(profile)}  profile={profile} list="add" setExistingFriendsArray={ setExistingFriendsArray}/>
        })
        return profiles
      }
    } else {
      return [<p>Oops, somethign went wrong</p>]
    }
  }




  return ( user ?
    <div className='pages-Div'>
      <div className="list_title">
        <h2>Your friends</h2>
      </div>
      {existingFriends.length > 0 ?
        existingFriends.map((profile) => {
          return (
            <FriendProfileItem key={existingFriends.indexOf(profile) }profile={profile} list="friends" setExistingFriendsArray={ setExistingFriendsArray}/>
          )
        })
        : <p>No friends yet</p>
      }
      <div className="list_title">
        <h2>Add new friends</h2>
      </div>
      <div>
        <Search placeholder="input search text" allowClear /*onSearch={onSearch}*/ style={{ width: 200 }} />
      {addFriendsList}
      </div>
    </div>
  : <p>not ready</p>
  )
}

export default Friends;
