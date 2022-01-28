import { Button } from 'antd';
import React from 'react';
import { useNavigate } from 'react-router-dom';

const Home: React.FC = () => {
const navigate = useNavigate()
  return <div>
<Button onClick={()=>{navigate('/createworkout')}}>Create a new workout</Button>
  </div>;
}

export default Home;