import React from "react";
import CartItem from "./CartItem";
import { Link } from "react-router-dom";

const Cart = ({products, handleDelete}) => {
    // console.log(products)
    const displayCart = products.map(item => {
        // console.log(item)
        return <CartItem key = {item.id} id = {item.id} image = {item.image} description = {item.description} name = {item.name} price = {item.price} handleDelete={handleDelete}/>
    })
    return(
        <div className="card">
            <div className="row">
                <div className="col-md-8 cart">
                <div className="title">
                    <div className="row">
                    <div className="col"><h4><b>Shopping Cart</b></h4></div>
                    <div className="col align-self-center text-right text-muted"></div>
                    </div>
                </div>    
                {displayCart}
                
                <div className="back-to-shop"><Link to = "/">←</Link><span className="text-muted">Back to shop</span></div>
                </div>
                <div className="col-md-4 summary">
                <div><h5><b>Summary</b></h5></div>
                <hr />
                <div className="row">
                    <div className="col" style={{paddingLeft: 0}}>ITEMS </div>
                    <div className="col text-right">Kshs. 132.00</div>
                </div>
                <form>
                    <p>SHIPPING</p>
                    <select><option className="text-muted">Standard-Delivery- Kshs. 250</option></select>
                    <p>GIVE CODE</p>
                    <input id="code" placeholder="Enter your code" />
                </form>
                <div className="row" style={{borderTop: '1px solid rgba(0,0,0,.1)', padding: '2vh 0'}}>
                    <div className="col">TOTAL PRICE</div>
                    <div className="col text-right">Kshs. 137.00</div>
                </div>
                <button className="btn">CHECKOUT</button>
                </div>
            </div>
        </div>

    )

}

export default Cart