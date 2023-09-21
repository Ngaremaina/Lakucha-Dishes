import React from "react";
import { Link } from "react-router-dom";

const FoodItem = ({image, name, price, rate, description}) => {

    return(
        <div className="card" style={{width: '18rem', marginLeft:'5px', marginTop:'3px'}}>
            <img src={image} className="card-img-top" alt={name} style={{height: '15rem'}}/>
            <div className="card-body">
                <h5 className="card-title">{name}</h5>
                <p className="card-text">{description.substring(0,90)}...</p>
                <p className="card-text">Kshs. {price}</p>
                {/* <i className="fa-solid fa-star">{rate}</i> */}
                <div className="mt-2 gap-3">
                    <Link className="btn btn-primary mx-3" to={`/${name}`}>Buy Now</Link>
                    <Link className="btn btn-primary">Add to Cart</Link>
                </div>
                
            </div>
        </div>
    )
}

export default FoodItem