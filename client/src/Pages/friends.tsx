import { Input } from 'antd';
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
  const [searchInput, setSearchInput] = useState('');
  const [filteredProfiles, setfilteredProfiles] = useState<IUserProfile[]>([]);
  const setSearchValue = (event: React.ChangeEvent<HTMLInputElement>) => {
    console.log('event', event);
    setSearchInput(event.target.value)
  };
  const filteredList = filteredProfiles && filteredProfiles.filter(profile => {
    return (profile.name.toLowerCase().includes(searchInput.toLocaleLowerCase()) || profile.surname.toLowerCase().includes(searchInput.toLowerCase())) && (!existingFriendsArray.includes(profile.userId))
  });

  async function setStates() {
    await setAllProfilesArray()
    await setfriendsIDArray()
  }

  async function setAllProfilesArray() {
    if (user) {
      const allProfilesArray = await getAllProfiles();
      if (allProfilesArray) {
      setAllProfiles(allProfilesArray)
        setfilteredProfiles(allProfilesArray.filter((profile) => {
       console.log(existingFriendsArray)
       return(profile.userId !== user.uid)
     }))
      }

   }
  }

  async function setfriendsIDArray() {
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
    setExistingFriends(friendsArray)
} else {
    setExistingFriends([])
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
      <div style={{width:"90%", display:"flex", justifyContent:"flex-end"}}>
        <Input placeholder="Search..." allowClear onChange={setSearchValue} style={{ width: "35vw",  marginBottom: "1em" }} />
        </div>
        {filteredList.map((profile) => {
      return <FriendProfileItem key={allProfiles.indexOf(profile)} profile={profile} list="add" setExistingFriendsArray={setExistingFriendsArray} />
    })}

    </div>
  : <p>not ready</p>
  )
}

export default Friends;
