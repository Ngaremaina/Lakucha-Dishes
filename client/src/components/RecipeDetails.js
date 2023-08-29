import React from "react";
import { useParams } from "react-router-dom";
import DetailsItem from "./DetailsItem";

const RecipeDetails = ({getSearch, recipes}) => {
    const { label } = useParams()
    getSearch(label)
    const displayRecipes = recipes?.map(data => {    
        return <DetailsItem key ={data.recipe.calories}calories = {data.recipe.calories} image = {data.recipe.image} label = {data.recipe.label} source = {data.recipe.source} dishType={data.recipe.dishType} mealType = {data.recipe.mealType} ingredientLines={data.recipe.ingredientLines}/>
    })
    return(
        <div>
            {displayRecipes}
        </div>
    )


}

export default RecipeDetails