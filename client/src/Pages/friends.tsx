import { Input } from 'antd';
import Search from 'antd/lib/input/Search';
import React, { useEffect, useState } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import FriendProfileItem from '../Components/friendProfileItem';
import LoadingContent from '../Components/loadingContent';
import { IUserProfile } from '../interfaces';
import AuthService from '../Services/authService';
import { getAllProfiles, getUserFriends } from '../Services/friendsService';



const Friends: React.FC = () => {
  const [user] = useAuthState(AuthService.auth);
  const [existingFriends, setExistingFriends] = useState<IUserProfile[] | null>(null);
  const [existingFriendsArray, setExistingFriendsArray] = useState<string[] | null>(null);
  const [allProfiles, setAllProfiles] = useState<IUserProfile[]>([]);
  const [searchInput, setSearchInput] = useState('');
  const [filteredProfiles, setfilteredProfiles] = useState<IUserProfile[]>([]);
  const [isReady, setIsReady] = useState<boolean>(false);

  const setSearchValue = (event: React.ChangeEvent<HTMLInputElement>) => {
    console.log('event', event);
    setSearchInput(event.target.value)
  };
  const filteredList = filteredProfiles && filteredProfiles.filter(profile => {
    return (profile.name.toLowerCase().includes(searchInput.toLocaleLowerCase()) || profile.surname.toLowerCase().includes(searchInput.toLowerCase())) && (existingFriendsArray && !existingFriendsArray.includes(profile.userId))
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
if (existingFriendsArray && existingFriendsArray.length > 0) {
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

  return (
    <div className='pages-Div'>
      <div className="list_title">
        <h2>Your friends</h2>
      </div>
      <div style={{minHeight: "180px"}}>
         {!existingFriendsArray || !existingFriends ? <LoadingContent /> : null }
      {existingFriends && existingFriends.length > 0 ?
        existingFriends.map((profile) => {
          return (
            <FriendProfileItem key={existingFriends.indexOf(profile) }profile={profile} list="friends" setExistingFriendsArray={ setExistingFriendsArray}/>
          )
        })
        : null
      }
      {existingFriendsArray && existingFriendsArray.length === 0 ? <p>No friends yet</p> : null}
      </div>

      <div className="list_title">
        <h2>Add new friends</h2>
      </div>
      <div style={{width:"90%", display:"flex", justifyContent:"flex-end"}}>
        <Input placeholder="Search..." allowClear onChange={setSearchValue} style={{ width: "35vw",  marginBottom: "1em" }} />
        </div>
      {filteredProfiles.length > 0 ?
        filteredList.map((profile) => {
      return <FriendProfileItem key={allProfiles.indexOf(profile)} profile={profile} list="add" setExistingFriendsArray={setExistingFriendsArray} />
        })
  : <LoadingContent />}

    </div>
  )
}

export default Friends;
