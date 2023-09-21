import React from "react";

const CartItem = ({id, image, description, price, name, handleDelete}) => {
    let count = 0
    const handleCount = () => {
        count = count + 1
        // console.log(count)
        return count
    }
    console.log(handleCount())
    // console.log(count)
    return(
        <div className="row border-top border-bottom">
            <div className="row main align-items-center">
            <div className="col-2"><img className="img-fluid" src={image} /></div>
            <div className="col">
                <div className="row text-muted">{name}</div>
                <div className="row">{description.substring(0,50)}...</div>
            </div>
            <div className="col">
                <a href="#">-</a><a href="#" className="border">1</a><button onClick={() => handleCount()}>+</button>
            </div>
            <div className="col">Kshs. {price}<button className="close" onClick={() => handleDelete(id)}>✕</button></div>
            </div>
        </div>
    )

}

export default CartItem