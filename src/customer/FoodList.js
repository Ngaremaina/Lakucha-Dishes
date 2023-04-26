import React from "react";
import FoodItem from "./FoodItem";

function FoodList({foods}){
    const displayFoods = foods.map(food => {
        return <FoodItem key={food.name} description = {food.description} name = {food.name} image = {food.imageUrl} price = {food.price} />
    })

    return (
        <div className="card-deck col d-flex p-3 justify-content-center">
            {displayFoods}
        </div>
    )

}

export default FoodList