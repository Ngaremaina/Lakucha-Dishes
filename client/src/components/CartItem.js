import React from "react";

const CartItem = ({id, image, description, price, name, handleDelete, updateCart, quantity, total}) => {
    
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
                <button className="px-2 btn mx-3" onClick={() => {
                    // let text = document.getElementById("number")
                    // let totalPrice = document.getElementById("total")
                    if (quantity <= 1){
                        quantity = 1
                        total = quantity * price
                        // totalPrice.innerText = total
                        updateCart(id, name, price, description, image, total, quantity)
                    }
                    else{
                        quantity = quantity - 1
                        // text.innerText = quantity
                        total = quantity * price 
                        // totalPrice.innerText = total
                        updateCart(id, name, price, description, image, total, quantity)
                    }

                }}>-</button>
                <p className="my-2" id = "number">{quantity}</p>
                <button className="px-2 btn mx-3" onClick={() => {
                    // let text = document.getElementById("number")
                    // let totalPrice = document.getElementById("total")
                    quantity = quantity + 1
                    // text.innerText = quantity
                    total = quantity * price
                    updateCart(id, name, price, description, image, total, quantity)
                    // totalPrice.innerText = total


                }}>+</button>
                </div>
                
            </div>
            <div className="col"><div className="row"><p className="mt-3" >Kshs. <span id="total">{total}</span></p><button className="close" onClick={() => handleDelete(id)}>✕</button></div></div>
            </div>
        </div>
    )
}

export default CartItem