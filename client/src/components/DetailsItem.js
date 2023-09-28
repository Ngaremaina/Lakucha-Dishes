import React from "react";
import { Link } from "react-router-dom";

const DetailsItem = ({image, category, name, price, description, rate, handleAddtoCart}) => {
    const quantity = 1
    const total = quantity * price
    return(
        <div className="container my-5 py-2">
        <div className="row">
          <div className="col-md-6 col-sm-12 py-3">
            <img className="img-fluid" src={image} alt={name} width="500px" height="500px" />
          </div>
          <div className="col-md-6 col-md-6 py-5">
            <h4 className="text-uppercase text-muted">{category}</h4>
            <h1 className="display-5">{name}</h1>
            <h3 className="display-6  my-4">${price}</h3>
            <p className="lead">
              {/* <i className="fa fa-star">{rate}</i> */}
            </p>
           
            <p className="lead">{description}</p>
            <Link to="/mycart" className="btn btn-primary mx-3" onClick={() => handleAddtoCart(name, price, description, image, quantity, total)}>Add to Cart</Link>
          </div>
        </div>
      </div>
    )

}

export default DetailsItem