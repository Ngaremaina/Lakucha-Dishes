import React from "react";
import FoodItem from "./FoodItem";

const FoodList = ({products}) => {
    var rating = 0
    const displayFood = products?.map(food => {
        food.rating?.map(rate => {
            rating = rate.rate
        })
        return <FoodItem key = {food.id} name = {food.name} image = {food.image} description={food.description} price={food.price} rate={rating}/>
    })
    return(

        <div className="row row-cols-1 row-cols-md-2 g-4">
            <div className="col">
                {displayFood}
            </div>
        </div>

    )

}

export default FoodList