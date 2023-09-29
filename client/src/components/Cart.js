import React,{useState, useEffect} from "react";
import CartItem from "./CartItem";
import { Link } from "react-router-dom";


const Cart = () => {
    const [products, setProduct] = useState([])
    let allPrices = []
    let allitems = []
  
    useEffect(() => {
        getCart()
    },[])
    const getCart = async () => {      
          const response = await fetch("/cart")
          const data = await response.json()
          return setProduct(data)
    }
      
   
    function updateCart(id, name, price, description, image, total, quantity){
        let product = {
            name:name,
            price:price,
            description:description,
            quantity:quantity,
            image:image,
            total:total
        }
        fetch(`/cart/${id}`,{
            method:"PATCH",
            headers: {"Content-Type": "application/json"},
            body:JSON.stringify(product)
        })
        .then(response => {
            if (response.status === 200){
                getCart()
                response.json()
            }
        })        
    }

    const handleDelete = (id) => {
        fetch(`/cart/${id}`,{
          method:"DELETE",
          headers:{"Content-Type":"application/json", "Accept": "application"},
        })
        .then(response => {
            if (response.status === 200){
                getCart()
                response.json()
            }
        })
      }
    
    const displayCart = products.map(item => {
        allPrices.push(item.total)
        allitems.push(item.id)
        return <CartItem key = {item.id} id = {item.id} image = {item.image} description = {item.description} name = {item.name} price = {item.price} handleDelete={handleDelete} updateCart = {updateCart} quantity={item.quantity} total = {item.total}/>
    })
    let grandPrice = 0
    let totalitems = 0
    const grandTotal = allPrices.reduce((accumulator, currentValue) => accumulator + currentValue, grandPrice)
    const totalPrice =  grandTotal + 250
    const granditems = allitems.reduce((accumulator, currentValue) => accumulator + currentValue, totalitems)

    
    // addSales(granditems,totalPrice, name)


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
                    <div className="row">Kshs. <p className="px-2">{grandTotal}</p></div>
                </div>
                <form>
                    <p>SHIPPING</p>
                    <select><option className="text-muted">Standard-Delivery- Kshs. 250</option></select>
                </form>
                <div className="row" style={{borderTop: '1px solid rgba(0,0,0,.1)', padding: '2vh 0'}}>
                    <div className="col">TOTAL PRICE</div>
                    <div className="row">Kshs. <p className="px-2">{totalPrice}</p></div>
                </div>
                <Link to="/checkout" className="btn">CHECKOUT</Link>
                </div>
            </div>
        </div>

    )

}

export default Cart