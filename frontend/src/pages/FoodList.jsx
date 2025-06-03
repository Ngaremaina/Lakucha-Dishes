import FoodItem from "../components/cards/FoodItem";
import { useGlobal } from "../context/GlobalContext";

const FoodList = () => {  
    const { products } = useGlobal()  
    const displayFood = products?.map(food => {
        return <FoodItem 
                    key = {food.id} 
                    name = {food.name} 
                    image = {food.image} 
                    description={food.description} 
                    price={food.price} />
    })
    return(
        <div className="sm:px-2 md:grid grid-cols-3 gap-x-2 lg:grid-cols-4">
            {displayFood}
        </div>
        
    )

}

export default FoodList