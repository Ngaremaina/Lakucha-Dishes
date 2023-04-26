import React from "react";
import { Card, Button } from "react-bootstrap";

function FoodItem({name, description, image, price}){

    return(
        <Card className ="text-white border-dark bg-dark mb-3" style={{width :"19rem", margin: "8px"}}>
        <img className = "card-img-top" src={image} alt="Food"/>
        <div className="card-body">
            <h5 className="card-title">{name}</h5>
            <p className="card-text">Kshs. {price}</p>
            <p className="card-text"><small>{description}</small></p>
            <div className="card-footer mt-6">
                <Button type="button" id ="addToCart" className="btn btn-primary mt-64">Add to Cart</Button>
            </div>      
        </div>  
    </Card>      
    )
}

export default FoodItem