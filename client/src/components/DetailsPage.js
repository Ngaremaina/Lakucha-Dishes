import React from "react";
import { useParams } from "react-router-dom";
import DetailsItem from "./DetailsItem";

const DetailsPage = ({getProduct, product, handleAddtoCart}) => {
    var group = ""
    var rating = 0
    const {name} = useParams()
    getProduct(name)

    // product.category?.map(cat => {group = cat.name })
    // product.rating?.map(rate => {rating = rate.rate})
    
    
    return(
        <DetailsItem key = {product.id} name = {product.name} image = {product.image} description={product.description} price={product.price} category={group} rate = {rating} handleAddtoCart = {handleAddtoCart} />
    )

}

export default DetailsPage