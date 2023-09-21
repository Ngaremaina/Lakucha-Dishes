import React from "react";

const CartItem = ({id, image, description, price, name, handleDelete}) => {
    let count = 0
    let text = document.getElementById("number")
    const handleAddCount = () => {
        count = count + 1
        text.textContent = count
    }
    const handleRemoveCount =() => {
        if (count === 1 || count <= 0){
            text.textContent =  1
        }
        else{
            count = count - 1
            text.textContent = count
        }   
    }
   
    return(
        <div className="row border-top border-bottom">
            <div className="row main align-items-center">
            <div className="col-2"><img className="img-fluid" src={image} alt={name} /></div>
            <div className="col">
                <div className="row text-muted">{name}</div>
                <div className="row">{description.substring(0,50)}...</div>
            </div>
            <div className="col">
                <div className="row p-4">
                <button className="px-2 btn mx-3" onClick={() => handleRemoveCount()}>-</button>
                <p className="my-2" id = "number">1</p>
                <button className="px-2 btn mx-3" onClick={() => handleAddCount()}>+</button>
                </div>
                
            </div>
            <div className="col">Kshs. {price}<button className="close" onClick={() => handleDelete(id)}>✕</button></div>
            </div>
        </div>
    )

}

export default CartItem