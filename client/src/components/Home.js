import React from "react";
import FoodItem from "./FoodItem";

const Home = ({food}) => {
    const displayFood = food.map(dish => {
        return <FoodItem key = {dish.id} />

    })
    return(
        <div>
            {displayFood}
        </div>
    )

}

export default Home