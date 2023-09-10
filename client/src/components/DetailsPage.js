import React, { useState } from "react";
import { useParams, Link, useSearchParams } from "react-router-dom";
import DetailsItem from "./DetailsItem";

const DetailsPage = ({getProduct, product}) => {
    var category = ""
    var rating = 0
    const {name} = useParams()
    getProduct(name)

    product.category?.map(category => {category = category.name })
    product.rating?.map(rate => {rating = rate.rate})
    
    
    return(
        <DetailsItem key = {product.id} name = {product.name} image = {product.image} description={product.description} price={product.price} category={category} rate = {rating} />
    )

}

export default DetailsPage