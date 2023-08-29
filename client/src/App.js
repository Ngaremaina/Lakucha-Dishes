import './App.css';
import { useEffect, useState } from 'react';
import { Route, Routes } from 'react-router-dom';
import Home from './components/Home';
import Profile from './components/Profile';
import Signup from './components/Signup';
import Login from './components/Login';
import DetailsPage from './components/DetailsPage';
import NavBar from './components/NavBar';
import Recipes from './components/Recipes';
import { fetchData } from './components/service';
import RecipeDetails from './components/RecipeDetails';

function App() {
  const [food, setFood] = useState([])
  const [recipes, setRecipes] =  useState([])
  const [searchterm, setSearchterm] = useState("")

  useEffect(() => {
    const fetching = async () => {
      const response = await fetch("/")
      const data = response.json()
      return setFood(data)
    } 
    // fetching()

  },[])

  useEffect(() => {
    fetchData(searchterm)
    .then(data => setRecipes(data.hits))
  },[searchterm])

  const getSearch = (search) => {
    return setSearchterm(search)
    
  }

  console.log(recipes)


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
        <Route path = '/recipes' element = {<Recipes recipes = {recipes} getSearch={getSearch}/>}></Route>
        <Route path='/recipes/:label' element ={<RecipeDetails recipes = {recipes} getSearch={getSearch}/>}></Route>
      </Routes>
    </div>
    
  );
}

export default App;
