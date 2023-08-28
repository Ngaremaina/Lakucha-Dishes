import './App.css';
import { useEffect, useState } from 'react';
import { Route, Routes } from 'react-router-dom';
import Home from './components/Home';
import Profile from './components/Profile';
import Signup from './components/Signup';
import Login from './components/Login';
import DetailsPage from './components/DetailsPage';
import NavBar from './components/NavBar';

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

  const getProduct = (name) => {
    fetch(`/products/${name}`)
    .then(res => res.json())
    .then(data => setFood(data))
  }
  return (
    <div>
      <NavBar />
      <Routes>
        <Route path='/' element = {<Home food = {food}/>}></Route>
        <Route path='/profile' element = {<Profile />}></Route>
        <Route path='/register' element = {<Signup />}></Route>
        <Route path='/login' element = {<Login />}></Route>
        <Route path = '/:name' element = {<DetailsPage getProduct={getProduct}/>}></Route>
      </Routes>
    </div>
    
  );
}

export default App;
