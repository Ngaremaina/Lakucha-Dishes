import React, { useEffect, useState } from "react";
import NavHeader from "./Navbar";
import Home from "./Home";
import Recipes from "./Recipes";
import Menu from "./Menu";
import Contact from "./Contact";
import { fetchData } from "./service";
import { Routes, Route } from "react-router-dom"

const Main = () => {
    const [foods, setFoods] = useState([])
    const [searchterm, setSearchTerm] = useState("")
    const [recipes, setRecipes] =  useState([])

    useEffect(() => {
        fetch("/foods")
        .then(res => { if (res.status === 200){ res.json() } })
        .then(data => setFoods(data))
    },[])

    useEffect(() => {
        fetchData(searchterm)
        .then(res => res.json())
        .then(data => setRecipes(data.hits))
    }, [searchterm])

    const getSearch = (search) =>{
        return setSearchTerm(search)
    }
    
    return(
        <div>
            <NavHeader />
            <Routes>
                <Route path = "/" element = {<Home foods = {foods}/>}></Route>
                <Route path = "/menu" element = {<Menu />}></Route>
                <Route path = "/recipes" element = {<Recipes getSearch = {getSearch} recipes = {recipes}/>}></Route>
                <Route path = "/contact" element = {<Contact />}></Route>
            </Routes>
        </div>
    )

}

export default Main