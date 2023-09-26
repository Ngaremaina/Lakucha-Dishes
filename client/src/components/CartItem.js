import React from "react";

const CartItem = ({id, image, description, price, name, handleDelete}) => {
    let count = 1
    // let text = document.getElementById("number")
    // console.log(text)
    let result = 1
    
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
                    let text = document.getElementById("number")
                    let total = document.getElementById("total")
                    if (text.innerText <= 1){
                        text.innerText = 1
                        console.log(price * count)
                        result = count * price
                        total.innerText = count * price
                        
                    }
                    else{
                        count = count - 1
                        text.innerText = count
                        result = count * price 
                        total.innerText = price * count

                    }
                    console.log(result)                     
                }}>-</button>
                <p className="my-2" id = "number">1</p>
                <button className="px-2 btn mx-3" onClick={() => {
                    let text = document.getElementById("number")
                    let total = document.getElementById("total")
                    count = count + 1
                    text.innerText = count
                    total.innerText = price  * count

                }}>+</button>
                </div>
                
            </div>
            <div className="col"><div className="row"><p className="mt-3" >Kshs. <span id="total">{price}</span></p><button className="close" onClick={() => handleDelete(id)}>✕</button></div></div>
            </div>
        </div>
    )
}

export default CartItem