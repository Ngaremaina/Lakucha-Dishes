import React from "react";
import FoodItem from "./FoodItem";

const FoodList = ({products, fetchCategory}) => {
    var rating = 0
    const displayFood = products?.map(food => {
        food.rating?.map(rate => {
            rating = rate.rate
            return rating
        })
        return <FoodItem key = {food.id} name = {food.name} image = {food.image} description={food.description} price={food.price} rate={rating}/>
    })
    return(
        <div>
            <div class="btn-group" role="group" aria-label="Basic example">
                <button type="button" class="btn btn-primary" onClick={() => fetchCategory("Breakfast")}>Breakfast</button>
                <button type="button" class="btn btn-primary" onClick={() => fetchCategory("Lunch")}>Lunch</button>
                <button type="button" class="btn btn-primary" onClick={() => fetchCategory("Dinner")}>Dinner</button>
            </div>
            <div className="row row-cols-1 row-cols-md-2 g-4">
                {displayFood}

            </div>
        </div>
    )

}

export default FoodList