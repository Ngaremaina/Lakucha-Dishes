import './App.css';
import { useEffect, useState } from 'react';
import { Route, Routes } from 'react-router-dom';
import Home from './components/Home';
import Profile from './components/Profile';
import Signup from './components/Signup';
import Login from './components/Login';

function App() {
  const [food, setFood] = useState([])
  useEffect(() => {
    const fetching = async () => {
      const response = await fetch("/")
      const data = response.json()
      return setFood(data)
    } 
    // fetching()

  },[])
  return (
    <div>
      <Routes>
        <Route path='/' element = {<Home food = {food}/>}></Route>
        <Route path='/profile' element = {<Profile />}></Route>
        <Route path='/register' element = {<Signup />}></Route>
        <Route path='/login' element = {<Login />}></Route>
      </Routes>
    </div>
    
  );
}

export default App;
