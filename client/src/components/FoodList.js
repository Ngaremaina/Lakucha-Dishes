import React from "react";
import FoodItem from "./FoodItem";

const FoodList = ({products, handleAddtoCart}) => {
    
    const displayFood = products?.map(food => {
        return <FoodItem key = {food.id} name = {food.name} image = {food.image} description={food.description} price={food.price} handleAddtoCart={handleAddtoCart}/>
    })
    return(
        <div className="row row-cols-1 row-cols-md-2 g-4">
            {displayFood}
        </div>
        
    )

}

export default FoodList