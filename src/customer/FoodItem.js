import React from "react";
import { Card, Button } from "react-bootstrap";

function FoodItem({name, description, image, price}){

    return(
        <Card className ="text-white border-dark bg-dark mb-3" style={{width :"15rem", margin: "5px"}}>
        <img className = "card-img-top img-fluid" src={image} alt="Food"style={{maxHeight:"502px", maxWidth:"450px"}}/>
        <div className="card-body">
            <h5 className="card-title">{name}</h5>
            <p className="card-text">Kshs. {price}</p>
            <p className="card-text"><small>{description}</small></p>
            <div className="card-footer mt-6">
                <Button type="button" style={{width: "90%"}} className="btn btn-primary position-absolute bottom-0 start-50 translate-middle-x mb-2">Add To Cart</Button>
            </div>      
        </div>  
    </Card>      
    )
}

export default FoodItem