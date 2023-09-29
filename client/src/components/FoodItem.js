import React from "react";
import { Link } from "react-router-dom";

const FoodItem = ({image, name, price, description, handleAddtoCart}) => {
    const quantity = 1
    const total = quantity * price

    return(
        <div className="card" style={{width: '19rem', marginLeft:'10px', marginTop:'5px'}}>
            <img src={image} className="card-img-top" alt={name} style={{height: '15rem'}}/>
            <div className="card-body">
                <h5 className="card-title">{name.substring(0,21)}...</h5>
                <p className="card-text">{description.substring(0,90)}...</p>
                <p className="card-text d-flex justify-content-center" style={{color: "#E94F37"}}>Kshs. {price}</p>
                <div className="mt-2 gap-3">
                    <Link className="btn mx-3" style = {{color:"#F6F7EB", backgroundColor:"#5C415D"}} to={`/${name}`}>Buy Now</Link>
                    <button className="btn" style = {{color:"#F6F7EB", backgroundColor:"#5C415D"}} onClick={() => handleAddtoCart(name, price, description, image, quantity, total)}>Add to Cart</button>
                </div>
                
            </div>
        </div>
    )
}

export default FoodItem